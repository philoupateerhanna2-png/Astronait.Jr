# Application API contract

**Backend:** one Supabase project and one Edge Function router, `api`. Supabase Auth owns signup/signin/signout and password recovery. Application data and privileged operations go through `/functions/v1/api/...`; do not add a second Node.js API or Firebase route.

Base URL in deployment: `https://<project-ref>.supabase.co`. The project URL is intentionally a placeholder.

## Authentication

Use Supabase Auth endpoints under `/auth/v1/` with the public anon key in the documented `apikey` header. Send the returned access token as `Authorization: Bearer <access_token>` to every `/functions/v1/api/...` request. The Edge Function must validate the token with Supabase Auth (`getUser`), not merely decode the JWT. Refresh/recovery follows Supabase Auth flows. Never store a password or service-role key in browser storage.

## Common rules

- JSON request and response bodies; UTF-8.
- All authenticated routes require a valid bearer token.
- Identity is derived from the token; request `user_id` fields are rejected/ignored.
- `Idempotency-Key` is required for mission completion, quiz submission and purchase commands. Repeating the same key returns the original result and never grants twice.
- Client sends quiz answers, not score/reward. The server grades against the trusted quiz version.
- Client sends `item_id`, not price or balance. The server loads the current trusted price and checks balance/ownership.
- Pagination uses opaque `cursor` and bounded `limit` (default 20, max 50).
- Dates are ISO 8601 UTC.

## Routes

| Method and route | Purpose | Request | Success |
|---|---|---|---|
| `GET /functions/v1/api/v1/me` | Current profile | None | `{ user, profile, cadet }` |
| `PATCH /functions/v1/api/v1/me` | Edit allowed profile fields | `{ display_name?, call_sign?, leaderboard_opt_in? }` | `{ profile, cadet }` |
| `GET /functions/v1/api/v1/progress` | Load confirmed progress | Optional `?cursor=&limit=` | `{ progress, star_balance, cursor }` |
| `PUT /functions/v1/api/v1/missions/{missionKey}/checkpoint` | Save a validated checkpoint | `{ checkpoint, client_revision }` | `{ checkpoint, server_revision, updated_at }` |
| `POST /functions/v1/api/v1/missions/{missionKey}/complete` | Submit mission completion | `{ attempt_id, quiz_version, answers }` | `{ completed, score, max_score, stars_awarded, star_balance, progress }` |
| `POST /functions/v1/api/v1/quizzes/{quizKey}/attempts` | Submit a quiz attempt | `{ attempt_id, quiz_version, answers }` | `{ attempt_id, score, max_score, submitted_at }` |
| `GET /functions/v1/api/v1/achievements` | Read catalogue and own unlocks | Optional `?cursor=&limit=` | `{ catalogue, unlocked }` |
| `POST /functions/v1/api/v1/store/purchases` | Buy a virtual cosmetic | `{ item_id }` plus `Idempotency-Key` header | `{ purchase, inventory_item, star_balance }` |
| `PUT /functions/v1/api/v1/store/equipped` | Equip owned cosmetic | `{ slot, item_id }` | `{ equipped }` |
| `GET /functions/v1/api/v1/leaderboard` | Read opt-in public leaderboard | `?scope=global\|school&cursor=&limit=` | `{ players, cursor }` |
| `POST /functions/v1/api/v1/ai/ask` | Server-side AI proxy | `{ prompt, context_ids? }` | `{ answer, request_id }` |
| `GET /functions/v1/api/v1/nasa/{resource}` | Allow-listed NASA data proxy | Resource-specific safe query parameters | `{ data, source, fetched_at }` |

`scope=school` is unavailable until school mode, teacher permissions and school approval are enabled. AI and NASA routes must use server-side secrets, strict provider/resource allow-lists, rate limits and response-size limits. Do not proxy arbitrary URLs.

## Error format

All errors use:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The request could not be processed.",
    "request_id": "server-generated-id",
    "details": []
  }
}
```

| HTTP | Codes | Meaning |
|---|---|---|
| `400` | `VALIDATION_ERROR`, `INVALID_IDEMPOTENCY_KEY` | Invalid shape, unknown field, unsupported ID or malformed command |
| `401` | `UNAUTHENTICATED`, `TOKEN_EXPIRED` | Missing/invalid/expired token |
| `403` | `FORBIDDEN`, `ROLE_REQUIRED` | Identity valid but operation not allowed |
| `404` | `NOT_FOUND` | Resource does not exist or is not visible to this user |
| `409` | `CONFLICT`, `INSUFFICIENT_STARS`, `ALREADY_COMPLETED` | State conflict; response may include current authoritative state |
| `413` | `PAYLOAD_TOO_LARGE` | Request exceeds configured limit |
| `429` | `RATE_LIMITED` | Rate limit exceeded; include `Retry-After` when available |
| `500` | `INTERNAL_ERROR` | Unexpected failure; never return secrets or stack traces |
| `503` | `UPSTREAM_UNAVAILABLE` | AI/NASA provider temporarily unavailable |

The API must not reveal whether another user's email/account exists. Error messages shown to cadets should be brief and age-appropriate; detailed diagnostics stay in server logs with request IDs and no passwords/tokens.
