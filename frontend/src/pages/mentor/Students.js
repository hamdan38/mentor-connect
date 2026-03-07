import React, { useEffect, useState } from 'react';
import { getAllStudents, getAttendance, getMarks } from '../../services/api';

export default function StudentManagement() {
  const [students, setStudents] = useState([]);
  const [search, setSearch]     = useState('');
  const [busy, setBusy]         = useState(true);
  const [selected, setSelected] = useState(null);
  const [detail, setDetail]     = useState(null);

  useEffect(()=>{ load(''); },[]);
  useEffect(()=>{ const t=setTimeout(()=>load(search),400); return()=>clearTimeout(t); },[search]);

  async function load(q) {
    try{ const {data}=await getAllStudents(q); setStudents(data); }catch(e){}finally{setBusy(false);}
  }
  async function view(s) {
    setSelected(s); setDetail(null);
    try{ const [a,m]=await Promise.all([getAttendance(s._id),getMarks(s._id)]); setDetail({att:a.data,marks:m.data}); }catch(e){}
  }

  if (busy) return <div className="loading"><div className="spinner"/>Loading...</div>;

  return (
    <div>
      <div className="page-head"><div><h1>Students</h1><p>View and manage all students</p></div></div>
      <div className="card" style={{marginBottom:16,padding:'12px 16px'}}>
        <input className="input" style={{margin:0}} placeholder="🔍 Search by name, email or enrollment..." value={search} onChange={e=>setSearch(e.target.value)}/>
      </div>
      {students.length===0 ? <div className="card"><div className="empty"><div className="empty-icon">👥</div><p>No students found</p></div></div> : (
        <div className="card">
          <div className="table-wrap">
            <table>
              <thead><tr><th>Name</th><th>Department</th><th>Enrollment</th><th>Action</th></tr></thead>
              <tbody>
                {students.map(s=>(
                  <tr key={s._id}>
                    <td><div style={{display:'flex',alignItems:'center',gap:8}}><div className="avatar" style={{width:30,height:30,fontSize:'0.7rem'}}>{s.name[0]}</div><span style={{fontWeight:600,color:'var(--text)'}}>{s.name}</span></div></td>
                    <td><span className="badge badge-primary">{s.department||'N/A'}</span></td>
                    <td style={{fontFamily:'monospace',fontSize:'0.8rem'}}>{s.enrollmentNumber||'—'}</td>
                    <td><button className="btn btn-secondary btn-sm" onClick={()=>view(s)}>👁 View</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selected && (
        <div className="modal-bg" onClick={()=>setSelected(null)}>
          <div className="modal" style={{maxWidth:560}} onClick={e=>e.stopPropagation()}>
            <div className="modal-head">
              <div style={{display:'flex',alignItems:'center',gap:12}}>
                <div className="avatar">{selected.name[0]}</div>
                <div><h3>{selected.name}</h3></div>
              </div>
              <button className="modal-close" onClick={()=>setSelected(null)}>✕</button>
            </div>
            <div className="grid-3" style={{marginBottom:16}}>
              {[['Dept',selected.department||'—'],['ID',selected.enrollmentNumber||'—'],['Phone',selected.phone||'—']].map(([l,v])=>(
                <div key={l} style={{padding:12,background:'rgba(255,255,255,0.04)',borderRadius:8}}>
                  <div style={{fontSize:'0.68rem',color:'var(--text-muted)',fontWeight:700,textTransform:'uppercase',marginBottom:4}}>{l}</div>
                  <div style={{fontSize:'0.85rem',fontWeight:600}}>{v}</div>
                </div>
              ))}
            </div>
            {!detail ? <div className="loading" style={{padding:20}}><div className="spinner"/>Loading...</div> : (
              <>
                <div style={{fontWeight:700,fontSize:'0.78rem',textTransform:'uppercase',letterSpacing:1,color:'var(--text-muted)',marginBottom:8}}>Attendance</div>
                {detail.att.length===0?<p style={{color:'var(--text-muted)',fontSize:'0.85rem',marginBottom:12}}>No records</p>:detail.att.map(a=>(
                  <div key={a._id} style={{display:'flex',justifyContent:'space-between',marginBottom:6,fontSize:'0.85rem'}}>
                    <span>{a.subject}</span><span style={{fontWeight:700,color:a.attendancePercentage>=75?'var(--success)':'var(--danger)'}}>{a.attendancePercentage}%</span>
                  </div>
                ))}
                <div style={{fontWeight:700,fontSize:'0.78rem',textTransform:'uppercase',letterSpacing:1,color:'var(--text-muted)',marginBottom:8,marginTop:16}}>Marks</div>
                {detail.marks.length===0?<p style={{color:'var(--text-muted)',fontSize:'0.85rem'}}>No records</p>:detail.marks.map(m=>(
                  <div key={m._id} style={{display:'flex',justifyContent:'space-between',marginBottom:6,fontSize:'0.85rem'}}>
                    <span>{m.subject} ({m.examType})</span><span style={{fontWeight:700}}>{m.marks}/{m.maxMarks} — <span style={{color:'var(--success)'}}>{m.grade}</span></span>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
