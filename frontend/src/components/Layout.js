import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getNotifications, markNotifsRead } from '../services/api';

const studentLinks = [
  { to: '/student/dashboard',   icon: '⊞', label: 'Dashboard'   },
  { to: '/student/attendance',  icon: '📅', label: 'Attendance'  },
  { to: '/student/marks',       icon: '📊', label: 'Marks'       },
  { to: '/student/assignments', icon: '📝', label: 'Assignments' },
  { to: '/student/chat',        icon: '💬', label: 'Chat'        },
];
const mentorLinks = [
  { to: '/mentor/dashboard',   icon: '⊞', label: 'Dashboard'  },
  { to: '/mentor/students',    icon: '👥', label: 'Students'   },
  { to: '/mentor/attendance',  icon: '📅', label: 'Attendance' },
  { to: '/mentor/marks',       icon: '📊', label: 'Marks'      },
  { to: '/mentor/assignments', icon: '📝', label: 'Assignments'},
  { to: '/mentor/chat',        icon: '💬', label: 'Chat'       },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [notifs, setNotifs]       = useState([]);
  const [showNotif, setShowNotif] = useState(false);
  const links = user?.role === 'mentor' ? mentorLinks : studentLinks;
  const unread = notifs.filter(n => !n.read).length;

  useEffect(() => {
    fetchNotifs();
    const t = setInterval(fetchNotifs, 30000);
    return () => clearInterval(t);
  }, []);

  async function fetchNotifs() {
    try { const { data } = await getNotifications(); setNotifs(data); } catch(e) {}
  }

  async function openNotifs() {
    setShowNotif(v => !v);
    if (!showNotif && unread > 0) {
      try { await markNotifsRead(); setNotifs(n => n.map(x => ({...x, read:true}))); } catch(e) {}
    }
  }

  function handleLogout() { logout(); navigate('/login'); }

  return (
    <div className="layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          🎓 MentorConnect
          <div className="sidebar-role">{user?.role === 'mentor' ? 'Mentor Portal' : 'Student Portal'}</div>
        </div>
        <nav className="sidebar-nav">
          {links.map(l => (
            <NavLink key={l.to} to={l.to} className={({isActive}) => 'nav-link' + (isActive ? ' active' : '')}>
              <span>{l.icon}</span> {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div style={{display:'flex',alignItems:'center',gap:8,padding:'6px 0',marginBottom:8}}>
            <div className="avatar" style={{width:30,height:30,fontSize:'0.72rem'}}>{user?.name?.[0]}</div>
            <div style={{fontSize:'0.82rem',fontWeight:600,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{user?.name}</div>
          </div>
          <button className="btn btn-secondary btn-sm" style={{width:'100%',justifyContent:'center'}} onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="main">
        <header className="topbar">
          <span className="topbar-title">Welcome, {user?.name?.split(' ')[0]}</span>
          <div className="topbar-right">
            <div style={{position:'relative'}}>
              <button className="btn btn-secondary btn-sm" onClick={openNotifs}>
                🔔 {unread > 0 && <span className="badge badge-danger" style={{padding:'1px 5px'}}>{unread}</span>}
              </button>
              {showNotif && (
                <div className="notif-popup">
                  <div style={{fontWeight:700,marginBottom:10,fontSize:'0.85rem'}}>Notifications</div>
                  {notifs.length === 0
                    ? <p style={{color:'var(--text-muted)',fontSize:'0.82rem',textAlign:'center',padding:'16px 0'}}>No notifications</p>
                    : notifs.slice(0,10).map((n,i) => (
                      <div key={i} className="notif-item" style={{background: n.read ? 'rgba(255,255,255,0.03)' : 'rgba(79,70,229,0.12)'}}>
                        {n.message}
                        <div style={{fontSize:'0.68rem',color:'var(--text-muted)',marginTop:3}}>{new Date(n.createdAt).toLocaleDateString()}</div>
                      </div>
                    ))
                  }
                </div>
              )}
            </div>
            <div className="avatar" style={{width:30,height:30,fontSize:'0.72rem'}}>{user?.name?.[0]}</div>
          </div>
        </header>
        <div className="page" onClick={() => showNotif && setShowNotif(false)}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
