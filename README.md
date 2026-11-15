# `api` Edge Function

This is the **single planned application API router**. It is intentionally not deployed or wired to the browser yet.

Implementation requirements before deployment:

1. Read the bearer token from `Authorization` and validate it with `supabase.auth.getUser(token)`.
2. Derive `userId` only from the verified user object. Ignore/reject request `user_id` values.
3. Use a request-scoped user client for identity checks and a server-only service-role client for protected database transactions. Never return the service-role key.
4. Load `user_roles` using the server-only client. Never infer admin from email, localStorage, user metadata or a client field.
5. Validate every route/body against a strict schema and reject unknown privileged fields such as `role`, `stars`, `price`, `score` and `isAdmin`.
6. Implement completion, reward, purchase and equip operations as database transactions/RPCs with idempotency keys and row locks where needed.
7. Add rate limits, CORS allow-list, payload-size limits, request IDs and safe error mapping.
8. Proxy only explicitly allow-listed AI/NASA operations; do not accept arbitrary target URLs.

Required server environment variables (set only as Edge Function secrets):

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- Provider-specific AI/NASA credentials only if those integrations are approved.

Do not create a browser `.env` containing service credentials. The current project remains local/demo mode until a deployed and tested API exists.


## Optional Astro assistant route (Section 11)

The `index.ts` handler adds `POST /functions/v1/api/astro-ai`. Deploy it only after a project owner and school/adult reviewer approve the provider, privacy notice, safeguarding process and CORS origins.

Set these as Supabase Edge Function secrets (not frontend variables): `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `AI_PROVIDER_API_KEY`, `AI_PROVIDER_URL`, `AI_MODEL`, `ASTRO_ALLOWED_ORIGINS`. The provider URL must be a vetted OpenAI-compatible endpoint. `ASTRO_ALLOWED_ORIGINS` is a comma-separated exact origin allow-list.

The browser remains offline-first. To enable the remote path after Supabase Auth is implemented, set `window.ASTRO_CONFIG = { assistantEndpoint: "/functions/v1/api/astro-ai" }` and supply the current Supabase access token as `window.ASTRO_AUTH_TOKEN` from the authenticated session. The local demo auth module does not provide this token. Do not enable remote mode by placing a provider key in the browser.

The current handler does not persist conversation text. Its lightweight request/output checks are defense in depth, not a full moderation service or durable rate limiter. Add platform-level rate limiting, provider safety controls, operational monitoring without child transcripts, and staging integration tests before a student pilot.
