import React from 'react';
import { formatBloodGroup, getUrgencyBadgeClass, getStatusBadgeClass, timeAgo } from '../utils';
import { contactService } from '../services';
import { useAuth } from '../context/AuthContext';

const SOSCard = ({ sos, showActions = false, onFulfill, onClose, onCancel }) => {
  const { user } = useAuth();

  const handleContact = async (donorId, channel) => {
    if (!user) return;
    try {
      await contactService.logContact({ sosId: sos.id, donorId, channel });
    } catch {}
  };

  const isCritical = sos.urgency === 'CRITICAL';
  const isOwner = user && sos.requester?.id === user.id;

  return (
    <article
      className={`sos-card card ${isCritical ? 'card-critical' : ''}`}
      aria-label={`SOS request for ${formatBloodGroup(sos.bloodGroup)} blood`}
    >
      {/* Header */}
      <div className="sos-card-header">
        <div className="sos-blood-group-wrap">
          <span className="blood-group-badge" aria-label={`Blood group ${formatBloodGroup(sos.bloodGroup)}`}>
            {formatBloodGroup(sos.bloodGroup)}
          </span>
          {sos.unitsRequired && (
            <span className="sos-units">× {sos.unitsRequired} unit{sos.unitsRequired > 1 ? 's' : ''}</span>
          )}
        </div>
        <div className="sos-badges">
          <span className={`badge ${getUrgencyBadgeClass(sos.urgency)}`} role="status">
            {sos.urgency}
          </span>
          <span className={`badge ${getStatusBadgeClass(sos.status)}`}>
            {sos.status}
          </span>
        </div>
      </div>

      {/* Hospital Info */}
      <div className="sos-hospital">
        <h3 className="sos-hospital-name">🏥 {sos.hospitalName}</h3>
        <p className="sos-hospital-addr">{sos.hospitalAddress}</p>
      </div>

      {/* Location */}
      <div className="sos-meta">
        <span>📍 {sos.locality}, {sos.city}</span>
        <span>🕐 {timeAgo(sos.createdAt)}</span>
      </div>

      {/* Requester */}
      {sos.requester && (
        <p className="sos-requester">
          Posted by: <strong>{sos.requester.fullName}</strong>
        </p>
      )}

      {/* Message */}
      {sos.message && (
        <p className="sos-message">{sos.message}</p>
      )}

      {/* Contact */}
      {user && sos.status === 'ACTIVE' && sos.contactNumber && (
        <div className="sos-contact-buttons">
          <a
            href={`tel:${sos.contactNumber}`}
            className="btn btn-primary btn-sm"
            aria-label={`Call requester for this SOS`}
          >
            📞 CALL NOW
          </a>
          <a
            href={`https://wa.me/91${sos.contactNumber.replace(/^0/, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-dark btn-sm"
            aria-label={`WhatsApp requester for this SOS`}
          >
            💬 WHATSAPP
          </a>
        </div>
      )}

      {/* Owner actions */}
      {showActions && isOwner && sos.status === 'ACTIVE' && (
        <div className="sos-owner-actions">
          {onFulfill && (
            <button className="btn btn-secondary btn-sm" onClick={() => onFulfill(sos.id)}>
              ✓ Mark Fulfilled
            </button>
          )}
          {onClose && (
            <button className="btn btn-sm" style={{ border: '2px solid #666', color: '#666' }} onClick={() => onClose(sos.id)}>
              Close
            </button>
          )}
          {onCancel && (
            <button className="btn btn-sm" style={{ border: '2px solid var(--dark-red)', color: 'var(--dark-red)' }} onClick={() => onCancel(sos.id)}>
              Cancel
            </button>
          )}
        </div>
      )}

      {/* Contact count */}
      {sos._count && (
        <p className="sos-contact-count">
          {sos._count.contactLogs} contact attempt{sos._count.contactLogs !== 1 ? 's' : ''}
        </p>
      )}
    </article>
  );
};

export default SOSCard;
