# Astro educational assistant — Section 11 implementation review

**Status: implementation scaffold complete; the external service has not been deployed and human approval remains pending.**

## 11.1 Connect through backend

- Browser code calls only the optional same-origin `window.ASTRO_CONFIG.assistantEndpoint` and only when a real Supabase access token is supplied as `window.ASTRO_AUTH_TOKEN` by a future authenticated integration.
- No provider key is read or stored by frontend code.
- The Supabase `api` Edge Function verifies the bearer token with Supabase Auth and reads provider credentials from Edge Function secrets.
- If endpoint, token, provider settings, network, or service are unavailable, Astro falls back to the existing offline knowledge base.
- This project has **not** been deployed or connected to a Supabase project. Local demo authentication does not create a valid Supabase token. Therefore remote AI remains disabled until deployment, Auth integration, CORS allow-list configuration and provider approval are completed.

Required Edge Function secrets: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `AI_PROVIDER_API_KEY`, `AI_PROVIDER_URL`, `AI_MODEL`, `ASTRO_ALLOWED_ORIGINS`. Use a provider endpoint approved by the project owner and school. Do not commit secret values.

## 11.2 Ground answers

- Remote system instructions restrict factual astronomy responses to an explicit NASA source allow-list and instruct the model to say when evidence is insufficient. The current server does not yet retrieve and inject page-specific NASA excerpts; source links are allow-listed but this alone does not prove each claim. A retrieval/content-pack layer is still needed for strong grounding.
- Server validates returned source title/URL pairs against that allow-list; browser repeats a URL-origin allow-list before rendering links.
- Offline knowledge-base answers show general NASA learning links. These are discovery resources, not proof that every individual statement has been independently verified.
- Next content-quality task: map each local knowledge-base entry and each mission excerpt to a specific lesson/source citation, then have a science reviewer verify each factual claim.

## 11.3 Age-appropriate behavior

- Default mode is guided, short-form learning; `hint` mode is sent only for hint requests.
- Server prompt requires concise explanations, hints before solutions when requested, a checking question, no personal-data collection, and refusal of unsafe topics.
- Client has a lightweight refusal gate for selected high-risk request categories. This is a defense-in-depth measure, **not** a complete content moderation system.
- No learner age, date of birth, name, school or profile data is sent with an AI request. Only the message and mode are sent; request is limited to 240 characters.
- `docs/astro-assistant-review-prompts.md` contains a synthetic review set. It is not marked passed until a teacher/reviewer records results.

## 11.4 Safety and transparency

- UI labels Astro as an AI-assisted learning helper, warns not to share private information, states that Astro can make mistakes, and provides an adult-supervised report route.
- Server uses authentication, CORS allow-list, request-size and message-length limits, short timeout, no-store response headers, allow-listed sources, and generic error messages.
- No conversation history is persisted or sent to provider. No server-side transcript logging is added.
- Human escalation is limited to the visible instruction to contact a trusted adult and the adult-supervised report email. A staffed safeguarding workflow, response SLA, escalation owner, and incident process are **not** implemented.
- UNICEF Guidance on AI and Children 3.0 (December 2025) reviewed at a design-checklist level. Mapping is in `docs/unicef-ai-children-3-review.md`. This is not a formal UNICEF certification or legal review.

## 11.5 Educational quality

- Remote prompt asks for explanations, one checking question, hints before full answers when asked, and explicit uncertainty.
- Existing local replies remain curated keyword answers and are not yet a fully adaptive Socratic tutor. Local answer coverage and source mapping need teacher review.
- A teacher/reviewer must score a representative sample for scientific accuracy, age suitability, clarity, scaffolding, source traceability and uncertainty before enabling the remote endpoint for learners.

## Acceptance status

| Requirement | Code status | Remaining acceptance evidence |
|---|---|---|
| 11.1 backend transport | Scaffolded, not deployed | Authenticated staging test; secret scan; service-down test |
| 11.2 grounded answers | Partial | Per-claim approved lesson/source mapping and sample audit |
| 11.3 age-appropriate | Partial | Human review of prompt set; moderation evaluation |
| 11.4 safety/transparency | Partial | Adult safeguarding owner, staffed report route, incident drill, privacy/legal approval |
| 11.5 educational quality | Partial | Teacher-reviewed sample and signed rubric |

**Do not describe Section 11 as fully done or enable AI for real students until these remaining gates are met.**
