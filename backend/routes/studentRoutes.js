const express = require('express');
const router = express.Router();
const { getAllStudents, getStudentById, getStudentStats } = require('../controllers/studentController');
const { protect, mentorOnly } = require('../middleware/authMiddleware');

router.get('/', protect, mentorOnly, getAllStudents);
router.get('/:id', protect, getStudentById);
router.get('/:id/stats', protect, getStudentStats);

module.exports = router;
