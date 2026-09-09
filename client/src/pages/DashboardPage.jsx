import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { sosService } from '../services';
import SOSCard from '../components/SOSCard';
import './DashboardPage.css';

const DashboardPage = () => {
  const { user, isDonor } = useAuth();
  const [recentSOS, setRecentSOS] = useState([]);
  const [stats, setStats] = useState({ activeSOS: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sosRes = await sosService.getSOSRequests({ limit: 4, status: 'ACTIVE', sort: 'urgent' });
        setRecentSOS(sosRes.data.data.sos);
        setStats({ activeSOS: sosRes.data.data.pagination?.total || 0 });
      } catch {}
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const quickActions = [
    { label: '🚨 POST SOS', to: '/sos/create', cls: 'btn-primary', id: 'dash-post-sos' },
    { label: '🩸 FIND DONOR', to: '/donors', cls: 'btn-dark', id: 'dash-find-donor' },
    { label: '📋 SOS BOARD', to: '/sos', cls: 'btn-secondary', id: 'dash-sos-board' },
    { label: '👤 MY PROFILE', to: '/profile', cls: 'btn-secondary', id: 'dash-profile' },
  ];

  return (
    <main className="dashboard-page" role="main">
      <div className="container">
        {/* Welcome */}
        <div className="dashboard-welcome">
          <div>
            <h1>Welcome, <span className="text-red">{user?.fullName?.split(' ')[0]}</span></h1>
            <p className="text-muted">
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="dash-role-badge">
            <span className="badge badge-active">{user?.role}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card red">
            <div className="stat-number">{stats.activeSOS}</div>
            <div className="stat-label">Active SOS Requests</div>
          </div>
          <div className="stat-card">
            <div className="stat-number" style={{ color: 'var(--primary-red)' }}>🩸</div>
            <div className="stat-label">Emergency Network</div>
          </div>
          <div className="stat-card accent">
            <div className="stat-number" style={{ color: 'white', fontSize: '1.5rem' }}>
              {user?.donor?.bloodGroup?.replace('_POS', '+').replace('_NEG', '-') || '—'}
            </div>
            <div className="stat-label">My Blood Group</div>
          </div>
          <div className="stat-card">
            <div className="stat-number" style={{ color: 'var(--primary-red)', fontSize: '1.5rem' }}>
              {user?.donor?.isAvailable === true ? '✓' : user?.donor ? '—' : 'N/A'}
            </div>
            <div className="stat-label">Donor Status</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="dash-section">
          <h2 className="section-title">Quick Actions</h2>
          <div className="section-title-line"></div>
          <div className="quick-actions">
            {quickActions.map((a) => (
              <Link key={a.id} id={a.id} to={a.to} className={`btn ${a.cls} btn-lg`}>
                {a.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Donor availability */}
        {isDonor && user?.donor && (
          <div className="dash-section dash-availability-banner">
            <div>
              <h3>🩸 Donation Availability</h3>
              <p>
                You are currently{' '}
                <strong className={user.donor.isAvailable ? 'text-green' : 'text-red'}>
                  {user.donor.isAvailable ? 'AVAILABLE' : 'UNAVAILABLE'}
                </strong>
                {' '}for donation
              </p>
            </div>
            <Link to="/profile" className="btn btn-secondary btn-sm">Manage Availability</Link>
          </div>
        )}

        {/* Recent SOS */}
        <div className="dash-section">
          <div className="dash-section-header">
            <div>
              <h2 className="section-title">Recent Emergency SOS</h2>
              <div className="section-title-line"></div>
            </div>
            <Link to="/sos" className="btn btn-secondary btn-sm">View All</Link>
          </div>

          {loading ? (
            <div className="loading-overlay">
              <div className="spinner spinner-lg"></div>
              <p>Loading SOS requests...</p>
            </div>
          ) : recentSOS.length === 0 ? (
            <div className="empty-state">
              <span className="empty-state-icon">✅</span>
              <h3>No Active SOS</h3>
              <p>No emergency blood requests at the moment.</p>
            </div>
          ) : (
            <div className="grid-2">
              {recentSOS.map((sos) => (
                <SOSCard key={sos.id} sos={sos} />
              ))}
            </div>
          )}
        </div>

        {/* Nav cards */}
        <div className="dash-section">
          <h2 className="section-title">My BloodSOS</h2>
          <div className="section-title-line"></div>
          <div className="grid-3">
            <Link to="/my-sos" className="card dash-nav-card" id="dash-my-sos">
              <div className="dash-nav-icon">📋</div>
              <h3>My SOS Requests</h3>
              <p>View and manage your emergency requests</p>
            </Link>
            <Link to="/contacts" className="card dash-nav-card" id="dash-contacts">
              <div className="dash-nav-icon">📞</div>
              <h3>Contact History</h3>
              <p>View all your donor contact logs</p>
            </Link>
            <Link to="/profile" className="card dash-nav-card" id="dash-my-profile">
              <div className="dash-nav-icon">👤</div>
              <h3>My Profile</h3>
              <p>Update your information and settings</p>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default DashboardPage;
