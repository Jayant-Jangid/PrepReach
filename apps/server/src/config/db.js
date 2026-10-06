const mongoose = require('mongoose');

const MAX_RETRIES = 5;

const connectDB = async (attempt = 1) => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/prepreach';
  try {
    const conn = await mongoose.connect(uri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[db] MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`[db] Connection attempt ${attempt} failed: ${err.message}`);
    if (attempt < MAX_RETRIES) {
      const delay = Math.min(1000 * Math.pow(2, attempt), 30000);
      console.log(`[db] Retrying in ${delay / 1000}s... (${attempt}/${MAX_RETRIES})`);
      await new Promise((res) => setTimeout(res, delay));
      return connectDB(attempt + 1);
    } else {
      console.error('[db] Max connection retries reached. Exiting process.');
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
