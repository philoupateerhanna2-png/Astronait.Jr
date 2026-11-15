import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const theme = readFileSync(new URL('../js/features/theme.js', import.meta.url), 'utf8');
const language = readFileSync(new URL('../js/features/language.js', import.meta.url), 'utf8');
const css = readFileSync(new URL('../styles/kids-theme.css', import.meta.url), 'utf8');
const rtlCss = readFileSync(new URL('../styles/features.css', import.meta.url), 'utf8');

test('settings exposes explicit light/dark and English/Arabic controls', () => {
  assert.match(html, /data-theme-choice="light"/);
  assert.match(html, /data-theme-choice="dark"/);
  assert.match(html, /data-lang="en"/);
  assert.match(html, /data-lang="ar"/);
  assert.match(html, /settingsLanguageTitle/);
});

test('theme controls share one persisted theme API', () => {
  assert.match(theme, /window\.AstroTheme/);
  assert.match(theme, /data-theme-choice/);
  assert.match(theme, /localStorage\.setItem\(STORAGE_KEY/);
});

test('language system uses reviewed offline translations and persists selection', () => {
  assert.match(language, /localStorage\.setItem\("aj-lang", l\)/);
  assert.match(language, /document\.documentElement\.dir = l === "ar" \? "rtl" : "ltr"/);
  assert.match(language, /Mission titles, lesson headings and planet labels are translated/);
  assert.doesNotMatch(language, /aj-ar-cache|fetch\s*\(/);
});


test('changing language persists selection and rebuilds the complete interface', () => {
  assert.match(language, /if \(l !== lang\) \{/);
  assert.match(language, /localStorage\.setItem\("aj-lang", l\)/);
  assert.match(language, /window\.location\.reload\(\)/);
  assert.match(language, /AstroCadet\.Talk\.stop\(\)/);
  assert.match(language, /return;\s*\}/);
});

test('settings controls have responsive and keyboard-visible styles', () => {
  assert.match(css, /\.settings-choice-row/);
  assert.match(css, /\.settings-choice-btn:focus-visible/);
  assert.match(css, /@media\(max-width:520px\)/);
});


test("resources page is integrated into the main navigation", () => {
  const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
  assert.match(html, /data-view="resources"/);
  assert.match(html, /id="view-resources"/);
  assert.match(html, /NASA Open APIs/);
  assert.match(html, /UNICEF Policy Guidance on AI for Children/);
  assert.match(html, /Playwright/);
  assert.match(html, /rel="noopener noreferrer"/);
});

test("resources page has reviewed Arabic translations", () => {
  const language = readFileSync(new URL("../js/features/language.js", import.meta.url), "utf8");
  assert.match(language, /Scientific Resources & References/);
  assert.match(language, /المصادر والمراجع العلمية/);
  assert.match(language, /NASA Resources/);
});


test("Arabic dictionary covers all 15 mission names and core lesson labels", async () => {
  const { STAGES } = await import("../js/data/missions.js");
  const language = readFileSync(new URL("../js/features/language.js", import.meta.url), "utf8");
  for (const stage of STAGES) {
    assert.ok(language.includes(JSON.stringify(stage.title) + ": ["), `Missing Arabic mission title: ${stage.title}`);
    for (const lesson of stage.lessons) {
      assert.ok(language.includes(JSON.stringify(lesson.h) + ": ["), `Missing Arabic lesson heading: ${lesson.h}`);
    }
    assert.ok(language.includes(JSON.stringify(stage.activity.title) + ": ["), `Missing Arabic activity title: ${stage.activity.title}`);
  }
});

test("Arabic dictionary covers the complete planet catalogue names and common fact labels", async () => {
  const { PLANETS, SUN_INFO } = await import("../js/data/planets.js");
  const language = readFileSync(new URL("../js/features/language.js", import.meta.url), "utf8");
  for (const planet of [...PLANETS, SUN_INFO]) {
    assert.ok(language.includes(JSON.stringify(planet.name) + ": ["), `Missing Arabic planet name: ${planet.name}`);
  }
  for (const label of ["Diameter", "Distance from Sun", "Day length", "Year length", "Moons", "Temperature"]) {
    assert.ok(language.includes(JSON.stringify(label) + ": ["), `Missing Arabic planet label: ${label}`);
  }
});


test('Arabic is applied before first paint and the RTL layout has dedicated typography and component rules', () => {
  assert.match(html, /const language = localStorage\.getItem\("aj-lang"\)/);
  assert.match(html, /document\.documentElement\.dir = selectedLanguage === "ar" \? "rtl" : "ltr"/);
  assert.match(rtlCss, /html\[dir="rtl"\] body/);
  assert.match(rtlCss, /font-family:"Noto Sans Arabic",Tahoma/);
  assert.match(rtlCss, /html\[dir="rtl"\] \.quiz-options button\{text-align:right\}/);
  assert.match(rtlCss, /html\[dir="rtl"\] \.cadet-command-hero/);
});
