/**
 * @swagger
 * tags:
 *   name: Carrito
 *   description: Gestión del carrito de compras
 */

/**
 * @swagger
 * /cart:
 *   get:
 *     tags: [Carrito]
 *     summary: Obtener carrito del usuario
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Carrito obtenido
 *   delete:
 *     tags: [Carrito]
 *     summary: Vaciar carrito completo
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Carrito vaciado
 */

/**
 * @swagger
 * /cart/items:
 *   post:
 *     tags: [Carrito]
 *     summary: Agregar producto al carrito
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [productId]
 *             properties:
 *               productId:
 *                 type: integer
 *               quantity:
 *                 type: integer
 *                 default: 1
 *     responses:
 *       201:
 *         description: Producto agregado
 *       400:
 *         description: Stock insuficiente
 */

/**
 * @swagger
 * /cart/items/{productId}:
 *   put:
 *     tags: [Carrito]
 *     summary: Actualizar cantidad de un producto
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [quantity]
 *             properties:
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *     responses:
 *       200:
 *         description: Cantidad actualizada
 *   delete:
 *     tags: [Carrito]
 *     summary: Eliminar producto del carrito
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Producto eliminado
 */

const router = require('express').Router();
const { verifyToken } = require('../middleware/auth.middleware');
const {
  validateAddToCart,
  validateUpdateCart,
} = require('../validators/cart.validator');
const {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} = require('../controllers/cart.controller');

router.use(verifyToken);

router.get('/', getCart);
router.post('/items', validateAddToCart, addToCart);
router.put(
  '/items/:productId', validateUpdateCart, updateCartItem
);
router.delete('/items/:productId', removeCartItem);
router.delete('/', clearCart);

module.exports = router;
