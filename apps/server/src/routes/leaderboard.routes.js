const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const leaderboardController = require('../controllers/leaderboard.controller');

router.get('/', protect, leaderboardController.getCategoryLeaderboard);

module.exports = router;
