const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded.id === 'admin') {
        req.user = { _id: 'admin', role: 'admin', name: 'Administrator', email: 'admin' };
        return next();
      }
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }
  if (!token) return res.status(401).json({ message: 'Not authorized, no token' });
};

const mentorOnly = (req, res, next) => {
  if (req.user && req.user.role === 'mentor') return next();
  res.status(403).json({ message: 'Access denied. Mentor only.' });
};

const studentOnly = (req, res, next) => {
  if (req.user && req.user.role === 'student') return next();
  res.status(403).json({ message: 'Access denied. Student only.' });
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') return next();
  if (req.user && req.user._id === 'admin') return next(); // For hardcoded admin token
  res.status(403).json({ message: 'Access denied. Admin only.' });
};

module.exports = { protect, mentorOnly, studentOnly, adminOnly };
