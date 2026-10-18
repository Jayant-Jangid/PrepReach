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
    if (req.query.difficulty) filter.difficulty = req.query.difficulty;
    if (req.query.language) filter.language = req.query.language;
    if (req.query.search) filter.title = { $regex: req.query.search, $options: 'i' };
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

const getCourseById = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id).populate('instructor', 'name email');
    if (!course || course.isDeleted) return errorResponse(res, 'Course not found', 404);
    const modules = await Module.find({ course: course._id, isDeleted: false }).sort({ order: 1 });
    // Strip non-preview URLs for guests
    const sanitizedModules = modules.map((m) => {
      const obj = m.toObject();
      obj.lectures = obj.lectures.map((l) => ({
        ...l,
        videoUrl: l.isPreview ? l.videoUrl : '',
      }));
      return obj;
    });
    return successResponse(res, { course, modules: sanitizedModules });
  } catch (err) {
    next(err);
  }
};

module.exports.getCourseById = getCourseById;

const createCourse = async (req, res, next) => {
  try {
    const { title, description, examCategory, price, thumbnail, language } = req.body;
    const course = await Course.create({
      title,
      description,
      examCategory,
      price,
      thumbnail: thumbnail || '',
      language: language || 'English',
      instructor: req.user.id,
      isPublished: false,
    });
    return successResponse(res, { course }, 'Course drafted successfully', 201);
  } catch (err) {
    next(err);
  }
};

module.exports.createCourse = createCourse;

const updateCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course || course.isDeleted) return errorResponse(res, 'Course not found', 404);
    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return errorResponse(res, 'Unauthorized to modify this course', 403);
    }
    const allowed = ['title', 'description', 'examCategory', 'price', 'thumbnail', 'language', 'tags'];
    for (const key of allowed) {
      if (req.body[key] !== undefined) course[key] = req.body[key];
    }
    await course.save();
    return successResponse(res, { course }, 'Course updated successfully');
  } catch (err) {
    next(err);
  }
};

module.exports.updateCourse = updateCourse;

const addModule = async (req, res, next) => {
  try {
    const { title, description, order } = req.body;
    const moduleDoc = await Module.create({
      course: req.params.id,
      title,
      description: description || '',
      order: order || 1,
      lectures: [],
    });
    return successResponse(res, { module: moduleDoc }, 'Module created successfully', 201);
  } catch (err) {
    next(err);
  }
};

module.exports.addModule = addModule;

const addLecture = async (req, res, next) => {
  try {
    const { title, videoUrl, duration, isPreview } = req.body;
    const moduleDoc = await Module.findById(req.params.id);
    if (!moduleDoc) return errorResponse(res, 'Module not found', 404);
    moduleDoc.lectures.push({
      title,
      videoUrl: videoUrl || '',
      duration: duration || 0,
      isPreview: !!isPreview,
      order: moduleDoc.lectures.length + 1,
    });
    await moduleDoc.save();
    return successResponse(res, { module: moduleDoc }, 'Lecture added successfully', 201);
  } catch (err) {
    next(err);
  }
};

module.exports.addLecture = addLecture;

const reorderModules = async (req, res, next) => {
  try {
    const { moduleOrders } = req.body; // array of { id, order }
    for (const item of (moduleOrders || [])) {
      await Module.findByIdAndUpdate(item.id, { order: item.order });
    }
    return successResponse(res, null, 'Curriculum sequence reordered successfully');
  } catch (err) {
    next(err);
  }
};

module.exports.reorderModules = reorderModules;

const publishCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return errorResponse(res, 'Course not found', 404);
    const modules = await Module.find({ course: course._id });
    if (modules.length === 0 && !course.isPublished) {
      return errorResponse(res, 'Cannot publish course without at least one syllabus module', 400);
    }
    course.isPublished = !course.isPublished;
    await course.save();
    return successResponse(res, { course }, `Course ${course.isPublished ? 'published' : 'unpublished'}`);
  } catch (err) {
    next(err);
  }
};

module.exports.publishCourse = publishCourse;

const deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return errorResponse(res, 'Course not found', 404);
    course.isDeleted = true;
    course.deletedAt = new Date();
    await course.save();
    return successResponse(res, null, 'Course archived successfully');
  } catch (err) {
    next(err);
  }
};

module.exports.deleteCourse = deleteCourse;
