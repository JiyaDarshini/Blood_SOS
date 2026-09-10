import React, { useState, useEffect } from 'react';
import { adminService } from '../../services';
import { formatBloodGroup, formatDateTime } from '../../utils';

const AdminContacts = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 });

  const fetch = async (page = 1) => {
    setLoading(true);
    try {
      const res = await adminService.getAllContacts({ page, limit: 20 });
      setLogs(res.data.data.logs);
      setPagination(res.data.data.pagination);
    } catch {}
    finally { setLoading(false); }
  };

  useEffect(() => { fetch(1); }, []);

  return (
    <main role="main">
      <div className="page-header">
        <div className="container">
          <h1>📞 Contact Logs</h1>
          <p>All donor contact attempts across the platform</p>
        </div>
      </div>

      <div className="container" style={{ padding: '2rem 1.5rem' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>
          {pagination.total} contact log{pagination.total !== 1 ? 's' : ''} total
        </p>

        {loading ? (
          <div className="loading-overlay"><div className="spinner spinner-lg"></div></div>
        ) : logs.length === 0 ? (
          <div className="empty-state">
            <span className="empty-state-icon">📞</span>
            <h3>No Contact Logs</h3>
          </div>
        ) : (
          <div className="table-container">
            <table className="table" role="table" aria-label="Contact logs table">
              <thead>
                <tr>
                  <th>User (Requester)</th>
                  <th>Donor</th>
                  <th>Blood Group</th>
                  <th>SOS Hospital</th>
                  <th>Method</th>
                  <th>Date & Time</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id}>
                    <td style={{ fontSize: '0.85rem' }}>
                      <div>{log.user?.fullName}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{log.user?.email}</div>
                    </td>
                    <td style={{ fontSize: '0.85rem' }}>{log.donor?.user?.fullName}</td>
                    <td>
                      <span className="blood-group-badge" style={{ fontSize: '0.75rem', padding: '0.1rem 0.4rem' }}>
                        {formatBloodGroup(log.donor?.bloodGroup)}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.82rem' }}>{log.sos?.hospitalName}</td>
                    <td>
                      <span className={`badge ${log.channel === 'CALL' ? 'badge-urgent' : 'badge-active'}`} style={{ fontSize: '0.7rem' }}>
                        {log.channel === 'CALL' ? '📞 CALL' : '💬 WHATSAPP'}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{formatDateTime(log.contactedAt)}</td>
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

export default AdminContacts;
