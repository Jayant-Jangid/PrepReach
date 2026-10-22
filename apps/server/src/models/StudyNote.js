const mongoose = require('mongoose');

const studyNoteSchema = new mongoose.Schema(
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
    lectureId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    timestampSeconds: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

studyNoteSchema.index({ student: 1, lectureId: 1 });

module.exports = mongoose.model('StudyNote', studyNoteSchema);
