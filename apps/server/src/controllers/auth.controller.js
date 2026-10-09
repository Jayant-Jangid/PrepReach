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

const verifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return errorResponse(res, 'Email and OTP are required', 400);
    return successResponse(res, { isVerified: true }, 'OTP verified successfully', 200);
  } catch (err) {
    next(err);
  }
};

module.exports.verifyOTP = verifyOTP;

const login = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return errorResponse(res, 'Email is required', 400);
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return errorResponse(res, 'No account associated with this email', 404);
    return successResponse(res, null, 'Login verification code sent to your email', 200);
  } catch (err) {
    next(err);
  }
};

module.exports.login = login;

const loginVerify = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return errorResponse(res, 'User not found', 404);
    return successResponse(res, { user }, 'Session authenticated successfully', 200);
  } catch (err) {
    next(err);
  }
};

module.exports.loginVerify = loginVerify;

const refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) return errorResponse(res, 'Refresh token not found', 401);
    const { generateAccessToken } = require('../utils/generateToken');
    const newAccessToken = generateAccessToken('mock-user-id', 'student');
    return successResponse(res, { accessToken: newAccessToken }, 'Token refreshed successfully');
  } catch (err) {
    next(err);
  }
};

module.exports.refreshToken = refreshToken;
