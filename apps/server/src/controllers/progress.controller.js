const Progress = require('../models/Progress');
const Module = require('../models/Module');
const Enrollment = require('../models/Enrollment');
const { successResponse, errorResponse } = require('../utils/apiResponse');
const { calculateCourseProgress } = require('../utils/progressCalculator');

const updateLectureProgress = async (req, res, next) => {
  try {
    const { lectureId } = req.params;
    const { watchedPercent = 0, lastPositionSeconds = 0, isCompleted = false } = req.body;
    const studentId = req.user ? req.user.id : req.body.studentId;

    const mod = await Module.findOne({ 'lectures._id': lectureId });
    if (!mod) return errorResponse(res, 'Lecture not found', 404);

    const progress = await Progress.findOneAndUpdate(
      { student: studentId, lectureId },
      {
        course: mod.course,
        moduleId: mod._id,
        watchedPercent: Math.min(100, Math.max(0, watchedPercent)),
        lastPositionSeconds,
        isCompleted: Boolean(isCompleted || watchedPercent >= 90),
        completedAt: (isCompleted || watchedPercent >= 90) ? new Date() : null,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    await Enrollment.findOneAndUpdate(
      { student: studentId, course: mod.course },
      { lastActiveLecture: lectureId, lastActiveAt: new Date() }
    );
    const coursePercentage = await calculateCourseProgress(studentId, mod.course);
    return successResponse(res, { progress, coursePercentage }, 'Progress updated');
  } catch (err) {
    next(err);
  }
};

module.exports = { updateLectureProgress };

const { checkCertificateEligibility } = require('../services/certificate.service');

const getCertificateEligibility = async (req, res, next) => {
  try {
    const studentId = req.user ? req.user.id : req.query.studentId;
    const eligibility = await checkCertificateEligibility(studentId, req.params.courseId);
    return successResponse(res, eligibility);
  } catch (err) {
    next(err);
  }
};

module.exports.getCertificateEligibility = getCertificateEligibility;

const Bookmark = require('../models/Bookmark');

const addBookmark = async (req, res, next) => {
  try {
    const { lectureId } = req.params;
    const { courseId, timestampSeconds, label } = req.body;
    const studentId = req.user ? req.user.id : req.body.studentId;
    const bookmark = await Bookmark.create({
      student: studentId,
      course: courseId,
      lectureId,
      timestampSeconds,
      label,
    });
    return successResponse(res, { bookmark }, 'Bookmark created', 201);
  } catch (err) {
    next(err);
  }
};

module.exports.addBookmark = addBookmark;
