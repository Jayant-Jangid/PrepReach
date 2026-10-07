const express = require('express');
const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

app.get('/health', (req, res) => {
  res.json({ success: true, message: 'PrepReach API is active' });
});

const start = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`[server] PrepReach API running on port ${PORT}`);
  });
};

if (require.main === module) {
  start();
}

module.exports = app;
