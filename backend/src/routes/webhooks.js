const { Router } = require('express');
const Stripe = require('stripe');
const { Order } = require('../models');

const router = Router();

// Stripe webhook requires raw body (handled at app level)
router.post('/stripe', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const stripe = new Stripe(process.env.STRIPE_KEY || '', { apiVersion: '2024-06-20' });
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const orderId = session.metadata?.orderId;
    if (orderId) {
      const order = await Order.findByPk(orderId);
      if (order) {
        order.status = 'paid';
        order.paymentReference = session.id;
        await order.save();
      }
    }
  }

  res.json({ received: true });
});

// PayPal webhook (basic verification omitted here; recommend verifying transmission)
router.post('/paypal', async (req, res) => {
  try {
    const event = req.body;
    if (event.event_type === 'PAYMENT.CAPTURE.COMPLETED') {
      const orderId = event.resource?.supplementary_data?.related_ids?.order_id || event.resource?.id;
      if (orderId) {
        const order = await Order.findOne({ where: { paymentProvider: 'paypal', paymentReference: orderId } });
        if (order) {
          order.status = 'paid';
          await order.save();
        }
      }
    }
    res.json({ received: true });
  } catch (e) {
    res.status(400).json({ error: 'Invalid payload' });
  }
});

module.exports = router;