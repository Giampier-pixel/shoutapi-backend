const { body } = require('express-validator');
const { handleValidation } = require('./auth.validator');

const validateUpdateProfile = [
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('El nombre no puede estar vacío')
    .isLength({ max: 100 })
    .withMessage('Máximo 100 caracteres'),
  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Formato de email inválido')
    .normalizeEmail(),
  handleValidation,
];

const validateUpdateStatus = [
  body('is_active')
    .notEmpty()
    .withMessage('is_active es obligatorio')
    .isBoolean()
    .withMessage('is_active debe ser true o false'),
  handleValidation,
];

module.exports = { validateUpdateProfile, validateUpdateStatus };
