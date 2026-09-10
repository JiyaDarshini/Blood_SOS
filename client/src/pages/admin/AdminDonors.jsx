import React, { useState, useEffect } from 'react';
import { adminService } from '../../services';
import { formatBloodGroup, formatDate, formatDateTime, getUrgencyBadgeClass, getStatusBadgeClass } from '../../utils';

const AdminDonors = () => {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 });

  const fetch = async (page = 1) => {
    setLoading(true);
    try {
      const res = await adminService.getAllDonors({ page, limit: 20 });
      setDonors(res.data.data.donors);
      setPagination(res.data.data.pagination);
    } catch {}
    finally { setLoading(false); }
  };

  useEffect(() => { fetch(1); }, []);

  return (
    <main role="main">
      <div className="page-header">
        <div className="container">
          <h1>🩸 Donor Management</h1>
          <p>All registered blood donors</p>
        </div>
      </div>

      <div className="container" style={{ padding: '2rem 1.5rem' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>
          {pagination.total} donor{pagination.total !== 1 ? 's' : ''} registered
        </p>

        {loading ? (
          <div className="loading-overlay"><div className="spinner spinner-lg"></div></div>
        ) : (
          <div className="table-container">
            <table className="table" role="table" aria-label="Donors table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Blood Group</th>
                  <th>Locality</th>
                  <th>City</th>
                  <th>Availability</th>
                  <th>Account Status</th>
                  <th>Registered</th>
                </tr>
              </thead>
              <tbody>
                {donors.map((d) => (
                  <tr key={d.id}>
                    <td>
                      <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{d.user?.fullName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{d.user?.phone}</div>
                    </td>
                    <td>
                      <span className="blood-group-badge" style={{ fontSize: '0.8rem', padding: '0.15rem 0.5rem' }}>
                        {formatBloodGroup(d.bloodGroup)}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.85rem' }}>{d.locality}</td>
                    <td style={{ fontSize: '0.85rem' }}>{d.city}</td>
                    <td>
                      <span className={`badge ${d.isAvailable ? 'badge-available' : 'badge-unavailable'}`} style={{ fontSize: '0.7rem' }}>
                        {d.isAvailable ? 'AVAILABLE' : 'UNAVAILABLE'}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${d.user?.status === 'ACTIVE' ? 'badge-available' : 'badge-closed'}`} style={{ fontSize: '0.7rem' }}>
                        {d.user?.status}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{formatDate(d.registeredAt)}</td>
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

export default AdminDonors;
