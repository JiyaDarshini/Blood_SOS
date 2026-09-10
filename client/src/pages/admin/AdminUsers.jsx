import React, { useState, useEffect } from 'react';
import { adminService } from '../../services';
import { formatDate } from '../../utils';
import './AdminPages.css';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 });
  const [search, setSearch] = useState('');
  const [actionMsg, setActionMsg] = useState('');

  const fetch = async (page = 1) => {
    setLoading(true);
    try {
      const res = await adminService.getAllUsers({ page, limit: 20, search });
      setUsers(res.data.data.users);
      setPagination(res.data.data.pagination);
    } catch {}
    finally { setLoading(false); }
  };

  useEffect(() => { fetch(1); }, []);

  const handleStatusChange = async (id, currentStatus) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'DISABLED' : 'ACTIVE';
    try {
      await adminService.updateUserStatus(id, newStatus);
      setUsers((p) => p.map((u) => u.id === id ? { ...u, status: newStatus } : u));
      setActionMsg(`User ${newStatus === 'ACTIVE' ? 'enabled' : 'disabled'} successfully.`);
    } catch {}
  };

  return (
    <main role="main">
      <div className="page-header">
        <div className="container">
          <h1>👥 User Management</h1>
          <p>Manage all registered users</p>
        </div>
      </div>

      <div className="container" style={{ padding: '2rem 1.5rem' }}>
        {actionMsg && <div className="alert alert-success mb-3" role="status">✓ {actionMsg}</div>}

        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <input type="text" className="form-input" value={search}
            onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, email, phone..."
            style={{ maxWidth: '320px' }} aria-label="Search users" />
          <button onClick={() => fetch(1)} className="btn btn-primary btn-sm">Search</button>
        </div>

        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>
          {pagination.total} user{pagination.total !== 1 ? 's' : ''} found
        </p>

        {loading ? (
          <div className="loading-overlay"><div className="spinner spinner-lg"></div></div>
        ) : (
          <div className="table-container">
            <table className="table" role="table" aria-label="Users table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>SOS Count</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td><strong style={{ fontSize: '0.88rem' }}>{u.fullName}</strong></td>
                    <td style={{ fontSize: '0.82rem' }}>{u.email}</td>
                    <td style={{ fontSize: '0.82rem' }}>{u.phone}</td>
                    <td><span className="badge badge-active" style={{ fontSize: '0.7rem' }}>{u.role}</span></td>
                    <td style={{ textAlign: 'center' }}>{u._count?.sosRequests || 0}</td>
                    <td>
                      <span className={`badge ${u.status === 'ACTIVE' ? 'badge-available' : 'badge-closed'}`}
                        style={{ fontSize: '0.7rem' }}>
                        {u.status}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{formatDate(u.createdAt)}</td>
                    <td>
                      <button
                        className={`btn btn-sm ${u.status === 'ACTIVE' ? 'btn-secondary' : 'btn-primary'}`}
                        onClick={() => handleStatusChange(u.id, u.status)}
                        style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem', minHeight: 'auto' }}
                      >
                        {u.status === 'ACTIVE' ? 'Disable' : 'Enable'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {pagination.totalPages > 1 && (
          <div className="pagination">
            <button className="pagination-btn" disabled={pagination.page <= 1}
              onClick={() => fetch(pagination.page - 1)}>← Prev</button>
            <button className="pagination-btn" disabled={pagination.page >= pagination.totalPages}
              onClick={() => fetch(pagination.page + 1)}>Next →</button>
          </div>
        )}
      </div>
    </main>
  );
};

export default AdminUsers;
