require('dotenv').config();
const app = require('./server');
const { sequelize } = require('./models');

const port = process.env.PORT || 4000;

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established');
    app.listen(port, () => console.log(`API listening on http://localhost:${port}`));
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
})();