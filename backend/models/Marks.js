const mongoose = require('mongoose');

const marksSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subject: { type: String, required: true },
  marks: { type: Number, min: 0, required: true },
  maxMarks: { type: Number, default: 100 },
  examType: { type: String, enum: ['internal', 'midterm', 'final', 'assignment'], default: 'internal' },
  grade: { type: String, default: '' },
  remarks: { type: String, default: '' },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

marksSchema.pre('save', function (next) {
  const percentage = (this.marks / this.maxMarks) * 100;
  if (percentage >= 90) this.grade = 'A+';
  else if (percentage >= 80) this.grade = 'A';
  else if (percentage >= 70) this.grade = 'B';
  else if (percentage >= 60) this.grade = 'C';
  else if (percentage >= 50) this.grade = 'D';
  else this.grade = 'F';
  next();
});

module.exports = mongoose.model('Marks', marksSchema);
