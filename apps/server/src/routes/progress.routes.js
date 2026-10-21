const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const progressController = require('../controllers/progress.controller');

router.post('/:lectureId', protect, progressController.updateLectureProgress);

module.exports = router;
