const { successResponse, errorResponse } = require('../utils/apiResponse');
const User = require('../models/User');
const { generateSecureOTP } = require('../utils/cryptoCode');

const registerInit = async (req, res, next) => {
  try {
    const { email, name } = req.body;
    if (!email) return errorResponse(res, 'Email is required', 400);
    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing && existing.isVerified) {
      return errorResponse(res, 'An account with this email already exists', 409);
    }
    return successResponse(res, null, 'Registration OTP dispatched to candidate email', 200);
  } catch (err) {
    next(err);
  }
};

module.exports = { registerInit };
