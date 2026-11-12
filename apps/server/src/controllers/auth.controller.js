const jwt = require('jsonwebtoken');
const User = require('../models/User');
const {
  sendRegistrationOTP,
  verifyRegistrationOTP,
  sendLoginOTP,
  verifyLoginOTP,
} = require('../services/otp.service');
const { sendWelcomeEmail } = require('../services/email.service');
const { generateAccessToken, generateRefreshToken } = require('../utils/generateToken');
const { successResponse, errorResponse } = require('../utils/apiResponse');
const { JWT_REFRESH_SECRET } = require('../config/env');

// ─── Cookie config ───────────────────────────────────────────────────────────
const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure:   process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge:   7 * 24 * 60 * 60 * 1000, // 7 days
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const issueTokens = async (user, res) => {
  const accessToken  = generateAccessToken(user._id, user.role);
  const refreshToken = generateRefreshToken(user._id);

  // Store refresh token in DB (hashing is not required here — it's already a JWT)
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  res.cookie('refreshToken', refreshToken, REFRESH_COOKIE_OPTIONS);
  return accessToken;
};

// ─── Controllers ─────────────────────────────────────────────────────────────

/**
 * POST /api/auth/register
 * Validates email + name, ensures email isn't already a verified account,
 * then sends a registration OTP.
 */
const registerInit = async (req, res, next) => {
  try {
    const { email, name } = req.body;
    await sendRegistrationOTP(email, name);
    return successResponse(res, null, 'OTP sent to your email. Please verify to complete registration.', 200);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/verify-otp
 * Verifies the OTP (registration or login). If valid:
 *  - For registration: creates or marks user verified, sends welcome email
 *  - For login: marks user verified if needed, issues tokens
 *  - Returns user profile and access token
 */
const verifyOTP = async (req, res, next) => {
  try {
    const { email, otp, password, targetExams, name, purpose } = req.body;

    if (!email || !otp) {
      return errorResponse(res, 'Email and OTP are required.', 400);
    }

    const normalizedEmail = email.toLowerCase().trim();

    // 1. Handle Login OTP verification
    if (purpose === 'login') {
      const isValid = await verifyLoginOTP(normalizedEmail, otp);
      if (!isValid) {
        return errorResponse(res, 'Invalid or expired OTP.', 400);
      }

      const user = await User.findOne({ email: normalizedEmail });
      if (!user) {
        return errorResponse(res, 'User account not found.', 404);
      }

      if (!user.isVerified) {
        user.isVerified = true;
        await user.save({ validateBeforeSave: false });
      }

      const accessToken = await issueTokens(user, res);

      return successResponse(
        res,
        {
          accessToken,
          user: {
            id:              user._id,
            name:            user.name,
            email:           user.email,
            role:            user.role,
            isVerified:      user.isVerified,
            profileComplete: user.profileComplete,
            targetExams:     user.targetExams,
          },
        },
        'Logged in successfully.',
        200
      );
    }

    // 2. Handle Registration OTP verification
    const isValid = await verifyRegistrationOTP(normalizedEmail, otp);
    if (!isValid) {
      return errorResponse(res, 'Invalid or expired OTP.', 400);
    }

    let user = await User.findOne({ email: normalizedEmail });

    if (user) {
      // Existing unverified user — mark as verified, update optional fields
      user.isVerified = true;
      if (password) user.password = password;
      if (targetExams && Array.isArray(targetExams)) user.targetExams = targetExams;
      if (name) user.name = name;
    } else {
      // Brand new user
      user = new User({
        name:        name || normalizedEmail.split('@')[0],
        email:       normalizedEmail,
        isVerified:  true,
        targetExams: Array.isArray(targetExams) ? targetExams : [],
        ...(password ? { password } : {}),
      });
    }

    await user.save();

    const accessToken = await issueTokens(user, res);

    // Fire-and-forget welcome email
    sendWelcomeEmail(user.email, user.name).catch((e) =>
      console.error('[auth] Welcome email failed:', e.message)
    );

    return successResponse(
      res,
      {
        accessToken,
        user: {
          id:              user._id,
          name:            user.name,
          email:           user.email,
          role:            user.role,
          isVerified:      user.isVerified,
          profileComplete: user.profileComplete,
          targetExams:     user.targetExams,
        },
      },
      'Registration successful.',
      201
    );
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/login
 * Supports both Passwordless OTP login (email only) and password-based login (email + password).
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return errorResponse(res, 'Email is required.', 400);
    }

    const normalizedEmail = email.toLowerCase().trim();

    // 1. Passwordless OTP Login flow (when password is omitted)
    if (!password) {
      const user = await User.findOne({ email: normalizedEmail });
      if (!user) {
        return errorResponse(res, 'No account found with this email. Please register first.', 404);
      }

      await sendLoginOTP(normalizedEmail);
      return successResponse(res, null, 'Verification code sent to your email.', 200);
    }

    // 2. Password-based Login flow
    const user = await User.findOne({ email: normalizedEmail }).select('+password');

    if (!user || !user.isVerified) {
      return errorResponse(res, 'Invalid credentials.', 401);
    }

    if (!user.password) {
      return errorResponse(res, 'This account uses passwordless OTP login. Please request an OTP.', 400);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return errorResponse(res, 'Invalid credentials.', 401);
    }

    const accessToken = await issueTokens(user, res);

    return successResponse(
      res,
      {
        accessToken,
        user: {
          id:              user._id,
          name:            user.name,
          email:           user.email,
          role:            user.role,
          isVerified:      user.isVerified,
          profileComplete: user.profileComplete,
          targetExams:     user.targetExams,
        },
      },
      'Logged in successfully.'
    );
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/resend-otp
 * Resends a fresh OTP for either registration or login.
 */
const resendOTP = async (req, res, next) => {
  try {
    const { email, purpose } = req.body;
    if (!email) {
      return errorResponse(res, 'Email is required.', 400);
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (purpose === 'login') {
      await sendLoginOTP(normalizedEmail);
    } else {
      await sendRegistrationOTP(normalizedEmail);
    }

    return successResponse(res, null, 'A fresh verification code has been sent.', 200);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/refresh-token
 * Reads the refresh token from the cookie, verifies it, and issues a new access token.
 */
const refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) {
      return errorResponse(res, 'No refresh token provided.', 401);
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_REFRESH_SECRET);
    } catch {
      return errorResponse(res, 'Invalid or expired refresh token. Please log in again.', 401);
    }

    const user = await User.findById(decoded.id).select('+refreshToken');
    if (!user || user.refreshToken !== token) {
      return errorResponse(res, 'Refresh token mismatch. Please log in again.', 401);
    }

    const accessToken = generateAccessToken(user._id, user.role);
    return successResponse(res, { accessToken }, 'Token refreshed.');
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/logout
 * Clears the refresh token from DB and the cookie.
 */
const logout = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user.id, { refreshToken: '' });
    res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'strict', secure: process.env.NODE_ENV === 'production' });
    return successResponse(res, null, 'Logged out successfully.');
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/auth/me
 * Returns the authenticated user's full profile.
 */
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return errorResponse(res, 'User not found.', 404);
    return successResponse(res, { user });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/auth/profile
 * Updates name, targetExams, and profileComplete.
 */
const updateProfile = async (req, res, next) => {
  try {
    const allowedFields = ['name', 'targetExams', 'profileComplete'];
    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    }

    // Automatically mark profileComplete if name and targetExams are set
    if (!updates.hasOwnProperty('profileComplete') && updates.name && updates.targetExams?.length > 0) {
      updates.profileComplete = true;
    }

    const user = await User.findByIdAndUpdate(req.user.id, updates, {
      new:              true,
      runValidators:    true,
    });

    if (!user) return errorResponse(res, 'User not found.', 404);
    return successResponse(res, { user }, 'Profile updated successfully.');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  registerInit,
  verifyOTP,
  login,
  resendOTP,
  refreshToken,
  logout,
  getMe,
  updateProfile,
};
