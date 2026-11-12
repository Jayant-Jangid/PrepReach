const { errorResponse } = require('../utils/apiResponse');

/**
 * Returns Express middleware that restricts access to the specified roles.
 * req.user must already be set by the `protect` middleware.
 * @param {...string} roles - Allowed roles (e.g. 'admin', 'instructor')
 */
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return errorResponse(
        res,
        `Access denied. Required role: ${roles.join(' or ')}.`,
        403
      );
    }
    next();
  };
};

module.exports = { requireRole };
