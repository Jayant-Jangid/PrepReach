const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const enrollmentController = require('../controllers/enrollment.controller');

router.post('/courses/:id/enroll', protect, enrollmentController.enrollInCourse);

module.exports = router;
