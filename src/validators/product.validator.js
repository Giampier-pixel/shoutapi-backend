const { body } = require('express-validator');
const { handleValidation } = require('./auth.validator');

const validateProduct = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('El nombre es obligatorio')
    .isLength({ max: 200 })
    .withMessage('Máximo 200 caracteres'),
  body('description')
    .optional()
    .trim(),
  body('price')
    .notEmpty()
    .withMessage('El precio es obligatorio')
    .isFloat({ min: 0.01 })
    .withMessage('El precio debe ser mayor a 0'),
  body('stock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('El stock debe ser un entero >= 0'),
  body('category_id')
    .notEmpty()
    .withMessage('La categoría es obligatoria')
    .isInt()
    .withMessage('category_id debe ser un entero'),
  body('image_url')
    .optional()
    .trim()
    .isURL()
    .withMessage('URL de imagen inválida'),
  handleValidation,
];

module.exports = { validateProduct };
