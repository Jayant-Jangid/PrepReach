const mongoose = require('mongoose');

const discussionSchema = new mongoose.Schema(
  {
    lectureId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    question: {
      type: String,
      required: [true, 'Question content is required'],
      trim: true,
    },
    upvotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    replies: [
      {
        author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        authorRole: { type: String, enum: ['instructor', 'student', 'admin'], default: 'student' },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Discussion', discussionSchema);
