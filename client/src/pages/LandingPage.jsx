import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './LandingPage.css';

const BloodDropLogo = () => (
  <svg width="80" height="90" viewBox="0 0 32 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="hero-logo-svg">
    <path d="M16 2C16 2 3 15 3 23C3 30.18 8.82 36 16 36C23.18 36 29 30.18 29 23C29 15 16 2 16 2Z" fill="#D32F2F"/>
    <path d="M16 2C16 2 3 15 3 23C3 30.18 8.82 36 16 36C23.18 36 29 30.18 29 23C29 15 16 2 16 2Z" fill="url(#heroDropGrad)"/>
    <path d="M13 21H19M16 18V24" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
    <defs>
      <linearGradient id="heroDropGrad" x1="16" y1="2" x2="16" y2="36" gradientUnits="userSpaceOnUse">
        <stop stopColor="#EF5350"/>
        <stop offset="1" stopColor="#B71C1C"/>
      </linearGradient>
    </defs>
  </svg>
);

const FEATURES = [
  { icon: '🩸', title: 'Volunteer Registration', desc: 'Donors register with blood group and locality in minutes.' },
  { icon: '🚨', title: 'SOS Request Board', desc: 'Broadcast emergency blood requests to the entire network.' },
  { icon: '🔬', title: 'Smart Blood Matching', desc: 'Automatic compatibility matching with available donors.' },
  { icon: '⚡', title: 'Availability Toggle', desc: 'Donors can mark themselves available or unavailable instantly.' },
  { icon: '📞', title: 'One-Click Call', desc: 'Contact compatible donors with a single tap.' },
  { icon: '💬', title: 'WhatsApp Contact', desc: 'Reach donors via WhatsApp for quick communication.' },
  { icon: '📍', title: 'Locality Search', desc: 'Find donors by area, city, or pincode.' },
  { icon: '🔔', title: 'Emergency Alerts', desc: 'Critical SOS requests are prominently highlighted.' },
];

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

const STEPS = [
  { num: '01', title: 'Register', desc: 'Sign up as a donor with your blood group and locality.' },
  { num: '02', title: 'Broadcast SOS', desc: 'Post an emergency blood request when needed.' },
  { num: '03', title: 'Match Donors', desc: 'System finds compatible, available donors near you.' },
  { num: '04', title: 'Contact & Help', desc: 'Call or WhatsApp the donor. Lives are saved.' },
];

const WORKFLOW = [
  'Emergency Occurs',
  'Post SOS Request',
  'System Finds Matching Donors',
  'Donors Receive Request',
  'Requester Contacts Donor',
  'Request Fulfilled ✓',
];

const LandingPage = () => {
  const { user } = useAuth();

  return (
    <main className="landing-page" role="main">
      {/* ── Hero Section ── */}
      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero-bg-pattern" aria-hidden="true"></div>
        <div className="container">
          <div className="hero-content">
            <div className="hero-logo-wrap">
              <BloodDropLogo />
            </div>
            <h1 id="hero-heading" className="hero-title">
              Blood<span className="hero-title-accent">SOS</span>
            </h1>
            <p className="hero-subtitle">Emergency Blood Donor Network</p>
            <p className="hero-desc">
              Find the right blood donor near you when every minute matters.
            </p>
            <div className="hero-buttons" role="group" aria-label="Primary actions">
              <Link to="/donors" className="btn btn-white btn-lg" id="find-donor-btn">
                🩸 FIND A DONOR
              </Link>
              {user ? (
                <Link to="/sos/create" className="btn btn-secondary btn-lg hero-sos-btn" id="post-sos-btn">
                  🚨 POST SOS
                </Link>
              ) : (
                <Link to="/register" className="btn btn-secondary btn-lg hero-sos-btn" id="post-sos-btn">
                  🚨 POST SOS
                </Link>
              )}
            </div>
            <div className="hero-secondary-btn">
              <Link to="/register" className="btn btn-lg" style={{ border: '2px solid rgba(255,255,255,0.4)', color: 'white', background: 'transparent' }} id="register-donor-btn">
                REGISTER AS DONOR
              </Link>
            </div>
            <div className="hero-stats" aria-label="Platform statistics">
              <div className="hero-stat">
                <strong>🩸</strong>
                <span>8 Blood Groups</span>
              </div>
              <div className="hero-stat">
                <strong>⚡</strong>
                <span>Real-time Matching</span>
              </div>
              <div className="hero-stat">
                <strong>🔒</strong>
                <span>Secure Platform</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="section how-it-works" aria-labelledby="how-heading">
        <div className="container">
          <div className="text-center">
            <h2 id="how-heading" className="section-title">How BloodSOS Works</h2>
            <div className="section-title-line center"></div>
            <p className="section-subtitle">Four simple steps to save a life</p>
          </div>
          <div className="steps-grid">
            {STEPS.map((step, i) => (
              <div key={i} className="step-card">
                <div className="step-num" aria-hidden="true">{step.num}</div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-desc">{step.desc}</p>
                {i < STEPS.length - 1 && <div className="step-arrow" aria-hidden="true">→</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="section features-section" aria-labelledby="features-heading">
        <div className="container">
          <div className="text-center">
            <h2 id="features-heading" className="section-title">Key Features</h2>
            <div className="section-title-line center"></div>
          </div>
          <div className="features-grid">
            {FEATURES.map((f, i) => (
              <div key={i} className="feature-card card">
                <div className="feature-icon" aria-hidden="true">{f.icon}</div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Blood Access Matters ── */}
      <section className="section why-section" aria-labelledby="why-heading">
        <div className="container">
          <div className="why-content">
            <div className="why-text">
              <h2 id="why-heading" className="section-title">Why Quick Blood Access Matters</h2>
              <div className="section-title-line"></div>
              <p>
                Every year, millions of people require blood transfusions due to accidents,
                surgeries, childbirth complications, and diseases like anaemia, cancer, and blood disorders.
              </p>
              <p style={{ marginTop: '1rem' }}>
                A shortage of even a single unit of the right blood group can be the difference between
                life and death. Traditional methods — phone calls, social media posts, hospital blood banks —
                are often too slow during a real emergency.
              </p>
              <p style={{ marginTop: '1rem' }}>
                BloodSOS creates a <strong>neighbourhood-level network of verified volunteer donors</strong>,
                enabling instant matching and contact during the critical golden hour.
              </p>
              <div style={{ marginTop: '1.5rem' }}>
                <Link to="/register" className="btn btn-primary btn-lg" id="why-cta-btn">
                  JOIN THE NETWORK
                </Link>
              </div>
            </div>
            <div className="why-visual">
              <div className="why-stat-card">
                <div className="why-stat-icon">⏱️</div>
                <h3>Golden Hour</h3>
                <p>The first hour after trauma is critical. Rapid blood access can save lives.</p>
              </div>
              <div className="why-stat-card red">
                <div className="why-stat-icon">🩸</div>
                <h3>1 in 7</h3>
                <p>Hospital patients need blood. Only 1 in 30 people donate regularly.</p>
              </div>
              <div className="why-stat-card dark">
                <div className="why-stat-icon">📍</div>
                <h3>Local Network</h3>
                <p>Nearby donors can respond in minutes — not hours.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Emergency Workflow ── */}
      <section className="section workflow-section" aria-labelledby="workflow-heading">
        <div className="container">
          <div className="text-center">
            <h2 id="workflow-heading" className="section-title">Emergency Workflow</h2>
            <div className="section-title-line center"></div>
          </div>
          <div className="workflow-steps">
            {WORKFLOW.map((step, i) => (
              <React.Fragment key={i}>
                <div className={`workflow-step ${i === WORKFLOW.length - 1 ? 'workflow-step-final' : ''}`}>
                  <div className="workflow-step-num" aria-hidden="true">{i + 1}</div>
                  <p>{step}</p>
                </div>
                {i < WORKFLOW.length - 1 && (
                  <div className="workflow-arrow" aria-hidden="true">↓</div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* ── Blood Groups ── */}
      <section className="section blood-groups-section" aria-labelledby="blood-groups-heading">
        <div className="container text-center">
          <h2 id="blood-groups-heading" className="section-title">All Blood Groups Covered</h2>
          <div className="section-title-line center"></div>
          <p className="section-subtitle">BloodSOS works across all 8 blood groups with smart compatibility matching</p>
          <div className="blood-groups-display">
            {BLOOD_GROUPS.map((bg) => (
              <div key={bg} className="blood-group-circle" aria-label={`Blood group ${bg}`}>
                {bg}
              </div>
            ))}
          </div>
          <p className="blood-compat-note">
            Including Universal Donor (O-) and Universal Recipient (AB+) compatibility mapping
          </p>
        </div>
      </section>

      {/* ── Safety Disclaimer ── */}
      <section className="section safety-section" aria-labelledby="safety-heading">
        <div className="container container-narrow">
          <div className="safety-card">
            <div className="safety-icon" aria-hidden="true">⚕️</div>
            <h2 id="safety-heading">Safety Information</h2>
            <p>
              BloodSOS is a <strong>connection platform</strong> — it connects people who need blood with
              registered volunteer donors. It does <strong>not</strong> medically verify donor eligibility,
              blood compatibility, or replace hospital blood banks.
            </p>
            <p style={{ marginTop: '0.75rem' }}>
              All clinical decisions — including cross-matching, screening, transfusion procedures, and
              eligibility assessment — <strong>must be handled by qualified healthcare professionals
              and authorized blood banks.</strong>
            </p>
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="section cta-section" aria-labelledby="cta-heading">
        <div className="container text-center">
          <div className="cta-content">
            <BloodDropLogo />
            <h2 id="cta-heading">Become a Donor. Help Your Community.</h2>
            <p>Register today and be ready when your neighbourhood needs you most.</p>
            <Link to="/register" className="btn btn-white btn-lg" id="final-register-btn">
              REGISTER AS DONOR
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default LandingPage;
