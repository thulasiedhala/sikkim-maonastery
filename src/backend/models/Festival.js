const mongoose = require('mongoose');

const festivalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  monastery: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Monastery',
    required: true
  },
  dates: {
    start: { type: Date, required: true },
    end: { type: Date, required: true },
    isRecurring: { type: Boolean, default: false },
    recurrencePattern: String // e.g., "annually", "lunar-calendar"
  },
  schedule: [{
    time: String,
    activity: String,
    location: String,
    duration: String
  }],
  images: [{
    url: String,
    caption: String
  }],
  details: {
    significance: String,
    traditions: [String],
    rituals: [String],
    dress_code: String,
    participation_rules: String
  },
  livestream: {
    isAvailable: { type: Boolean, default: false },
    streamUrl: String,
    scheduledStreams: [{
      date: Date,
      startTime: String,
      endTime: String,
      title: String,
      description: String
    }]
  },
  capacity: {
    total: Number,
    current: { type: Number, default: 0 }
  },
  ticketing: {
    required: { type: Boolean, default: false },
    price: { type: Number, default: 0 },
    availableTickets: Number
  },
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
    default: 'upcoming'
  },
  categories: [{
    type: String,
    enum: ['religious', 'cultural', 'seasonal', 'meditation', 'teaching']
  }],
  featured: {
    type: Boolean,
    default: false
  },
  attendees: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    registeredAt: { type: Date, default: Date.now },
    attendanceStatus: {
      type: String,
      enum: ['registered', 'attended', 'no-show'],
      default: 'registered'
    }
  }]
}, {
  timestamps: true
});

// Index for date-based queries
festivalSchema.index({ "dates.start": 1, "dates.end": 1 });

module.exports = mongoose.model('Festival', festivalSchema);