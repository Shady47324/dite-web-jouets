require('dotenv').config();
const { sequelize, Product, ProductVariant } = require('../src/models');

(async () => {
  try {
    await sequelize.sync();

    // Create 5 products with variants
    const samples = [
      { name: 'T-Shirt Classic', description: 'Soft cotton tee', images: [], variants: [
        { sku: 'TS-CL-S', price: 1999, stock: 50, options: { size: 'S', color: 'Black' } },
        { sku: 'TS-CL-M', price: 1999, stock: 60, options: { size: 'M', color: 'Black' } },
      ]},
      { name: 'Hoodie', description: 'Cozy hoodie', images: [], variants: [
        { sku: 'HD-BK-M', price: 3999, stock: 40, options: { size: 'M', color: 'Black' } },
      ]},
      { name: 'Sneakers', description: 'Comfy sneakers', images: [], variants: [
        { sku: 'SN-WH-42', price: 6999, stock: 20, options: { size: '42', color: 'White' } },
      ]},
      { name: 'Cap', description: 'Stylish cap', images: [], variants: [
        { sku: 'CP-RD-1', price: 1499, stock: 80, options: { size: 'One Size', color: 'Red' } },
      ]},
      { name: 'Backpack', description: 'Everyday backpack', images: [], variants: [
        { sku: 'BP-GR-20', price: 4999, stock: 30, options: { capacity: '20L', color: 'Gray' } },
      ]},
    ];

    for (const p of samples) {
      const product = await Product.create({ name: p.name, description: p.description, images: p.images, isActive: true });
      for (const v of p.variants) {
        await ProductVariant.create({ ...v, productId: product.id });
      }
    }

    console.log('Seed completed');
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();