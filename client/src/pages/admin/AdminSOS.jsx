import React, { useState, useEffect } from 'react';
import { adminService } from '../../services';
import { formatBloodGroup, formatDateTime, getUrgencyBadgeClass, getStatusBadgeClass } from '../../utils';

const AdminSOS = () => {
  const [sosList, setSosList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 });
  const [actionMsg, setActionMsg] = useState('');

  const fetch = async (page = 1) => {
    setLoading(true);
    try {
      const res = await adminService.getAllSOS({ page, limit: 20 });
      setSosList(res.data.data.sos);
      setPagination(res.data.data.pagination);
    } catch {}
    finally { setLoading(false); }
  };

  useEffect(() => { fetch(1); }, []);

  const handleClose = async (id) => {
    try {
      await adminService.closeSOS(id);
      setSosList((p) => p.map((s) => s.id === id ? { ...s, status: 'CLOSED' } : s));
      setActionMsg('SOS closed by admin.');
    } catch {}
  };

  return (
    <main role="main">
      <div className="page-header">
        <div className="container">
          <h1>🚨 SOS Management</h1>
          <p>Monitor and manage all emergency requests</p>
        </div>
      </div>

      <div className="container" style={{ padding: '2rem 1.5rem' }}>
        {actionMsg && <div className="alert alert-success mb-3" role="status">✓ {actionMsg}</div>}

        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>
          {pagination.total} SOS request{pagination.total !== 1 ? 's' : ''} total
        </p>

        {loading ? (
          <div className="loading-overlay"><div className="spinner spinner-lg"></div></div>
        ) : (
          <div className="table-container">
            <table className="table" role="table" aria-label="SOS management table">
              <thead>
                <tr>
                  <th>Blood Group</th>
                  <th>Hospital</th>
                  <th>Locality</th>
                  <th>Urgency</th>
                  <th>Status</th>
                  <th>Requester</th>
                  <th>Contacts</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sosList.map((s) => (
                  <tr key={s.id}>
                    <td>
                      <span className="blood-group-badge" style={{ fontSize: '0.78rem', padding: '0.1rem 0.4rem' }}>
                        {formatBloodGroup(s.bloodGroup)}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.85rem' }}>{s.hospitalName}</td>
                    <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{s.locality}, {s.city}</td>
                    <td><span className={`badge ${getUrgencyBadgeClass(s.urgency)}`} style={{ fontSize: '0.7rem' }}>{s.urgency}</span></td>
                    <td><span className={`badge ${getStatusBadgeClass(s.status)}`} style={{ fontSize: '0.7rem' }}>{s.status}</span></td>
                    <td style={{ fontSize: '0.82rem' }}>{s.requester?.fullName}</td>
                    <td style={{ textAlign: 'center', fontSize: '0.85rem' }}>{s._count?.contactLogs || 0}</td>
                    <td style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{formatDateTime(s.createdAt)}</td>
                    <td>
                      {s.status === 'ACTIVE' && (
                        <button className="btn btn-sm" style={{ fontSize: '0.72rem', padding: '0.25rem 0.5rem', border: '1px solid #666', color: '#666', background: 'none', cursor: 'pointer', minHeight: 'auto' }}
                          onClick={() => handleClose(s.id)}>
                          Close
                        </button>
                      )}
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

export default AdminSOS;
