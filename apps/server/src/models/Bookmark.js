const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema(
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
    lectureId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    timestampSeconds: {
      type: Number,
      required: true,
    },
    label: {
      type: String,
      default: 'Key Concept',
      trim: true,
    },
  },
  { timestamps: true }
);

bookmarkSchema.index({ student: 1, lectureId: 1, timestampSeconds: 1 });

module.exports = mongoose.model('Bookmark', bookmarkSchema);
