# ADR-001: Backend platform for Astronaut Jr

- **Status:** Accepted for the planned online phase; not connected to the current browser prototype.
- **Date:** 2026-11-15
- **Decision owners:** Astronaut Jr team, with a teacher/school representative approving any real student deployment.

## Context

The current application is a Vanilla JavaScript prototype. Account records, session state, stars, mission progress, inventory and achievements are stored in browser `localStorage`. This is useful for a local demo, but it is not a trusted identity or reward system: a user can edit browser storage and browser-submitted values.

The planned service needs authentication, relational records, role-aware access, trusted reward transactions, optional school/teacher relationships, and a small server-side proxy for AI/NASA integrations. The team should not have to operate its own database, authentication service, patching and backups during the first online release.

## Options compared

| Criterion | Supabase managed | Firebase managed | Custom Node.js API + database |
|---|---|---|---|
| Team capability | SQL/Postgres and JavaScript; one managed platform | JavaScript-friendly; Firestore is document-oriented and uses Security Rules | Requires API, database, hosting, deployment, monitoring and patching skills |
| Data fit | Strong fit for relational users, classes, progress, attempts, rewards and inventory | Can model these, but joins and multi-record reporting need more application-side design | Flexible, but the team must design and maintain everything |
| Security controls | Supabase Auth, Postgres Row Level Security, constraints and Edge Functions | Firebase Auth, Firestore Security Rules and Cloud Functions | Fully configurable; also fully the team's responsibility |
| Early cost | Free tier available for development; Free projects may pause after inactivity and do not include automatic backups. Pro currently starts at USD $25/month and includes daily backups for 7 days | Spark has no-cost quotas; Blaze is pay-as-you-go. Exceeding Spark quotas can stop the affected service until the quota resets or plan changes | Variable hosting, database, backups, monitoring and engineering time; no reliable fixed estimate without a deployment design |
| School operations | Managed platform reduces operations, but school/privacy approval and plan review remain necessary | Managed platform reduces operations; billing and product limits need monitoring | More control over hosting/data location, but much higher operational burden |
| Lock-in / portability | Postgres schema and SQL migrations are comparatively portable | Firestore data model and Security Rules are more Firebase-specific | Depends on selected database and framework |

Pricing is a snapshot from official vendor pages checked on 2026-11-15; it is not a quote. Re-check pricing, quotas, data-processing terms and regional availability before launch.

## Decision

Use **one Supabase project** as the only planned backend platform:

1. **Supabase Auth** owns account identity and sessions.
2. **Supabase Postgres** owns all authoritative application data.
3. **Postgres Row Level Security (RLS)** is enabled as defense in depth.
4. A single **Supabase Edge Function named `api`** is the application API boundary for privileged reads/writes and third-party proxies.
5. The Edge Function verifies the caller's JWT, checks roles from protected database records, validates all input, and performs trusted transactions. Its service-role key is server-only.
6. The browser keeps a local draft/offline cache, but it never decides authoritative stars, roles, mission completion or purchases.

Do not add a parallel Firebase project or a separate custom Node.js API for the same features. If a future school requirement makes Supabase unsuitable (for example, a contractual hosting or compliance requirement), record a new ADR before changing platforms.

## Why not Firebase or custom Node.js now?

- Firebase is a credible managed alternative, especially for teams already using its document database and Google ecosystem. Astronaut Jr's progress, attempts, memberships, ledger and inventory are naturally relational; Postgres constraints, transactions and SQL reporting are a better fit for the current team and model.
- A custom Node.js API offers maximum control but duplicates services the team would then need to build, secure, deploy and maintain. Reconsider only when there is a demonstrated requirement and an experienced maintainer.

## Consequences

- The team must learn SQL, RLS, Supabase Auth and Edge Functions.
- RLS policies and server-side authorization must be reviewed before any student data is loaded.
- Free tier is for development/pilot validation only: it can pause after inactivity and does not provide automatic backups. A production decision must include budget approval, backup/restore drills, data retention and school approval.
- The browser-only local account system is a legacy/demo mode. It must not be described as secure cloud authentication.
- No real backend is enabled by this ADR. Project URL, keys, email configuration, billing and deployment are intentionally not supplied or committed here.

## References

- Supabase pricing: https://supabase.com/pricing
- Supabase Row Level Security: https://supabase.com/docs/guides/database/postgres/row-level-security
- Supabase database overview: https://supabase.com/docs/guides/database/overview
- Supabase backups: https://supabase.com/docs/guides/platform/backups
- Firebase pricing: https://firebase.google.com/pricing
- Firebase pricing plans: https://firebase.google.com/docs/projects/billing/firebase-pricing-plans
- Supabase Edge Function authentication patterns: https://supabase.com/docs/guides/functions/auth
- Supabase Edge Function authorization headers: https://supabase.com/docs/guides/functions/auth-headers
- Firebase Firestore Security Rules: https://firebase.google.com/docs/firestore/security/overview
