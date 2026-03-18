const { Category } = require('../models');
const { success } = require('../utils/response');

const getCategories = async (_req, res, next) => {
  try {
    const categories = await Category.findAll({
      order: [['name', 'ASC']],
    });
    return success(res, categories, 'Categorías obtenidas');
  } catch (error) {
    next(error);
  }
};

const getCategoryById = async (req, res, next) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({
        error: true,
        message: 'Categoría no encontrada',
        statusCode: 404,
      });
    }
    return success(res, category, 'Categoría obtenida');
  } catch (error) {
    next(error);
  }
};

const createCategory = async (req, res, next) => {
  try {
    const { name, description, slug } = req.body;

    const existing = await Category.findOne({
      where: { slug },
    });
    if (existing) {
      return res.status(409).json({
        error: true,
        message: 'El slug ya existe',
        statusCode: 409,
      });
    }

    const category = await Category.create({
      name,
      description,
      slug,
    });
    return success(res, category, 'Categoría creada', 201);
  } catch (error) {
    next(error);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({
        error: true,
        message: 'Categoría no encontrada',
        statusCode: 404,
      });
    }

    const { name, description, slug } = req.body;

    if (slug && slug !== category.slug) {
      const existing = await Category.findOne({
        where: { slug },
      });
      if (existing) {
        return res.status(409).json({
          error: true,
          message: 'El slug ya existe',
          statusCode: 409,
        });
      }
    }

    await category.update({ name, description, slug });
    return success(res, category, 'Categoría actualizada');
  } catch (error) {
    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({
        error: true,
        message: 'Categoría no encontrada',
        statusCode: 404,
      });
    }

    await category.destroy();
    return success(res, null, 'Categoría eliminada');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
