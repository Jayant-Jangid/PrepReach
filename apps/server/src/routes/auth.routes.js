const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { successResponse } = require('../utils/apiResponse');

router.get('/ping', protect, (req, res) => {
  res.json({ success: true, user: req.user, valid: true });
});

module.exports = router;
