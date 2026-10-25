const Discussion = require('../models/Discussion');
const { successResponse, errorResponse } = require('../utils/apiResponse');

const createQuestion = async (req, res, next) => {
  try {
    const { lectureId } = req.params;
    const { courseId, question } = req.body;
    const studentId = req.user ? req.user.id : req.body.studentId;
    const discussion = await Discussion.create({
      lectureId,
      courseId,
      student: studentId,
      question,
    });
    return successResponse(res, { discussion }, 'Question posted', 201);
  } catch (err) {
    next(err);
  }
};

const getLectureQuestions = async (req, res, next) => {
  try {
    const { lectureId } = req.params;
    const discussions = await Discussion.find({ lectureId })
      .populate('student', 'name avatar')
      .populate('replies.author', 'name avatar role')
      .sort({ createdAt: -1 });
    return successResponse(res, { discussions });
  } catch (err) {
    next(err);
  }
};

module.exports = { createQuestion, getLectureQuestions };
