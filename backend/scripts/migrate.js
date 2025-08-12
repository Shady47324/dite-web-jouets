require('dotenv').config();
const { sequelize } = require('../src/models');

(async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log('Database synchronized');
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();