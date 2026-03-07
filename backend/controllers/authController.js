const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// @desc  Register user
// @route POST /api/auth/register
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, department, enrollmentNumber, phone } = req.body;
    
    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const user = await User.create({ 
      name, 
      email, 
      password, 
      role, 
      department, 
      enrollmentNumber, 
      phone, 
      isApproved: false 
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        token: generateToken(user._id)
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Login user
// @route POST /api/auth/login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Handle hardcoded Admin
    if (email === 'admin@demo.com' && password === 'admin') {
      return res.json({
        _id: 'admin',
        name: 'Administrator',
        email: 'admin@demo.com',
        role: 'admin',
        token: generateToken('admin')
      });
    }

    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      if (!user.isApproved) {
        return res.status(403).json({ message: 'Account pending approval from admin' });
      }
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        enrollmentNumber: user.enrollmentNumber,
        phone: user.phone,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Get current user profile
// @route GET /api/auth/profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Update profile
// @route PUT /api/auth/profile
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.name = req.body.name || user.name;
    user.department = req.body.department || user.department;
    user.phone = req.body.phone || user.phone;
    if (req.body.password) user.password = req.body.password;
    const updated = await user.save();
    res.json({ _id: updated._id, name: updated.name, email: updated.email, role: updated.role, department: updated.department, phone: updated.phone });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, loginUser, getProfile, updateProfile };
