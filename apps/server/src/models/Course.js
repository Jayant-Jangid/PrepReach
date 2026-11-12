const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Course title is required'],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Course description is required'],
    },
    examCategory: {
      type: String,
      enum: ['civil_service', 'public_banking', 'railway', 'municipal'],
      required: [true, 'Exam category is required'],
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Instructor is required'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    thumbnail: {
      type: String,
      default: '',
    },
    language: {
      type: String,
      default: 'English',
    },
    totalDuration: {
      type: Number,
      default: 0, // in minutes
    },
    totalLectures: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    enrolledCount: {
      type: Number,
      default: 0,
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

/**
 * Auto-generate slug from title before saving.
 * Appends a random suffix to avoid collisions.
 */
courseSchema.pre('save', function (next) {
  if (this.isModified('title') || this.isNew) {
    const base = this.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');
    const suffix = Math.floor(1000 + Math.random() * 9000);
    this.slug = `${base}-${suffix}`;
  }
  next();
});

module.exports = mongoose.model('Course', courseSchema);
