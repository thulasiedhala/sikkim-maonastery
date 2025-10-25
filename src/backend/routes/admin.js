const express = require('express');
const User = require('../models/User');
const Monastery = require('../models/Monastery');
const Festival = require('../models/Festival');
const Guide = require('../models/Guide');
const Homestay = require('../models/Homestay');
const Product = require('../models/Product');
const Booking = require('../models/Booking');
const { auth, adminAuth } = require('../middleware/auth');
const router = express.Router();

// All routes require admin authentication
router.use(auth, adminAuth);

// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard statistics
// @access  Admin
router.get('/dashboard', async (req, res) => {
  try {
    // Overall statistics
    const userCount = await User.countDocuments();
    const monasteryCount = await Monastery.countDocuments();
    const festivalCount = await Festival.countDocuments();
    const guideCount = await Guide.countDocuments({ status: 'active' });
    const homestayCount = await Homestay.countDocuments({ status: 'active' });
    const productCount = await Product.countDocuments({ status: 'active' });
    const bookingCount = await Booking.countDocuments();

    // Recent activity
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email role createdAt');

    const recentBookings = await Booking.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'name email')
      .populate('reference', 'name');

    // Revenue statistics
    const revenueStats = await Booking.aggregate([
      { $match: { 'payment.status': 'paid' } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$pricing.totalAmount' },
          totalBookings: { $sum: 1 },
          avgBookingValue: { $avg: '$pricing.totalAmount' }
        }
      }
    ]);

    // Monthly booking trends
    const monthlyBookings = await Booking.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 },
          revenue: { $sum: '$pricing.totalAmount' }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 }
    ]);

    // Booking status distribution
    const bookingStatusStats = await Booking.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // User role distribution
    const userRoleStats = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      overview: {
        users: userCount,
        monasteries: monasteryCount,
        festivals: festivalCount,
        guides: guideCount,
        homestays: homestayCount,
        products: productCount,
        bookings: bookingCount
      },
      revenue: revenueStats[0] || { totalRevenue: 0, totalBookings: 0, avgBookingValue: 0 },
      recentActivity: {
        users: recentUsers,
        bookings: recentBookings
      },
      trends: {
        monthlyBookings,
        bookingStatus: bookingStatusStats,
        userRoles: userRoleStats
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// User Management

// @route   GET /api/admin/users
// @desc    Get all users with pagination
// @access  Admin
router.get('/users', async (req, res) => {
  try {
    const { 
      role, 
      verified, 
      search,
      page = 1, 
      limit = 20 
    } = req.query;

    let query = {};

    if (role) query.role = role;
    if (verified !== undefined) query.isVerified = verified === 'true';
    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') }
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await User.countDocuments(query);

    res.json({
      users,
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

// @route   PUT /api/admin/users/:id/verify
// @desc    Verify/unverify user
// @access  Admin
router.put('/users/:id/verify', async (req, res) => {
  try {
    const { verified } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isVerified: verified },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/admin/users/:id/role
// @desc    Update user role
// @access  Admin
router.put('/users/:id/role', async (req, res) => {
  try {
    const { role } = req.body;

    if (!['user', 'guide', 'host', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Content Management

// @route   GET /api/admin/content/pending
// @desc    Get pending content for approval
// @access  Admin
router.get('/content/pending', async (req, res) => {
  try {
    const pendingGuides = await Guide.find({ status: 'pending-approval' })
      .populate('user', 'name email')
      .limit(10);

    const pendingHomestays = await Homestay.find({ status: 'pending-approval' })
      .populate('host.user', 'name email')
      .limit(10);

    const pendingProducts = await Product.find({ status: 'inactive' })
      .limit(10);

    res.json({
      guides: pendingGuides,
      homestays: pendingHomestays,
      products: pendingProducts
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/admin/guides/:id/approve
// @desc    Approve/reject guide
// @access  Admin
router.put('/guides/:id/approve', async (req, res) => {
  try {
    const { approved, reason } = req.body;

    const guide = await Guide.findByIdAndUpdate(
      req.params.id,
      { 
        status: approved ? 'active' : 'suspended',
        'verification.isVerified': approved,
        'verification.verifiedBy': req.user.id,
        'verification.verifiedAt': approved ? new Date() : null
      },
      { new: true }
    ).populate('user', 'name email');

    if (!guide) {
      return res.status(404).json({ message: 'Guide not found' });
    }

    // TODO: Send notification email to guide

    res.json(guide);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/admin/homestays/:id/approve
// @desc    Approve/reject homestay
// @access  Admin
router.put('/homestays/:id/approve', async (req, res) => {
  try {
    const { approved, reason } = req.body;

    const homestay = await Homestay.findByIdAndUpdate(
      req.params.id,
      { status: approved ? 'active' : 'inactive' },
      { new: true }
    ).populate('host.user', 'name email');

    if (!homestay) {
      return res.status(404).json({ message: 'Homestay not found' });
    }

    // TODO: Send notification email to host

    res.json(homestay);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Analytics

// @route   GET /api/admin/analytics/bookings
// @desc    Get booking analytics
// @access  Admin
router.get('/analytics/bookings', async (req, res) => {
  try {
    const { period = '30d' } = req.query;

    let dateFilter = {};
    const now = new Date();
    
    switch (period) {
      case '7d':
        dateFilter = { createdAt: { $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) } };
        break;
      case '30d':
        dateFilter = { createdAt: { $gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) } };
        break;
      case '90d':
        dateFilter = { createdAt: { $gte: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000) } };
        break;
      case '1y':
        dateFilter = { createdAt: { $gte: new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000) } };
        break;
    }

    const bookingStats = await Booking.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$bookingType',
          count: { $sum: 1 },
          revenue: { $sum: '$pricing.totalAmount' },
          avgValue: { $avg: '$pricing.totalAmount' }
        }
      }
    ]);

    const dailyStats = await Booking.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }
          },
          count: { $sum: 1 },
          revenue: { $sum: '$pricing.totalAmount' }
        }
      },
      { $sort: { '_id.date': 1 } }
    ]);

    const conversionStats = await Booking.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      bookingTypes: bookingStats,
      dailyTrends: dailyStats,
      conversion: conversionStats
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/analytics/revenue
// @desc    Get revenue analytics
// @access  Admin
router.get('/analytics/revenue', async (req, res) => {
  try {
    const revenueByMonth = await Booking.aggregate([
      { $match: { 'payment.status': 'paid' } },
      {
        $group: {
          _id: {
            year: { $year: '$payment.paidAt' },
            month: { $month: '$payment.paidAt' }
          },
          totalRevenue: { $sum: '$pricing.totalAmount' },
          totalBookings: { $sum: 1 },
          avgBookingValue: { $avg: '$pricing.totalAmount' }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 }
    ]);

    const revenueByType = await Booking.aggregate([
      { $match: { 'payment.status': 'paid' } },
      {
        $group: {
          _id: '$bookingType',
          totalRevenue: { $sum: '$pricing.totalAmount' },
          totalBookings: { $sum: 1 }
        }
      }
    ]);

    const topPerformers = await Booking.aggregate([
      { $match: { 'payment.status': 'paid' } },
      {
        $group: {
          _id: '$reference',
          totalRevenue: { $sum: '$pricing.totalAmount' },
          totalBookings: { $sum: 1 }
        }
      },
      { $sort: { totalRevenue: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      monthlyRevenue: revenueByMonth,
      revenueByType,
      topPerformers
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;