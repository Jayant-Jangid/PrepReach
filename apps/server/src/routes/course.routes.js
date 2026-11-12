const { Router } = require('express');
const { body, param } = require('express-validator');

const {
  createCourse,
  getCourses,
  getCourseById,
  addModule,
  addLecture,
  updateCourse,
  publishCourse,
  deleteCourse,
} = require('../controllers/course.controller');

const { protect, optionalAuth } = require('../middleware/auth.middleware');
const { requireRole }           = require('../middleware/role.middleware');
const { validate }              = require('../middleware/validate.middleware');

const router = Router();

// GET /api/courses  — public (optional auth for enrollment hints)
router.get('/', optionalAuth, getCourses);

// GET /api/courses/:id  — public
router.get('/:id', optionalAuth, getCourseById);

// POST /api/courses  — instructor or admin
router.post(
  '/',
  protect,
  requireRole('instructor', 'admin'),
  validate([
    body('title').notEmpty().withMessage('Title is required.'),
    body('description').notEmpty().withMessage('Description is required.'),
    body('examCategory')
      .isIn(['civil_service', 'public_banking', 'railway', 'municipal'])
      .withMessage('Invalid exam category.'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a non-negative number.'),
  ]),
  createCourse
);

// PUT /api/courses/:id  — instructor (own) or admin
router.put(
  '/:id',
  protect,
  requireRole('instructor', 'admin'),
  validate([
    body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a non-negative number.'),
    body('examCategory')
      .optional()
      .isIn(['civil_service', 'public_banking', 'railway', 'municipal'])
      .withMessage('Invalid exam category.'),
  ]),
  updateCourse
);

// PUT /api/courses/:id/publish  — instructor (own) or admin
router.put(
  '/:id/publish',
  protect,
  requireRole('instructor', 'admin'),
  publishCourse
);

// DELETE /api/courses/:id  — admin only
router.delete(
  '/:id',
  protect,
  requireRole('admin'),
  deleteCourse
);

// POST /api/courses/:id/modules  — instructor (own) or admin
router.post(
  '/:id/modules',
  protect,
  requireRole('instructor', 'admin'),
  validate([
    body('title').notEmpty().withMessage('Module title is required.'),
    body('order').optional().isInt({ min: 1 }).withMessage('Order must be a positive integer.'),
  ]),
  addModule
);

// POST /api/courses/:id/modules/:moduleId/lectures  — instructor (own) or admin
router.post(
  '/:id/modules/:moduleId/lectures',
  protect,
  requireRole('instructor', 'admin'),
  validate([
    body('title').notEmpty().withMessage('Lecture title is required.'),
    body('type').optional().isIn(['video', 'live', 'material']).withMessage('Invalid lecture type.'),
    body('duration').optional().isFloat({ min: 0 }).withMessage('Duration must be a non-negative number.'),
  ]),
  addLecture
);

module.exports = router;
