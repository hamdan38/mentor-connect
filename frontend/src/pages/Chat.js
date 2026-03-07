import React,{useEffect,useState,useRef} from 'react';
import {useAuth} from '../context/AuthContext';
import {getContacts,getMessages,sendMessage} from '../services/api';
import {io} from 'socket.io-client';

export default function ChatPage(){
  const {user}=useAuth();
  const [contacts,setContacts]=useState([]);
  const [selected,setSelected]=useState(null);
  const [msgs,setMsgs]=useState([]);
  const [input,setInput]=useState('');
  const [loading,setLoading]=useState(false);
  const [online,setOnline]=useState([]);
  const endRef=useRef(null);
  const sockRef=useRef(null);

  useEffect(()=>{
    getContacts().then(r=>setContacts(r.data)).catch(()=>{});
    try{
      sockRef.current=io('http://localhost:5000',{transports:['websocket'],timeout:3000});
      sockRef.current.emit('user_online',user._id);
      sockRef.current.on('online_users',u=>setOnline(u));
      sockRef.current.on('receive_message',d=>{
        setMsgs(prev=>[...prev,d]);
      });
    }catch(e){}
    return()=>{ try{sockRef.current?.disconnect();}catch(e){} };
  },[user._id]);

  useEffect(()=>{
    if(selected){
      const room=[user._id,selected._id].sort().join('_');
      try{sockRef.current?.emit('join_room',room);}catch(e){}
      setLoading(true);
      getMessages(selected._id).then(r=>setMsgs(r.data)).catch(()=>setMsgs([])).finally(()=>setLoading(false));
    }
  },[selected,user._id]);

  useEffect(()=>{ endRef.current?.scrollIntoView({behavior:'smooth'}); },[msgs]);

  async function send(){
    if(!input.trim()||!selected)return;
    const text=input; setInput('');
    const m={senderId:user._id,receiverId:selected._id,message:text,timestamp:new Date()};
    setMsgs(p=>[...p,m]);
    try{
      await sendMessage({receiverId:selected._id,message:text});
      try{sockRef.current?.emit('send_message',m);}catch(e){}
    }catch(e){}
  }

  function onKey(e){if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send();}}
  const isOnline=id=>online.includes(id);
  const fmt=ts=>new Date(ts).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});

  return(
    <div className="chat-layout">
      <div className="chat-contacts">
        <div style={{padding:'16px 14px',borderBottom:'1px solid var(--border)',fontWeight:700,fontSize:'0.9rem'}}>
          {user.role==='student'?'👨‍🏫 Mentors':'👨‍🎓 Students'}
        </div>
        {contacts.length===0?<p style={{padding:20,color:'var(--text-muted)',fontSize:'0.85rem',textAlign:'center'}}>No contacts</p>
          :contacts.map(c=>(
            <div key={c._id} className={`chat-contact ${selected?._id===c._id?'active':''}`} onClick={()=>setSelected(c)}>
              <div style={{position:'relative'}}>
                <div className="avatar" style={{width:36,height:36}}>{c.name[0]}</div>
                <div style={{position:'absolute',bottom:1,right:1,width:9,height:9,borderRadius:'50%',background:isOnline(c._id)?'var(--success)':'rgba(255,255,255,0.2)',border:'2px solid var(--bg-sidebar)'}}/>
              </div>
              <div>
                <div style={{fontWeight:600,fontSize:'0.85rem'}}>{c.name}</div>
                <div style={{fontSize:'0.72rem',color:isOnline(c._id)?'var(--success)':'var(--text-muted)'}}>{isOnline(c._id)?'● Online':'○ Offline'}</div>
              </div>
            </div>
          ))
        }
      </div>

      {selected?(
        <div className="chat-area">
          <div className="chat-head">
            <div className="avatar" style={{width:34,height:34}}>{selected.name[0]}</div>
            <div><div style={{fontWeight:700,fontSize:'0.9rem'}}>{selected.name}</div><div style={{fontSize:'0.72rem',color:isOnline(selected._id)?'var(--success)':'var(--text-muted)'}}>{isOnline(selected._id)?'Online':'Offline'}</div></div>
          </div>
          <div className="chat-messages">
            {loading?<div className="loading"><div className="spinner"/>Loading...</div>
              :msgs.length===0?<div className="empty"><div className="empty-icon">💬</div><p>Start the conversation</p></div>
              :msgs.map((m,i)=>{
                const sent=m.senderId===user._id||m.senderId?._id===user._id;
                return(
                  <div key={i} style={{display:'flex',justifyContent:sent?'flex-end':'flex-start'}}>
                    <div>
                      <div className={`msg ${sent?'msg-sent':'msg-recv'}`}>{m.message}</div>
                      <div className="msg-time" style={{textAlign:sent?'right':'left'}}>{fmt(m.timestamp)}</div>
                    </div>
                  </div>
                );
              })
            }
            <div ref={endRef}/>
          </div>
          <div className="chat-input-row">
            <textarea className="chat-input" rows={1} placeholder={`Message ${selected.name}... (Enter to send)`} value={input} onChange={e=>setInput(e.target.value)} onKeyDown={onKey}/>
            <button className="btn btn-primary" onClick={send} disabled={!input.trim()} style={{padding:'10px 18px'}}>➤</button>
          </div>
        </div>
      ):(
        <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center'}}>
          <div className="empty"><div className="empty-icon">💬</div><p>Select a {user.role==='student'?'mentor':'student'} to chat</p></div>
        </div>
      )}
    </div>
  );
}
