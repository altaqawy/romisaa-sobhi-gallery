# Romisaa V5.4 — Gift Message Studio

Delivery date: 22 October 2026. Status: public static design demo.

## New experience
- \`gift-card.html\`: a live personal gift-card editor with Arabic RTL layout, three luxury themes (Pearl Letter, Blush Garden, Midnight Keepsake).
- Message, recipient, sender, and occasion update a card preview as visitors type.
- \`window.print()\` produces an A5 portrait print stylesheet; visitors can select “Save as PDF” from their browser's print dialog. Print layout varies by browser/printer; print-preview confirmation recommended.
- Client-side SVG export: a self-contained 700×970 SVG assembled from escaped text and whitelisted theme assets, downloaded only to the visitor's device.
- Clipboard export of card message.
- No external font embedding or remote conversion service.
- 13 regression cases in \`tests/gift-card.test.cjs\` cover whitelist validation, message limits, safe SVG escaping, and preserving long message wrapping.
- Site links added to Home experiential gallery, Gift Finder, Wedding Set Builder, Custom Request and Demo Receipt.

## Privacy and safety
- No customer identity, analytics, account, order or payment APIs are used by the editor.
- Message contents are neither stored in browser localStorage nor transmitted to a server.
- Downloaded card files contain visitor-entered messages and should be shared only intentionally.
- A hosted private digital memory card / personalized QR is **not implemented**. It would require authenticated owner authorization, private storage, expiring access control and a privacy policy.
- This card editor is not a checkout completion and does not place an order.

## Verification
- Code is uploaded to \`main\` with HTML, separate CSS, pure model and UI script.
- The pure JavaScript model passed ten directly executed checks and a small mocked-DOM startup test confirmed theme switching and print-handler behavior.
- GitHub Actions has previously failed before starting job steps; do not treat CI status as a successful browser end-to-end test unless confirmed separately.
- Independently verify live Pages deployment and test print on actual mobile + desktop browser.
- Verify brand ownership and final merchandise policies with the gallery before public commercial launch.

## Next production stage
Authenticated backend and customer order tracking; formal product prices; merchant-provided delivery and payment methods. A private QR-gift page is a separate privacy/security workstream and should not use an unprotected public URL containing a personalized message.
