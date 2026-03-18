const {
  sequelize,
  Order,
  OrderItem,
  CartItem,
  Product,
  User,
} = require('../models');
const { success, successWithMeta } = require('../utils/response');

const STATUS_FLOW = {
  pending: ['processing', 'cancelled'],
  processing: ['shipped', 'cancelled'],
  shipped: ['delivered'],
  delivered: [],
  cancelled: [],
};

const checkout = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const cartItems = await CartItem.findAll({
      where: { user_id: req.user.id },
      include: [
        {
          model: Product,
          as: 'product',
          attributes: [
            'id', 'name', 'price', 'stock', 'is_active',
          ],
        },
      ],
      transaction: t,
    });

    if (cartItems.length === 0) {
      await t.rollback();
      return res.status(400).json({
        error: true,
        message: 'El carrito está vacío',
        statusCode: 400,
      });
    }

    let total = 0;
    for (const item of cartItems) {
      if (!item.product.is_active) {
        await t.rollback();
        return res.status(400).json({
          error: true,
          message:
            `Producto "${item.product.name}" ya no está disponible`,
          statusCode: 400,
        });
      }
      if (item.product.stock < item.quantity) {
        await t.rollback();
        return res.status(400).json({
          error: true,
          message:
            `Stock insuficiente para "${item.product.name}". `
            + `Disponible: ${item.product.stock}`,
          statusCode: 400,
        });
      }
      total += item.product.price * item.quantity;
    }

    const order = await Order.create(
      { user_id: req.user.id, total, status: 'pending' },
      { transaction: t }
    );

    const orderItemsData = cartItems.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      unit_price: item.product.price,
    }));
    await OrderItem.bulkCreate(orderItemsData, {
      transaction: t,
    });

    for (const item of cartItems) {
      await Product.update(
        { stock: item.product.stock - item.quantity },
        { where: { id: item.product_id }, transaction: t }
      );
    }

    await CartItem.destroy({
      where: { user_id: req.user.id },
      transaction: t,
    });

    await t.commit();

    const fullOrder = await Order.findByPk(order.id, {
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [
            {
              model: Product,
              as: 'product',
              attributes: ['id', 'name', 'image_url'],
            },
          ],
        },
      ],
    });

    return success(res, fullOrder, 'Orden creada', 201);
  } catch (error) {
    await t.rollback();
    next(error);
  }
};

const getMyOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows } = await Order.findAndCountAll({
      where: { user_id: req.user.id },
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [
            {
              model: Product,
              as: 'product',
              attributes: ['id', 'name', 'image_url'],
            },
          ],
        },
      ],
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10),
      order: [['created_at', 'DESC']],
    });

    return successWithMeta(
      res,
      rows,
      {
        total: count,
        page: parseInt(page, 10),
        totalPages: Math.ceil(count / limit),
      },
      'Órdenes obtenidas'
    );
  } catch (error) {
    next(error);
  }
};

const getMyOrderById = async (req, res, next) => {
  try {
    const order = await Order.findOne({
      where: { id: req.params.id, user_id: req.user.id },
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [
            {
              model: Product,
              as: 'product',
              attributes: ['id', 'name', 'image_url'],
            },
          ],
        },
      ],
    });

    if (!order) {
      return res.status(404).json({
        error: true,
        message: 'Orden no encontrada',
        statusCode: 404,
      });
    }

    return success(res, order, 'Orden obtenida');
  } catch (error) {
    next(error);
  }
};

const getAllOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const offset = (page - 1) * limit;
    const where = {};

    if (status) {
      where.status = status;
    }

    const { count, rows } = await Order.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: OrderItem,
          as: 'items',
          include: [
            {
              model: Product,
              as: 'product',
              attributes: ['id', 'name'],
            },
          ],
        },
      ],
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10),
      order: [['created_at', 'DESC']],
    });

    return successWithMeta(
      res,
      rows,
      {
        total: count,
        page: parseInt(page, 10),
        totalPages: Math.ceil(count / limit),
      },
      'Órdenes obtenidas'
    );
  } catch (error) {
    next(error);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({
        error: true,
        message: 'Orden no encontrada',
        statusCode: 404,
      });
    }

    const { status } = req.body;
    const allowed = STATUS_FLOW[order.status];

    if (!allowed.includes(status)) {
      return res.status(400).json({
        error: true,
        message:
          `No se puede cambiar de "${order.status}" a "${status}". `
          + `Transiciones válidas: ${allowed.join(', ') || 'ninguna'}`,
        statusCode: 400,
      });
    }

    await order.update({ status });
    return success(res, order, 'Estado actualizado');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  checkout,
  getMyOrders,
  getMyOrderById,
  getAllOrders,
  updateOrderStatus,
};
