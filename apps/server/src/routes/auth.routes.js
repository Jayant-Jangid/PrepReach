const { Router } = require('express');
const { body }   = require('express-validator');

const {
  registerInit,
  verifyOTP,
  login,
  resendOTP,
  refreshToken,
  logout,
  getMe,
  updateProfile,
} = require('../controllers/auth.controller');

const { protect }  = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');

const router = Router();

// POST /api/auth/register
router.post(
  '/register',
  validate([
    body('name').notEmpty().withMessage('Name is required.').trim(),
    body('email').isEmail().withMessage('A valid email is required.').normalizeEmail(),
  ]),
  registerInit
);

// POST /api/auth/verify-otp
router.post(
  '/verify-otp',
  validate([
    body('email').isEmail().withMessage('A valid email is required.').normalizeEmail(),
    body('otp').notEmpty().withMessage('OTP is required.'),
    body('password')
      .optional()
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters.'),
    body('targetExams')
      .optional()
      .isArray()
      .withMessage('targetExams must be an array.')
      .custom((arr) => arr.every((v) => ['civil_service', 'public_banking', 'railway', 'municipal'].includes(v)))
      .withMessage('Invalid exam category in targetExams.'),
  ]),
  verifyOTP
);

// POST /api/auth/login
router.post(
  '/login',
  validate([
    body('email').isEmail().withMessage('A valid email is required.').normalizeEmail(),
    body('password').optional(),
  ]),
  login
);

// POST /api/auth/resend-otp
router.post(
  '/resend-otp',
  validate([
    body('email').isEmail().withMessage('A valid email is required.').normalizeEmail(),
    body('purpose').optional().isIn(['registration', 'login']),
  ]),
  resendOTP
);

// POST /api/auth/refresh-token
router.post('/refresh-token', refreshToken);

// POST /api/auth/logout  (protected)
router.post('/logout', protect, logout);

// GET /api/auth/me  (protected)
router.get('/me', protect, getMe);

// PUT /api/auth/profile  (protected)
router.put(
  '/profile',
  protect,
  validate([
    body('name').optional().notEmpty().withMessage('Name cannot be empty.').trim(),
    body('targetExams')
      .optional()
      .isArray()
      .withMessage('targetExams must be an array.'),
    body('profileComplete')
      .optional()
      .isBoolean()
      .withMessage('profileComplete must be a boolean.'),
  ]),
  updateProfile
);

module.exports = router;
