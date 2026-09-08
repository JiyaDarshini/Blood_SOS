import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const BloodDropLogo = () => (
  <svg width="32" height="36" viewBox="0 0 32 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M16 2C16 2 3 15 3 23C3 30.18 8.82 36 16 36C23.18 36 29 30.18 29 23C29 15 16 2 16 2Z" fill="#D32F2F"/>
    <path d="M16 2C16 2 3 15 3 23C3 30.18 8.82 36 16 36C23.18 36 29 30.18 29 23C29 15 16 2 16 2Z" fill="url(#dropGrad)"/>
    <path d="M13 21H19M16 18V24" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
    <defs>
      <linearGradient id="dropGrad" x1="16" y1="2" x2="16" y2="36" gradientUnits="userSpaceOnUse">
        <stop stopColor="#EF5350"/>
        <stop offset="1" stopColor="#B71C1C"/>
      </linearGradient>
    </defs>
  </svg>
);

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    setMenuOpen(false);
    navigate('/');
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="container">
        <div className="navbar-inner">
          {/* Logo */}
          <Link to="/" className="navbar-brand" onClick={closeMenu} aria-label="BloodSOS Home">
            <BloodDropLogo />
            <div className="brand-text">
              <span className="brand-name">BloodSOS</span>
              <span className="brand-tagline">Emergency Blood Network</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <ul className="navbar-links" role="list">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/sos">SOS Board</Link></li>
            <li><Link to="/donors">Find Donors</Link></li>
            <li><Link to="/about">About</Link></li>
          </ul>

          {/* Auth Links - Desktop */}
          <div className="navbar-auth">
            {!user ? (
              <>
                <Link to="/login" className="btn btn-secondary btn-sm">Login</Link>
                <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
              </>
            ) : (
              <>
                {isAdmin && (
                  <Link to="/admin" className="btn btn-dark btn-sm">Admin</Link>
                )}
                <Link to="/dashboard" className="navbar-user-btn">
                  <span className="user-avatar" aria-hidden="true">{user.fullName?.charAt(0)?.toUpperCase()}</span>
                  <span className="user-name-short">{user.fullName?.split(' ')[0]}</span>
                </Link>
                <button onClick={handleLogout} className="btn btn-secondary btn-sm" aria-label="Logout">
                  Logout
                </button>
              </>
            )}
          </div>

          {/* Hamburger */}
          <button
            className={`hamburger ${menuOpen ? 'open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        id="mobile-menu"
        className={`mobile-menu ${menuOpen ? 'open' : ''}`}
        role="dialog"
        aria-label="Mobile navigation"
      >
        <ul role="list">
          <li><Link to="/" onClick={closeMenu}>Home</Link></li>
          <li><Link to="/sos" onClick={closeMenu}>🚨 SOS Board</Link></li>
          <li><Link to="/donors" onClick={closeMenu}>🩸 Find Donors</Link></li>
          <li><Link to="/about" onClick={closeMenu}>About</Link></li>
          {!user ? (
            <>
              <li><Link to="/login" onClick={closeMenu}>Login</Link></li>
              <li><Link to="/register" onClick={closeMenu} className="mobile-cta">Register</Link></li>
            </>
          ) : (
            <>
              <li><Link to="/dashboard" onClick={closeMenu}>Dashboard</Link></li>
              <li><Link to="/profile" onClick={closeMenu}>My Profile</Link></li>
              <li><Link to="/my-sos" onClick={closeMenu}>My SOS Requests</Link></li>
              <li><Link to="/contacts" onClick={closeMenu}>Contact History</Link></li>
              {isAdmin && <li><Link to="/admin" onClick={closeMenu}>Admin Dashboard</Link></li>}
              <li>
                <button onClick={handleLogout} className="mobile-logout-btn">Logout</button>
              </li>
            </>
          )}
        </ul>
      </div>

      {menuOpen && <div className="mobile-overlay" onClick={closeMenu} aria-hidden="true" />}
    </nav>
  );
};

export default Navbar;
