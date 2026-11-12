const path = require('path');
require('dotenv').config();
require('dotenv').config({ path: path.resolve(__dirname, '../../.env.local') });

const REQUIRED_VARS = [
  'MONGO_URI',
  'JWT_SECRET',
  'JWT_REFRESH_SECRET',
];

const missing = REQUIRED_VARS.filter((key) => !process.env[key]);

if (missing.length > 0) {
  console.error(
    `[env] Missing required environment variables:\n  ${missing.join('\n  ')}\n` +
      `Check your .env.local file.`
  );
  process.exit(1);
}

module.exports = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT, 10) || 5000,
  MONGO_URI: process.env.MONGO_URI,

  JWT_SECRET: process.env.JWT_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '15m',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',

  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
  SENDGRID_FROM_EMAIL: process.env.SENDGRID_FROM_EMAIL || 'apersonp576@gmail.com',
  SENDGRID_FROM_NAME: process.env.SENDGRID_FROM_NAME || 'PrepReach',

  // Gmail SMTP Direct Option (guarantees delivery when using a @gmail.com address)
  GMAIL_USER: process.env.GMAIL_USER || process.env.SENDGRID_FROM_EMAIL,
  GMAIL_APP_PASSWORD: process.env.GMAIL_APP_PASSWORD,

  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000',

  OTP_EXPIRY_MINUTES: parseInt(process.env.OTP_EXPIRY_MINUTES, 10) || 10,
};
