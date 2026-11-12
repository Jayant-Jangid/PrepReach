const User = require('../models/User');
const OTP  = require('../models/OTP');
const { sendOTPEmail } = require('./email.service');

/**
 * Checks that the email doesn't belong to an already-verified user,
 * generates an OTP, logs it for dev convenience, and emails it.
 * @param {string} email
 */
const sendRegistrationOTP = async (email) => {
  const normalizedEmail = email.toLowerCase().trim();

  const existing = await User.findOne({ email: normalizedEmail });
  if (existing && existing.isVerified) {
    const err = new Error('An account with this email already exists.');
    err.statusCode = 409;
    throw err;
  }

  const plainOTP = await OTP.createOTP(normalizedEmail, 'registration');

  // Print to server console for instant verification & debugging
  console.log(`\n======================================================`);
  console.log(`📩 [PrepReach OTP] Generated for: ${normalizedEmail}`);
  console.log(`👉 👉 👉   ${plainOTP}   👈 👈 👈`);
  console.log(`(Expires in 10 minutes)`);
  console.log(`======================================================\n`);

  // Dispatch email concurrently so the HTTP response is never blocked by email provider latency
  sendOTPEmail(normalizedEmail, plainOTP, 'registration').catch((err) => {
    console.error(`[Email Delivery Warning for ${normalizedEmail}]:`, err.message);
  });

  return plainOTP;
};

/**
 * Finds the latest unused, unexpired OTP for the email, verifies it,
 * and marks it as used.
 * @param {string} email
 * @param {string} candidateOTP
 * @returns {Promise<boolean>}
 */
const verifyRegistrationOTP = async (email, candidateOTP) => {
  const normalizedEmail = email.toLowerCase().trim();

  const activeOtps = await OTP.find({
    email: normalizedEmail,
    purpose: 'registration',
    used: false,
    expiresAt: { $gt: new Date() },
  }).sort({ createdAt: -1 });

  for (const otpDoc of activeOtps) {
    const isValid = await otpDoc.verifyOTP(candidateOTP);
    if (isValid) {
      otpDoc.used = true;
      await otpDoc.save();
      // Mark any other older pending registration OTPs for this email as used
      await OTP.updateMany({ email: normalizedEmail, purpose: 'registration', used: false }, { used: true });
      return true;
    }
  }

  return false;
};

/**
 * Checks that the user exists, generates a login OTP, logs it, and emails it.
 * @param {string} email
 */
const sendLoginOTP = async (email) => {
  const normalizedEmail = email.toLowerCase().trim();

  const user = await User.findOne({ email: normalizedEmail });
  if (!user) {
    const err = new Error('No account found with this email. Please register first.');
    err.statusCode = 404;
    throw err;
  }

  const plainOTP = await OTP.createOTP(normalizedEmail, 'login');

  console.log(`\n======================================================`);
  console.log(`📩 [PrepReach Login OTP] Generated for: ${normalizedEmail}`);
  console.log(`👉 👉 👉   ${plainOTP}   👈 👈 👈`);
  console.log(`(Expires in 10 minutes)`);
  console.log(`======================================================\n`);

  // Dispatch email concurrently so the HTTP response is never blocked by email provider latency
  sendOTPEmail(normalizedEmail, plainOTP, 'login').catch((err) => {
    console.error(`[Email Delivery Warning for ${normalizedEmail}]:`, err.message);
  });

  return plainOTP;
};

/**
 * Verifies login OTP.
 * @param {string} email
 * @param {string} candidateOTP
 * @returns {Promise<boolean>}
 */
const verifyLoginOTP = async (email, candidateOTP) => {
  const normalizedEmail = email.toLowerCase().trim();

  const activeOtps = await OTP.find({
    email: normalizedEmail,
    purpose: 'login',
    used: false,
    expiresAt: { $gt: new Date() },
  }).sort({ createdAt: -1 });

  for (const otpDoc of activeOtps) {
    const isValid = await otpDoc.verifyOTP(candidateOTP);
    if (isValid) {
      otpDoc.used = true;
      await otpDoc.save();
      // Mark any other older pending login OTPs for this email as used
      await OTP.updateMany({ email: normalizedEmail, purpose: 'login', used: false }, { used: true });
      return true;
    }
  }

  return false;
};

module.exports = {
  sendRegistrationOTP,
  verifyRegistrationOTP,
  sendLoginOTP,
  verifyLoginOTP,
};
