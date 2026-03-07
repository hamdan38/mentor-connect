import React,{useEffect,useState} from 'react';
import {getAssignments,createAssignment,deleteAssignment,getSubmissions,gradeSubmission} from '../../services/api';

export default function AssignmentManagement(){
  const [asgn,setAsgn]=useState([]);
  const [busy,setBusy]=useState(true);
  const [modal,setModal]=useState(false);
  const [form,setForm]=useState({title:'',description:'',subject:'',dueDate:'',maxMarks:'100'});
  const [saving,setSaving]=useState(false);
  const [msg,setMsg]=useState('');
  const [viewSubs,setViewSubs]=useState(null);
  const [subs,setSubs]=useState([]);
  const [grading,setGrading]=useState(null);
  const [grade,setGrade]=useState({marks:'',feedback:''});
  const set=f=>e=>setForm({...form,[f]:e.target.value});

  useEffect(()=>{load();},[]);
  async function load(){try{const{data}=await getAssignments();setAsgn(data);}catch(e){}finally{setBusy(false);}}
  async function create(){
    if(!form.title||!form.subject||!form.dueDate){return setMsg('Fill required fields');}
    setSaving(true);setMsg('');
    try{await createAssignment(form);setModal(false);setForm({title:'',description:'',subject:'',dueDate:'',maxMarks:'100'});await load();}
    catch(e){setMsg(e.response?.data?.message||'Failed');}finally{setSaving(false);}
  }
  async function del(id){if(!window.confirm('Delete assignment?'))return;await deleteAssignment(id);load();}
  async function loadSubs(a){setViewSubs(a);setSubs([]);try{const{data}=await getSubmissions(a._id);setSubs(data);}catch(e){}}
  async function doGrade(sid){
    if(!grade.marks){return;}
    try{await gradeSubmission(sid,{marks:+grade.marks,feedback:grade.feedback});setGrading(null);setGrade({marks:'',feedback:''});await loadSubs(viewSubs);}catch(e){}
  }

  if(busy)return<div className="loading"><div className="spinner"/>Loading...</div>;

  return(
    <div>
      <div className="page-head"><div><h1>Assignments</h1><p>Create and review assignments</p></div><button className="btn btn-primary" onClick={()=>{setModal(true);setMsg('');}}>+ New Assignment</button></div>
      {asgn.length===0?<div className="card"><div className="empty"><div className="empty-icon">📝</div><p>No assignments yet</p></div></div>:(
        <div style={{display:'flex',flexDirection:'column',gap:14}}>
          {asgn.map(a=>(
            <div key={a._id} className="card">
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:12}}>
                <div style={{flex:1}}>
                  <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:6,flexWrap:'wrap'}}>
                    <span style={{fontWeight:700}}>{a.title}</span>
                    <span className="badge badge-primary">{a.subject}</span>
                    {new Date()>new Date(a.dueDate)&&<span className="badge badge-danger">⏰ Overdue</span>}
                  </div>
                  <p style={{color:'var(--text-muted)',fontSize:'0.85rem',marginBottom:6}}>{a.description}</p>
                  <div style={{display:'flex',gap:16,fontSize:'0.78rem',color:'var(--text-muted)',flexWrap:'wrap'}}>
                    <span>📅 Due: {new Date(a.dueDate).toLocaleDateString()}</span>
                    <span>🎯 Max: {a.maxMarks}</span>
                  </div>
                </div>
                <div style={{display:'flex',gap:8,flexShrink:0}}>
                  <button className="btn btn-secondary btn-sm" onClick={()=>loadSubs(a)}>👀 Subs</button>
                  <button className="btn btn-danger btn-sm" onClick={()=>del(a._id)}>🗑</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal&&(
        <div className="modal-bg" onClick={()=>setModal(false)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="modal-head"><h3>New Assignment</h3><button className="modal-close" onClick={()=>setModal(false)}>✕</button></div>
            {msg&&<div className="alert alert-error">{msg}</div>}
            <div className="form-group"><label className="label">Title *</label><input className="input" placeholder="e.g. Lab Assignment 3" value={form.title} onChange={set('title')}/></div>
            <div className="form-group"><label className="label">Description</label><textarea className="textarea" placeholder="Describe the task..." value={form.description} onChange={set('description')}/></div>
            <div className="grid-2">
              <div className="form-group"><label className="label">Subject *</label><input className="input" placeholder="Computer Science" value={form.subject} onChange={set('subject')}/></div>
              <div className="form-group"><label className="label">Max Marks</label><input className="input" type="number" value={form.maxMarks} onChange={set('maxMarks')}/></div>
            </div>
            <div className="form-group"><label className="label">Due Date *</label><input className="input" type="datetime-local" value={form.dueDate} onChange={set('dueDate')}/></div>
            <div style={{display:'flex',gap:8,justifyContent:'flex-end'}}>
              <button className="btn btn-secondary" onClick={()=>setModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={create} disabled={saving}>{saving?'Creating...':'📤 Create & Notify'}</button>
            </div>
          </div>
        </div>
      )}

      {viewSubs&&(
        <div className="modal-bg" onClick={()=>setViewSubs(null)}>
          <div className="modal" style={{maxWidth:620}} onClick={e=>e.stopPropagation()}>
            <div className="modal-head"><h3>Submissions: {viewSubs.title}</h3><button className="modal-close" onClick={()=>setViewSubs(null)}>✕</button></div>
            {subs.length===0?<div className="empty"><div className="empty-icon">📬</div><p>No submissions yet</p></div>
              :subs.map(s=>(
                <div key={s._id} style={{padding:14,background:'rgba(255,255,255,0.03)',borderRadius:10,marginBottom:10,border:'1px solid var(--border)'}}>
                  <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:8}}>
                    <div style={{display:'flex',alignItems:'center',gap:8}}>
                      <div className="avatar" style={{width:28,height:28,fontSize:'0.65rem'}}>{s.studentId?.name?.[0]}</div>
                      <span style={{fontWeight:700,fontSize:'0.85rem'}}>{s.studentId?.name}</span>
                      <span style={{color:'var(--text-muted)',fontSize:'0.75rem'}}>{new Date(s.submittedAt).toLocaleDateString()}</span>
                    </div>
                    <span className={`badge ${s.status==='graded'?'badge-success':s.status==='late'?'badge-danger':'badge-info'}`}>{s.status}</span>
                  </div>
                  <p style={{fontSize:'0.84rem',color:'var(--text-muted)',lineHeight:1.5,marginBottom:10}}>{s.submissionText||'No text'}</p>
                  {s.status!=='graded'?(
                    grading===s._id?(
                      <div>
                        <div className="grid-2" style={{marginBottom:8}}>
                          <input className="input" style={{padding:'7px 10px'}} type="number" placeholder="Marks" value={grade.marks} onChange={e=>setGrade({...grade,marks:e.target.value})}/>
                          <input className="input" style={{padding:'7px 10px'}} placeholder="Feedback" value={grade.feedback} onChange={e=>setGrade({...grade,feedback:e.target.value})}/>
                        </div>
                        <div style={{display:'flex',gap:8}}>
                          <button className="btn btn-primary btn-sm" onClick={()=>doGrade(s._id)}>✅ Grade</button>
                          <button className="btn btn-secondary btn-sm" onClick={()=>setGrading(null)}>Cancel</button>
                        </div>
                      </div>
                    ):<button className="btn btn-secondary btn-sm" onClick={()=>{setGrading(s._id);setGrade({marks:'',feedback:''});}}>Grade</button>
                  ):<p style={{fontSize:'0.8rem',color:'var(--success)'}}>✅ Graded: {s.marks}/{viewSubs.maxMarks} | {s.feedback||'No feedback'}</p>}
                </div>
              ))
            }
          </div>
        </div>
      )}
    </div>
  );
}
