const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');
const User = require('../models/User');

// @desc  Get all assignments
// @route GET /api/assignments
const getAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find({ isActive: true })
      .populate('mentorId', 'name')
      .sort({ createdAt: -1 });
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Create assignment
// @route POST /api/assignments
const createAssignment = async (req, res) => {
  try {
    const { title, description, subject, dueDate, maxMarks } = req.body;
    const assignment = await Assignment.create({
      title, description, subject, dueDate, maxMarks: maxMarks || 100,
      mentorId: req.user._id
    });

    // Notify all students
    const students = await User.find({ role: 'student' });
    await Promise.all(students.map(student =>
      User.findByIdAndUpdate(student._id, {
        $push: {
          notifications: {
            message: `New assignment posted: "${title}" for ${subject}. Due: ${new Date(dueDate).toLocaleDateString()}`,
            read: false
          }
        }
      })
    ));

    res.status(201).json(assignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Update assignment
// @route PUT /api/assignments/:id
const updateAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(assignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Delete assignment
// @route DELETE /api/assignments/:id
const deleteAssignment = async (req, res) => {
  try {
    await Assignment.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ message: 'Assignment deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Submit assignment
// @route POST /api/assignments/:id/submit
const submitAssignment = async (req, res) => {
  try {
    const { submissionText } = req.body;
    const existing = await Submission.findOne({ assignmentId: req.params.id, studentId: req.user._id });
    if (existing) return res.status(400).json({ message: 'Already submitted' });

    const assignment = await Assignment.findById(req.params.id);
    const isLate = new Date() > new Date(assignment.dueDate);

    const submission = await Submission.create({
      assignmentId: req.params.id,
      studentId: req.user._id,
      submissionText,
      status: isLate ? 'late' : 'submitted'
    });
    res.status(201).json(submission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Get submissions for an assignment (mentor)
// @route GET /api/assignments/:id/submissions
const getSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ assignmentId: req.params.id })
      .populate('studentId', 'name email enrollmentNumber');
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Get all submissions for a student
// @route GET /api/assignments/my-submissions
const getMySubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ studentId: req.user._id })
      .populate('assignmentId');
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Grade a submission
// @route PUT /api/assignments/submissions/:id/grade
const gradeSubmission = async (req, res) => {
  try {
    const { marks, feedback } = req.body;
    const submission = await Submission.findByIdAndUpdate(
      req.params.id,
      { marks, feedback, status: 'graded' },
      { new: true }
    );

    await User.findByIdAndUpdate(submission.studentId, {
      $push: {
        notifications: {
          message: `Your assignment has been graded! Marks: ${marks}. Feedback: ${feedback || 'N/A'}`,
          read: false
        }
      }
    });

    res.json(submission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAssignments, createAssignment, updateAssignment, deleteAssignment, submitAssignment, getSubmissions, getMySubmissions, gradeSubmission };
