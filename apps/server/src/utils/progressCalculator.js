const Progress = require('../models/Progress');
const Module = require('../models/Module');

const calculateCourseProgress = async (studentId, courseId) => {
  const modules = await Module.find({ course: courseId, isDeleted: false });
  const totalLectures = modules.reduce((acc, m) => acc + (m.lectures ? m.lectures.length : 0), 0);
  if (totalLectures === 0) return 0;

  const completedCount = await Progress.countDocuments({
    student: studentId,
    course: courseId,
    isCompleted: true,
  });

  const percentage = Math.min(100, Math.round((completedCount / totalLectures) * 100));
  return percentage;
};

module.exports = { calculateCourseProgress };
