const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const studentController = require('../controllers/student.controller');

router.get('/dashboard', protect, studentController.getStudentDashboard);

module.exports = router;
