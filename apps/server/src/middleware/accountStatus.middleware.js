const User = require('../models/User');
const { errorResponse } = require('../utils/apiResponse');

const checkAccountActive = async (req, res, next) => {
  if (!req.user?.id) return next();
  const user = await User.findById(req.user.id);
  if (user && (user.isDeleted || user.isSuspended)) {
    return errorResponse(res, 'Your account has been deactivated or suspended. Contact support.', 403);
  }
  next();
};

module.exports = checkAccountActive;
