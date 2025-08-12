const { Router } = require('express');
const Joi = require('joi');
const { auth, adminOnly } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { Order } = require('../models');

const router = Router();
router.use(auth, adminOnly);

router.get('/', async (req, res, next) => {
  try {
    const orders = await Order.findAll({ order: [['id', 'DESC']] });
    res.json(orders);
  } catch (e) { next(e); }
});

const statusSchema = Joi.object({ status: Joi.string().valid('pending', 'paid', 'failed', 'shipped').required() });

router.put('/:id/status', validate(statusSchema), async (req, res, next) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ error: 'Not found' });
    order.status = req.body.status;
    await order.save();
    res.json(order);
  } catch (e) { next(e); }
});

module.exports = router;