const { sequelize } = require('../config/database');
const { DataTypes } = require('sequelize');

const User = require('./user')(sequelize, DataTypes);
const Product = require('./product')(sequelize, DataTypes);
const ProductVariant = require('./productVariant')(sequelize, DataTypes);
const CartItem = require('./cartItem')(sequelize, DataTypes);
const Order = require('./order')(sequelize, DataTypes);
const OrderItem = require('./orderItem')(sequelize, DataTypes);

// Associations
Product.hasMany(ProductVariant, { foreignKey: 'productId', as: 'variants', onDelete: 'CASCADE' });
ProductVariant.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

User.hasMany(CartItem, { foreignKey: 'userId', as: 'cartItems', onDelete: 'CASCADE' });
CartItem.belongsTo(User, { foreignKey: 'userId', as: 'user' });
CartItem.belongsTo(ProductVariant, { foreignKey: 'productVariantId', as: 'variant' });

User.hasMany(Order, { foreignKey: 'userId', as: 'orders' });
Order.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'items', onDelete: 'CASCADE' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });
OrderItem.belongsTo(ProductVariant, { foreignKey: 'productVariantId', as: 'variant' });

module.exports = {
  sequelize,
  User,
  Product,
  ProductVariant,
  CartItem,
  Order,
  OrderItem,
};