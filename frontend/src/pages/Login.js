import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [form, setForm]   = useState({ email:'', password:'' });
  const [error, setError] = useState('');
  const [busy, setBusy]   = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();

  async function submit(e) {
    e.preventDefault(); setError(''); setBusy(true);
    try {
      const u = await login(form.email, form.password);
      if (u.role === 'admin') navigate('/admin');
      else navigate(u.role === 'mentor' ? '/mentor/dashboard' : '/student/dashboard');
    } catch(err) {
      setError(err.response?.data?.message || 'Login failed. Check credentials.');
    } finally { setBusy(false); }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon">🎓</div>
          <h1>MentorConnect</h1>
          <p>Sign in to your account</p>
        </div>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={submit}>
          <div className="form-group">
            <label className="label">Email</label>
            <input className="input" type="email" placeholder="you@example.com"
              value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required />
          </div>
          <div className="form-group">
            <label className="label">Password</label>
            <input className="input" type="password" placeholder="••••••••"
              value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required />
          </div>
          <button className="btn btn-primary" style={{width:'100%',justifyContent:'center',padding:'11px'}} disabled={busy}>
            {busy ? 'Signing in...' : 'Sign In →'}
          </button>
        </form>
        <p style={{textAlign:'center',marginTop:20,fontSize:'0.85rem',color:'var(--text-muted)'}}>
          No account? <Link to="/register" style={{color:'#818cf8',fontWeight:600}}>Register</Link>
        </p>
      </div>
    </div>
  );
}
