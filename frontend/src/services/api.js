import { API } from '../context/AuthContext';

export const login             = d  => API.post('/auth/login', d);
export const register          = d  => API.post('/auth/register', d);
export const getProfile        = () => API.get('/auth/profile');

export const getAllStudents     = (s='') => API.get(`/students?search=${s}`);
export const getStudentById    = id => API.get(`/students/${id}`);

export const getAttendance     = id => API.get(`/attendance/${id}`);
export const getAllAttendance   = () => API.get('/attendance/all');
export const upsertAttendance  = d  => API.post('/attendance', d);
export const deleteAttendance  = id => API.delete(`/attendance/${id}`);

export const getMarks          = id => API.get(`/marks/${id}`);
export const getAllMarks        = () => API.get('/marks');
export const upsertMarks       = d  => API.post('/marks', d);
export const deleteMarks       = id => API.delete(`/marks/${id}`);

export const getAssignments    = () => API.get('/assignments');
export const createAssignment  = d  => API.post('/assignments', d);
export const deleteAssignment  = id => API.delete(`/assignments/${id}`);
export const submitAssignment  = (id,d) => API.post(`/assignments/${id}/submit`, d);
export const getSubmissions    = id => API.get(`/assignments/${id}/submissions`);
export const getMySubmissions  = () => API.get('/assignments/student/my-submissions');
export const gradeSubmission   = (id,d) => API.put(`/assignments/submissions/${id}/grade`, d);

export const getMessages       = id => API.get(`/messages/${id}`);
export const sendMessage       = d  => API.post('/messages', d);
export const getContacts       = () => API.get('/messages/contacts');
export const getNotifications  = () => API.get('/messages/notifications');
export const markNotifsRead    = () => API.put('/messages/notifications/read');
