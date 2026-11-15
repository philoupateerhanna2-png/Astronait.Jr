# Astronaut Jr data inventory, purposes and retention (Section 9.3)

**Status: proposed minimised inventory. All retention periods below are proposed defaults, not a legal conclusion. An adult project owner and qualified Egyptian privacy/legal adviser must approve them before any real child data is collected.**

## Principles

- Do not collect exact date of birth, home address, phone number, precise location, photos, voice recordings, biometric data, health data or school ID in the first release.
- Use a pseudonymous call sign. Do not make public leaderboard participation a condition of using the learning app.
- Do not store free-text quiz answers or full AI conversations by default.
- Do not send login, failed-login, signup or sign-out events to third-party endpoints from the browser.
- Every external transfer must be listed, justified, contractually reviewed, and disclosed before it is enabled.
- A user/guardian must have a clear route to request access, correction, export where appropriate, withdrawal and deletion. Verify the requester safely without collecting excessive identity documents.

## Field-level inventory

| Data / field | Why it may be needed | Who receives/accesses it | Proposed retention | Delete / withdrawal handling |
|---|---|---|---|---|
| Supabase Auth account ID (UUID) | Link records without exposing email | Supabase Auth; Astronaut Jr API/database | While account exists; delete with account | Account deletion workflow cascades linked application rows; verify provider-side deletion |
| Guardian-controlled email (only if approved account flow needs it) | Verification, recovery and essential account notices | Supabase Auth and approved email delivery provider; designated adult account owner | While account exists; remove on account deletion, subject to legal hold requirements | Guardian can request correction/deletion; do not use child email by default |
| Password | Authenticate account | Supabase Auth only | Provider-managed; Astronaut Jr never stores plaintext or hashes | Password reset/change through Auth; never export |
| Pseudonymous `display_name`, `public_handle`, `call_sign` | Show cadet identity in app | App database; public handle only to opt-in leaderboard audience | While account exists; leaderboard copy only while opt-in is active | Change alias; turn off opt-in; delete on account deletion |
| Locale and avatar key | Preferences and display | App database | While account exists | Delete with account; optional preferences may be reset earlier |
| Mission status, checkpoint, best score, attempt count | Resume learning and show progress | App database; user; approved teacher only if school mode is later enabled | While account exists; proposed 30-day deletion grace after closure, then purge | Guardian/user request; export if approved; delete linked rows |
| Quiz result (score, max score, quiz version, timestamp) | Measure progress and prevent duplicate rewards | App database; user; approved teacher only if later enabled | While account exists; proposed 30-day deletion grace after closure | Delete with account; do not retain answer text by default |
| Achievement unlocks, star ledger, purchases, inventory, equipped items | Game state and audit of rewards | App database; user; limited trusted support/admin only when approved | While account exists; proposed 30-day deletion grace after closure | Delete with account; keep only legally required financial/audit records if any, after adviser review |
| Leaderboard alias and aggregate score | Optional public competition | Public audience only after separate opt-in | Until opt-out or account deletion; remove from public view promptly on withdrawal | Opt-out immediately removes public listing; account deletion removes row |
| School, class and membership data | Optional teacher/class learning workflow | School-authorised staff and app processors only after school approval | Defined in written school agreement; do not activate a default retention period now | School/guardian process; remove membership and associated access promptly |
| Consent record (scope/version, timestamp, guardian confirmation route) | Demonstrate what was approved and manage withdrawal | Restricted privacy/admin role; adviser if needed | Retain only for the period approved by counsel and required to demonstrate consent | Record withdrawal and stop optional processing; delete when retention obligation ends |
| Support message | Resolve a support request | Only the adult-supervised support inbox and its email provider | Proposed 90 days after closure, then delete, unless a documented reason requires longer | Adult requester can ask for deletion; avoid child-sensitive details |
| AI prompt / AI response | Optional answer generation, only after approval | Approved AI provider via server proxy; no direct browser-to-provider call | Default: do not persist; provider retention must be checked and disclosed | Do not include names, emails, school names or sensitive details; deletion/retention depends on provider contract and settings |
| NASA/public science API query | Retrieve public science content | NASA/public API via server proxy; send only fixed public query parameters | No user-level query history by default | No personal data should be included; no per-child log |
| Security/operational event | Detect abuse and investigate incidents | Restricted technical operators | Proposed 30 days for minimised security events; subject to legal/incident needs | No login history, passwords, tokens, full request bodies, child email or IP in application logs by default |
| Third-party static assets (Three.js via jsDelivr, Tailwind CDN, Google Fonts) | Render Earth/Mars 3D pages and typography | jsDelivr, Tailwind CDN and Google Fonts receive ordinary browser request metadata (such as IP address, user-agent and referrer); no app profile is intentionally attached | Provider-controlled; Astronaut Jr does not retain these requests | Prefer self-hosting pinned assets; otherwise disclose providers and review their terms/region before student pilot |
| External educational media and embeds (NASA Space Place videos, NASA Eyes, PhET, Wikimedia Commons images) | Display optional educational videos, simulations and images | Relevant provider receives ordinary browser request metadata when media/iframe/image is loaded; no app account ID or progress is intentionally sent | Provider-controlled; Astronaut Jr does not retain provider-side request logs | Load embeds only when the user opens the feature; use `referrerpolicy="no-referrer"` where supported; review provider terms and allow a local/accessible fallback |
| Local browser save/session (demo only) | Keep a demo session and progress on one device | Browser storage on that device only | Until user clears browser data or local reset | Clear local data; it is not a server backup and may remain on shared devices |

## External recipients and transfers

The current project is not fully offline: opening the 3D explorers loads Three.js from jsDelivr, Tailwind from its CDN, fonts from Google Fonts and map/photo assets from Wikimedia Commons; opening the Lab can embed NASA Eyes or PhET, and the Cinema can stream NASA Space Place media. Those providers may receive ordinary network metadata (for example IP address, user-agent and referrer) when the relevant page/media is requested. The application does not intentionally attach a cadet account ID or progress to those requests. This still counts as a third-party transfer and must be disclosed/reviewed. Prefer self-hosting assets and load external embeds only after the user opens the feature.

| Recipient / service | Current state | Data that may be sent | Purpose and release gate |
|---|---|---|---|
| Supabase Auth + Postgres | Planned only; not connected | Account ID, approved account identifier, profiles and progress | Only after data-processing terms, region, access, retention, cross-border transfer and school/privacy review |
| Supabase Edge Function | Planned only; not deployed | Verified user token/session context and minimum API payload | Server API; never send service-role key to browser |
| AI provider | Disabled in current prototype | Would receive the user's prompt and minimum context | Must be approved, disclosed, contractually reviewed, minimised and proxied by server; no child names or identifiers |
| NASA/public data APIs | No personal-data proxy enabled | Public astronomy query only | Server allow-list; do not attach user IDs or free-text personal data |
| Contact form processor | Disabled in current prototype | Previously the form would send name, optional account email, subject and message to Formspree | Keep disabled until adult-supervised support purpose, processor terms, retention and privacy notice are approved |
| Login event alert endpoint | Removed from current prototype | Previously username, email, event type and timestamp could be posted from browser | Removed because login telemetry is unnecessary for the demo |
| Remote leaderboard endpoint | Disabled in current prototype | Previously username/alias and stars, mission and trophy counts could be posted | Only re-enable through approved server API after separate, optional leaderboard opt-in |

## Deletion and access workflow

1. Accept requests from the verified guardian/account holder through the adult-supervised contact route.
2. Verify authority proportionately; do not request identity documents by default.
3. Pause optional processing (leaderboard/AI/school sharing) while a valid withdrawal is processed.
4. Export or correct records where applicable; delete the account and linked rows when approved.
5. Remove public leaderboard data immediately on opt-out; include processor-side deletion requests where applicable.
6. Record completion using a minimal case reference, not a copy of the child's personal data.
7. Let backups expire under the approved backup lifecycle; prevent restored backups from reactivating a deleted account by replaying a deletion/suppression record.

## Approval gate

The team must not treat this inventory as approved. The controller identity, lawful basis per purpose, processor list, data-region/cross-border transfers, retention schedule, deletion rights, and any licensing/permit obligations must be determined by a qualified local adviser and the responsible school/adult before a real student account is created.
