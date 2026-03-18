const { Op } = require('sequelize');
const { Product, Category } = require('../models');
const { success, successWithMeta } = require('../utils/response');

const getProducts = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      search,
    } = req.query;

    const offset = (page - 1) * limit;
    const where = { is_active: 1 };

    if (category) {
      where.category_id = category;
    }

    if (search) {
      where.name = { [Op.like]: `%${search}%` };
    }

    const { count, rows } = await Product.findAndCountAll({
      where,
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name', 'slug'],
        },
      ],
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10),
      order: [['created_at', 'DESC']],
    });

    const totalPages = Math.ceil(count / limit);

    return successWithMeta(
      res,
      rows,
      {
        total: count,
        page: parseInt(page, 10),
        totalPages,
      },
      'Productos obtenidos'
    );
  } catch (error) {
    next(error);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name', 'slug'],
        },
      ],
    });

    if (!product) {
      return res.status(404).json({
        error: true,
        message: 'Producto no encontrado',
        statusCode: 404,
      });
    }

    return success(res, product, 'Producto obtenido');
  } catch (error) {
    next(error);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const {
      name, description, price, stock, category_id, image_url,
    } = req.body;

    const category = await Category.findByPk(category_id);
    if (!category) {
      return res.status(404).json({
        error: true,
        message: 'Categoría no encontrada',
        statusCode: 404,
      });
    }

    const product = await Product.create({
      name,
      description,
      price,
      stock: stock || 0,
      category_id,
      image_url,
    });

    return success(res, product, 'Producto creado', 201);
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({
        error: true,
        message: 'Producto no encontrado',
        statusCode: 404,
      });
    }

    const {
      name, description, price, stock, category_id, image_url,
    } = req.body;

    if (category_id) {
      const category = await Category.findByPk(category_id);
      if (!category) {
        return res.status(404).json({
          error: true,
          message: 'Categoría no encontrada',
          statusCode: 404,
        });
      }
    }

    await product.update({
      name,
      description,
      price,
      stock,
      category_id,
      image_url,
    });

    return success(res, product, 'Producto actualizado');
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({
        error: true,
        message: 'Producto no encontrado',
        statusCode: 404,
      });
    }

    await product.update({ is_active: 0 });
    return success(res, null, 'Producto desactivado');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
