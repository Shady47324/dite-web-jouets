module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    status: { type: DataTypes.ENUM('pending', 'paid', 'failed', 'shipped'), allowNull: false, defaultValue: 'pending' },
    currency: { type: DataTypes.STRING, allowNull: false, defaultValue: 'usd' },
    totalAmount: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 }, // in cents
    paymentProvider: { type: DataTypes.ENUM('stripe', 'paypal'), allowNull: true },
    paymentReference: { type: DataTypes.STRING, allowNull: true }, // stripe session id / paypal order id
    shippingAddress: { type: DataTypes.JSONB, allowNull: true },
  }, {
    tableName: 'orders',
    timestamps: true,
  });
  return Order;
};