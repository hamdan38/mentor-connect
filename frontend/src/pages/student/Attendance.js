import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getAttendance } from '../../services/api';

export default function StudentAttendance() {
  const { user } = useAuth();
  const [att, setAtt] = useState([]);
  const [busy, setBusy] = useState(true);
  useEffect(() => { getAttendance(user._id).then(r=>setAtt(r.data)).catch(()=>{}).finally(()=>setBusy(false)); }, [user._id]);
  if (busy) return <div className="loading"><div className="spinner"/>Loading...</div>;
  const avg = att.length ? (att.reduce((s,a)=>s+a.attendancePercentage,0)/att.length).toFixed(1) : 0;
  return (
    <div>
      <div className="page-head"><div><h1>Attendance Report</h1><p>Your attendance across all subjects</p></div></div>
      <div className="grid-3" style={{marginBottom:24}}>
        <div className="stat-card"><div className="stat-icon">📚</div><div className="stat-value">{att.length}</div><div className="stat-label">Subjects</div></div>
        <div className="stat-card"><div className="stat-icon">📊</div><div className="stat-value" style={{color:+avg>=75?'var(--success)':'var(--danger)'}}>{avg}%</div><div className="stat-label">Overall Avg</div></div>
        <div className="stat-card"><div className="stat-icon">⚠️</div><div className="stat-value" style={{color:'var(--warning)'}}>{att.filter(a=>a.attendancePercentage<75).length}</div><div className="stat-label">Below 75%</div></div>
      </div>
      {att.length === 0 ? (
        <div className="card"><div className="empty"><div className="empty-icon">📅</div><p>No attendance records yet</p></div></div>
      ) : (
        <div className="card">
          {att.map(a => (
            <div key={a._id} style={{padding:'16px 0',borderBottom:'1px solid var(--border)'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
                <div>
                  <span style={{fontWeight:700}}>{a.subject}</span>
                  <span style={{fontSize:'0.78rem',color:'var(--text-muted)',marginLeft:10}}>{a.attendedClasses||0}/{a.totalClasses||0} classes</span>
                </div>
                <div style={{textAlign:'right'}}>
                  <span style={{fontSize:'1.4rem',fontWeight:800,fontFamily:'monospace',color:a.attendancePercentage>=75?'var(--success)':a.attendancePercentage>=60?'var(--warning)':'var(--danger)'}}>{a.attendancePercentage}%</span>
                  <div style={{marginTop:3}}>
                    <span className={`badge ${a.attendancePercentage>=75?'badge-success':a.attendancePercentage>=60?'badge-warning':'badge-danger'}`}>
                      {a.attendancePercentage>=75?'✅ Good':a.attendancePercentage>=60?'⚠️ Average':'❌ Low'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="progress" style={{height:8}}><div className="progress-bar" style={{width:`${a.attendancePercentage}%`,background:a.attendancePercentage>=75?'var(--success)':a.attendancePercentage>=60?'var(--warning)':'var(--danger)'}}/></div>
              {a.attendancePercentage < 75 && <p style={{fontSize:'0.76rem',color:'var(--warning)',marginTop:6}}>⚠️ Need more attendance to reach 75%</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
