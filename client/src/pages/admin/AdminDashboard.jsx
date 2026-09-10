import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services';
import { formatBloodGroup, formatDateTime } from '../../utils';
import './AdminPages.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentSOS, setRecentSOS] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await adminService.getDashboardStats();
        setStats(res.data.data.stats);
        setRecentSOS(res.data.data.recentSOS);
        setRecentUsers(res.data.data.recentUsers);
      } catch {}
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  if (loading) return <div className="loading-overlay" style={{ minHeight: '60vh' }}><div className="spinner spinner-lg"></div></div>;

  return (
    <main role="main">
      <div className="page-header">
        <div className="container">
          <h1>⚙️ Admin Dashboard</h1>
          <p>Platform monitoring and management</p>
        </div>
      </div>

      <div className="container" style={{ padding: '2rem 1.5rem' }}>
        {/* Stats */}
        <div className="stats-grid" style={{ marginBottom: '2rem' }}>
          <div className="stat-card red">
            <div className="stat-number">{stats?.activeSOS || 0}</div>
            <div className="stat-label">Active SOS</div>
          </div>
          <div className="stat-card accent" style={{ background: '#7f0000' }}>
            <div className="stat-number" style={{ color: 'white' }}>{stats?.criticalSOS || 0}</div>
            <div className="stat-label">Critical SOS</div>
          </div>
          <div className="stat-card">
            <div className="stat-number" style={{ color: 'var(--primary-red)' }}>{stats?.totalUsers || 0}</div>
            <div className="stat-label">Total Users</div>
          </div>
          <div className="stat-card">
            <div className="stat-number" style={{ color: 'var(--primary-red)' }}>{stats?.totalDonors || 0}</div>
            <div className="stat-label">Total Donors</div>
          </div>
          <div className="stat-card">
            <div className="stat-number" style={{ color: 'var(--success-green)' }}>{stats?.availableDonors || 0}</div>
            <div className="stat-label">Available Donors</div>
          </div>
          <div className="stat-card">
            <div className="stat-number" style={{ color: 'var(--success-green)' }}>{stats?.fulfilledSOS || 0}</div>
            <div className="stat-label">Fulfilled SOS</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats?.totalContacts || 0}</div>
            <div className="stat-label">Total Contacts</div>
          </div>
        </div>

        {/* Admin Nav */}
        <div className="grid-4 mb-4">
          {[
            { to: '/admin/users', label: '👥 Users', desc: 'Manage users' },
            { to: '/admin/donors', label: '🩸 Donors', desc: 'Manage donors' },
            { to: '/admin/sos', label: '🚨 SOS', desc: 'Manage requests' },
            { to: '/admin/contacts', label: '📞 Contacts', desc: 'View logs' },
          ].map((item) => (
            <Link key={item.to} to={item.to} className="card admin-nav-card">
              <div className="admin-nav-icon">{item.label.split(' ')[0]}</div>
              <h3>{item.label.slice(2)}</h3>
              <p>{item.desc}</p>
            </Link>
          ))}
        </div>

        <div className="admin-recent-grid">
          {/* Recent SOS */}
          <div>
            <div className="dash-section-header mb-2">
              <h2 className="section-title">Recent SOS</h2>
              <Link to="/admin/sos" className="btn btn-secondary btn-sm">View All</Link>
            </div>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr><th>Blood Group</th><th>Hospital</th><th>Urgency</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {recentSOS.map((s) => (
                    <tr key={s.id}>
                      <td><span className="blood-group-badge" style={{ fontSize: '0.75rem', padding: '0.1rem 0.4rem' }}>{formatBloodGroup(s.bloodGroup)}</span></td>
                      <td style={{ fontSize: '0.85rem' }}>{s.hospitalName}</td>
                      <td><span className={`badge badge-${s.urgency.toLowerCase()}`}>{s.urgency}</span></td>
                      <td><span className={`badge badge-${s.status.toLowerCase()}`}>{s.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Users */}
          <div>
            <div className="dash-section-header mb-2">
              <h2 className="section-title">Recent Users</h2>
              <Link to="/admin/users" className="btn btn-secondary btn-sm">View All</Link>
            </div>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr><th>Name</th><th>Role</th><th>Joined</th></tr>
                </thead>
                <tbody>
                  {recentUsers.map((u) => (
                    <tr key={u.id}>
                      <td>
                        <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{u.fullName}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{u.email}</div>
                      </td>
                      <td><span className="badge badge-active" style={{ fontSize: '0.7rem' }}>{u.role}</span></td>
                      <td style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{formatDateTime(u.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AdminDashboard;
