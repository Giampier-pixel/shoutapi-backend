/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Autenticación y gestión de sesión
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Registrar un nuevo usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 6
 *     responses:
 *       201:
 *         description: Usuario registrado
 *       409:
 *         description: Email ya registrado
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Iniciar sesión
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login exitoso, retorna accessToken
 *       401:
 *         description: Credenciales inválidas
 */

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     tags: [Auth]
 *     summary: Renovar accessToken con refreshToken (cookie)
 *     responses:
 *       200:
 *         description: Nuevo accessToken generado
 *       401:
 *         description: Refresh token inválido
 */

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     tags: [Auth]
 *     summary: Cerrar sesión (elimina cookie refreshToken)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sesión cerrada
 */

const router = require('express').Router();
const { verifyToken } = require('../middleware/auth.middleware');
const {
  validateRegister,
  validateLogin,
} = require('../validators/auth.validator');
const {
  register,
  login,
  refresh,
  logout,
} = require('../controllers/auth.controller');

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.post('/refresh', refresh);
router.post('/logout', verifyToken, logout);

module.exports = router;
