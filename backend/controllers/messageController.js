const Message = require('../models/Message');
const User = require('../models/User');

// @desc  Get conversation between two users
// @route GET /api/messages/:userId
const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { senderId: req.user._id, receiverId: req.params.userId },
        { senderId: req.params.userId, receiverId: req.user._id }
      ]
    }).sort({ timestamp: 1 });

    // Mark messages as read
    await Message.updateMany(
      { senderId: req.params.userId, receiverId: req.user._id, read: false },
      { read: true }
    );

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Send a message
// @route POST /api/messages
const sendMessage = async (req, res) => {
  try {
    const { receiverId, message } = req.body;
    const msg = await Message.create({
      senderId: req.user._id,
      receiverId,
      message
    });
    res.status(201).json(msg);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Get all chat contacts (mentors for students, students for mentors)
// @route GET /api/messages/contacts
const getContacts = async (req, res) => {
  try {
    let role = req.user.role === 'student' ? 'mentor' : 'student';
    const contacts = await User.find({ role }).select('-password');
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Get notifications
// @route GET /api/notifications
const getNotifications = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('notifications');
    res.json(user.notifications.sort((a, b) => b.createdAt - a.createdAt));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Mark notifications as read
// @route PUT /api/notifications/read
const markNotificationsRead = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, {
      $set: { 'notifications.$[].read': true }
    });
    res.json({ message: 'Notifications marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getMessages, sendMessage, getContacts, getNotifications, markNotificationsRead };
