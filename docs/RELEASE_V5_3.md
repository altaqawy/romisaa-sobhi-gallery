# Romisaa V5.3 — Gift Date Planner (22 October 2026)

## Shipped
- New static demo route: [delivery-planner.html](../delivery-planner.html)
- Isolated styles/script in \`assets/v5-planner.css\` and \`assets/v5-planner.js\`.
- Editable start date, occasion date, product type, assumed production time, assumed shipping time, and safety buffer.
- Timeline is calculated with UTC **date-only arithmetic** to avoid DST and device-time-of-day changes.
- Shows illustrative ready date, occasion date, total assumed days and overrun/slack. Supports copying the assumed plan.
- No server calls, no personal identity fields, no orders, no purchase submission, no availability inquiry.
- Connected from Set Builder, Gift Finder and Checkout (without changing checkout or payment state).

## Non-negotiable disclosures
- The default durations (10 production + 3 shipping + 3 safety days) are fictional examples for demonstrating arithmetic, NOT merchant turnaround or courier SLAs.
- A green 'time fits' state is purely a comparison of **user-entered assumptions** and an event date. It does not represent availability, order acceptance, booking, merchant response or delivery guarantee.
- Customers must confirm feasibility with Romisaa via official contact channels.
- The calculator is public and is not connected to \`Atelier Desk\`, checkout, payment accounts or shipping services.

## Verified in this turn
- Nine direct computation checks passed including date rollovers, invalid dates, DST-safe date arithmetic and rejection of invalid durations.
- Added ten Node test assertions to \`tests/planner.test.cjs\`. Their CI pass status must be checked independently.
- GitHub Pages publication and independent browser/mobile testing should be verified after each final commit.

## Next production implementation
- Real per-product production lead times and caps configurable in an authenticated merchant admin.
- Shipping zones, carriers, cutoff times, non-working days, address validation and surcharge policy.
- Server-authoritative inventory and confirmed checkout promise once merchant explicitly accepts order.
- Customer notifications based on actual tracked statuses; no promises based solely on client-side estimates.
