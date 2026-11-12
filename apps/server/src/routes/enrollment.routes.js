const { Router } = require('express');
const { body }   = require('express-validator');

const {
  enrollCourse,
  getMyEnrollments,
  updateProgress,
  checkEnrollment,
} = require('../controllers/enrollment.controller');

const { protect }      = require('../middleware/auth.middleware');
const { requireRole }  = require('../middleware/role.middleware');
const { validate }     = require('../middleware/validate.middleware');

const router = Router();

// GET /api/enrollments/my  — student; must be BEFORE /:courseId to avoid clash
router.get(
  '/my',
  protect,
  requireRole('student'),
  getMyEnrollments
);

// GET /api/enrollments/:courseId/check  — student
router.get(
  '/:courseId/check',
  protect,
  requireRole('student'),
  checkEnrollment
);

// POST /api/enrollments/:courseId  — student
router.post(
  '/:courseId',
  protect,
  requireRole('student'),
  enrollCourse
);

// PUT /api/enrollments/:courseId/progress  — student
router.put(
  '/:courseId/progress',
  protect,
  requireRole('student'),
  validate([
    body('moduleId').notEmpty().withMessage('moduleId is required.'),
    body('lectureId').notEmpty().withMessage('lectureId is required.'),
    body('watchedPercent')
      .isFloat({ min: 0, max: 100 })
      .withMessage('watchedPercent must be between 0 and 100.'),
  ]),
  updateProgress
);

module.exports = router;
