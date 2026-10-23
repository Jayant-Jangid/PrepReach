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

const StudyNote = require('../models/StudyNote');

const saveStudyNote = async (req, res, next) => {
  try {
    const { lectureId } = req.params;
    const { courseId, content, timestampSeconds } = req.body;
    const studentId = req.user ? req.user.id : req.body.studentId;
    const note = await StudyNote.create({
      student: studentId,
      course: courseId,
      lectureId,
      content,
      timestampSeconds,
    });
    return successResponse(res, { note }, 'Study note saved', 201);
  } catch (err) {
    next(err);
  }
};

module.exports.saveStudyNote = saveStudyNote;

const checkpointPlaybackPosition = async (req, res, next) => {
  try {
    const { lectureId } = req.params;
    const { positionSeconds } = req.body;
    const studentId = req.user ? req.user.id : req.body.studentId;
    await Progress.updateOne(
      { student: studentId, lectureId },
      { $set: { lastPositionSeconds: positionSeconds, updatedAt: new Date() } }
    );
    return successResponse(res, null, 'Checkpoint updated');
  } catch (err) {
    next(err);
  }
};

module.exports.checkpointPlaybackPosition = checkpointPlaybackPosition;

const markAllModuleLecturesComplete = async (req, res, next) => {
  try {
    const { moduleId } = req.params;
    const studentId = req.user ? req.user.id : req.body.studentId;
    const mod = await Module.findById(moduleId);
    if (!mod) return errorResponse(res, 'Module not found', 404);

    const ops = mod.lectures.map(lec => ({
      updateOne: {
        filter: { student: studentId, lectureId: lec._id },
        update: {
          $set: {
            course: mod.course,
            moduleId: mod._id,
            watchedPercent: 100,
            isCompleted: true,
            completedAt: new Date(),
          }
        },
        upsert: true,
      }
    }));

    if (ops.length > 0) {
      await Progress.bulkWrite(ops);
    }
    return successResponse(res, null, `Marked ${ops.length} lectures complete`);
  } catch (err) {
    next(err);
  }
};

module.exports.markAllModuleLecturesComplete = markAllModuleLecturesComplete;

const getModuleProgress = async (req, res, next) => {
  try {
    const { moduleId } = req.params;
    const studentId = req.user ? req.user.id : req.query.studentId;
    const mod = await Module.findById(moduleId);
    if (!mod) return errorResponse(res, 'Module not found', 404);
    const lectureIds = mod.lectures.map(l => l._id);
    const completed = await Progress.countDocuments({
      student: studentId,
      lectureId: { $in: lectureIds },
      isCompleted: true,
    });
    const percent = lectureIds.length ? Math.round((completed / lectureIds.length) * 100) : 0;
    return successResponse(res, { moduleId, total: lectureIds.length, completed, percentage: percent });
  } catch (err) {
    next(err);
  }
};

module.exports.getModuleProgress = getModuleProgress;

const resetCourseProgress = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const studentId = req.user ? req.user.id : req.body.studentId;
    await Progress.deleteMany({ student: studentId, course: courseId });
    await Enrollment.updateOne(
      { student: studentId, course: courseId },
      { $set: { lastActiveLecture: null } }
    );
    return successResponse(res, null, 'Course progress reset successfully for repeat exam cycle');
  } catch (err) {
    next(err);
  }
};

module.exports.resetCourseProgress = resetCourseProgress;
