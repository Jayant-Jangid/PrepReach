const mongoose = require('mongoose');
const { MONGO_URI } = require('./env');

const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 5000;

const connectDB = async (attempt = 1) => {
  try {
    const conn = await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[db] MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`[db] Connection attempt ${attempt} failed: ${err.message}`);
    if (attempt < MAX_RETRIES) {
      console.log(`[db] Retrying in ${RETRY_DELAY_MS / 1000}s... (${attempt}/${MAX_RETRIES})`);
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
      return connectDB(attempt + 1);
    } else {
      console.error('[db] Max retries reached. Exiting.');
      process.exit(1);
    }
  }
};

mongoose.connection.on('disconnected', () => {
  console.warn('[db] MongoDB disconnected. Attempting to reconnect...');
});

mongoose.connection.on('error', (err) => {
  console.error(`[db] MongoDB error: ${err.message}`);
});

module.exports = connectDB;
