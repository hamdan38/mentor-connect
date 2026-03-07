import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/student/Dashboard';
import StudentAttendance from './pages/student/Attendance';
import StudentMarks from './pages/student/Marks';
import StudentAssignments from './pages/student/Assignments';
import MentorDashboard from './pages/mentor/Dashboard';
import StudentManagement from './pages/mentor/Students';
import AttendanceManagement from './pages/mentor/Attendance';
import MarksManagement from './pages/mentor/Marks';
import AssignmentManagement from './pages/mentor/Assignments';
import ChatPage from './pages/Chat';
import AdminDashboard from './pages/admin/Dashboard';

function Guard({ children, role }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading"><div className="spinner"/>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) {
    if (user.role === 'admin') return <Navigate to="/admin" replace />;
    return <Navigate to={user.role === 'mentor' ? '/mentor/dashboard' : '/student/dashboard'} replace />;
  }
  return children;
}

function Public({ children }) {
  const { user } = useAuth();
  if (user) {
    if (user.role === 'admin') return <Navigate to="/admin" replace />;
    return <Navigate to={user.role === 'mentor' ? '/mentor/dashboard' : '/student/dashboard'} replace />;
  }
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login"    element={<Public><Login /></Public>} />
          <Route path="/register" element={<Public><Register /></Public>} />

          <Route path="/student" element={<Guard role="student"><Layout /></Guard>}>
            <Route path="dashboard"   element={<StudentDashboard />} />
            <Route path="attendance"  element={<StudentAttendance />} />
            <Route path="marks"       element={<StudentMarks />} />
            <Route path="assignments" element={<StudentAssignments />} />
            <Route path="chat"        element={<ChatPage />} />
          </Route>

          <Route path="/mentor" element={<Guard role="mentor"><Layout /></Guard>}>
            <Route path="dashboard"   element={<MentorDashboard />} />
            <Route path="students"    element={<StudentManagement />} />
            <Route path="attendance"  element={<AttendanceManagement />} />
            <Route path="marks"       element={<MarksManagement />} />
            <Route path="assignments" element={<AssignmentManagement />} />
            <Route path="chat"        element={<ChatPage />} />
          </Route>

          <Route path="/admin" element={<Guard role="admin"><AdminDashboard /></Guard>} />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
