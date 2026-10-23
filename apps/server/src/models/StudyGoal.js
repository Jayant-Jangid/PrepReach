const mongoose = require('mongoose');

const studyGoalSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    weeklyTargetHours: {
      type: Number,
      default: 15,
      min: 1,
      max: 80,
    },
    targetExamDate: {
      type: Date,
    },
    preferredStudyTrack: {
      type: String,
      enum: ['civil_service', 'public_banking', 'railway', 'municipal'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('StudyGoal', studyGoalSchema);
