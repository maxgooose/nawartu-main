const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: [true, 'Property is required']
  },
  guest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Guest is required']
  },
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Host is required']
  },
  checkIn: {
    type: Date,
    required: [true, 'Check-in date is required']
  },
  checkOut: {
    type: Date,
    required: [true, 'Check-out date is required']
  },
  guests: {
    type: Number,
    required: [true, 'Number of guests is required'],
    min: 1
  },
  totalPrice: {
    type: Number,
    required: [true, 'Total price is required']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['credit_card', 'paypal', 'cash'],
    default: 'credit_card'
  },
  specialRequests: {
    type: String,
    trim: true
  },
  cancellationReason: {
    type: String,
    trim: true
  },
  review: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      trim: true
    },
    date: {
      type: Date
    }
  }
}, {
  timestamps: true
});

// Validate check-out date is after check-in date
bookingSchema.pre('save', function(next) {
  if (this.checkOut <= this.checkIn) {
    return next(new Error('Check-out date must be after check-in date'));
  }
  next();
});

// Calculate total price based on nights and property price
bookingSchema.methods.calculateTotalPrice = function(propertyPrice) {
  const nights = Math.ceil((this.checkOut - this.checkIn) / (1000 * 60 * 60 * 24));
  return nights * propertyPrice;
};

// Check if booking dates conflict with existing bookings
bookingSchema.statics.checkAvailability = async function(propertyId, checkIn, checkOut, excludeBookingId = null) {
  const query = {
    property: propertyId,
    status: { $in: ['pending', 'confirmed'] },
    $or: [
      {
        checkIn: { $lt: checkOut },
        checkOut: { $gt: checkIn }
      }
    ]
  };

  if (excludeBookingId) {
    query._id = { $ne: excludeBookingId };
  }

  const conflictingBooking = await this.findOne(query);
  return !conflictingBooking;
};

module.exports = mongoose.model('Booking', bookingSchema); 