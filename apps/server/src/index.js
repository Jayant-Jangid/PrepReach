require('./config/env');
const express = require('express');
const helmet = require('helmet');
// Built-in compression check
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();
const correlationIdMiddleware = require('./middleware/correlationId.middleware');
app.use(correlationIdMiddleware);
app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests. Please try again later.' },
});
app.use(limiter);
const PORT = process.env.PORT || 5000;

const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',').map((s) => s.trim())
  : ['http://localhost:3000'];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith('.vercel.app') ||
        origin.includes('localhost')
      ) {
        return callback(null, true);
      }
      return callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true,
  })
);

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
const sanitizeNoSQL = require('./middleware/sanitize.middleware');
app.use(sanitizeNoSQL);
app.use(cookieParser());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

const apiRoutes = require('./routes');
app.use('/api/v1', apiRoutes);
app.use('/api', apiRoutes);

module.exports = app;

const { notFound, errorHandler } = require('./middleware/error.middleware');
app.use(notFound);
app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log(`[server] PrepReach API running on port ${PORT}`);
});

const gracefulShutdown = (signal) => {
  console.log(`[server] ${signal} signal received. Closing HTTP server gracefully...`);
  server.close(async () => {
    console.log('[server] HTTP server closed.');
    const mongoose = require('mongoose');
    await mongoose.connection.close(false);
    console.log('[db] MongoDB connection closed.');
    process.exit(0);
  });
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
