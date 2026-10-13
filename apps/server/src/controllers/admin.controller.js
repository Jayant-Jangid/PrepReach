const User = require('../models/User');
const { successResponse } = require('../utils/apiResponse');
const { parsePagination } = require('../utils/pagination');

const listUsers = async (req, res, next) => {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const users = await User.find().skip(skip).limit(limit).select('-refreshToken');
    const total = await User.countDocuments();
    return successResponse(res, { users, total, page, limit });
  } catch (err) {
    next(err);
  }
};

module.exports = { listUsers };

const toggleUserSuspension = async (req, res, next) => {
  try {
    const { userId, isSuspended } = req.body;
    const user = await User.findByIdAndUpdate(userId, { isSuspended }, { new: true });
    return successResponse(res, { user }, isSuspended ? 'Account suspended' : 'Account restored');
  } catch (err) {
    next(err);
  }
};

module.exports.toggleUserSuspension = toggleUserSuspension;
