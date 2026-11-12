const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/env');
const { errorResponse } = require('../utils/apiResponse');

/**
 * Verifies the Bearer token and attaches req.user = { id, role }.
 * Returns 401 if the token is missing, invalid, or expired.
 */
const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return errorResponse(res, 'No token provided. Please log in.', 401);
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return errorResponse(res, 'Token has expired. Please log in again.', 401);
    }
    return errorResponse(res, 'Invalid token. Please log in again.', 401);
  }
};

/**
 * Same as protect, but does NOT block the request if no token is provided.
 * Attaches req.user if token is valid; otherwise continues without it.
 */
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = { id: decoded.id, role: decoded.role };
  } catch {
    // Invalid/expired token is ignored in optional mode
  }

  next();
};

module.exports = { protect, optionalAuth };
