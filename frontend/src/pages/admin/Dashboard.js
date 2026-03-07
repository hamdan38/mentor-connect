import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { API } from '../../context/AuthContext';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [pending, setPending] = useState([]);
  const [approved, setApproved] = useState([]);
  const [busy, setBusy] = useState(true);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      setBusy(true);
      const [pRes, aRes] = await Promise.all([
        API.get('/admin/pending'),
        API.get('/admin/users')
      ]);
      setPending(pRes.data);
      setApproved(aRes.data);
    } catch (e) {
      console.error(e);
    } finally {
      setBusy(false);
    }
  }

  async function handleApprove(id) {
    if (!window.confirm('Approve this user?')) return;
    try {
      await API.put(`/admin/approve/${id}`);
      load();
    } catch (e) {
      alert(e.response?.data?.message || 'Error approving user');
    }
  }

  async function handleReject(id) {
    if (!window.confirm('Reject and delete this user?')) return;
    try {
      await API.delete(`/admin/reject/${id}`);
      load();
    } catch (e) {
      alert(e.response?.data?.message || 'Error rejecting user');
    }
  }

  if (busy) return <div className="loading"><div className="spinner"/>Loading...</div>;

  return (
    <div style={{ padding: 20 }}>
      <div className="banner" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: 4 }}>Admin Dashboard</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Approve new students and mentors</p>
        </div>
        <div>
          <button className="btn btn-secondary" onClick={logout}>🚪 Logout</button>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        <h3>Pending Approvals ({pending.length})</h3>
        {pending.length === 0 ? (
          <p style={{ padding: 20, color: 'var(--text-muted)' }}>No pending registrations.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Department</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pending.map(u => (
                  <tr key={u._id}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td><span className={`badge ${u.role === 'mentor' ? 'badge-info' : 'badge-primary'}`}>{u.role}</span></td>
                    <td>{u.department}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button className="btn btn-success btn-sm" onClick={() => handleApprove(u._id)}>Approve</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleReject(u._id)}>Reject</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="card">
        <h3>Approved Users ({approved.length})</h3>
        {approved.length === 0 ? (
          <p style={{ padding: 20, color: 'var(--text-muted)' }}>No approved users.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Department</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {approved.map(u => (
                  <tr key={u._id}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td><span className={`badge ${u.role === 'mentor' ? 'badge-info' : 'badge-primary'}`}>{u.role}</span></td>
                    <td>{u.department}</td>
                    <td>
                      <button className="btn btn-danger btn-sm" onClick={() => handleReject(u._id)}>Remove</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
