const { errorResponse } = require('../utils/apiResponse');

const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return errorResponse(res, `Access denied. Requires one of: ${allowedRoles.join(', ')}`, 403);
    }
    next();
  };
};

module.exports = { requireRole };
