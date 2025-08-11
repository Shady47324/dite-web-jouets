const request = require('supertest');
require('dotenv').config();
const app = require('../src/server');
const { sequelize, User } = require('../src/models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

test('register and login', async () => {
  const reg = await request(app).post('/api/auth/register').send({ name: 'Alice', email: 'alice@example.com', password: 'secret123' });
  expect(reg.status).toBe(201);
  expect(reg.body.token).toBeTruthy();

  const login = await request(app).post('/api/auth/login').send({ email: 'alice@example.com', password: 'secret123' });
  expect(login.status).toBe(200);
  expect(login.body.token).toBeTruthy();
});