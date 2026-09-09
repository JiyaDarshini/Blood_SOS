import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services';
import './AuthPages.css';

const LoginPage = () => {
  const [formData, setFormData] = useState({ emailOrPhone: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleChange = (e) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.emailOrPhone || !formData.password) {
      setError('Please enter your email/phone and password.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await authService.login(formData);
      const { user, token } = res.data.data;
      login(user, token);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page" role="main">
      <div className="auth-container">
        {/* Left Panel */}
        <div className="auth-left" aria-hidden="true">
          <div className="auth-left-content">
            <svg width="60" height="68" viewBox="0 0 32 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 2C16 2 3 15 3 23C3 30.18 8.82 36 16 36C23.18 36 29 30.18 29 23C29 15 16 2 16 2Z" fill="#D32F2F"/>
              <path d="M13 21H19M16 18V24" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
            <h2>BloodSOS</h2>
            <p>Emergency Blood Donor Network</p>
            <p className="auth-left-quote">"Every second counts. Sign in to access the emergency network."</p>
            <div className="auth-left-features">
              <div>🩸 Find compatible donors</div>
              <div>🚨 Post emergency SOS</div>
              <div>📞 Contact donors instantly</div>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="auth-right">
          <div className="auth-form-wrap">
            <div className="auth-form-header">
              <h1>Welcome Back</h1>
              <p>Sign in to your BloodSOS account</p>
            </div>

            {error && (
              <div className="alert alert-error" role="alert" aria-live="assertive">
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate aria-label="Login form">
              <div className="form-group">
                <label htmlFor="emailOrPhone" className="form-label">Email or Phone Number</label>
                <input
                  id="emailOrPhone"
                  type="text"
                  name="emailOrPhone"
                  className="form-input"
                  value={formData.emailOrPhone}
                  onChange={handleChange}
                  placeholder="Enter email or phone number"
                  autoComplete="username"
                  required
                  aria-required="true"
                  aria-describedby={error ? 'login-error' : undefined}
                />
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">Password</label>
                <div className="password-input-wrap">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    className="form-input"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                    aria-required="true"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <button
                id="login-submit-btn"
                type="submit"
                className="btn btn-primary btn-block btn-lg"
                disabled={loading}
                aria-busy={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner spinner-white"></span>
                    Signing In...
                  </>
                ) : 'LOGIN'}
              </button>
            </form>

            <div className="auth-footer-links">
              <p>
                Don't have an account?{' '}
                <Link to="/register">Register here</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default LoginPage;
