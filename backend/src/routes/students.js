const express = require('express');
const mongoose = require('mongoose');
const Student = require('../models/Student');

const router = express.Router();

// List every student.
router.get('/', async (req, res, next) => {
  try {
    const students = await Student.find().sort({ name: 1 });
    res.json(students);
  } catch (error) {
    next(error);
  }
});

// Find one student by MongoDB ID.
router.get('/:id', async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid student ID' });
    }

    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json(student);
  } catch (error) {
    next(error);
  }
});

// Create a student after checking the required fields.
router.post('/', async (req, res, next) => {
  try {
    const { name, email, course } = req.body;
    if (
      typeof name !== 'string' || !name.trim() ||
      typeof email !== 'string' || !email.trim() ||
      typeof course !== 'string' || !course.trim()
    ) {
      return res.status(400).json({
        error: 'Name, email, and course are required as non-empty strings',
      });
    }

    const student = await Student.create({ name, email, course });
    res.status(201).json(student);
  } catch (error) {
    next(error);
  }
});

// Delete a student by MongoDB ID.
router.delete('/:id', async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid student ID' });
    }

    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json({ message: 'Student deleted successfully', student });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
