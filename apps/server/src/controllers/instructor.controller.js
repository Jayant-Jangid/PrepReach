const Course = require('../models/Course');
const { successResponse } = require('../utils/apiResponse');

const getInstructorStats = async (req, res, next) => {
  try {
    const courses = await Course.find({ instructor: req.user.id, isDeleted: false });
    const totalCourses = courses.length;
    const totalEnrollments = courses.reduce((acc, c) => acc + (c.enrolledCount || 0), 0);
    return successResponse(res, { totalCourses, totalEnrollments, courses });
  } catch (err) {
    next(err);
  }
};

module.exports = { getInstructorStats };

const Enrollment = require('../models/Enrollment');

const getCourseStudentRoster = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const roster = await Enrollment.find({ course: courseId })
      .populate('student', 'name email avatar createdAt')
      .sort({ enrolledAt: -1 });
    return successResponse(res, { roster, count: roster.length });
  } catch (err) {
    next(err);
  }
};

module.exports.getCourseStudentRoster = getCourseStudentRoster;

const { calculateInstructorEarnings } = require('../services/payout.service');

const getInstructorEarnings = async (req, res, next) => {
  try {
    const courses = await Course.find({ instructor: req.user.id, isDeleted: false });
    const totalGross = courses.reduce((acc, c) => acc + ((c.price || 0) * (c.enrolledCount || 0)), 0);
    const earnings = calculateInstructorEarnings(totalGross);
    return successResponse(res, earnings);
  } catch (err) {
    next(err);
  }
};

module.exports.getInstructorEarnings = getInstructorEarnings;
