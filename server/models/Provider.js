const mongoose = require('mongoose');

const providerSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, unique: true, sparse: true },
  phone: { type: String, required: true, unique: true },
  gender: { type: String },
  dob: { type: Date },
  profilePhoto: { type: String },
  role: { type: String, default: 'provider' },
  location: {
    state: String,
    city: String,
    town: String,
    pincode: String,
    serviceRadiusKm: { type: Number, default: 10 }
  },
  services: [{
    type: { 
      type: String, 
      enum: ['driver', 'maid', 'cook', 'errand', 'queue', 'handyman', 'tutor', 'care'] 
    },
    rateType: { type: String, enum: ['hourly', 'daily', 'weekly', 'fixed'] },
    rate: Number,
    details: mongoose.Schema.Types.Mixed // Service-specific metadata
  }],
  availability: {
    days: [String], // ['Monday', 'Tuesday', ...]
    timeSlots: [{ start: String, end: String }]
  },
  languages: [String],
  documents: [{
    docType: { type: String, enum: ['aadhaar', 'pan', 'dl', 'rc', 'police_cert', 'cert'] },
    fileUrl: String,
    verified: { type: Boolean, default: false },
    verifiedAt: Date
  }],
  verificationStatus: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'pending' 
  },
  rejectionReason: String,
  bankDetails: {
    accountNo: String,
    ifsc: String,
    upiId: String
  },
  isAvailableNow: { type: Boolean, default: true },
  rating: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  totalEarnings: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Provider', providerSchema);
