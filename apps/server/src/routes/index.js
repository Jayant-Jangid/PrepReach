const express = require('express');
const router = express.Router();

router.use('/health', require('./health.routes'));
router.use('/enrollments', require('./enrollment.routes'));
router.use('/progress', require('./progress.routes'));
router.use('/student', require('./student.routes'));

module.exports = router;
