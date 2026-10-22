const Enrollment = require('../models/Enrollment');
const Progress = require('../models/Progress');
const { successResponse } = require('../utils/apiResponse');

const getStudentDashboard = async (req, res, next) => {
  try {
    const studentId = req.user ? req.user.id : req.query.studentId;
    const enrollments = await Enrollment.find({ student: studentId })
      .populate('course', 'title thumbnail totalLectures')
      .sort({ updatedAt: -1 });

    const completedLectures = await Progress.countDocuments({ student: studentId, isCompleted: true });
    const recentActivity = await Progress.find({ student: studentId })
      .sort({ updatedAt: -1 })
      .limit(5)
      .populate('course', 'title');

    return successResponse(res, {
      enrolledCount: enrollments.length,
      completedLectures,
      enrollments,
      recentActivity,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getStudentDashboard };
