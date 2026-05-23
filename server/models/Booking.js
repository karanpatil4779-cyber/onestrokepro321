const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider', required: true },
  serviceType: { type: String, required: true },
  scheduledDate: { type: Date, required: true },
  scheduledTime: { type: String, required: true },
  duration: Number,
  durationUnit: { type: String, enum: ['hours', 'days', 'trips'] },
  location: {
    address: String,
    city: String,
    town: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  specialInstructions: String,
  attachmentUrl: String,
  status: { 
    type: String, 
    enum: ['pending', 'accepted', 'in-progress', 'completed', 'cancelled'], 
    default: 'pending' 
  },
  paymentMethod: { type: String, enum: ['online', 'cash'], default: 'online' },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'refunded'], default: 'pending' },
  razorpayOrderId: String,
  razorpayPaymentId: String,
  totalAmount: Number,
  platformFee: Number,
  providerPayout: Number,
  review: {
    rating: { type: Number, min: 1, max: 5 },
    comment: String,
    createdAt: { type: Date, default: Date.now }
  },
  completedAt: Date
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
