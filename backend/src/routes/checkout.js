const { Router } = require('express');
const Joi = require('joi');
const Stripe = require('stripe');
const paypal = require('@paypal/checkout-server-sdk');
const { auth } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { CartItem, ProductVariant, Product, Order, OrderItem } = require('../models');

const router = Router();

const stripe = new Stripe(process.env.STRIPE_KEY || '', { apiVersion: '2024-06-20' });

const payPalEnv = () => new paypal.core.SandboxEnvironment(
  process.env.PAYPAL_CLIENT_ID || '',
  process.env.PAYPAL_SECRET || ''
);
const payPalClient = () => new paypal.core.PayPalHttpClient(payPalEnv());

router.use(auth);

async function getCartWithTotals(userId) {
  const items = await CartItem.findAll({
    where: { userId },
    include: [{ model: ProductVariant, as: 'variant', include: [{ model: Product, as: 'product' }] }],
  });
  const total = items.reduce((sum, i) => sum + i.variant.price * i.quantity, 0);
  return { items, total };
}

async function createOrderItems(order, items) {
  for (const i of items) {
    await OrderItem.create({
      orderId: order.id,
      productVariantId: i.productVariantId,
      quantity: i.quantity,
      unitPrice: i.variant.price,
    });
  }
}

async function clearCart(userId) {
  await CartItem.destroy({ where: { userId } });
}

// Stripe Checkout
router.post('/create-session', async (req, res, next) => {
  try {
    const { items, total } = await getCartWithTotals(req.user.id);
    if (items.length === 0) return res.status(400).json({ error: 'Cart empty' });

    const lineItems = items.map((ci) => ({
      price_data: {
        currency: 'usd',
        unit_amount: ci.variant.price,
        product_data: { name: `${ci.variant.product.name} ${ci.variant.sku}`, images: ci.variant.product.images },
      },
      quantity: ci.quantity,
    }));

    const order = await Order.create({ userId: req.user.id, status: 'pending', currency: 'usd', totalAmount: total, paymentProvider: 'stripe' });
    await createOrderItems(order, items);

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      success_url: `${process.env.FRONTEND_ORIGIN}/order-confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_ORIGIN}/cart`,
      metadata: { orderId: String(order.id) },
    });

    order.paymentReference = session.id;
    await order.save();

    await clearCart(req.user.id);

    res.json({ url: session.url });
  } catch (e) { next(e); }
});

// PayPal create order
router.post('/paypal/create-order', async (req, res, next) => {
  try {
    const { items, total } = await getCartWithTotals(req.user.id);
    if (items.length === 0) return res.status(400).json({ error: 'Cart empty' });

    const order = await Order.create({ userId: req.user.id, status: 'pending', currency: 'USD', totalAmount: total, paymentProvider: 'paypal' });
    await createOrderItems(order, items);

    const request = new paypal.orders.OrdersCreateRequest();
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [{ amount: { currency_code: 'USD', value: (total / 100).toFixed(2) } }],
      application_context: {
        return_url: `${process.env.FRONTEND_ORIGIN}/order-confirmation`,
        cancel_url: `${process.env.FRONTEND_ORIGIN}/cart`,
      }
    });
    const response = await payPalClient().execute(request);
    order.paymentReference = response.result.id;
    await order.save();

    await clearCart(req.user.id);

    res.json({ id: response.result.id });
  } catch (e) { next(e); }
});

// PayPal capture order after approval (fallback to server capture)
const captureSchema = Joi.object({ orderId: Joi.string().required() });
router.post('/paypal/capture', validate(captureSchema), async (req, res, next) => {
  try {
    const request = new paypal.orders.OrdersCaptureRequest(req.body.orderId);
    request.requestBody({});
    const response = await payPalClient().execute(request);
    if (response.result.status === 'COMPLETED') {
      const orderId = response.result.id;
      const order = await Order.findOne({ where: { paymentProvider: 'paypal', paymentReference: orderId } });
      if (order) {
        order.status = 'paid';
        await order.save();
      }
      res.json({ success: true });
    } else {
      res.status(400).json({ error: 'Capture failed' });
    }
  } catch (e) { next(e); }
});

module.exports = router;