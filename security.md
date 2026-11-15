# Backend security and trust boundaries

## Non-negotiable rules

1. **Authentication:** validate every access token with Supabase Auth. Do not trust a browser-supplied user ID, email, role or decoded-but-unverified JWT.
2. **Authorization:** derive the user ID from the verified token. Load roles from protected `user_roles` records. A new signup is always a normal cadet; there is no hard-coded admin email and no client-side role assignment.
3. **Server-side rewards:** calculate quiz scores on the server using a trusted quiz version. Compute stars from server rules. Store reward events in the append-only `star_ledger` with a unique event key. Never accept `stars`, `earnedTotal`, `price`, `role`, `isAdmin`, `completed`, `owned` or `inventory` from the browser as authoritative.
4. **Purchases:** the server reads the catalogue price, checks the derived balance, writes the purchase, ledger debit and inventory grant in one database transaction. A repeated idempotency key cannot debit or grant twice.
5. **RLS:** enable RLS on every exposed table. Client grants are read-only and limited to the user's own records; authoritative writes happen only through the Edge Function using server credentials. Protected role and school tables have no direct client grants.
6. **Secrets:** `SUPABASE_SERVICE_ROLE_KEY`, AI provider keys and any privileged NASA proxy configuration exist only in Edge Function secrets. Never prefix them with a browser-exposed environment variable or commit them to Git.
7. **Abuse controls:** validate payload size and schema; rate-limit sign-in attempts, quiz submissions, purchases and AI requests; use request IDs; audit admin/teacher actions; avoid logging tokens, passwords, full prompts containing personal data, or student email addresses.
8. **Privacy:** collect the minimum needed. No date of birth, home address or precise location in this first model. Use pseudonymous public handles and make leaderboard participation opt-in. Do not enable school rosters or teacher access until school approval and a documented retention/deletion process exist.

## Existing prototype risks to retire

The current `js/features/auth.js` creates accounts locally and assigns `role: "admin"` when the signup email matches a hard-coded address. `astro.js` and `js/features/state.js` also update stars and progress in browser memory/localStorage. These are acceptable only as demo behavior. They are not suitable as production security controls.

Before enabling online mode:

- Remove the hard-coded admin email and local `isAdmin` authority.
- Replace local password handling with Supabase Auth; never migrate local password hashes.
- Make local progress explicitly a draft/cache. The server's response is the only confirmed balance, role, completion and inventory state.
- Hide or disable local-only admin tools in online mode. Admin actions must be separate server routes with role checks and audit records.
- Keep a feature flag defaulted to local/demo mode until deployment and security tests pass.

## Required security tests before launch

- Anonymous requests cannot read private profile, progress, quiz, ledger, purchase or inventory rows.
- Cadet A cannot read or modify Cadet B's rows by changing a URL, body `user_id`, query filter or localStorage value.
- Changing localStorage stars/role/completed/owned does not change server balance, role, completion or inventory after refresh/re-login.
- Sending fake score, max score, stars, price, role or user ID is rejected or ignored; server calculates the authoritative values.
- A normal cadet cannot call admin/teacher endpoints or modify `user_roles`.
- Replaying an identical mission/quiz/purchase idempotency key creates at most one authoritative result/reward/debit.
- Concurrent purchases cannot spend the same stars twice; balance checks and ledger writes are atomic.
- AI/NASA proxy rejects arbitrary provider URLs, oversized requests and excessive request rates.
- Secrets and personal data do not appear in browser bundles, source maps, logs or API errors.

A teacher/school representative must review access and data retention before real student accounts are created. This document is a technical plan, not a legal-compliance certification.
