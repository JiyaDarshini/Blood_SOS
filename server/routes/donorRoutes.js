const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  getDonors, getDonorById, updateAvailability,
  getMatchingDonors, registerDonor,
} = require('../controllers/donorController');
const { authMiddleware, optionalAuth } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

const VALID_BLOOD_GROUPS = ['A_POS', 'A_NEG', 'B_POS', 'B_NEG', 'O_POS', 'O_NEG', 'AB_POS', 'AB_NEG'];

// Public with optional auth (phone shown only to authenticated users)
router.get('/', optionalAuth, getDonors);

// Authenticated routes
router.get('/match/:bloodGroup', authMiddleware, getMatchingDonors);
router.get('/:id', authMiddleware, getDonorById);

router.put(
  '/availability',
  authMiddleware,
  [body('isAvailable').isBoolean().withMessage('isAvailable must be a boolean.')],
  validate,
  updateAvailability
);

router.post(
  '/register',
  authMiddleware,
  [
    body('bloodGroup').isIn(VALID_BLOOD_GROUPS).withMessage('Please select a valid blood group.'),
    body('locality').trim().notEmpty().withMessage('Locality is required.'),
    body('city').trim().notEmpty().withMessage('City is required.'),
    body('pincode').matches(/^\d{6}$/).withMessage('Please enter a valid 6-digit pincode.'),
  ],
  validate,
  registerDonor
);

module.exports = router;
