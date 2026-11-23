# BookConnect Premium — implementation status

## Price and scope
Proposed annual Premium price: **27 EUR/year**. The current UI is a **demo only**: it does not accept payments, activate subscriptions, or grant paid access.

## Implemented
- `premium.html`: informational Premium landing page, preserving the existing site's visual language.
- `reader.html` and `reader.js`: browser-side PDF reader for files chosen by the user, with navigation, zoom and local reading progress.
- The chosen PDF is not uploaded to BookConnect. The reading position is saved in browser localStorage.

## Before enabling real subscriptions
1. Implement Supabase Auth and profiles.
2. Store subscription status and expiry in PostgreSQL; enforce RLS.
3. Use a trusted backend to create Stripe Checkout sessions and verify signed webhooks; do not trust browser-set subscription flags.
4. Use private storage and short-lived authorized URLs for licensed PDF content.
5. Handle renewal, cancellation, payment failures, refunds, and expiration.
6. Confirm publishing/distribution rights for each book and applicable payment/legal requirements.
7. Test mobile UX, PDF rendering, security, and subscription lifecycle.

Do not commit Stripe secret keys or Supabase service-role keys. Public browser code must never be treated as an authorization boundary.
