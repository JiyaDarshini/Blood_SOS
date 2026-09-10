import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services';
import { BLOOD_GROUPS, ROLES } from '../utils';
import './AuthPages.css';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    fullName: '', email: '', phone: '', password: '', confirmPassword: '',
    bloodGroup: '', locality: '', city: '', pincode: '', role: '',
    agreeTerms: false,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((p) => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: '' }));
    if (serverError) setServerError('');
  };

  const validate = () => {
    const errs = {};
    if (!formData.fullName.trim() || formData.fullName.trim().length < 2)
      errs.fullName = 'Full name must be at least 2 characters.';
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      errs.email = 'Please enter a valid email address.';
    if (!formData.phone || !/^[6-9]\d{9}$/.test(formData.phone))
      errs.phone = 'Please enter a valid 10-digit Indian mobile number.';
    if (!formData.password || formData.password.length < 6)
      errs.password = 'Password must be at least 6 characters.';
    if (formData.password !== formData.confirmPassword)
      errs.confirmPassword = 'Passwords do not match.';
    if (!formData.role)
      errs.role = 'Please select your role.';
    if ((formData.role === 'DONOR' || formData.role === 'BOTH') && !formData.bloodGroup)
      errs.bloodGroup = 'Please select your blood group.';
    if ((formData.role === 'DONOR' || formData.role === 'BOTH') && !formData.locality.trim())
      errs.locality = 'Locality is required for donors.';
    if ((formData.role === 'DONOR' || formData.role === 'BOTH') && !formData.city.trim())
      errs.city = 'City is required for donors.';
    if ((formData.role === 'DONOR' || formData.role === 'BOTH') && !/^\d{6}$/.test(formData.pincode))
      errs.pincode = 'Please enter a valid 6-digit pincode.';
    if (!formData.agreeTerms)
      errs.agreeTerms = 'You must agree to the Terms and Privacy Policy.';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    setServerError('');
    try {
      const payload = { ...formData };
      delete payload.confirmPassword;
      delete payload.agreeTerms;
      const res = await authService.register(payload);
      const { user, token } = res.data.data;
      login(user, token);
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.';
      const fieldErrors = err.response?.data?.errors || [];
      if (fieldErrors.length) {
        const fe = {};
        fieldErrors.forEach(({ field, message }) => { fe[field] = message; });
        setErrors(fe);
      }
      setServerError(msg);
    } finally {
      setLoading(false);
    }
  };

  const isDonor = formData.role === 'DONOR' || formData.role === 'BOTH';

  return (
    <main className="auth-page register-page" role="main">
      <div className="auth-container auth-container-wide">
        {/* Left Panel */}
        <div className="auth-left" aria-hidden="true">
          <div className="auth-left-content">
            <svg width="60" height="68" viewBox="0 0 32 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 2C16 2 3 15 3 23C3 30.18 8.82 36 16 36C23.18 36 29 30.18 29 23C29 15 16 2 16 2Z" fill="#D32F2F"/>
              <path d="M13 21H19M16 18V24" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
            <h2>Join BloodSOS</h2>
            <p>Create your account in minutes</p>
            <p className="auth-left-quote">"One registration can save multiple lives."</p>
            <div className="auth-left-features">
              <div>✓ Register as donor or requester</div>
              <div>✓ Receive emergency SOS alerts</div>
              <div>✓ Contact donors instantly</div>
              <div>✓ Manage your availability</div>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="auth-right">
          <div className="auth-form-wrap">
            <div className="auth-form-header">
              <h1>Create Account</h1>
              <p>Join the BloodSOS emergency network</p>
            </div>

            {serverError && (
              <div className="alert alert-error" role="alert" aria-live="assertive">
                ⚠️ {serverError}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate aria-label="Registration form">
              <div className="form-grid-2">
                <div className="form-group">
                  <label htmlFor="fullName" className="form-label">Full Name *</label>
                  <input id="fullName" name="fullName" type="text" className={`form-input ${errors.fullName ? 'error' : ''}`}
                    value={formData.fullName} onChange={handleChange} placeholder="Your full name"
                    aria-required="true" aria-describedby={errors.fullName ? 'fullName-err' : undefined} />
                  {errors.fullName && <span id="fullName-err" className="form-error">⚠ {errors.fullName}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="email" className="form-label">Email Address *</label>
                  <input id="email" name="email" type="email" className={`form-input ${errors.email ? 'error' : ''}`}
                    value={formData.email} onChange={handleChange} placeholder="your@email.com"
                    aria-required="true" aria-describedby={errors.email ? 'email-err' : undefined} />
                  {errors.email && <span id="email-err" className="form-error">⚠ {errors.email}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="phone" className="form-label">Phone Number *</label>
                  <input id="phone" name="phone" type="tel" className={`form-input ${errors.phone ? 'error' : ''}`}
                    value={formData.phone} onChange={handleChange} placeholder="10-digit mobile number"
                    aria-required="true" aria-describedby={errors.phone ? 'phone-err' : undefined} maxLength={10} />
                  {errors.phone && <span id="phone-err" className="form-error">⚠ {errors.phone}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="role" className="form-label">I am a *</label>
                  <select id="role" name="role" className={`form-select ${errors.role ? 'error' : ''}`}
                    value={formData.role} onChange={handleChange}
                    aria-required="true" aria-describedby={errors.role ? 'role-err' : undefined}>
                    <option value="">Select your role</option>
                    {ROLES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
                  </select>
                  {errors.role && <span id="role-err" className="form-error">⚠ {errors.role}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="password" className="form-label">Password *</label>
                  <div className="password-input-wrap">
                    <input id="password" name="password" type={showPassword ? 'text' : 'password'}
                      className={`form-input ${errors.password ? 'error' : ''}`}
                      value={formData.password} onChange={handleChange} placeholder="Min. 6 characters"
                      aria-required="true" aria-describedby={errors.password ? 'pass-err' : undefined} />
                    <button type="button" className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}>
                      {showPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                  {errors.password && <span id="pass-err" className="form-error">⚠ {errors.password}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword" className="form-label">Confirm Password *</label>
                  <input id="confirmPassword" name="confirmPassword" type="password"
                    className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                    value={formData.confirmPassword} onChange={handleChange} placeholder="Re-enter password"
                    aria-required="true" aria-describedby={errors.confirmPassword ? 'cpass-err' : undefined} />
                  {errors.confirmPassword && <span id="cpass-err" className="form-error">⚠ {errors.confirmPassword}</span>}
                </div>
              </div>

              {/* Donor-specific fields */}
              {isDonor && (
                <div className="donor-fields">
                  <h3 className="donor-fields-title">🩸 Donor Information</h3>
                  <div className="form-grid-2">
                    <div className="form-group">
                      <label htmlFor="bloodGroup" className="form-label">Blood Group *</label>
                      <select id="bloodGroup" name="bloodGroup" className={`form-select ${errors.bloodGroup ? 'error' : ''}`}
                        value={formData.bloodGroup} onChange={handleChange}
                        aria-required="true">
                        <option value="">Select blood group</option>
                        {BLOOD_GROUPS.map((bg) => (
                          <option key={bg.value} value={bg.value}>{bg.label}</option>
                        ))}
                      </select>
                      {errors.bloodGroup && <span className="form-error">⚠ {errors.bloodGroup}</span>}
                    </div>

                    <div className="form-group">
                      <label htmlFor="pincode" className="form-label">Pincode *</label>
                      <input id="pincode" name="pincode" type="text"
                        className={`form-input ${errors.pincode ? 'error' : ''}`}
                        value={formData.pincode} onChange={handleChange} placeholder="6-digit pincode"
                        maxLength={6} />
                      {errors.pincode && <span className="form-error">⚠ {errors.pincode}</span>}
                    </div>

                    <div className="form-group">
                      <label htmlFor="locality" className="form-label">Locality / Society *</label>
                      <input id="locality" name="locality" type="text"
                        className={`form-input ${errors.locality ? 'error' : ''}`}
                        value={formData.locality} onChange={handleChange} placeholder="Your locality or society name" />
                      {errors.locality && <span className="form-error">⚠ {errors.locality}</span>}
                    </div>

                    <div className="form-group">
                      <label htmlFor="city" className="form-label">City *</label>
                      <input id="city" name="city" type="text"
                        className={`form-input ${errors.city ? 'error' : ''}`}
                        value={formData.city} onChange={handleChange} placeholder="Your city" />
                      {errors.city && <span className="form-error">⚠ {errors.city}</span>}
                    </div>
                  </div>
                </div>
              )}

              {/* Terms */}
              <div className="form-group checkbox-group">
                <label className="checkbox-label" htmlFor="agreeTerms">
                  <input id="agreeTerms" name="agreeTerms" type="checkbox"
                    checked={formData.agreeTerms} onChange={handleChange}
                    aria-required="true" aria-describedby={errors.agreeTerms ? 'terms-err' : undefined} />
                  <span>
                    I agree to the <Link to="/terms" target="_blank">Terms of Service</Link> and{' '}
                    <Link to="/privacy" target="_blank">Privacy Policy</Link>
                  </span>
                </label>
                {errors.agreeTerms && <span id="terms-err" className="form-error">⚠ {errors.agreeTerms}</span>}
              </div>

              <button id="register-submit-btn" type="submit" className="btn btn-primary btn-block btn-lg"
                disabled={loading} aria-busy={loading}>
                {loading ? (
                  <><span className="spinner spinner-white"></span> Creating Account...</>
                ) : 'CREATE ACCOUNT'}
              </button>
            </form>

            <div className="auth-footer-links">
              <p>Already have an account? <Link to="/login">Login here</Link></p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default RegisterPage;
