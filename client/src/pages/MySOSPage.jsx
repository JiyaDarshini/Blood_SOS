import React, { useState, useEffect } from 'react';
import { sosService } from '../services';
import SOSCard from '../components/SOSCard';

const MySOSPage = () => {
  const [sosList, setSosList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ACTIVE');
  const [actionMsg, setActionMsg] = useState('');

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await sosService.getMySOS();
        setSosList(res.data.data.sos);
      } catch {}
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  const handleFulfill = async (id) => {
    try {
      await sosService.fulfillSOS(id);
      setSosList((p) => p.map((s) => s.id === id ? { ...s, status: 'FULFILLED' } : s));
      setActionMsg('SOS marked as fulfilled. Thank you!');
    } catch (err) {
      setActionMsg(err.response?.data?.message || 'Failed to fulfill SOS.');
    }
  };

  const handleClose = async (id) => {
    try {
      await sosService.closeSOS(id);
      setSosList((p) => p.map((s) => s.id === id ? { ...s, status: 'CLOSED' } : s));
      setActionMsg('SOS request closed.');
    } catch {}
  };

  const handleCancel = async (id) => {
    try {
      await sosService.deleteSOS(id);
      setSosList((p) => p.map((s) => s.id === id ? { ...s, status: 'CANCELLED' } : s));
      setActionMsg('SOS request cancelled.');
    } catch {}
  };

  const filtered = sosList.filter((s) => s.status === activeTab);
  const tabs = [
    { key: 'ACTIVE', label: '🔴 Active', count: sosList.filter((s) => s.status === 'ACTIVE').length },
    { key: 'FULFILLED', label: '✅ Fulfilled', count: sosList.filter((s) => s.status === 'FULFILLED').length },
    { key: 'CLOSED', label: '⬜ Closed', count: sosList.filter((s) => s.status === 'CLOSED').length },
    { key: 'CANCELLED', label: '🚫 Cancelled', count: sosList.filter((s) => s.status === 'CANCELLED').length },
  ];

  return (
    <main role="main">
      <div className="page-header">
        <div className="container">
          <h1>📋 My SOS Requests</h1>
          <p>Manage your emergency blood requests</p>
        </div>
      </div>

      <div className="container" style={{ padding: '2rem 1.5rem' }}>
        {actionMsg && (
          <div className="alert alert-success mb-3" role="status" style={{ marginBottom: '1rem' }}>
            ✓ {actionMsg}
          </div>
        )}

        {/* Tabs */}
        <div className="my-sos-tabs" role="tablist">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              role="tab"
              aria-selected={activeTab === tab.key}
              className={`tab-btn ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
              {tab.count > 0 && <span className="tab-count">{tab.count}</span>}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="loading-overlay">
            <div className="spinner spinner-lg"></div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <span className="empty-state-icon">📋</span>
            <h3>No {activeTab.toLowerCase()} SOS requests</h3>
            <p>
              {activeTab === 'ACTIVE'
                ? 'You have no active SOS requests. Post one when you need help.'
                : `No ${activeTab.toLowerCase()} SOS requests found.`}
            </p>
            {activeTab === 'ACTIVE' && (
              <a href="/sos/create" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                🚨 Post SOS
              </a>
            )}
          </div>
        ) : (
          <div className="grid-2">
            {filtered.map((sos) => (
              <SOSCard
                key={sos.id}
                sos={sos}
                showActions={true}
                onFulfill={sos.status === 'ACTIVE' ? handleFulfill : undefined}
                onClose={sos.status === 'ACTIVE' ? handleClose : undefined}
                onCancel={sos.status === 'ACTIVE' ? handleCancel : undefined}
              />
            ))}
          </div>
        )}
      </div>

      <style>{`
        .my-sos-tabs {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
          border-bottom: 2px solid var(--border-gray);
          padding-bottom: 0;
          flex-wrap: wrap;
        }
        .tab-btn {
          font-family: var(--font-main);
          font-size: 0.88rem;
          font-weight: 600;
          padding: 0.6rem 1rem;
          border: none;
          background: none;
          color: var(--text-muted);
          cursor: pointer;
          border-bottom: 3px solid transparent;
          margin-bottom: -2px;
          display: flex;
          align-items: center;
          gap: 0.4rem;
          transition: all var(--transition);
        }
        .tab-btn:hover { color: var(--black); }
        .tab-btn.active { color: var(--primary-red); border-bottom-color: var(--primary-red); }
        .tab-count {
          background: var(--primary-red);
          color: white;
          font-size: 0.7rem;
          padding: 0.1rem 0.4rem;
          border-radius: 100px;
        }
      `}</style>
    </main>
  );
};

export default MySOSPage;
