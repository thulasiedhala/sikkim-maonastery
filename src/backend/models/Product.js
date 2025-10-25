const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  artisan: {
    name: { type: String, required: true },
    contact: {
      phone: String,
      email: String
    },
    location: String,
    story: String,
    verified: { type: Boolean, default: false }
  },
  category: {
    type: String,
    required: true,
    enum: ['spiritual', 'art', 'food', 'textile', 'jewelry', 'handicraft', 'books', 'music']
  },
  subcategory: String,
  pricing: {
    basePrice: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    discountPrice: Number,
    discountPercentage: Number,
    bulkPricing: [{
      minQuantity: Number,
      price: Number
    }]
  },
  images: [{
    url: String,
    caption: String,
    isPrimary: { type: Boolean, default: false }
  }],
  specifications: {
    dimensions: {
      length: Number,
      width: Number,
      height: Number,
      weight: Number,
      unit: { type: String, default: 'cm' }
    },
    materials: [String],
    colors: [String],
    origin: String,
    authenticity: {
      certificate: String,
      certifiedBy: String
    }
  },
  inventory: {
    stock: { type: Number, required: true },
    lowStockThreshold: { type: Number, default: 5 },
    sku: { type: String, unique: true },
    barcode: String
  },
  shipping: {
    weight: Number,
    dimensions: {
      length: Number,
      width: Number,
      height: Number
    },
    fragile: { type: Boolean, default: false },
    domesticShipping: {
      available: { type: Boolean, default: true },
      cost: Number,
      estimatedDays: Number
    },
    internationalShipping: {
      available: { type: Boolean, default: false },
      cost: Number,
      estimatedDays: Number,
      restrictions: [String]
    }
  },
  ratings: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  reviews: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: { type: Number, min: 1, max: 5 },
    comment: String,
    photos: [String],
    verified: { type: Boolean, default: false }, // verified purchase
    date: { type: Date, default: Date.now },
    helpful: { type: Number, default: 0 }
  }],
  culturalStory: {
    significance: String,
    tradition: String,
    makingProcess: String,
    videoUrl: String
  },
  sustainability: {
    ecoFriendly: { type: Boolean, default: false },
    fairTrade: { type: Boolean, default: false },
    localSourcing: { type: Boolean, default: true },
    packaging: {
      biodegradable: { type: Boolean, default: false },
      recyclable: { type: Boolean, default: false },
      minimal: { type: Boolean, default: true }
    }
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'out-of-stock', 'discontinued'],
    default: 'active'
  },
  featured: {
    type: Boolean,
    default: false
  },
  tags: [String],
  seoData: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String]
  },
  salesData: {
    totalSold: { type: Number, default: 0 },
    revenue: { type: Number, default: 0 },
    lastSoldAt: Date
  }
}, {
  timestamps: true
});

// Generate SKU before saving
productSchema.pre('save', function(next) {
  if (!this.inventory.sku) {
    const prefix = this.category.substring(0, 3).toUpperCase();
    const timestamp = Date.now().toString().slice(-6);
    this.inventory.sku = `${prefix}-${timestamp}`;
  }
  next();
});

// Index for search
productSchema.index({ 
  name: "text", 
  description: "text", 
  "artisan.name": "text",
  category: "text",
  tags: "text"
});

module.exports = mongoose.model('Product', productSchema);