# E-commerce Monorepo (React + Express + PostgreSQL)

Full-stack e-commerce app with products, variants, cart, checkout, Stripe and PayPal payments, JWT auth, admin panel, migrations and seed, tests, and Tailwind UI.

## Stack
- Frontend: React + Vite + TailwindCSS + React Router
- Backend: Node.js + Express + Sequelize (PostgreSQL)
- Payments: Stripe Checkout + Webhooks, PayPal Checkout + Webhooks/Capture
- Auth: JWT + bcrypt
- Validation: Joi
- Security: Helmet, CORS, Rate limiting
- Tests: Jest + Supertest

## Monorepo Layout
```
/ (root)
  backend/
  frontend/
  package.json (workspaces)
  docker-compose.yml
  README.md
```

## Prerequisites
- Node 18+
- PostgreSQL 14+ (or Docker)
- Stripe test account
- PayPal sandbox account

## Environment Variables
Backend `backend/.env` (copy from `.env.example`):
```
DATABASE_URL=postgres://postgres:postgres@localhost:5432/ecommerce
JWT_SECRET=changeme
STRIPE_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_SECRET=your_paypal_secret
FRONTEND_ORIGIN=http://localhost:5173
PORT=4000
```

Frontend `frontend/.env` (copy from `.env.example`):
```
VITE_API_URL=http://localhost:4000
VITE_STRIPE_PUBLIC_KEY=pk_test_xxx
VITE_PAYPAL_CLIENT_ID=your_paypal_client_id
```

## Install
```
npm install
```
This installs root and workspace dev deps. Then install workspace deps:
```
(cd backend && npm install)
(cd frontend && npm install)
```

## Database
- Local Postgres: create database `ecommerce` and set `DATABASE_URL` accordingly
- Or Docker: `docker compose up -d db`

Run migration and seed:
```
npm run migrate
npm run seed
```

## Development
Run backend and frontend together:
```
npm run dev
```
- Backend: http://localhost:4000
- Frontend: http://localhost:5173

## Payments
### Stripe
- Get test keys from Stripe Dashboard (Developers -> API keys)
- Use `STRIPE_KEY` (secret) on backend and `VITE_STRIPE_PUBLIC_KEY` on frontend
- Webhook: create an endpoint at `http://localhost:4000/api/webhooks/stripe`
- Test with ngrok:
```
ngrok http 4000
stripe listen --forward-to https://<ngrok-id>.ngrok.io/api/webhooks/stripe
```
- Events: `checkout.session.completed` used to mark order as paid and set status

### PayPal
- Create Sandbox app to get `PAYPAL_CLIENT_ID` and `PAYPAL_SECRET`
- Frontend loads PayPal JS SDK with `client-id`
- Backend creates orders at `/api/checkout/paypal/create-order`
- On approval, frontend calls backend capture or webhook handles it at `/api/webhooks/paypal`

## Testing
```
npm test
```
This runs backend Jest tests (auth and products).

## Production
- Build frontend:
```
npm run build
```
- Start backend:
```
npm start
```

### Docker (optional)
```
docker compose up -d
```

## Deployment
- Frontend (Vercel):
  - Framework: Vite
  - Env vars: `VITE_API_URL`, `VITE_STRIPE_PUBLIC_KEY`, `VITE_PAYPAL_CLIENT_ID`
- Backend (Railway/Render):
  - Set `DATABASE_URL`, `JWT_SECRET`, `STRIPE_KEY`, `STRIPE_WEBHOOK_SECRET`, `PAYPAL_CLIENT_ID`, `PAYPAL_SECRET`, `FRONTEND_ORIGIN`, `PORT`
  - Provision PostgreSQL
  - Run `npm run migrate` and `npm run seed` once
  - Configure Stripe/PayPal webhooks to the public URLs

## Admin
- Access `/admin` on frontend (requires a JWT of an admin user). Seed makes the first user admin if you register then promote via DB, or modify seed to create an admin.

## Notes
- Never commit `.env` files or secrets. Use `.env.example` to share required keys.
- The backend validates payloads with Joi and rate limits sensitive routes.
- Orders are created at checkout and updated to `paid` on webhooks.