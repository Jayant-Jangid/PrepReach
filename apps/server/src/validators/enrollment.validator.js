const Enrollment = require('../models/Enrollment');

const checkEnrollmentCapacity = async (course) => {
  if (!course.maxCapacity) return { canEnroll: true };
  const currentCount = await Enrollment.countDocuments({ course: course._id });
  if (currentCount >= course.maxCapacity) {
    return { canEnroll: false, reason: 'Course cohort has reached maximum enrollment capacity' };
  }
  return { canEnroll: true, remaining: course.maxCapacity - currentCount };
};

module.exports = { checkEnrollmentCapacity };
