const express = require('express');
const router = express.Router();

router.use('/health', require('./health.routes'));
router.use('/enrollments', require('./enrollment.routes'));
router.use('/progress', require('./progress.routes'));

module.exports = router;
