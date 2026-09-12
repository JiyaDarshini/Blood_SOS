const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { logContact, getContacts } = require('../controllers/contactController');
const { authMiddleware } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

router.post(
  '/',
  authMiddleware,
  [
    body('sosId').notEmpty().withMessage('SOS ID is required.'),
    body('donorId').notEmpty().withMessage('Donor ID is required.'),
    body('channel').isIn(['CALL', 'WHATSAPP']).withMessage('Channel must be CALL or WHATSAPP.'),
  ],
  validate,
  logContact
);

router.get('/', authMiddleware, getContacts);

module.exports = router;
