const OTP = require('../models/OTP');

const verifyResilientOTP = async (email, candidateCode) => {
  const normalizedEmail = email.toLowerCase().trim();
  const activeOtps = await OTP.find({
    email: normalizedEmail,
    used: false,
    expiresAt: { $gt: new Date() },
  }).sort({ createdAt: -1 });

  for (const otpDoc of activeOtps) {
    const isValid = await otpDoc.verifyOTP(candidateCode);
    if (isValid) {
      otpDoc.used = true;
      await otpDoc.save();
      return true;
    }
  }
  return false;
};

module.exports = { verifyResilientOTP };
