import React, { useState, useEffect, useCallback } from 'react';
import { donorService } from '../services';
import DonorCard from '../components/DonorCard';
import { BLOOD_GROUPS } from '../utils';

const DonorsPage = () => {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ bloodGroup: '', locality: '', city: '', pincode: '', isAvailable: '' });
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 });

  const fetchDonors = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = { ...filters, page, limit: 12 };
      Object.keys(params).forEach((k) => { if (params[k] === '') delete params[k]; });
      const res = await donorService.getDonors(params);
      setDonors(res.data.data.donors);
      setPagination(res.data.data.pagination);
    } catch {}
    finally { setLoading(false); }
  }, [filters]);

  useEffect(() => { fetchDonors(1); }, [fetchDonors]);

  const handleChange = (e) => {
    setFilters((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const clearFilters = () => {
    setFilters({ bloodGroup: '', locality: '', city: '', pincode: '', isAvailable: '' });
  };

  return (
    <main role="main">
      <div className="page-header">
        <div className="container">
          <h1>🩸 Find Blood Donors</h1>
          <p>Search for compatible blood donors in your area</p>
        </div>
      </div>

      <div className="container" style={{ padding: '2rem 1.5rem' }}>
        {/* Filters */}
        <div className="filters-bar" role="search" aria-label="Donor search filters">
          <div className="filters-grid">
            <div className="form-group" style={{ margin: 0 }}>
              <label htmlFor="d-bg" className="form-label">Blood Group</label>
              <select id="d-bg" name="bloodGroup" className="form-select" value={filters.bloodGroup} onChange={handleChange}>
                <option value="">All Groups</option>
                {BLOOD_GROUPS.map((bg) => <option key={bg.value} value={bg.value}>{bg.label}</option>)}
              </select>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label htmlFor="d-avail" className="form-label">Availability</label>
              <select id="d-avail" name="isAvailable" className="form-select" value={filters.isAvailable} onChange={handleChange}>
                <option value="">All</option>
                <option value="true">Available</option>
                <option value="false">Unavailable</option>
              </select>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label htmlFor="d-city" className="form-label">City</label>
              <input id="d-city" name="city" type="text" className="form-input" value={filters.city}
                onChange={handleChange} placeholder="Filter by city" />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label htmlFor="d-loc" className="form-label">Locality</label>
              <input id="d-loc" name="locality" type="text" className="form-input" value={filters.locality}
                onChange={handleChange} placeholder="Filter by locality" />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label htmlFor="d-pin" className="form-label">Pincode</label>
              <input id="d-pin" name="pincode" type="text" className="form-input" value={filters.pincode}
                onChange={handleChange} placeholder="6-digit pincode" maxLength={6} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
            <button onClick={() => fetchDonors(1)} className="btn btn-primary btn-sm" id="search-donors-btn">
              🔍 SEARCH
            </button>
            <button onClick={clearFilters} className="btn btn-secondary btn-sm" id="clear-donors-btn">
              Clear
            </button>
          </div>
        </div>

        <p className="results-count" style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1rem' }}>
          {loading ? 'Searching...' : `${pagination.total} donor${pagination.total !== 1 ? 's' : ''} found`}
        </p>

        {loading ? (
          <div className="loading-overlay">
            <div className="spinner spinner-lg"></div>
            <p>Searching for donors...</p>
          </div>
        ) : donors.length === 0 ? (
          <div className="empty-state">
            <span className="empty-state-icon">🩸</span>
            <h3>No Donors Found</h3>
            <p>No donors match your search criteria. Try different filters.</p>
            <button onClick={clearFilters} className="btn btn-secondary" style={{ marginTop: '1rem' }}>
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid-3">
            {donors.map((donor) => <DonorCard key={donor.id} donor={donor} />)}
          </div>
        )}

        {pagination.totalPages > 1 && (
          <div className="pagination">
            <button className="pagination-btn" disabled={pagination.page <= 1}
              onClick={() => fetchDonors(pagination.page - 1)}>← Prev</button>
            {Array.from({ length: pagination.totalPages }, (_, i) => (
              <button key={i+1} className={`pagination-btn ${pagination.page === i+1 ? 'active' : ''}`}
                onClick={() => fetchDonors(i+1)}>{i+1}</button>
            ))}
            <button className="pagination-btn" disabled={pagination.page >= pagination.totalPages}
              onClick={() => fetchDonors(pagination.page + 1)}>Next →</button>
          </div>
        )}
      </div>
    </main>
  );
};

export default DonorsPage;
