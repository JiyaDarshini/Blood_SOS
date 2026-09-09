import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sosService } from '../services';
import { BLOOD_GROUPS, URGENCY_LEVELS } from '../utils';
import './CreateSOSPage.css';

const CreateSOSPage = () => {
  const [formData, setFormData] = useState({
    bloodGroup: '', unitsRequired: 1, hospitalName: '', hospitalAddress: '',
    locality: '', city: '', urgency: 'URGENT', contactNumber: '', message: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: '' }));
    if (serverError) setServerError('');
  };

  const validate = () => {
    const errs = {};
    if (!formData.bloodGroup) errs.bloodGroup = 'Please select the required blood group.';
    if (!formData.unitsRequired || formData.unitsRequired < 1) errs.unitsRequired = 'Units required must be at least 1.';
    if (!formData.hospitalName.trim()) errs.hospitalName = 'Hospital name is required.';
    if (!formData.hospitalAddress.trim()) errs.hospitalAddress = 'Hospital address is required.';
    if (!formData.locality.trim()) errs.locality = 'Locality is required.';
    if (!formData.city.trim()) errs.city = 'City is required.';
    if (!formData.urgency) errs.urgency = 'Urgency level is required.';
    if (!formData.contactNumber || !/^[6-9]\d{9}$/.test(formData.contactNumber))
      errs.contactNumber = 'Please enter a valid 10-digit contact number.';
    return errs;
  };

  const handleBroadcast = async () => {
    setShowConfirm(false);
    setLoading(true);
    setServerError('');
    try {
      await sosService.createSOS({ ...formData, unitsRequired: parseInt(formData.unitsRequired) });
      navigate('/sos');
    } catch (err) {
      setServerError(err.response?.data?.message || 'Failed to broadcast SOS. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setShowConfirm(true);
  };

  return (
    <main className="create-sos-page" role="main">
      <div className="page-header">
        <div className="container">
          <h1>🚨 Broadcast Emergency SOS</h1>
          <p>Fill in the details below to broadcast your blood request to available donors</p>
        </div>
      </div>

      <div className="container" style={{ padding: '2rem 1.5rem' }}>
        <div className="create-sos-layout">
          <div className="create-sos-form-wrap">
            {serverError && (
              <div className="alert alert-error" role="alert">⚠️ {serverError}</div>
            )}

            <form onSubmit={handleSubmit} noValidate aria-label="Create SOS form">
              <div className="form-grid-2-sos">
                <div className="form-group">
                  <label htmlFor="sos-bloodGroup" className="form-label">Blood Group Required *</label>
                  <select id="sos-bloodGroup" name="bloodGroup" className={`form-select ${errors.bloodGroup ? 'error' : ''}`}
                    value={formData.bloodGroup} onChange={handleChange} aria-required="true">
                    <option value="">Select blood group</option>
                    {BLOOD_GROUPS.map((bg) => <option key={bg.value} value={bg.value}>{bg.label}</option>)}
                  </select>
                  {errors.bloodGroup && <span className="form-error">⚠ {errors.bloodGroup}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="sos-units" className="form-label">Units Required *</label>
                  <input id="sos-units" name="unitsRequired" type="number" className={`form-input ${errors.unitsRequired ? 'error' : ''}`}
                    value={formData.unitsRequired} onChange={handleChange} min={1} max={20}
                    aria-required="true" />
                  {errors.unitsRequired && <span className="form-error">⚠ {errors.unitsRequired}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="sos-urgency" className="form-label">Urgency Level *</label>
                  <select id="sos-urgency" name="urgency" className={`form-select ${errors.urgency ? 'error' : ''}`}
                    value={formData.urgency} onChange={handleChange} aria-required="true">
                    {URGENCY_LEVELS.map((u) => <option key={u.value} value={u.value}>{u.label}</option>)}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="sos-contact" className="form-label">Contact Number *</label>
                  <input id="sos-contact" name="contactNumber" type="tel" className={`form-input ${errors.contactNumber ? 'error' : ''}`}
                    value={formData.contactNumber} onChange={handleChange} placeholder="10-digit number"
                    maxLength={10} aria-required="true" />
                  {errors.contactNumber && <span className="form-error">⚠ {errors.contactNumber}</span>}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="sos-hospital" className="form-label">Hospital Name *</label>
                <input id="sos-hospital" name="hospitalName" type="text" className={`form-input ${errors.hospitalName ? 'error' : ''}`}
                  value={formData.hospitalName} onChange={handleChange} placeholder="Name of the hospital"
                  aria-required="true" />
                {errors.hospitalName && <span className="form-error">⚠ {errors.hospitalName}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="sos-addr" className="form-label">Hospital Address *</label>
                <textarea id="sos-addr" name="hospitalAddress" className={`form-textarea ${errors.hospitalAddress ? 'error' : ''}`}
                  value={formData.hospitalAddress} onChange={handleChange} placeholder="Full address of the hospital"
                  rows={2} aria-required="true" />
                {errors.hospitalAddress && <span className="form-error">⚠ {errors.hospitalAddress}</span>}
              </div>

              <div className="form-grid-2-sos">
                <div className="form-group">
                  <label htmlFor="sos-locality" className="form-label">Locality *</label>
                  <input id="sos-locality" name="locality" type="text" className={`form-input ${errors.locality ? 'error' : ''}`}
                    value={formData.locality} onChange={handleChange} placeholder="Hospital locality/area"
                    aria-required="true" />
                  {errors.locality && <span className="form-error">⚠ {errors.locality}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="sos-city" className="form-label">City *</label>
                  <input id="sos-city" name="city" type="text" className={`form-input ${errors.city ? 'error' : ''}`}
                    value={formData.city} onChange={handleChange} placeholder="City name"
                    aria-required="true" />
                  {errors.city && <span className="form-error">⚠ {errors.city}</span>}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="sos-message" className="form-label">Additional Message (Optional)</label>
                <textarea id="sos-message" name="message" className="form-textarea"
                  value={formData.message} onChange={handleChange}
                  placeholder="Any additional information for donors..." rows={3} />
              </div>

              <button id="broadcast-sos-btn" type="submit" className="btn btn-primary btn-block btn-lg broadcast-btn"
                disabled={loading} aria-busy={loading}>
                🚨 BROADCAST SOS
              </button>
            </form>
          </div>

          {/* Sidebar info */}
          <aside className="sos-info-sidebar" aria-label="Blood compatibility info">
            <div className="card sos-info-card">
              <h3>🩸 Blood Compatibility</h3>
              <p>The system will automatically find donors with compatible blood groups:</p>
              <div className="compat-table">
                {[['O-', 'All Groups'], ['O+', 'O+, A+, B+, AB+'], ['A-', 'A-, A+, AB-, AB+'],
                  ['A+', 'A+, AB+'], ['B-', 'B-, B+, AB-, AB+'], ['B+', 'B+, AB+'],
                  ['AB-', 'AB-, AB+'], ['AB+', 'AB+ only']].map(([d, r]) => (
                  <div key={d} className="compat-row">
                    <span className="blood-group-badge" style={{ fontSize: '0.75rem', padding: '0.1rem 0.4rem' }}>{d}</span>
                    <span>→ {r}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card sos-info-card">
              <h3>⚠️ Urgency Levels</h3>
              <div className="urgency-info">
                <div><span className="badge badge-critical">CRITICAL</span> <span>Life-threatening, immediate need</span></div>
                <div><span className="badge badge-urgent">URGENT</span> <span>Required within hours</span></div>
                <div><span className="badge badge-planned">PLANNED</span> <span>Scheduled surgery/procedure</span></div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Confirm Modal */}
      {showConfirm && (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
          <div className="modal">
            <h2 id="confirm-title" className="modal-title">🚨 Confirm SOS Broadcast</h2>
            <p>Are you sure you want to broadcast this emergency SOS request?</p>
            <div className="confirm-details">
              <p><strong>Blood Group:</strong> {BLOOD_GROUPS.find((b) => b.value === formData.bloodGroup)?.label}</p>
              <p><strong>Hospital:</strong> {formData.hospitalName}</p>
              <p><strong>Urgency:</strong> {formData.urgency}</p>
              <p><strong>Units:</strong> {formData.unitsRequired}</p>
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowConfirm(false)}>CANCEL</button>
              <button id="confirm-broadcast-btn" className="btn btn-primary" onClick={handleBroadcast} disabled={loading}>
                {loading ? <><span className="spinner spinner-white"></span> Broadcasting...</> : '🚨 BROADCAST SOS'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default CreateSOSPage;
