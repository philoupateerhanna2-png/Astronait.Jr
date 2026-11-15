# Authentication and authorization plan (Section 9.1–9.2)

**Status: design prepared; production authentication is not connected.**

## Trusted identity

- Supabase Auth is the only planned identity provider. The application must not create or verify production passwords in browser JavaScript.
- Supabase Auth stores password hashes using bcrypt; Astronaut Jr must never read, copy, or store password hashes itself. Use the provider's supported password and recovery flows.
- Do not migrate local prototype passwords, salts, hashes, sessions, or local `role` values.
- For a child account, do not require the child's personal email address. If email is required by the approved account flow, use an adult/guardian-controlled contact address or an approved school-managed identity. Do not collect phone numbers or exact date of birth by default.
- Configure email verification, password recovery, allowed redirect URLs, session expiry and sign-out behavior before pilot use.

## Session design decision

Preferred production design for the static Vanilla JS client:

1. Use Supabase Auth with the PKCE flow.
2. Complete the code exchange through the same trusted API boundary where feasible.
3. Prefer a same-origin server-managed session cookie with `Secure`, `HttpOnly`, `SameSite=Lax` (or stricter where compatible), `Path=/`, and a deliberate expiry. Never place a service/secret key in browser code.
4. If a cookie-backed BFF cannot be implemented for the chosen static hosting, the team must explicitly review the residual risk of browser-held access/refresh tokens, apply a strict Content Security Policy and XSS controls, and obtain security review before student pilot. Do not silently treat localStorage tokens as equivalent to HttpOnly cookies.
5. Every API request must validate the session/token with Supabase Auth. The server derives the user UUID from the verified identity, never from `user_id` in the body, URL or browser storage.

Supabase's Auth password flow uses bcrypt for stored password hashes. Its current documentation describes PKCE as the flow that supports server-side code exchange. See the official references at the end of this document.

## Role and permission model

- Roles: `player` is the default implicit role; `teacher` and `admin` are protected assignments in `public.user_roles`.
- A signup can never select or self-assign a privileged role.
- The server loads roles from the protected database after authenticating the request. Do not use email allow-lists, user-editable metadata, JWT user metadata, localStorage, hidden buttons or client-side `isAdmin` checks as authority.
- Every protected operation performs authorization on the server, including direct requests that bypass the UI.
- Teacher access is unavailable until the school has approved the school/class model, named the responsible controller, and approved the roster/guardian process. Teachers may only access assigned classes and only the minimum learning records needed for their approved purpose.
- Admin grants/revocations require a separately authenticated trusted operator, an explicit reason, and a minimal audit event. Never expose role mutation in the public client API.

## Required server checks

| Operation | Required check |
|---|---|
| Read/update own profile | Verified user ID equals profile owner; allow-listed fields only |
| Read own progress/attempts | Verified user ID equals row owner |
| Complete mission / submit quiz | Verified user; trusted mission/quiz version; server-calculated result; idempotency |
| Award/spend stars | Server transaction; derive amount and price from trusted rules/catalogue |
| Equip item | Verify ownership and compatible slot in the database |
| Leaderboard | Explicit opt-in; publish pseudonymous handle and approved aggregate only |
| Teacher class view | Active teacher role + active membership + assigned class + school approval |
| Admin action | Protected admin role + action-specific authorization + audit record |

## Acceptance tests

- A new account cannot set `role`, `isAdmin`, `teacher`, `admin`, or privileged metadata during signup.
- A normal player calling an admin route directly receives `403` and no state change.
- A player cannot read another player's rows by changing a path, query or body ID.
- Removing/hiding a client-side button does not change server authorization behavior.
- Expired, revoked, malformed or wrong-audience tokens are rejected.
- Password reset and sign-out invalidate or rotate sessions as supported by the selected session design.

## Current prototype boundary

`js/features/auth.js` remains a local-only demo account flow. It stores a local PBKDF2 verifier and a browser session; it is **not** production authentication. The hard-coded admin email and browser-admin authority have been removed/disabled. New local demo accounts use pseudonymous usernames and do not require an email. Do not use real credentials or real student data in this mode. Production 9.1 and 9.2 are not complete until the server flow and tests above are implemented.

## Official technical references

- Supabase password-based Auth: https://supabase.com/docs/guides/auth/passwords
- Supabase sessions: https://supabase.com/docs/guides/auth/sessions
- Supabase Edge Function authentication: https://supabase.com/docs/guides/functions/auth
- Supabase RLS: https://supabase.com/docs/guides/database/postgres/row-level-security
- Supabase secret handling: https://supabase.com/docs/guides/functions/secrets
