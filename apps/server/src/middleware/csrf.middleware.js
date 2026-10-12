const { errorResponse } = require('../utils/apiResponse');

const validateCSRF = (req, res, next) => {
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
    const customHeader = req.headers['x-requested-with'];
    if (!customHeader && process.env.NODE_ENV === 'production') {
      return errorResponse(res, 'CSRF verification failed: missing X-Requested-With header', 403);
    }
  }
  next();
};

module.exports = validateCSRF;
