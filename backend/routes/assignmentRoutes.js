const express = require('express');
const router = express.Router();
const {
  getAssignments, createAssignment, updateAssignment, deleteAssignment,
  submitAssignment, getSubmissions, getMySubmissions, gradeSubmission
} = require('../controllers/assignmentController');
const { protect, mentorOnly, studentOnly } = require('../middleware/authMiddleware');

// ⚠️ Static routes MUST be declared before dynamic /:id routes
router.get('/student/my-submissions', protect, studentOnly, getMySubmissions);
router.put('/submissions/:id/grade', protect, mentorOnly, gradeSubmission);

router.get('/', protect, getAssignments);
router.post('/', protect, mentorOnly, createAssignment);
router.put('/:id', protect, mentorOnly, updateAssignment);
router.delete('/:id', protect, mentorOnly, deleteAssignment);
router.post('/:id/submit', protect, studentOnly, submitAssignment);
router.get('/:id/submissions', protect, mentorOnly, getSubmissions);

module.exports = router;
