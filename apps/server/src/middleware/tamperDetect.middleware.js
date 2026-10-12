const { errorResponse } = require('../utils/apiResponse');

const detectTamperedToken = (err, req, res, next) => {
  if (err.name === 'JsonWebTokenError') {
    console.warn(`[security:alert] Potential token tampering from ${req.ip} targeting ${req.originalUrl}`);
    return errorResponse(res, 'Security violation: Tampered token detected', 401);
  }
  next(err);
};

module.exports = detectTamperedToken;
