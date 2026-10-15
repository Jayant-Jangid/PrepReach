const mongoose = require('mongoose');

const emailLogSchema = new mongoose.Schema({
  recipient: { type: String, required: true },
  subject: { type: String, required: true },
  template: { type: String, default: 'general' },
  status: { type: String, enum: ['sent', 'failed', 'queued'], default: 'sent' },
  error: { type: String, default: null },
}, { timestamps: true });

module.exports = mongoose.model('EmailLog', emailLogSchema);
