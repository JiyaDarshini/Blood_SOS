// Blood group display formatting
export const BLOOD_GROUPS = [
  { value: 'A_POS', label: 'A+' },
  { value: 'A_NEG', label: 'A-' },
  { value: 'B_POS', label: 'B+' },
  { value: 'B_NEG', label: 'B-' },
  { value: 'O_POS', label: 'O+' },
  { value: 'O_NEG', label: 'O-' },
  { value: 'AB_POS', label: 'AB+' },
  { value: 'AB_NEG', label: 'AB-' },
];

export const BLOOD_GROUP_MAP = {
  A_POS: 'A+', A_NEG: 'A-',
  B_POS: 'B+', B_NEG: 'B-',
  O_POS: 'O+', O_NEG: 'O-',
  AB_POS: 'AB+', AB_NEG: 'AB-',
};

export const URGENCY_LEVELS = [
  { value: 'CRITICAL', label: 'Critical' },
  { value: 'URGENT', label: 'Urgent' },
  { value: 'PLANNED', label: 'Planned' },
];

export const ROLES = [
  { value: 'DONOR', label: 'Donor' },
  { value: 'REQUESTER', label: 'Requester' },
  { value: 'BOTH', label: 'Donor & Requester' },
];

export const SOS_STATUSES = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'FULFILLED', label: 'Fulfilled' },
  { value: 'CLOSED', label: 'Closed' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

export const formatBloodGroup = (bg) => BLOOD_GROUP_MAP[bg] || bg;

export const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
};

export const formatDateTime = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
};

export const timeAgo = (dateStr) => {
  if (!dateStr) return '—';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;
  const days = Math.floor(hrs / 24);
  return `${days} day${days > 1 ? 's' : ''} ago`;
};

export const getUrgencyBadgeClass = (urgency) => {
  switch (urgency) {
    case 'CRITICAL': return 'badge-critical';
    case 'URGENT': return 'badge-urgent';
    case 'PLANNED': return 'badge-planned';
    default: return 'badge-planned';
  }
};

export const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'ACTIVE': return 'badge-active';
    case 'FULFILLED': return 'badge-fulfilled';
    case 'CLOSED': return 'badge-closed';
    case 'CANCELLED': return 'badge-cancelled';
    default: return 'badge-closed';
  }
};
