# 🎓 MentorConnect Platform

A complete full-stack MERN application for connecting students with mentors and managing academic progress.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js 18 (Hooks, Context API, React Router v6) |
| Backend | Node.js + Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT (JSON Web Tokens) |
| Real-time | Socket.io |
| HTTP Client | Axios |
| Charts | Recharts |
| Notifications | react-hot-toast |

---

## 📁 Project Structure

```
mentor-connect/
│
├── backend/
│   ├── config/
│   │   └── db.js                # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js    # Login, register, profile
│   │   ├── studentController.js # Student management
│   │   ├── attendanceController.js
│   │   ├── marksController.js
│   │   ├── assignmentController.js
│   │   └── messageController.js # Chat + notifications
│   ├── middleware/
│   │   └── authMiddleware.js    # JWT + role guards
│   ├── models/
│   │   ├── User.js
│   │   ├── Attendance.js
│   │   ├── Marks.js
│   │   ├── Assignment.js
│   │   ├── Submission.js
│   │   └── Message.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── studentRoutes.js
│   │   ├── attendanceRoutes.js
│   │   ├── marksRoutes.js
│   │   ├── assignmentRoutes.js
│   │   └── messageRoutes.js
│   ├── seed.js                  # Demo data seeder
│   ├── server.js                # Main entry + Socket.io
│   ├── .env
│   └── package.json
│
└── frontend/
    └── src/
        ├── context/
        │   ├── AuthContext.js   # Global auth state
        │   └── SocketContext.js # Socket.io connection
        ├── pages/
        │   ├── auth/
        │   │   ├── Login.js
        │   │   └── Register.js
        │   ├── student/
        │   │   ├── StudentDashboard.js
        │   │   ├── StudentAttendance.js
        │   │   ├── StudentMarks.js
        │   │   └── StudentAssignments.js
        │   ├── mentor/
        │   │   ├── MentorDashboard.js
        │   │   ├── StudentManagement.js
        │   │   ├── AttendanceManagement.js
        │   │   ├── MarksManagement.js
        │   │   └── AssignmentManagement.js
        │   └── ChatPage.js      # Shared real-time chat
        ├── components/
        │   └── common/
        │       └── Layout.js    # Sidebar + Topbar
        ├── services/
        │   └── api.js           # All Axios API calls
        ├── App.js               # Router + protected routes
        ├── index.js
        └── index.css            # Global styles
```

---

## 🚀 Setup & Installation

### Prerequisites
- Node.js v16+
- MongoDB (local or Atlas)
- npm or yarn

---

### Step 1 — Clone or Extract

```bash
cd mentor-connect
```

---

### Step 2 — Backend Setup

```bash
cd backend
npm install
```

Create `.env` file (already included, edit if needed):
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/mentor-connect
JWT_SECRET=your_super_secret_jwt_key_change_in_production
NODE_ENV=development
```

---

### Step 3 — Seed Demo Data (optional but recommended)

```bash
# From the backend folder:
node seed.js
```

This creates:
- 1 Mentor account
- 3 Student accounts
- Sample attendance, marks, and assignments

---

### Step 4 — Start Backend

```bash
# Development (with nodemon auto-reload)
npm run dev

# OR production
npm start
```

Backend runs on → **http://localhost:5000**

---

### Step 5 — Frontend Setup

```bash
cd ../frontend
npm install
npm start
```

Frontend runs on → **http://localhost:3000**

---

## 🔐 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| 👨‍🏫 Mentor | mentor@demo.com | demo123 |
| 👨‍🎓 Student | student@demo.com | demo123 |

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login |
| GET | /api/auth/profile | Get profile |
| PUT | /api/auth/profile | Update profile |

### Students (Mentor only)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/students | Get all students |
| GET | /api/students/:id | Get student by ID |

### Attendance
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/attendance/:studentId | Get student attendance |
| GET | /api/attendance/all | All attendance (mentor) |
| POST | /api/attendance | Add/update attendance |
| DELETE | /api/attendance/:id | Delete record |

### Marks
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/marks/:studentId | Get student marks |
| GET | /api/marks | All marks (mentor) |
| POST | /api/marks | Add/update marks |
| DELETE | /api/marks/:id | Delete record |

### Assignments
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/assignments | Get all assignments |
| POST | /api/assignments | Create assignment |
| PUT | /api/assignments/:id | Update assignment |
| DELETE | /api/assignments/:id | Delete assignment |
| POST | /api/assignments/:id/submit | Student submit |
| GET | /api/assignments/:id/submissions | View submissions |
| GET | /api/assignments/student/my-submissions | Student's submissions |
| PUT | /api/assignments/submissions/:id/grade | Grade submission |

### Messages & Notifications
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/messages/contacts | Get chat contacts |
| GET | /api/messages/:userId | Get conversation |
| POST | /api/messages | Send message |
| GET | /api/messages/notifications | Get notifications |
| PUT | /api/messages/notifications/read | Mark as read |

---

## ⚡ Socket.io Events

| Event | Direction | Description |
|-------|-----------|-------------|
| user_online | Client → Server | Register user as online |
| online_users | Server → Client | Broadcast online users list |
| join_room | Client → Server | Join chat room |
| send_message | Client → Server | Send a chat message |
| receive_message | Server → Client | Receive chat message |
| typing | Client → Server | User typing indicator |
| user_typing | Server → Client | Show typing to recipient |
| stop_typing | Client → Server | Stop typing |
| user_stop_typing | Server → Client | Hide typing indicator |

---

## 🎨 Features Overview

### Student Features
- ✅ View personal dashboard with stats & charts
- ✅ Attendance report with per-subject breakdown
- ✅ Marks with grade calculation (A+/A/B/C/D/F)
- ✅ View & submit assignments
- ✅ See graded feedback from mentor
- ✅ Real-time chat with mentor
- ✅ Push notifications for new assignments & marks

### Mentor Features
- ✅ Dashboard overview of all activity
- ✅ Search & view all students
- ✅ Mark/update attendance per subject
- ✅ Add/update marks per subject & exam type
- ✅ Create assignments (auto-notifies all students)
- ✅ Review & grade student submissions
- ✅ Real-time chat with students

---

## 🗄️ MongoDB Collections

```
users          → name, email, password, role, department, notifications
attendance     → studentId, subject, attendancePercentage, totalClasses
marks          → studentId, subject, marks, maxMarks, examType, grade
assignments    → title, description, subject, dueDate, mentorId, maxMarks
submissions    → assignmentId, studentId, submissionText, status, marks, feedback
messages       → senderId, receiverId, message, read, timestamp
```

---

## 🔒 Security

- Passwords hashed with bcryptjs (12 salt rounds)
- JWT tokens expire in 7 days
- Role-based middleware guards all sensitive routes
- Students cannot access mentor-only routes and vice versa
- Token auto-refresh on 401 (redirects to login)

---

## 🐛 Troubleshooting

**MongoDB connection fails:**
- Ensure MongoDB is running: `mongod --dbpath /data/db`
- Or use MongoDB Atlas: update `MONGO_URI` in `.env`

**Port already in use:**
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9
```

**CORS errors:**
- Backend is configured for `http://localhost:3000`
- Change in `server.js` if your frontend runs elsewhere

**Socket.io not connecting:**
- Ensure backend is running before starting frontend
- Check browser console for WebSocket errors
