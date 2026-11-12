const { errorResponse } = require('../utils/apiResponse');

/**
 * 404 handler — must be registered after all routes.
 */
const notFound = (req, res) => {
  return errorResponse(res, `Route not found: ${req.method} ${req.originalUrl}`, 404);
};

/**
 * Global error handler — must be registered last (4-argument signature).
 * Handles: Mongoose CastError, ValidationError, duplicate key, JWT errors,
 * SendGrid errors, and any generic Error thrown in the app.
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || err.status || 500;
  let message    = err.message || 'Internal Server Error';
  let errors     = null;

  // SendGrid API error details
  if (err.response?.body?.errors && err.response.body.errors.length > 0) {
    message = err.response.body.errors.map((e) => e.message).join('; ');
    statusCode = err.code || 502;
  }

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    statusCode = 400;
    message    = `Invalid ${err.path}: ${err.value}`;
  }

  // Mongoose validation errors
  if (err.name === 'ValidationError') {
    statusCode = 422;
    message    = 'Validation failed';
    errors     = Object.values(err.errors).map((e) => ({
      field:   e.path,
      message: e.message,
    }));
  }

  // MongoDB duplicate key
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    message    = `Duplicate value for ${field}. Please use a different value.`;
  }

  // JWT errors (also caught in auth middleware, but kept here as fallback)
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message    = 'Invalid token.';
  }
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message    = 'Token has expired.';
  }

  // Log in development
  if (process.env.NODE_ENV === 'development') {
    console.error('[errorHandler]', message);
  }

  return errorResponse(res, message, statusCode, errors);
};

module.exports = { notFound, errorHandler };
