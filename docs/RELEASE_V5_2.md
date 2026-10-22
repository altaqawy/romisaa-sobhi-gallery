# V5.2 — Versioned Design Review Studio (22 October 2026)

## What was added
- [Design Review Studio](../design-review.html) is a distinct Arabic RTL page based on the site's ivory, rose and champagne editorial direction.
- Real images from the provided sample catalogue are used only as illustrative product reference; filtered comparison images are **not** actual historical design versions.
- Three **fictional** sample orders with local-only status, separate from store checkout and previous Atelier Desk examples.
- Version-aware interactive transitions:
  - PROPOSED → APPROVED or CHANGES_REQUESTED
  - PROPOSED / CHANGES_REQUESTED / APPROVED → NEW REVISION (which resets approval to PROPOSED)
  - APPROVED → PRODUCTION → READY
  - No production before approval; no revision after production starts.
- Requires a descriptive change-request note; limits text length and validates version state when rehydrating saved data.
- Fictional event history (bounded), copyable sample summary and explicit local reset.
- Entry points from [Set Builder](../studio.html) and [Atelier Desk](../atelier-desk.html).
- Independent core logic in \`assets/v5-review-core.js\`, UI in \`assets/v5-review.js\`, isolated styling in \`assets/v5-review.css\`.
- Node regression tests in \`tests/review-flow.test.cjs\`, wired into the supplemental \`Static website quality\` workflow.

## Critical limits
- PUBLIC STATIC DEMO ONLY. \`noindex\` is not a security barrier.
- No identity, signed design assets, upload, transactional order ID, authorization, email, WhatsApp, backend, payment, or server-side approval.
- An on-screen approval has **no real legal or commercial effect**; all events are fictional samples in browser \`localStorage\`.
- Never use this public page for names, phones, personal photos, addresses or other private customer content.
- Original product photography is displayed as art reference; not as evidence of a real before/after revision.
- Production needs customer and admin authentication, server-authoritative version IDs, signed private artwork access, immutable timestamped audit events, replay protection, RLS, controlled revisions, and explicit publication agreement with the merchant.

## Validation and known gaps
- Source and assets committed to \`main\`.
- Pure review state model was tested in 9 distinct cases through direct execution; all nine passed.
- A persistent 13-case Node regression suite was added to the repo. Do not claim GitHub Actions passed unless a workflow run reports success.
- Full mobile/browser E2E, keyboard and accessibility review, and actual seller testing are still pending.
- Existing site's payment and order screens remain demo-only and unaffected.

## Next production gate
1. Confirm merchant requirements: exact order states, alteration limits, revision turnaround and what constitutes acceptance.
2. Complete role-protected staging backend with RLS, private artwork storage, audit trail, and encryption for customer PII.
3. Make design approval action verify a customer session and an exact current design version; a revision must supersede old approval atomically.
4. Add tests for concurrent approvals/revisions, invalid permissions, stale sessions, revoked access, replay, and moderation.
5. Only after approved catalog pricing and merchant payment onboarding, enable real orders/payment webhook settlement.
