# Section 9 security acceptance tests

These are required tests for the future online service. Run with synthetic accounts and data only.

## Authentication

- [ ] Signup never writes a password or password hash to any Astronaut Jr public table.
- [ ] Supabase Auth is the only password verifier; browser-only local accounts are not accepted as production identity.
- [ ] Invalid, expired, revoked and malformed tokens are rejected.
- [ ] Password recovery and session expiry work; sign-out invalidates the app session as designed.

## Authorization

- [ ] A player calling every admin/teacher route directly receives `403`.
- [ ] A player cannot change `role`, `isAdmin`, `user_id`, `stars`, `price`, `score`, `completed`, `owned` or inventory through request payloads.
- [ ] A player cannot read or modify another player's profile, progress, quiz, rewards or purchases.
- [ ] A teacher can see only approved assigned-class data after school mode is enabled.

## Privacy and child process

- [ ] Each stored field maps to an approved purpose in `docs/privacy/data-inventory-and-retention.md`.
- [ ] No login event telemetry or unapproved external form/leaderboard/AI transfer occurs.
- [ ] Leaderboard, AI and school sharing are separate, optional choices with tested withdrawal.
- [ ] Guardian consent and child-facing explanation are recorded according to the locally approved workflow.
- [ ] Account access, correction, export where applicable, withdrawal and deletion requests complete successfully.
- [ ] Logs, analytics and error reports contain no passwords, tokens, email addresses or free-text child prompts.

## Operational security

- [ ] HTTPS, CSP, security headers and exact-origin CORS are verified in the deployed environment.
- [ ] No secret/service-role key appears in source, bundle, source map, browser storage or network responses.
- [ ] Rate limits return safe `429` responses and do not leak account existence.
- [ ] Dependency scan has no unresolved critical/high issue without an approved exception.
- [ ] Backup restore succeeds; a deleted synthetic account remains deleted after restore reconciliation.

## Evidence required

For each test, save the test date, build/commit, synthetic account labels (not real IDs), expected result, actual result and pass/fail. Never attach real child information to the test evidence.
