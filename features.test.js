import test from "node:test";
import assert from "node:assert/strict";
import { createProgressFeature } from "../js/features/progress.js";
import { createMissionsFeature } from "../js/features/missions.js";
import { createPlanetsFeature } from "../js/features/planets.js";
import { createCadetShopFeature } from "../js/features/cadet-shop.js";
import { createTrophiesFeature } from "../js/features/trophies.js";
import { createAstroFeature } from "../js/features/astro.js";
import { createCinemaFeature } from "../js/features/cinema.js";
import { createLabFeature } from "../js/features/lab.js";
import { createContactAboutFeature } from "../js/features/contact-about.js";
import { PLANETS, STAGES, COSMETIC_TABS, SKINS } from "../js/data/index.js";
import { ART } from "../js/features/art.js";

test("progress adapter returns a read-only snapshot", () => {
 const store={state:{completed:[1]}}; const progress={nextStage:()=>({id:2}),rank:()=>({name:"Cadet"}),isDone:id=>id===1,unlocked:id=>id<3};
 const api=createProgressFeature({store,progress}); assert.deepEqual(api.snapshot(),{completed:[1],nextStage:{id:2},rank:{name:"Cadet"}}); assert.equal(api.isDone(1),true);
});
test("mission adapter delegates actions to the app",()=>{let opened=0;const app={openMission:id=>opened=id};const session={stage:{id:2},phase:"quiz",lesson:1,qIndex:0};const api=createMissionsFeature({app,session,store:{state:{missionCheckpoint:{stageId:2}}},stages:[{id:2,title:"Test"}]});api.open(2);assert.equal(opened,2);assert.equal(api.current().phase,"quiz");});
test("planet adapter exposes content and delegates open",()=>{let opened="";const api=createPlanetsFeature({app:{openPlanet:id=>opened=id},sun:{id:"sun",name:"Sun"},planets:[{id:"earth",name:"Earth"}]});assert.equal(api.list().length,2);api.open("earth");assert.equal(opened,"earth");});
test("shop and trophy adapters delegate without owning state",()=>{let bought="";const shop={look:()=>({suit:"a"}),find:id=>({id}),ownedCount:()=>1};const app={buyItem:id=>bought=id,equipItem:()=>true};const api=createCadetShopFeature({shop,app});api.buy("hat");assert.equal(bought,"hat");const t=createTrophiesFeature({trophies:{check:()=>1,has:id=>id==="x",earnedCount:()=>2}});assert.equal(t.has("x"),true);});

test("Astro adapter delegates questions and speech",()=>{let asked="",said="";const api=createAstroFeature({pip:{ask:q=>asked=q,toggle:()=>true},talk:{say:t=>said=t,stop:()=>true}});api.ask("orbit");api.talk("hello");assert.equal(asked,"orbit");assert.equal(said,"hello");});
test("Cinema and Lab adapters delegate to the extended feature host",()=>{let view="",played="";const extra={showExtra:id=>view=id,playCinema:id=>played=id,daily:()=>true};const cinema=createCinemaFeature({extra});cinema.open();cinema.play("video-1");assert.equal(view,"cinema");assert.equal(played,"video-1");const lab=createLabFeature({extra});lab.open();assert.equal(view,"lab");assert.equal(lab.daily(),true);});
test("Contact and About adapter opens the corresponding view",()=>{let view="";const api=createContactAboutFeature({app:{go:id=>view=id},extra:{showExtra:id=>view=id}});api.openAbout();assert.equal(view,"about");api.openContact();assert.equal(view,"contact");});
test("content modules keep mission, planet and cosmetics data available",()=>{assert.equal(PLANETS.length,8);assert.equal(STAGES.length,15);assert.ok(COSMETIC_TABS.length>0);assert.ok(SKINS.length>=8);});

test("Store module preserves legacy save migration and checkpoint defaults", async () => {
  const values = new Map([["astrocadet.v2.save", JSON.stringify({ name: "Nova", completed: [1], missionCheckpoint: { stageId: 2, phase: "quiz", qIndex: 1 } })]]);
  globalThis.window = { AstroAuth: { saveKey: () => "test-save" } };
  globalThis.localStorage = {
    getItem: key => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: key => values.delete(key)
  };
  const { Store, DEFAULT_STATE } = await import("../js/features/store.js?store-test");
  const loaded = Store.load();
  assert.equal(loaded.name, "Nova");
  assert.deepEqual(loaded.completed, [1]);
  assert.deepEqual(loaded.missionCheckpoint, { stageId: 2, phase: "quiz", qIndex: 1 });
  assert.equal(DEFAULT_STATE().version, 3);
  assert.equal(DEFAULT_STATE().equipped.skin, "skin_moonlight");
  assert.ok(DEFAULT_STATE().owned.includes("skin_moonlight"));
  Store.state = loaded; Store.save();
  assert.ok(values.has("test-save"));
  delete globalThis.window; delete globalThis.localStorage;
});


test("cadet avatar renderer accepts skin selections and creates skin thumbnails", () => {
  const avatar = ART.cadet({ skin: "skin_mint", suit: "suit_classic" });
  assert.match(avatar, /#8ce0b4/i);
  assert.match(avatar, /role="img"/);
  const skin = SKINS.find(item => item.id === "skin_mint");
  assert.match(ART.thumb("skin", skin), /#8ce0b4/i);
});

test("veteran and scientist skins render their distinguishing face details", () => {
  const veteran = ART.cadet({ skin: "skin_old_astronaut" });
  const junior = ART.cadet({ skin: "skin_scientist_junior" });
  const professor = ART.cadet({ skin: "skin_professor_nova" });
  assert.match(veteran, /#e7edf5/);
  assert.match(veteran, /silver/);
  assert.match(junior, /<circle cx="89" cy="75" r="8"/);
  assert.match(professor, /white/);
  assert.match(ART.thumb("skin", SKINS.find(item => item.id === "skin_old_astronaut")), /#e7edf5/);
});
