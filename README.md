# Romisaa Sobhi Gallery — The Living Atelier (V6 preview)

> **Public design demo, not a transactional store.** Prices, stock and payment methods are placeholders. No real order or payment processing is enabled.

### Current interactive experiences
- **New V6.1:** [Immersive Gallery](gallery.html) — 18 original photographs, responsive Editorial / Horizontal / Detail modes, filters, fullscreen lightbox, touch/mouse navigation and reduced-motion support. AI-generated concept products are excluded from the real-work gallery. [Release notes](docs/RELEASE_V6_1.md).

- **New V5.4:** [Gift Message Studio](gift-card.html) — three live card designs, private local message preview, A5 print/PDF and SVG export. No cloud message storage or hosted personalized QR. [Release notes](docs/RELEASE_V5_4.md).
- [Home](index.html), [Shop](shop.html), [Interactive Lookbook](lookbook.html), [Set Builder](studio.html), [Gift Finder](finder.html), [Stitch Lab](learn.html), [Wishlist](wishlist.html).
- **New V5.3:** [Gift Date Planner — illustration of event lead times](delivery-planner.html). Uses visitor-entered assumed durations, never guarantees seller capacity or shipping. See [V5.3 report](docs/RELEASE_V5_3.md).
- **New V5.2:** [Design Review Studio — fictional versioned approvals](design-review.html). Revision requests and approvals are simulated locally; a newer version invalidates earlier approval. See [delivery report](docs/RELEASE_V5_2.md).
- **New:** [Atelier Desk — local operations simulator](atelier-desk.html). Catalogue draft editing, fictional order stages, a quote calculator and JSON export. This is a public, unauthenticated browser-only demo; changes are **not** visible to customers and are **not** sent to a server.
- [V5 implementation report](docs/RELEASE_V5_DESK.md) · [Production architecture](docs/V5_ARCHITECTURE.md) · [Database reference (not deployed)](docs/V5_SCHEMA_REFERENCE.sql).
- GitHub Pages publishes the static site. Real administration, payments and customer accounts require a secure backend and merchant credentials.

---

# Romisaa Sobhi Gallery — Editorial Atelier V3

**An original multipage Arabic RTL interactive website concept** by Rawnak Agency. V3 builds on the V2 demo without removing pages, catalog, shopping cart, custom request form or payment-method presentation.

## Pages

- `index.html` — new editorial homepage and scroll-driven portal
- `shop.html` — searchable and filterable shop, 18 demonstration listings
- `product.html?id=...` — product detail and personalization
- `cart.html` — persistent client-side cart
- `checkout.html` — checkout demonstration with InstaPay, Vodafone Cash and Visa/Mastercard **options only**
- `order.html` — local receipt preview
- `custom.html` — personalized order brief
- `about.html` — story
- `academy.html` — embroidery learning
- `contact.html` — links and FAQs

## Design system

The site's **visual direction** takes inspiration exclusively from published designs in Framer's official marketplace, particularly Clariel, Orlea, and LÉORA: editorial product photography, warm neutrals, generous spacing, strong type hierarchy and carefully paced scrolling. This project is an original implementation, **not a copied or licensed Framer template**.

- Colors: parchment `#f8f4ed`, soft blush `#e6d2c9`, warm plum `#503542`, dusty mauve `#b68889`, ink `#3c3234`.
- Responsive RTL, 320px+.
- Product photographs supplied by the client in this conversation; all current labels/prices must be verified by the owner before public use.

## Motion effects (original custom implementations)

- **Scroll Portal–style** nested product-image frames controlled by reading scroll progress on a sticky runway.
- **Scroll Reveal–style** entrances via IntersectionObserver.
- **Magnetic button–style** subtle pointer-follow interaction.
- **Depth / parallax–style** hover and product-photo drift.
- Animated editorial tape / marquee and native cross-document View Transitions as progressive enhancement.

These are original CSS/JS implementations inspired by the categories of motion found in React Bits / Rawnak Tools. They do **not** bundle React Bits Pro licensed source code and are **not** source-level imports of React Bits components. `prefers-reduced-motion` is supported; most expensive pointer effects are disabled on touch screens.

## Local preview

Extract the ZIP and open `index.html` in a browser. For full browser feature support, use a static server, for example `python -m http.server 8000` in the extracted folder. The site requires no npm installation. Font styles load from Google Fonts when online; fallbacks work offline.

## Important: checkout is not live

All prices are **illustrative** and unverified. InstaPay and Vodafone Cash do not expose real payment recipient details here; card payment does not collect card details. No payments are taken, no orders are sent to the seller and no merchant account is integrated. A production store requires product/price confirmation, merchant payment integration and server-side order storage, security, reconciliation and webhooks.

## Manual QA checklist

1. Run homepage and scroll through the portal, using mouse and touch.
2. Test shop filters/search; add items to cart; change quantities; reload and check persistence.
3. From checkout choose all three payment options; verify informational help does not misrepresent payment as completed.
4. Review responsive screens at 320, 390, 768, 1024 and 1440 px.
5. Toggle system reduced motion: no scroll-pinned runway, no continuous ticker.
6. Have the owner approve all content, photos, product names, actual prices and payment details before going live.

## Implementation files

- `assets/site.js`, `assets/site.css`, `assets/catalog.js`: preserved V2 store behavior and base styles.
- `assets/v3.css`: original editorial V3 design tokens, typography, layouts and adaptive motion.
- `assets/motion.js`: original scroll and pointer animation engine.