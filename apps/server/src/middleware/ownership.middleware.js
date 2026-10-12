const { errorResponse } = require('../utils/apiResponse');

const requireOwnershipOrAdmin = (req, res, next) => {
  if (req.user?.role === 'admin' || req.params.userId === req.user?.id) {
    return next();
  }
  return errorResponse(res, 'Access denied. You may only manage your own profile.', 403);
};

module.exports = requireOwnershipOrAdmin;
