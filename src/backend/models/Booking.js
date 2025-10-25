const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bookingType: {
    type: String,
    enum: ['homestay', 'guide', 'workshop', 'festival', 'product'],
    required: true
  },
  reference: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'bookingType'
  },
  details: {
    // For homestays
    checkIn: Date,
    checkOut: Date,
    guests: Number,
    
    // For guides
    tourDate: Date,
    duration: String,
    groupSize: Number,
    specialRequests: String,
    
    // For workshops
    sessionDate: Date,
    participants: Number,
    
    // For festivals
    attendees: Number,
    
    // For products
    quantity: Number,
    shippingAddress: {
      fullName: String,
      addressLine1: String,
      addressLine2: String,
      city: String,
      state: String,
      postalCode: String,
      country: String,
      phone: String
    }
  },
  pricing: {
    baseAmount: { type: Number, required: true },
    taxes: { type: Number, default: 0 },
    fees: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    currency: { type: String, default: 'INR' }
  },
  payment: {
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded', 'partially-refunded'],
      default: 'pending'
    },
    method: {
      type: String,
      enum: ['stripe', 'razorpay', 'bank-transfer', 'cash', 'upi']
    },
    transactionId: String,
    paidAt: Date,
    refundAmount: Number,
    refundedAt: Date
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed', 'refunded', 'no-show'],
    default: 'pending'
  },
  communication: [{
    from: {
      type: String,
      enum: ['user', 'host', 'guide', 'admin']
    },
    message: String,
    timestamp: { type: Date, default: Date.now },
    read: { type: Boolean, default: false }
  }],
  cancellation: {
    cancelledBy: {
      type: String,
      enum: ['user', 'host', 'guide', 'admin']
    },
    reason: String,
    cancelledAt: Date,
    refundEligible: { type: Boolean, default: false },
    refundAmount: Number
  },
  confirmation: {
    code: String,
    confirmedAt: Date,
    confirmedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  review: {
    rating: { type: Number, min: 1, max: 5 },
    comment: String,
    photos: [String],
    reviewedAt: Date
  },
  metadata: {
    source: String, // web, mobile, admin
    userAgent: String,
    ipAddress: String,
    referrer: String
  }
}, {
  timestamps: true
});

// Generate confirmation code before saving
bookingSchema.pre('save', function(next) {
  if (!this.confirmation.code) {
    this.confirmation.code = Math.random().toString(36).substring(2, 8).toUpperCase();
  }
  next();
});

// Index for user bookings
bookingSchema.index({ user: 1, createdAt: -1 });

// Index for reference-based queries
bookingSchema.index({ reference: 1, bookingType: 1 });

module.exports = mongoose.model('Booking', bookingSchema);