const express = require('express');
const Product = require('../models/Product');
const { auth, optionalAuth, adminAuth } = require('../middleware/auth');
const router = express.Router();

// @route   GET /api/products
// @desc    Get all products
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const {
      category,
      search,
      minPrice,
      maxPrice,
      artisan,
      inStock = true,
      featured,
      sort = 'name',
      page = 1,
      limit = 12
    } = req.query;

    let query = { status: 'active' };

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Search functionality
    if (search) {
      query.$text = { $search: search };
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query['pricing.basePrice'] = {};
      if (minPrice) query['pricing.basePrice'].$gte = parseFloat(minPrice);
      if (maxPrice) query['pricing.basePrice'].$lte = parseFloat(maxPrice);
    }

    // Filter by artisan
    if (artisan) {
      query['artisan.name'] = new RegExp(artisan, 'i');
    }

    // Filter in stock
    if (inStock === 'true') {
      query['inventory.stock'] = { $gt: 0 };
    }

    // Filter featured
    if (featured === 'true') {
      query.featured = true;
    }

    const sortOptions = {};
    switch (sort) {
      case 'price-low':
        sortOptions['pricing.basePrice'] = 1;
        break;
      case 'price-high':
        sortOptions['pricing.basePrice'] = -1;
        break;
      case 'rating':
        sortOptions['ratings.average'] = -1;
        break;
      case 'newest':
        sortOptions.createdAt = -1;
        break;
      default:
        sortOptions.name = 1;
    }

    const products = await Product.find(query)
      .sort(sortOptions)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .populate('reviews.user', 'name avatar');

    const total = await Product.countDocuments(query);

    res.json({
      products,
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

// @route   GET /api/products/:id
// @desc    Get product by ID
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('reviews.user', 'name avatar');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/products/:id/review
// @desc    Add review to product
// @access  Private
router.post('/:id/review', auth, async (req, res) => {
  try {
    const { rating, comment, photos } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if user already reviewed
    const existingReview = product.reviews.find(
      review => review.user.toString() === req.user.id
    );

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this product' });
    }

    // Add review
    product.reviews.push({
      user: req.user.id,
      rating,
      comment,
      photos: photos || []
    });

    // Update average rating
    const totalRatings = product.reviews.length;
    const sumRatings = product.reviews.reduce((sum, review) => sum + review.rating, 0);
    product.ratings.average = sumRatings / totalRatings;
    product.ratings.count = totalRatings;

    await product.save();

    res.json({ message: 'Review added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/products/category/:category
// @desc    Get products by category
// @access  Public
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const { limit = 8 } = req.query;

    const products = await Product.find({ 
      category, 
      status: 'active',
      'inventory.stock': { $gt: 0 }
    })
    .sort({ featured: -1, 'ratings.average': -1 })
    .limit(parseInt(limit));

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/products/artisan/:artisanName
// @desc    Get products by artisan
// @access  Public
router.get('/artisan/:artisanName', async (req, res) => {
  try {
    const { artisanName } = req.params;

    const products = await Product.find({ 
      'artisan.name': new RegExp(artisanName, 'i'),
      status: 'active'
    })
    .sort({ createdAt: -1 });

    // Get artisan info from first product
    const artisanInfo = products.length > 0 ? products[0].artisan : null;

    res.json({
      artisan: artisanInfo,
      products
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/products/featured/trending
// @desc    Get featured and trending products
// @access  Public
router.get('/featured/trending', async (req, res) => {
  try {
    const featured = await Product.find({ 
      featured: true, 
      status: 'active',
      'inventory.stock': { $gt: 0 }
    })
    .sort({ 'ratings.average': -1 })
    .limit(6);

    const trending = await Product.find({ 
      status: 'active',
      'inventory.stock': { $gt: 0 }
    })
    .sort({ 'salesData.totalSold': -1, createdAt: -1 })
    .limit(6);

    res.json({
      featured,
      trending
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/products/stats/overview
// @desc    Get products statistics
// @access  Public
router.get('/stats/overview', async (req, res) => {
  try {
    const stats = await Product.aggregate([
      { $match: { status: 'active' } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          avgPrice: { $avg: '$pricing.basePrice' },
          totalRevenue: { $sum: '$salesData.revenue' },
          avgRating: { $avg: '$ratings.average' }
        }
      }
    ]);

    const categoryStats = await Product.aggregate([
      { $match: { status: 'active' } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          avgPrice: { $avg: '$pricing.basePrice' }
        }
      }
    ]);

    const artisanStats = await Product.aggregate([
      { $match: { status: 'active' } },
      {
        $group: {
          _id: '$artisan.name',
          count: { $sum: 1 },
          totalRevenue: { $sum: '$salesData.revenue' }
        }
      },
      { $sort: { totalRevenue: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      overview: stats[0] || { total: 0, avgPrice: 0, totalRevenue: 0, avgRating: 0 },
      byCategory: categoryStats,
      topArtisans: artisanStats
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin routes

// @route   POST /api/products
// @desc    Create product
// @access  Admin
router.post('/', auth, adminAuth, async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    
    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/products/:id
// @desc    Update product
// @access  Admin
router.put('/:id', auth, adminAuth, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete product
// @access  Admin
router.delete('/:id', auth, adminAuth, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;