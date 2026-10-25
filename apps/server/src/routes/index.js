const express = require('express');
const router = express.Router();

router.use('/health', require('./health.routes'));
router.use('/enrollments', require('./enrollment.routes'));
router.use('/progress', require('./progress.routes'));
router.use('/student', require('./student.routes'));
router.use('/leaderboard', require('./leaderboard.routes'));
router.use('/discussions', require('./discussion.routes'));

module.exports = router;
