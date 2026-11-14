const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email'],
    },
    course: {
      type: String,
      required: [true, 'Course is required'],
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Student', studentSchema);
