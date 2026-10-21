const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const { successResponse, errorResponse } = require('../utils/apiResponse');

const enrollInCourse = async (req, res, next) => {
  try {
    const courseId = req.params.id;
    const course = await Course.findById(courseId);
    if (!course) return errorResponse(res, 'Course not found', 404);

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
