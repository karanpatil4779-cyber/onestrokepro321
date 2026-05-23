const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, unique: true, sparse: true },
  phone: { type: String, required: true, unique: true },
  gender: { type: String },
  city: { type: String },
  town: { type: String },
  profilePhoto: { type: String },
  role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
  favoriteProviders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Provider' }],
  wallet: {
    balance: { type: Number, default: 0 },
    transactions: [{
      amount: Number,
      type: { type: String, enum: ['credit', 'debit'] },
      description: String,
      date: { type: Date, default: Date.now }
    }]
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
