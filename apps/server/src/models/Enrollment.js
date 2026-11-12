const mongoose = require('mongoose');

const progressEntrySchema = new mongoose.Schema(
  {
    moduleId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    lectureId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    watchedPercent: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    completedAt: {
      type: Date,
    },
  },
  { _id: false }
);

const enrollmentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Student is required'],
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'Course is required'],
    },
    enrolledAt: {
      type: Date,
      default: Date.now,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },
    paymentId: {
      type: String,
      default: '', // placeholder for Razorpay integration (Phase 5)
    },
    progress: {
      type: [progressEntrySchema],
      default: [],
    },
    overallProgress: {
      type: Number,
      default: 0, // percentage 0–100
      min: 0,
      max: 100,
    },
  },
  { timestamps: true }
);

// Unique compound index — a student can only enroll once per course
enrollmentSchema.index({ student: 1, course: 1 }, { unique: true });

module.exports = mongoose.model('Enrollment', enrollmentSchema);
