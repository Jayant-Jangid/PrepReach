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

const { moderateReview } = require('./review.controller');
module.exports.moderateReview = moderateReview;

const Course = require('../models/Course');

const bulkUpdateCourseStatus = async (req, res, next) => {
  try {
    const { courseIds, isPublished, isArchived } = req.body;
    const updates = {};
    if (isPublished !== undefined) updates.isPublished = isPublished;
    if (isArchived !== undefined) {
      updates.isArchived = isArchived;
      if (isArchived) updates.archivedAt = new Date();
    }
    const result = await Course.updateMany(
      { _id: { $in: courseIds } },
      { $set: updates }
    );
    return successResponse(res, { modifiedCount: result.modifiedCount }, `Bulk status updated for ${result.modifiedCount} courses`);
  } catch (err) {
    next(err);
  }
};

module.exports.bulkUpdateCourseStatus = bulkUpdateCourseStatus;

const Enrollment = require('../models/Enrollment');

const getAdminEnrollmentsReport = async (req, res, next) => {
  try {
    const { startDate, endDate, courseId } = req.query;
    const filter = {};
    if (courseId) filter.course = courseId;
    if (startDate || endDate) {
      filter.enrolledAt = {};
      if (startDate) filter.enrolledAt.$gte = new Date(startDate);
      if (endDate) filter.enrolledAt.$lte = new Date(endDate);
    }
    const enrollments = await Enrollment.find(filter)
      .populate('student', 'name email')
      .populate('course', 'title price')
      .sort({ enrolledAt: -1 })
      .limit(100);
    const total = await Enrollment.countDocuments(filter);
    return successResponse(res, { total, enrollments });
  } catch (err) {
    next(err);
  }
};

module.exports.getAdminEnrollmentsReport = getAdminEnrollmentsReport;

const { logAuditAction } = require('../utils/auditLogger');

const adminUnenrollStudent = async (req, res, next) => {
  try {
    const { enrollmentId, reason } = req.body;
    const enrollment = await Enrollment.findByIdAndDelete(enrollmentId);
    if (!enrollment) return errorResponse(res, 'Enrollment not found', 404);

    logAuditAction('ADMIN_UNENROLL', {
      adminId: req.user ? req.user.id : 'admin',
      studentId: enrollment.student,
      courseId: enrollment.course,
      reason,
      timestamp: new Date(),
    });

    return successResponse(res, null, 'Student unenrolled with administrative audit log');
  } catch (err) {
    next(err);
  }
};

module.exports.adminUnenrollStudent = adminUnenrollStudent;
