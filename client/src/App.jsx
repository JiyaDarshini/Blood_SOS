import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, AdminRoute, GuestRoute } from './components/RouteGuards';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import SOSBoardPage from './pages/SOSBoardPage';
import CreateSOSPage from './pages/CreateSOSPage';
import DonorsPage from './pages/DonorsPage';
import ProfilePage from './pages/ProfilePage';
import MySOSPage from './pages/MySOSPage';
import ContactsPage from './pages/ContactsPage';
import { AboutPage, PrivacyPage, TermsPage, NotFoundPage } from './pages/StaticPages';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminDonors from './pages/admin/AdminDonors';
import AdminSOS from './pages/admin/AdminSOS';
import AdminContacts from './pages/admin/AdminContacts';

// Styles
import './styles/globals.css';

const LoadingFallback = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
    <div className="spinner spinner-lg"></div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="app" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <div style={{ flex: 1 }}>
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                {/* ── Public Routes ── */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/sos" element={<SOSBoardPage />} />
                <Route path="/donors" element={<DonorsPage />} />

                {/* ── Guest-only Routes ── */}
                <Route path="/login" element={
                  <GuestRoute><LoginPage /></GuestRoute>
                } />
                <Route path="/register" element={
                  <GuestRoute><RegisterPage /></GuestRoute>
                } />

                {/* ── Protected Routes ── */}
                <Route path="/dashboard" element={
                  <ProtectedRoute><DashboardPage /></ProtectedRoute>
                } />
                <Route path="/sos/create" element={
                  <ProtectedRoute><CreateSOSPage /></ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute><ProfilePage /></ProtectedRoute>
                } />
                <Route path="/my-sos" element={
                  <ProtectedRoute><MySOSPage /></ProtectedRoute>
                } />
                <Route path="/contacts" element={
                  <ProtectedRoute><ContactsPage /></ProtectedRoute>
                } />

                {/* ── Admin Routes ── */}
                <Route path="/admin" element={
                  <AdminRoute><AdminDashboard /></AdminRoute>
                } />
                <Route path="/admin/users" element={
                  <AdminRoute><AdminUsers /></AdminRoute>
                } />
                <Route path="/admin/donors" element={
                  <AdminRoute><AdminDonors /></AdminRoute>
                } />
                <Route path="/admin/sos" element={
                  <AdminRoute><AdminSOS /></AdminRoute>
                } />
                <Route path="/admin/contacts" element={
                  <AdminRoute><AdminContacts /></AdminRoute>
                } />

                {/* ── 404 ── */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
          </div>
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
