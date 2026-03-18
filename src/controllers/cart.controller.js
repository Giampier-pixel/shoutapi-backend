const { CartItem, Product } = require('../models');
const { success } = require('../utils/response');

const getCart = async (req, res, next) => {
  try {
    const items = await CartItem.findAll({
      where: { user_id: req.user.id },
      include: [
        {
          model: Product,
          as: 'product',
          attributes: [
            'id', 'name', 'price', 'stock',
            'image_url', 'is_active',
          ],
        },
      ],
      order: [['created_at', 'DESC']],
    });

    return success(res, items, 'Carrito obtenido');
  } catch (error) {
    next(error);
  }
};

const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;

    const product = await Product.findByPk(productId);
    if (!product || !product.is_active) {
      return res.status(404).json({
        error: true,
        message: 'Producto no encontrado o inactivo',
        statusCode: 404,
      });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        error: true,
        message: `Stock insuficiente. Disponible: ${product.stock}`,
        statusCode: 400,
      });
    }

    const existing = await CartItem.findOne({
      where: {
        user_id: req.user.id,
        product_id: productId,
      },
    });

    if (existing) {
      const newQty = existing.quantity + quantity;
      if (newQty > product.stock) {
        return res.status(400).json({
          error: true,
          message:
            `Stock insuficiente. Disponible: ${product.stock}`,
          statusCode: 400,
        });
      }
      await existing.update({ quantity: newQty });
      return success(res, existing, 'Cantidad actualizada');
    }

    const item = await CartItem.create({
      user_id: req.user.id,
      product_id: productId,
      quantity,
    });

    return success(res, item, 'Producto agregado al carrito', 201);
  } catch (error) {
    next(error);
  }
};

const updateCartItem = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    const item = await CartItem.findOne({
      where: {
        user_id: req.user.id,
        product_id: productId,
      },
    });

    if (!item) {
      return res.status(404).json({
        error: true,
        message: 'Producto no encontrado en el carrito',
        statusCode: 404,
      });
    }

    const product = await Product.findByPk(productId);
    if (quantity > product.stock) {
      return res.status(400).json({
        error: true,
        message:
          `Stock insuficiente. Disponible: ${product.stock}`,
        statusCode: 400,
      });
    }

    await item.update({ quantity });
    return success(res, item, 'Cantidad actualizada');
  } catch (error) {
    next(error);
  }
};

const removeCartItem = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const item = await CartItem.findOne({
      where: {
        user_id: req.user.id,
        product_id: productId,
      },
    });

    if (!item) {
      return res.status(404).json({
        error: true,
        message: 'Producto no encontrado en el carrito',
        statusCode: 404,
      });
    }

    await item.destroy();
    return success(res, null, 'Producto removido del carrito');
  } catch (error) {
    next(error);
  }
};

const clearCart = async (req, res, next) => {
  try {
    await CartItem.destroy({
      where: { user_id: req.user.id },
    });
    return success(res, null, 'Carrito vaciado');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
};
