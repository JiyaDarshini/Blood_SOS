import React, { useState, useEffect } from 'react';
import { userService, donorService } from '../services';
import { useAuth } from '../context/AuthContext';
import { BLOOD_GROUPS, formatBloodGroup, formatDate } from '../utils';
import './ProfilePage.css';

const ProfilePage = () => {
  const { user, updateUser, isDonor } = useAuth();
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Password change state
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState('');
  const [pwLoading, setPwLoading] = useState(false);

  // Availability toggle
  const [availLoading, setAvailLoading] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await userService.getProfile();
        const p = res.data.data.user;
        setProfile(p);
        setFormData({
          fullName: p.fullName || '',
          phone: p.phone || '',
          locality: p.donor?.locality || '',
          city: p.donor?.city || '',
          pincode: p.donor?.pincode || '',
          bloodGroup: p.donor?.bloodGroup || '',
        });
      } catch {}
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  const handleChange = (e) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      await userService.updateProfile(formData);
      setSuccess('Profile updated successfully!');
      setEditing(false);
      updateUser({ fullName: formData.fullName, phone: formData.phone });
      // refresh profile
      const res = await userService.getProfile();
      setProfile(res.data.data.user);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleAvailability = async (isAvailable) => {
    setAvailLoading(true);
    try {
      await donorService.updateAvailability(isAvailable);
      setProfile((p) => ({ ...p, donor: { ...p.donor, isAvailable } }));
      setSuccess(isAvailable ? 'You are now AVAILABLE for donation.' : 'You are now UNAVAILABLE for donation.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update availability.');
    } finally {
      setAvailLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPwError('');
    setPwSuccess('');
    if (pwForm.newPassword !== pwForm.confirmNewPassword) {
      setPwError('New passwords do not match.');
      return;
    }
    if (pwForm.newPassword.length < 6) {
      setPwError('New password must be at least 6 characters.');
      return;
    }
    setPwLoading(true);
    try {
      await userService.changePassword(pwForm);
      setPwSuccess('Password changed successfully!');
      setPwForm({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
    } catch (err) {
      setPwError(err.response?.data?.message || 'Failed to change password.');
    } finally {
      setPwLoading(false);
    }
  };

  if (loading) return (
    <div className="loading-overlay" style={{ minHeight: '60vh' }}>
      <div className="spinner spinner-lg"></div>
      <p>Loading profile...</p>
    </div>
  );

  return (
    <main className="profile-page" role="main">
      <div className="page-header">
        <div className="container">
          <h1>👤 My Profile</h1>
          <p>Manage your account and donor information</p>
        </div>
      </div>

      <div className="container" style={{ padding: '2rem 1.5rem' }}>
        {success && <div className="alert alert-success mb-3" role="status">✓ {success}</div>}
        {error && <div className="alert alert-error mb-3" role="alert">⚠️ {error}</div>}

        <div className="profile-layout">
          {/* Left: Profile summary */}
          <aside className="profile-sidebar">
            <div className="card text-center">
              <div className="profile-avatar" aria-hidden="true">
                {profile?.fullName?.charAt(0)?.toUpperCase()}
              </div>
              <h2 className="profile-name">{profile?.fullName}</h2>
              <p className="text-muted" style={{ fontSize: '0.85rem' }}>{profile?.email}</p>
              <div style={{ margin: '0.75rem 0' }}>
                <span className="badge badge-active">{profile?.role}</span>
              </div>
              {profile?.donor && (
                <div className="profile-blood-display">
                  <span className="blood-group-badge" style={{ fontSize: '1.2rem', padding: '0.4rem 1rem' }}>
                    {formatBloodGroup(profile.donor.bloodGroup)}
                  </span>
                </div>
              )}
              <p className="text-muted text-sm mt-2">Member since {formatDate(profile?.createdAt)}</p>
            </div>

            {/* Availability toggle for donors */}
            {profile?.donor && (
              <div className="card availability-card">
                <h3>🩸 Donation Availability</h3>
                <p className="text-muted text-sm mb-2">Toggle your availability for blood donation</p>
                <div className="availability-toggle-section">
                  <span className={`badge ${profile.donor.isAvailable ? 'badge-available' : 'badge-unavailable'}`}>
                    {profile.donor.isAvailable ? 'AVAILABLE' : 'UNAVAILABLE'}
                  </span>
                  <div className="toggle-wrapper" style={{ marginTop: '0.75rem' }}>
                    <label className="toggle" aria-label="Toggle donation availability">
                      <input
                        id="availability-toggle"
                        type="checkbox"
                        checked={profile.donor.isAvailable}
                        onChange={(e) => handleAvailability(e.target.checked)}
                        disabled={availLoading}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                    <span style={{ fontFamily: 'var(--font-main)', fontSize: '0.88rem' }}>
                      {availLoading ? 'Updating...' : profile.donor.isAvailable ? 'I am available' : 'I am unavailable'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </aside>

          {/* Right: Edit form + password */}
          <div className="profile-main">
            {/* Profile Info */}
            <div className="card mb-3">
              <div className="profile-section-header">
                <h2>Personal Information</h2>
                {!editing && (
                  <button id="edit-profile-btn" className="btn btn-secondary btn-sm" onClick={() => setEditing(true)}>
                    Edit Profile
                  </button>
                )}
              </div>

              {!editing ? (
                <div className="profile-info-grid">
                  <div className="profile-info-item">
                    <span className="info-label">Full Name</span>
                    <span className="info-value">{profile?.fullName}</span>
                  </div>
                  <div className="profile-info-item">
                    <span className="info-label">Email</span>
                    <span className="info-value">{profile?.email}</span>
                  </div>
                  <div className="profile-info-item">
                    <span className="info-label">Phone</span>
                    <span className="info-value">{profile?.phone}</span>
                  </div>
                  <div className="profile-info-item">
                    <span className="info-label">Role</span>
                    <span className="info-value">{profile?.role}</span>
                  </div>
                  {profile?.donor && (
                    <>
                      <div className="profile-info-item">
                        <span className="info-label">Blood Group</span>
                        <span className="info-value">{formatBloodGroup(profile.donor.bloodGroup)}</span>
                      </div>
                      <div className="profile-info-item">
                        <span className="info-label">Locality</span>
                        <span className="info-value">{profile.donor.locality}</span>
                      </div>
                      <div className="profile-info-item">
                        <span className="info-label">City</span>
                        <span className="info-value">{profile.donor.city}</span>
                      </div>
                      <div className="profile-info-item">
                        <span className="info-label">Pincode</span>
                        <span className="info-value">{profile.donor.pincode}</span>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <form onSubmit={handleSave} noValidate aria-label="Edit profile form">
                  <div className="form-grid-2">
                    <div className="form-group">
                      <label htmlFor="prof-name" className="form-label">Full Name</label>
                      <input id="prof-name" name="fullName" type="text" className="form-input"
                        value={formData.fullName} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                      <label htmlFor="prof-phone" className="form-label">Phone Number</label>
                      <input id="prof-phone" name="phone" type="tel" className="form-input"
                        value={formData.phone} onChange={handleChange} maxLength={10} />
                    </div>
                    {profile?.donor && (
                      <>
                        <div className="form-group">
                          <label htmlFor="prof-bg" className="form-label">Blood Group</label>
                          <select id="prof-bg" name="bloodGroup" className="form-select"
                            value={formData.bloodGroup} onChange={handleChange}>
                            {BLOOD_GROUPS.map((bg) => <option key={bg.value} value={bg.value}>{bg.label}</option>)}
                          </select>
                        </div>
                        <div className="form-group">
                          <label htmlFor="prof-pin" className="form-label">Pincode</label>
                          <input id="prof-pin" name="pincode" type="text" className="form-input"
                            value={formData.pincode} onChange={handleChange} maxLength={6} />
                        </div>
                        <div className="form-group">
                          <label htmlFor="prof-loc" className="form-label">Locality</label>
                          <input id="prof-loc" name="locality" type="text" className="form-input"
                            value={formData.locality} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                          <label htmlFor="prof-city" className="form-label">City</label>
                          <input id="prof-city" name="city" type="text" className="form-input"
                            value={formData.city} onChange={handleChange} />
                        </div>
                      </>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem' }}>
                    <button id="save-profile-btn" type="submit" className="btn btn-primary" disabled={saving}>
                      {saving ? <><span className="spinner spinner-white"></span> Saving...</> : 'Save Changes'}
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={() => setEditing(false)}>Cancel</button>
                  </div>
                </form>
              )}
            </div>

            {/* Change Password */}
            <div className="card">
              <h2>🔐 Change Password</h2>
              <hr className="divider" />
              {pwSuccess && <div className="alert alert-success mb-2" role="status">✓ {pwSuccess}</div>}
              {pwError && <div className="alert alert-error mb-2" role="alert">⚠️ {pwError}</div>}

              <form onSubmit={handlePasswordChange} noValidate aria-label="Change password form">
                <div className="form-group">
                  <label htmlFor="cur-pass" className="form-label">Current Password</label>
                  <input id="cur-pass" name="currentPassword" type="password" className="form-input"
                    value={pwForm.currentPassword} onChange={(e) => setPwForm((p) => ({ ...p, currentPassword: e.target.value }))}
                    aria-required="true" />
                </div>
                <div className="form-group">
                  <label htmlFor="new-pass" className="form-label">New Password</label>
                  <input id="new-pass" name="newPassword" type="password" className="form-input"
                    value={pwForm.newPassword} onChange={(e) => setPwForm((p) => ({ ...p, newPassword: e.target.value }))}
                    aria-required="true" />
                </div>
                <div className="form-group">
                  <label htmlFor="conf-pass" className="form-label">Confirm New Password</label>
                  <input id="conf-pass" name="confirmNewPassword" type="password" className="form-input"
                    value={pwForm.confirmNewPassword} onChange={(e) => setPwForm((p) => ({ ...p, confirmNewPassword: e.target.value }))}
                    aria-required="true" />
                </div>
                <button id="change-password-btn" type="submit" className="btn btn-dark" disabled={pwLoading}>
                  {pwLoading ? <><span className="spinner spinner-white"></span> Changing...</> : 'Change Password'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProfilePage;
