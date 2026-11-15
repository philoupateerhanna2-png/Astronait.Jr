# Operational security checklist (Section 9.5)

**Status: requirements prepared; production controls not yet deployed or verified.**

## Transport and browser security

- [ ] Serve the production site and API over HTTPS only; redirect HTTP to HTTPS.
- [ ] Enable HSTS after confirming all required subdomains are HTTPS.
- [ ] Add a restrictive Content Security Policy; avoid inline scripts where possible and use nonces/hashes if needed.
- [ ] Add `X-Content-Type-Options: nosniff`, a restrictive `Referrer-Policy`, and a minimal `Permissions-Policy`.
- [ ] Restrict CORS to exact production and approved development origins; do not use wildcard origins with credentials.
- [ ] Validate request methods, content types, payload sizes, and schemas. Reject unknown privileged fields.

## Secrets and dependencies

- [ ] Keep Supabase secret/service-role keys and AI credentials only in server-side Edge Function secrets.
- [ ] Only the Supabase publishable/anon key may appear in a browser bundle, and only with RLS and least-privilege grants configured.
- [ ] Scan the repository and built assets for secrets before every release; rotate any exposed key immediately.
- [ ] Commit a lockfile; run dependency vulnerability checks and update dependencies on a documented cadence.
- [ ] Keep development and production Supabase projects separate.

## Abuse and account controls

- [ ] Configure Auth rate limits and add route-specific limits for quiz submissions, purchases, AI requests and account recovery.
- [ ] Use idempotency keys for mission rewards, quiz attempts, purchases and other repeatable operations.
- [ ] Use server-side role checks and database constraints/RLS for every protected operation.
- [ ] Add anti-automation protections appropriate to the approved child UX; do not introduce invasive tracking or fingerprinting.

## Logs and incident response

- [ ] Do not log passwords, access/refresh tokens, full request bodies, child email addresses, exact locations, free-text AI prompts or contact messages.
- [ ] Do not enable application-level login/failed-login/signup/signout telemetry by default.
- [ ] Keep security logs limited to event type, request/correlation ID, pseudonymous actor ID where necessary, result code and timestamp; set an approved short retention period.
- [ ] Restrict log access to named operators and review it periodically.
- [ ] Document incident triage, containment, key rotation, adult/school notification decision path and evidence preservation with the adviser.

## Backup and recovery

- [ ] Choose a plan with an approved backup schedule and retention; document what is and is not covered.
- [ ] Encrypt backups and restrict restore permissions.
- [ ] Run a restore drill in a separate environment before student pilot and at a documented cadence.
- [ ] Test account deletion after restore so deleted records do not reappear.

## Release gate

No production student release until every applicable item is checked by the technical owner and reviewed by the adult supervisor. A checked document alone is not proof: attach deployment settings, test output and restore-drill evidence.
