const Review = require('../models/Review');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const { successResponse, errorResponse } = require('../utils/apiResponse');

const submitCourseReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const courseId = req.params.courseId;
    const isEnrolled = await Enrollment.findOne({ student: req.user.id, course: courseId });
    if (!isEnrolled) {
      return errorResponse(res, 'Only enrolled candidates can submit reviews for this course', 403);
    }
    const review = await Review.findOneAndUpdate(
      { course: courseId, student: req.user.id },
      { rating, comment, isApproved: true },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    const reviews = await Review.find({ course: courseId, isApproved: true });
    const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await Course.findByIdAndUpdate(courseId, {
      averageRating: Number(avg.toFixed(1)),
      totalReviews: reviews.length,
    });
    return successResponse(res, { review }, 'Review submitted successfully', 201);
  } catch (err) {
    next(err);
  }
};

module.exports = { submitCourseReview };

const moderateReview = async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const { isApproved } = req.body;
    const review = await Review.findByIdAndUpdate(reviewId, { isApproved }, { new: true });
    if (!review) return errorResponse(res, 'Review not found', 404);
    const reviews = await Review.find({ course: review.course, isApproved: true });
    const avg = reviews.length ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;
    await Course.findByIdAndUpdate(review.course, {
      averageRating: Number(avg.toFixed(1)),
      totalReviews: reviews.length,
    });
    return successResponse(res, { review }, isApproved ? 'Review approved' : 'Review suppressed');
  } catch (err) {
    next(err);
  }
};

module.exports.moderateReview = moderateReview;
