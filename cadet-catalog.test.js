import test from "node:test";
import assert from "node:assert/strict";
import { filterCadetItems } from "../js/features/cadet-catalog.js";

const items = [
  { id: "starter", name: "Classic Suit", desc: "Starter gear", price: 0, rarity: "common" },
  { id: "nebula", name: "Nebula Suit", desc: "Violet cosmic suit", price: 100, rarity: "rare" },
  { id: "solar", name: "Solar Suit", desc: "Bright gold suit", price: 250, rarity: "epic" },
  { id: "legend", name: "Legend Suit", desc: "Top collection", price: 900, rarity: "legendary" }
];

test("cadet catalogue searches item name, description and rarity", () => {
  assert.deepEqual(filterCadetItems(items, { query: "violet" }).map(x => x.id), ["nebula"]);
  assert.deepEqual(filterCadetItems(items, { query: "legendary" }).map(x => x.id), ["legend"]);
});

test("cadet catalogue filters owned, affordable and locked items", () => {
  const common = { ownedIds: ["starter"], stars: 150 };
  assert.deepEqual(filterCadetItems(items, { ...common, filter: "owned" }).map(x => x.id), ["starter"]);
  assert.deepEqual(filterCadetItems(items, { ...common, filter: "available" }).map(x => x.id), ["nebula"]);
  assert.deepEqual(filterCadetItems(items, { ...common, filter: "locked" }).map(x => x.id), ["solar", "legend"]);
});

test("cadet catalogue sorts by price, rarity and recommended state", () => {
  assert.deepEqual(filterCadetItems(items, { sort: "price-high" }).map(x => x.id), ["legend", "solar", "nebula", "starter"]);
  assert.deepEqual(filterCadetItems(items, { sort: "rarity" }).map(x => x.id), ["starter", "nebula", "solar", "legend"]);
  assert.deepEqual(filterCadetItems(items, { ownedIds: ["nebula"], stars: 300, equippedId: "solar" }).map(x => x.id), ["solar", "nebula", "starter", "legend"]);
});

test("cadet catalogue handles missing data safely", () => {
  assert.deepEqual(filterCadetItems(null), []);
  assert.deepEqual(filterCadetItems(items, { filter: "unknown", sort: "unknown" }).length, 4);
});


test("character skins catalogue includes a free starter and varied unlocks", async () => {
  const { SKINS, COSMETIC_TABS } = await import("../js/data/cosmetics.js");
  const skinTab = COSMETIC_TABS.find(tab => tab.key === "skin");
  assert.ok(skinTab);
  assert.equal(skinTab.list, SKINS);
  assert.equal(SKINS[0].id, "skin_moonlight");
  assert.equal(SKINS[0].price, 0);
  assert.ok(SKINS.length >= 8);
  assert.ok(SKINS.every(item => item.colors && /^#[0-9a-f]{6}$/i.test(item.colors.face)));
});

test("character skin can be searched and filtered like other cosmetics", async () => {
  const { SKINS } = await import("../js/data/cosmetics.js");
  assert.deepEqual(filterCadetItems(SKINS, { query: "martian" }).map(item => item.id), ["skin_mint"]);
  assert.deepEqual(filterCadetItems(SKINS, { ownedIds: ["skin_moonlight"], filter: "owned" }).map(item => item.id), ["skin_moonlight"]);
});


test("character catalogue includes veteran astronaut and scientist personas", async () => {
  const { SKINS } = await import("../js/data/cosmetics.js");
  const byId = Object.fromEntries(SKINS.map(item => [item.id, item]));
  assert.ok(byId.skin_old_astronaut.features.beard);
  assert.ok(byId.skin_scientist_junior.features.glasses);
  assert.ok(byId.skin_scientist_pro.features.hair);
  assert.ok(byId.skin_professor_nova.features.mustache);
  assert.ok(byId.skin_field_scientist.features.hair);
  assert.ok([byId.skin_old_astronaut, byId.skin_scientist_junior, byId.skin_scientist_pro, byId.skin_professor_nova, byId.skin_field_scientist].every(item => item.price > 0));
});


test("character creator has independent hair, eye and expression collections", async () => {
  const { HAIR_STYLES, EYE_STYLES, EXPRESSIONS, COSMETIC_TABS } = await import("../js/data/cosmetics.js");
  assert.ok(HAIR_STYLES.length >= 5);
  assert.ok(EYE_STYLES.length >= 4);
  assert.ok(EXPRESSIONS.length >= 4);
  for (const key of ["hair", "eyes", "expression"]) assert.ok(COSMETIC_TABS.some(tab => tab.key === key));
});

test("character creator renders independent hair, eye and expression choices", async () => {
  const { ART } = await import("../js/features/art.js");
  const classic = ART.cadet({ skin: "skin_moonlight", hair: "hair_classic", eyes: "eyes_bright", expression: "expression_grin" });
  const spiky = ART.cadet({ skin: "skin_moonlight", hair: "hair_spiky", eyes: "eyes_sleepy", expression: "expression_surprised" });
  assert.match(classic, /M77 64c-4-11/);
  assert.match(classic, /M88 86q12 17 24 0/);
  assert.match(spiky, /M77 64 72 45/);
  assert.match(spiky, /rx="4.5" ry="6"/);
  assert.match(ART.thumb("hair", { name: "Classic", style: "classic", color: "#65402c" }), /<svg/);
  assert.match(ART.thumb("eyes", { name: "Star", style: "star" }), /<svg/);
  assert.match(ART.thumb("expression", { name: "Grin", style: "grin" }), /<svg/);
});
