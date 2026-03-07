const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subject: { type: String, required: true },
  attendancePercentage: { type: Number, min: 0, max: 100, default: 0 },
  totalClasses: { type: Number, default: 0 },
  attendedClasses: { type: Number, default: 0 },
  records: [
    {
      date: { type: Date, default: Date.now },
      status: { type: String, enum: ['present', 'absent'], required: true }
    }
  ],
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
