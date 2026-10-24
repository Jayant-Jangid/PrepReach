const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const { successResponse, errorResponse } = require('../utils/apiResponse');

const enrollInCourse = async (req, res, next) => {
  try {
    const courseId = req.params.id;
    const course = await Course.findById(courseId);
    if (!course) return errorResponse(res, 'Course not found', 404);

    const studentId = req.user ? req.user.id : req.body.studentId;
    const existing = await Enrollment.findOne({ student: studentId, course: courseId });
    if (existing) {
      return errorResponse(res, 'Candidate is already enrolled in this course', 409);
    }

    const enrollment = new Enrollment({
      student: req.user ? req.user.id : req.body.studentId,
      course: courseId,
      paymentStatus: course.price === 0 ? 'completed' : 'pending',
    });
    await enrollment.save();
    return successResponse(res, { enrollment }, 'Enrolled in course successfully', 201);
  } catch (err) {
    next(err);
  }
};

module.exports = { enrollInCourse };

const getStudentEnrollments = async (req, res, next) => {
  try {
    const studentId = req.user ? req.user.id : req.params.studentId;
    const enrollments = await Enrollment.find({ student: studentId })
      .populate({
        path: 'course',
        select: 'title slug thumbnail difficulty examCategory totalLectures',
        populate: { path: 'instructor', select: 'name avatar' }
      })
      .sort({ enrolledAt: -1 });
    const formatted = enrollments.map(e => ({
      ...e.toObject(),
      statusBadge: e.getStatusBadge ? e.getStatusBadge() : 'Active',
    }));
    return successResponse(res, { enrollments: formatted });
  } catch (err) {
    next(err);
  }
};

module.exports.getStudentEnrollments = getStudentEnrollments;
