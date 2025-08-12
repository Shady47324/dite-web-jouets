const { Router } = require('express');
const authRoutes = require('./auth');
const productRoutes = require('./products');
const adminProductRoutes = require('./products.admin');
const cartRoutes = require('./cart');
const checkoutRoutes = require('./checkout');
const webhookRoutes = require('./webhooks');
const orderRoutes = require('./orders');
const adminOrderRoutes = require('./orders.admin');

const router = Router();

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/admin/products', adminProductRoutes);
router.use('/cart', cartRoutes);
router.use('/checkout', checkoutRoutes);
router.use('/webhooks', webhookRoutes);
router.use('/orders', orderRoutes);
router.use('/admin/orders', adminOrderRoutes);

module.exports = router;