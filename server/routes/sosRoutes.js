const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  createSOS, getSOSRequests, getSOSById, updateSOS,
  fulfillSOS, closeSOS, deleteSOS, getMySOS,
} = require('../controllers/sosController');
const { authMiddleware, optionalAuth } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

const VALID_BLOOD_GROUPS = ['A_POS', 'A_NEG', 'B_POS', 'B_NEG', 'O_POS', 'O_NEG', 'AB_POS', 'AB_NEG'];
const VALID_URGENCY = ['CRITICAL', 'URGENT', 'PLANNED'];

// Public SOS board
router.get('/', optionalAuth, getSOSRequests);
router.get('/my', authMiddleware, getMySOS);
router.get('/:id', optionalAuth, getSOSById);

// Authenticated
router.post(
  '/',
  authMiddleware,
  [
    body('bloodGroup').isIn(VALID_BLOOD_GROUPS).withMessage('Please select a valid blood group.'),
    body('unitsRequired').isInt({ min: 1, max: 20 }).withMessage('Units required must be between 1 and 20.'),
    body('hospitalName').trim().notEmpty().withMessage('Hospital name is required.'),
    body('hospitalAddress').trim().notEmpty().withMessage('Hospital address is required.'),
    body('locality').trim().notEmpty().withMessage('Locality is required.'),
    body('city').trim().notEmpty().withMessage('City is required.'),
    body('urgency').isIn(VALID_URGENCY).withMessage('Please select a valid urgency level.'),
    body('contactNumber').matches(/^[6-9]\d{9}$/).withMessage('Please enter a valid 10-digit contact number.'),
  ],
  validate,
  createSOS
);

router.put(
  '/:id',
  authMiddleware,
  [
    body('bloodGroup').optional().isIn(VALID_BLOOD_GROUPS).withMessage('Invalid blood group.'),
    body('urgency').optional().isIn(VALID_URGENCY).withMessage('Invalid urgency level.'),
  ],
  validate,
  updateSOS
);

router.put('/:id/fulfill', authMiddleware, fulfillSOS);
router.put('/:id/close', authMiddleware, closeSOS);
router.delete('/:id', authMiddleware, deleteSOS);

module.exports = router;
