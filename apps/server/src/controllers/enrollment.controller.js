const Enrollment = require('../models/Enrollment');
const Course     = require('../models/Course');
const Module     = require('../models/Module');
const { successResponse, errorResponse } = require('../utils/apiResponse');

/**
 * POST /api/enrollments/:courseId
 * Enrols the authenticated student in a course.
 * Payment is stubbed as 'completed' (Razorpay integration deferred to Phase 5).
 */
const enrollCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) return errorResponse(res, 'Course not found.', 404);
    if (!course.isPublished) return errorResponse(res, 'Course is not available for enrolment.', 400);

    // Check for duplicate enrolment
    const existing = await Enrollment.findOne({ student: req.user.id, course: course._id });
    if (existing) return errorResponse(res, 'You are already enrolled in this course.', 409);

    const enrollment = await Enrollment.create({
      student:       req.user.id,
      course:        course._id,
      paymentStatus: 'completed', // payment stub
    });

    // Increment enrolledCount on the course
    await Course.findByIdAndUpdate(course._id, { $inc: { enrolledCount: 1 } });

    return successResponse(res, { enrollment }, 'Enrolled successfully.', 201);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/enrollments/my
 * Returns all courses the authenticated student is enrolled in, with progress.
 */
const getMyEnrollments = async (req, res, next) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user.id })
      .populate({
        path:   'course',
        select: 'title slug examCategory thumbnail totalLectures totalDuration price language instructor',
        populate: { path: 'instructor', select: 'name' },
      })
      .sort({ enrolledAt: -1 })
      .lean();

    return successResponse(res, { enrollments });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/enrollments/:courseId/progress
 * Updates watchedPercent for a specific lecture and recalculates overallProgress.
 * Body: { moduleId, lectureId, watchedPercent }
 */
const updateProgress = async (req, res, next) => {
  try {
    const { moduleId, lectureId, watchedPercent } = req.body;

    if (!moduleId || !lectureId || watchedPercent === undefined) {
      return errorResponse(res, 'moduleId, lectureId, and watchedPercent are required.', 400);
    }

    const enrollment = await Enrollment.findOne({
      student: req.user.id,
      course:  req.params.courseId,
    });

    if (!enrollment) return errorResponse(res, 'Enrolment not found.', 404);

    // Upsert the progress entry
    const entryIndex = enrollment.progress.findIndex(
      (p) =>
        p.moduleId?.toString() === moduleId &&
        p.lectureId?.toString() === lectureId
    );

    const pct = Math.min(100, Math.max(0, Number(watchedPercent)));

    if (entryIndex > -1) {
      enrollment.progress[entryIndex].watchedPercent = pct;
      if (pct === 100 && !enrollment.progress[entryIndex].completedAt) {
        enrollment.progress[entryIndex].completedAt = new Date();
      }
    } else {
      enrollment.progress.push({
        moduleId,
        lectureId,
        watchedPercent: pct,
        ...(pct === 100 ? { completedAt: new Date() } : {}),
      });
    }

    // Recalculate overallProgress
    const course  = await Course.findById(req.params.courseId).lean();
    const modules = await Module.find({ course: req.params.courseId }).lean();

    const totalLectures = modules.reduce((sum, m) => sum + m.lectures.length, 0);

    let overallProgress = 0;
    if (totalLectures > 0) {
      const totalWatched = enrollment.progress.reduce((sum, p) => sum + (p.watchedPercent || 0), 0);
      overallProgress = Math.round(totalWatched / totalLectures);
    }

    enrollment.overallProgress = Math.min(100, overallProgress);
    await enrollment.save();

    return successResponse(res, {
      progress:        enrollment.progress,
      overallProgress: enrollment.overallProgress,
    }, 'Progress updated.');
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/enrollments/:courseId/check
 * Returns whether the authenticated student is enrolled in the given course.
 */
const checkEnrollment = async (req, res, next) => {
  try {
    const enrollment = await Enrollment.findOne({
      student: req.user.id,
      course:  req.params.courseId,
    }).lean();

    return successResponse(res, {
      isEnrolled: !!enrollment,
      enrollment:  enrollment || null,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { enrollCourse, getMyEnrollments, updateProgress, checkEnrollment };
