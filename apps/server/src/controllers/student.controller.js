const Enrollment = require('../models/Enrollment');
const Progress = require('../models/Progress');
const { successResponse } = require('../utils/apiResponse');
const { calculateDailyStudyStreak } = require('../utils/streakCalculator');

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
      streak: await calculateDailyStudyStreak(studentId),
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getStudentDashboard };

const StudySession = require('../models/StudySession');

const logStudySession = async (req, res, next) => {
  try {
    const { courseId, durationMinutes } = req.body;
    const studentId = req.user ? req.user.id : req.body.studentId;
    const session = await StudySession.create({
      student: studentId,
      course: courseId,
      durationMinutes,
    });
    return successResponse(res, { session }, 'Study session logged', 201);
  } catch (err) {
    next(err);
  }
};

module.exports.logStudySession = logStudySession;
