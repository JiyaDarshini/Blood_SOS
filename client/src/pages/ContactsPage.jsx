import React, { useState, useEffect } from 'react';
import { contactService } from '../services';
import { formatBloodGroup, formatDateTime } from '../utils';

const ContactsPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 });

  const fetch = async (page = 1) => {
    setLoading(true);
    try {
      const res = await contactService.getContacts({ page, limit: 20 });
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
          <h1>📞 Contact History</h1>
          <p>Your blood donor contact log</p>
        </div>
      </div>

      <div className="container" style={{ padding: '2rem 1.5rem' }}>
        {loading ? (
          <div className="loading-overlay">
            <div className="spinner spinner-lg"></div>
          </div>
        ) : logs.length === 0 ? (
          <div className="empty-state">
            <span className="empty-state-icon">📞</span>
            <h3>No Contact History</h3>
            <p>You haven't contacted any donors yet. Find a donor and use the contact buttons.</p>
            <a href="/donors" className="btn btn-primary" style={{ marginTop: '1rem' }}>Find Donors</a>
          </div>
        ) : (
          <>
            <div className="table-container">
              <table className="table" role="table" aria-label="Contact history">
                <thead>
                  <tr>
                    <th>Donor</th>
                    <th>Blood Group</th>
                    <th>SOS / Hospital</th>
                    <th>Method</th>
                    <th>Date & Time</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log.id}>
                      <td>
                        <strong>{log.donor?.user?.fullName || '—'}</strong>
                        <br />
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          {log.donor?.user?.phone}
                        </span>
                      </td>
                      <td>
                        <span className="blood-group-badge" style={{ fontSize: '0.78rem', padding: '0.15rem 0.4rem' }}>
                          {formatBloodGroup(log.donor?.bloodGroup)}
                        </span>
                      </td>
                      <td>
                        <strong style={{ fontSize: '0.85rem' }}>{log.sos?.hospitalName || '—'}</strong>
                        <br />
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {log.sos?.urgency} • {log.sos ? formatBloodGroup(log.sos.bloodGroup) : ''}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${log.channel === 'CALL' ? 'badge-urgent' : 'badge-active'}`}>
                          {log.channel === 'CALL' ? '📞 CALL' : '💬 WHATSAPP'}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                        {formatDateTime(log.contactedAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {pagination.totalPages > 1 && (
              <div className="pagination">
                <button className="pagination-btn" disabled={pagination.page <= 1}
                  onClick={() => fetch(pagination.page - 1)}>← Prev</button>
                <button className="pagination-btn" disabled={pagination.page >= pagination.totalPages}
                  onClick={() => fetch(pagination.page + 1)}>Next →</button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
};

export default ContactsPage;
