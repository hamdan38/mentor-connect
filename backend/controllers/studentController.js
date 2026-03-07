const User = require('../models/User');
const Attendance = require('../models/Attendance');
const Marks = require('../models/Marks');
const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');

// @desc  Get all students
// @route GET /api/students
const getAllStudents = async (req, res) => {
  try {
    const search = req.query.search || '';
    const students = await User.find({
      role: 'student',
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { enrollmentNumber: { $regex: search, $options: 'i' } }
      ]
    }).select('-password');
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Get student by ID
// @route GET /api/students/:id
const getStudentById = async (req, res) => {
  try {
    const student = await User.findById(req.params.id).select('-password');
    if (!student || student.role !== 'student') return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Get student dashboard stats
// @route GET /api/students/:id/stats
const getStudentStats = async (req, res) => {
  try {
    const studentId = req.params.id || req.user._id;
    const attendance = await Attendance.find({ studentId });
    const marks = await Marks.find({ studentId });
    const submissions = await Submission.find({ studentId });
    const assignments = await Assignment.find({ isActive: true });

    const avgAttendance = attendance.length
      ? (attendance.reduce((sum, a) => sum + a.attendancePercentage, 0) / attendance.length).toFixed(1)
      : 0;

    res.json({
      totalSubjects: marks.length,
      avgAttendance,
      submissionsCount: submissions.length,
      pendingAssignments: assignments.length - submissions.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllStudents, getStudentById, getStudentStats };
