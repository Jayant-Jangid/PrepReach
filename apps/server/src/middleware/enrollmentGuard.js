const Enrollment = require('../models/Enrollment');
const Module = require('../models/Module');
const { errorResponse } = require('../utils/apiResponse');

const verifyLectureAccess = async (req, res, next) => {
  try {
    const { lectureId } = req.params;
    const mod = await Module.findOne({ 'lectures._id': lectureId });
    if (!mod) return errorResponse(res, 'Lecture not found', 404);
    const lecture = mod.lectures.id(lectureId);
    if (lecture && lecture.isPreview) return next();

    const studentId = req.user ? req.user.id : null;
    if (!studentId) return errorResponse(res, 'Authentication required', 401);

    const enrollment = await Enrollment.findOne({
      student: studentId,
      course: mod.course,
    });

    if (!enrollment) {
      return errorResponse(res, 'Active course enrollment required to access this lecture', 403);
    }
    req.enrollment = enrollment;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = { verifyLectureAccess };
