import React, { useEffect, useState } from 'react';
import { getAllStudents, getAllMarks, upsertMarks, deleteMarks } from '../../services/api';

const TYPES = ['internal', 'midterm', 'final', 'assignment'];

function gradeColor(g) {
  const map = {'A+':'#10b981','A':'#6ee7b7','B':'#60a5fa','C':'#f59e0b','D':'#fb923c','F':'#ef4444'};
  return map[g] || '#e2e8f0';
}

export default function MarksManagement() {
  const [students, setSt]   = useState([]);
  const [marks, setMrk]     = useState([]);
  const [busy, setBusy]     = useState(true);
  const [modal, setModal]   = useState(false);
  const [form, setForm]     = useState({studentId:'',subject:'',marks:'',maxMarks:'100',examType:'internal',remarks:''});
  const [saving, setSaving] = useState(false);
  const [msg, setMsg]       = useState('');
  const [filter, setFilter] = useState('all');

  const set = f => e => setForm({...form, [f]: e.target.value});

  useEffect(() => { load(); }, []);

  async function load() {
    try {
      const [s, m] = await Promise.all([getAllStudents(), getAllMarks()]);
      setSt(s.data); setMrk(m.data);
    } catch(e) {} finally { setBusy(false); }
  }

  async function save() {
    if (!form.studentId || !form.subject || form.marks === '') return setMsg('Fill all required fields');
    setSaving(true); setMsg('');
    try {
      await upsertMarks({...form, marks: +form.marks, maxMarks: +form.maxMarks});
      setModal(false);
      setForm({studentId:'',subject:'',marks:'',maxMarks:'100',examType:'internal',remarks:''});
      await load();
    } catch(e) {
      setMsg(e.response?.data?.message || 'Failed to save');
    } finally { setSaving(false); }
  }

  async function del(id) {
    if (!window.confirm('Delete this record?')) return;
    await deleteMarks(id);
    load();
  }

  const visible = filter === 'all' ? marks : marks.filter(m => m.examType === filter);

  if (busy) return <div className="loading"><div className="spinner"/>Loading...</div>;

  return (
    <div>
      <div className="page-head">
        <div><h1>Marks</h1><p>Add and update student marks</p></div>
        <button className="btn btn-primary" onClick={() => { setModal(true); setMsg(''); }}>+ Add Marks</button>
      </div>

      <div style={{display:'flex',gap:8,marginBottom:16,flexWrap:'wrap'}}>
        {['all', ...TYPES].map(t => (
          <button key={t} className={`btn btn-sm ${filter===t ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setFilter(t)}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {visible.length === 0
        ? <div className="card"><div className="empty"><div className="empty-icon">📊</div><p>No marks records</p></div></div>
        : (
          <div className="card">
            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>Student</th><th>Subject</th><th>Type</th><th>Marks</th><th>%</th><th>Grade</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {visible.map(m => (
                    <tr key={m._id}>
                      <td>
                        <div style={{display:'flex',alignItems:'center',gap:8}}>
                          <div className="avatar" style={{width:26,height:26,fontSize:'0.65rem'}}>{m.studentId?.name?.[0]}</div>
                          <span style={{fontWeight:600,color:'var(--text)',fontSize:'0.85rem'}}>{m.studentId?.name}</span>
                        </div>
                      </td>
                      <td>{m.subject}</td>
                      <td><span className="badge badge-info">{m.examType}</span></td>
                      <td style={{fontFamily:'monospace',fontWeight:700,color:'var(--text)'}}>{m.marks}/{m.maxMarks}</td>
                      <td style={{fontSize:'0.82rem'}}>{((m.marks / m.maxMarks) * 100).toFixed(0)}%</td>
                      <td><span style={{fontWeight:800,fontSize:'1rem',color:gradeColor(m.grade)}}>{m.grade}</span></td>
                      <td>
                        <div style={{display:'flex',gap:6}}>
                          <button className="btn btn-secondary btn-sm" onClick={() => {
                            setForm({studentId:m.studentId?._id, subject:m.subject, marks:m.marks, maxMarks:m.maxMarks, examType:m.examType, remarks:m.remarks||''});
                            setModal(true); setMsg('');
                          }}>Edit</button>
                          <button className="btn btn-danger btn-sm" onClick={() => del(m._id)}>Del</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      }

      {modal && (
        <div className="modal-bg" onClick={() => setModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-head">
              <h3>Add / Update Marks</h3>
              <button className="modal-close" onClick={() => setModal(false)}>✕</button>
            </div>
            {msg && <div className="alert alert-error">{msg}</div>}
            <div className="form-group">
              <label className="label">Student *</label>
              <select className="select" value={form.studentId} onChange={set('studentId')}>
                <option value="">Select student...</option>
                {students.map(s => <option key={s._id} value={s._id}>{s.name} ({s.enrollmentNumber || 'No ID'})</option>)}
              </select>
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label className="label">Subject *</label>
                <input className="input" placeholder="Mathematics" value={form.subject} onChange={set('subject')}/>
              </div>
              <div className="form-group">
                <label className="label">Exam Type</label>
                <select className="select" value={form.examType} onChange={set('examType')}>
                  {TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                </select>
              </div>
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label className="label">Marks *</label>
                <input className="input" type="number" min="0" placeholder="85" value={form.marks} onChange={set('marks')}/>
              </div>
              <div className="form-group">
                <label className="label">Max Marks</label>
                <input className="input" type="number" min="1" value={form.maxMarks} onChange={set('maxMarks')}/>
              </div>
            </div>
            <div className="form-group">
              <label className="label">Remarks</label>
              <input className="input" placeholder="Optional" value={form.remarks} onChange={set('remarks')}/>
            </div>
            <div style={{display:'flex',gap:8,justifyContent:'flex-end'}}>
              <button className="btn btn-secondary" onClick={() => setModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}