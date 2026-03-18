const { body } = require('express-validator');
const { handleValidation } = require('./auth.validator');

const validateCategory = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('El nombre es obligatorio')
    .isLength({ max: 100 })
    .withMessage('Máximo 100 caracteres'),
  body('description')
    .optional()
    .trim(),
  body('slug')
    .trim()
    .notEmpty()
    .withMessage('El slug es obligatorio')
    .isLength({ max: 120 })
    .withMessage('Máximo 120 caracteres')
    .matches(/^[a-z0-9-]+$/)
    .withMessage(
      'El slug solo puede contener minúsculas, números y guiones'
    ),
  handleValidation,
];

module.exports = { validateCategory };
