const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const discussionController = require('../controllers/discussion.controller');

router.post('/:lectureId', protect, discussionController.createQuestion);
router.get('/:lectureId', protect, discussionController.getLectureQuestions);

module.exports = router;

router.post('/:discussionId/reply', protect, discussionController.replyToQuestion);

router.post('/:discussionId/upvote', protect, discussionController.toggleUpvote);
