/**
 * @swagger
 * tags:
 *   name: Órdenes
 *   description: Checkout y gestión de órdenes
 */

/**
 * @swagger
 * /orders/checkout:
 *   post:
 *     tags: [Órdenes]
 *     summary: Checkout — convertir carrito en orden
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Orden creada
 *       400:
 *         description: Carrito vacío o stock insuficiente
 */

/**
 * @swagger
 * /orders/my:
 *   get:
 *     tags: [Órdenes]
 *     summary: Historial de órdenes del cliente
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
 *         description: Lista de órdenes
 */

/**
 * @swagger
 * /orders/my/{id}:
 *   get:
 *     tags: [Órdenes]
 *     summary: Detalle de una orden del cliente
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Orden encontrada
 *       404:
 *         description: No encontrada
 */

/**
 * @swagger
 * /orders:
 *   get:
 *     tags: [Órdenes]
 *     summary: Listar todas las órdenes (admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, processing, shipped, delivered, cancelled]
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
 *         description: Lista de órdenes
 */

/**
 * @swagger
 * /orders/{id}/status:
 *   patch:
 *     tags: [Órdenes]
 *     summary: Cambiar estado de una orden (admin)
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
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, processing, shipped, delivered, cancelled]
 *     responses:
 *       200:
 *         description: Estado actualizado
 *       400:
 *         description: Transición de estado inválida
 */

const router = require('express').Router();
const { verifyToken } = require('../middleware/auth.middleware');
const { isAdmin } = require('../middleware/role.middleware');
const {
  validateUpdateStatus,
} = require('../validators/order.validator');
const {
  checkout,
  getMyOrders,
  getMyOrderById,
  getAllOrders,
  updateOrderStatus,
} = require('../controllers/order.controller');

router.use(verifyToken);

router.post('/checkout', checkout);
router.get('/my', getMyOrders);
router.get('/my/:id', getMyOrderById);
router.get('/', isAdmin, getAllOrders);
router.patch(
  '/:id/status', isAdmin, validateUpdateStatus, updateOrderStatus
);

module.exports = router;
