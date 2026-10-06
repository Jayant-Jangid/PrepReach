const mongoose = require('mongoose');

const lectureSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Lecture title is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['video', 'live', 'material'],
      default: 'video',
    },
    videoUrl: {
      type: String,
      default: '',
      validate: {
        validator: function(v) {
          if (!v) return true;
          return /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be|vimeo\.com|player\.vimeo\.com)\/.+/.test(v);
        },
        message: 'videoUrl must be a valid YouTube or Vimeo streaming URL'
      }
    },
    materialUrl: {
      type: String,
      default: '',
    },
    duration: {
      type: Number,
      default: 0,
    },
    isPreview: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
    },
    scheduledAt: {
      type: Date,
    },
  },
  { _id: true }
);

const moduleSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'Course reference is required'],
    },
    title: {
      type: String,
      required: [true, 'Module title is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    order: {
      type: Number,
      required: [true, 'Module order is required'],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    lectures: {
      type: [lectureSchema],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Module', moduleSchema);
