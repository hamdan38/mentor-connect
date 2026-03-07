import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [form, setForm]   = useState({ name:'',email:'',password:'',confirm:'',role:'student',department:'',enrollmentNumber:'',phone:'' });
  const [error, setError] = useState('');
  const [busy, setBusy]   = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const set = f => e => setForm({...form, [f]: e.target.value});

  async function submit(e) {
    e.preventDefault(); setError('');
    if (form.password !== form.confirm) return setError('Passwords do not match');
    if (form.password.length < 6) return setError('Password must be at least 6 characters');
    setBusy(true);
    try {
      const u = await register(form);
      navigate(u.role === 'mentor' ? '/mentor/dashboard' : '/student/dashboard');
    } catch(err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally { setBusy(false); }
  }

  return (
    <div className="auth-page">
      <div className="auth-card" style={{maxWidth:500}}>
        <div className="auth-logo">
          <div className="auth-logo-icon">🎓</div>
          <h1>Create Account</h1>
          <p>Join MentorConnect today</p>
        </div>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={submit}>
          <div className="grid-2">
            <div className="form-group">
              <label className="label">Full Name</label>
              <input className="input" placeholder="John Doe" value={form.name} onChange={set('name')} required />
            </div>
            <div className="form-group">
              <label className="label">Role</label>
              <select className="select" value={form.role} onChange={set('role')}>
                <option value="student">👨‍🎓 Student</option>
                <option value="mentor">👨‍🏫 Mentor</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="label">Email</label>
            <input className="input" type="email" placeholder="you@example.com" value={form.email} onChange={set('email')} required />
          </div>
          <div className="grid-2">
            <div className="form-group">
              <label className="label">Department</label>
              <input className="input" placeholder="Computer Science" value={form.department} onChange={set('department')} />
            </div>
            <div className="form-group">
              <label className="label">Enrollment / ID</label>
              <input className="input" placeholder="CS2024001" value={form.enrollmentNumber} onChange={set('enrollmentNumber')} />
            </div>
          </div>
          <div className="form-group">
            <label className="label">Phone</label>
            <input className="input" placeholder="+91 98765 43210" value={form.phone} onChange={set('phone')} />
          </div>
          <div className="grid-2">
            <div className="form-group">
              <label className="label">Password</label>
              <input className="input" type="password" placeholder="min 6 chars" value={form.password} onChange={set('password')} required />
            </div>
            <div className="form-group">
              <label className="label">Confirm</label>
              <input className="input" type="password" placeholder="repeat password" value={form.confirm} onChange={set('confirm')} required />
            </div>
          </div>
          <button className="btn btn-primary" style={{width:'100%',justifyContent:'center',padding:'11px'}} disabled={busy}>
            {busy ? 'Creating...' : 'Create Account →'}
          </button>
        </form>
        <p style={{textAlign:'center',marginTop:20,fontSize:'0.85rem',color:'var(--text-muted)'}}>
          Have an account? <Link to="/login" style={{color:'#818cf8',fontWeight:600}}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
