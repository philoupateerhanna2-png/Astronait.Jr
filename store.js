/* Local persistence and save migration. No DOM rendering belongs here. */
const SAVE_KEY = (window.AstroAuth && window.AstroAuth.saveKey()) || "astrocadet.v3.save";
const LEGACY_KEYS = ["astrocadet.v2.save", "astrocadet.save"];

/* Every cosmetic slot, with the free starter item that is always owned. */
const SLOT_DEFAULTS = {
  skin:"skin_moonlight", hair:"hair_skin_default", eyes:"eyes_classic", expression:"expression_smile", suit:"suit_classic", helmet:"helm_bubble", visor:"visor_clear", hat:"hat_none",
  backpack:"pack_std", boots:"boot_std", gloves:"glove_std", cape:"cape_none",
  pet:"pet_none", badge:"badge_none", trail:"trail_none"
};

const DEFAULT_STATE = () => ({
  name: "", stars: 0, earnedTotal: 0, completed: [], stageStars: {}, stageAttempts: {},
  scoredQuestions: {}, lessonSeen: {}, missionCheckpoint: null, onboardingSeen: false,
  planetsSeen: {}, owned: Object.values(SLOT_DEFAULTS), equipped: Object.assign({}, SLOT_DEFAULTS),
  achievements: [], pipAsked: 0, settings: { sound: true, voice: false, calm: false },
  createdAt: Date.now(), version: 3
});

const Store = {
  state: null,
  load() {
    try {
      let raw = localStorage.getItem(SAVE_KEY);
      if (!raw) for (const key of LEGACY_KEYS) { const old = localStorage.getItem(key); if (old) { raw = old; break; } }
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object") return null;
      const base = DEFAULT_STATE();
      const owned = Array.isArray(parsed.owned) && parsed.owned.length ? parsed.owned.slice() : base.owned.slice();
      Object.values(SLOT_DEFAULTS).forEach(id => { if (!owned.includes(id)) owned.push(id); });
      return Object.assign(base, parsed, {
        settings: Object.assign(base.settings, parsed.settings || {}),
        equipped: Object.assign({}, SLOT_DEFAULTS, parsed.equipped || {}), owned,
        completed: Array.isArray(parsed.completed) ? parsed.completed : [],
        achievements: Array.isArray(parsed.achievements) ? parsed.achievements : [],
        stageStars: parsed.stageStars || {}, stageAttempts: parsed.stageAttempts || {},
        scoredQuestions: parsed.scoredQuestions || {}, lessonSeen: parsed.lessonSeen || {},
        planetsSeen: parsed.planetsSeen || {}, version: 3
      });
    } catch (error) { console.warn("Could not read save:", error); return null; }
  },
  save() {
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(this.state)); }
    catch (error) { console.warn("Could not write save:", error); }
  },
  reset() { try { localStorage.removeItem(SAVE_KEY); LEGACY_KEYS.forEach(key => localStorage.removeItem(key)); } catch {} }
};

export { SAVE_KEY, LEGACY_KEYS, SLOT_DEFAULTS, DEFAULT_STATE, Store };
