const express = require('express');
const router = express.Router();
const {
  getDashboardStats, getAllUsers, updateUserStatus,
  getAllDonors, getAllSOS, adminCloseSOS, getAllContacts,
} = require('../controllers/adminController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// All admin routes require auth + admin role
router.use(authMiddleware, adminMiddleware);

router.get('/dashboard', getDashboardStats);
router.get('/users', getAllUsers);
router.put('/users/:id/status', updateUserStatus);
router.get('/donors', getAllDonors);
router.get('/sos', getAllSOS);
router.put('/sos/:id/close', adminCloseSOS);
router.get('/contacts', getAllContacts);

module.exports = router;
