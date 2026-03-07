import React, { useEffect, useState } from 'react';
import { getAssignments, submitAssignment, getMySubmissions } from '../../services/api';

export default function StudentAssignments() {
  const [asgn, setAsgn] = useState([]);
  const [subs, setSubs] = useState([]);
  const [busy, setBusy] = useState(true);
  const [modal, setModal] = useState(null);
  const [text, setText]   = useState('');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => { load(); }, []);
  async function load() {
    try { const [a,s] = await Promise.all([getAssignments(),getMySubmissions()]); setAsgn(a.data); setSubs(s.data); }
    catch(e){} finally{setBusy(false);}
  }

  async function submit() {
    if (!text.trim()) return setMsg('Please write your answer first.');
    setSaving(true); setMsg('');
    try { await submitAssignment(modal._id,{submissionText:text}); setMsg(''); setModal(null); setText(''); await load(); }
    catch(e){ setMsg(e.response?.data?.message||'Submission failed'); }
    finally{ setSaving(false); }
  }

  const getSub = id => subs.find(s=>s.assignmentId?._id===id||s.assignmentId===id);
  const late   = d  => new Date() > new Date(d);

  if (busy) return <div className="loading"><div className="spinner"/>Loading...</div>;

  return (
    <div>
      <div className="page-head"><div><h1>Assignments</h1><p>All posted assignments</p></div></div>
      <div className="grid-3" style={{marginBottom:24}}>
        <div className="stat-card"><div className="stat-icon">📝</div><div className="stat-value">{asgn.length}</div><div className="stat-label">Total</div></div>
        <div className="stat-card"><div className="stat-icon">✅</div><div className="stat-value" style={{color:'var(--success)'}}>{subs.length}</div><div className="stat-label">Submitted</div></div>
        <div className="stat-card"><div className="stat-icon">⏳</div><div className="stat-value" style={{color:'var(--warning)'}}>{asgn.length-subs.length}</div><div className="stat-label">Pending</div></div>
      </div>
      {asgn.length===0 ? <div className="card"><div className="empty"><div className="empty-icon">📝</div><p>No assignments yet</p></div></div> : (
        <div style={{display:'flex',flexDirection:'column',gap:14}}>
          {asgn.map(a => {
            const sub = getSub(a._id);
            const overdue = late(a.dueDate);
            return (
              <div key={a._id} className="card" style={{borderLeft:`3px solid ${sub?'var(--success)':overdue?'var(--danger)':'var(--primary)'}`}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:12}}>
                  <div style={{flex:1}}>
                    <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:6,flexWrap:'wrap'}}>
                      <span style={{fontWeight:700}}>{a.title}</span>
                      {sub ? <span className={`badge ${sub.status==='graded'?'badge-success':'badge-info'}`}>{sub.status==='graded'?`✅ ${sub.marks}pts`:'📬 Submitted'}</span>
                           : overdue ? <span className="badge badge-danger">⏰ Overdue</span>
                           : <span className="badge badge-warning">📋 Pending</span>}
                    </div>
                    <p style={{color:'var(--text-muted)',fontSize:'0.85rem',marginBottom:8}}>{a.description}</p>
                    <div style={{display:'flex',gap:16,fontSize:'0.78rem',color:'var(--text-muted)',flexWrap:'wrap'}}>
                      <span>📚 {a.subject}</span>
                      <span>📅 Due: {new Date(a.dueDate).toLocaleDateString()}</span>
                      <span>🎯 {a.maxMarks} marks</span>
                    </div>
                    {sub?.feedback && <div style={{marginTop:8,padding:'8px 12px',background:'rgba(16,185,129,0.1)',borderRadius:7,fontSize:'0.8rem',color:'#6ee7b7'}}>💬 Feedback: {sub.feedback}</div>}
                  </div>
                  {!sub && <button className="btn btn-primary btn-sm" onClick={()=>{setModal(a);setText('');setMsg('');}}>Submit</button>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {modal && (
        <div className="modal-bg" onClick={()=>setModal(null)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="modal-head">
              <h3>Submit: {modal.title}</h3>
              <button className="modal-close" onClick={()=>setModal(null)}>✕</button>
            </div>
            <p style={{color:'var(--text-muted)',fontSize:'0.85rem',marginBottom:16}}>{modal.description}</p>
            {msg && <div className="alert alert-error">{msg}</div>}
            <div className="form-group">
              <label className="label">Your Answer</label>
              <textarea className="textarea" style={{minHeight:130}} placeholder="Write your solution here..." value={text} onChange={e=>setText(e.target.value)}/>
            </div>
            <div style={{display:'flex',gap:8,justifyContent:'flex-end'}}>
              <button className="btn btn-secondary" onClick={()=>setModal(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={submit} disabled={saving}>{saving?'Submitting...':'📤 Submit'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
