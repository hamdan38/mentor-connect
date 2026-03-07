const express = require('express');
const router = express.Router();
const { getMarks, upsertMarks, getAllMarks, deleteMarks } = require('../controllers/marksController');
const { protect, mentorOnly } = require('../middleware/authMiddleware');

router.get('/', protect, mentorOnly, getAllMarks);
router.get('/:studentId', protect, getMarks);
router.post('/', protect, mentorOnly, upsertMarks);
router.delete('/:id', protect, mentorOnly, deleteMarks);

module.exports = router;
