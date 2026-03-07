const express = require('express');
const router = express.Router();
const { getAttendance, upsertAttendance, getAllAttendance, deleteAttendance } = require('../controllers/attendanceController');
const { protect, mentorOnly } = require('../middleware/authMiddleware');

// ⚠️ /all must be before /:studentId or Express treats 'all' as an ID
router.get('/all', protect, mentorOnly, getAllAttendance);
router.get('/:studentId', protect, getAttendance);
router.post('/', protect, mentorOnly, upsertAttendance);
router.delete('/:id', protect, mentorOnly, deleteAttendance);

module.exports = router;
