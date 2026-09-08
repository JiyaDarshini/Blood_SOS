import React, { useState } from 'react';
import { formatBloodGroup, formatDate } from '../utils';
import { contactService } from '../services';
import { useAuth } from '../context/AuthContext';
import './DonorCard.css';

const DonorCard = ({ donor, sosId }) => {
  const { user } = useAuth();
  const [logging, setLogging] = useState(false);

  const handleContact = async (channel, phone) => {
    if (!user || !sosId) return;
    setLogging(true);
    try {
      await contactService.logContact({ sosId, donorId: donor.id, channel });
    } catch (e) {
      // Silent fail on contact log
    } finally {
      setLogging(false);
    }
  };

  const phone = donor.user?.phone;

  return (
    <article
      className={`donor-card card ${!donor.isAvailable ? 'donor-unavailable' : ''}`}
      aria-label={`Donor ${donor.user?.fullName}, blood group ${formatBloodGroup(donor.bloodGroup)}`}
    >
      {/* Header */}
      <div className="donor-card-header">
        <div className="donor-avatar" aria-hidden="true">
          {donor.user?.fullName?.charAt(0)?.toUpperCase() || 'D'}
        </div>
        <div className="donor-info">
          <h3 className="donor-name">{donor.user?.fullName || 'Donor'}</h3>
          <p className="donor-location">📍 {donor.locality}, {donor.city}</p>
        </div>
        <span className="blood-group-badge">{formatBloodGroup(donor.bloodGroup)}</span>
      </div>

      {/* Availability */}
      <div className="donor-availability">
        <span
          className={`badge ${donor.isAvailable ? 'badge-available' : 'badge-unavailable'}`}
          role="status"
        >
          {donor.isAvailable ? '● AVAILABLE' : '○ UNAVAILABLE'}
        </span>
        <span className="donor-updated">
          Updated: {formatDate(donor.updatedAt)}
        </span>
      </div>

      {/* Pincode */}
      <p className="donor-pincode">PIN: {donor.pincode}</p>

      {/* Contact Buttons */}
      {user && donor.isAvailable && phone && (
        <div className="donor-contact-btns">
          <a
            href={`tel:${phone}`}
            className="btn btn-primary btn-sm"
            onClick={() => handleContact('CALL', phone)}
            aria-label={`Call ${donor.user?.fullName}`}
          >
            📞 CALL NOW
          </a>
          <a
            href={`https://wa.me/91${phone.replace(/^0/, '').replace(/\D/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-dark btn-sm"
            onClick={() => handleContact('WHATSAPP', phone)}
            aria-label={`WhatsApp ${donor.user?.fullName}`}
          >
            💬 WHATSAPP
          </a>
        </div>
      )}

      {!user && (
        <p className="donor-login-prompt">
          <a href="/login">Login</a> to contact this donor
        </p>
      )}

      {user && !donor.isAvailable && (
        <p className="donor-unavail-msg">This donor is currently unavailable for donation.</p>
      )}
    </article>
  );
};

export default DonorCard;
