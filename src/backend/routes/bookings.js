const express = require('express');
const Booking = require('../models/Booking');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const router = express.Router();

// @route   POST /api/bookings
// @desc    Create a new booking
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const {
      bookingType,
      reference,
      details,
      pricing
    } = req.body;

    const booking = new Booking({
      user: req.user.id,
      bookingType,
      reference,
      details,
      pricing,
      metadata: {
        source: 'web',
        userAgent: req.get('User-Agent'),
        ipAddress: req.ip
      }
    });

    await booking.save();

    // Add to user's booking history
    await User.findByIdAndUpdate(req.user.id, {
      $push: { bookingHistory: booking._id }
    });

    // Populate reference details
    await booking.populate('reference');
    await booking.populate('user', 'name email phone');

    res.status(201).json(booking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/bookings
// @desc    Get user's bookings
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const {
      status,
      bookingType,
      page = 1,
      limit = 10
    } = req.query;

    let query = { user: req.user.id };

    if (status) {
      query.status = status;
    }

    if (bookingType) {
      query.bookingType = bookingType;
    }

    const bookings = await Booking.find(query)
      .populate('reference')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Booking.countDocuments(query);

    res.json({
      bookings,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/bookings/:id
// @desc    Get booking by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('reference')
      .populate('user', 'name email phone');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user owns this booking or is admin
    if (booking.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(booking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/bookings/:id/status
// @desc    Update booking status
// @access  Private
router.put('/:id/status', auth, async (req, res) => {
  try {
    const { status, reason } = req.body;
    
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check permissions
    const canUpdate = booking.user.toString() === req.user.id || 
                     req.user.role === 'admin' ||
                     (req.user.role === 'guide' && booking.bookingType === 'guide') ||
                     (req.user.role === 'host' && booking.bookingType === 'homestay');

    if (!canUpdate) {
      return res.status(403).json({ message: 'Access denied' });
    }

    booking.status = status;

    // Handle cancellation
    if (status === 'cancelled') {
      booking.cancellation = {
        cancelledBy: req.user.role,
        reason,
        cancelledAt: new Date(),
        refundEligible: true // Determine based on cancellation policy
      };
    }

    // Handle confirmation
    if (status === 'confirmed') {
      booking.confirmation.confirmedAt = new Date();
      booking.confirmation.confirmedBy = req.user.id;
    }

    await booking.save();

    res.json(booking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/bookings/:id/message
// @desc    Add message to booking
// @access  Private
router.post('/:id/message', auth, async (req, res) => {
  try {
    const { message } = req.body;
    
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user can message
    const canMessage = booking.user.toString() === req.user.id || 
                      req.user.role === 'admin' ||
                      (req.user.role === 'guide' && booking.bookingType === 'guide') ||
                      (req.user.role === 'host' && booking.bookingType === 'homestay');

    if (!canMessage) {
      return res.status(403).json({ message: 'Access denied' });
    }

    booking.communication.push({
      from: req.user.role,
      message
    });

    await booking.save();

    // Emit real-time notification
    req.io.to(`user-${booking.user}`).emit('new-booking-message', {
      bookingId: booking._id,
      message,
      from: req.user.role
    });

    res.json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/bookings/:id/review
// @desc    Add review to booking
// @access  Private
router.post('/:id/review', auth, async (req, res) => {
  try {
    const { rating, comment, photos } = req.body;
    
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user owns this booking
    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Check if booking is completed
    if (booking.status !== 'completed') {
      return res.status(400).json({ message: 'Can only review completed bookings' });
    }

    // Check if already reviewed
    if (booking.review.rating) {
      return res.status(400).json({ message: 'Booking already reviewed' });
    }

    booking.review = {
      rating,
      comment,
      photos: photos || [],
      reviewedAt: new Date()
    };

    await booking.save();

    res.json({ message: 'Review added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/bookings/stats/dashboard
// @desc    Get booking statistics for dashboard
// @access  Private
router.get('/stats/dashboard', auth, async (req, res) => {
  try {
    const stats = await Booking.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$pricing.totalAmount' }
        }
      }
    ]);

    const recentBookings = await Booking.find({ user: req.user.id })
      .populate('reference', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      stats,
      recentBookings
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;