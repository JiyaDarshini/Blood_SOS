import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { sosService } from '../services';
import SOSCard from '../components/SOSCard';
import { BLOOD_GROUPS, URGENCY_LEVELS } from '../utils';
import './SOSBoardPage.css';

const SOSBoardPage = () => {
  const [sosList, setSosList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    bloodGroup: '', locality: '', city: '', urgency: '', status: 'ACTIVE', sort: 'urgent',
  });
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 });

  const fetchSOS = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = { ...filters, page, limit: 12 };
      Object.keys(params).forEach((k) => { if (!params[k]) delete params[k]; });
      const res = await sosService.getSOSRequests(params);
      setSosList(res.data.data.sos);
      setPagination(res.data.data.pagination);
    } catch {}
    finally { setLoading(false); }
  }, [filters]);

  useEffect(() => { fetchSOS(1); }, [fetchSOS]);

  const handleFilterChange = (e) => {
    setFilters((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const clearFilters = () => {
    setFilters({ bloodGroup: '', locality: '', city: '', urgency: '', status: 'ACTIVE', sort: 'urgent' });
  };

  const criticalCount = sosList.filter((s) => s.urgency === 'CRITICAL').length;

  return (
    <main className="sos-board-page" role="main">
      {/* Header */}
      <div className="page-header">
        <div className="container">
          <div className="sos-board-header">
            <div>
              <h1>🚨 Emergency SOS Board</h1>
              <p>Real-time emergency blood requests from your community</p>
            </div>
            <Link to="/sos/create" className="btn btn-primary btn-lg" id="create-sos-btn">
              + POST SOS
            </Link>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '2rem 1.5rem' }}>
        {/* Alert for critical requests */}
        {criticalCount > 0 && (
          <div className="sos-critical-alert" role="alert" aria-live="polite">
            🚨 <strong>{criticalCount} CRITICAL</strong> blood request{criticalCount > 1 ? 's' : ''} require immediate attention!
          </div>
        )}

        {/* Filters */}
        <div className="filters-bar" role="search" aria-label="SOS filters">
          <div className="filters-grid">
            <div className="form-group" style={{ margin: 0 }}>
              <label htmlFor="bg-filter" className="form-label">Blood Group</label>
              <select id="bg-filter" name="bloodGroup" className="form-select" value={filters.bloodGroup} onChange={handleFilterChange}>
                <option value="">All Groups</option>
                {BLOOD_GROUPS.map((bg) => <option key={bg.value} value={bg.value}>{bg.label}</option>)}
              </select>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label htmlFor="urgency-filter" className="form-label">Urgency</label>
              <select id="urgency-filter" name="urgency" className="form-select" value={filters.urgency} onChange={handleFilterChange}>
                <option value="">All Levels</option>
                {URGENCY_LEVELS.map((u) => <option key={u.value} value={u.value}>{u.label}</option>)}
              </select>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label htmlFor="city-filter" className="form-label">City</label>
              <input id="city-filter" name="city" type="text" className="form-input" value={filters.city}
                onChange={handleFilterChange} placeholder="Filter by city" />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label htmlFor="locality-filter" className="form-label">Locality</label>
              <input id="locality-filter" name="locality" type="text" className="form-input" value={filters.locality}
                onChange={handleFilterChange} placeholder="Filter by locality" />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label htmlFor="status-filter" className="form-label">Status</label>
              <select id="status-filter" name="status" className="form-select" value={filters.status} onChange={handleFilterChange}>
                <option value="ACTIVE">Active</option>
                <option value="FULFILLED">Fulfilled</option>
                <option value="CLOSED">Closed</option>
                <option value="">All</option>
              </select>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label htmlFor="sort-filter" className="form-label">Sort By</label>
              <select id="sort-filter" name="sort" className="form-select" value={filters.sort} onChange={handleFilterChange}>
                <option value="urgent">Most Urgent</option>
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>

          <div className="filters-actions">
            <button onClick={() => fetchSOS(1)} className="btn btn-primary btn-sm" id="apply-sos-filters">
              🔍 SEARCH
            </button>
            <button onClick={clearFilters} className="btn btn-secondary btn-sm" id="clear-sos-filters">
              Clear
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="sos-results-header">
          <p className="results-count">
            {loading ? 'Loading...' : `${pagination.total} request${pagination.total !== 1 ? 's' : ''} found`}
          </p>
        </div>

        {loading ? (
          <div className="loading-overlay">
            <div className="spinner spinner-lg"></div>
            <p>Loading emergency SOS requests...</p>
          </div>
        ) : sosList.length === 0 ? (
          <div className="empty-state">
            <span className="empty-state-icon">✅</span>
            <h3>No SOS Requests Found</h3>
            <p>No emergency blood requests match your filters.</p>
            <button onClick={clearFilters} className="btn btn-secondary" style={{ marginTop: '1rem' }}>
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid-2">
            {sosList.map((sos) => (
              <SOSCard key={sos.id} sos={sos} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="pagination">
            <button className="pagination-btn" disabled={pagination.page <= 1}
              onClick={() => fetchSOS(pagination.page - 1)}>← Prev</button>
            {Array.from({ length: pagination.totalPages }, (_, i) => (
              <button key={i + 1} className={`pagination-btn ${pagination.page === i + 1 ? 'active' : ''}`}
                onClick={() => fetchSOS(i + 1)}>{i + 1}</button>
            ))}
            <button className="pagination-btn" disabled={pagination.page >= pagination.totalPages}
              onClick={() => fetchSOS(pagination.page + 1)}>Next →</button>
          </div>
        )}
      </div>
    </main>
  );
};

export default SOSBoardPage;
