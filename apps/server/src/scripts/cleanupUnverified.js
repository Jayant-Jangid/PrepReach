const User = require('../models/User');

const cleanupUnverifiedUsers = async () => {
  const threshold = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const result = await User.deleteMany({ isVerified: false, createdAt: { $lt: threshold } });
  console.log(`[cleanup] Removed ${result.deletedCount} expired unverified registrations.`);
};

module.exports = cleanupUnverifiedUsers;
