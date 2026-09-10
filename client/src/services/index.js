import api from './api';

export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
};

export const userService = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  changePassword: (data) => api.put('/users/change-password', data),
};

export const donorService = {
  getDonors: (params) => api.get('/donors', { params }),
  getDonorById: (id) => api.get(`/donors/${id}`),
  updateAvailability: (isAvailable) => api.put('/donors/availability', { isAvailable }),
  getMatchingDonors: (bloodGroup, params) => api.get(`/donors/match/${bloodGroup}`, { params }),
  registerDonor: (data) => api.post('/donors/register', data),
};

export const sosService = {
  createSOS: (data) => api.post('/sos', data),
  getSOSRequests: (params) => api.get('/sos', { params }),
  getSOSById: (id) => api.get(`/sos/${id}`),
  updateSOS: (id, data) => api.put(`/sos/${id}`, data),
  fulfillSOS: (id) => api.put(`/sos/${id}/fulfill`),
  closeSOS: (id) => api.put(`/sos/${id}/close`),
  deleteSOS: (id) => api.delete(`/sos/${id}`),
  getMySOS: () => api.get('/sos/my'),
};

export const contactService = {
  logContact: (data) => api.post('/contacts', data),
  getContacts: (params) => api.get('/contacts', { params }),
};

export const adminService = {
  getDashboardStats: () => api.get('/admin/dashboard'),
  getAllUsers: (params) => api.get('/admin/users', { params }),
  updateUserStatus: (id, status) => api.put(`/admin/users/${id}/status`, { status }),
  getAllDonors: (params) => api.get('/admin/donors', { params }),
  getAllSOS: (params) => api.get('/admin/sos', { params }),
  closeSOS: (id) => api.put(`/admin/sos/${id}/close`),
  getAllContacts: (params) => api.get('/admin/contacts', { params }),
};
