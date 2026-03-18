/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: Perfil y gestión de usuarios
 */

/**
 * @swagger
 * /users/me:
 *   get:
 *     tags: [Usuarios]
 *     summary: Obtener perfil del usuario autenticado
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil del usuario
 *   put:
 *     tags: [Usuarios]
 *     summary: Actualizar perfil propio
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Perfil actualizado
 *       409:
 *         description: Email ya en uso
 */

/**
 * @swagger
 * /users:
 *   get:
 *     tags: [Usuarios]
 *     summary: Listar usuarios con paginación (admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de usuarios
 */

/**
 * @swagger
 * /users/{id}/status:
 *   patch:
 *     tags: [Usuarios]
 *     summary: Activar/desactivar usuario (admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [is_active]
 *             properties:
 *               is_active:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Estado actualizado
 */

const router = require('express').Router();
const { verifyToken } = require('../middleware/auth.middleware');
const { isAdmin } = require('../middleware/role.middleware');
const {
  validateUpdateProfile,
  validateUpdateStatus,
} = require('../validators/user.validator');
const {
  getMe,
  updateMe,
  getUsers,
  updateUserStatus,
} = require('../controllers/user.controller');

router.use(verifyToken);

router.get('/me', getMe);
router.put('/me', validateUpdateProfile, updateMe);
router.get('/', isAdmin, getUsers);
router.patch(
  '/:id/status', isAdmin, validateUpdateStatus, updateUserStatus
);

module.exports = router;
