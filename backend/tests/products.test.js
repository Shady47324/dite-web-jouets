const request = require('supertest');
require('dotenv').config();
const app = require('../src/server');
const { sequelize, Product, ProductVariant } = require('../src/models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
  const p = await Product.create({ name: 'Test Product', description: 'Desc', images: [], isActive: true });
  await ProductVariant.create({ productId: p.id, sku: 'SKU-1', price: 1000, stock: 10 });
});

afterAll(async () => {
  await sequelize.close();
});

test('list products', async () => {
  const res = await request(app).get('/api/products');
  expect(res.status).toBe(200);
  expect(Array.isArray(res.body)).toBe(true);
  expect(res.body.length).toBeGreaterThanOrEqual(1);
});