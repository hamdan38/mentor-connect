import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getAttendance, getMarks, getMySubmissions, getAssignments } from '../../services/api';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [att, setAtt]   = useState([]);
  const [marks, setMrk] = useState([]);
  const [subs, setSubs] = useState([]);
  const [asgn, setAsgn] = useState([]);
  const [busy, setBusy] = useState(true);

  useEffect(() => {
    Promise.all([getAttendance(user._id), getMarks(user._id), getMySubmissions(), getAssignments()])
      .then(([a,m,s,g]) => { setAtt(a.data); setMrk(m.data); setSubs(s.data); setAsgn(g.data); })
      .catch(()=>{})
      .finally(()=>setBusy(false));
  }, [user._id]);

  if (busy) return <div className="loading"><div className="spinner"/>Loading...</div>;

  const avgAtt  = att.length  ? (att.reduce((s,a)=>s+a.attendancePercentage,0)/att.length).toFixed(1)  : 0;
  const avgMark = marks.length ? (marks.reduce((s,m)=>s+(m.marks/m.maxMarks)*100,0)/marks.length).toFixed(1) : 0;

  return (
    <div>
      <div className="banner">
        <div>
          <h2 style={{fontSize:'1.4rem',fontWeight:800,marginBottom:4}}>Hello, {user.name.split(' ')[0]}! 👋</h2>
          <p style={{color:'var(--text-muted)',fontSize:'0.85rem'}}>{user.department} {user.enrollmentNumber && `• ${user.enrollmentNumber}`}</p>
        </div>
        <span style={{fontSize:'2.5rem',opacity:0.5}}>🎓</span>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-value" style={{color: +avgAtt>=75?'var(--success)':'var(--danger)'}}>{avgAtt}%</div>
          <div className="stat-label">Avg Attendance</div>
          <div className="progress" style={{marginTop:8}}><div className="progress-bar" style={{width:`${avgAtt}%`,background:+avgAtt>=75?'var(--success)':'var(--danger)'}}/></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-value" style={{color:'var(--secondary)'}}>{avgMark}%</div>
          <div className="stat-label">Avg Score</div>
          <div className="progress" style={{marginTop:8}}><div className="progress-bar" style={{width:`${avgMark}%`,background:'var(--secondary)'}}/></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-value" style={{color:'var(--success)'}}>{subs.length}</div>
          <div className="stat-label">Submitted</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-value" style={{color:'var(--warning)'}}>{asgn.length - subs.length}</div>
          <div className="stat-label">Pending</div>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-title">Attendance by Subject</div>
          {att.length === 0 ? <div className="empty"><div className="empty-icon">📅</div><p>No records yet</p></div>
            : att.map(a => (
              <div key={a._id} style={{marginBottom:14}}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:5}}>
                  <span style={{fontSize:'0.85rem'}}>{a.subject}</span>
                  <span style={{fontWeight:700,fontSize:'0.85rem',color:a.attendancePercentage>=75?'var(--success)':'var(--danger)'}}>{a.attendancePercentage}%</span>
                </div>
                <div className="progress"><div className="progress-bar" style={{width:`${a.attendancePercentage}%`,background:a.attendancePercentage>=75?'var(--success)':'var(--danger)'}}/></div>
              </div>
            ))
          }
        </div>
        <div className="card">
          <div className="card-title">Quick Actions</div>
          <div style={{display:'flex',flexDirection:'column',gap:10}}>
            <Link to="/student/attendance"  className="btn btn-secondary">📅 View Attendance</Link>
            <Link to="/student/marks"       className="btn btn-secondary">📊 View Marks</Link>
            <Link to="/student/assignments" className="btn btn-primary">📝 Assignments</Link>
            <Link to="/student/chat"        className="btn btn-secondary">💬 Chat with Mentor</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
