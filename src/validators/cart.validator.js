const { body } = require('express-validator');
const { handleValidation } = require('./auth.validator');

const validateAddToCart = [
  body('productId')
    .notEmpty()
    .withMessage('productId es obligatorio')
    .isInt()
    .withMessage('productId debe ser un entero'),
  body('quantity')
    .optional()
    .isInt({ min: 1 })
    .withMessage('La cantidad debe ser al menos 1'),
  handleValidation,
];

const validateUpdateCart = [
  body('quantity')
    .notEmpty()
    .withMessage('La cantidad es obligatoria')
    .isInt({ min: 1 })
    .withMessage('La cantidad debe ser al menos 1'),
  handleValidation,
];

module.exports = { validateAddToCart, validateUpdateCart };
