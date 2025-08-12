const { Router } = require('express');
const { auth } = require('../middleware/auth');
const { Order, OrderItem, ProductVariant, Product } = require('../models');

const router = Router();
router.use(auth);

router.get('/', async (req, res, next) => {
  try {
    const orders = await Order.findAll({
      where: { userId: req.user.id },
      include: [{ model: OrderItem, as: 'items', include: [{ model: ProductVariant, as: 'variant', include: [{ model: Product, as: 'product' }] }] }],
      order: [['id', 'DESC']],
    });
    res.json(orders);
  } catch (e) { next(e); }
});

module.exports = router;