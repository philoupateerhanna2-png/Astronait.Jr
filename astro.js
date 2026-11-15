import { $, $$, escapeHTML as esc } from "./js/utils.js";
import { PLANETS, SUN_INFO, STAGES, STAGE_BONUS, QUIZ_POINTS, LESSON_POINTS, PLANET_POINTS, PRACTICE_STIPEND,
  RARITY, RARITY_ORDER, SKINS, HAIR_STYLES, EYE_STYLES, EXPRESSIONS, SUITS, HELMETS, VISORS, HATS, BACKPACKS, BOOTS, GLOVES, CAPES, PETS, BADGES, TRAILS,
  COSMETIC_TABS, ACHIEVEMENTS, getContentRecord } from "./js/data/index.js";
import { ART } from "./js/features/art.js";
import { filterCadetItems } from "./js/features/cadet-catalog.js";
import { SAVE_KEY, LEGACY_KEYS, SLOT_DEFAULTS, DEFAULT_STATE, Store } from "./js/features/store.js";
import { Sound, Talk, Award, Progress, Shop, Trophies } from "./js/features/state.js";

/* ============================================================
   4. UI — views and shared widgets
   ============================================================ */

const UI = {
  view: "missions",
  shopTab: "skin",
  cadetSearch: "",
  cadetFilter: "all",
  cadetSort: "recommended",

  /* Switching tabs must ALWAYS work, even from inside a finished level.
     Any open overlay (mission sheet, planet file, settings) is torn down
     first, the mission session is cleaned up, and the target view is
     rendered in the same action — so there is never a stale level card
     sitting on top of the tab the child just asked for. */
  go(name) {
    this.exitOverlays();
    this.view = name;
    $$(".view").forEach(v => v.classList.toggle("is-active", v.id === "view-" + name));
    $$(".tab").forEach(t => t.classList.toggle("is-active", t.dataset.view === name));
    if (name === "missions") this.renderMissions();
    if (name === "planets") this.renderPlanets();
    if (name === "cadet") this.renderCadet();
    if (name === "trophies") this.renderTrophies();
    if (name !== "earth3d") window.scrollTo({ top: 0, behavior: "smooth" });
    Sound.click();
  },

  /* Close every overlay and stop any running mission/activity loop.
     This is what makes tab switching work from inside a finished level:
     the level sheet is torn down and the target view rendered in the same
     action, so no stale level card can sit on top of the new tab. */
  exitOverlays() {
    try { Session.cleanup(); } catch (e) {}
    try { Session.stage = null; } catch (e) {}
    try { Talk.stop(); } catch (e) {}
    $$(".overlay.is-open").forEach(ov => ov.classList.remove("is-open"));
    document.body.classList.remove("is-locked");
  },

  syncHUD() {
    const s = Store.state;
    const hs = $("#hudStars");
    if (hs) hs.textContent = s.stars;
    const rank = Progress.rank();
    const hr = $("#hudRank");
    if (hr) hr.textContent = rank.name;
    const rf = $("#rankFill");
    if (rf) rf.style.width = rank.pct + "%";
    const launcher = $("#pipLauncherAvatar");
    if (launcher) launcher.innerHTML = ART.thumb("suit", Shop.currentSuit());
    const head = $("#pipHeadAvatar");
    if (head) head.innerHTML = ART.thumb("suit", Shop.currentSuit());
  },

  toast(msg, tone) {
    const wrap = $("#toastWrap");
    if (!wrap) return;
    const el = document.createElement("div");
    el.className = "toast " + (tone || "");
    el.textContent = msg;
    wrap.appendChild(el);
    setTimeout(() => { el.classList.add("out"); setTimeout(() => el.remove(), 320); }, 2600);
  },

  showLearningDialog(title, bodyHtml, footHtml) {
    const titleEl = $("#learningDialogTitle"), bodyEl = $("#learningDialogBody"), footEl = $("#learningDialogFoot");
    if (!titleEl || !bodyEl || !footEl) return;
    titleEl.textContent = title; bodyEl.innerHTML = bodyHtml;
    footEl.innerHTML = footHtml || '<button class="btn btn-primary btn-sm" type="button" onclick="AstroExtra.closeLearningDialog()">Done</button>';
    this.open("learningDialog");
    const first = $("#learningDialog button");
    if (first) setTimeout(() => first.focus({preventScroll:true}), 60);
  },
  closeLearningDialog() { this.close("learningDialog"); },

  open(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.add("is-open");
    document.body.classList.add("is-locked");
  },
  close(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.remove("is-open");
    if (!$$(".overlay.is-open").length) document.body.classList.remove("is-locked");
  },

  confetti() {
    if (Store.state.settings.calm || (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches)) return;
    const canvas = $("#confetti");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const colors = ["#4fe3ff", "#5ff0b6", "#ffc857", "#ff7d7d", "#a99bff"];
    const parts = Array.from({ length: 90 }, () => ({
      x: window.innerWidth / 2 + (Math.random() - 0.5) * 240,
      y: window.innerHeight * 0.42 + (Math.random() - 0.5) * 60,
      vx: (Math.random() - 0.5) * 9,
      vy: -Math.random() * 11 - 3,
      r: Math.random() * 5 + 2.5,
      c: colors[Math.floor(Math.random() * colors.length)],
      rot: Math.random() * 6,
      vr: (Math.random() - 0.5) * 0.3,
      life: 1
    }));
    let frame = 0;
    (function tick() {
      frame++;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      parts.forEach(p => {
        p.vy += 0.34;
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
        p.life -= 0.008;
        if (p.life <= 0) return;
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.c;
        ctx.fillRect(-p.r, -p.r * 0.55, p.r * 2, p.r * 1.1);
        ctx.restore();
      });
      if (frame < 140) requestAnimationFrame(tick);
      else ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    })();
  },

  /* ---------------- MISSIONS ---------------- */
  renderMissions() {
    const s = Store.state;
    const root = $("#view-missions");
    const next = Progress.nextStage();
    const done = s.completed.length;
    const totalStars = s.stars;
    const rank = Progress.rank();
    const planetsSeen = Object.keys(s.planetsSeen).length;

    const checkpoint = s.missionCheckpoint && !s.completed.includes(s.missionCheckpoint.stageId) ? s.missionCheckpoint : null;
    const resumeStage = checkpoint ? STAGES.find(st => st.id === checkpoint.stageId) : null;
    const ctaLabel = checkpoint ? `Resume Mission ${checkpoint.stageId}` : (done === 0 ? "Start Mission 1" : (next ? `Continue: Mission ${next.id}` : "Review a mission"));
    const ctaTarget = checkpoint ? checkpoint.stageId : (next ? next.id : STAGES[0].id);
    const checkpointLabel = checkpoint && resumeStage
      ? (checkpoint.phase === "lesson" ? `Lesson card ${Math.min((checkpoint.lesson || 0) + 1, resumeStage.lessons.length)} of ${resumeStage.lessons.length}` : checkpoint.phase === "activity" ? "Hands-on activity" : checkpoint.phase === "quiz" ? `Quiz · question ${Math.min((checkpoint.qIndex || 0) + 1, resumeStage.quiz.length)} of ${resumeStage.quiz.length}` : "Mission in progress")
      : (next ? `Mission ${next.id} is ready to begin` : "All missions completed");

    let heroArt = "";
    try {
      heroArt = ART.planet(PLANETS[done % PLANETS.length], 240);
    } catch (e) { heroArt = ""; }

    root.innerHTML = `
      <div class="hero">
        <div>
          <span class="eyebrow">🚀 Astronaut Jr · cadet ${esc(s.name || "recruit")}</span>
          <h2>Hey ${esc(s.name || "Cadet")}, ${done === 0 ? "ready for your first" : done >= STAGES.length ? "you finished every" : "ready for the next"} <em>mission</em>?</h2>
          <p>${STAGES.length} short training missions, one at a time. Read a little, try the activity, answer three questions — and collect stars for your cadet's wardrobe.</p>
          <div class="hero-actions">
            <button class="btn btn-primary" onclick="app.openMission(${ctaTarget})">${esc(ctaLabel)} →</button>
            <button class="btn btn-ghost" onclick="app.go('planets')">🪐 Explore planets</button>
            <button class="btn btn-ghost" onclick="app.go('cadet')">🧑‍🚀 My cadet</button>
          </div>
        </div>
        <div class="hero-visual">${heroArt}</div>
      </div>

      <div class="journey-progress" aria-label="Training progress">
        <div class="journey-copy"><small>YOUR NEXT STEP</small><strong>${checkpoint && resumeStage ? `Mission ${checkpoint.stageId}: ${esc(resumeStage.title)}` : next ? `Mission ${next.id}: ${esc(next.title)}` : "Academy graduate"}</strong><span>${esc(checkpointLabel)}</span></div>
        <div class="journey-track" role="progressbar" aria-label="Missions completed" aria-valuemin="0" aria-valuemax="${STAGES.length}" aria-valuenow="${done}"><i style="width:${Math.round(done / STAGES.length * 100)}%"></i></div>
        <small>${done}/${STAGES.length} complete · ${next ? `Next unlock: Mission ${Math.min(STAGES.length, next.id + 1)} after this one` : "Every mission unlocked"}</small>
      </div>
      <div class="strip">
        <div class="strip-cell"><b>${done}<span style="font-size:.9rem;color:var(--ink-faint)"> / ${STAGES.length}</span></b><span>Missions done</span></div>
        <div class="strip-cell accent"><b>${totalStars}</b><span>Stars to spend</span></div>
        <div class="strip-cell mint"><b>${rank.name}</b><span>Current rank</span></div>
        <div class="strip-cell"><b>${planetsSeen}<span style="font-size:.9rem;color:var(--ink-faint)"> / ${PLANETS.length + 1}</span></b><span>Space objects logged</span></div>
      </div>

      <div class="sec-head">
        <div>
          <h2>Training path</h2>
          <p>${done >= 7 ? "All missions complete — replay any of them to sharpen your skills." : "Finish a mission to unlock the next one. You can replay finished missions any time."}</p>
        </div>
        <button class="link" onclick="app.togglePip(true)">💬 Ask Astro for a tip</button>
      </div>

      <div class="mission-grid">
        ${STAGES.map(st => this.missionCard(st)).join("")}
      </div>

      <div class="sec-head">
        <div>
          <h2>A quick look at the planets</h2>
          <p>Tap a world to open its full file — size, distance, temperature and the strange bits.</p>
        </div>
        <button class="link" onclick="app.go('planets')">Open the planet explorer →</button>
      </div>
      <div class="planet-grid">
        ${PLANETS.map(p => `
          <button class="planet-card" onclick="app.openPlanet('${p.id}')" aria-label="Open ${p.name}">
            <span class="pv">${ART.planet(p, 100)}</span>
            <h4>${p.name}</h4>
            <small>${p.type.split("·")[1] ? p.type.split("·")[1].trim() : p.type}</small>
            ${s.planetsSeen[p.id] ? `<span class="seen">logged</span>` : ""}
          </button>`).join("")}
      </div>
    `;
  },

  missionCard(st) {
    const s = Store.state;
    const done = s.completed.includes(st.id);
    const open = Progress.unlocked(st.id);
    const best = s.stageStars[st.id] || 0;
    const status = done ? "done" : open ? "ready" : "locked";
    const statusText = done ? "Completed" : open ? "Available" : "Locked";
    const statusIcon = done ? "✓" : open ? "▶" : "🔒";
    const dotCount = 3;

    return `
      <button class="mission-card ${done ? "is-done" : ""} ${open ? (done ? "" : "is-ready") : "is-locked"}"
              data-status="${status}"
              style="--hue:${st.hue}"
              onclick="${open ? `app.openMission(${st.id})` : "app.lockedTap(" + st.id + ")"}"
              aria-disabled="${open ? "false" : "true"}"
              aria-describedby="mission-status-${st.id}">
        <span class="sr-only" id="mission-status-${st.id}">Status: ${statusText}</span>
        <div class="m-top">
          <span class="m-orb" aria-hidden="true">${st.emoji}</span>
          <span>
            <span class="m-num">Mission ${String(st.id).padStart(2, "0")}</span>
          </span>
          <span class="m-status ${status}"><span class="m-status-icon" aria-hidden="true">${statusIcon}</span><span>${statusText}</span></span>
        </div>
        <h3>${esc(st.title)}</h3>
        <p class="m-sub">${esc(st.subtitle)}</p>
        <div class="m-meta">
          <span>🎯 <i>${esc(st.skill)}</i></span>
          <span>⏱ <i>${st.lessons.length} cards</i></span>
          <span class="m-dots">${Array.from({ length: dotCount }).map((_, i) => `<span class="m-dot ${i < best ? "on" : ""}"></span>`).join("")}</span>
        </div>
      </button>`;
  },

  lockedTap(id) {
    Sound.wrong();
    const prev = STAGES.find(st => st.id === id - 1);
    this.toast(`Finish Mission ${id - 1}${prev ? " (" + prev.title + ")" : ""} first to unlock this.`, "coral");
  },

  /* ---------------- PLANETS ---------------- */
  renderPlanets() {
    const s = Store.state;
    const root = $("#view-planets");
    const all = [SUN_INFO].concat(PLANETS);
    const seen = Object.keys(s.planetsSeen).length;

    root.innerHTML = `
      <div class="hero" style="padding-bottom:22px">
        <div>
          <span class="eyebrow">🪐 Planet explorer</span>
          <h2>Nine worlds, <em>one family</em></h2>
          <p>Starting at the Sun and flying outward: read the card for each world, compare the numbers, and keep the weird facts. ${seen}/${PLANETS.length + 1} logged so far.</p>
          <div class="hero-actions">
            <button class="btn btn-primary" onclick="app.openPlanet('earth')">Start with Earth →</button>
            <button class="btn btn-ghost" onclick="app.planetTour()">▶ Take the tour</button>
          </div>
        </div>
        <div class="hero-visual">${ART.planet(SUN_INFO, 220)}</div>
      </div>

      <div class="sec-head">
        <div>
          <h2>The solar system, in order</h2>
          <p>Sizes in the pictures are not to scale — Neptune would be a speck next to the Sun.</p>
        </div>
      </div>

      <div class="planet-grid" style="grid-template-columns:1fr">
        <button class="planet-card" style="flex-direction:row;text-align:left;padding:16px;gap:16px" onclick="app.openPlanet('sun')" aria-label="Open the Sun">
          <span class="pv" style="width:84px;height:84px;flex:none">${ART.planet(SUN_INFO, 100)}</span>
          <span style="flex:1">
            <h4 style="font-size:1.05rem">The Sun</h4>
            <small style="display:block;margin:3px 0 6px">Our star</small>
            <span style="font-size:.82rem;color:var(--ink-dim);display:block">Holds 99.8% of the solar system's mass. Everything else orbits it.</span>
          </span>
          ${s.planetsSeen.sun ? `<span class="seen" style="position:static">logged</span>` : ""}
        </button>
      </div>

      <div class="planet-grid" style="margin-top:12px">
        ${PLANETS.map(p => `
          <button class="planet-card" onclick="app.openPlanet('${p.id}')" aria-label="Open ${p.name}">
            <span class="pv" style="width:88px;height:88px">${ART.planet(p, 100)}</span>
            <h4>${p.name}</h4>
            <small style="text-transform:none;letter-spacing:0;font-size:.68rem">${p.stats["Distance from Sun"]}</small>
            ${s.planetsSeen[p.id] ? `<span class="seen">logged</span>` : ""}
          </button>`).join("")}
      </div>

      <div class="sec-head">
        <div>
          <h2>Compare the numbers</h2>
          <p>Distance is measured from the Sun, in millions of kilometres.</p>
        </div>
      </div>
      <div class="activity-box" style="min-height:0">
        <div style="overflow-x:auto">
          <table style="width:100%;border-collapse:collapse;font-size:.84rem;min-width:560px">
            <thead>
              <tr style="text-align:left;color:var(--ink-faint);font-size:.68rem;letter-spacing:.1em;text-transform:uppercase">
                <th style="padding:8px 6px;border-bottom:1px solid var(--line)">Planet</th>
                <th style="padding:8px 6px;border-bottom:1px solid var(--line)">Diameter</th>
                <th style="padding:8px 6px;border-bottom:1px solid var(--line)">Distance</th>
                <th style="padding:8px 6px;border-bottom:1px solid var(--line)">Year</th>
                <th style="padding:8px 6px;border-bottom:1px solid var(--line)">Moons</th>
              </tr>
            </thead>
            <tbody>
              ${PLANETS.map(p => `
                <tr style="cursor:pointer" onclick="app.openPlanet('${p.id}')">
                  <td style="padding:9px 6px;border-bottom:1px solid rgba(126,168,255,.08);font-weight:800">${p.name}</td>
                  <td style="padding:9px 6px;border-bottom:1px solid rgba(126,168,255,.08);color:var(--ink-dim)">${p.stats["Diameter"]}</td>
                  <td style="padding:9px 6px;border-bottom:1px solid rgba(126,168,255,.08);color:var(--ink-dim)">${p.stats["Distance from Sun"]}</td>
                  <td style="padding:9px 6px;border-bottom:1px solid rgba(126,168,255,.08);color:var(--ink-dim)">${p.stats["Year length"]}</td>
                  <td style="padding:9px 6px;border-bottom:1px solid rgba(126,168,255,.08);color:var(--ink-dim)">${p.stats["Moons"]}</td>
                </tr>`).join("")}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  /* ---------------- CADET ---------------- */
  renderCadet() {
    const s = Store.state;
    const root = $("#view-cadet");
    if (!root || !s) return;

    // Old or manually edited local saves can contain obsolete equipment IDs.
    // Resolve every equipped item defensively so one stale cosmetic cannot
    // break the entire Cadet page.
    const look = Shop.look();
    Object.keys(SLOT_DEFAULTS).forEach(kind => { if (!Shop.find(look[kind])) look[kind] = SLOT_DEFAULTS[kind]; });
    const safeFind = (id, kind) => Shop.find(id) || Shop.find(SLOT_DEFAULTS[kind]) || { item: { name: "Starter item" } };
    const ownedIds = Array.isArray(s.owned) ? s.owned : [];
    const completed = Array.isArray(s.completed) ? s.completed : [];
    const owned = ownedIds.length;
    const total = Math.max(1, Shop.totalCount());
    const collectionPct = Math.round((owned / total) * 100);
    const rank = Progress.rank();
    const nextStage = Progress.nextStage();
    const tab = COSMETIC_TABS.find(t => t.key === this.shopTab) || COSMETIC_TABS[0];
    const pet = look.pet !== "pet_none" ? Shop.find(look.pet) : null;
    const trail = look.trail !== "trail_none" ? Shop.find(look.trail) : null;
    const worlds = Object.keys(s.planetsSeen || {}).length;
    const achievements = (s.achievements || []).length;

    const filteredItems = filterCadetItems(tab.list, {
      ownedIds, stars: s.stars, query: this.cadetSearch, filter: this.cadetFilter,
      sort: this.cadetSort, equippedId: s.equipped[tab.key]
    });
    const rankNames = ["Space Trainee", "Star Scout", "Rocket Cadet", "Systems Pilot", "Orbit Engineer", "Navigator", "Flight Officer", "Weather Officer", "EVA Specialist", "Launch Engineer", "Satellite Controller", "Orbit Physician", "Deep Sky Astronomer", "Colony Architect", "Astro Commander", "Academy Legend"];
    const nextRankName = rankNames[rank.index + 1] || "Academy Legend";

    const loadout = COSMETIC_TABS.map(t => {
      const id = look[t.key];
      const entry = safeFind(id, t.key);
      return `<span class="cadet-loadout-chip"><i>${t.icon}</i><span><small>${esc(t.label)}</small><b>${esc(entry.item.name)}</b></span></span>`;
    }).join("");

    root.innerHTML = `
      <section class="cadet-command-hero">
        <div class="cadet-command-copy">
          <span class="eyebrow">🚀 ASTRONAUT JR · CADET COMMAND</span>
          <h1>My <em>Cadet</em></h1>
          <p>Your personal mission record, astronaut look and equipment collection — all in one place.</p>
          <div class="cadet-command-actions">
            <button class="btn btn-primary" onclick="app.go('missions')">${nextStage ? `Continue Mission ${nextStage.id} →` : "Review missions →"}</button>
            <button class="btn btn-ghost" onclick="app.openSettings()">✏️ Edit profile</button>
            <button class="btn btn-ghost" onclick="app.go('trophies')">🏆 Trophy cabinet</button>
          </div>
        </div>
        <div class="cadet-command-orbit" aria-hidden="true"><span>✦</span><b>✧</b><i>·</i></div>
      </section>

      <div class="cadet-layout cadet-dashboard">
        <aside class="cadet-profile-column">
          <div class="cadet-stage cadet-profile-card">
            <div class="cadet-profile-topline"><span class="pill mint">● ACTIVE CADET</span><span class="cadet-id">ID · LOCAL</span></div>
            <div class="cadet-avatar">
              ${ART.cadet(Object.assign({}, look, { label: "Your cadet" }))}
              ${pet ? `<div class="pet-float">${ART.thumb("pet", pet.item, Shop.currentSuit())}</div>` : ""}
              ${trail ? `<div class="trail-float">${ART.thumb("trail", trail.item, Shop.currentSuit())}</div>` : ""}
            </div>
            <div class="cadet-name">${esc(s.name || "Cadet")}</div>
            <div class="cadet-title">${esc(rank.name)}</div>
            <div class="cadet-rank-track"><div><span>ACADEMY RANK</span><b>${completed.length} / ${STAGES.length} missions</b></div><div class="rankbar"><i style="width:${Math.min(100, rank.pct)}%"></i></div><small>${rank.index >= 15 ? "Maximum academy rank reached" : `Next rank: ${nextRankName}`}</small></div>
            <div class="cadet-profile-stats">
              <div><b>★ ${Number(s.stars || 0).toLocaleString()}</b><small>Available stars</small></div>
              <div><b>${Number(s.earnedTotal || 0).toLocaleString()}</b><small>Stars earned</small></div>
            </div>
            <div class="look-chips">
              ${COSMETIC_TABS.filter(t => look[t.key] && look[t.key] !== SLOT_DEFAULTS[t.key])
                .map(t => `<span class="look-chip">${t.icon} ${esc(safeFind(look[t.key], t.key).item.name)}</span>`).join("") || `<span class="look-chip">Starter kit equipped</span>`}
            </div>
            <button class="btn btn-ghost btn-sm" onclick="app.resetCadetLook()">↺ Reset to starter outfit</button>
          </div>

          <div class="cadet-quick-stats">
            <div><span>🚀</span><b>${completed.length}<small> / ${STAGES.length}</small></b><small>Missions</small></div>
            <div><span>🪐</span><b>${worlds}<small> / ${PLANETS.length + 1}</small></b><small>Worlds logged</small></div>
            <div><span>🏆</span><b>${achievements}<small> / ${ACHIEVEMENTS.length}</small></b><small>Trophies</small></div>
          </div>
        </aside>

        <section class="cadet-wardrobe-column">
          <div class="cadet-section-heading">
            <div><span class="eyebrow">PERSONAL EQUIPMENT</span><h2>Equipment <em>loadout</em></h2><p>Your currently equipped items across every slot.</p></div>
            <span class="pill amber">★ ${Number(s.stars || 0).toLocaleString()} stars</span>
          </div>
          <div class="cadet-loadout-grid">${loadout}</div>

          <div class="cadet-section-heading cadet-shop-heading">
            <div><span class="eyebrow">ACADEMY SUPPLY BAY</span><h2>Cadet <em>wardrobe</em></h2><p>Customize your character skin, suit, helmet and equipment with stars earned from missions.</p></div>
            <div class="cadet-collection-count"><b>${owned} / ${total}</b><small>items collected</small></div>
          </div>
          <div class="cadet-collection-track"><i style="width:${Math.min(100, collectionPct)}%"></i></div>
          <div class="cadet-collection-caption"><span>${collectionPct}% collection complete</span><span>${Math.max(0, total - owned)} items left to discover</span></div>

          <div class="shop-tabs" role="tablist" aria-label="Equipment categories">
            ${COSMETIC_TABS.map(t => {
              const n = t.list.filter(i => ownedIds.includes(i.id)).length;
              return `<button type="button" role="tab" aria-selected="${this.shopTab === t.key}" class="shop-tab ${this.shopTab === t.key ? "is-active" : ""}" onclick="app.setShopTab('${t.key}')">
                ${t.icon} ${t.label}<span class="cnt">${n}/${t.list.length}</span></button>`;
            }).join("")}
          </div>

          <div class="cadet-shop-tools">
            <label class="cadet-search"><span>⌕</span><input id="cadetSearch" type="search" maxlength="60" value="${esc(this.cadetSearch || "")}" placeholder="Search ${esc(tab.label.toLowerCase())}..." oninput="app.setCadetSearch(this.value)" aria-label="Search wardrobe items"></label>
            <select aria-label="Filter wardrobe" onchange="app.setCadetFilter(this.value)">
              <option value="all" ${this.cadetFilter === "all" ? "selected" : ""}>All items</option>
              <option value="owned" ${this.cadetFilter === "owned" ? "selected" : ""}>Owned</option>
              <option value="available" ${this.cadetFilter === "available" ? "selected" : ""}>Can afford</option>
              <option value="locked" ${this.cadetFilter === "locked" ? "selected" : ""}>Locked</option>
            </select>
            <select aria-label="Sort wardrobe" onchange="app.setCadetSort(this.value)">
              <option value="recommended" ${this.cadetSort === "recommended" ? "selected" : ""}>Recommended</option>
              <option value="price-low" ${this.cadetSort === "price-low" ? "selected" : ""}>Price: low to high</option>
              <option value="price-high" ${this.cadetSort === "price-high" ? "selected" : ""}>Price: high to low</option>
              <option value="rarity" ${this.cadetSort === "rarity" ? "selected" : ""}>Rarity</option>
            </select>
          </div>
          <div class="cadet-results-line"><span>${filteredItems.length} ${filteredItems.length === 1 ? "item" : "items"} shown</span><button type="button" onclick="app.clearCadetFilters()">Clear filters</button></div>
          <div class="shop-grid cadet-shop-grid">
            ${filteredItems.length ? filteredItems.map(item => this.shopRow(tab.key, item)).join("") : `<div class="cadet-empty-state"><span>🔭</span><b>No equipment found</b><p>Try another search or change the filters.</p><button class="btn btn-ghost btn-sm" onclick="app.clearCadetFilters()">Reset filters</button></div>`}
          </div>

          <div class="activity-box cadet-earning-tip" style="margin-top:18px;min-height:0">
            <div style="display:flex;gap:12px;align-items:flex-start;flex-wrap:wrap"><div style="font-size:1.4rem">💡</div><div style="flex:1;min-width:200px"><b style="font-size:.9rem">Your next upgrade starts with a mission</b><p style="font-size:.82rem;color:var(--ink-dim);margin-top:4px">New lesson cards earn ${LESSON_POINTS} star, first-try correct answers earn ${QUIZ_POINTS} stars, and a first-time mission completion adds ${STAGE_BONUS} stars. Explore planets to earn ${PLANET_POINTS} more stars.</p><button class="btn btn-primary btn-sm" style="margin-top:10px" onclick="app.go('missions')">Earn more stars →</button></div></div>
          </div>
        </section>
      </div>
    `;
  },

  shopRow(kind, item) {
    const s = Store.state;
    const owned = s.owned.includes(item.id);
    const equipped = s.equipped[kind] === item.id;
    const affordable = s.stars >= item.price;
    const thumbSvg = ART.thumb(kind, item, Shop.currentSuit());
    const rar = Shop.rarity(item);

    let action;
    if (equipped) {
      action = `<button class="btn btn-sm btn-ghost" disabled>Equipped</button>`;
    } else if (owned) {
      action = `<button class="btn btn-sm btn-mint" onclick="app.equipItem('${item.id}')">${kind === "skin" ? "Apply skin" : "Wear it"}</button>`;
    } else {
      action = `<button class="btn btn-sm ${affordable ? "btn-amber" : "btn-ghost"}" onclick="app.buyItem('${item.id}')" ${affordable ? "" : `title="Need ${Math.max(0, item.price - s.stars)} more stars"`}>
        ${affordable ? "Unlock" : `🔒 ${Math.max(0, item.price - s.stars)} more`}
      </button>`;
    }

    return `
      <div class="shop-item r-${item.rarity || "common"} ${equipped ? "is-equipped" : ""}" data-kind="${esc(kind)}">
        <div class="shop-thumb">${thumbSvg}</div>
        <div class="shop-info">
          ${kind === "skin" ? `<small class="skin-item-label">CHARACTER SKIN</small>` : ""}
          <h5>${esc(item.name)}</h5>
          <p>${esc(item.desc)}</p>
          <div class="shop-meta">
            <span class="rarity ${item.rarity || "common"}">${rar.label}</span>
            <span class="shop-price ${owned || affordable ? "" : "locked"}">${item.price === 0 ? "Free · starter" : "★ " + item.price}</span>
          </div>
        </div>
        <div class="shop-act">${action}</div>
      </div>`;
  },

  /* ---------------- TROPHIES ---------------- */
  renderTrophies() {
    const s = Store.state;
    const root = $("#view-trophies");
    const earned = s.achievements.length;

    root.innerHTML = `
      <div class="hero">
        <div>
          <span class="eyebrow">🏆 Trophy cabinet</span>
          <h2>${earned} of ${ACHIEVEMENTS.length} <em>trophies</em> earned</h2>
          <p>Every trophy marks something you actually did — a mission finished, a planet read, a question answered right the first time. Nothing here is bought.</p>
          <div class="hero-actions">
            <button class="btn btn-primary" onclick="app.go('missions')">Back to missions →</button>
            <button class="btn btn-ghost" onclick="app.go('planets')">🪐 Log more planets</button>
          </div>
        </div>
        <div class="hero-visual">${ART.medal(45)}</div>
      </div>

      <div class="strip">
        <div class="strip-cell"><b>${s.completed.length}/${STAGES.length}</b><span>Missions</span></div>
        <div class="strip-cell accent"><b>${s.stars}</b><span>Stars now</span></div>
        <div class="strip-cell mint"><b>${s.earnedTotal}</b><span>Stars earned all-time</span></div>
        <div class="strip-cell"><b>${Object.keys(s.planetsSeen).length}/${PLANETS.length + 1}</b><span>Worlds logged</span></div>
      </div>

      <div class="sec-head">
        <div>
          <h2>All trophies</h2>
          <p>Grey ones are still waiting for you.</p>
        </div>
      </div>
      <div class="trophy-grid">
        ${ACHIEVEMENTS.map(a => {
          const has = s.achievements.includes(a.id);
          return `<div class="trophy ${has ? "done" : ""}">
            <div class="medal-sm">${a.icon}</div>
            <div>
              <h5>${esc(a.name)}</h5>
              <p>${esc(a.desc)}</p>
            </div>
            <span class="state">${has ? "Earned" : "Locked"}</span>
          </div>`;
        }).join("")}
      </div>

      <div class="sec-head">
        <div><h2>Mission record</h2><p>Your best score on each quiz.</p></div>
      </div>
      <div class="activity-box" style="min-height:0">
        ${STAGES.map(st => {
          const done = s.completed.includes(st.id);
          const best = s.stageStars[st.id] || 0;
          return `<div style="display:flex;align-items:center;gap:12px;padding:9px 0;border-bottom:1px solid rgba(126,168,255,.08)">
            <span style="font-size:1.1rem">${st.emoji}</span>
            <span style="flex:1;font-size:.88rem;font-weight:700">${esc(st.title)}</span>
            <span style="font-size:.72rem;color:${done ? "var(--mint)" : "var(--ink-faint)"}">${done ? "Complete" : "Not yet"}</span>
            <span class="m-dots">${[0, 1, 2].map(i => `<span class="m-dot ${i < best ? "on" : ""}"></span>`).join("")}</span>
          </div>`;
        }).join("")}
      </div>
    `;
  }
};
/*@@END_JS_VIEWS@@*/
/* ============================================================
   5. MISSIONS — lessons, activities, quiz, results
   ============================================================ */
const Session = {
  stage: null,
  phase: "lesson",
  lesson: 0,
  qIndex: 0,
  answered: [],       // per-question lock (index -> true) — set the instant it is answered
  order: [],          // per-question shuffled display order (display -> original index)
  correct: 0,
  scored: [],         // per-question: was it right on the first attempt?
  firstTryWrong: [],
  hintShown: false,
  finished: false,
  practice: false,
  earnedThisRun: 0,
  resultShown: false,
  timers: [],
  raf: null,
  listeners: [],
  activityDone: false,
  api: {},
  resumeFrom: null,

  reset(stage) {
    this.cleanup();
    this.stage = stage;
    this.phase = "lesson";
    this.lesson = 0;
    this.qIndex = 0;
    this.answered = [];
    this.order = [];
    this.correct = 0;
    this.scored = [];
    this.firstTryWrong = [];
    this.hintShown = false;
    this.finished = false;
    this.practice = Store.state.completed.includes(stage.id);
    this.activityDone = false;
    this.earnedThisRun = 0;
    this.resultShown = false;
    this.resumeFrom = null;
    this.api = {};
  },

  persistCheckpoint() {
    if (!this.stage || this.practice || this.phase === "result") return;
    Store.state.missionCheckpoint = {stageId:this.stage.id,phase:this.phase,lesson:this.lesson,qIndex:this.qIndex,answered:this.answered.slice(),correct:this.correct,scored:this.scored.slice(),firstTryWrong:this.firstTryWrong.slice(),order:this.order.slice()};
    Store.save();
  },

  cleanup() {
    this.timers.forEach(t => clearTimeout(t));
    this.timers = [];
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = null;
    this.listeners.forEach(([el, ev, fn]) => { try { el.removeEventListener(ev, fn); } catch (e) {} });
    this.listeners = [];
    if (typeof this.api.stop === "function") { try { this.api.stop(); } catch (e) {} }
    this.api = {};
  },

  later(fn, ms) {
    const t = setTimeout(fn, ms);
    this.timers.push(t);
    return t;
  }
};

const Mission = {
  open(stageId) {
    const stage = STAGES.find(s => s.id === stageId);
    if (!stage) return;
    if (!Progress.unlocked(stageId)) { UI.lockedTap(stageId); return; }
    const saved = Store.state.missionCheckpoint;
    Session.reset(stage);
    if (!Session.practice && saved && saved.stageId === stageId) Session.resumeFrom = saved;
    UI.open("missionOverlay"); this.renderBriefing();
    if (!Session.practice) sound_open();
  },

  renderBriefing() {
    const st = Session.stage; if (!st) return;
    const resume = !!Session.resumeFrom;
    $("#missionKicker").textContent = `MISSION ${String(st.id).padStart(2, "0")} · BRIEFING`;
    $("#missionTitle").textContent = st.title; $("#lessonDots").innerHTML = "";
    $("#missionBody").innerHTML = `<div class="mission-briefing"><span class="pill amber">${esc(st.skill)}</span><h3>${esc(st.title)}</h3><p class="mission-objective">${esc(st.intro || st.subtitle)}</p>${(() => { const record = getContentRecord(st.id); return record ? `<div class="lesson-note"><b>Learning objective:</b> ${esc(record.learningObjective)}<br><small>Target level: ${esc(record.targetAge)}</small></div>` : ""; })()}<div class="briefing-steps"><div><b>1 · Learn</b><span>${st.lessons.length} short lesson cards</span></div><div><b>2 · Try</b><span>${esc(st.activity.title)} · hands-on activity</span></div><div><b>3 · Check</b><span>${st.quiz.length} quiz questions with explanations</span></div></div><div class="briefing-reward"><span>🏅 Mission reward</span><strong>${esc(st.reward && st.reward.label ? st.reward.label : "Mission badge")}</strong><small>Stars are awarded for eligible lesson cards, quiz answers and first completion.</small></div>${resume ? `<p class="resume-note">📍 Your last checkpoint is saved. You can continue from ${esc(Session.resumeFrom.phase === "lesson" ? `lesson card ${(Session.resumeFrom.lesson || 0) + 1}` : Session.resumeFrom.phase === "activity" ? "the activity" : `quiz question ${(Session.resumeFrom.qIndex || 0) + 1}`)}.</p>` : ""}</div>`;
    $("#missionFoot").innerHTML = `<span class="briefing-next">${resume ? "Continue where you left off" : "Ready when you are"}</span><button class="btn btn-primary btn-sm" onclick="app.startMission()">${resume ? "Resume mission →" : "Begin mission →"}</button>`;
  },

  start() {
    if (Session.resumeFrom) {
      const cp = Session.resumeFrom;
      Session.phase = ["lesson","activity","quiz"].includes(cp.phase) ? cp.phase : "lesson";
      Session.lesson = Math.max(0, Math.min(cp.lesson || 0, Session.stage.lessons.length - 1));
      Session.qIndex = Math.max(0, Math.min(cp.qIndex || 0, Session.stage.quiz.length - 1));
      Session.answered = Array.isArray(cp.answered) ? cp.answered.slice() : [];
      Session.correct = Number(cp.correct) || 0;
      Session.scored = Array.isArray(cp.scored) ? cp.scored.slice() : [];
      Session.firstTryWrong = Array.isArray(cp.firstTryWrong) ? cp.firstTryWrong.slice() : [];
      Session.order = Array.isArray(cp.order) ? cp.order.slice() : [];
      Session.resumeFrom = null;
    } else Session.phase = "lesson";
    this.render();
  },

  close() {
    Session.cleanup();
    UI.close("missionOverlay");
    UI.renderMissions();
    UI.syncHUD();
  },

  render() {
    const st = Session.stage;
    if (!st) return;
    Session.persistCheckpoint();
    $("#missionKicker").textContent = `Mission ${String(st.id).padStart(2, "0")} · ${st.skill}`;
    $("#missionTitle").textContent = st.title;

    const dots = $("#lessonDots");
    const total = st.lessons.length + 1 + 1;
    const pos = Session.phase === "lesson" ? Session.lesson
      : Session.phase === "activity" ? st.lessons.length
      : Session.phase === "quiz" ? st.lessons.length + 1
      : total - 1;
    dots.innerHTML = Array.from({ length: total }).map((_, i) => `<i class="${i <= pos ? "on" : ""}"></i>`).join("");

    if (Session.phase === "lesson") this.renderLesson();
    else if (Session.phase === "activity") this.renderActivity();
    else if (Session.phase === "quiz") this.renderQuiz();
    else this.renderResult();
  },

  /* ---------------- lessons ---------------- */
  renderLesson() {
    const st = Session.stage;
    const l = st.lessons[Session.lesson];
    const last = Session.lesson === st.lessons.length - 1;
    const gained = Award.lessonSeen(st.id, Session.lesson);

    if (gained > 0) {
      UI.syncHUD();
      UI.toast(`+${gained} stars · lesson read`, "mint");
    }

    $("#missionBody").innerHTML = `
      <div class="lesson-wrap">
        <div class="lesson-art">${ART.scene(st.art)}</div>
        <div class="lesson-copy">
          <div class="lesson-topline">
            <span class="pill">Card ${Session.lesson + 1} of ${st.lessons.length}</span>
            <button class="speak-btn" id="cardSpeak" onclick="app.speakCard()"
                    aria-label="Read this card aloud" title="Read this card aloud">
              <span class="spk-ico">🔊</span><span class="spk-txt">Read to me</span>
            </button>
          </div>
          <h3 style="margin-top:10px">${esc(l.h)}</h3>
          ${l.p.map(p => `<p>${esc(p)}</p>`).join("")}
          ${l.note ? `<div class="lesson-note"><b>Astro's note:</b> ${esc(l.note)}</div>` : ""}
          <div class="voice-line" id="voiceLine">
            <span class="vl-ico">🤖</span>
            <span><b>Astro says:</b> ${esc(this.voiceLine(st, Session.lesson))}</span>
          </div>
        </div>
      </div>
    `;

    $("#missionFoot").innerHTML = `
      <span style="font-size:.76rem;color:var(--ink-faint)">
        ${Session.practice ? "Practice run · stars already collected" : "★ " + LESSON_POINTS + " stars per card"}
      </span>
      <span style="margin-left:auto;display:flex;gap:8px;flex-wrap:wrap">
        ${Session.lesson > 0 ? `<button class="btn btn-ghost btn-sm" onclick="app.lessonPrev()">← Back</button>` : ""}
        <button class="btn btn-primary btn-sm" onclick="app.lessonNext()">
          ${last ? "Try the activity →" : "Next card →"}
        </button>
      </span>
    `;

    this.syncSpeakBtn();
    /* Astro speaks the card automatically when voice is on — but only ever
       after the child has already clicked something (Talk.unlock). */
    if (Talk.enabled) {
      Session.later(() => Talk.sayCard(st, l), 320);
    }
  },

  /* A short, friendly spoken line for each card. Falls back to the heading
     plus the first sentence when a card has no bespoke line. */
  voiceLine(stage, idx) {
    const l = stage.lessons[idx];
    if (!l) return "";
    if (l.voice) return l.voice;
    const first = (l.p && l.p[0]) ? l.p[0].split(". ")[0] : "";
    return `Card ${idx + 1}: ${l.h}. ${first}.`;
  },

  syncSpeakBtn() {
    const btn = $("#cardSpeak");
    if (!btn) return;
    const on = Talk.enabled && Talk.supported;
    btn.classList.toggle("is-on", on);
    const txt = $(".spk-txt", btn);
    if (txt) txt.textContent = on ? "Reading aloud" : "Read to me";
    btn.setAttribute("aria-pressed", String(on));
  },

  /* Speaker button on a card: a real click, so it also unlocks speech. */
  speakCard() {
    const st = Session.stage;
    if (!st) return;
    Talk.unlock();
    if (!Talk.supported) { UI.toast("This browser cannot read aloud.", "coral"); return; }
    if (!Talk.enabled) {
      /* First press turns voice on for the whole app and reads the card. */
      Store.state.settings.voice = true;
      Talk.enabled = true;
      Store.save();
      app.syncToggles();
      UI.toast("Voice on — Astro will read the cards to you.", "mint");
    }
    const l = st.lessons[Session.lesson];
    Talk.sayCard(st, l);
    this.syncSpeakBtn();
    Sound.click();
  },

  lessonNext() {
    Sound.click();
    const st = Session.stage;
    if (Session.lesson < st.lessons.length - 1) {
      Session.lesson++;
      this.render();
      $("#missionBody").scrollTop = 0;
    } else {
      Session.phase = "activity";
      this.render();
    }
  },

  lessonPrev() {
    Sound.click();
    if (Session.lesson > 0) { Session.lesson--; this.render(); }
  },

  /* ---------------- activity ---------------- */
  renderActivity() {
    const st = Session.stage;
    const a = st.activity;
    const head = `
      <div class="activity-head">
        <span class="pill amber">Hands-on</span>
        <b style="font-size:.95rem">${esc(a.title)}</b>
      </div>
      <p class="activity-hint">${a.hint}</p>
    `;

    let body = "";
    if (a.type === "constellation") body = this.actConstellation();
    else if (a.type === "thrust") body = this.actThrust();
    else if (a.type === "systems") body = this.actSystems();
    else if (a.type === "zerog") body = this.actZeroG();
    else if (a.type === "orbit") body = this.actOrbit();
    else if (a.type === "comms") body = this.actComms();
    else if (a.type === "shield") body = this.actShield();
    else if (a.type === "order") body = this.actOrder();
    else if (a.type === "pick") body = this.actPick();
    else if (a.type === "focus") body = this.actFocus();
    else body = this.actLander();

    $("#missionBody").innerHTML = head + `<div class="activity-box" id="activityBox">${body}</div>
      <div id="activityFeedback"></div>`;

    $("#missionFoot").innerHTML = `
      <button class="btn btn-ghost btn-sm" onclick="app.lessonPrevFromActivity()">← Read the cards again</button>
      <span style="margin-left:auto;font-size:.76rem;color:var(--ink-faint)">Finish the activity to open the quiz</span>
    `;

    Session.activityDone = false;
    if (this["init_" + a.type]) this["init_" + a.type]();
  },

  lessonPrevFromActivity() {
    Session.cleanup();
    Session.phase = "lesson";
    Session.lesson = Session.stage.lessons.length - 1;
    Session.activityDone = false;
    this.render();
  },

  activityComplete(message) {
    if (Session.activityDone) return;
    Session.activityDone = true;
    const fb = $("#activityFeedback");
    if (fb) {
      fb.innerHTML = `<div class="explain" style="margin-top:14px">
        <h5>Activity complete</h5>
        <p>${esc(message)}</p>
      </div>`;
    }
    Sound.success();
    Pip.say(message, "cheer", true);
    const foot = $("#missionFoot");
    if (foot) {
      foot.innerHTML = `<span style="font-size:.76rem;color:var(--mint);font-weight:800">✓ Activity complete</span>
        <button class="btn btn-primary btn-sm" style="margin-left:auto" onclick="app.startQuiz()">Start the quiz →</button>`;
    }
  },

  startQuiz() {
    Sound.click();
    Session.cleanup();
    Session.phase = "quiz";
    Session.qIndex = 0;
    Session.answered = [];
    Session.order = [];
    this.render();
  },

  /* ---- activity 1: constellation (Big Dipper, 7 stars) ---- */
  actConstellation() {
    const pts = [
      [14, 30], [30, 22], [48, 27], [49, 50], [32, 60], [14, 55], [4, 44]
    ];
    return `<div class="sky" id="sky">
      <svg class="sky-lines" viewBox="0 0 100 100" preserveAspectRatio="none" id="skyLines"></svg>
      ${pts.map((p, i) => `<button class="sky-star ${i === 0 ? "next" : ""}" id="st-${i}"
        style="left:${p[0]}%;top:${p[1]}%" onclick="app.tapConstStar(${i})"
        aria-label="Star ${i + 1}">${i + 1}</button>`).join("")}
    </div>
    <p style="font-size:.8rem;color:var(--ink-faint);margin-top:10px">Order: bowl first (1→2→3→4), then the handle (5→6→7).</p>`;
  },
  init_constellation() {
    Session.api.ptr = 0;
    Session.api.pts = [[14, 30], [30, 22], [48, 27], [49, 50], [32, 60], [14, 55], [4, 44]];
  },
  tapConstStar(i) {
    if (Session.activityDone) return;
    const ptr = Session.api.ptr;
    const el = $("#st-" + i);
    if (!el) return;
    if (i === ptr) {
      el.classList.remove("next");
      el.classList.add("done");
      Sound.tone(480 + ptr * 90, "sine", 0.13, 0.06);
      this._drawConstLine(ptr);
      Session.api.ptr = ptr + 1;
      const next = $("#st-" + Session.api.ptr);
      if (next) next.classList.add("next");
      if (Session.api.ptr >= 7) {
        this.activityComplete("That is the Big Dipper — Ursa Major. The two stars on the far edge of the bowl point straight at Polaris, the North Star.");
      }
    } else {
      el.classList.add("wrong");
      Sound.wrong();
      setTimeout(() => el.classList.remove("wrong"), 400);
      if (ptr === 0) UI.toast("Start at star 1 — it is the bright one on the left.", "coral");
    }
  },
  _drawConstLine(from) {
    const pts = Session.api.pts;
    if (from < 1) return;
    const a = pts[from - 1], b = pts[from];
    const svg = $("#skyLines");
    if (!svg) return;
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", a[0]); line.setAttribute("y1", a[1]);
    line.setAttribute("x2", b[0]); line.setAttribute("y2", b[1]);
    line.setAttribute("stroke", "#4fe3ff");
    line.setAttribute("stroke-width", "1");
    line.setAttribute("stroke-opacity", ".75");
    svg.appendChild(line);
  },

  /* ---- activity 2: thrust ---- */
  actThrust() {
    return `<div class="rocket-stage">
        <div class="rocket-emoji" id="rocketEmoji">🚀</div>
      </div>
      <div style="margin-top:16px">
        <input class="range" id="thrustRange" type="range" min="0" max="100" value="0" aria-label="Throttle"
               oninput="app.onThrust(this.value)" onchange="app.onThrust(this.value)">
        <div class="thrust-read"><span>Throttle</span><b id="thrustVal">0%</b></div>
      </div>`;
  },
  init_thrust() { Session.api.peak = 0; },
  onThrust(val) {
    const v = Number(val);
    const label = document.getElementById("thrustVal");
    if (label) label.textContent = v + "%";
    const rk = document.getElementById("rocketEmoji");
    if (rk) {
      rk.style.transform = `translateY(${-v * 0.42}px) scale(${1 + v / 500})`;
      rk.style.filter = `drop-shadow(0 ${6 + v / 8}px ${10 + v / 6}px rgba(79,227,255,${0.25 + v / 300}))`;
    }
    if (v > (Session.api.peak || 0)) Session.api.peak = v;
    if (v >= 100) {
      this.activityComplete("Full thrust! The engine throws gas down at high speed, and the reaction pushes the rocket up. In space that reaction is all you need.");
    }
  },

  /* ---- activity 3: systems ---- */
  actSystems() {
    const sys = [
      ["oxygen", "Oxygen generator", "Splits water into breathable O₂"],
      ["scrubber", "CO₂ scrubber", "Removes carbon dioxide from the cabin"],
      ["solar", "Solar array + battery", "Charges in sunlight, powers the dark half"]
    ];
    return `<div class="switch-row">
      ${sys.map(([id, name, sub]) => `
        <button class="switch" id="sw-${id}" onclick="app.tapSystem('${id}')" aria-pressed="false">
          <span style="text-align:left">${name}<small>${sub}</small></span>
          <span class="knob"></span>
        </button>`).join("")}
    </div>
    <p style="font-size:.8rem;color:var(--ink-faint);margin-top:12px">All three must be online before the crew can launch.</p>`;
  },
  init_systems() { Session.api.on = {}; },
  tapSystem(id) {
    if (Session.activityDone) return;
    const el = $("#sw-" + id);
    if (!el || el.classList.contains("on")) return;
    el.classList.add("on");
    el.setAttribute("aria-pressed", "true");
    Sound.tone(520, "square", 0.09, 0.045);
    Session.api.on[id] = true;
    if (Object.keys(Session.api.on).length === 3) {
      this.activityComplete("Ship online! Air, clean carbon dioxide and steady power — the three systems no crew can fly without.");
    }
  },

  /* ---- activity 4: zero-g catch ---- */
  actZeroG() {
    const items = [
      ["🍎", 12, 20], ["💧", 66, 14], ["🥨", 28, 62], ["🍪", 72, 58], ["🧃", 46, 36]
    ];
    return `<div class="float-field" id="floatField">
      ${items.map(([emoji, x, y], i) => `<div class="float-item" data-i="${i}" style="left:${x}%;top:${y}%"
        onclick="app.catchItem(this)" role="button" tabindex="0" aria-label="Catch ${emoji}">${emoji}</div>`).join("")}
      <div style="position:absolute;left:12px;bottom:10px;font-size:.75rem;color:var(--ink-faint)">
        Caught: <b id="catchCount" style="color:var(--mint)">0</b> / 5
      </div>
    </div>`;
  },
  init_zerog() {
    const field = $("#floatField");
    if (!field) return;
    const items = $$(".float-item", field);
    const state = items.map(el => ({
      el,
      x: parseFloat(el.style.left) / 100 * field.clientWidth,
      y: parseFloat(el.style.top) / 100 * field.clientHeight,
      vx: (Math.random() - 0.5) * 1.3,
      vy: (Math.random() - 0.5) * 1.1,
      caught: false
    }));
    Session.api.caught = 0;
    const step = () => {
      const w = field.clientWidth, h = field.clientHeight;
      state.forEach(s => {
        if (s.caught) return;
        s.x += s.vx; s.y += s.vy;
        if (s.x < 0 || s.x > w - 54) { s.vx *= -1; s.x = Math.max(0, Math.min(w - 54, s.x)); }
        if (s.y < 0 || s.y > h - 54) { s.vy *= -1; s.y = Math.max(0, Math.min(h - 54, s.y)); }
        s.el.style.left = s.x + "px";
        s.el.style.top = s.y + "px";
      });
      Session.raf = requestAnimationFrame(step);
    };
    Session.raf = requestAnimationFrame(step);
  },
  catchItem(el) {
    if (Session.activityDone || el.classList.contains("caught")) return;
    el.classList.add("caught");
    Sound.tone(700 + Math.random() * 200, "sine", 0.1, 0.05);
    Session.api.caught = (Session.api.caught || 0) + 1;
    const c = $("#catchCount");
    if (c) c.textContent = Session.api.caught;
    if (Session.api.caught >= 5) {
      if (Session.raf) cancelAnimationFrame(Session.raf);
      Session.raf = null;
      this.activityComplete("All caught. Nothing falls in orbit — the station, the food and you are all falling around Earth together, so everything just floats.");
    }
  },

  /* ---- activity 5: orbit ---- */
  actOrbit() {
    return `<div class="orbit-stage" id="orbitStage">
        <div class="orbit-path" id="orbitPath" style="width:220px;height:220px"></div>
        <div style="width:64px;height:64px">${ART.planet(PLANETS[2], 100)}</div>
        <div class="orbit-sat" id="orbitSat"></div>
        <div class="orbit-read">
          <span>Speed <b id="orbSpeed" style="color:var(--amber)">0</b> km/s</span>
          <span id="orbState">too slow — falling in</span>
        </div>
      </div>
      <div style="margin-top:16px">
        <input class="range" id="orbRange" type="range" min="0" max="100" value="0" aria-label="Orbit speed"
               oninput="app.onOrbit(this.value)">
        <div class="thrust-read"><span>Engine burn</span><span>Stable window: <b>7.4 – 7.9 km/s</b></span></div>
      </div>`;
  },
  init_orbit() {
    Session.api.angle = 0;
    Session.api.speed = 0;
    Session.api.hold = 0;
    const loop = () => {
      const sat = $("#orbitSat");
      const path = $("#orbitPath");
      const s = Session.api.speed;
      if (sat) {
        const r = 110 - Math.min(58, Math.max(0, (s / 100) * 58));
        const a = Session.api.angle;
        sat.style.transform = `translate(calc(-50% + ${Math.cos(a) * r}px), calc(-50% + ${Math.sin(a) * r * 0.82}px))`;
      }
      if (path) {
        const r = 110 - Math.min(58, Math.max(0, (s / 100) * 58));
        path.style.width = (r * 2) + "px";
        path.style.height = (r * 2 * 0.82) + "px";
      }
      Session.api.angle += (0.004 + s / 9000);
      Session.raf = requestAnimationFrame(loop);
    };
    Session.raf = requestAnimationFrame(loop);
  },
  onOrbit(val) {
    const v = Number(val);
    Session.api.speed = v;
    const kms = (6.0 + v * 0.028).toFixed(1);
    const sp = $("#orbSpeed"); if (sp) sp.textContent = kms;
    const stEl = $("#orbState");
    const stable = v >= 52 && v <= 72;
    if (stEl) {
      stEl.textContent = v < 52 ? "too slow — falling in" : v > 72 ? "too fast — escaping" : "stable orbit ✓";
      stEl.style.color = stable ? "var(--mint)" : "var(--coral)";
    }
    if (stable && !Session.activityDone) {
      Session.api.hold = (Session.api.hold || 0) + 1;
      if (Session.api.hold >= 3) {
        this.activityComplete("Stable orbit! At 7.4–7.9 km/s you fall around the curve of Earth exactly as fast as the ground drops away — so you keep circling instead of landing.");
      }
    } else {
      Session.api.hold = 0;
    }
  },

  /* ---- activity 6: comms ---- */
  actComms() {
    Session.api.commsRound = 0;
    Session.api.commsScore = 0;
    return `<div id="commsWrap">${this._commsQuestion(0)}</div>`;
  },
  init_comms() { /* state set in actComms */ },
  _commsQuestion(idx) {
    const rounds = [
      {
        prompt: "Fuel is at 18% and dropping. Which message should go to the crew?",
        options: [
          { t: "“Flight, fuel: one eight percent and falling, two percent per minute.”", ok: true, why: "Number first, then unit and trend. The crew knows exactly what is happening." },
          { t: "“Uh, we might be a bit low on fuel, hang on…”", ok: false, why: "No number, no trend, and 'hang on' leaves the crew waiting." },
          { t: "“Fuel is fine.”", ok: false, why: "That is not true — and false reassurance is worse than silence." }
        ]
      },
      {
        prompt: "The crew reads back a number that sounds wrong. What now?",
        options: [
          { t: "“Say again — confirm one five zero metres per second.”", ok: true, why: "Asking for a repeat with the expected value lets both sides check the same number." },
          { t: "“Never mind, it's probably fine.”", ok: false, why: "Skipping the check is how small errors become big ones." },
          { t: "Say nothing and hope it was right.", ok: false, why: "Silence is a decision too — and a risky one." }
        ]
      },
      {
        prompt: "Two controllers start talking at once. What keeps the loop clean?",
        options: [
          { t: "One voice at a time, through the CAPCOM, with a clear call sign.", ok: true, why: "The CAPCOM is the single voice to the crew, so nothing overlaps or contradicts." },
          { t: "Everyone talks faster so it is over sooner.", ok: false, why: "Talking over each other is how instructions get missed." },
          { t: "Send it all as one long paragraph.", ok: false, why: "Long unbroken messages are hard to act on under pressure." }
        ]
      }
    ];
    const r = rounds[idx];
    return `<div id="commsRound">
      <p style="font-size:.85rem;color:var(--ink-faint);letter-spacing:.1em;text-transform:uppercase;margin-bottom:6px">Call ${idx + 1} of 3</p>
      <p style="font-weight:800;margin-bottom:12px">${esc(r.prompt)}</p>
      <div class="q-options">
        ${r.options.map((o, i) => `<button class="q-option" onclick="app.tapComms(${idx},${i},${o.ok})">
          <span class="ltr">${"ABC"[i]}</span><span>${esc(o.t)}</span></button>`).join("")}
      </div>
      <div id="commsFb"></div>
    </div>`;
  },
  tapComms(idx, optIdx, ok) {
    if (Session.activityDone) return;
    const wrap = $("#commsRound");
    if (!wrap || wrap.dataset.answered) return;
    wrap.dataset.answered = "1";
    $$(".q-option", wrap).forEach((b, i) => {
      b.disabled = true;
      if (i === optIdx) b.classList.add(ok ? "correct" : "wrong");
    });
    const rounds = ["Number, unit, trend — in that order.", "Repeat it back before you act on it.", "One voice, one channel, clear call signs."];
    const fb = $("#commsFb");
    if (fb) fb.innerHTML = `<div class="explain ${ok ? "" : "bad"}"><h5>${ok ? "Good call" : "Try this instead"}</h5><p>${esc((ok ? "" : rounds[idx] + " "))}${ok ? "Clear, short messages are how a whole room stays in sync." : "Clear, short messages are how a whole room stays in sync."}</p></div>`;
    ok ? Sound.success() : Sound.wrong();
    Session.later(() => {
      const next = idx + 1;
      if (next < 3) {
        const w = $("#commsWrap");
        if (w) w.innerHTML = this._commsQuestion(next);
        Session.api.commsRound = next;
      } else {
        this.activityComplete("Three clean calls. Short, ordered messages with read-backs are what keep a mission room working as one team.");
      }
    }, 1300);
  },

  /* ---- activity 7: lander ---- */
  actLander() {
    return `<div class="lander-field" id="landerField">
        <div class="lander-hud">
          <span>Altitude<b id="ladAlt">120 m</b></span>
          <span style="text-align:center">Speed<b id="ladVel">4.0 m/s</b></span>
          <span style="text-align:right">Fuel<b id="ladFuel">100%</b></span>
        </div>
        <div class="lander" id="landerEmoji" style="bottom:210px">🛸
          <div class="flame" id="landerFlame"></div>
        </div>
        <div class="moon-ground"></div>
      </div>
      <div style="display:flex;gap:9px;margin-top:14px;flex-wrap:wrap">
        <button class="btn btn-amber btn-sm" id="burnBtn" onclick="app.landerBurn()">🔥 BURN (slow down)</button>
        <button class="btn btn-ghost btn-sm" onclick="app.landerReset()">↺ Reset</button>
      </div>
      <p style="font-size:.78rem;color:var(--ink-faint);margin-top:10px">Gravity keeps pulling you down. Land below <b style="color:var(--mint)">3 m/s</b> or you will bounce.</p>`;
  },
  init_lander() {
    Session.api.alt = 120;
    Session.api.vel = 4;
    Session.api.fuel = 100;
    Session.api.dead = false;
    const tick = () => {
      if (Session.api.dead) return;
      Session.api.vel += 0.16;
      Session.api.alt -= Session.api.vel * 0.22;
      if (Session.api.alt <= 0) {
        Session.api.alt = 0;
        Session.api.dead = true;
        this._landerRender();
        if (Session.api.vel < 3) {
          this.activityComplete("Touchdown! You used the engine to cancel your fall instead of a parachute — there is no air on the Moon to fill one.");
        } else {
          Sound.wrong();
          const fb = $("#activityFeedback");
          if (fb) fb.innerHTML = `<div class="explain bad" style="margin-top:14px"><h5>Too fast</h5><p>You hit the surface at ${Session.api.vel.toFixed(1)} m/s. Burn earlier and in shorter puffs so you arrive slow.</p></div>`;
          const btn = $("#burnBtn");
          if (btn) btn.disabled = true;
        }
        return;
      }
      this._landerRender();
      Session.raf = requestAnimationFrame(tick);
    };
    this._landerRender();
    Session.raf = requestAnimationFrame(tick);
  },
  _landerRender() {
    const a = $("#ladAlt"), v = $("#ladVel"), f = $("#ladFuel"), l = $("#landerEmoji");
    if (a) a.textContent = Math.max(0, Math.round(Session.api.alt)) + " m";
    if (v) {
      v.textContent = Session.api.vel.toFixed(1) + " m/s";
      v.style.color = Session.api.vel < 3 ? "var(--mint)" : "var(--coral)";
    }
    if (f) f.textContent = Math.round(Session.api.fuel) + "%";
    if (l) l.style.bottom = (48 + Math.max(0, Session.api.alt) * 1.55) + "px";
  },
  landerBurn() {
    if (Session.activityDone || Session.api.dead) return;
    if (Session.api.fuel <= 0) return;
    Session.api.vel = Math.max(-1.2, Session.api.vel - 1.5);
    Session.api.fuel = Math.max(0, Session.api.fuel - 7);
    Sound.tone(180, "sawtooth", 0.09, 0.04);
    const flame = $("#landerFlame");
    if (flame) { flame.classList.add("on"); setTimeout(() => flame.classList.remove("on"), 160); }
    this._landerRender();
  },
  landerReset() {
    Session.cleanup();
    Session.activityDone = false;
    const box = $("#activityBox");
    if (box) box.innerHTML = this.actLander();
    const fb = $("#activityFeedback");
    if (fb) fb.innerHTML = "";
    const foot = $("#missionFoot");
    if (foot) foot.innerHTML = `<button class="btn btn-ghost btn-sm" onclick="app.lessonPrevFromActivity()">← Read the cards again</button>
      <span style="margin-left:auto;font-size:.76rem;color:var(--ink-faint)">Finish the activity to open the quiz</span>`;
    this.init_lander();
  },

  /* ---- activity 8: solar storm shield (level 8) ---- */
  actShield() {
    const items = [
      ["sat", "🛰️", "Satellite safe mode", "Park the panels and stop the sensitive work"],
      ["grid", "🔌", "Power grid alert", "Warn operators so transformers are protected"],
      ["crew", "🧑‍🚀", "Crew storm shelter", "Move the astronauts to the shielded module"]
    ];
    return `<div class="storm-timer"><i id="stormBar" style="width:100%"></i></div>
      <p style="font-size:.8rem;color:var(--ink-faint);margin-bottom:12px">
        Flare detected. Time to impact: <b id="stormClock" style="color:var(--coral)">20</b>s
      </p>
      <div class="shield-grid">
        ${items.map(([id, ico, name, sub]) => `
          <button class="shield-card" id="sh-${id}" onclick="app.tapShield('${id}')" aria-pressed="false">
            <span class="ico">${ico}</span>
            <span>${name}<small>${sub}</small></span>
          </button>`).join("")}
      </div>`;
  },
  init_shield() {
    Session.api.shield = {};
    Session.api.left = 20;
    const bar = $("#stormBar"), clock = $("#stormClock");
    const tick = () => {
      if (Session.activityDone) return;
      Session.api.left -= 0.1;
      if (bar) bar.style.width = Math.max(0, (Session.api.left / 20) * 100) + "%";
      if (clock) clock.textContent = Math.max(0, Math.ceil(Session.api.left));
      if (Session.api.left <= 0) {
        if (Object.keys(Session.api.shield).length < 3) {
          const fb = $("#activityFeedback");
          if (fb) fb.innerHTML = `<div class="explain bad" style="margin-top:14px"><h5>Storm arrived</h5>
            <p>You only switched on ${Object.keys(Session.api.shield).length} of 3 protections. Real forecasters get a day or more of warning \u2014 use it all.</p></div>`;
          Sound.wrong();
          const foot = $("#missionFoot");
          if (foot) foot.innerHTML = `<button class="btn btn-ghost btn-sm" onclick="app.retryActivity()">↻ Try again</button>`;
        }
        return;
      }
      Session.raf = requestAnimationFrame(tick);
    };
    Session.raf = requestAnimationFrame(tick);
  },
  tapShield(id) {
    if (Session.activityDone) return;
    const el = $("#sh-" + id);
    if (!el || el.classList.contains("on")) return;
    el.classList.add("on");
    el.setAttribute("aria-pressed", "true");
    Sound.tone(520, "square", 0.09, 0.045);
    Session.api.shield[id] = true;
    if (Object.keys(Session.api.shield).length === 3) {
      if (Session.raf) cancelAnimationFrame(Session.raf);
      Session.raf = null;
      this.activityComplete("Storm weathered! Satellites went to safe mode, the grid was warned, and the crew moved to shelter. Space weather is dangerous, but it is forecastable \u2014 that is what saves the hardware.");
    }
  },

  /* ---- activity 9: EVA checklist order (level 9) ---- */
  actOrder() {
    const steps = [
      { id:"prebreathe", t:"Pre-breathe pure oxygen to purge nitrogen" },
      { id:"suit",       t:"Put on the suit and check the seals" },
      { id:"tether",     t:"Clip both safety tethers to the station" },
      { id:"depress",    t:"Depressurise the airlock" },
      { id:"hatch",      t:"Open the outer hatch and step outside" }
    ];
    Session.api.orderSteps = steps;
    Session.api.orderPtr = 0;
    const shuffled = steps.slice().sort(() => Math.random() - 0.5);
    return `<div class="order-list" id="orderList">
      ${shuffled.map(s => `<button class="order-item" id="or-${s.id}" onclick="app.tapOrder('${s.id}')">
        <span class="num">?</span><span>${s.t}</span></button>`).join("")}
    </div>
    <p style="font-size:.8rem;color:var(--ink-faint);margin-top:12px">
      Progress: <b id="orderCount" style="color:var(--mint)">0</b> / 5 steps in the right order.
    </p>`;
  },
  init_order() { /* state set in actOrder */ },
  tapOrder(id) {
    if (Session.activityDone) return;
    const steps = Session.api.orderSteps || [];
    const want = steps[Session.api.orderPtr];
    const el = $("#or-" + id);
    if (!el || el.classList.contains("done")) return;
    if (want && id === want.id) {
      el.classList.add("done");
      const num = $(".num", el);
      if (num) num.textContent = Session.api.orderPtr + 1;
      Sound.tone(480 + Session.api.orderPtr * 80, "sine", 0.12, 0.055);
      Session.api.orderPtr++;
      const c = $("#orderCount");
      if (c) c.textContent = Session.api.orderPtr;
      if (Session.api.orderPtr >= steps.length) {
        this.activityComplete("Checklist complete. Pre-breathe, suit up, tether on, depressurise, then open the hatch \u2014 in that order, every single time. Order is what keeps a spacewalk safe.");
      }
    } else {
      el.classList.add("bad");
      Sound.wrong();
      setTimeout(() => el.classList.remove("bad"), 400);
      UI.toast("Not yet \u2014 think about what has to happen before that step.", "coral");
    }
  },

  /* ---- activity 10: pick the essentials (levels 10 & 14) ---- */
  actPick() {
    const st = Session.stage;
    const sets = {
      10: {
        need: 3,
        items: [
          { id:"engine",  ico:"🔥", t:"Rocket engine",      sub:"Throws mass backwards to make thrust", ok:true },
          { id:"fuel",    ico:"⛽", t:"Fuel and oxidiser",  sub:"Burns without needing air",            ok:true },
          { id:"nozzle",  ico:"🔔", t:"Expanding nozzle",   sub:"Speeds up the exhaust gas",            ok:true },
          { id:"wings",   ico:"✈️", t:"Aircraft wings",     sub:"Need air to make lift",                ok:false },
          { id:"prop",    ico:"🌀", t:"Propeller",          sub:"Pushes against air",                   ok:false },
          { id:"sail",    ico:"⛵", t:"Sailing mast",       sub:"Needs wind",                           ok:false }
        ]
      },
      14: {
        need: 3,
        items: [
          { id:"air",     ico:"💨", t:"Sealed habitat with air", sub:"Pressure and breathable atmosphere", ok:true },
          { id:"water",   ico:"💧", t:"Water supply",            sub:"Drink, grow food, make oxygen",      ok:true },
          { id:"power",   ico:"🔋", t:"Power source",            sub:"Solar or nuclear, for everything",   ok:true },
          { id:"flag",    ico:"🚩", t:"A big flag",              sub:"Nice, but not life support",         ok:false },
          { id:"sofa",    ico:"🛋️", t:"Comfy sofa",              sub:"Luxury, not survival",               ok:false },
          { id:"guitar",  ico:"🎸", t:"A guitar",                sub:"Good for morale, not for breathing", ok:false }
        ]
      }
    };
    const set = sets[st.id] || sets[10];
    Session.api.pickSet = set;
    Session.api.picked = {};
    return `<div class="pick-grid" id="pickGrid">
      ${set.items.map(it => `<button class="pick-card" id="pk-${it.id}" onclick="app.tapPick('${it.id}')">
        <span class="ico">${it.ico}</span><span>${it.t}<small>${it.sub}</small></span></button>`).join("")}
    </div>
    <p style="font-size:.8rem;color:var(--ink-faint);margin-top:12px">
      Selected: <b id="pickCount" style="color:var(--mint)">0</b> / ${set.need} essentials.
    </p>`;
  },
  init_pick() { /* state set in actPick */ },
  tapPick(id) {
    if (Session.activityDone) return;
    const set = Session.api.pickSet;
    const it = set.items.find(x => x.id === id);
    const el = $("#pk-" + id);
    if (!it || !el || el.classList.contains("on")) return;
    if (!it.ok) {
      el.classList.add("bad");
      Sound.wrong();
      setTimeout(() => el.classList.remove("bad"), 400);
      UI.toast("That one is not essential \u2014 look for what keeps the machine or the crew alive.", "coral");
      return;
    }
    el.classList.add("on");
    Sound.tone(560, "sine", 0.1, 0.05);
    Session.api.picked[id] = true;
    const n = Object.keys(Session.api.picked).length;
    const c = $("#pickCount");
    if (c) c.textContent = n;
    if (n >= set.need) {
      const msg = Session.stage.id === 14
        ? "Base stocked. Air, water and power are the three things a Mars colony cannot do without \u2014 everything else is comfort."
        : "That is a working rocket. Engine, propellant and a nozzle to accelerate the exhaust \u2014 wings and propellers are useless where there is no air.";
      this.activityComplete(msg);
    }
  },

  /* ---- activity 11: telescope focus (level 13) ---- */
  actFocus() {
    return `<div class="focus-stage">
        <div class="focus-target" id="focusTarget">${ART.scene("galaxy")}</div>
        <div class="focus-read">
          <span>Focus <b id="focusVal" style="color:var(--amber)">0%</b></span>
          <span id="focusState">blurry \u2014 keep turning</span>
        </div>
      </div>
      <div style="margin-top:16px">
        <input class="range" id="focusRange" type="range" min="0" max="100" value="0" aria-label="Telescope focus"
               oninput="app.onFocus(this.value)">
        <div class="thrust-read"><span>Focus knob</span><span>Sharp window: <b>62 \u2013 78%</b></span></div>
      </div>`;
  },
  init_focus() { Session.api.focusHold = 0; },
  onFocus(val) {
    const v = Number(val);
    const t = $("#focusTarget");
    const fv = $("#focusVal");
    const fs = $("#focusState");
    if (fv) fv.textContent = v + "%";
    const sharp = v >= 62 && v <= 78;
    if (t) {
      const blur = Math.abs(v - 70) / 70;
      t.style.filter = `blur(${(blur * 7).toFixed(2)}px) brightness(${(1.25 - blur * 0.5).toFixed(2)})`;
      t.style.transform = `scale(${(1 + (1 - blur) * 0.12).toFixed(3)})`;
    }
    if (fs) {
      fs.textContent = sharp ? "sharp and clear ✓" : (v < 62 ? "blurry — keep turning" : "over-focused — back it off");
      fs.style.color = sharp ? "var(--mint)" : "var(--coral)";
    }
    if (sharp && !Session.activityDone) {
      Session.api.focusHold = (Session.api.focusHold || 0) + 1;
      if (Session.api.focusHold >= 3) {
        this.activityComplete("Sharp! A telescope collects light with a wide mirror and focuses it to a point. Get the focus right and a faint galaxy 50 million light-years away resolves into stars.");
      }
    } else {
      Session.api.focusHold = 0;
    }
  },

  /* Retry the current activity from scratch. */
  retryActivity() {
    Session.cleanup();
    Session.activityDone = false;
    Session.phase = "activity";
    this.render();
  },

  /* ---------------- quiz ---------------- */
  /* Shuffle the answer options for a question, once per render pass, so the
     correct answer lands in a different position every time. The shuffled
     order is remembered per question index, so re-rendering the same question
     (e.g. after a hint) does not reshuffle it under the child's finger. */
  orderFor(qIndex) {
    const st = Session.stage;
    if (!st) return [];
    const q = st.quiz[qIndex];
    if (!q) return [];
    if (!Session.order[qIndex]) {
      const idx = q.options.map((_, i) => i);
      for (let i = idx.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const tmp = idx[i]; idx[i] = idx[j]; idx[j] = tmp;
      }
      Session.order[qIndex] = idx;
    }
    return Session.order[qIndex];
  },

  renderQuiz() {
    const st = Session.stage;
    const q = st.quiz[Session.qIndex];
    const total = st.quiz.length;
    const answered = !!Session.answered[Session.qIndex];
    const order = this.orderFor(Session.qIndex);

    $("#missionBody").innerHTML = `
      <div class="quiz-wrap" style="border-top:0;padding-top:0;margin-top:0">
        <div class="quiz-top">
          <h4>Mission quiz</h4>
          <span class="quiz-step">Question ${Session.qIndex + 1} of ${total}</span>
        </div>
        <p class="q-text">${esc(q.q)}</p>
        <div class="q-options" id="qOptions">
          ${order.map((origIdx, dispIdx) => `<button class="q-option" data-i="${dispIdx}" data-orig="${origIdx}" data-answered="0" onclick="app.answer(${dispIdx})">
            <span class="ltr">${"ABCD"[dispIdx]}</span><span>${esc(q.options[origIdx])}</span>
          </button>`).join("")}
        </div>
        <div class="quiz-tools">
          <button class="btn btn-ghost btn-sm" id="hintBtn" onclick="app.showHint()">💡 Need a hint?</button>
          <span style="font-size:.76rem;color:var(--ink-faint)">
            ${Session.practice ? "Practice run · no new stars" : "First try = " + QUIZ_POINTS + " stars"}
          </span>
        </div>
        <div id="hintSlot"></div>
        <div id="answerSlot"></div>
      </div>
    `;

    $("#missionFoot").innerHTML = `
      <button class="btn btn-ghost btn-sm" onclick="app.backToActivity()">← Activity</button>
      <span style="margin-left:auto;font-size:.76rem;color:var(--ink-faint)">
        Score so far: <b style="color:var(--mint)">${Session.correct}</b> / ${total}
      </span>
    `;
    $("#hintBtn").style.display = answered ? "none" : "";
  },

  showHint() {
    const q = Session.stage.quiz[Session.qIndex];
    const slot = $("#hintSlot");
    if (!slot) return;
    Session.hintShown = true;
    slot.innerHTML = `<div class="hint-box"><b>Astro says:</b> ${esc(q.hint)}</div>`;
    const btn = $("#hintBtn");
    if (btn) btn.style.display = "none";
    Sound.tone(620, "sine", 0.1, 0.05);
    Pip.say(q.hint, "help", true);
  },

  answer(dispIdx) {
    /* HARD LOCK #1 — the DOM itself refuses a second answer. */
    const options = $("#qOptions");
    if (!options || options.dataset.locked === "1") return;
    const q = Session.stage.quiz[Session.qIndex];
    if (Session.answered[Session.qIndex]) return;
    Session.answered[Session.qIndex] = true;
    options.dataset.locked = "1";

    const buttons = $$(".q-option", options);
    buttons.forEach(b => { b.dataset.answered = "1"; b.disabled = true; });

    /* The button carries the ORIGINAL option index, so scoring is unaffected
       by the shuffle. */
    const chosenBtn = buttons[dispIdx];
    const origIdx = chosenBtn ? Number(chosenBtn.dataset.orig) : dispIdx;
    const isCorrect = origIdx === q.correct;
    if (chosenBtn) chosenBtn.classList.add(isCorrect ? "correct" : "wrong");
    if (!isCorrect) {
      const rightBtn = buttons.find(b => Number(b.dataset.orig) === q.correct);
      if (rightBtn) { rightBtn.classList.add("correct"); rightBtn.classList.remove("dim"); }
    }

    /* HARD LOCK #2 — a question pays out at most once, ever.
       Two conditions must BOTH be new: not wrong before in this run,
       and never scored before in any earlier run (persisted key). */
    let earned = 0;
    const key = Session.stage.id + ":" + Session.qIndex;
    if (isCorrect) {
      Session.correct++;
      Session.scored[Session.qIndex] = true;
      const alreadyPaid = !!Store.state.scoredQuestions[key];
      if (!Session.practice && !Session.firstTryWrong[Session.qIndex] && !alreadyPaid) {
        Store.state.scoredQuestions[key] = true;
        Store.save();
        earned = QUIZ_POINTS;
        Session.earnedThisRun += QUIZ_POINTS;
      }
    } else {
      Session.firstTryWrong[Session.qIndex] = true;
      Session.scored[Session.qIndex] = false;
    }

    const slot = $("#answerSlot");
    if (slot) {
      slot.innerHTML = `<div class="explain ${isCorrect ? "" : "bad"}">
        <h5>${isCorrect ? "Correct!" : "Not quite — here is the answer"}</h5>
        <p>${esc(q.explain)}</p>
      </div>`;
    }

    if (earned > 0) {
      Award.points(earned, "correct answer");
      Sound.success();
    } else if (isCorrect) {
      Sound.success();
      Sound.tone(880, "sine", 0.1, 0.05);
    } else {
      Sound.wrong();
    }

    /* Astro reacts in context */
    if (isCorrect) {
      const lines = [
        "Yes! That is exactly it. " + q.explain,
        "Nailed it, Cadet. " + q.explain,
        "Perfect answer. " + q.explain
      ];
      Pip.say(lines[Math.floor(Math.random() * lines.length)], "cheer", false);
    } else {
      Pip.say("Good try — now you know it. " + q.explain, "help", false);
    }

    const foot = $("#missionFoot");
    if (foot) {
      const last = Session.qIndex === Session.stage.quiz.length - 1;
      foot.innerHTML = `<span style="margin-left:auto;font-size:.76rem;color:var(--ink-faint)">
        Score: <b style="color:var(--mint)">${Session.correct}</b> / ${Session.stage.quiz.length}</span>
        <button class="btn btn-primary btn-sm" onclick="app.nextQuestion()">${last ? "See my result →" : "Next question →"}</button>`;
    }
    const hintBtn = $("#hintBtn");
    if (hintBtn) hintBtn.style.display = "none";
  },

  nextQuestion() {
    Sound.click();
    const st = Session.stage;
    if (Session.qIndex < st.quiz.length - 1) {
      Session.qIndex++;
      this.render();
      $("#missionBody").scrollTop = 0;
    } else {
      Session.phase = "result";
      this.render();
    }
  },

  backToActivity() {
    Session.cleanup();
    Session.phase = "activity";
    Session.activityDone = false;
    this.render();
  },

  /* ---------------- result ---------------- */
  renderResult() {
    if (Session.resultShown) return;
    Session.resultShown = true;
    const st = Session.stage;
    const total = st.quiz.length;
    const score = Session.correct;
    const pct = Math.round((score / total) * 100);
    const prevBest = Store.state.stageStars[st.id] || 0;
    const best = Math.max(prevBest, score);
    const wasComplete = Store.state.completed.includes(st.id);

    Store.state.stageStars[st.id] = best;
    Store.state.stageAttempts[st.id] = (Store.state.stageAttempts[st.id] || 0) + 1;
    Store.state.missionCheckpoint = null;
    Store.save();

    let bonus = 0;
    if (!wasComplete) {
      const res = Award.completeStage(st);
      bonus = res.bonus;
      Session.earnedThisRun += bonus;
    } else {
      /* A finished mission never pays the completion bonus again, but a
         practice run still pays a small training stipend so a cadet can
         keep working towards the expensive gear. */
      bonus = Award.practiceStipend();
      Session.earnedThisRun += bonus;
    }
    Trophies.check(false);
    UI.syncHUD();

    const praise = pct === 100
      ? "A perfect score. Astro is doing loops around the room."
      : pct >= 66 ? "Strong work — one small gap to close."
      : "Mission finished. Read the explanations, then run it again for a better score.";

    const nextStage = Progress.nextStage();
    const newlyDone = !wasComplete;

    $("#missionBody").innerHTML = `
      <div class="result">
        <div class="medal">${ART.medal(st.hue)}</div>
        <span class="eyebrow">${newlyDone ? "Mission complete" : "Practice complete"}</span>
        <h3 style="margin-top:12px">${esc(st.title)}</h3>
        <p>${esc(praise)}</p>
        <p class="resume-note">Quiz score is a short check of today’s answers, not a complete measure of what you have learned. Stars are game rewards, not learning scores.</p>
        <div class="result-stats">
          <div class="result-stat"><b>${score}/${total}</b><span>Correct</span></div>
          <div class="result-stat"><b>${pct}%</b><span>Quiz score</span></div>
          <div class="result-stat"><b>${Session.earnedThisRun > 0 ? "+" + Session.earnedThisRun : "0"}</b><span>${Session.earnedThisRun > 0 ? "New stars" : "No new stars"}</span></div>
        </div>
        <div style="max-width:520px;margin:18px auto 0;text-align:left">
          <div class="explain">
            <h5>${newlyDone ? "What you unlocked" : "Replay note"}</h5>
            <p>${newlyDone
              ? `Mission ${st.id} is in the log, and Mission ${Math.min(STAGES.length, st.id + 1)} is now open. Your best score is saved.`
              : `You already collected the stars for this mission, so the completion bonus does not pay again — but you earned a ${PRACTICE_STIPEND}-star training stipend for the practice. Your best score is kept.`}</p>
          </div>
        </div>
      </div>
    `;

    $("#missionFoot").innerHTML = `
      <button class="btn btn-ghost btn-sm" onclick="app.closeMission()">Back to path</button>
      <button class="btn btn-ghost btn-sm" onclick="app.replayMission()">↺ Replay</button>
      <span style="margin-left:auto;display:flex;gap:8px">
        ${newlyDone ? `<button class="btn btn-mint btn-sm" onclick="app.go('cadet')">Spend stars →</button>` : ""}
        ${nextStage ? `<button class="btn btn-primary btn-sm" onclick="app.openMission(${nextStage.id})">Next mission →</button>`
          : `<button class="btn btn-primary btn-sm" onclick="app.go('trophies')">🏆 See trophies</button>`}
      </span>
    `;

    if (newlyDone) {
      UI.confetti();
      Sound.fanfare();
      Pip.say(`${st.title} complete! Score ${score} out of ${total}. ${nextStage ? "Mission " + nextStage.id + " is open — " + nextStage.title + "." : "You have finished every mission in the academy."}`, "cheer", true);
    } else {
      Sound.success();
      Pip.say(`Practice run done — ${score} out of ${total}. Your best stays at ${best}.`, "help", true);
    }
  },

  replayMission() {
    const id = Session.stage.id;
    Session.cleanup();
    this.open(id);
  }
};

function sound_open() { Sound.tone(660, "sine", 0.1, 0.05); }
/*@@END_JS_MISSION@@*/
/* ============================================================
   6. ASTRO — the mission buddy (rule-based, offline, kid-safe)
   ============================================================ */
const Pip = {
  open: false,
  history: [],
  pendingHint: false,
  requestBusy: false,
  lastReply: "",

  /* ---- knowledge base ---- */
  topics: [
    {
      id: "constellation",
      keys: ["constellation", "big dipper", "dipper", "polaris", "north star", "star pattern", "ursa", "stargaz"],
      answer: "A constellation is a pattern of stars that people agreed on — like the Big Dipper, which is seven bright stars in Ursa Major. Find the two stars at the end of the bowl, follow them five times further, and you land on Polaris, the North Star.",
      hintFor: 1,
      action: { label: "Open Mission 1", view: "missions" }
    },
    {
      id: "rocket",
      keys: ["rocket", "thrust", "launch", "newton", "fuel", "escape velocity", "blast off", "blastoff"],
      answer: "A rocket pushes hot gas down, and the gas pushes the rocket up — that is Newton's third law. It carries its own oxygen so it can burn fuel in space where there is no air at all.",
      hintFor: 2,
      action: { label: "Open Mission 2", view: "missions" }
    },
    {
      id: "orbit",
      keys: ["orbit", "orbiting", "perigee", "apogee", "transfer", "hohmann", "satellite", "navigation", "navigate"],
      answer: "An orbit is a permanent fall. If you go sideways fast enough — about 7.8 km per second near Earth — the ground curves away as fast as you drop, so you keep circling. Go faster and your orbit grows into a big oval; too fast and you leave for good.",
      hintFor: 5,
      action: { label: "Open Mission 5", view: "missions" }
    },
    {
      id: "gravity",
      keys: ["gravity", "weightless", "zero g", "microgravity", "float", "floating"],
      answer: "Gravity never switches off. Astronauts float because the station and everything in it are falling around Earth together — nothing presses on anything, so nothing stays put. Gravity up there is still about 90% of what you feel on the ground.",
      hintFor: 4,
      action: { label: "Open Mission 4", view: "missions" }
    },
    {
      id: "life",
      keys: ["eat", "eating", "food", "sleep", "sleeping", "toilet", "bathroom", "water", "drink", "exercise"],
      answer: "Food is often freeze-dried and rehydrated, drinks come in pouches with straws, and sleeping bags are strapped to the wall. Astronauts exercise about two hours a day so their bones and muscles do not weaken without gravity.",
      hintFor: 4,
      action: { label: "Open Mission 4", view: "missions" }
    },
    {
      id: "missioncontrol",
      keys: ["mission control", "capcom", "flight director", "apollo 13", "teamwork", "communication", "radio", "headset"],
      answer: "In Mission Control each desk owns one system, and one person — the CAPCOM — is the only voice that talks to the crew, so messages never overlap. That is why Apollo 13 could be solved by a room full of people talking clearly instead of all at once.",
      hintFor: 6,
      action: { label: "Open Mission 6", view: "missions" }
    },
    {
      id: "moon",
      keys: ["moon", "apollo", "armstrong", "aldrin", "lunar", "landing", "footprint"],
      answer: "Twelve people walked on the Moon between 1969 and 1972. The first was Neil Armstrong, on 20 July 1969. Their footprints will last for millions of years, because the Moon has no wind or rain to erase them.",
      hintFor: 7,
      action: { label: "Open Mission 7", view: "missions" }
    },
    {
      id: "sun",
      keys: ["sun", "solar", "star is", "hot"],
      answer: "The Sun is a star — a ball of super-hot gas holding 99.8% of the solar system's mass. Its light takes about 8 minutes and 20 seconds to reach Earth, and the core is around 15 million °C.",
      planet: "sun",
      action: { label: "Open the Sun's file", view: "planets" }
    },
    {
      id: "earth",
      keys: ["earth", "home planet", "blue marble"],
      answer: "Earth is our home and the only world we know with liquid oceans, breathable air and life. About 71% of the surface is water, and we sit at just the right distance from the Sun for water to stay liquid.",
      planet: "earth",
      action: { label: "Open Earth's file", view: "planets" }
    },
    {
      id: "mars",
      keys: ["mars", "red planet", "olympus"],
      answer: "Mars is red because of rusty iron dust. It has the tallest volcano we know of, Olympus Mons, about 22 km high — roughly two and a half Everests. Robots are exploring it right now.",
      planet: "mars",
      action: { label: "Open Mars's file", view: "planets" }
    },
    {
      id: "jupiter",
      keys: ["jupiter", "great red spot", "biggest planet", "largest planet"],
      answer: "Jupiter is the biggest planet — more than 1,300 Earths would fit inside. Its Great Red Spot is a storm wider than Earth that has been spinning for at least 150 years.",
      planet: "jupiter",
      action: { label: "Open Jupiter's file", view: "planets" }
    },
    {
      id: "saturn",
      keys: ["saturn", "ring", "rings", "titan"],
      answer: "Saturn's rings are billions of pieces of ice and rock — about 280,000 km wide but mostly only ten metres thick. Saturn is also less dense than water, so in a giant bath it would float.",
      planet: "saturn",
      action: { label: "Open Saturn's file", view: "planets" }
    },
    {
      id: "icegiants",
      keys: ["uranus", "neptune", "ice giant", "sideways"],
      answer: "Uranus rolls around the Sun on its side, tipped over by nearly 98°, with 42-year seasons. Neptune is the windiest world we know — gusts over 2,000 km/h — and it was found by maths before anyone saw it through a telescope.",
      planet: "uranus",
      action: { label: "Open Uranus's file", view: "planets" }
    },
    {
      id: "mercury",
      keys: ["mercury", "closest planet", "smallest planet"],
      answer: "Mercury is the smallest planet and the closest to the Sun. It races around at about 47 km per second, and because it has almost no air, it swings from 430 °C in the day to -180 °C at night.",
      planet: "mercury",
      action: { label: "Open Mercury's file", view: "planets" }
    },
    {
      id: "venus",
      keys: ["venus", "hottest planet", "backwards planet"],
      answer: "Venus is the hottest planet, around 465 °C, because its thick carbon-dioxide clouds trap heat. It also spins backwards, so on Venus the Sun would rise in the west — and one spin takes longer than its whole year.",
      planet: "venus",
      action: { label: "Open Venus's file", view: "planets" }
    },
    {
      id: "solarsystem",
      keys: ["solar system", "how many planets", "planets are there", "eight planets", "order of planets"],
      answer: "Eight planets, in order from the Sun: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune. The first four are small and rocky, the next two are giant gas balls, and the last two are icy giants.",
      action: { label: "Open planet explorer", view: "planets" }
    },
    {
      id: "stars",
      keys: ["star", "stars", "galaxy", "milky way", "how many stars"],
      answer: "Stars are huge balls of glowing gas. Our Sun is one of roughly 100–400 billion stars in the Milky Way, and the nearest star to us after the Sun is about 4.2 light-years away — so far that light takes over four years to get here.",
      action: { label: "Open planet explorer", view: "planets" }
    },
    {
      id: "blackhole",
      keys: ["black hole", "blackhole", "neutron star", "supernova"],
      answer: "A black hole is a place where gravity is so strong that not even light escapes. A teaspoon of neutron-star material would weigh about six billion tonnes on Earth — space really does not do things by halves.",
      action: { label: "See fun facts", view: "planets" }
    },
    {
      id: "help",
      keys: ["help", "what can you do", "how do i play", "how does this work", "stuck", "confused", "what now"],
      answer: "Three kinds of help: I can explain space words, give you a hint on the current question, or open the right screen for you. Try \"hint\", \"what is an orbit\", or \"show me Mars\".",
      chips: true
    },
    {
      id: "encourage",
      keys: ["i can't", "i cant", "hard", "difficult", "give up", "bored", "sad", "tired"],
      answer: "Every astronaut got things wrong first — Apollo 13 went wrong in the middle of the mission and the team still brought everyone home. Take the hint, read the explanation, and try again. Nothing here is timed.",
      chips: true
    },
    {
      id: "points",
      keys: ["star", "points", "how many points", "buy", "shop", "outfit", "suit", "spend"],
      answer: "You earn 1 star for each new lesson card, 4 for a correct first-try answer, 2 for logging a new world, and a 15-star bonus the first time you finish a mission. Replays pay a small 3-star training stipend. Spend it all in \"My Cadet\" on suits, helmets, visors, hats, packs, boots, gloves, capes, pets, badges and trails \u2014 the legendary ones cost a lot, so keep flying!",
      action: { label: "Open my cadet", view: "cadet" }
    }
  ],

  jokes: [
    "Why did the astronaut take a pencil to space? Because pens need gravity to work!",
    "I asked the Moon for a snack. It said sorry, it had gone off — as in, it has no atmosphere.",
    "My rocket has a problem: every time I count down from 10, it launches at 4. I have terrible timing.",
    "Space is silent, which is honestly the only reason I am still allowed on this crew."
  ],

  /* ---- UI ---- */
  mount() {
    $("#pipForm").addEventListener("submit", e => {
      e.preventDefault();
      const input = $("#pipInput");
      const text = input.value.trim();
      if (!text) return;
      input.value = "";
      this.ask(text);
    });
    $("#pipChips").innerHTML = [
      ["What is an orbit?", "What is an orbit?"],
      ["Hint", "hint"],
      ["Tell me a joke", "tell me a joke"],
      ["What can you do?", "what can you do"]
    ].map(([label, send]) => `<button class="chip" onclick="app.askPip('${send.replace(/'/g, "\\'")}')">${label}</button>`).join("");

    this.push("pip", this.welcome());
    this.renderChips();
  },

  welcome() {
    const s = Store.state;
    const next = Progress.nextStage();
    if (!s.name) return "Hi there! I'm Astro, your space buddy. Once you have a cadet name, we can start Mission 1 together.";
    if (s.completed.length >= 7) return `Look at that, ${s.name} — all seven missions done. Ask me anything about the planets, or ask for a joke. I know a lot of jokes.`;
    if (s.completed.length === 0) return `Hi ${s.name}! I'm Astro. Mission 1 is open — poetry in the sky, honestly. Tap the first mission and I will talk you through it.`;
    return `Welcome back, ${s.name}. Mission ${next ? next.id : 7} — ${next ? next.title : "the Moon"} — is ready when you are. Want a hint, or just a chat?`;
  },

  toggle(force) {
    this.open = force === undefined ? !this.open : force;
    const panel = $("#pipPanel");
    const btn = $("#pipLauncher");
    if (!panel) return;
    panel.hidden = !this.open;
    document.body.classList.toggle("pip-open", this.open);
    btn.setAttribute("aria-expanded", String(this.open));
    if (this.open) {
      setTimeout(() => $("#pipInput").focus({ preventScroll: true }), 120);
      if (!this.history.length) this.push("pip", this.welcome());
    }
  },

  push(who, text, typing) {
    const log = $("#pipLog");
    if (!log) return;
    if (typing) {
      const t = document.createElement("div");
      t.className = "msg pip typing";
      t.id = "pipTyping";
      t.innerHTML = "<i></i><i></i><i></i>";
      log.appendChild(t);
      log.scrollTop = log.scrollHeight;
      return;
    }
    const el = document.createElement("div");
    el.className = "msg " + (who === "me" ? "me" : "pip");
    el.textContent = text;
    log.appendChild(el);
    log.scrollTop = log.scrollHeight;
    this.history.push({ who, text });
  },

  removeTyping() {
    const t = $("#pipTyping");
    if (t) t.remove();
  },

  renderChips() {
    const box = $("#pipChips");
    if (!box) return;
    const chips = this.contextChips();
    box.innerHTML = chips.map(c => `<button class="chip" onclick="app.askPip('${c.replace(/'/g, "\\'")}')">${c}</button>`).join("");
  },

  contextChips() {
    if (Session.stage && Session.phase === "quiz") {
      return ["Hint please", "Why does that happen?", "Tell me a joke"];
    }
    if (Session.stage) return ["Explain that again", "What is the next step?", "Tell me a joke"];
    return ["What is an orbit?", "Show me Mars", "How do I earn stars?"];
  },

  /* ---- controlled, optional server-assisted conversation ---- */
  safetyReply(text) {
    const t = text.toLowerCase();
    const unsafe = /\b(suicid|self.?harm|kill myself|hurt myself|porn|nude|sexual|sexually explicit|weapon|gun|bomb|make.*explosive|buy.*drug|how.*get high)\b/i.test(t);
    if (!unsafe) return null;
    return "I can’t help with that request. If this is about something happening to you or someone else, please talk with a trusted adult. I can still help with a safe science or space question.";
  },

  async requestRemote(text) {
    const endpoint = window.ASTRO_CONFIG && window.ASTRO_CONFIG.assistantEndpoint;
    const token = window.ASTRO_AUTH_TOKEN;
    if (!endpoint || !token || typeof fetch !== "function") return null;
    if (typeof endpoint !== "string" || !endpoint.startsWith("/") || endpoint.startsWith("//")) return null;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 9000);
    try {
      const response = await fetch(endpoint, {
        method: "POST", signal: controller.signal,
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ message: text, mode: /\bhint\b/i.test(text) ? "hint" : "guided" })
      });
      if (!response.ok) return null;
      const data = await response.json();
      if (!data || typeof data.answer !== "string" || data.answer.length > 1400) return null;
      const allowed = new Set(["https://science.nasa.gov/", "https://spaceplace.nasa.gov/", "https://www.nasa.gov/", "https://solarsystem.nasa.gov/"]);
      const sources = Array.isArray(data.sources) ? data.sources.filter(x => x && typeof x.title === "string" && typeof x.url === "string" && [...allowed].some(base => x.url.startsWith(base))).slice(0, 3) : [];
      return { text: data.answer.trim(), sources };
    } catch (_) { return null; }
    finally { clearTimeout(timeout); }
  },

  pushSources(sources) {
    if (!Array.isArray(sources) || !sources.length) return;
    const log = $("#pipLog"); if (!log) return;
    const wrap = document.createElement("div"); wrap.className = "msg pip pip-sources";
    const label = document.createElement("strong"); label.textContent = "Sources"; wrap.appendChild(label);
    sources.forEach(source => {
      const a = document.createElement("a"); a.href = source.url; a.target = "_blank"; a.rel = "noopener noreferrer"; a.textContent = source.title;
      wrap.appendChild(document.createElement("br")); wrap.appendChild(a);
    });
    log.appendChild(wrap); log.scrollTop = log.scrollHeight;
  },

  async ask(raw) {
    const text = String(raw).trim().slice(0, 240);
    if (!text || this.requestBusy) return;
    Store.state.pipAsked++;
    Store.save();
    if (Store.state.pipAsked === 10) Trophies.check(false);

    this.push("me", text);
    this.push("pip", "", true);
    Sound.click();
    this.requestBusy = true;
    const safe = this.safetyReply(text);
    let remote = null;
    if (!safe) remote = await this.requestRemote(text);
    this.removeTyping();
    this.requestBusy = false;
    if (safe) {
      this.lastReply = safe;
      this.push("pip", safe);
    } else if (remote) {
      this.lastReply = remote.text;
      this.push("pip", remote.text);
      this.pushSources(remote.sources);
    } else {
      const reply = this.reply(text);
      this.lastReply = reply.text;
      this.push("pip", reply.text);
      if (reply.sources) this.pushSources(reply.sources);
      if (reply.say) Talk.say(reply.text);
      if (reply.run) setTimeout(reply.run, 260);
    }
    this.renderChips();
  },

  reply(text) {
    const t = text.toLowerCase();

    /* quiz hint has priority when a quiz is live */
    if (Session.stage && Session.phase === "quiz" && /hint|help|clue|stuck|answer|don'?t know|no idea/.test(t)) {
      const q = Session.stage.quiz[Session.qIndex];
      if (q) {
        return { text: `No problem — here is a nudge, not the answer: ${q.hint}`, say: false };
      }
    }

    if (/^(hint|hint please|i need a hint)$/.test(t)) {
      if (Session.stage && Session.phase === "quiz") {
        const q = Session.stage.quiz[Session.qIndex];
        return { text: `Here is your nudge: ${q.hint} You have got this.` };
      }
      const next = Progress.nextStage();
      return { text: next ? `Open Mission ${next.id} and I will walk you through the first card.${next.id === 1 ? " Tap the mission card, then \"Next card\"." : ""}` : "All missions are done — try the planet explorer for a new favourite fact." };
    }

    if (/joke|funny|laugh/.test(t)) {
      const j = this.jokes[Math.floor(Math.random() * this.jokes.length)];
      return { text: j };
    }

    if (/thank|thanks|you'?re (great|awesome|the best)|love you/.test(t)) {
      return { text: "Aw, thanks! Now go collect some stars — I have my eye on a new helmet." };
    }

    if (/^(hi|hello|hey|yo|good morning|good evening|hola)\b/.test(t)) {
      return { text: `Hello! ${this.welcome()}` };
    }

    if (/who are you|what are you|your name/.test(t)) {
      return { text: "I'm Astro — a small helper robot with one big job: keeping you unstuck. I know the missions, the planets and an unreasonable number of space jokes." };
    }

    if (/my name is |call me /.test(t)) {
      const m = text.match(/my name is ([a-z0-9 _-]{1,18})/i) || text.match(/call me ([a-z0-9 _-]{1,18})/i);
      if (m) {
        const nm = m[1].trim().replace(/\b\w/g, c => c.toUpperCase());
        Store.state.name = nm;
        Store.save();
        UI.syncHUD();
        return { text: `Nice to meet you, ${nm}! I have written that into your cadet file.`, run: () => UI.renderMissions() };
      }
    }

    /* navigation requests */
    const navMap = [
      { re: /show me (the )?(planets|planet explorer)|open planets/, view: "planets", say: "Opening the planet explorer." },
      { re: /show me (my )?(cadet|outfits|shop|wardrobe)|open (the )?(shop|cadet)/, view: "cadet", say: "Opening your cadet wardrobe." },
      { re: /show me (the )?trophies|my (badges|trophies)|achievements/, view: "trophies", say: "Here is the trophy cabinet." },
      { re: /show me (the )?missions|go (to )?missions|home/, view: "missions", say: "Back to the training path." }
    ];
    for (const n of navMap) {
      if (n.re.test(t)) {
        return { text: n.say, run: () => { if (this.open) this.toggle(false); UI.go(n.view); } };
      }
    }
    if (/show me (mars|jupiter|saturn|earth|venus|mercury|neptune|uranus|the sun)/.test(t)) {
      const m = t.match(/show me (?:the )?(mars|jupiter|saturn|earth|venus|mercury|neptune|uranus|sun)/);
      if (m) {
        const id = m[1] === "sun" ? "sun" : m[1];
        return { text: `Opening ${m[1] === "sun" ? "the Sun" : m[1][0].toUpperCase() + m[1].slice(1)} for you.`, run: () => { if (this.open) this.toggle(false); UI.go("planets"); setTimeout(() => app.openPlanet(id), 420); } };
      }
    }
    if (/open mission (\d)/.test(t)) {
      const id = Number(t.match(/open mission (\d)/)[1]);
      if (STAGES.some(s => s.id === id) && Progress.unlocked(id)) {
        return { text: `Opening Mission ${id}.`, run: () => { if (this.open) this.toggle(false); app.openMission(id); } };
      }
      return { text: `Mission ${id} is still locked — finish the one before it and it will open right up.` };
    }

    /* knowledge topics — score by keyword hits */
    let best = null, bestScore = 0;
    const words = t.split(/[^a-z0-9 ]/).filter(Boolean);
    this.topics.forEach(topic => {
      let score = 0;
      topic.keys.forEach(k => {
        if (t.includes(k)) score += k.split(" ").length * 2 + 1;
      });
      if (score > bestScore) { bestScore = score; best = topic; }
    });

    if (best && bestScore >= 2) {
      const extra = best.action && best.action.view && best.action.view !== "missions"
        ? ` Want me to open that for you? Ask "open ${best.action.label.toLowerCase().replace(/^open (the )?/, "")}".`
        : "";
      const run = best.action ? () => { if (this.open) this.toggle(false); UI.go(best.action.view); if (best.planet) setTimeout(() => app.openPlanet(best.planet), 420); } : null;
      const checks = {
        constellation: "Can you name one constellation you can look for in the night sky?",
        rocket: "Which way does the exhaust move when the rocket moves forward?",
        orbit: "What two motions help a satellite stay in orbit?",
        gravity: "Why do astronauts and their spacecraft float together?",
        life: "Why do astronauts need exercise while living in orbit?",
        missioncontrol: "Why is clear communication important during a mission?",
        moon: "What makes footprints last so long on the Moon?",
        sun: "How long does sunlight take to reach Earth?",
        earth: "What makes Earth’s surface special in our Solar System?",
        mars: "What gives Mars much of its reddish colour?",
        jupiter: "What is the name of Jupiter’s famous large storm?",
        saturn: "What are Saturn’s rings made from?",
        icegiants: "Which ice giant is tilted almost on its side?",
        mercury: "Why does Mercury have such large day-night temperature changes?",
        venus: "What makes Venus hotter than Mercury?",
        solarsystem: "Can you name the four rocky planets in order?",
        stars: "What is the name of the galaxy that contains our Solar System?",
        blackhole: "What does it mean when light cannot escape a black hole?"
      };
      const check = checks[best.id] ? `\n\nQuick check: ${checks[best.id]}` : "";
      return { text: best.answer + extra + check, run, sources: [{ title: "NASA Space Place — general space learning resource", url: "https://spaceplace.nasa.gov/" }, { title: "NASA Science", url: "https://science.nasa.gov/" }] };
    }

    /* gentle fallback that offers a real next step */
    if (t.includes("?")) {
      return { text: `Hmm, that one is past my training manual. I am best at orbits, rockets, planets, the Moon and how missions work. Try asking "why do astronauts float?" — or tap a suggestion below.` };
    }
    return { text: `I caught "${text.slice(0, 40)}" — but my space-brain is not sure what to do with it. Ask me about a planet, a mission, or type "hint" if a question has you stuck.` };
  },

  /* one-liners used by the mission engine */
  say(lines, mood, speak) {
    const text = Array.isArray(lines) ? lines[Math.floor(Math.random() * lines.length)] : lines;
    if (this.open) this.push("pip", text);
    if (speak && Talk.enabled) Talk.say(text);
  }
};
/* ============================================================
   7. APP CONTROLLER
   ============================================================ */
function speakNow(text) {
  if (!("speechSynthesis" in window)) { UI.toast("This browser cannot read aloud.", "coral"); return; }
  Talk.unlock();
  Talk.enabled = true;
  Store.state.settings.voice = true;
  Store.save();
  app.syncToggles();
  Talk.say(text, { rate: 0.95 });
}

const app = {
  planetIndex: 0,

  /* ---------- boot ---------- */
  init() {
    const saved = Store.load();
    if (saved) {
      Store.state = saved;
    } else {
      Store.state = DEFAULT_STATE();
      Store.save();
    }

    Sound.enabled = Store.state.settings.sound !== false;
    Talk.init();
    Talk.enabled = !!Store.state.settings.voice;
    document.body.classList.toggle("calm", !!Store.state.settings.calm);

    this.syncToggles();
    UI.syncHUD();
    UI.renderMissions();
    Pip.mount();
    this.starfield();
    this.bind();
    Trophies.check(true);

    if (!Store.state.name) {
      this.openSetup();
    } else {
      // Astro stays docked as a launcher on every visit — the child opens the chat
      // when they want it, so it never sits on top of lesson text.
      Pip.toggle(false);
      this.showOnboardingIfNeeded();
    }
  },

  showOnboardingIfNeeded() {
    if (!Store.state || Store.state.onboardingSeen) return;
    UI.open("onboardingModal");
  },
  finishOnboarding(startMission) {
    Store.state.onboardingSeen = true; Store.save(); UI.close("onboardingModal");
    if (startMission) this.openMission(1);
    else UI.toast("You can start Mission 1 whenever you are ready.", "mint");
  },

  bind() {
    $$(".tab").forEach(t => t.addEventListener("click", () => UI.go(t.dataset.view)));
    $("#btnSound").addEventListener("click", () => this.toggleSound());
    $("#btnVoice").addEventListener("click", () => this.toggleVoice());
    $("#btnSettings").addEventListener("click", () => this.openSettings());
    $("#pipLauncher").addEventListener("click", () => Pip.toggle());
    $("#tgSound").addEventListener("click", () => this.toggleSound());
    $("#tgVoice").addEventListener("click", () => this.toggleVoice());
    $("#tgCalm").addEventListener("click", () => this.toggleCalm());
    $("#btnRename").addEventListener("click", () => this.rename());
    $("#btnReset").addEventListener("click", () => this.resetAll());
    $("#planetPrev").addEventListener("click", () => this.stepPlanet(-1));
    $("#planetNext").addEventListener("click", () => this.stepPlanet(1));
    $("#planetRead").addEventListener("click", () => this.readPlanet());
    $("#btnStart").addEventListener("click", () => this.completeSetup());
    $("#cadetName").addEventListener("keydown", e => { if (e.key === "Enter") this.completeSetup(); });

    $$(".overlay").forEach(ov => {
      ov.addEventListener("click", e => { if (e.target === ov) this.closeOverlay(ov.id); });
    });

    document.addEventListener("keydown", e => {
      if (e.key !== "Escape") return;
      const open = $$(".overlay.is-open");
      if (open.length) this.closeOverlay(open[open.length - 1].id);
      else if (Pip.open) Pip.toggle(false);
    });

    window.addEventListener("resize", () => {
      const c = $("#starfield");
      if (c) { c.width = window.innerWidth; c.height = window.innerHeight; }
    });
  },

  closeOverlay(id) {
    if (id === "missionOverlay") return this.closeMission();
    if (id === "planetSheet") return this.closePlanet();
    if (id === "settingsModal") return this.closeSettings();
    if (id === "learningDialog") return UI.closeLearningDialog();
    if (id === "onboardingModal") return;
    if (id === "setupModal") return;
    UI.close(id);
  },

  /* ---------- setup ---------- */
  openSetup() {
    const grantable = ["suit_classic", "suit_ember", "suit_forest", "suit_nebula"];
    const wrap = $("#starterColors");
    wrap.innerHTML = grantable.map((id, i) => {
      const s = SUITS.find(x => x.id === id);
      return `<button class="swatch ${i === 0 ? "is-active" : ""}" data-suit="${id}" title="${s.name}"
        style="background:linear-gradient(145deg,${s.colors.body},${s.colors.trim})"
        onclick="app.pickStarter('${id}')" aria-label="Choose ${s.name}"></button>`;
    }).join("");
    this.pickedSuit = grantable[0];
    $("#setupAvatar").innerHTML = ART.cadet({ suit: this.pickedSuit, helmet: "helm_bubble", badge: "badge_none", label: "New cadet" });
    UI.open("setupModal");
    setTimeout(() => $("#cadetName").focus({ preventScroll: true }), 300);
  },

  pickStarter(id) {
    this.pickedSuit = id;
    $$("#starterColors .swatch").forEach(b => b.classList.toggle("is-active", b.dataset.suit === id));
    $("#setupAvatar").innerHTML = ART.cadet({ suit: id, helmet: "helm_bubble", badge: "badge_none", label: "New cadet" });
    Sound.click();
  },

  completeSetup() {
    const raw = $("#cadetName").value.trim();
    const name = (raw || "Cadet").slice(0, 18);
    const s = Store.state;
    s.name = name;
    if (this.pickedSuit && !s.owned.includes(this.pickedSuit)) {
      s.owned.push(this.pickedSuit);
      s.equipped.suit = this.pickedSuit;
    }
    Store.save();
    UI.close("setupModal");
    UI.syncHUD();
    UI.renderMissions();
    UI.toast(`Welcome aboard, ${name}!`, "mint");
    Sound.fanfare();
    Pip.toggle(false);
    this.showOnboardingIfNeeded();
  },

  /* ---------- navigation ---------- */
  go(view) { UI.go(view); },
  openEarth3D() {
    // Open the standalone Earth experience as a real page, not inside the
    // app's constrained content area or an iframe.
    window.location.assign("earth-3d.html");
  },
  openMars3D() {
    // Open the supplied Mars experience as a standalone, full-window page.
    window.location.assign("mars-3d.html");
  },
  backFromEarth3D() {
    if (history.state && history.state.astronautJrEarth3D) {
      history.back();
    } else {
      UI.go(this._earthReturnView || "planets");
    }
  },
  togglePip(force) { Pip.toggle(force); },
  askPip(text) { Pip.toggle(true); Pip.ask(text); },

  /* ---------- mission bridges (called from inline handlers) ---------- */
  openMission(id) { Pip.toggle(false); Mission.open(id); },
  startMission() { Mission.start(); },
  closeMission() { Mission.close(); },
  lessonNext() { Mission.lessonNext(); },
  lessonPrev() { Mission.lessonPrev(); },
  speakCard() { Mission.speakCard(); },
  lessonPrevFromActivity() { Mission.lessonPrevFromActivity(); },
  startQuiz() { Mission.startQuiz(); },
  showHint() { Mission.showHint(); },
  answer(i) { Mission.answer(i); },
  nextQuestion() { Mission.nextQuestion(); },
  replayMission() { Mission.replayMission(); },
  backToActivity() { Mission.backToActivity(); },
  lockedTap(id) { UI.lockedTap(id); },
  tapConstStar(i) { Mission.tapConstStar(i); },
  onThrust(v) { Mission.onThrust(v); },
  tapSystem(id) { Mission.tapSystem(id); },
  catchItem(el) { Mission.catchItem(el); },
  onOrbit(v) { Mission.onOrbit(v); },
  tapComms(a, b, c) { Mission.tapComms(a, b, c); },
  landerBurn() { Mission.landerBurn(); },
  landerReset() { Mission.landerReset(); },
  tapShield(id) { Mission.tapShield(id); },
  tapOrder(id) { Mission.tapOrder(id); },
  tapPick(id) { Mission.tapPick(id); },
  onFocus(v) { Mission.onFocus(v); },
  retryActivity() { Mission.retryActivity(); },

  /* ---------- planets ---------- */
  openPlanet(id) {
    const all = [SUN_INFO].concat(PLANETS);
    const idx = all.findIndex(p => p.id === id);
    this.planetIndex = idx < 0 ? 0 : idx;
    const p = all[this.planetIndex];

    Store.state.planetsSeen[p.id] = true;
    Store.save();
    Trophies.check(false);

    this._fillPlanet(p);
    UI.open("planetSheet");
    Sound.tone(520, "sine", 0.12, 0.05);
    if (Talk.enabled) speakNow(p.name + ". " + p.blurb);
  },

  _fillPlanet(p) {
    $("#planetBody").innerHTML = `
      <div class="planet-hero">
        <div class="planet-big"><div class="pv">${ART.planet(p, 260)}</div></div>
        <div>
          <div class="planet-type">${esc(p.type)}</div>
          <h2 class="planet-name">${esc(p.name)}</h2>
          <p class="planet-blurb">${esc(p.blurb)}</p>
        </div>
      </div>

      <div class="stat-grid">
        ${Object.keys(p.stats).map(k => `<div class="stat-cell"><span>${esc(k)}</span><b>${esc(p.stats[k])}</b></div>`).join("")}
      </div>

      <div class="sec-head" style="margin:22px 0 10px">
        <div><h2 style="font-size:1.05rem">Things that surprised me</h2></div>
      </div>
      <div class="fact-list">
        ${p.facts.map(([title, body]) => `<div class="fact"><b>✦</b><div><b style="display:block;color:var(--amber);margin-bottom:2px">${esc(title)}</b>${esc(body)}</div></div>`).join("")}
      </div>

      <div style="margin-top:18px;display:flex;gap:8px;flex-wrap:wrap">
        ${p.id === "earth" ? `<button class="btn btn-primary btn-sm" onclick="app.openEarth3D()">🌍 Explore Earth in 3D</button>` : ""}
        ${p.id === "mars" ? `<button class="btn btn-primary btn-sm" onclick="app.openMars3D()">🔴 Explore Mars in 3D</button>` : ""}
        <button class="btn btn-ghost btn-sm" onclick="app.askPip('tell me about ${p.id === "sun" ? "the sun" : p.name.toLowerCase()}')">💬 Ask Astro about it</button>
        ${p.id !== "sun" ? `<button class="btn btn-ghost btn-sm" onclick="app.askPip('what is an orbit')">🛰 How does it stay in orbit?</button>` : ""}
      </div>
    `;
    $("#planetPrev").disabled = this.planetIndex === 0;
    $("#planetNext").disabled = this.planetIndex === ([SUN_INFO].concat(PLANETS).length - 1);
    $("#planetRead").textContent = "🔊 Read to me";
  },

  closePlanet() {
    UI.close("planetSheet");
    if (UI.view === "planets") UI.renderPlanets();
    if (UI.view === "missions") UI.renderMissions();
    UI.syncHUD();
  },

  stepPlanet(dir) {
    const all = [SUN_INFO].concat(PLANETS);
    const next = this.planetIndex + dir;
    if (next < 0 || next >= all.length) return;
    this.openPlanet(all[next].id);
    Sound.click();
  },

  readPlanet() {
    const all = [SUN_INFO].concat(PLANETS);
    const p = all[this.planetIndex];
    if (!p) return;
    const text = `${p.name}. ${p.blurb} ${p.facts.map(f => f[1]).join(" ")}`;
    speakNow(text);
    Sound.click();
  },

  planetTour() {
    this.openPlanet("sun");
    UI.toast("Use Next → to fly outward from the Sun.", "mint");
  },

  /* ---------- shop ---------- */
  setShopTab(key) {
    if (!COSMETIC_TABS.some(tab => tab.key === key)) return;
    UI.shopTab = key;
    Sound.click();
    UI.renderCadet();
  },
  setCadetSearch(value) {
    UI.cadetSearch = String(value || "").slice(0, 60);
    const active = document.activeElement;
    const cursor = active && active.id === "cadetSearch" ? active.selectionStart : UI.cadetSearch.length;
    UI.renderCadet();
    const input = $("#cadetSearch");
    if (input) { input.focus(); try { input.setSelectionRange(cursor, cursor); } catch (e) {} }
  },
  setCadetFilter(value) { UI.cadetFilter = ["all", "owned", "available", "locked"].includes(value) ? value : "all"; UI.renderCadet(); },
  setCadetSort(value) { UI.cadetSort = ["recommended", "price-low", "price-high", "rarity"].includes(value) ? value : "recommended"; UI.renderCadet(); },
  clearCadetFilters() { UI.cadetSearch = ""; UI.cadetFilter = "all"; UI.cadetSort = "recommended"; UI.renderCadet(); },
  resetCadetLook() {
    if (!window.confirm("Reset your astronaut to the starter outfit? Your unlocked items and stars will stay.")) return;
    Object.assign(Store.state.equipped, SLOT_DEFAULTS);
    Store.save();
    UI.renderCadet(); UI.syncHUD();
    UI.toast("Starter outfit equipped.", "mint");
  },

  buyItem(id) {
    const res = Shop.buy(id);
    if (res.ok) {
      UI.toast(res.msg, "mint");
    } else {
      UI.toast(res.msg, "coral");
      Sound.wrong();
      if (res.short) Pip.say("Not enough stars yet — each correct answer is worth ten. You will get there in one mission.", "help", false);
    }
    UI.renderCadet();
    UI.syncHUD();
  },

  equipItem(id) {
    if (Shop.equip(id)) {
      UI.toast("Outfit equipped.", "mint");
      UI.renderCadet();
      UI.syncHUD();
    }
  },

  /* ---------- settings ---------- */
  openSettings() {
    $("#renameInput").value = Store.state.name || "";
    UI.open("settingsModal");
    this.syncToggles();
  },
  closeSettings() { UI.close("settingsModal"); },

  syncToggles() {
    const st = Store.state.settings;
    const set = (el, on) => { if (el) el.classList.toggle("on", !!on); };
    set($("#tgSound"), st.sound);
    set($("#tgVoice"), st.voice);
    set($("#tgCalm"), st.calm);
    const vb = $("#btnVoice");
    if (vb) {
      vb.textContent = st.voice ? "🔊" : "🔈";
      vb.classList.toggle("is-on", !!st.voice);
      vb.setAttribute("aria-pressed", String(!!st.voice));
      vb.title = st.voice ? "Astro is reading aloud — tap to mute" : "Tap to let Astro read aloud";
    }
    const b = $("#btnSound");
    if (b) {
      b.textContent = st.sound ? "🔊" : "🔇";
      b.setAttribute("aria-pressed", String(!!st.sound));
    }
  },

  toggleSound() {
    const st = Store.state.settings;
    st.sound = !st.sound;
    Sound.enabled = st.sound;
    Store.save();
    this.syncToggles();
    if (st.sound) Sound.success();
  },

  toggleVoice() {
    const st = Store.state.settings;
    st.voice = !st.voice;
    Talk.enabled = st.voice;
    Store.save();
    this.syncToggles();
    if (st.voice) {
      Talk.unlock();
      speakNow("Voice on. I will read the cards out for you.");
      UI.toast("Astro will read each card aloud.", "mint");
    } else {
      Talk.stop();
      UI.toast("Voice off.", "coral");
    }
    if (UI.view === "cadet") UI.renderCadet();
  },

  toggleCalm() {
    const st = Store.state.settings;
    st.calm = !st.calm;
    Store.save();
    document.body.classList.toggle("calm", st.calm);
    this.syncToggles();
  },

  rename() {
    const raw = $("#renameInput").value.trim();
    if (!raw) { UI.toast("Type a name first.", "coral"); return; }
    Store.state.name = raw.slice(0, 18);
    Store.save();
    UI.toast("Name saved.", "mint");
    UI.renderMissions();
    if (UI.view === "cadet") UI.renderCadet();
    UI.syncHUD();
  },

  resetAll() {
    if (!window.confirm("Reset all progress? Stars, missions and outfits will be cleared on this device.")) return;
    Store.reset();
    window.location.reload();
  },

  /* ---------- starfield ---------- */
  starfield() {
    const canvas = $("#starfield");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;
    const motionQuery = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;
    const shouldReduceMotion = () => !!Store.state.settings.calm || !!document.body.classList.contains("calm") || !!(motionQuery && motionQuery.matches);

    const layers = [
      { n: Math.min(90, Math.round(w / 16)), size: 0.9, sp: 0.05, a: 0.35 },
      { n: Math.min(60, Math.round(w / 22)), size: 1.4, sp: 0.11, a: 0.55 },
      { n: Math.min(34, Math.round(w / 34)), size: 2.1, sp: 0.2, a: 0.85 }
    ];
    const stars = [];
    layers.forEach(L => {
      for (let i = 0; i < L.n; i++) {
        stars.push({
          x: Math.random() * w, y: Math.random() * h,
          r: L.size * (0.6 + Math.random() * 0.8),
          sp: L.sp * (0.6 + Math.random() * 0.9),
          a: L.a * (0.6 + Math.random() * 0.5),
          tw: Math.random() * Math.PI * 2,
          hue: Math.random() > 0.82 ? "79,227,255" : (Math.random() > 0.9 ? "255,200,87" : "220,235,255")
        });
      }
    });

    let t = 0, raf = 0;
    let lastReduce = shouldReduceMotion();
    const draw = () => {
      t += 0.012;
      ctx.clearRect(0, 0, w, h);
      const reduce = shouldReduceMotion();
      stars.forEach(s => {
        const tw = reduce ? 1 : 0.72 + 0.28 * Math.sin(t * 1.6 + s.tw);
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${s.hue},${(s.a * tw).toFixed(3)})`;
        ctx.fill();
        if (!reduce) {
          s.y += s.sp;
          if (s.y > h + 2) { s.y = -2; s.x = Math.random() * w; }
        }
      });
      if (reduce) { raf = 0; return; }
      raf = requestAnimationFrame(draw);
    };
    const refreshMotion = (force = false) => {
      const nextReduce = shouldReduceMotion();
      if (!force && nextReduce === lastReduce) return;
      lastReduce = nextReduce;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      draw();
    };
    // draw() schedules the next frame itself when motion is allowed.
    refreshMotion(true);
    if (motionQuery) {
      if (motionQuery.addEventListener) motionQuery.addEventListener("change", refreshMotion);
      else if (motionQuery.addListener) motionQuery.addListener(refreshMotion);
    }
    const motionObserver = new MutationObserver(records => {
      if (records.some(record => record.attributeName === "class")) refreshMotion();
    });
    motionObserver.observe(document.body, { attributes:true, attributeFilter:["class"] });

    window.addEventListener("resize", () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      refreshMotion(true);
    });
  }
};

window.addEventListener("popstate", () => {
  if (UI.view === "earth3d") {
    UI.go(app._earthReturnView || "planets");
  }
});
/* A small read/write handle on the internals, handy for
   checking the scoring guards from the console. */
window.app = app;
window.AstroCadet = {
  Store, Session, Mission, Award, Progress, Shop, Talk, Sound, UI, Trophies, Pip,
  STAGES, PLANETS, SUN_INFO, COSMETIC_TABS, SKINS, SUITS, HELMET_LIST: HELMETS, VISORS, HATS,
  BACKPACKS, BOOTS, GLOVES, CAPES, PETS, BADGES, TRAILS, RARITY,
  QUIZ_POINTS, LESSON_POINTS, STAGE_BONUS, PLANET_POINTS, PRACTICE_STIPEND,
  DEFAULT_STATE, SAVE_KEY
};
window.addEventListener("DOMContentLoaded", () => {
  if (window.AstroAuth && !AstroAuth.ready()) { AstroAuth.show(); return; }
  app.init();
  if (window.AstroAuth) AstroAuth.afterInit();
});
;

// Feature adapters are loaded after the legacy runtime publishes its stable public API.
import("./js/features/extended.js").then(() => import("./js/features/registry.js")).then(({ registerFeatures }) => registerFeatures(window.AstroCadet, window.app));
import("./js/features/language.js");
