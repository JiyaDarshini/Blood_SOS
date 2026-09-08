import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const BloodDropLogo = () => (
  <svg width="24" height="28" viewBox="0 0 32 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M16 2C16 2 3 15 3 23C3 30.18 8.82 36 16 36C23.18 36 29 30.18 29 23C29 15 16 2 16 2Z" fill="#D32F2F"/>
    <path d="M13 21H19M16 18V24" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
  </svg>
);

const Footer = () => {
  return (
    <footer className="footer" role="contentinfo">
      <div className="container">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <div className="footer-logo">
              <BloodDropLogo />
              <div>
                <p className="footer-brand-name">BloodSOS</p>
                <p className="footer-brand-sub">Emergency Blood Donor Network</p>
              </div>
            </div>
            <p className="footer-tagline">
              "Connecting communities when every minute matters."
            </p>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/sos">SOS Board</Link></li>
              <li><Link to="/donors">Find Donors</Link></li>
              <li><Link to="/register">Register as Donor</Link></li>
              <li><Link to="/login">Login</Link></li>
            </ul>
          </div>

          {/* Info */}
          <div className="footer-col">
            <h4>Information</h4>
            <ul>
              <li><Link to="/about">About BloodSOS</Link></li>
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/terms">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Blood Groups */}
          <div className="footer-col">
            <h4>Blood Groups</h4>
            <div className="blood-groups-grid">
              {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((bg) => (
                <span key={bg} className="blood-group-chip">{bg}</span>
              ))}
            </div>
          </div>
        </div>

        <hr className="divider divider-red" />

        {/* Disclaimer */}
        <div className="footer-disclaimer">
          <p>
            <strong>⚕️ Medical Disclaimer:</strong> BloodSOS helps connect potential donors and people requesting blood.
            Donor eligibility, blood compatibility, screening, cross-matching, transfusion decisions and medical procedures
            must always be handled by qualified healthcare professionals and authorized blood banks.
          </p>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} BloodSOS – Emergency Blood Donor Network. All rights reserved.</p>
          <p>Built with ❤️ for the community.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
