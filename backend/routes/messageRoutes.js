const express = require('express');
const router = express.Router();
const { getMessages, sendMessage, getContacts, getNotifications, markNotificationsRead } = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

router.get('/contacts', protect, getContacts);
router.get('/notifications', protect, getNotifications);
router.put('/notifications/read', protect, markNotificationsRead);
router.get('/:userId', protect, getMessages);
router.post('/', protect, sendMessage);

module.exports = router;
