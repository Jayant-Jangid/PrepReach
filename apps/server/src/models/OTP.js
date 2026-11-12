const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  otp: {
    type: String,
    required: true,
    // stored as bcrypt hash
  },
  purpose: {
    type: String,
    enum: ['registration', 'login', 'password_reset'],
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  used: {
    type: Boolean,
    default: false,
  },
});

// TTL index — MongoDB removes the doc once expiresAt is reached
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

/**
 * Generates a 6-digit OTP, hashes and stores it, returns plaintext OTP.
 * @param {string} email
 * @param {string} purpose
 * @returns {Promise<string>} plaintext OTP
 */
otpSchema.statics.createOTP = async function (email, purpose) {
  // Invalidate any prior unused OTPs for this email+purpose
  await this.deleteMany({ email: email.toLowerCase(), purpose, used: false });

  const plainOTP = Math.floor(100000 + Math.random() * 900000).toString();
  const salt = await bcrypt.genSalt(10);
  const hashedOTP = await bcrypt.hash(plainOTP, salt);

  const expiryMinutes = parseInt(process.env.OTP_EXPIRY_MINUTES, 10) || 10;
  const expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000);

  await this.create({ email: email.toLowerCase(), otp: hashedOTP, purpose, expiresAt });

  return plainOTP;
};

/**
 * Verifies a candidate OTP against the stored hash.
 * @param {string} candidateOTP
 * @returns {Promise<boolean>}
 */
otpSchema.methods.verifyOTP = async function (candidateOTP) {
  return bcrypt.compare(candidateOTP, this.otp);
};

module.exports = mongoose.model('OTP', otpSchema);
