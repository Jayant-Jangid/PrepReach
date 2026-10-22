const mongoose = require('mongoose');

const studySessionSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    durationMinutes: {
      type: Number,
      required: true,
      min: 1,
    },
    sessionDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

studySessionSchema.index({ student: 1, sessionDate: -1 });

module.exports = mongoose.model('StudySession', studySessionSchema);
