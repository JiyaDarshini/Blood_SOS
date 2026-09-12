const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { getProfile, updateProfile, changePassword } = require('../controllers/userController');
const { authMiddleware } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

router.get('/profile', authMiddleware, getProfile);

router.put(
  '/profile',
  authMiddleware,
  [
    body('fullName').optional().trim().isLength({ min: 2 }).withMessage('Full name must be at least 2 characters.'),
    body('phone').optional().matches(/^[6-9]\d{9}$/).withMessage('Please enter a valid 10-digit mobile number.'),
    body('locality').optional().trim().notEmpty().withMessage('Locality cannot be empty.'),
    body('city').optional().trim().notEmpty().withMessage('City cannot be empty.'),
    body('pincode').optional().matches(/^\d{6}$/).withMessage('Please enter a valid 6-digit pincode.'),
  ],
  validate,
  updateProfile
);

router.put(
  '/change-password',
  authMiddleware,
  [
    body('currentPassword').notEmpty().withMessage('Current password is required.'),
    body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters.'),
    body('confirmNewPassword').custom((value, { req }) => {
      if (value !== req.body.newPassword) throw new Error('Passwords do not match.');
      return true;
    }),
  ],
  validate,
  changePassword
);

module.exports = router;
