const mongoose = require('mongoose');

const instructorProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    headline: {
      type: String,
      default: '',
    },
    bio: {
      type: String,
      default: '',
    },
    qualifications: {
      type: [String],
      default: [],
    },
    yearsOfExperience: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 5.0,
      min: 1,
      max: 5,
    },
    totalStudents: {
      type: Number,
      default: 0,
    },
    payoutDetails: {
      bankAccountNumber: String,
      ifscCode: String,
      upiId: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('InstructorProfile', instructorProfileSchema);
