const mongoose = require('mongoose');

const guideSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  profile: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: String,
    avatar: String,
    experience: { type: String, required: true }, // e.g., "8 years"
    languages: [{ type: String, required: true }],
    specialties: [{ type: String, required: true }],
    certifications: [{
      name: String,
      issuer: String,
      date: Date,
      certificateUrl: String
    }]
  },
  pricing: {
    baseRate: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    rateType: {
      type: String,
      enum: ['per-day', 'per-hour', 'per-tour'],
      default: 'per-day'
    },
    groupRates: [{
      minSize: Number,
      maxSize: Number,
      rate: Number
    }]
  },
  services: [{
    type: String,
    enum: [
      'monastery-tours', 'cultural-heritage', 'trekking',
      'photography-tours', 'meditation-guidance', 'spiritual-counseling',
      'wildlife-tours', 'eco-tourism', 'festival-guidance',
      'language-interpretation', 'ritual-explanation'
    ]
  }],
  coverage: {
    areas: [String], // Districts/regions covered
    monasteries: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Monastery' }],
    maxDistance: Number // km from base location
  },
  availability: {
    schedule: [{
      day: {
        type: String,
        enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
      },
      available: { type: Boolean, default: true },
      timeSlots: [{
        start: String,
        end: String,
        booked: { type: Boolean, default: false }
      }]
    }],
    blackoutDates: [Date],
    minAdvanceBooking: { type: Number, default: 1 }, // days
    maxAdvanceBooking: { type: Number, default: 90 } // days
  },
  ratings: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 },
    breakdown: {
      knowledge: { type: Number, default: 0 },
      communication: { type: Number, default: 0 },
      punctuality: { type: Number, default: 0 },
      overall: { type: Number, default: 0 }
    }
  },
  reviews: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
    ratings: {
      knowledge: { type: Number, min: 1, max: 5 },
      communication: { type: Number, min: 1, max: 5 },
      punctuality: { type: Number, min: 1, max: 5 },
      overall: { type: Number, min: 1, max: 5 }
    },
    comment: String,
    date: { type: Date, default: Date.now },
    helpful: { type: Number, default: 0 }
  }],
  bookings: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking'
  }],
  verification: {
    isVerified: { type: Boolean, default: false },
    documents: [{
      type: String, // ID proof, certificates, etc.
      url: String,
      status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
      }
    }],
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    verifiedAt: Date
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'pending-approval', 'suspended'],
    default: 'pending-approval'
  },
  featured: {
    type: Boolean,
    default: false
  },
  bankDetails: {
    accountName: String,
    accountNumber: String,
    bankName: String,
    ifscCode: String,
    upiId: String
  },
  emergencyContact: {
    name: String,
    phone: String,
    relationship: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Guide', guideSchema);