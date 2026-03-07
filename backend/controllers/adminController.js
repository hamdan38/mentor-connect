const User = require('../models/User');

// @desc  Get pending users
// @route GET /api/admin/pending
const getPendingUsers = async (req, res) => {
  try {
    const users = await User.find({ isApproved: false }).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Get approved users
// @route GET /api/admin/users
const getApprovedUsers = async (req, res) => {
  try {
    const users = await User.find({ isApproved: true }).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Approve user
// @route PUT /api/admin/approve/:id
const approveUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.isApproved = true;
    await user.save();
    res.json({ message: 'User approved' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Reject user (delete)
// @route DELETE /api/admin/reject/:id
const rejectUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    await user.deleteOne();
    res.json({ message: 'User rejected and removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getPendingUsers, getApprovedUsers, approveUser, rejectUser };
