const Attendance = require('../models/Attendance');
const User = require('../models/User');

// @desc  Get attendance for a student
// @route GET /api/attendance/:studentId
const getAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find({ studentId: req.params.studentId });
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Add or update attendance
// @route POST /api/attendance
const upsertAttendance = async (req, res) => {
  try {
    const { studentId, subject, attendancePercentage, totalClasses, attendedClasses } = req.body;

    let record = await Attendance.findOne({ studentId, subject });
    if (record) {
      record.attendancePercentage = attendancePercentage;
      record.totalClasses = totalClasses;
      record.attendedClasses = attendedClasses;
      record.updatedBy = req.user._id;
      await record.save();
    } else {
      record = await Attendance.create({
        studentId, subject, attendancePercentage,
        totalClasses, attendedClasses, updatedBy: req.user._id
      });
    }

    // Notify student
    await User.findByIdAndUpdate(studentId, {
      $push: {
        notifications: {
          message: `Your attendance for ${subject} has been updated to ${attendancePercentage}%`,
          read: false
        }
      }
    });

    res.status(200).json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Get all students attendance (for mentor)
// @route GET /api/attendance/all
const getAllAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find({}).populate('studentId', 'name email enrollmentNumber');
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Delete attendance record
// @route DELETE /api/attendance/:id
const deleteAttendance = async (req, res) => {
  try {
    await Attendance.findByIdAndDelete(req.params.id);
    res.json({ message: 'Attendance record deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAttendance, upsertAttendance, getAllAttendance, deleteAttendance };
