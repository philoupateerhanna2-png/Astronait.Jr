/* Local persistence and save migration. Kept separate from presentation and rewards. */
import { SLOT_DEFAULTS, DEFAULT_STATE, SAVE_KEY, LEGACY_KEYS, Store } from "./store.js";
import { STAGES, STAGE_BONUS, QUIZ_POINTS, LESSON_POINTS, PLANET_POINTS, PRACTICE_STIPEND,
  RARITY, RARITY_ORDER, SKINS, SUITS, HELMETS, VISORS, HATS, BACKPACKS, BOOTS, GLOVES, CAPES, PETS, BADGES, TRAILS,
  COSMETIC_TABS, ACHIEVEMENTS } from "../data/index.js";
/* ---------- sound ---------- */
const Sound = {
  enabled: true,
  ctx: null,
  ensure() {
    if (!this.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) this.ctx = new AC();
    }
    if (this.ctx && this.ctx.state === "suspended") this.ctx.resume();
    return this.ctx;
  },
  tone(freq, type, dur, gainVal) {
    if (!this.enabled) return;
    const ctx = this.ensure();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type || "sine";
      osc.frequency.value = freq;
      const g = gainVal == null ? 0.07 : gainVal;
      gain.gain.setValueAtTime(g, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0008, ctx.currentTime + dur);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + dur);
    } catch (e) {}
  },
  click() { this.tone(560, "sine", 0.07, 0.05); },
  success() {
    if (!this.enabled) return;
    this.tone(523.25, "triangle", 0.12, 0.07);
    setTimeout(() => this.tone(659.25, "triangle", 0.12, 0.07), 95);
    setTimeout(() => this.tone(783.99, "triangle", 0.2, 0.07), 190);
  },
  wrong() { this.tone(210, "sawtooth", 0.16, 0.05); },
  coin() {
    if (!this.enabled) return;
    this.tone(880, "square", 0.07, 0.045);
    setTimeout(() => this.tone(1320, "square", 0.1, 0.04), 70);
  },
  fanfare() {
    if (!this.enabled) return;
    [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => this.tone(f, "triangle", 0.22, 0.075), i * 110));
  }
};

/* ---------- speech (Web Speech API) ----------
   Rules that keep this safe and pleasant:
   - nothing is ever spoken before a real user gesture (browser autoplay policy)
   - the global toggle is persisted, and defaults to OFF
   - a new line always cancels the previous one, so cards never talk over each other
   ------------------------------------------------------------ */
const Talk = {
  enabled: false,          // must be switched on; never speaks before a click
  supported: "speechSynthesis" in window,
  voice: null,
  unlocked: false,         // becomes true after the first user gesture
  speaking: false,

  /* Pick a friendly, high-pitched English voice when one is available. */
  pickVoice() {
    if (!this.supported) return null;
    try {
      const voices = window.speechSynthesis.getVoices() || [];
      if (!voices.length) return null;
      const wanted = (window.AstroLanguage && window.AstroLanguage.get()) || document.documentElement.lang || "en";
      const poolWanted = voices.filter(v => (v.lang || "").toLowerCase().startsWith(wanted.toLowerCase()));
      const en = voices.filter(v => /^en(-|_|$)/i.test(v.lang || ""));
      const pool = poolWanted.length ? poolWanted : (en.length ? en : voices);
      const prefer = [
        /google uk english female/i, /google us english/i, /samantha/i, /karen/i,
        /moira/i, /tessa/i, /zira/i, /female/i, /natural/i
      ];
      for (const re of prefer) {
        const hit = pool.find(v => re.test(v.name || ""));
        if (hit) return hit;
      }
      return pool[0];
    } catch (e) { return null; }
  },

  init() {
    if (!this.supported) return;
    this.voice = this.pickVoice();
    try {
      window.speechSynthesis.onvoiceschanged = () => { this.voice = this.pickVoice(); };
    } catch (e) {}
  },

  /* Called from a real click handler so the browser allows audio. */
  unlock() {
    if (!this.supported || this.unlocked) return;
    this.unlocked = true;
    try {
      const u = new SpeechSynthesisUtterance(" ");
      u.volume = 0;
      window.speechSynthesis.speak(u);
    } catch (e) {}
  },

  say(text, opts) {
    if (!this.enabled || !this.supported) return false;
    const sourceText = String(text == null ? "" : text);
    const localizedText = window.AstroLanguage ? window.AstroLanguage.translate(sourceText) : sourceText;
    const clean = String(localizedText)
      .replace(/[★☆•→←✓✔]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    if (!clean) return false;
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(clean);
      if (!this.voice) this.voice = this.pickVoice();
      const wanted = (window.AstroLanguage && window.AstroLanguage.get()) || document.documentElement.lang || "en";
      if (this.voice) { u.voice = this.voice; u.lang = this.voice.lang || (wanted === "ar" ? "ar-EG" : wanted === "es" ? "es-ES" : "en-US"); }
      else u.lang = wanted === "ar" ? "ar-EG" : wanted === "es" ? "es-ES" : "en-US";
      const o = opts || {};
      u.pitch = o.pitch == null ? 1.22 : o.pitch;   // a touch high = friendly robot
      u.rate = o.rate == null ? 0.97 : o.rate;      // slightly slow for young readers
      u.volume = o.volume == null ? 0.95 : o.volume;
      u.onstart = () => { this.speaking = true; };
      u.onend = () => { this.speaking = false; };
      u.onerror = () => { this.speaking = false; };
      window.speechSynthesis.speak(u);
      return true;
    } catch (e) { return false; }
  },

  /* Read a whole lesson card: heading, body, then Astro's note. */
  sayCard(stage, lesson) {
    if (!lesson) return false;
    const parts = [lesson.h + "."];
    (lesson.p || []).forEach(p => parts.push(p));
    if (lesson.note) parts.push("Astro's note. " + lesson.note);
    return this.say(parts.join(" "), { rate: 0.95 });
  },

  stop() {
    if (!this.supported) return;
    try { window.speechSynthesis.cancel(); } catch (e) {}
    this.speaking = false;
  }
};


// Stop Astro narration whenever the app is no longer actively visible.
// Speech is intentionally not resumed automatically when the learner returns.
if (typeof document !== "undefined") {
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) Talk.stop();
  });
}
if (typeof window !== "undefined") {
  // A narration belongs to the view where it was started. Never let it
  // continue after in-app navigation, browser back/forward, or focus loss.
  ["pagehide", "beforeunload", "hashchange", "popstate", "blur"].forEach(type => {
    window.addEventListener(type, () => Talk.stop());
  });
}

/* ---------- scoring guard ----------
   Two independent locks:
   (a) question-level: answered[] per quiz session, plus a data-answered
       attribute the click handler checks before anything else.
   (b) stage-level: a stage pays out only if it is not in state.completed.
   ------------------------------------------------------------ */
const Award = {
  points(n, reason) {
    const s = Store.state;
    s.stars += n;
    s.earnedTotal += n;
    Store.save();
    window.AstroCadet.UI.syncHUD();
    window.AstroCadet.UI.toast(`+${n} stars${reason ? " · " + reason : ""}`, "mint");
    Sound.coin();
  },
  completeStage(stage) {
    const s = Store.state;
    if (s.completed.includes(stage.id)) return { already: true, bonus: 0 };
    s.completed.push(stage.id);
    s.completed.sort((a, b) => a - b);
    s.stars += STAGE_BONUS;
    s.earnedTotal += STAGE_BONUS;
    Store.save();
    return { already: false, bonus: STAGE_BONUS };
  },
  lessonSeen(stageId, idx) {
    const s = Store.state;
    const key = stageId + ":" + idx;
    if (s.lessonSeen[key]) return 0;
    s.lessonSeen[key] = true;
    s.stars += LESSON_POINTS;
    s.earnedTotal += LESSON_POINTS;
    Store.save();
    return LESSON_POINTS;
  },
  /* A small training stipend for replaying a finished mission, so a cadet who
     really wants a legendary item can keep flying for it. */
  practiceStipend() {
    const s = Store.state;
    s.stars += PRACTICE_STIPEND;
    s.earnedTotal += PRACTICE_STIPEND;
    Store.save();
    return PRACTICE_STIPEND;
  },
  planetSeen(id) {
    const s = Store.state;
    if (s.planetsSeen[id]) return 0;
    s.planetsSeen[id] = true;
    s.stars += PLANET_POINTS;
    s.earnedTotal += PLANET_POINTS;
    Store.save();
    return PLANET_POINTS;
  }
};

/* ---------- progression ---------- */
const Progress = {
  unlocked(stageId) {
    // Mission 1 is always open. A mission opens when the one before it is finished.
    if (stageId === 1) return true;
    return Store.state.completed.includes(stageId - 1) || Store.state.completed.includes(stageId);
  },
  isDone(stageId) { return Store.state.completed.includes(stageId); },
  nextStage() {
    const next = STAGES.find(st => !Store.state.completed.includes(st.id));
    return next || null;
  },
  rank() {
    const done = Store.state.completed.length;
    const tiers = [
      { at: 0,  name: "Space Trainee" },
      { at: 1,  name: "Star Scout" },
      { at: 2,  name: "Rocket Cadet" },
      { at: 3,  name: "Systems Pilot" },
      { at: 4,  name: "Orbit Engineer" },
      { at: 5,  name: "Navigator" },
      { at: 6,  name: "Flight Officer" },
      { at: 7,  name: "Weather Officer" },
      { at: 8,  name: "EVA Specialist" },
      { at: 9,  name: "Launch Engineer" },
      { at: 10, name: "Satellite Controller" },
      { at: 11, name: "Orbit Physician" },
      { at: 12, name: "Deep Sky Astronomer" },
      { at: 13, name: "Colony Architect" },
      { at: 14, name: "Astro Commander" },
      { at: 15, name: "Academy Legend" }
    ];
    let name = tiers[0].name, idx = 0;
    tiers.forEach((t, i) => { if (done >= t.at) { name = t.name; idx = i; } });
    const pct = Math.round((done / STAGES.length) * 100);
    return { name, pct, index: idx };
  }
};

/* ---------- cosmetics ---------- */
const Shop = {
  itemList(kind) {
    const tab = COSMETIC_TABS.find(t => t.key === kind);
    return tab ? tab.list : [];
  },
  find(id) {
    for (const tab of COSMETIC_TABS) {
      const found = tab.list.find(i => i.id === id);
      if (found) return { kind: tab.key, item: found };
    }
    return null;
  },
  rarity(item) { return RARITY[(item && item.rarity) || "common"] || RARITY.common; },
  owns(id) { return Store.state.owned.includes(id); },
  price(id) { const f = this.find(id); return f ? f.item.price : 0; },
  equipped(kind) { return Store.state.equipped[kind]; },
  currentSuit() {
    return SUITS.find(s => s.id === Store.state.equipped.suit) || SUITS[0];
  },
  /* Everything the avatar renderer needs, in one object. */
  look() {
    const e = Store.state.equipped;
    return {
      skin: e.skin || SLOT_DEFAULTS.skin, hair: e.hair || SLOT_DEFAULTS.hair, eyes: e.eyes || SLOT_DEFAULTS.eyes, expression: e.expression || SLOT_DEFAULTS.expression, suit: e.suit, helmet: e.helmet, visor: e.visor, hat: e.hat,
      backpack: e.backpack, boots: e.boots, gloves: e.gloves,
      cape: e.cape, pet: e.pet, badge: e.badge, trail: e.trail
    };
  },
  ownedCount() { return Store.state.owned.length; },
  totalCount() { return COSMETIC_TABS.reduce((n, t) => n + t.list.length, 0); },
  buy(id) {
    const found = this.find(id);
    if (!found) return { ok: false, msg: "That item is not in the shop." };
    const { kind, item } = found;
    const s = Store.state;
    if (s.owned.includes(id)) {
      this.equip(id);
      return { ok: true, msg: "Equipped!" };
    }
    if (s.stars < item.price) {
      const need = item.price - s.stars;
      return { ok: false, msg: `You need ${need} more star${need === 1 ? "" : "s"} for that. Try a mission quiz!`, short: true };
    }
    s.stars -= item.price;
    s.owned.push(id);
    s.equipped[kind] = id;
    Store.save();
    Sound.success();
    return { ok: true, msg: `${item.name} unlocked and equipped!` };
  },
  equip(id) {
    const found = this.find(id);
    if (!found) return false;
    if (!Store.state.owned.includes(id)) return false;
    Store.state.equipped[found.kind] = id;
    Store.save();
    Sound.click();
    return true;
  }
};

/* ---------- achievements ---------- */
const Trophies = {
  check(silent) {
    const s = Store.state;
    const unlocked = [];
    ACHIEVEMENTS.forEach(a => {
      const has = s.achievements.includes(a.id);
      if (!has) {
        let ok = false;
        try { ok = a.test(s); } catch (e) { ok = false; }
        if (ok) {
          s.achievements.push(a.id);
          unlocked.push(a);
        }
      }
    });
    if (unlocked.length) {
      Store.save();
      if (!silent) {
        unlocked.forEach(a => window.AstroCadet.UI.toast(`Trophy unlocked: ${a.name}`, "mint"));
      }
    }
    return unlocked;
  },
  has(id) { return Store.state.achievements.includes(id); },
  earnedCount() { return Store.state.achievements.length; }
};
/*@@END_JS_STATE@@*/

export { SAVE_KEY, LEGACY_KEYS, SLOT_DEFAULTS, DEFAULT_STATE, Store, Sound, Talk, Award, Progress, Shop, Trophies };
