const Progress = require('../models/Progress');
const Module = require('../models/Module');
const { successResponse, errorResponse } = require('../utils/apiResponse');

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

    return successResponse(res, { progress }, 'Progress updated');
  } catch (err) {
    next(err);
  }
};

module.exports = { updateLectureProgress };
