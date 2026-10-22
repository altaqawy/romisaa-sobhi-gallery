# Romisaa Sobhi Gallery — V5 architecture / PRODUCTION BACKEND NOT DEPLOYED

## New V5 local-only preview
- `atelier-desk.html` now demonstrates a product draft editor, fictional order-state board, quotation estimator and local JSON export.
- This page is publicly accessible and is **not** a secure administrator console. Every change is kept in one browser via `localStorage`; public prices and other visitors are unaffected.
- See `RELEASE_V5_DESK.md` for validation and the exact boundary between demo and real production.

## Current state
- GitHub Pages: public static DEMO ONLY; V4.2 immersive lookbook, V4.3 gift finder + bespoke set builder, V5.1 embroidery visual laboratory.
- Product prices in `assets/catalog.js` are fictional placeholders, not quotations.
- Existing checkout stores a DEMO summary in this browser's session; it creates NO real order and processes NO payment.
- `studio.html` approval button is a visual demonstration, not an approval of any actual design.

## Production architecture (proposed)
- Web: Next.js with server-side API routes (migrate from static HTML only when approved).
- Database + auth: PostgreSQL with customer identity and RLS (possible provider: Supabase), managed secret credentials.
- Payments: approved Egyptian provider for card/wallet payments. Instapay manual reference/IPA + merchant-side verification only; never claim success from a screenshot.
- Storage: private buckets for drafts, artwork, and customer gifts; signed, expiring links, never public-by-default.
- Hosting: secure platform with HTTPS and API secrets stored server-side (GitHub Pages cannot do this).

## Proposed MVP routes
- `GET /api/products` — approved/active products and **real** public prices only.
- `POST /api/custom-requests` — authenticated customer; validation, anti-spam, rate-limiting.
- `POST /api/orders` — server recalculates prices, shipping, and discount; no trust in client totals.
- `POST /api/payments/checkout` — only server creates a provider payment session.
- `POST /api/payments/webhook` — signature and replay verification, idempotent updates; never store card data.
- `GET /api/me/orders` — customer's own orders only.
- `POST /api/designs/:id/decision` — approve/reject **one specific version** with audit log.
- `POST /api/admin/products` — staff role verified by server.
- `GET /api/admin/orders` — staff role verified, limited customer PII.

## State machines
Order: DRAFT → PRICE_CONFIRMED → AWAITING_PAYMENT → PAID → IN_PRODUCTION → READY_TO_SHIP → SHIPPED → DELIVERED.
Additional: CANCELLED, REFUNDED; enforce allowed transitions server-side.
Design: PROPOSED → CUSTOMER_CHANGES_REQUESTED | APPROVED → SUPERSEDED.
A submitted revision invalidates earlier approval; require explicit consent to new version.

## Still needed from Romisaa before production
- Permission to publish, authorized brand images and copy.
- Final product prices, stock and processing time, shipping regions/costs, refund/return terms and custom-order policy.
- Official payment settlement accounts (Instapay IPA / Vodafone Cash / merchant gateway); never request card details in chat.
- Official WhatsApp/contact number and preferred customer support flow.
- Verified business identity, responsible administrator and access policy.
- Real academy materials, tuition/prices, entitlement rules, and copyright permission.

## Deployment checklist
- [ ] Create new backend with production database and private env secrets.
- [ ] Set migration, RLS, rate limits and robust backups.
- [ ] End-to-end test (including payment webhooks, failed payments, refunds and shipping).
- [ ] Privacy notice / terms and security review.
- [ ] Replace placeholder prices and remove demo checkout before accepting real orders.
- [ ] Separate staging and production, protect admin with MFA.
