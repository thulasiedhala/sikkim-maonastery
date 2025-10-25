const mongoose = require('mongoose');

const homestaySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  host: {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: String,
    languages: [String],
    experience: String,
    verified: { type: Boolean, default: false }
  },
  location: {
    address: { type: String, required: true },
    coordinates: {
      lat: Number,
      lng: Number
    },
    nearbyMonastery: String,
    district: String
  },
  accommodation: {
    type: {
      type: String,
      enum: ['private-room', 'shared-room', 'entire-house', 'dormitory'],
      required: true
    },
    capacity: { type: Number, required: true },
    bedrooms: Number,
    bathrooms: Number,
    beds: Number
  },
  pricing: {
    basePrice: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    priceType: {
      type: String,
      enum: ['per-night', 'per-person', 'per-week'],
      default: 'per-night'
    },
    discounts: {
      weekly: Number,
      monthly: Number,
      earlyBird: Number
    }
  },
  amenities: [{
    type: String,
    enum: [
      'wifi', 'breakfast', 'lunch', 'dinner', 'laundry',
      'cultural-activities', 'meditation-space', 'library',
      'garden', 'mountain-view', 'parking', 'hot-water',
      'heater', 'ac', 'traditional-cooking', 'spiritual-guidance'
    ]
  }],
  images: [{
    url: String,
    caption: String,
    isPrimary: { type: Boolean, default: false }
  }],
  description: {
    type: String,
    required: true
  },
  houseRules: [String],
  cancellationPolicy: {
    type: String,
    enum: ['flexible', 'moderate', 'strict'],
    default: 'moderate'
  },
  availability: [{
    date: Date,
    available: { type: Boolean, default: true },
    price: Number // Special pricing for specific dates
  }],
  bookings: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking'
  }],
  ratings: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  reviews: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: { type: Number, min: 1, max: 5 },
    comment: String,
    photos: [String],
    date: { type: Date, default: Date.now },
    helpful: { type: Number, default: 0 }
  }],
  status: {
    type: String,
    enum: ['active', 'inactive', 'pending-approval'],
    default: 'pending-approval'
  },
  featured: {
    type: Boolean,
    default: false
  },
  specialOffers: [{
    title: String,
    description: String,
    discount: Number,
    validFrom: Date,
    validTo: Date,
    active: { type: Boolean, default: true }
  }]
}, {
  timestamps: true
});

// Index for location-based queries
homestaySchema.index({ "location.coordinates": "2dsphere" });

module.exports = mongoose.model('Homestay', homestaySchema);