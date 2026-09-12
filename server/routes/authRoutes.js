const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { register, login, getMe, logout } = require('../controllers/authController');
const { authMiddleware } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

const VALID_BLOOD_GROUPS = ['A_POS', 'A_NEG', 'B_POS', 'B_NEG', 'O_POS', 'O_NEG', 'AB_POS', 'AB_NEG'];
const VALID_ROLES = ['DONOR', 'REQUESTER', 'BOTH'];

router.post(
  '/register',
  [
    body('fullName').trim().notEmpty().withMessage('Full name is required.').isLength({ min: 2 }).withMessage('Full name must be at least 2 characters.'),
    body('email').trim().isEmail().withMessage('Please enter a valid email address.').normalizeEmail(),
    body('phone').trim().matches(/^[6-9]\d{9}$/).withMessage('Please enter a valid 10-digit Indian mobile number.'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters.'),
    body('confirmPassword').custom((value, { req }) => {
      if (value !== req.body.password) throw new Error('Passwords do not match.');
      return true;
    }),
    body('role').isIn(VALID_ROLES).withMessage('Please select a valid role.'),
    body('bloodGroup').optional().isIn(VALID_BLOOD_GROUPS).withMessage('Please select a valid blood group.'),
    body('locality').optional().trim().notEmpty().withMessage('Locality is required.'),
    body('city').optional().trim().notEmpty().withMessage('City is required.'),
    body('pincode').optional().matches(/^\d{6}$/).withMessage('Please enter a valid 6-digit pincode.'),
  ],
  validate,
  register
);

router.post(
  '/login',
  [
    body('emailOrPhone').trim().notEmpty().withMessage('Email or phone number is required.'),
    body('password').notEmpty().withMessage('Password is required.'),
  ],
  validate,
  login
);

router.get('/me', authMiddleware, getMe);
router.post('/logout', authMiddleware, logout);

module.exports = router;
