import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (file) => readFileSync(new URL(`../${file}`, import.meta.url), "utf8");

test("Astro narration stops on hidden page, focus loss, navigation and unload", () => {
  const source = read("js/features/state.js");
  assert.match(source, /document\.addEventListener\("visibilitychange"[\s\S]*?if \(document\.hidden\) Talk\.stop\(\)/);
  for (const event of ["pagehide", "beforeunload", "hashchange", "popstate", "blur"]) {
    assert.match(source, new RegExp(`"${event}"`));
  }
});

test("changing the app language cancels the active Astro narration", () => {
  const source = read("js/features/language.js");
  assert.match(source, /if \(l !== lang\) \{/);
  assert.match(source, /AstroCadet\.Talk\.stop\(\)/);
  assert.match(source, /window\.location\.reload\(\)/);
  assert.match(source, /localStorage\.setItem\("aj-lang", l\)/);
});

test("Mars and Earth read-aloud stop when a different region is selected", () => {
  const mars = read("mars-3d.html");
  const earth = read("earth-3d.html");
  assert.match(mars, /if \(selectedPlaceId !== id\) stopSpeech\(\);\s*selectedPlaceId = id;/);
  assert.match(earth, /if \(selectedWonderId !== id\) stopSpeech\(\);\s*selectedWonderId = id;/);
});

test("3D narration stops when its inspector region is hidden by any UI path", () => {
  for (const file of ["mars-3d.html", "earth-3d.html"]) {
    const source = read(file);
    assert.match(source, /getElementById\('landmark-inspector'\)/);
    assert.match(source, /new MutationObserver\(\(\) => \{\s*if \(speechRegion\.classList\.contains\('hidden'\)\) stopSpeech\(\);/);
    assert.match(source, /window\.addEventListener\('pagehide', stopSpeech\)/);
    assert.match(source, /window\.addEventListener\('blur', stopSpeech\)/);
    assert.match(source, /btn-global-view'\)\.addEventListener\('click', \(\) => \{\s*stopSpeech\(\);/);
  }
});
