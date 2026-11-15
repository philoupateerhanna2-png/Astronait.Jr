# Astronaut Jr — Picture-based About Us update

This update replaces the PDF-based About Us viewer with a responsive, photo-led webpage built from the ten presentation slides and the team portrait images supplied in the project conversation.

## Files included

- `index.html` — removes the external PDF.js script dependency.
- `astro.js` — replaces the PDF viewer with the native About Us page and adds working links to the existing Missions, Planets and Cadet views.
- `styles/` — split, ordered CSS layers for tokens, base, layout, components, responsive rules and feature styles.
- `js/` — Vanilla JavaScript utilities, content data and feature modules.
- `astronaut-jr-about-assets/` — optimized WebP images used by the new page.

## Installation

1. Make a backup of your current project folder.
2. Copy the complete project folder, preserving the `js/`, `styles/` and `astronaut-jr-about-assets/` subfolders.
3. Serve the folder over HTTP (see **Run locally** below); ES modules should not be opened using `file://`.
4. Open the website and select **About Us** from the navigation.

The assets folder must remain beside `index.html`, because the page uses relative paths such as `./astronaut-jr-about-assets/hero-astronaut.webp`.

## What changed

- The About Us experience is now a normal scrolling webpage rather than a PDF viewer.
- The page contains the project hero, challenge, mission, project journey, team profiles, prototype features, approach, technology, future vision and a call to action.
- Team profile images use the supplied astronaut portraits.
- The feature cards link to the existing Missions, Planets and Cadet sections.
- Technology copy distinguishes the current prototype from planned integrations. It does not claim that a live NASA API or a connected AI service is already implemented.
- The five-school Hurghada pilot, science-center kiosks and wider classroom expansion are presented as proposals, not existing partnerships or deployments.
- Images are converted to optimized WebP files to reduce page weight.

## Validation

- `node --check astro.js` passed.
- CSS parsing passed with no syntax errors.
- HTML parsing passed.
- All image paths referenced by the About Us markup were checked against files in the assets folder.

An interactive browser test could not be completed in the execution environment because the browser launch/navigation was blocked by its administrator policy. Please test the page in your local browser after copying the package into your project.


## Earth 3D integration

- `earth-3d.html` is the supplied interactive Three.js Earth experience.
- The Earth Explorer Notes card now includes an **Explore Earth in 3D** button.
- The 3D experience opens as a full-screen view inside Astronaut Jr.
- Use **Back to Planets**, the browser Back button, or Alt+Left to return to the planet explorer.
- Keep `earth-3d.html` beside `index.html` and `astro.js`.
- The 3D scene loads Three.js and supporting assets from public CDNs, so an internet connection is required.


## Mars 3D integration

- `mars-3d.html` is the supplied Mars Studio 3D HTML experience, kept as a separate full-page file. Its existing Three.js model, scene, controls, materials, lighting, animations and viewport logic are preserved. The only addition inside that file is a small standalone navigation layer: a **Back to Mars Page** link and its styling.
- The Mars Planet Explorer Notes now includes an **Explore Mars in 3D** button. It opens `mars-3d.html` directly as a full browser page, matching the standalone navigation approach used by Earth.
- Keep `mars-3d.html` beside `index.html`, `astro.js` and `earth-3d.html`.
- The Mars model uses Three.js and supporting libraries from public CDNs, so an internet connection is required.

## Earth & Mars Explorer image scrolling fix

- In both `earth-3d.html` and `mars-3d.html`, the picture viewer (including the illustration/photo tabs and image) is now inside the same scrollable area as the place description and facts.
- When you scroll an opened location card, the picture moves together with its text instead of staying fixed above it. The card header remains visible.
- The 3D models, image content, place descriptions and selection behavior were not changed.


## UI Design review: sections 6.3–6.6

- Mission cards now expose three explicit states: **Completed**, **Available** and **Locked**. Each state includes a visible icon and text label, a semantic data attribute, and accessible status text; locked missions remain keyboard reachable so the app can explain why they are unavailable.
- About-page images now declare intrinsic dimensions, retain descriptive alt text and lazy loading where appropriate. A shared image-error handler inserts space-themed fallback artwork without collapsing the image frame. Earth and Mars photo slots also declare dimensions and keep their existing illustrated/radar fallback behavior.
- Responsive rules were tightened for narrow phone widths and key RTL/LTR layouts, using logical spacing/alignment properties where direction matters. The Earth and Mars pages no longer disable browser zoom.
- Reduced-motion preferences now stop decorative CSS animation and the main starfield loop. Earth/Mars auto-spin starts paused for users who request reduced motion; the manual rotation control remains available and reports its pressed state accessibly.

## Validation for UI Design 6.3–6.6

- `node --check astro.js` passed.
- Inline JavaScript in `earth-3d.html` and `mars-3d.html` passed `node --check` as ES modules.
- `styles/main.css` and all ordered CSS layers preserve the original stylesheet content and cascade; inline style blocks passed CSS parsing.
- HTML parsing passed for the main, Earth and Mars pages.
- All 14 image tags in the About page include alt text and intrinsic width/height attributes; all referenced local image assets were checked.
- A live visual browser sweep at 320, 375, 768, 1024 and wide desktop could not be completed: Chromium navigation was blocked by the execution environment's administrator policy. The responsive rules were reviewed statically, but final visual confirmation should be done in a normal browser at those widths in both Arabic RTL and English LTR.


## UX improvements (7.1–7.6)
- First-use guide explains sections, guest mode, local-only saves and no cloud sync.
- Mission briefings state the objective and lesson → activity → quiz sequence; the custom Mission 7 simulator has a separate control/safety briefing.
- The daily science challenge, planet discovery and Astro quick quiz use accessible in-app dialogs; native prompts/alerts remain only in admin account-management and destructive reset flows.
- Mission checkpoints are saved locally and can be resumed.
- Arabic translation uses reviewed local dictionary entries (including all 15 mission introductions and key science terms) plus the existing device cache; no translation API is called. Detailed lesson paragraphs without a reviewed local entry remain in English rather than being silently machine-translated.
- `UX_USABILITY_TEST_PLAN.md` contains the child usability protocol and blank observation log. Real sessions still need to be conducted with guardian consent; no test findings are fabricated.


### UX validation notes
- `astro.js` passed `node --check`; the main HTML parsed with no duplicate IDs; `styles/main.css` and its layers parsed with no CSS syntax errors.
- The ZIP archive was checked for integrity.
- A live interactive browser test could not be completed in this environment; use the included usability plan and a normal browser for final interaction and visual checks.


## Code organization (Vanilla JavaScript modules)

The main experience is still plain browser JavaScript: no framework or bundler is required. `index.html` loads the local-account module and the main ES module.

### Project map

- `js/utils.js` — small shared DOM, escaping, date and storage helpers. Keep feature-specific logic out.
- `js/data/planets.js` — Sun and planet content.
- `js/data/missions.js` — mission lessons, activities, quizzes and scoring values.
- `js/data/cosmetics.js` — rarity, shop catalogue and achievement definitions.
- `js/data/videos.js` — curated video catalogue.
- `js/features/auth.js` — local accounts, guest session and sign-in UI.
- `js/features/art.js` — SVG illustration functions.
- `js/features/store.js` — local persistence and old-save migration.
- `js/features/state.js` — sound, speech, scoring, progress, shop and trophies services.
- `js/features/{progress,missions,planets,cadet-shop,trophies,astro,cinema,lab,contact-about}.js` — injectable feature boundaries. They expose small APIs and can be tested with mock dependencies.
- `js/features/extended.js` — compatibility host for AstroCinema, Training Lab and Contact/About interactions while the older inline UI is migrated.
- `js/features/language.js` — offline-first language dictionary and DOM translation behavior.
- `styles/` — ordered CSS layers. `styles/main.css` imports them in the same order as the original stylesheet to preserve the cascade.
- `astro.js` — app composition, UI rendering and the current mission/session orchestration. This remains the compatibility core; move a behavior into a feature module only with its dependencies and tests.

### Run locally

1. Install a current Node.js LTS release (only needed for tests).
2. From this folder run `npm test` to run the dependency-free unit tests.
3. Serve this folder over HTTP, for example `python -m http.server 8000`, then open `http://localhost:8000/`. ES modules and local storage should be tested from localhost rather than opening the HTML file directly.
4. No build step is required. `npm run check` performs JavaScript syntax checks on the main and core service modules.

### Team workflow

- Branch names: `feature/<short-topic>`, `fix/<issue>`, `refactor/<area>`, `docs/<topic>`.
- Keep a change focused; do not mix content edits with rendering changes unless required.
- Feature ownership is by role: **Auth owner** reviews account/session changes; **Learning owner** reviews mission and science content; **Worlds owner** reviews planet data; **Cadet economy owner** reviews cosmetics/rewards; **Experience owner** reviews UI, Astro, Cinema and Lab; **Release owner** checks integration, accessibility and regression tests. One person may hold multiple roles on a small team.
- Data owners edit `js/data/*`; presentation owners edit `astro.js` or the relevant feature module.
- Use `window.AstroCadet` only as the legacy integration boundary. New feature modules should receive dependencies as arguments and must not query or mutate another feature's private DOM/state.

### Code review checklist

- [ ] Vanilla JS only; no framework or unapproved dependency.
- [ ] Module has one documented responsibility and explicit exports.
- [ ] Dependencies are passed through an API rather than reached through another feature's internals.
- [ ] User-facing text is escaped or assigned with `textContent`; no unsafe HTML interpolation.
- [ ] Local save compatibility and old save migration are preserved.
- [ ] Keyboard, touch, RTL/LTR and reduced-motion behavior remain usable.
- [ ] `npm test` and `npm run check` pass.
- [ ] Manual smoke test covers sign-in/guest, resume mission, quiz/rewards, planet explorer, shop, trophies, cinema, lab, contact/About and language switch.
- [ ] Screenshots or a short test note are attached to the pull request.

### Pull request description

Include: purpose, changed modules, state/data contract changes, tests run, manual browser/device checks, screenshots, and any known limitations.

## Backend architecture (planned, not connected)

- `docs/architecture/ADR-001-backend-platform.md` records the decision to use one Supabase backend rather than a parallel Firebase or custom Node.js path.
- `docs/backend/data-model.md` documents users, cadets, mission progress, quiz attempts, achievements, star ledger, purchases, inventory and optional school/class entities.
- `docs/backend/api-contract.md` and `docs/backend/openapi.yaml` define authentication ownership, request/response shapes, routes and error behavior.
- `docs/backend/security.md` defines server-side identity/role/reward rules and the security tests required before launch.
- `docs/backend/sync-and-recovery.md` separates local drafts from server-confirmed progress and defines offline conflicts, two-device tests, backup/restore and account recovery.
- `docs/backend/launch-checklist.md` is the deployment and school-pilot gate.
- `supabase/migrations/` contains the reviewed starting schema; `supabase/functions/api/README.md` specifies the single future Edge Function router.

**Important:** this package does not connect to a live Supabase project. The current browser app remains a local/demo prototype. Do not put service-role keys or AI provider secrets in browser files. Apply the migration only to a new development project after a team/teacher review, then implement and test the Edge Function before enabling cloud mode.
- `docs/backend/implementation-status.md` clearly separates the architecture work completed here from the live deployment and integration work that remains.
- `supabase/config.toml` keeps JWT verification enabled for the future authenticated API function.

## Security and child privacy (Section 9)

The browser app is still a **local demo**, not a production student service. Do not use real student information, real passwords, or school rosters in this version. Local demo account data and progress remain editable in browser storage. Browser-side roles are not authoritative.

Security and privacy plans are documented here:

- `docs/security/authentication-and-authorization.md` — trusted identity, session design and server role checks.
- `docs/privacy/data-inventory-and-retention.md` — field-level data inventory, recipients, proposed retention and deletion.
- `docs/privacy/child-safeguarding-and-consent.md` — adult supervisor, guardian process and local review gates.
- `docs/security/operational-security-checklist.md` — HTTPS, secrets, rate limits, logs, dependencies and backups.
- `docs/security/section-9-acceptance-tests.md` — required synthetic-account security tests.

The local prototype no longer sends login/sign-in event telemetry, no longer sends leaderboard records to a configured remote endpoint, and its contact form no longer posts child messages to a third-party form processor. Astro now has an optional authenticated backend transport scaffold with an offline fallback; remote AI remains disabled until Supabase Auth and the Edge Function are deployed and approved. Provider credentials are server-only. See `docs/astro-assistant-section-11.md`. These changes do **not** make the app production-ready: Supabase Auth, server authorization, privacy approvals, operational controls and real deployment tests are still required.

Do not collect real child data until a named adult supervisor, the school where applicable, and a qualified Egyptian privacy/legal adviser have approved the privacy notice, consent/guardian process, processors, retention, deletion and cross-border transfer arrangements.


## My Cadet page

The latest My Cadet dashboard adds profile/rank stats, loadout overview, wardrobe search, filters, sorting and invalid-equipment fallback. See `docs/cadet-page-refresh.md` for behavior and manual browser checks.


## Astro educational assistant (Section 11)

- `docs/astro-assistant-section-11.md` — implementation and remaining acceptance gates.
- `docs/astro-assistant-review-prompts.md` — synthetic age-appropriateness and pedagogy review set.
- `docs/unicef-ai-children-3-review.md` — preliminary mapping to UNICEF Guidance on AI and Children 3.0.
- `supabase/functions/api/index.ts` — optional authenticated server-side AI route; provider secrets stay in Edge Function environment.

Remote AI is not deployed or enabled in this local demo. Without a configured same-origin endpoint and Supabase access token, Astro uses the offline knowledge base. Human teacher/safeguarding review remains required before a student pilot.

## Educational content quality (Section 14)

All 15 missions now have structured educational content records in `js/data/content-records.js`, including target age, learning objective, key concepts, official source starting points, lesson/activity/quiz pointers, misconceptions, and assessment alignment. Mission briefings display the learning objective. Automated tests validate record completeness and quiz structure. See `docs/educational-content-quality-section-14.md` for the scientific-review status, teacher-review requirements, and a pre/post learning pilot protocol. Scientific claim-by-claim review and a real learner pilot are still pending; the project does not claim those have already happened.
# astronaitJr
