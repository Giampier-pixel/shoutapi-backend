const { body } = require('express-validator');
const { handleValidation } = require('./auth.validator');

const VALID_STATUSES = [
  'pending',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
];

const validateUpdateStatus = [
  body('status')
    .notEmpty()
    .withMessage('El estado es obligatorio')
    .isIn(VALID_STATUSES)
    .withMessage(
      `Estado inválido. Válidos: ${VALID_STATUSES.join(', ')}`
    ),
  handleValidation,
];

module.exports = { validateUpdateStatus };
