const express = require('express');
const Guide = require('../models/Guide');
const { auth, optionalAuth, guideAuth } = require('../middleware/auth');
const router = express.Router();

// @route   GET /api/guides
// @desc    Get all guides
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const {
      location,
      specialty,
      language,
      minRating,
      maxRate,
      available,
      page = 1,
      limit = 10
    } = req.query;

    let query = { status: 'active', 'verification.isVerified': true };

    // Filter by specialty
    if (specialty) {
      query.services = { $in: [specialty] };
    }

    // Filter by language
    if (language) {
      query['profile.languages'] = { $in: [language] };
    }

    // Filter by minimum rating
    if (minRating) {
      query['ratings.average'] = { $gte: parseFloat(minRating) };
    }

    // Filter by maximum rate
    if (maxRate) {
      query['pricing.baseRate'] = { $lte: parseFloat(maxRate) };
    }

    const guides = await Guide.find(query)
      .populate('user', 'name avatar')
      .sort({ featured: -1, 'ratings.average': -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Guide.countDocuments(query);

    res.json({
      guides,
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

// @route   GET /api/guides/:id
// @desc    Get guide by ID
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const guide = await Guide.findById(req.params.id)
      .populate('user', 'name avatar createdAt')
      .populate('coverage.monasteries', 'name location')
      .populate('reviews.user', 'name avatar')
      .populate('reviews.booking', 'createdAt');

    if (!guide) {
      return res.status(404).json({ message: 'Guide not found' });
    }

    res.json(guide);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/guides/:id/review
// @desc    Add review for guide
// @access  Private
router.post('/:id/review', auth, async (req, res) => {
  try {
    const { ratings, comment, bookingId } = req.body;

    const guide = await Guide.findById(req.params.id);
    if (!guide) {
      return res.status(404).json({ message: 'Guide not found' });
    }

    // Check if user already reviewed this guide
    const existingReview = guide.reviews.find(
      review => review.user.toString() === req.user.id
    );

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this guide' });
    }

    // Add review
    guide.reviews.push({
      user: req.user.id,
      booking: bookingId,
      ratings,
      comment
    });

    // Update average ratings
    const reviewCount = guide.reviews.length;
    const totals = guide.reviews.reduce(
      (acc, review) => {
        acc.knowledge += review.ratings.knowledge;
        acc.communication += review.ratings.communication;
        acc.punctuality += review.ratings.punctuality;
        acc.overall += review.ratings.overall;
        return acc;
      },
      { knowledge: 0, communication: 0, punctuality: 0, overall: 0 }
    );

    guide.ratings.breakdown = {
      knowledge: totals.knowledge / reviewCount,
      communication: totals.communication / reviewCount,
      punctuality: totals.punctuality / reviewCount,
      overall: totals.overall / reviewCount
    };

    guide.ratings.average = guide.ratings.breakdown.overall;
    guide.ratings.count = reviewCount;

    await guide.save();

    res.json({ message: 'Review added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/guides/:id/availability
// @desc    Check guide availability
// @access  Public
router.get('/:id/availability', async (req, res) => {
  try {
    const { date, duration = 1 } = req.query;

    const guide = await Guide.findById(req.params.id);
    if (!guide) {
      return res.status(404).json({ message: 'Guide not found' });
    }

    // Check if date is in blackout dates
    const requestDate = new Date(date);
    const isBlackedOut = guide.availability.blackoutDates.some(
      blackoutDate => blackoutDate.toDateString() === requestDate.toDateString()
    );

    if (isBlackedOut) {
      return res.json({ available: false, reason: 'Date unavailable' });
    }

    // Check day of week availability
    const dayOfWeek = requestDate.toLocaleDateString('en-US', { weekday: 'lowercase' });
    const daySchedule = guide.availability.schedule.find(
      schedule => schedule.day === dayOfWeek
    );

    if (!daySchedule || !daySchedule.available) {
      return res.json({ available: false, reason: 'Day not available' });
    }

    // In a real implementation, you'd check existing bookings
    res.json({ 
      available: true, 
      timeSlots: daySchedule.timeSlots.filter(slot => !slot.booked)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Guide management routes

// @route   POST /api/guides
// @desc    Create guide profile
// @access  Private (Guide)
router.post('/', auth, async (req, res) => {
  try {
    // Check if user already has a guide profile
    const existingGuide = await Guide.findOne({ user: req.user.id });
    if (existingGuide) {
      return res.status(400).json({ message: 'Guide profile already exists' });
    }

    const guide = new Guide({
      user: req.user.id,
      ...req.body
    });

    await guide.save();
    await guide.populate('user', 'name avatar');

    res.status(201).json(guide);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/guides/profile
// @desc    Update guide profile
// @access  Private (Guide)
router.put('/profile', auth, guideAuth, async (req, res) => {
  try {
    const guide = await Guide.findOne({ user: req.user.id });
    if (!guide) {
      return res.status(404).json({ message: 'Guide profile not found' });
    }

    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        guide[key] = req.body[key];
      }
    });

    await guide.save();
    await guide.populate('user', 'name avatar');

    res.json(guide);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/guides/my/profile
// @desc    Get my guide profile
// @access  Private (Guide)
router.get('/my/profile', auth, guideAuth, async (req, res) => {
  try {
    const guide = await Guide.findOne({ user: req.user.id })
      .populate('user', 'name avatar email')
      .populate('coverage.monasteries', 'name location')
      .populate('bookings', 'status details.tourDate pricing.totalAmount');

    if (!guide) {
      return res.status(404).json({ message: 'Guide profile not found' });
    }

    res.json(guide);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/guides/stats/overview
// @desc    Get guides statistics
// @access  Public
router.get('/stats/overview', async (req, res) => {
  try {
    const stats = await Guide.aggregate([
      { $match: { status: 'active' } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          avgRating: { $avg: '$ratings.average' },
          avgRate: { $avg: '$pricing.baseRate' }
        }
      }
    ]);

    const specialtyStats = await Guide.aggregate([
      { $match: { status: 'active' } },
      { $unwind: '$services' },
      {
        $group: {
          _id: '$services',
          count: { $sum: 1 }
        }
      }
    ]);

    const languageStats = await Guide.aggregate([
      { $match: { status: 'active' } },
      { $unwind: '$profile.languages' },
      {
        $group: {
          _id: '$profile.languages',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      overview: stats[0] || { total: 0, avgRating: 0, avgRate: 0 },
      bySpecialty: specialtyStats,
      byLanguage: languageStats
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;