import React,{useEffect,useState} from 'react';
import {getAllStudents,getAllAttendance,upsertAttendance,deleteAttendance} from '../../services/api';

export default function AttendanceManagement(){
  const [students,setStudents]=useState([]);
  const [att,setAtt]=useState([]);
  const [busy,setBusy]=useState(true);
  const [modal,setModal]=useState(false);
  const [form,setForm]=useState({studentId:'',subject:'',attendancePercentage:'',totalClasses:'',attendedClasses:''});
  const [saving,setSaving]=useState(false);
  const [msg,setMsg]=useState('');
  const set=f=>e=>setForm({...form,[f]:e.target.value});

  useEffect(()=>{load();},[]);
  async function load(){try{const[s,a]=await Promise.all([getAllStudents(),getAllAttendance()]);setStudents(s.data);setAtt(a.data);}catch(e){}finally{setBusy(false);}}
  async function save(){
    if(!form.studentId||!form.subject||form.attendancePercentage===''){return setMsg('Fill required fields');}
    setSaving(true);setMsg('');
    try{await upsertAttendance({...form,attendancePercentage:+form.attendancePercentage,totalClasses:+form.totalClasses,attendedClasses:+form.attendedClasses});setModal(false);setForm({studentId:'',subject:'',attendancePercentage:'',totalClasses:'',attendedClasses:''});await load();}
    catch(e){setMsg(e.response?.data?.message||'Failed');}finally{setSaving(false);}
  }
  async function del(id){if(!window.confirm('Delete?'))return;await deleteAttendance(id);load();}

  const grouped=att.reduce((acc,a)=>{const k=a.studentId?._id;if(!acc[k])acc[k]={student:a.studentId,records:[]};acc[k].records.push(a);return acc;},{});
  if(busy)return<div className="loading"><div className="spinner"/>Loading...</div>;

  return(
    <div>
      <div className="page-head"><div><h1>Attendance</h1><p>Mark and update student attendance</p></div><button className="btn btn-primary" onClick={()=>{setModal(true);setMsg('');}}>+ Mark Attendance</button></div>
      {Object.keys(grouped).length===0?<div className="card"><div className="empty"><div className="empty-icon">📅</div><p>No records yet. Start marking attendance.</p></div></div>
        :Object.values(grouped).map(({student,records})=>(
          <div key={student?._id} className="card" style={{marginBottom:16}}>
            <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:14}}>
              <div className="avatar" style={{width:32,height:32,fontSize:'0.72rem'}}>{student?.name?.[0]}</div>
              <span style={{fontWeight:700}}>{student?.name}</span>
              <span style={{color:'var(--text-muted)',fontSize:'0.8rem'}}>{student?.enrollmentNumber||'No ID'}</span>
            </div>
            <div className="table-wrap"><table>
              <thead><tr><th>Subject</th><th>Attended</th><th>Total</th><th>%</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>{records.map(r=>(
                <tr key={r._id}>
                  <td style={{fontWeight:600,color:'var(--text)'}}>{r.subject}</td>
                  <td style={{fontFamily:'monospace'}}>{r.attendedClasses||0}</td>
                  <td style={{fontFamily:'monospace'}}>{r.totalClasses||0}</td>
                  <td>
                    <div style={{display:'flex',alignItems:'center',gap:6}}>
                      <div className="progress" style={{width:60,height:5}}><div className="progress-bar" style={{width:`${r.attendancePercentage}%`,background:r.attendancePercentage>=75?'var(--success)':'var(--danger)'}}/></div>
                      <span style={{fontFamily:'monospace',fontSize:'0.82rem',fontWeight:700}}>{r.attendancePercentage}%</span>
                    </div>
                  </td>
                  <td><span className={`badge ${r.attendancePercentage>=75?'badge-success':r.attendancePercentage>=60?'badge-warning':'badge-danger'}`}>{r.attendancePercentage>=75?'Good':r.attendancePercentage>=60?'Average':'Low'}</span></td>
                  <td>
                    <div style={{display:'flex',gap:6}}>
                      <button className="btn btn-secondary btn-sm" onClick={()=>{setForm({studentId:student._id,subject:r.subject,attendancePercentage:r.attendancePercentage,totalClasses:r.totalClasses||'',attendedClasses:r.attendedClasses||''});setModal(true);setMsg('');}}>Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={()=>del(r._id)}>Del</button>
                    </div>
                  </td>
                </tr>
              ))}</tbody>
            </table></div>
          </div>
        ))
      }
      {modal&&(
        <div className="modal-bg" onClick={()=>setModal(false)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="modal-head"><h3>Mark / Update Attendance</h3><button className="modal-close" onClick={()=>setModal(false)}>✕</button></div>
            {msg&&<div className="alert alert-error">{msg}</div>}
            <div className="form-group"><label className="label">Student *</label>
              <select className="select" value={form.studentId} onChange={set('studentId')}>
                <option value="">Select student...</option>
                {students.map(s=><option key={s._id} value={s._id}>{s.name} ({s.enrollmentNumber||'No ID'})</option>)}
              </select>
            </div>
            <div className="form-group"><label className="label">Subject *</label><input className="input" placeholder="e.g. Mathematics" value={form.subject} onChange={set('subject')}/></div>
            <div className="grid-2">
              <div className="form-group"><label className="label">Total Classes</label><input className="input" type="number" min="0" value={form.totalClasses} onChange={set('totalClasses')}/></div>
              <div className="form-group"><label className="label">Attended</label><input className="input" type="number" min="0" value={form.attendedClasses} onChange={set('attendedClasses')}/></div>
            </div>
            <div className="form-group"><label className="label">Percentage * (0–100)</label><input className="input" type="number" min="0" max="100" placeholder="85" value={form.attendancePercentage} onChange={set('attendancePercentage')}/></div>
            <div style={{display:'flex',gap:8,justifyContent:'flex-end'}}>
              <button className="btn btn-secondary" onClick={()=>setModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={save} disabled={saving}>{saving?'Saving...':'Save'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
