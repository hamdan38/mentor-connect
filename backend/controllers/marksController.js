const Marks = require('../models/Marks');
const User = require('../models/User');

// @desc  Get marks for a student
// @route GET /api/marks/:studentId
const getMarks = async (req, res) => {
  try {
    const marks = await Marks.find({ studentId: req.params.studentId });
    res.json(marks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Add or update marks
// @route POST /api/marks
const upsertMarks = async (req, res) => {
  try {
    const { studentId, subject, marks, maxMarks, examType, remarks } = req.body;

    let record = await Marks.findOne({ studentId, subject, examType });
    if (record) {
      record.marks = marks;
      record.maxMarks = maxMarks || 100;
      record.remarks = remarks;
      record.updatedBy = req.user._id;
      await record.save();
    } else {
      record = await Marks.create({
        studentId, subject, marks, maxMarks: maxMarks || 100,
        examType: examType || 'internal', remarks, updatedBy: req.user._id
      });
    }

    await User.findByIdAndUpdate(studentId, {
      $push: {
        notifications: {
          message: `Your ${examType || 'internal'} marks for ${subject} have been updated: ${marks}/${maxMarks || 100}`,
          read: false
        }
      }
    });

    res.status(200).json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Get all marks (mentor view)
// @route GET /api/marks
const getAllMarks = async (req, res) => {
  try {
    const marks = await Marks.find({}).populate('studentId', 'name email enrollmentNumber');
    res.json(marks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Delete marks record
// @route DELETE /api/marks/:id
const deleteMarks = async (req, res) => {
  try {
    await Marks.findByIdAndDelete(req.params.id);
    res.json({ message: 'Marks record deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getMarks, upsertMarks, getAllMarks, deleteMarks };
