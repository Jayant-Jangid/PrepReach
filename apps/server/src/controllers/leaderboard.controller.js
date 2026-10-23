const Progress = require('../models/Progress');
const User = require('../models/User');
const { successResponse } = require('../utils/apiResponse');

const getCategoryLeaderboard = async (req, res, next) => {
  try {
    const { category = 'civil_service' } = req.query;

    const leaderboard = await Progress.aggregate([
      { $match: { isCompleted: true } },
      {
        $group: {
          _id: '$student',
          completedCount: { $sum: 1 },
          lastActive: { $max: '$completedAt' }
        }
      },
      { $sort: { completedCount: -1, lastActive: 1 } },
      { $limit: 20 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          studentId: '$_id',
          name: '$user.name',
          avatar: '$user.avatar',
          completedCount: 1,
          lastActive: 1,
        }
      }
    ]);

    const ranked = leaderboard.map((item, index) => ({
      rank: index + 1,
      ...item,
    }));

    return successResponse(res, { category, leaderboard: ranked });
  } catch (err) {
    next(err);
  }
};

module.exports.getCategoryLeaderboard = getCategoryLeaderboard;
