const express = require('express');
const Festival = require('../models/Festival');
const { auth, optionalAuth, adminAuth } = require('../middleware/auth');
const router = express.Router();

// @route   GET /api/festivals
// @desc    Get all festivals
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const {
      monastery,
      category,
      status = 'upcoming',
      month,
      year,
      featured,
      page = 1,
      limit = 10
    } = req.query;

    let query = {};

    // Filter by monastery
    if (monastery) {
      query.monastery = monastery;
    }

    // Filter by category
    if (category) {
      query.categories = { $in: [category] };
    }

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Filter by month/year
    if (month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);
      query['dates.start'] = { $gte: startDate, $lte: endDate };
    } else if (year) {
      const startDate = new Date(year, 0, 1);
      const endDate = new Date(year, 11, 31);
      query['dates.start'] = { $gte: startDate, $lte: endDate };
    }

    // Filter featured
    if (featured === 'true') {
      query.featured = true;
    }

    const festivals = await Festival.find(query)
      .populate('monastery', 'name location images')
      .sort({ 'dates.start': 1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Festival.countDocuments(query);

    res.json({
      festivals,
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

// @route   GET /api/festivals/:id
// @desc    Get festival by ID
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const festival = await Festival.findById(req.params.id)
      .populate('monastery', 'name location images contact')
      .populate('attendees.user', 'name avatar');

    if (!festival) {
      return res.status(404).json({ message: 'Festival not found' });
    }

    res.json(festival);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/festivals/:id/register
// @desc    Register for a festival
// @access  Private
router.post('/:id/register', auth, async (req, res) => {
  try {
    const festival = await Festival.findById(req.params.id);
    
    if (!festival) {
      return res.status(404).json({ message: 'Festival not found' });
    }

    // Check if already registered
    const isRegistered = festival.attendees.some(
      attendee => attendee.user.toString() === req.user.id
    );

    if (isRegistered) {
      return res.status(400).json({ message: 'Already registered for this festival' });
    }

    // Check capacity
    if (festival.capacity.total && festival.capacity.current >= festival.capacity.total) {
      return res.status(400).json({ message: 'Festival is full' });
    }

    // Add attendee
    festival.attendees.push({
      user: req.user.id
    });

    // Update current capacity
    festival.capacity.current = festival.attendees.length;

    await festival.save();

    res.json({ message: 'Successfully registered for festival' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/festivals/:id/register
// @desc    Unregister from a festival
// @access  Private
router.delete('/:id/register', auth, async (req, res) => {
  try {
    const festival = await Festival.findById(req.params.id);
    
    if (!festival) {
      return res.status(404).json({ message: 'Festival not found' });
    }

    // Remove attendee
    festival.attendees = festival.attendees.filter(
      attendee => attendee.user.toString() !== req.user.id
    );

    // Update current capacity
    festival.capacity.current = festival.attendees.length;

    await festival.save();

    res.json({ message: 'Successfully unregistered from festival' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/festivals/:id/livestream
// @desc    Get livestream info for festival
// @access  Public
router.get('/:id/livestream', async (req, res) => {
  try {
    const festival = await Festival.findById(req.params.id)
      .select('livestream name dates');

    if (!festival) {
      return res.status(404).json({ message: 'Festival not found' });
    }

    if (!festival.livestream.isAvailable) {
      return res.status(404).json({ message: 'Livestream not available for this festival' });
    }

    res.json({
      streamUrl: festival.livestream.streamUrl,
      scheduledStreams: festival.livestream.scheduledStreams,
      festival: {
        name: festival.name,
        dates: festival.dates
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/festivals/upcoming/featured
// @desc    Get featured upcoming festivals
// @access  Public
router.get('/upcoming/featured', async (req, res) => {
  try {
    const festivals = await Festival.find({
      status: 'upcoming',
      featured: true,
      'dates.start': { $gte: new Date() }
    })
    .populate('monastery', 'name location images')
    .sort({ 'dates.start': 1 })
    .limit(6);

    res.json(festivals);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/festivals/calendar/:year/:month
// @desc    Get festivals for calendar view
// @access  Public
router.get('/calendar/:year/:month', async (req, res) => {
  try {
    const { year, month } = req.params;
    
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const festivals = await Festival.find({
      $or: [
        {
          'dates.start': { $gte: startDate, $lte: endDate }
        },
        {
          'dates.end': { $gte: startDate, $lte: endDate }
        },
        {
          'dates.start': { $lte: startDate },
          'dates.end': { $gte: endDate }
        }
      ]
    })
    .populate('monastery', 'name')
    .sort({ 'dates.start': 1 });

    res.json(festivals);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin routes

// @route   POST /api/festivals
// @desc    Create festival
// @access  Admin
router.post('/', auth, adminAuth, async (req, res) => {
  try {
    const festival = new Festival(req.body);
    await festival.save();
    
    await festival.populate('monastery', 'name location');
    res.status(201).json(festival);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/festivals/:id
// @desc    Update festival
// @access  Admin
router.put('/:id', auth, adminAuth, async (req, res) => {
  try {
    const festival = await Festival.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('monastery', 'name location');

    if (!festival) {
      return res.status(404).json({ message: 'Festival not found' });
    }

    res.json(festival);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/festivals/:id
// @desc    Delete festival
// @access  Admin
router.delete('/:id', auth, adminAuth, async (req, res) => {
  try {
    const festival = await Festival.findByIdAndDelete(req.params.id);

    if (!festival) {
      return res.status(404).json({ message: 'Festival not found' });
    }

    res.json({ message: 'Festival deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;