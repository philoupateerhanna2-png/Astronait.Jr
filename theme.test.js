import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const themeJs = readFileSync(new URL('../js/features/theme.js', import.meta.url), 'utf8');
const themeCss = readFileSync(new URL('../styles/kids-theme.css', import.meta.url), 'utf8');

test('theme switch is visible, keyboard-operable and announced accessibly', () => {
  assert.match(html, /id="btnTheme"[^>]*type="button"/);
  assert.match(html, /aria-label="Switch to dark mode"/);
  assert.match(html, /aria-pressed="false"/);
  assert.match(html, /js\/features\/theme\.js/);
});

test('theme preference is restored and persisted safely', () => {
  assert.match(themeJs, /localStorage\.getItem\(STORAGE_KEY\)/);
  assert.match(themeJs, /localStorage\.setItem\(STORAGE_KEY/);
  assert.match(themeJs, /catch \(_\)/);
  assert.match(themeJs, /aria-pressed/);
});

test('light and dark themes both define readable surfaces and controls', () => {
  assert.match(themeCss, /:root\[data-theme="dark"\]/);
  assert.match(themeCss, /:root\[data-theme="dark"\] \.sheet/);
  assert.match(themeCss, /:root\[data-theme="dark"\] input/);
  assert.match(themeCss, /:focus-visible/);
});
