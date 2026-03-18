/**
 * @swagger
 * tags:
 *   name: Productos
 *   description: Gestión de productos del catálogo
 */

/**
 * @swagger
 * /products:
 *   get:
 *     tags: [Productos]
 *     summary: Listar productos con paginación y filtros
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 12
 *       - in: query
 *         name: category
 *         schema:
 *           type: integer
 *         description: Filtrar por category_id
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Buscar por nombre
 *     responses:
 *       200:
 *         description: Lista paginada de productos
 *   post:
 *     tags: [Productos]
 *     summary: Crear producto (admin)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, price, category_id]
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: integer
 *               category_id:
 *                 type: integer
 *               image_url:
 *                 type: string
 *     responses:
 *       201:
 *         description: Producto creado
 */

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     tags: [Productos]
 *     summary: Obtener producto por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Producto encontrado
 *       404:
 *         description: No encontrado
 *   put:
 *     tags: [Productos]
 *     summary: Actualizar producto (admin)
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
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: integer
 *               category_id:
 *                 type: integer
 *               image_url:
 *                 type: string
 *     responses:
 *       200:
 *         description: Producto actualizado
 *   delete:
 *     tags: [Productos]
 *     summary: Desactivar producto — soft delete (admin)
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
 *         description: Producto desactivado
 */

const router = require('express').Router();
const { verifyToken } = require('../middleware/auth.middleware');
const { isAdmin } = require('../middleware/role.middleware');
const {
  validateProduct,
} = require('../validators/product.validator');
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/product.controller');

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post(
  '/', verifyToken, isAdmin, validateProduct, createProduct
);
router.put(
  '/:id', verifyToken, isAdmin, validateProduct, updateProduct
);
router.delete('/:id', verifyToken, isAdmin, deleteProduct);

module.exports = router;
