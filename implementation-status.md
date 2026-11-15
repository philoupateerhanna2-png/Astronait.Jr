# Backend section 8 — implementation status

| Requirement | Prepared in this package | Still required before calling it complete |
|---|---|---|
| 8.1 Backend choice | ADR-001 selects one Supabase path and compares Firebase/custom Node.js | Team/teacher approval and a budget/hosting decision for the actual deployment |
| 8.2 Data model | SQL migration, relationships, authorization matrix and local-field mapping | Review schema with the team; seed trusted mission/cosmetic catalogues |
| 8.3 API boundaries | Route table, request/response contracts, common errors and OpenAPI draft | Implement handlers and contract/integration tests in the Edge Function |
| 8.4 Server-side trust | RLS, read-only client grants for authoritative tables, private role table, security requirements | Deploy server handlers/transaction functions and prove tampered localStorage/payloads cannot affect server state |
| 8.5 Sync/recovery | Local-vs-server model, idempotency/conflict rules, two-device test plan, backup and recovery plan | Implement client sync queue; run two-device/offline/account recovery and backup restore tests on a real test project |

**Current release status: architecture and migration scaffold only.** No Supabase project is connected, no Edge Function is deployed, and no cloud sync is active. The existing local prototype can still be edited in the browser and must be treated as demo data, not authoritative student records. Do not advertise section 8.4 or 8.5 as production-complete until the remaining integration tests pass.


# Backend section 9 — authentication, security and child privacy

| Requirement | Prepared in this package | Still required before calling it complete |
|---|---|---|
| 9.1 Authentication | Supabase Auth flow and session design documented; local demo password verifier hardened to require Web Crypto; no production credentials are used | Implement and deploy Supabase Auth; remove/retire local password verification for production; verify sessions and recovery |
| 9.2 Authorization | Browser admin authority disabled; server role matrix and direct-request tests documented | Implement server checks on every protected route and pass negative integration tests |
| 9.3 Data minimization | Field-level inventory, purposes, recipients, proposed retention and deletion workflow documented; login telemetry and unapproved browser transfers removed/disabled | Adult/legal/school approval of each field, recipient, lawful basis, retention and transfer |
| 9.4 Child/guardian process | Adult supervisor, guardian consent, child explanation, school approval and launch gates documented | Name adult supervisor; qualified local adviser and school review/sign-off; test actual process |
| 9.5 Operational security | Deployment checklist covers HTTPS, secrets, rate limits, dependency scanning, minimal logs and backups | Configure production environment, run scans, validate headers/rates/secrets, and complete restore drill |

**Section 9 release status: NOT COMPLETE.** The current package is a safer local demo plus a documented security/privacy plan. It is not connected to a live authentication service, and no real student information should be collected.
