const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  const uptimeSeconds = Math.floor(process.uptime());
  res.json({
    success: true,
    message: 'PrepReach API is fully operational',
    timestamp: new Date().toISOString(),
    uptime: `${uptimeSeconds}s`,
    memory: process.memoryUsage(),
    environment: process.env.NODE_ENV || 'development',
  });
});

module.exports = router;
