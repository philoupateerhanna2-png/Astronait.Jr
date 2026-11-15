import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const auth = readFileSync(new URL('../js/features/auth.js', import.meta.url), 'utf8');
const extra = readFileSync(new URL('../js/features/extended.js', import.meta.url), 'utf8');
const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const privacy = readFileSync(new URL('../docs/privacy/data-inventory-and-retention.md', import.meta.url), 'utf8');
const authPlan = readFileSync(new URL('../docs/security/authentication-and-authorization.md', import.meta.url), 'utf8');

test('browser auth has no hard-coded administrator identity', () => {
  assert.doesNotMatch(auth, /ADMIN_EMAIL|astronautjr\.space@gmail\.com/);
  assert.match(auth, /function isAdmin\(u\)[\s\S]*?return false/);
});

test('browser auth has no third-party login event reporting', () => {
  assert.doesNotMatch(auth, /ASTROCADET_NOTIFY_ENDPOINT|formspree\.io|signin_failed|logEvent\(/);
  assert.match(auth, /Authentication event reporting is intentionally disabled/);
  assert.doesNotMatch(auth, /\bfetch\s*\(/);
});

test('browser leaderboard does not post user progress to a remote endpoint', () => {
  assert.doesNotMatch(auth, /ASTROCADET_LB_ENDPOINT|function remoteBoard/);
});

test('child contact form and AI requests are not sent directly from browser', () => {
  assert.doesNotMatch(extra, /formspree\.io|ASTROCADET_AI_ENDPOINT/);
  assert.match(extra, /Adult-supervised support/);
  assert.doesNotMatch(extra, /\bfetch\s*\(/);
  assert.match(html, /Do not use a real password or personal email/);
});

test('privacy inventory and production authentication limitations are documented', () => {
  assert.match(privacy, /Proposed retention/);
  assert.match(privacy, /External recipients and transfers/);
  assert.match(privacy, /Google Fonts/);
  assert.match(privacy, /NASA Space Place/);
  assert.match(authPlan, /not.{0,8}production authentication/i);
  assert.match(authPlan, /Supabase Auth/);
});
