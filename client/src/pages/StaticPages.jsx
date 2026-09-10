import React from 'react';
import { Link } from 'react-router-dom';

const AboutPage = () => (
  <main role="main">
    <div className="page-header">
      <div className="container">
        <h1>About BloodSOS</h1>
        <p>Emergency Blood Donor Network — Connecting communities when every minute matters</p>
      </div>
    </div>
    <div className="container container-narrow section">
      <h2>Our Mission</h2>
      <div className="section-title-line"></div>
      <p>BloodSOS is a neighbourhood-level emergency blood donor platform designed to bridge the critical gap between people who urgently need blood and available voluntary donors in their locality.</p>
      <p style={{ marginTop: '1rem' }}>Built as a community service, BloodSOS uses modern web technology to enable instant matching of blood group compatibility and one-click contact functionality — all during the golden hour when every second counts.</p>
      
      <h2 style={{ marginTop: '2rem' }}>How We Work</h2>
      <div className="section-title-line"></div>
      <p>BloodSOS is a <strong>connection platform</strong>. We do not collect blood, operate blood banks, or medically verify donors. We simply connect people who need blood with registered volunteer donors in their area.</p>
      <p style={{ marginTop: '1rem' }}>All clinical decisions including cross-matching, screening, and transfusion must be handled by qualified healthcare professionals.</p>
      
      <div className="card" style={{ marginTop: '2rem', borderLeft: '4px solid var(--primary-red)' }}>
        <h3>⚕️ Medical Disclaimer</h3>
        <p style={{ marginTop: '0.5rem' }}>BloodSOS helps connect potential donors and people requesting blood. Donor eligibility, blood compatibility, screening, cross-matching, transfusion decisions and medical procedures must always be handled by qualified healthcare professionals and authorized blood banks.</p>
      </div>

      <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <Link to="/register" className="btn btn-primary">Register as Donor</Link>
        <Link to="/sos" className="btn btn-secondary">View SOS Board</Link>
      </div>
    </div>
  </main>
);

const PrivacyPage = () => (
  <main role="main">
    <div className="page-header">
      <div className="container">
        <h1>Privacy Policy</h1>
        <p>Last updated: October 2024</p>
      </div>
    </div>
    <div className="container container-narrow section">
      <p>BloodSOS collects only the personal information necessary to operate the emergency blood donor network. This includes your name, email, phone number, blood group, and general location (locality/city).</p>
      <h2 style={{ marginTop: '1.5rem' }}>Data We Collect</h2>
      <div className="section-title-line"></div>
      <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '0.5rem' }}>
        <li>Full name and contact information</li>
        <li>Blood group and donor status</li>
        <li>Locality and city (not precise GPS)</li>
        <li>SOS request details</li>
        <li>Contact log records</li>
      </ul>
      <h2 style={{ marginTop: '1.5rem' }}>How We Use Your Data</h2>
      <div className="section-title-line"></div>
      <p>Your data is used solely to operate the BloodSOS network — to match donors with requesters and facilitate contact during emergencies.</p>
      <p style={{ marginTop: '0.75rem' }}>Phone numbers are only visible to authenticated users. We do not sell or share your data with third parties.</p>
      <h2 style={{ marginTop: '1.5rem' }}>Your Rights</h2>
      <div className="section-title-line"></div>
      <p>You can update or delete your account at any time by contacting us or through the profile settings.</p>
    </div>
  </main>
);

const TermsPage = () => (
  <main role="main">
    <div className="page-header">
      <div className="container">
        <h1>Terms of Service</h1>
        <p>Last updated: October 2024</p>
      </div>
    </div>
    <div className="container container-narrow section">
      <p>By using BloodSOS, you agree to the following terms:</p>
      <h2 style={{ marginTop: '1.5rem' }}>1. Eligibility</h2>
      <div className="section-title-line"></div>
      <p>You must be 18 years or older to register. Donor eligibility for blood donation must be assessed by qualified healthcare professionals.</p>
      <h2 style={{ marginTop: '1.5rem' }}>2. Acceptable Use</h2>
      <div className="section-title-line"></div>
      <p>BloodSOS may only be used for legitimate emergency blood donor connection purposes. False SOS requests or misuse of contact information is strictly prohibited.</p>
      <h2 style={{ marginTop: '1.5rem' }}>3. Medical Disclaimer</h2>
      <div className="section-title-line"></div>
      <p>BloodSOS is a connection platform only. It does not provide medical advice, verify donor eligibility, or replace hospital blood banks. All clinical decisions must be made by qualified professionals.</p>
      <h2 style={{ marginTop: '1.5rem' }}>4. Privacy</h2>
      <div className="section-title-line"></div>
      <p>Your use of BloodSOS is also governed by our <Link to="/privacy">Privacy Policy</Link>.</p>
      <h2 style={{ marginTop: '1.5rem' }}>5. Limitation of Liability</h2>
      <div className="section-title-line"></div>
      <p>BloodSOS provides an information connection service only. We are not liable for outcomes of blood donation or medical procedures.</p>
    </div>
  </main>
);

const NotFoundPage = () => (
  <main role="main">
    <div style={{ textAlign: 'center', padding: '6rem 1.5rem' }}>
      <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🩸</div>
      <h1 style={{ color: 'var(--primary-red)', fontSize: '5rem', lineHeight: 1 }}>404</h1>
      <h2>Page Not Found</h2>
      <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', marginBottom: '1.5rem' }}>The page you're looking for doesn't exist.</p>
      <Link to="/" className="btn btn-primary">Go Home</Link>
    </div>
  </main>
);

export { AboutPage, PrivacyPage, TermsPage, NotFoundPage };
