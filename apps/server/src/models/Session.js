const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  ipAddress: { type: String, default: '' },
  userAgent: { type: String, default: '' },
  lastActive: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Session', sessionSchema);
