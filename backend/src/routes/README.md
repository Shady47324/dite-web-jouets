# Routes

- auth: /api/auth/register, /api/auth/login
- products: /api/products, /api/products/:id
- admin products: /api/admin/products (POST/PUT/DELETE)
- cart: /api/cart
- checkout: /api/checkout/create-session (Stripe), /api/checkout/paypal/create-order, /api/checkout/paypal/capture
- webhooks: /api/webhooks/stripe, /api/webhooks/paypal
- orders: /api/orders
- admin orders: /api/admin/orders, /api/admin/orders/:id/status