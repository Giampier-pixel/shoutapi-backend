const sequelize = require('../config/database');
const User = require('./user.model');
const Category = require('./category.model');
const Product = require('./product.model');
const CartItem = require('./cart-item.model');
const Order = require('./order.model');
const OrderItem = require('./order-item.model');

Category.hasMany(Product, {
  foreignKey: 'category_id',
  as: 'products',
});
Product.belongsTo(Category, {
  foreignKey: 'category_id',
  as: 'category',
});

User.hasMany(CartItem, {
  foreignKey: 'user_id',
  as: 'cartItems',
});
CartItem.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user',
});

Product.hasMany(CartItem, {
  foreignKey: 'product_id',
  as: 'cartItems',
});
CartItem.belongsTo(Product, {
  foreignKey: 'product_id',
  as: 'product',
});

User.hasMany(Order, {
  foreignKey: 'user_id',
  as: 'orders',
});
Order.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user',
});

Order.hasMany(OrderItem, {
  foreignKey: 'order_id',
  as: 'items',
});
OrderItem.belongsTo(Order, {
  foreignKey: 'order_id',
  as: 'order',
});

Product.hasMany(OrderItem, {
  foreignKey: 'product_id',
  as: 'orderItems',
});
OrderItem.belongsTo(Product, {
  foreignKey: 'product_id',
  as: 'product',
});

module.exports = {
  sequelize,
  User,
  Category,
  Product,
  CartItem,
  Order,
  OrderItem,
};
