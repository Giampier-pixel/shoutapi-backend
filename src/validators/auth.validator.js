const { body, validationResult } = require('express-validator');

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: true,
      message: 'Error de validación',
      statusCode: 400,
      details: errors.array().map((e) => ({
        field: e.path,
        message: e.msg,
      })),
    });
  }
  next();
};

const validateRegister = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('El nombre es obligatorio')
    .isLength({ max: 100 })
    .withMessage('El nombre no puede exceder 100 caracteres'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('El email es obligatorio')
    .isEmail()
    .withMessage('Formato de email inválido')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('La contraseña es obligatoria')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres'),
  handleValidation,
];

const validateLogin = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('El email es obligatorio')
    .isEmail()
    .withMessage('Formato de email inválido')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('La contraseña es obligatoria'),
  handleValidation,
];

module.exports = { validateRegister, validateLogin, handleValidation };
