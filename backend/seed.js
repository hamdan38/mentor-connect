const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('./models/User');
const Attendance = require('./models/Attendance');
const Marks = require('./models/Marks');
const Assignment = require('./models/Assignment');

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ MongoDB Connected');
};

const seed = async () => {
  await connectDB();

  // Clear existing data
  await Promise.all([
    User.deleteMany({}),
    Attendance.deleteMany({}),
    Marks.deleteMany({}),
    Assignment.deleteMany({})
  ]);
  console.log('🗑  Cleared existing data');

  // Create mentor
  const mentor = await User.create({
    name: 'Dr. Sarah Johnson',
    email: 'mentor@demo.com',
    password: 'demo123',
    role: 'mentor',
    department: 'Computer Science',
    enrollmentNumber: 'FAC001',
    phone: '+91 98765 43210'
  });
  console.log('👨‍🏫 Mentor created');

  // Create students
  const students = await User.create([
    { name: 'Alex Kumar', email: 'student@demo.com', password: 'demo123', role: 'student', department: 'Computer Science', enrollmentNumber: 'CS2024001', phone: '+91 91234 56789' },
    { name: 'Priya Sharma', email: 'priya@demo.com', password: 'demo123', role: 'student', department: 'Computer Science', enrollmentNumber: 'CS2024002', phone: '+91 91234 56790' },
    { name: 'Rahul Verma', email: 'rahul@demo.com', password: 'demo123', role: 'student', department: 'Computer Science', enrollmentNumber: 'CS2024003', phone: '+91 91234 56791' },
  ]);
  console.log('👨‍🎓 Students created');

  const subjects = ['Data Structures', 'Operating Systems', 'Database Management', 'Computer Networks'];

  // Create attendance
  for (const student of students) {
    for (const subject of subjects) {
      const pct = Math.floor(Math.random() * 40) + 60;
      const total = 40;
      const attended = Math.floor((pct / 100) * total);
      await Attendance.create({ studentId: student._id, subject, attendancePercentage: pct, totalClasses: total, attendedClasses: attended, updatedBy: mentor._id });
    }
  }
  console.log('📅 Attendance records created');

  // Create marks
  const examTypes = ['internal', 'midterm', 'final'];
  for (const student of students) {
    for (const subject of subjects) {
      for (const examType of examTypes) {
        const marks = Math.floor(Math.random() * 40) + 55;
        await Marks.create({ studentId: student._id, subject, marks, maxMarks: 100, examType, updatedBy: mentor._id });
      }
    }
  }
  console.log('📊 Marks records created');

  // Create assignments
  const assignments = await Assignment.create([
    {
      title: 'Implement Binary Search Tree',
      description: 'Implement a BST with insert, delete, search, and traversal operations in any programming language. Include time complexity analysis.',
      subject: 'Data Structures',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      mentorId: mentor._id,
      maxMarks: 100
    },
    {
      title: 'Process Scheduling Algorithms',
      description: 'Simulate FCFS, SJF, Round Robin, and Priority scheduling algorithms. Compare their performance with different test cases.',
      subject: 'Operating Systems',
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      mentorId: mentor._id,
      maxMarks: 100
    },
    {
      title: 'Database Design Project',
      description: 'Design a normalized database for an e-commerce system. Include ER diagram, schema, and at least 10 SQL queries.',
      subject: 'Database Management',
      dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // overdue
      mentorId: mentor._id,
      maxMarks: 100
    }
  ]);
  console.log('📝 Assignments created');

  console.log('\n✅ SEED COMPLETE!\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Demo Login Credentials:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('👨‍🏫 MENTOR:  mentor@demo.com / demo123');
  console.log('👨‍🎓 STUDENT: student@demo.com / demo123');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  mongoose.disconnect();
};

seed().catch(console.error);
