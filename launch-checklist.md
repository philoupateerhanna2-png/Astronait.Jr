# Backend launch checklist

## Child privacy and school approval — blocking gate

- [ ] A named adult supervisor and backup owner accept responsibility.
- [ ] A qualified Egyptian privacy/legal adviser reviews Law No. 151/2020, Executive Regulations and current PDPC guidance for this exact deployment.
- [ ] The school approves any student pilot, controller/processor roles, teacher access and roster use in writing.
- [ ] Arabic privacy notice, guardian consent route, child-facing explanation, age-handling method, retention and deletion are approved.
- [ ] Data processors, hosting region and cross-border transfers are reviewed and disclosed.
- [ ] No real child data is used before all approvals are complete.

## Before creating a production project

- [ ] Team and school agree that online accounts are needed.
- [ ] Teacher/school representative reviews data fields, roles, leaderboard, retention and deletion process.
- [ ] Confirm hosting/data-region requirements, provider terms and current pricing.
- [ ] Name a technical owner and backup owner for billing, secrets, migrations and incident response.
- [ ] Choose the approved Supabase plan and set billing alerts/spend controls.

## Before first deployment

- [ ] Create separate development and production Supabase projects.
- [ ] Apply migrations through version control; never edit production schema only in the dashboard.
- [ ] Configure Auth email verification, password reset and allowed redirect URLs.
- [ ] Add Edge Function secrets through the provider dashboard/CLI; do not commit them.
- [ ] Deploy the single `api` Edge Function and verify token validation and role checks.
- [ ] Review every RLS policy and direct table grant.
- [ ] Run the security tests in `security.md` and database tests in `supabase/tests/`.
- [ ] Configure rate limits, logs, backup schedule and restore drill.
- [ ] Confirm no secrets are present in browser JS, HTML, source maps or Git history.

## Before migrating prototype users

- [ ] Do not migrate local passwords or roles.
- [ ] Decide whether legacy progress is discarded, imported as unverified history, or recalculated under a teacher-approved rule.
- [ ] Explain that local guest data may not transfer.
- [ ] Test sign-up, verification, sign-in, sign-out and account recovery.
- [ ] Test two devices and offline conflict handling.
- [ ] Keep cloud mode behind a feature flag until all acceptance tests pass.

## Rollout

- [ ] Start with a small internal test group using synthetic data.
- [ ] Review errors, abuse controls, cost and support process.
- [ ] Only then request school approval for a student pilot.
- [ ] Document rollback: disable cloud writes, preserve server data, and keep local demo mode available without claiming it is synced.
