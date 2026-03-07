import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getMarks } from '../../services/api';

function gradeColor(g) {
  const map = {'A+':'#10b981','A':'#6ee7b7','B':'#60a5fa','C':'#f59e0b','D':'#fb923c','F':'#ef4444'};
  return map[g] || '#e2e8f0';
}

export default function StudentMarks() {
  const { user } = useAuth();
  const [marks, setMarks] = useState([]);
  const [busy, setBusy]   = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    getMarks(user._id).then(r => setMarks(r.data)).catch(() => {}).finally(() => setBusy(false));
  }, [user._id]);

  if (busy) return <div className="loading"><div className="spinner"/>Loading...</div>;

  const types   = ['all', ...new Set(marks.map(m => m.examType))];
  const visible = filter === 'all' ? marks : marks.filter(m => m.examType === filter);
  const avg = marks.length
    ? (marks.reduce((s, m) => s + (m.marks / m.maxMarks) * 100, 0) / marks.length).toFixed(1)
    : 0;

  return (
    <div>
      <div className="page-head">
        <div><h1>Academic Marks</h1><p>Your marks across all subjects</p></div>
      </div>

      <div className="stats-grid" style={{marginBottom:20}}>
        <div className="stat-card"><div className="stat-icon">📚</div><div className="stat-value">{marks.length}</div><div className="stat-label">Records</div></div>
        <div className="stat-card"><div className="stat-icon">📈</div><div className="stat-value" style={{color:'var(--secondary)'}}>{avg}%</div><div className="stat-label">Average</div></div>
        <div className="stat-card"><div className="stat-icon">🏆</div><div className="stat-value" style={{color:'var(--success)'}}>{marks.filter(m => ['A','A+'].includes(m.grade)).length}</div><div className="stat-label">A Grades</div></div>
        <div className="stat-card"><div className="stat-icon">❗</div><div className="stat-value" style={{color:'var(--danger)'}}>{marks.filter(m => m.grade === 'F').length}</div><div className="stat-label">Failed</div></div>
      </div>

      <div style={{display:'flex',gap:8,marginBottom:16,flexWrap:'wrap'}}>
        {types.map(t => (
          <button key={t} className={`btn btn-sm ${filter===t ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setFilter(t)}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {visible.length === 0
        ? <div className="card"><div className="empty"><div className="empty-icon">📊</div><p>No marks yet</p></div></div>
        : (
          <div className="card">
            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>Subject</th><th>Type</th><th>Marks</th><th>%</th><th>Grade</th><th>Remarks</th></tr>
                </thead>
                <tbody>
                  {visible.map(m => (
                    <tr key={m._id}>
                      <td style={{fontWeight:600,color:'var(--text)'}}>{m.subject}</td>
                      <td><span className="badge badge-info">{m.examType}</span></td>
                      <td style={{fontFamily:'monospace',fontWeight:700,color:'var(--text)'}}>{m.marks}/{m.maxMarks}</td>
                      <td>
                        <div style={{display:'flex',alignItems:'center',gap:8}}>
                          <div className="progress" style={{width:70,height:5}}>
                            <div className="progress-bar" style={{width:`${(m.marks/m.maxMarks)*100}%`,background:gradeColor(m.grade)}}/>
                          </div>
                          <span style={{fontSize:'0.8rem'}}>{((m.marks/m.maxMarks)*100).toFixed(0)}%</span>
                        </div>
                      </td>
                      <td><span style={{fontWeight:800,fontSize:'1rem',color:gradeColor(m.grade)}}>{m.grade}</span></td>
                      <td style={{fontSize:'0.8rem'}}>{m.remarks || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      }
    </div>
  );
}