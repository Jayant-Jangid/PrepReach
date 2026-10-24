const mongoose = require('mongoose');

const mockExamSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    examBatch: {
      type: String,
      required: true,
      index: true,
    },
    category: {
      type: String,
      enum: ['civil_service', 'public_banking', 'railway', 'municipal'],
      required: true,
    },
    correctCount: { type: Number, default: 0 },
    incorrectCount: { type: Number, default: 0 },
    unattemptedCount: { type: Number, default: 0 },
    netScore: { type: Number, default: 0 },
    percentile: { type: Number, default: 0 },
  },
  { timestamps: true }
);

mockExamSchema.index({ examBatch: 1, netScore: -1 });

module.exports = mongoose.model('MockExam', mockExamSchema);
