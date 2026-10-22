const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    moduleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Module',
      required: true,
    },
    lectureId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    watchedPercent: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    lastPositionSeconds: {
      type: Number,
      default: 0,
    },
    completedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

// High-frequency query indexes for progress dashboard
progressSchema.index({ student: 1, course: 1 });
progressSchema.index({ student: 1, lectureId: 1 }, { unique: true });
progressSchema.index({ student: 1, course: 1, isCompleted: 1 });
progressSchema.index({ course: 1, updatedAt: -1 });

module.exports = mongoose.model('Progress', progressSchema);
