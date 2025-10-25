const express = require('express');
const Monastery = require('../models/Monastery');
const { auth, optionalAuth } = require('../middleware/auth');
const router = express.Router();

// @route   GET /api/monasteries
// @desc    Get all monasteries
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const {
      search,
      tradition,
      district,
      featured,
      sort = 'name',
      page = 1,
      limit = 10,
      lat,
      lng,
      radius = 50 // km
    } = req.query;

    let query = { status: 'active' };

    // Search functionality
    if (search) {
      query.$text = { $search: search };
    }

    // Filter by tradition
    if (tradition) {
      query.tradition = tradition;
    }

    // Filter by district
    if (district) {
      query['location.district'] = district;
    }

    // Filter featured
    if (featured === 'true') {
      query.featured = true;
    }

    // Location-based search
    if (lat && lng) {
      query['location.coordinates'] = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: radius * 1000 // Convert km to meters
        }
      };
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: sort === 'distance' && lat && lng ? {} : { [sort]: 1 },
      populate: {
        path: 'reviews.user',
        select: 'name avatar'
      }
    };

    let monasteries;
    if (search) {
      // Use text search
      monasteries = await Monastery.find(query, { score: { $meta: 'textScore' } })
        .sort({ score: { $meta: 'textScore' } })
        .limit(parseInt(limit))
        .skip((parseInt(page) - 1) * parseInt(limit))
        .populate('reviews.user', 'name avatar');
    } else {
      monasteries = await Monastery.find(query)
        .sort(options.sort)
        .limit(parseInt(limit))
        .skip((parseInt(page) - 1) * parseInt(limit))
        .populate('reviews.user', 'name avatar');
    }

    const total = await Monastery.countDocuments(query);

    res.json({
      monasteries,
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

// @route   GET /api/monasteries/:id
// @desc    Get monastery by ID
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const monastery = await Monastery.findById(req.params.id)
      .populate('reviews.user', 'name avatar');

    if (!monastery) {
      return res.status(404).json({ message: 'Monastery not found' });
    }

    res.json(monastery);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/monasteries/:id/review
// @desc    Add a review to monastery
// @access  Private
router.post('/:id/review', auth, async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const monastery = await Monastery.findById(req.params.id);
    if (!monastery) {
      return res.status(404).json({ message: 'Monastery not found' });
    }

    // Check if user already reviewed
    const existingReview = monastery.reviews.find(
      review => review.user.toString() === req.user.id
    );

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this monastery' });
    }

    // Add review
    monastery.reviews.push({
      user: req.user.id,
      rating,
      comment
    });

    // Update average rating
    const totalRatings = monastery.reviews.length;
    const sumRatings = monastery.reviews.reduce((sum, review) => sum + review.rating, 0);
    monastery.ratings.average = sumRatings / totalRatings;
    monastery.ratings.count = totalRatings;

    await monastery.save();

    res.json({ message: 'Review added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/monasteries/:id/favorite
// @desc    Add/remove monastery from favorites
// @access  Private
router.post('/:id/favorite', auth, async (req, res) => {
  try {
    const user = req.user;
    const monasteryId = req.params.id;

    const monastery = await Monastery.findById(monasteryId);
    if (!monastery) {
      return res.status(404).json({ message: 'Monastery not found' });
    }

    const isFavorite = user.favoriteMonasteries.includes(monasteryId);

    if (isFavorite) {
      // Remove from favorites
      user.favoriteMonasteries = user.favoriteMonasteries.filter(
        id => id.toString() !== monasteryId
      );
      await user.save();
      res.json({ message: 'Removed from favorites', isFavorite: false });
    } else {
      // Add to favorites
      user.favoriteMonasteries.push(monasteryId);
      await user.save();
      res.json({ message: 'Added to favorites', isFavorite: true });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/monasteries/:id/nearby
// @desc    Get nearby monasteries
// @access  Public
router.get('/:id/nearby', async (req, res) => {
  try {
    const monastery = await Monastery.findById(req.params.id);
    if (!monastery) {
      return res.status(404).json({ message: 'Monastery not found' });
    }

    const { radius = 25 } = req.query; // Default 25km radius

    const nearbyMonasteries = await Monastery.find({
      _id: { $ne: monastery._id },
      status: 'active',
      'location.coordinates': {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [
              monastery.location.coordinates.lng,
              monastery.location.coordinates.lat
            ]
          },
          $maxDistance: radius * 1000
        }
      }
    }).limit(5);

    res.json(nearbyMonasteries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/monasteries/stats/overview
// @desc    Get monasteries statistics
// @access  Public
router.get('/stats/overview', async (req, res) => {
  try {
    const stats = await Monastery.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          avgRating: { $avg: '$ratings.average' },
          totalReviews: { $sum: '$ratings.count' }
        }
      }
    ]);

    const traditionStats = await Monastery.aggregate([
      {
        $group: {
          _id: '$tradition',
          count: { $sum: 1 }
        }
      }
    ]);

    const districtStats = await Monastery.aggregate([
      {
        $group: {
          _id: '$location.district',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      overview: stats[0] || { total: 0, avgRating: 0, totalReviews: 0 },
      byTradition: traditionStats,
      byDistrict: districtStats
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;