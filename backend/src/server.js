const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const bodyParser = require('body-parser');
const { errorHandler } = require('./utils/error');
const routes = require('./routes');

const app = express();

const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';

app.set('trust proxy', 1);
app.use(helmet());
app.use(cors({ origin: FRONTEND_ORIGIN, credentials: true }));

// Raw body needed for Stripe webhook signature verification
app.use((req, res, next) => {
  if (req.originalUrl.startsWith('/api/webhooks/stripe')) {
    bodyParser.raw({ type: 'application/json' })(req, res, next);
  } else {
    express.json({ limit: '1mb' })(req, res, next);
  }
});

app.use(morgan('dev'));

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 50 });
app.use('/api/auth', authLimiter);

app.get('/api/health', (req, res) => res.json({ ok: true }));
app.use('/api', routes);

app.use(errorHandler);

module.exports = app;