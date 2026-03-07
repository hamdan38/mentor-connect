const express = require('express');
const router = express.Router();
const { getPendingUsers, getApprovedUsers, approveUser, rejectUser } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/pending', protect, adminOnly, getPendingUsers);
router.get('/users', protect, adminOnly, getApprovedUsers);
router.put('/approve/:id', protect, adminOnly, approveUser);
router.delete('/reject/:id', protect, adminOnly, rejectUser);

module.exports = router;
