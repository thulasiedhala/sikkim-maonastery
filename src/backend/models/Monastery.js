const mongoose = require('mongoose');

const monasterySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  location: {
    address: {
      type: String,
      required: true
    },
    coordinates: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true }
    },
    district: String,
    state: { type: String, default: 'Sikkim' }
  },
  tradition: {
    type: String,
    required: true,
    enum: ['Nyingma', 'Kagyu', 'Gelug', 'Sakya', 'Bon']
  },
  established: {
    type: String,
    required: true
  },
  images: [{
    url: String,
    caption: String,
    isPrimary: { type: Boolean, default: false }
  }],
  details: {
    foundedBy: String,
    significance: String,
    architecture: String,
    artifacts: [String],
    ceremonies: [String],
    visitingHours: {
      opening: String,
      closing: String,
      days: [String]
    },
    entryFee: {
      adults: Number,
      children: Number,
      foreigners: Number
    }
  },
  facilities: {
    parking: { type: Boolean, default: false },
    restaurant: { type: Boolean, default: false },
    guestHouse: { type: Boolean, default: false },
    library: { type: Boolean, default: false },
    meditation: { type: Boolean, default: false },
    wheelchair: { type: Boolean, default: false }
  },
  contact: {
    phone: String,
    email: String,
    website: String
  },
  ratings: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  reviews: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: { type: Number, min: 1, max: 5 },
    comment: String,
    date: { type: Date, default: Date.now },
    helpful: { type: Number, default: 0 }
  }],
  status: {
    type: String,
    enum: ['active', 'maintenance', 'closed'],
    default: 'active'
  },
  featured: {
    type: Boolean,
    default: false
  },
  seoData: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String]
  }
}, {
  timestamps: true
});

// Index for location-based queries
monasterySchema.index({ "location.coordinates": "2dsphere" });

// Index for search
monasterySchema.index({ 
  name: "text", 
  description: "text", 
  "location.address": "text",
  tradition: "text"
});

module.exports = mongoose.model('Monastery', monasterySchema);