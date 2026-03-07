import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getAllStudents, getAssignments, getAllAttendance, getAllMarks } from '../../services/api';

export default function MentorDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({students:0,assignments:0,attendance:0,marks:0});
  const [recent, setRecent] = useState([]);
  const [busy, setBusy] = useState(true);
  useEffect(()=>{
    Promise.all([getAllStudents(),getAssignments(),getAllAttendance(),getAllMarks()])
      .then(([s,a,att,m])=>{ setStats({students:s.data.length,assignments:a.data.length,attendance:att.data.length,marks:m.data.length}); setRecent(s.data.slice(0,5)); })
      .catch(()=>{}).finally(()=>setBusy(false));
  },[]);
  if (busy) return <div className="loading"><div className="spinner"/>Loading...</div>;
  return (
    <div>
      <div className="banner">
        <div><h2 style={{fontSize:'1.4rem',fontWeight:800,marginBottom:4}}>Hello, {user.name.split(' ')[0]}! 👨‍🏫</h2><p style={{color:'var(--text-muted)',fontSize:'0.85rem'}}>Mentor Dashboard</p></div>
        <span style={{fontSize:'2.5rem',opacity:0.5}}>📋</span>
      </div>
      <div className="stats-grid" style={{marginBottom:24}}>
        <div className="stat-card"><div className="stat-icon">👥</div><div className="stat-value">{stats.students}</div><div className="stat-label">Students</div></div>
        <div className="stat-card"><div className="stat-icon">📝</div><div className="stat-value" style={{color:'var(--secondary)'}}>{stats.assignments}</div><div className="stat-label">Assignments</div></div>
        <div className="stat-card"><div className="stat-icon">📅</div><div className="stat-value" style={{color:'var(--success)'}}>{stats.attendance}</div><div className="stat-label">Attendance Records</div></div>
        <div className="stat-card"><div className="stat-icon">📊</div><div className="stat-value" style={{color:'var(--warning)'}}>{stats.marks}</div><div className="stat-label">Marks Entered</div></div>
      </div>
      <div className="grid-2">
        <div className="card">
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
            <span className="card-title" style={{margin:0}}>Recent Students</span>
            <Link to="/mentor/students" className="btn btn-secondary btn-sm">View All</Link>
          </div>
          {recent.length===0 ? <div className="empty"><div className="empty-icon">👥</div><p>No students yet</p></div>
            : recent.map(s=>(
              <div key={s._id} style={{display:'flex',alignItems:'center',gap:10,padding:'9px 0',borderBottom:'1px solid var(--border)'}}>
                <div className="avatar" style={{width:32,height:32,fontSize:'0.72rem'}}>{s.name[0]}</div>
                <div style={{flex:1}}><div style={{fontWeight:600,fontSize:'0.85rem'}}>{s.name}</div><div style={{fontSize:'0.75rem',color:'var(--text-muted)'}}>{s.enrollmentNumber||'No ID'}</div></div>
                <span className="badge badge-primary" style={{fontSize:'0.65rem'}}>{s.department||'N/A'}</span>
              </div>
            ))
          }
        </div>
        <div className="card">
          <div className="card-title">Quick Actions</div>
          <div style={{display:'flex',flexDirection:'column',gap:10}}>
            <Link to="/mentor/students"    className="btn btn-secondary">👥 Manage Students</Link>
            <Link to="/mentor/attendance"  className="btn btn-secondary">📅 Mark Attendance</Link>
            <Link to="/mentor/marks"       className="btn btn-secondary">📊 Update Marks</Link>
            <Link to="/mentor/assignments" className="btn btn-primary">📝 Create Assignment</Link>
            <Link to="/mentor/chat"        className="btn btn-secondary">💬 Chat with Students</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
