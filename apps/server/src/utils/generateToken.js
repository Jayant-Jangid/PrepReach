const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_REFRESH_SECRET, JWT_EXPIRES_IN, JWT_REFRESH_EXPIRES_IN } = require('../config/env');

/**
 * Generates a short-lived access token (15 min default).
 * @param {string} userId
 * @param {string} role
 * @returns {string}
 */
const generateAccessToken = (userId, role) => {
  return jwt.sign({ id: userId, role }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

/**
 * Generates a long-lived refresh token (7 days default).
 * @param {string} userId
 * @returns {string}
 */
const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_REFRESH_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRES_IN,
  });
};

module.exports = { generateAccessToken, generateRefreshToken };
