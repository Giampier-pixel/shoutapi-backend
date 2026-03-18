/**
 * @swagger
 * tags:
 *   name: Categorías
 *   description: Gestión de categorías de productos
 */

/**
 * @swagger
 * /categories:
 *   get:
 *     tags: [Categorías]
 *     summary: Listar todas las categorías
 *     responses:
 *       200:
 *         description: Lista de categorías
 *   post:
 *     tags: [Categorías]
 *     summary: Crear categoría (admin)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, slug]
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               slug:
 *                 type: string
 *     responses:
 *       201:
 *         description: Categoría creada
 *       409:
 *         description: Slug duplicado
 */

/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     tags: [Categorías]
 *     summary: Obtener categoría por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Categoría encontrada
 *       404:
 *         description: No encontrada
 *   put:
 *     tags: [Categorías]
 *     summary: Actualizar categoría (admin)
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
 *               slug:
 *                 type: string
 *     responses:
 *       200:
 *         description: Categoría actualizada
 *   delete:
 *     tags: [Categorías]
 *     summary: Eliminar categoría (admin)
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
 *         description: Categoría eliminada
 */

const router = require('express').Router();
const { verifyToken } = require('../middleware/auth.middleware');
const { isAdmin } = require('../middleware/role.middleware');
const {
  validateCategory,
} = require('../validators/category.validator');
const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/category.controller');

router.get('/', getCategories);
router.get('/:id', getCategoryById);
router.post(
  '/', verifyToken, isAdmin, validateCategory, createCategory
);
router.put(
  '/:id', verifyToken, isAdmin, validateCategory, updateCategory
);
router.delete('/:id', verifyToken, isAdmin, deleteCategory);

module.exports = router;
