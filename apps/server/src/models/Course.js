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
      max: [50000, 'Price cannot exceed 50,000 INR'],
    },
    thumbnail: {
      type: String,
      default: '',
    },
    difficulty: {
      type: String,
      enum: ['Foundation', 'Prelims', 'Mains', 'Interview', 'Comprehensive'],
      default: 'Comprehensive',
    },
    language: {
      type: String,
      default: 'English',
    },
    // Runtime duration auto-summed from modules
    totalDuration: {
      type: Number,
      default: 0,
    },
    totalLectures: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    tags: {
      type: [String],
      default: [],
    },
    prerequisites: {
      type: [String],
      default: [],
    },
    recommendedReadings: [
      {
        title: { type: String, required: true },
        author: { type: String, default: '' },
        linkUrl: { type: String, default: '' },
      },
    ],
  },
  { timestamps: true }
);

courseSchema.pre('findOneAndDelete', async function (next) {
  const doc = await this.model.findOne(this.getQuery());
  if (doc) {
    await mongoose.model('Module').deleteMany({ course: doc._id });
  }
  next();
});

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

courseSchema.index({ title: 'text', description: 'text', tags: 'text' });

courseSchema.virtual('modules', {
  ref: 'Module',
  localField: '_id',
  foreignField: 'course',
});

courseSchema.virtual('enrollmentsCount', {
  ref: 'Enrollment',
  localField: '_id',
  foreignField: 'course',
  count: true,
});

module.exports = mongoose.model('Course', courseSchema);
