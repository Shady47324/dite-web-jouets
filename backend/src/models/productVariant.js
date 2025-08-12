module.exports = (sequelize, DataTypes) => {
  const ProductVariant = sequelize.define('ProductVariant', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    productId: { type: DataTypes.INTEGER, allowNull: false },
    sku: { type: DataTypes.STRING, allowNull: false, unique: true },
    price: { type: DataTypes.INTEGER, allowNull: false }, // in cents
    stock: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    options: { type: DataTypes.JSONB, allowNull: true }, // e.g., { size: 'M', color: 'Red' }
  }, {
    tableName: 'product_variants',
    timestamps: true,
    indexes: [{ unique: true, fields: ['sku'] }]
  });
  return ProductVariant;
};