// Load & validate env vars FIRST — before any other require
require('./config/env');

const express      = require('express');
const helmet       = require('helmet');
const cors         = require('cors');
const morgan       = require('morgan');
const cookieParser = require('cookie-parser');
const rateLimit    = require('express-rate-limit');

const connectDB  = require('./config/db');
const { PORT, CLIENT_URL, NODE_ENV } = require('./config/env');

const authRoutes       = require('./routes/auth.routes');
const courseRoutes     = require('./routes/course.routes');
const enrollmentRoutes = require('./routes/enrollment.routes');

const { notFound, errorHandler } = require('./middleware/error.middleware');

// ─── App setup ───────────────────────────────────────────────────────────────
const app = express();

// Security headers
app.use(helmet());

// CORS — allow the client origin(s) and Vercel domains with credentials (cookies)
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

// HTTP request logger
app.use(morgan(NODE_ENV === 'production' ? 'combined' : 'dev'));

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Cookie parser (for refresh token cookie)
app.use(cookieParser());

// Rate limiter — 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max:      100,
  standardHeaders: true,
  legacyHeaders:   false,
  message: { success: false, message: 'Too many requests. Please try again later.' },
});
app.use(limiter);

// ─── Health check ────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ success: true, message: 'PrepReach API is running.', env: NODE_ENV });
});

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/auth',        authRoutes);
app.use('/api/courses',     courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);

// ─── Error handling ───────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ─── Start server ────────────────────────────────────────────────────────────
const start = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`[server] PrepReach API running on port ${PORT} (${NODE_ENV})`);
  });
};

start();

module.exports = app; // for testing
