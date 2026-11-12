const Course     = require('../models/Course');
const Module     = require('../models/Module');
const Enrollment = require('../models/Enrollment');
const { successResponse, errorResponse } = require('../utils/apiResponse');

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Checks whether the requesting user is authorised to modify a course.
 * Admins can modify any course; instructors only their own.
 */
const canModifyCourse = (course, user) => {
  if (user.role === 'admin') return true;
  return course.instructor.toString() === user.id;
};

// ─── Controllers ─────────────────────────────────────────────────────────────

/**
 * POST /api/courses
 * Creates a new course (instructor/admin only).
 */
const createCourse = async (req, res, next) => {
  try {
    const { title, description, examCategory, price, thumbnail, language, tags } = req.body;

    const course = await Course.create({
      title,
      description,
      examCategory,
      price,
      instructor: req.user.id,
      thumbnail:  thumbnail  || '',
      language:   language   || 'English',
      tags:       tags       || [],
    });

    return successResponse(res, { course }, 'Course created successfully.', 201);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/courses
 * Public paginated list with filters: examCategory, minPrice, maxPrice, search.
 * If the requester is an enrolled student, includes enrolledAt for each course.
 */
const getCourses = async (req, res, next) => {
  try {
    const {
      examCategory,
      minPrice,
      maxPrice,
      search,
      page  = 1,
      limit = 12,
    } = req.query;

    const filter = { isPublished: true };

    if (examCategory) filter.examCategory = examCategory;
    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined) filter.price.$gte = Number(minPrice);
      if (maxPrice !== undefined) filter.price.$lte = Number(maxPrice);
    }
    if (search) {
      filter.title = { $regex: search, $options: 'i' };
    }

    const skip  = (Number(page) - 1) * Number(limit);
    const total = await Course.countDocuments(filter);

    const courses = await Course.find(filter)
      .populate('instructor', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean();

    // If authenticated student, attach enrolledAt
    if (req.user) {
      const courseIds = courses.map((c) => c._id);
      const enrollments = await Enrollment.find({
        student: req.user.id,
        course:  { $in: courseIds },
      }).lean();

      const enrollMap = {};
      enrollments.forEach((e) => {
        enrollMap[e.course.toString()] = e.enrolledAt;
      });

      courses.forEach((c) => {
        c.enrolledAt = enrollMap[c._id.toString()] || null;
      });
    }

    return successResponse(res, {
      courses,
      pagination: {
        total,
        page:       Number(page),
        limit:      Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/courses/:id
 * Full course with modules. Non-enrolled users cannot see non-preview lecture URLs.
 */
const getCourseById = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'name email')
      .lean();

    if (!course) return errorResponse(res, 'Course not found.', 404);
    if (!course.isPublished && req.user?.role !== 'admin' && course.instructor._id?.toString() !== req.user?.id) {
      return errorResponse(res, 'Course not found.', 404);
    }

    const modules = await Module.find({ course: course._id }).sort({ order: 1 }).lean();

    // Check enrollment
    let isEnrolled = false;
    if (req.user) {
      const enrollment = await Enrollment.findOne({ student: req.user.id, course: course._id });
      isEnrolled = !!enrollment;
    }

    // Hide non-preview URLs for non-enrolled visitors
    if (!isEnrolled) {
      modules.forEach((mod) => {
        mod.lectures = mod.lectures.map((lec) => {
          if (!lec.isPreview) {
            return { ...lec, videoUrl: '', materialUrl: '' };
          }
          return lec;
        });
      });
    }

    return successResponse(res, { course, modules, isEnrolled });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/courses/:id/modules
 * Adds a module to a course (instructor of course or admin).
 */
const addModule = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return errorResponse(res, 'Course not found.', 404);
    if (!canModifyCourse(course, req.user)) {
      return errorResponse(res, 'Not authorised to modify this course.', 403);
    }

    const { title, description, order } = req.body;

    // Auto-calculate order if not provided
    const resolvedOrder = order !== undefined
      ? order
      : (await Module.countDocuments({ course: course._id })) + 1;

    const module = await Module.create({
      course:      course._id,
      title,
      description: description || '',
      order:       resolvedOrder,
    });

    return successResponse(res, { module }, 'Module added.', 201);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/courses/:id/modules/:moduleId/lectures
 * Adds a lecture to a module (instructor of course or admin).
 */
const addLecture = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return errorResponse(res, 'Course not found.', 404);
    if (!canModifyCourse(course, req.user)) {
      return errorResponse(res, 'Not authorised to modify this course.', 403);
    }

    const module = await Module.findOne({ _id: req.params.moduleId, course: course._id });
    if (!module) return errorResponse(res, 'Module not found.', 404);

    const { title, type, videoUrl, materialUrl, duration, isPreview, order, scheduledAt } = req.body;

    const lecture = {
      title,
      type:        type        || 'video',
      videoUrl:    videoUrl    || '',
      materialUrl: materialUrl || '',
      duration:    duration    || 0,
      isPreview:   isPreview   || false,
      order:       order !== undefined ? order : module.lectures.length + 1,
      scheduledAt: scheduledAt || undefined,
    };

    module.lectures.push(lecture);
    await module.save();

    // Update course aggregate stats
    const allModules = await Module.find({ course: course._id }).lean();
    const totalLectures = allModules.reduce((sum, m) => sum + m.lectures.length, 0);
    const totalDuration  = allModules.reduce((sum, m) =>
      sum + m.lectures.reduce((s, l) => s + (l.duration || 0), 0), 0);

    await Course.findByIdAndUpdate(course._id, { totalLectures, totalDuration });

    return successResponse(res, { lecture: module.lectures[module.lectures.length - 1] }, 'Lecture added.', 201);
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/courses/:id
 * Updates course details (instructor of own course or admin).
 */
const updateCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return errorResponse(res, 'Course not found.', 404);
    if (!canModifyCourse(course, req.user)) {
      return errorResponse(res, 'Not authorised to modify this course.', 403);
    }

    const allowed = ['title', 'description', 'examCategory', 'price', 'thumbnail', 'language', 'tags'];
    allowed.forEach((field) => {
      if (req.body[field] !== undefined) course[field] = req.body[field];
    });

    await course.save();
    return successResponse(res, { course }, 'Course updated successfully.');
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/courses/:id/publish
 * Toggles isPublished (instructor of own course or admin).
 */
const publishCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return errorResponse(res, 'Course not found.', 404);
    if (!canModifyCourse(course, req.user)) {
      return errorResponse(res, 'Not authorised to modify this course.', 403);
    }

    course.isPublished = !course.isPublished;
    await course.save();

    const status = course.isPublished ? 'published' : 'unpublished';
    return successResponse(res, { course }, `Course ${status} successfully.`);
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/courses/:id
 * Deletes a course (admin only — enforced at router level).
 */
const deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return errorResponse(res, 'Course not found.', 404);

    // Clean up associated modules
    await Module.deleteMany({ course: req.params.id });

    return successResponse(res, null, 'Course deleted successfully.');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createCourse,
  getCourses,
  getCourseById,
  addModule,
  addLecture,
  updateCourse,
  publishCourse,
  deleteCourse,
};
