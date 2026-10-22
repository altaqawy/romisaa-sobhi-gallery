# Romisaa Sobhi Gallery — V5 Atelier Desk Preview

**22 October 2026 — Static, browser-local operations demo (NOT a backend).**

## What shipped
- New route: [atelier-desk.html](../atelier-desk.html).
- New isolated, responsive styles: \`assets/v5-desk.css\`.
- New progressive JavaScript module: \`assets/v5-desk.js\`, loaded only on the desk page.
- Product draft sheet: 18 user-photo-based catalogue entries, category filter and search, locally editable proposed prices, review statuses.
- Fictional workflow board: five \`DEMO-...\` sample orders move manually between five sample work stages. No customer names or contacts stored.
- Quotation simulator: quantity, proposed customization fee, proposed shipping fee and optional non-PII notes; copy estimate to clipboard.
- Local export: JSON snapshot of price drafts and fictional demo orders for later manual review; no upload to any server.
- Full local reset; dark-wine / ivory / champagne Framer-inspired editorial composition, responsive to mobile.
- Static product page accessibility: visible loading h1 before runtime product render.
- New lint workflow and dependency-free asset validation script.

## Trust boundary: important
- The page is PUBLIC and not an admin-authentication system. Its \`robots=noindex\` is not access control.
- Browser \`localStorage\` is not a remote database and is scoped to the device/browser. Data never updates storefront prices.
- Demo quotations are NOT approved price offers or invoices.
- Sample orders are fictional and are never synchronized with checkout.
- No payment callback, balance, inventory update, identity verification, message send or production order creation is implemented.
- The public demo should not be used to capture personal customer data.
- Once a real backend is built, the preview desk must be replaced with a genuinely authenticated admin interface and protected order APIs.

## Verification actually observed
- GitHub connector confirmed the new source files exist on \`main\` and can be read.
- Direct structured repository check: 16 HTML pages, 34 files in \`assets\`, with **zero missing local href/src targets**.
- The only static h1 deficiency (JS-loaded product page) was corrected.
- GitHub Actions **Static website quality** returned \`failure\` with zero steps in the job; the automated workflow did not complete, and no claim of successful CI is made.
- Browser/mobile E2E behavior was not verified in an automated browser during this delivery. Manual review is required.

## Next engineering gate — production V5
1. Receive seller approval, confirmed catalogue pricing, actual processing time, shipping policy, photo use permission, and support information.
2. Stand up private staging database and role-authenticated application server (e.g. Next.js + PostgreSQL with RLS). Protect staff sign-in with MFA.
3. Move product management, workflows and quotes server-side; store customer data only with a privacy policy and least-privilege permissions.
4. Recalculate every invoice server-side; integrate Egyptian payment gateway for cards/wallets with signed verified webhooks. Instapay needs independent receipt reconciliation.
5. Run end-to-end tests for authorization, incorrect totals, declined payments, order transitions, accessibility, performance, export/backups.
6. Do not enable real shopping/checkout before legal terms, delivery and refund policies, payment credentials and merchant permissions are in place.

See [V5_ARCHITECTURE.md](V5_ARCHITECTURE.md) and [V5_SCHEMA_REFERENCE.sql](V5_SCHEMA_REFERENCE.sql).
