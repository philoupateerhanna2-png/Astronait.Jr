import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const astro = readFileSync(new URL('../astro.js', import.meta.url), 'utf8');
const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const edge = readFileSync(new URL('../supabase/functions/api/index.ts', import.meta.url), 'utf8');
const review = readFileSync(new URL('../docs/astro-assistant-section-11.md', import.meta.url), 'utf8');

test('Astro has a working offline fallback when endpoint or token is absent', () => {
  assert.match(astro, /if \(!endpoint \|\| !token/);
  assert.match(astro, /const reply = this\.reply\(text\)/);
  assert.match(astro, /Quick check:/);
});

test('browser sends requests only to configured backend and never embeds provider credentials', () => {
  assert.match(astro, /window\.ASTRO_CONFIG\.assistantEndpoint/);
  assert.match(astro, /Authorization.*Bearer/);
  assert.doesNotMatch(astro, /AI_PROVIDER_API_KEY|sk-[A-Za-z0-9]{12,}/);
});

test('assistant request is length-limited and does not send profile/history fields', () => {
  assert.match(astro, /slice\(0, 240\)/);
  assert.match(astro, /JSON\.stringify\(\{ message: text, mode:/);
  assert.doesNotMatch(astro, /JSON\.stringify\(\{[^}]*history|userName|schoolName/);
});

test('Astro includes safety refusal, AI disclosure, privacy notice and reporting path', () => {
  assert.match(astro, /safetyReply\(text\)/);
  assert.match(html, /AI-assisted learning helper/);
  assert.match(html, /Don’t share your full name/);
  assert.match(html, /Report a concern \(ask an adult\)/);
});

test('backend verifies Supabase identity and keeps provider key server-side', () => {
  assert.match(edge, /supabase\.auth\.getUser\(\)/);
  assert.match(edge, /Deno\.env\.get\("AI_PROVIDER_API_KEY"\)/);
  assert.match(edge, /ASTRO_ALLOWED_ORIGINS/);
  assert.match(edge, /message\.length > 240/);
  assert.match(edge, /unsafeRequest/);
  assert.doesNotMatch(edge, /SUPABASE_SERVICE_ROLE_KEY/);
});

test('backend restricts factual sources to approved NASA URLs', () => {
  assert.match(edge, /approvedSources/);
  assert.match(edge, /sources must be selected only from this list/i);
  assert.match(astro, /https:\/\/spaceplace\.nasa\.gov\//);
});

test('section 11 documentation does not falsely claim full production completion', () => {
  assert.match(review, /not been deployed/i);
  assert.match(review, /human approval.*pending/i);
  assert.match(review, /Do not describe Section 11 as fully done/);
});
