const Course = require('../models/Course');
const Module = require('../models/Module');
const { successResponse, errorResponse } = require('../utils/apiResponse');

const getCourses = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, parseInt(req.query.limit, 10) || 12);
    const skip = (page - 1) * limit;

    const filter = { isPublished: true, isDeleted: false };
    if (req.query.category) filter.examCategory = req.query.category;
    const total = await Course.countDocuments(filter);
    const courses = await Course.find(filter)
      .populate('instructor', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return successResponse(res, { courses, total, page, limit });
  } catch (err) {
    next(err);
  }
};

module.exports = { getCourses };
