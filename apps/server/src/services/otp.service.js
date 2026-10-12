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

const failedAttemptsMap = new Map();

const checkLockout = (email) => {
  const entry = failedAttemptsMap.get(email);
  if (entry && entry.count >= 5 && Date.now() < entry.lockedUntil) {
    return true;
  }
  return false;
};

const recordFailedAttempt = (email) => {
  const entry = failedAttemptsMap.get(email) || { count: 0, lockedUntil: 0 };
  entry.count += 1;
  if (entry.count >= 5) {
    entry.lockedUntil = Date.now() + 15 * 60 * 1000;
  }
  failedAttemptsMap.set(email, entry);
};

module.exports.checkLockout = checkLockout;
module.exports.recordFailedAttempt = recordFailedAttempt;
