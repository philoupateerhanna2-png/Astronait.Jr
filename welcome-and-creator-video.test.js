import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const auth = readFileSync(new URL('../js/features/auth.js', import.meta.url), 'utf8');
const about = readFileSync(new URL('../js/features/extended.js', import.meta.url), 'utf8');
const css = readFileSync(new URL('../styles/features.css', import.meta.url), 'utf8');

test('welcome tour appears before the login screen and has an enter action', () => {
  assert.ok(html.indexOf('id="welcomeIntro"') < html.indexOf('id="authScreen"'));
  assert.match(html, /id="welcomeEnter"/);
  assert.match(auth, /function showLogin\(\)/);
  assert.match(auth, /syncWelcomeLanguage\(\)/);
  assert.match(auth, /intro\.classList\.add\("is-visible"\)/);
});

test('welcome tour reuses the About Us visual assets and includes Arabic and English copy', () => {
  assert.match(html, /astronaut-jr-about-assets\/hero-astronaut\.webp/);
  assert.match(html, /astronaut-jr-about-assets\/planetarium-child\.webp/);
  assert.match(html, /astronaut-jr-about-assets\/mission-telescope\.webp/);
  assert.match(html, /data-welcome-ar=/);
  assert.match(html, /data-welcome-en=/);
  assert.match(css, /prefers-reduced-motion:reduce/);
});

test('About Us provides a creator video slot with a documented stable filename', () => {
  assert.match(about, /id="about-creator"/);
  assert.match(about, /src="\.\/assets\/creator-intro\.mp4"/);
  assert.match(about, /controls playsinline preload="metadata"/);
});
