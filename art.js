import { SUITS, VISORS, SKINS, HAIR_STYLES, EYE_STYLES, EXPRESSIONS } from "../data/cosmetics.js";
/* SVG illustration primitives and renderers. */
/* ============================================================
   2. ILLUSTRATION ENGINE — hand-built SVG art
   ============================================================ */
let __uid = 0;
const uid = p => p + "-" + (++__uid);

const ART = (() => {

  /* ---- shared helpers ---- */
  function sphere(id, base, light, dark, size) {
    return `
      <defs>
        <radialGradient id="${id}-g" cx="34%" cy="28%" r="78%">
          <stop offset="0%" stop-color="${light}"/>
          <stop offset="52%" stop-color="${base}"/>
          <stop offset="100%" stop-color="${dark}"/>
        </radialGradient>
        <radialGradient id="${id}-sh" cx="72%" cy="76%" r="72%">
          <stop offset="0%" stop-color="#000" stop-opacity="0"/>
          <stop offset="58%" stop-color="#000" stop-opacity=".12"/>
          <stop offset="100%" stop-color="#000" stop-opacity=".62"/>
        </radialGradient>
        <clipPath id="${id}-c"><circle cx="100" cy="100" r="86"/></clipPath>
      </defs>
      <circle cx="100" cy="100" r="86" fill="url(#${id}-g)"/>`;
  }

  function shade(id) {
    return `<circle cx="100" cy="100" r="86" fill="url(#${id}-sh)" clip-path="url(#${id}-c)"/>`;
  }

  function glowRing(id, color, w) {
    return `<circle cx="100" cy="100" r="${86 + (w || 5)}" fill="none" stroke="${color}" stroke-opacity=".28" stroke-width="1.5"/>`;
  }

  function craters(id, list) {
    return `<g clip-path="url(#${id}-c)" opacity=".5">` + list.map(c =>
      `<ellipse cx="${c[0]}" cy="${c[1]}" rx="${c[2]}" ry="${c[2] * .78}" fill="#000" opacity=".18"/>
       <ellipse cx="${c[0] - c[2] * .12}" cy="${c[1] - c[2] * .16}" rx="${c[2] * .82}" ry="${c[2] * .62}" fill="#fff" opacity=".10"/>`
    ).join("") + `</g>`;
  }

  const PLANET_ART = {
    mercury: id => `<svg viewBox="0 0 200 200" role="img" aria-label="Mercury, a grey cratered planet">
      ${sphere(id, "#9c968b", "#e6e0d3", "#4d4941")}
      <g clip-path="url(#${id}-c)">
        <path d="M14 78c30-10 62-4 88 10s56 14 84 4v-70H14Z" fill="#fff" opacity=".07"/>
        <path d="M14 132c34 8 58 26 82 40s64 22 90 12v50H14Z" fill="#000" opacity=".10"/>
      </g>
      ${craters(id, [[66,62,15],[128,54,9],[104,112,19],[56,128,8],[143,106,12],[84,158,7],[150,150,6],[44,94,6]])}
      ${shade(id)}${glowRing(id, "#b9b3a8", 6)}</svg>`,

    venus: id => `<svg viewBox="0 0 200 200" role="img" aria-label="Venus, a creamy yellow planet with swirls">
      ${sphere(id, "#d9b06a", "#ffeec4", "#8a6320")}
      <g clip-path="url(#${id}-c)" opacity=".45">
        <path d="M6 66c34-16 60 6 92 2s54-20 96-8" stroke="#fff6d8" stroke-width="9" fill="none" stroke-linecap="round" opacity=".55"/>
        <path d="M0 96c40-14 64 10 98 4s58-16 100-4" stroke="#fff6d8" stroke-width="7" fill="none" stroke-linecap="round" opacity=".4"/>
        <path d="M4 126c36-12 62 12 96 6s56-14 98-2" stroke="#8a6320" stroke-width="8" fill="none" stroke-linecap="round" opacity=".3"/>
        <path d="M10 42c30-10 54 8 84 4s52-14 90-6" stroke="#fff6d8" stroke-width="5" fill="none" stroke-linecap="round" opacity=".3"/>
      </g>
      ${shade(id)}${glowRing(id, "#ffd98a", 7)}</svg>`,

    earth: id => `<svg viewBox="0 0 200 200" role="img" aria-label="Earth, a blue planet with green continents and white clouds">
      <defs>
        <radialGradient id="${id}-o" cx="35%" cy="30%" r="72%">
          <stop offset="0%" stop-color="#8fd7ff"/><stop offset="55%" stop-color="#2f74d0"/><stop offset="100%" stop-color="#0a2a63"/>
        </radialGradient>
        <clipPath id="${id}-c"><circle cx="100" cy="100" r="86"/></clipPath>
      </defs>
      <circle cx="100" cy="100" r="86" fill="url(#${id}-o)"/>
      <g clip-path="url(#${id}-c)">
        <path d="M52 44c14-8 30-4 34 8s-4 22-14 26-24 0-28-10 2-18 8-24Z" fill="#4fbf7a"/>
        <path d="M40 96c18-6 30 4 32 16s-8 30-22 30-22-14-20-26 2-16 10-20Z" fill="#3fa869"/>
        <path d="M96 42c22-6 40 6 44 18s-10 18-24 16-28-10-28-20 2-12 8-14Z" fill="#54c47f"/>
        <path d="M108 88c16-4 34 4 38 16s-8 24-24 26-28-8-30-20 6-18 16-22Z" fill="#469f66"/>
        <path d="M140 132c10-2 18 4 16 12s-12 12-20 8-8-12-4-16 6-4 8-4Z" fill="#4bb374"/>
        <path d="M30 140c10-2 16 4 14 10s-12 8-18 4-4-10 4-14Z" fill="#54c47f"/>
        <path d="M44 60c22-8 52-4 74 4" stroke="#fff" stroke-width="10" fill="none" opacity=".55" stroke-linecap="round"/>
        <path d="M30 112c26 6 48-4 74-2s42 10 66 4" stroke="#fff" stroke-width="9" fill="none" opacity=".45" stroke-linecap="round"/>
        <path d="M64 160c20-6 42 0 60 6" stroke="#fff" stroke-width="8" fill="none" opacity=".4" stroke-linecap="round"/>
        <circle cx="100" cy="14" r="26" fill="#eaf6ff" opacity=".5"/>
        <circle cx="100" cy="186" r="26" fill="#eaf6ff" opacity=".45"/>
      </g>
      <circle cx="100" cy="100" r="86" fill="url(#${id}-o)" opacity=".18"/>
      <circle cx="100" cy="100" r="86" fill="none" stroke="#a9e4ff" stroke-opacity=".6" stroke-width="2"/>
      <circle cx="100" cy="100" r="91" fill="none" stroke="#6fd0ff" stroke-opacity=".28" stroke-width="4"/>
      <ellipse cx="68" cy="58" rx="26" ry="18" fill="#fff" opacity=".13" transform="rotate(-20 68 58)"/>
      ${shade(id)}</svg>`,

    mars: id => `<svg viewBox="0 0 200 200" role="img" aria-label="Mars, a rust-red planet with polar caps">
      ${sphere(id, "#c2572c", "#f2a074", "#5c1f0c")}
      <g clip-path="url(#${id}-c)">
        <path d="M18 118c26-10 44 6 66 2s38-16 60-10 30 14 38 10v70H18Z" fill="#8a3313" opacity=".35"/>
        <path d="M52 88c18-6 34 2 44 10s-4 18-18 18-32-8-34-16 2-10 8-12Z" fill="#8a3313" opacity=".3"/>
        <path d="M126 62c14-4 24 2 26 10s-10 12-22 10-16-8-14-12 6-8 10-8Z" fill="#8a3313" opacity=".3"/>
        <ellipse cx="100" cy="18" rx="40" ry="16" fill="#fff" opacity=".78"/>
        <ellipse cx="100" cy="184" rx="34" ry="13" fill="#fff" opacity=".7"/>
      </g>
      <g clip-path="url(#${id}-c)" opacity=".35">
        <path d="M0 74c40-6 70 4 100 0s60-8 100-2" stroke="#ffd0a8" stroke-width="4" fill="none" opacity=".5"/>
        <path d="M0 144c36 4 66-6 100-2s62 8 100 2" stroke="#ffd0a8" stroke-width="3" fill="none" opacity=".4"/>
      </g>
      ${shade(id)}${glowRing(id, "#ff9a66", 7)}</svg>`,

    jupiter: id => `<svg viewBox="0 0 200 200" role="img" aria-label="Jupiter, a banded gas giant with a great red spot">
      ${sphere(id, "#d99b63", "#ffe2b6", "#7d4a20")}
      <g clip-path="url(#${id}-c)">
        <rect x="0" y="30" width="200" height="13" fill="#b8763f" opacity=".55"/>
        <rect x="0" y="52" width="200" height="8" fill="#f4d7ae" opacity=".55"/>
        <rect x="0" y="68" width="200" height="16" fill="#c98549" opacity=".5"/>
        <rect x="0" y="94" width="200" height="6" fill="#f6dfbc" opacity=".5"/>
        <rect x="0" y="108" width="200" height="20" fill="#b4733c" opacity=".5"/>
        <rect x="0" y="136" width="200" height="9" fill="#f0d4a8" opacity=".45"/>
        <rect x="0" y="152" width="200" height="14" fill="#a86233" opacity=".4"/>
        <ellipse cx="128" cy="122" rx="30" ry="15" fill="#c0402a" opacity=".85"/>
        <ellipse cx="128" cy="122" rx="30" ry="15" fill="none" stroke="#f0a07a" stroke-width="2" opacity=".7"/>
        <ellipse cx="122" cy="119" rx="13" ry="6" fill="#e87a56" opacity=".8"/>
        <path d="M0 44c30 4 60-2 90 0s60 6 110 0" stroke="#fff" stroke-width="2" fill="none" opacity=".18"/>
      </g>
      ${shade(id)}${glowRing(id, "#ffc98a", 7)}</svg>`,

    saturn: id => `<svg viewBox="0 0 200 200" role="img" aria-label="Saturn, a pale gold planet with wide rings">
      <defs>
        <radialGradient id="${id}-g" cx="34%" cy="28%" r="78%">
          <stop offset="0%" stop-color="#fff5d6"/><stop offset="55%" stop-color="#e3c187"/><stop offset="100%" stop-color="#8c6a33"/>
        </radialGradient>
        <clipPath id="${id}-c"><circle cx="100" cy="100" r="66"/></clipPath>
        <radialGradient id="${id}-sh" cx="72%" cy="76%" r="72%">
          <stop offset="0%" stop-color="#000" stop-opacity="0"/>
          <stop offset="58%" stop-color="#000" stop-opacity=".10"/>
          <stop offset="100%" stop-color="#000" stop-opacity=".5"/>
        </radialGradient>
        <linearGradient id="${id}-r" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#c9a464" stop-opacity=".15"/>
          <stop offset="18%" stop-color="#f6e3b8" stop-opacity=".85"/>
          <stop offset="42%" stop-color="#d6b276" stop-opacity=".55"/>
          <stop offset="55%" stop-color="#f8ecc9" stop-opacity=".2"/>
          <stop offset="68%" stop-color="#d6b276" stop-opacity=".6"/>
          <stop offset="88%" stop-color="#f6e3b8" stop-opacity=".8"/>
          <stop offset="100%" stop-color="#c9a464" stop-opacity=".12"/>
        </linearGradient>
      </defs>
      <g transform="rotate(-16 100 100)">
        <ellipse cx="100" cy="100" rx="96" ry="30" fill="none" stroke="url(#${id}-r)" stroke-width="17"/>
        <ellipse cx="100" cy="100" rx="96" ry="30" fill="none" stroke="#fff8e2" stroke-opacity=".45" stroke-width="1.2"/>
        <circle cx="100" cy="100" r="66" fill="url(#${id}-g)"/>
        <g clip-path="url(#${id}-c)">
          <rect x="0" y="70" width="200" height="6" fill="#b98f4f" opacity=".35"/>
          <rect x="0" y="90" width="200" height="5" fill="#b98f4f" opacity=".28"/>
          <rect x="0" y="112" width="200" height="7" fill="#b98f4f" opacity=".3"/>
          <path d="M0 60c40 6 80-2 120 0s58 4 80 0" stroke="#fff6dc" stroke-width="3" fill="none" opacity=".3"/>
        </g>
        <circle cx="100" cy="100" r="66" fill="url(#${id}-sh)" clip-path="url(#${id}-c)"/>
        <ellipse cx="100" cy="100" rx="96" ry="30" fill="none" stroke="url(#${id}-r)" stroke-width="8" opacity=".9"
                 stroke-dasharray="300" stroke-dashoffset="0" clip-path="none"/>
        <path d="M4 100a96 30 0 0 0 192 0" fill="none" stroke="url(#${id}-r)" stroke-width="16"/>
        <path d="M4 100a96 30 0 0 0 192 0" fill="none" stroke="#fff8e2" stroke-opacity=".3" stroke-width="1"/>
      </g></svg>`,

    uranus: id => `<svg viewBox="0 0 200 200" role="img" aria-label="Uranus, a pale cyan ice giant tilted on its side">
      <defs>
        <radialGradient id="${id}-g" cx="34%" cy="30%" r="76%">
          <stop offset="0%" stop-color="#e2fbff"/><stop offset="52%" stop-color="#8fdfe8"/><stop offset="100%" stop-color="#2d7d8d"/>
        </radialGradient>
        <clipPath id="${id}-c"><circle cx="100" cy="100" r="76"/></clipPath>
        <radialGradient id="${id}-sh" cx="72%" cy="76%" r="72%">
          <stop offset="0%" stop-color="#000" stop-opacity="0"/>
          <stop offset="58%" stop-color="#000" stop-opacity=".10"/>
          <stop offset="100%" stop-color="#000" stop-opacity=".45"/>
        </radialGradient>
      </defs>
      <ellipse cx="100" cy="100" rx="94" ry="13" fill="none" stroke="#bdf2f8" stroke-opacity=".35" stroke-width="3" transform="rotate(-72 100 100)"/>
      <circle cx="100" cy="100" r="76" fill="url(#${id}-g)"/>
      <g clip-path="url(#${id}-c)" opacity=".3">
        <rect x="0" y="64" width="200" height="8" fill="#5ec3d2"/>
        <rect x="0" y="104" width="200" height="10" fill="#5ec3d2"/>
        <rect x="0" y="140" width="200" height="7" fill="#5ec3d2"/>
      </g>
      <circle cx="100" cy="100" r="76" fill="url(#${id}-sh)" clip-path="url(#${id}-c)"/>
      <circle cx="100" cy="100" r="76" fill="none" stroke="#cff8ff" stroke-opacity=".5" stroke-width="2"/>
      <circle cx="100" cy="100" r="82" fill="none" stroke="#a8e6ef" stroke-opacity=".22" stroke-width="5"/></svg>`,

    neptune: id => `<svg viewBox="0 0 200 200" role="img" aria-label="Neptune, a deep blue planet with dark storms">
      ${sphere(id, "#3a63d8", "#8fb4ff", "#0d1f63")}
      <g clip-path="url(#${id}-c)">
        <rect x="0" y="48" width="200" height="10" fill="#2a4bb0" opacity=".45"/>
        <rect x="0" y="78" width="200" height="7" fill="#1c3a94" opacity=".4"/>
        <rect x="0" y="128" width="200" height="12" fill="#25459f" opacity=".4"/>
        <ellipse cx="76" cy="108" rx="26" ry="13" fill="#16296e" opacity=".65"/>
        <ellipse cx="76" cy="108" rx="26" ry="13" fill="none" stroke="#7fa8ff" stroke-width="1.6" opacity=".35"/>
        <path d="M20 150c26-6 44 2 60 0" stroke="#dceaff" stroke-width="3" fill="none" opacity=".35"/>
        <path d="M118 60c18-4 34 0 44 2" stroke="#dceaff" stroke-width="2.5" fill="none" opacity=".3"/>
      </g>
      ${shade(id)}${glowRing(id, "#7fa8ff", 7)}</svg>`,

    sun: id => `<svg viewBox="0 0 200 200" role="img" aria-label="The Sun, a glowing ball of hot gas">
      <defs>
        <radialGradient id="${id}-g" cx="42%" cy="38%" r="62%">
          <stop offset="0%" stop-color="#fffdf0"/><stop offset="45%" stop-color="#ffd257"/><stop offset="82%" stop-color="#ff8c1a"/><stop offset="100%" stop-color="#e2551a"/>
        </radialGradient>
        <radialGradient id="${id}-h" cx="50%" cy="50%" r="50%">
          <stop offset="55%" stop-color="#ffb347" stop-opacity=".55"/><stop offset="100%" stop-color="#ffb347" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <circle cx="100" cy="100" r="96" fill="url(#${id}-h)"/>
      <g opacity=".55">
        <circle cx="100" cy="100" r="86" fill="none" stroke="#ffd257" stroke-width="2" stroke-dasharray="6 8"/>
      </g>
      <circle cx="100" cy="100" r="64" fill="url(#${id}-g)"/>
      <g opacity=".35">
        <ellipse cx="78" cy="86" rx="16" ry="10" fill="#fff8d8"/>
        <ellipse cx="122" cy="118" rx="12" ry="8" fill="#e2551a" opacity=".5"/>
        <ellipse cx="112" cy="72" rx="9" ry="6" fill="#fff8d8"/>
      </g>
      <circle cx="100" cy="100" r="64" fill="none" stroke="#fff3c4" stroke-opacity=".55" stroke-width="2"/></svg>`,

    moon: id => `<svg viewBox="0 0 200 200" role="img" aria-label="The Moon, a grey cratered world">
      ${sphere(id, "#b9bccb", "#f2f4ff", "#585d72")}
      ${craters(id, [[70,66,17],[126,84,11],[92,126,20],[48,110,9],[146,132,8],[108,52,7],[62,158,6],[152,52,6]])}
      <g clip-path="url(#${id}-c)" opacity=".25">
        <ellipse cx="118" cy="112" rx="40" ry="30" fill="#2a2f42" opacity=".35"/>
        <ellipse cx="54" cy="72" rx="22" ry="18" fill="#2a2f42" opacity=".3"/>
      </g>
      ${shade(id)}${glowRing(id, "#dfe4ff", 6)}</svg>`
  };

  function planet(spec, size) {
    const id = uid(spec.art);
    const svg = (PLANET_ART[spec.art] || PLANET_ART.earth)(id);
    return svg.replace("<svg ", '<svg width="100%" height="100%" preserveAspectRatio="xMidYMid meet" ');
  }

  /* ---- mission lesson illustrations ---- */
  const SCENES = {
    constellation: () => `
      <svg viewBox="0 0 400 260" role="img" aria-label="The Big Dipper constellation drawn across the night sky">
        <defs>
          <radialGradient id="sc-bg" cx="50%" cy="20%" r="80%">
            <stop offset="0%" stop-color="#16224a"/><stop offset="100%" stop-color="#070c1c"/>
          </radialGradient>
          <filter id="sc-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        <rect width="400" height="260" rx="14" fill="url(#sc-bg)"/>
        <g fill="#7d90c4" opacity=".7">
          <circle cx="34" cy="42" r="1.4"/><circle cx="92" cy="22" r="1"/><circle cx="170" cy="16" r="1.2"/>
          <circle cx="248" cy="30" r="1"/><circle cx="322" cy="18" r="1.4"/><circle cx="368" cy="58" r="1"/>
          <circle cx="52" cy="120" r="1"/><circle cx="20" cy="196" r="1.3"/><circle cx="390" cy="140" r="1"/>
          <circle cx="330" cy="220" r="1.2"/><circle cx="120" cy="238" r="1"/><circle cx="212" cy="226" r="1.1"/>
        </g>
        <g stroke="#4fe3ff" stroke-width="2" stroke-opacity=".65" stroke-linecap="round" filter="url(#sc-glow)" fill="none">
          <path d="M96 96 L152 74 L212 92 L214 148 L154 168 L96 156 Z"/>
          <path d="M96 96 L60 132"/>
        </g>
        <g fill="#eaf6ff" filter="url(#sc-glow)">
          <circle cx="96" cy="96" r="5.5"/><circle cx="152" cy="74" r="4.6"/><circle cx="212" cy="92" r="4.8"/>
          <circle cx="214" cy="148" r="5"/><circle cx="154" cy="168" r="4.4"/><circle cx="96" cy="156" r="4.4"/>
          <circle cx="60" cy="132" r="4.2"/>
        </g>
        <g fill="#ffc857" opacity=".9">
          <circle cx="96" cy="96" r="9" fill="none" stroke="#ffc857" stroke-width="1" stroke-opacity=".5"/>
        </g>
        <text x="34" y="238" fill="#8fa3d1" font-size="12" font-family="Trebuchet MS">Ursa Major · the Big Dipper</text>
      </svg>`,

    rocket: () => `
      <svg viewBox="0 0 400 260" role="img" aria-label="A rocket lifting off with a plume of exhaust">
        <defs>
          <linearGradient id="rk-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#0a1230"/><stop offset="70%" stop-color="#132049"/><stop offset="100%" stop-color="#1d2c5c"/>
          </linearGradient>
          <linearGradient id="rk-body" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="#8b98b8"/><stop offset="45%" stop-color="#f4f8ff"/><stop offset="100%" stop-color="#96a4c4"/>
          </linearGradient>
          <linearGradient id="rk-flame" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#9ef0ff"/><stop offset="45%" stop-color="#4fe3ff"/><stop offset="100%" stop-color="#ff9d3d" stop-opacity="0"/>
          </linearGradient>
        </defs>
        <rect width="400" height="260" rx="14" fill="url(#rk-sky)"/>
        <g fill="#fff" opacity=".55">
          <circle cx="40" cy="44" r="1.3"/><circle cx="118" cy="26" r="1"/><circle cx="300" cy="40" r="1.2"/>
          <circle cx="356" cy="88" r="1"/><circle cx="66" cy="112" r="1"/><circle cx="332" cy="176" r="1.1"/>
        </g>
        <ellipse cx="200" cy="246" rx="150" ry="18" fill="#4fe3ff" opacity=".09"/>
        <g transform="translate(200 128)">
          <path d="M0 -78c22 18 30 44 30 66v44h-60V-12c0-22 8-48 30-66Z" fill="url(#rk-body)"/>
          <path d="M0 -78c22 18 30 44 30 66v44h-30Z" fill="#000" opacity=".08"/>
          <circle cx="0" cy="-16" r="15" fill="#0c1934"/><circle cx="0" cy="-16" r="11" fill="#4fe3ff" opacity=".9"/>
          <circle cx="-4" cy="-20" r="4" fill="#d9fbff" opacity=".8"/>
          <path d="M-30 6 -52 40 -30 32Z" fill="#ffc857"/><path d="M30 6 52 40 30 32Z" fill="#ffc857"/>
          <rect x="-15" y="32" width="30" height="8" rx="3" fill="#5b6b90"/>
          <path d="M-12 40c0 18 5 32 12 48 7-16 12-30 12-48Z" fill="url(#rk-flame)"/>
          <path d="M-6 40c0 10 2 18 6 28 4-10 6-18 6-28Z" fill="#fff" opacity=".75"/>
        </g>
        <g stroke="#ffc857" stroke-opacity=".5" stroke-width="1.5" stroke-dasharray="4 8" fill="none">
          <path d="M76 210c30-20 40-56 34-96"/><path d="M324 210c-30-20-40-56-34-96"/>
        </g>
      </svg>`,

    cockpit: () => `
      <svg viewBox="0 0 400 260" role="img" aria-label="A spacecraft cockpit full of glowing control screens">
        <defs>
          <linearGradient id="ck-bg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#0a1024"/><stop offset="100%" stop-color="#131f42"/>
          </linearGradient>
          <linearGradient id="ck-glass" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#0d2a4d"/><stop offset="100%" stop-color="#061426"/>
          </linearGradient>
        </defs>
        <rect width="400" height="260" rx="14" fill="url(#ck-bg)"/>
        <path d="M40 132c0-52 44-90 160-90s160 38 160 90v22c-40-22-100-32-160-32s-120 10-160 32Z" fill="url(#ck-glass)" stroke="#3f6ea8" stroke-width="2"/>
        <g opacity=".9">
          <circle cx="120" cy="78" r="2" fill="#fff"/><circle cx="186" cy="60" r="1.4" fill="#fff"/>
          <circle cx="256" cy="70" r="1.8" fill="#fff"/><circle cx="300" cy="96" r="1.2" fill="#fff"/>
        </g>
        <ellipse cx="196" cy="128" rx="52" ry="42" fill="#3f8fe0" opacity=".55"/>
        <path d="M160 108c16-14 42-18 62-8s26 26 22 40-24 22-46 18-42-18-42-30 0-14 4-20Z" fill="#54c47f" opacity=".55"/>
        <path d="M40 132c40-22 100-32 160-32s120 10 160 32" fill="none" stroke="#7ec4ff" stroke-opacity=".4" stroke-width="3"/>
        <rect x="36" y="156" width="328" height="76" rx="12" fill="#0c1730" stroke="#2b4370" stroke-width="2"/>
        <g>
          <rect x="54" y="170" width="86" height="46" rx="6" fill="#0a2b3a" stroke="#2ea8c9" stroke-width="1.4"/>
          <g stroke="#4fe3ff" stroke-width="2" fill="none" opacity=".9">
            <path d="M62 204c10-14 16 4 24-10s16 6 24-8 16 2 22-6"/>
          </g>
          <rect x="152" y="170" width="96" height="46" rx="6" fill="#0a2b3a" stroke="#2ea8c9" stroke-width="1.4"/>
          <g fill="#5ff0b6">
            <rect x="162" y="194" width="9" height="14" rx="2"/><rect x="176" y="186" width="9" height="22" rx="2"/>
            <rect x="190" y="178" width="9" height="30" rx="2"/><rect x="204" y="190" width="9" height="18" rx="2"/>
            <rect x="218" y="182" width="9" height="26" rx="2"/>
          </g>
          <circle cx="284" cy="193" r="21" fill="none" stroke="#ffc857" stroke-width="3" opacity=".35"/>
          <path d="M284 193 L284 175 A18 18 0 0 1 299 202 Z" fill="#ffc857" opacity=".8"/>
          <circle cx="284" cy="193" r="5" fill="#ffe9bd"/>
          <rect x="318" y="172" width="30" height="10" rx="5" fill="#5ff0b6" opacity=".8"/>
          <rect x="318" y="188" width="30" height="10" rx="5" fill="#4fe3ff" opacity=".6"/>
          <rect x="318" y="204" width="30" height="10" rx="5" fill="#ff7d7d" opacity=".6"/>
        </g>
      </svg>`,

    station: () => `
      <svg viewBox="0 0 400 260" role="img" aria-label="A space station orbiting Earth with large solar panels">
        <defs>
          <radialGradient id="st-earth" cx="30%" cy="26%" r="80%">
            <stop offset="0%" stop-color="#7fc7ff"/><stop offset="50%" stop-color="#2b6cc4"/><stop offset="100%" stop-color="#0a2554"/>
          </radialGradient>
          <linearGradient id="st-panel" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#1c3f7a"/><stop offset="100%" stop-color="#0b1f45"/>
          </linearGradient>
        </defs>
        <rect width="400" height="260" rx="14" fill="#050a18"/>
        <circle cx="112" cy="232" r="132" fill="url(#st-earth)"/>
        <path d="M0 196c40-10 80 6 120 2s70-14 110-6v70H0Z" fill="#54c47f" opacity=".35"/>
        <ellipse cx="70" cy="160" rx="60" ry="26" fill="#fff" opacity=".12"/>
        <g fill="#fff" opacity=".6"><circle cx="330" cy="36" r="1.3"/><circle cx="376" cy="98" r="1"/><circle cx="262" cy="22" r="1.1"/></g>
        <g transform="translate(258 116) rotate(-14)">
          <rect x="-86" y="-9" width="172" height="18" rx="5" fill="#c9d3e8"/>
          <rect x="-74" y="-7" width="60" height="14" rx="2" fill="url(#st-panel)" stroke="#4a7bc4" stroke-width="1"/>
          <rect x="14" y="-7" width="60" height="14" rx="2" fill="url(#st-panel)" stroke="#4a7bc4" stroke-width="1"/>
          <g stroke="#6fa6ee" stroke-width=".7" opacity=".6">
            <path d="M-62-7v14M-50-7v14M-38-7v14M-26-7v14M14-7v14M26-7v14M38-7v14M50-7v14"/>
          </g>
          <rect x="-16" y="-22" width="34" height="44" rx="10" fill="#e8eefc"/>
          <rect x="-8" y="-14" width="18" height="10" rx="3" fill="#2a3d63"/>
          <circle cx="2" cy="10" r="5" fill="#4fe3ff"/>
          <circle cx="-4" cy="18" r="3" fill="#ffc857"/>
        </g>
        <g opacity=".35" stroke="#7ec4ff" stroke-dasharray="3 7" fill="none" stroke-width="1.4">
          <path d="M0 108c60 20 120 4 176-14"/>
        </g>
      </svg>`,

    orbit: () => `
      <svg viewBox="0 0 400 260" role="img" aria-label="A satellite circling Earth along an orbital path">
        <defs>
          <radialGradient id="or-earth" cx="32%" cy="28%" r="80%">
            <stop offset="0%" stop-color="#8ed4ff"/><stop offset="52%" stop-color="#2a6ccb"/><stop offset="100%" stop-color="#092352"/>
          </radialGradient>
          <radialGradient id="or-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#4fe3ff" stop-opacity=".28"/><stop offset="100%" stop-color="#4fe3ff" stop-opacity="0"/>
          </radialGradient>
        </defs>
        <rect width="400" height="260" rx="14" fill="#050a18"/>
        <circle cx="200" cy="130" r="112" fill="url(#or-glow)"/>
        <g fill="none" stroke="#4f6db0" stroke-opacity=".55">
          <ellipse cx="200" cy="130" rx="158" ry="104" stroke-dasharray="5 7" stroke-width="1.4"/>
          <ellipse cx="200" cy="130" rx="124" ry="80" stroke-dasharray="5 7" stroke-width="1.2" stroke-opacity=".7"/>
        </g>
        <circle cx="200" cy="130" r="56" fill="url(#or-earth)"/>
        <path d="M162 116c14-8 26-2 30 6s-4 18-16 18-22-8-20-16 2-6 6-8Z" fill="#54c47f" opacity=".8"/>
        <path d="M206 150c10-4 22 0 24 8s-8 14-18 12-16-8-14-14 4-4 8-6Z" fill="#54c47f" opacity=".7"/>
        <ellipse cx="182" cy="104" rx="26" ry="10" fill="#fff" opacity=".18"/>
        <circle cx="200" cy="130" r="56" fill="none" stroke="#a9e4ff" stroke-opacity=".45" stroke-width="2"/>
        <g transform="translate(316 78) rotate(18)">
          <rect x="-14" y="-10" width="28" height="20" rx="6" fill="#e8eefc"/>
          <rect x="-34" y="-6" width="16" height="12" rx="2" fill="#2d4c86" stroke="#6fa6ee" stroke-width="1"/>
          <rect x="18" y="-6" width="16" height="12" rx="2" fill="#2d4c86" stroke="#6fa6ee" stroke-width="1"/>
          <circle cx="0" cy="0" r="4" fill="#4fe3ff"/>
        </g>
        <g fill="#ffc857" opacity=".9"><circle cx="70" cy="190" r="3"/></g>
        <text x="26" y="240" fill="#8fa3d1" font-size="11" font-family="Trebuchet MS">perigee ↓ · apogee ↑</text>
      </svg>`,

    control: () => `
      <svg viewBox="0 0 400 260" role="img" aria-label="Mission control room with screens and a headset">
        <defs>
          <linearGradient id="mc-bg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#07101f"/><stop offset="100%" stop-color="#0e1a33"/>
          </linearGradient>
        </defs>
        <rect width="400" height="260" rx="14" fill="url(#mc-bg)"/>
        <g fill="#142544" stroke="#27446f" stroke-width="1.5">
          <rect x="24" y="28" width="94" height="56" rx="6"/>
          <rect x="128" y="28" width="94" height="56" rx="6"/>
          <rect x="232" y="28" width="94" height="56" rx="6"/>
          <rect x="336" y="28" width="42" height="56" rx="6"/>
        </g>
        <g stroke="#4fe3ff" stroke-width="2" fill="none" opacity=".85">
          <path d="M34 68c14-16 18 2 28-10s16 4 24-8"/>
          <path d="M244 60h70"/>
        </g>
        <g fill="#5ff0b6" opacity=".85">
          <rect x="138" y="56" width="8" height="18" rx="2"/><rect x="150" y="46" width="8" height="28" rx="2"/>
          <rect x="162" y="62" width="8" height="12" rx="2"/><rect x="174" y="40" width="8" height="34" rx="2"/>
          <rect x="186" y="54" width="8" height="20" rx="2"/><rect x="198" y="48" width="8" height="26" rx="2"/>
        </g>
        <g fill="#ffc857" opacity=".8"><circle cx="357" cy="46" r="6"/><circle cx="357" cy="68" r="6" opacity=".5"/></g>
        <rect x="18" y="104" width="364" height="10" rx="4" fill="#1b2f52"/>
        <g>
          <rect x="52" y="118" width="86" height="34" rx="5" fill="#0f2038" stroke="#2c4b76"/>
          <g fill="#4fe3ff" opacity=".8"><rect x="60" y="128" width="20" height="4" rx="2"/><rect x="60" y="136" width="34" height="4" rx="2"/><rect x="60" y="144" width="26" height="4" rx="2"/></g>
          <rect x="256" y="118" width="86" height="34" rx="5" fill="#0f2038" stroke="#2c4b76"/>
          <g fill="#5ff0b6" opacity=".7"><rect x="264" y="128" width="26" height="4" rx="2"/><rect x="264" y="136" width="40" height="4" rx="2"/><rect x="264" y="144" width="18" height="4" rx="2"/></g>
        </g>
        <g transform="translate(196 196)">
          <path d="M-46 22c-16-40 4-70 46-70s62 30 46 70" fill="none" stroke="#8fb0e0" stroke-width="9" stroke-linecap="round"/>
          <ellipse cx="0" cy="10" rx="34" ry="30" fill="#1a2f52" stroke="#4a6d9e" stroke-width="2"/>
          <circle cx="-11" cy="4" r="3.2" fill="#ffc857"/><circle cx="11" cy="4" r="3.2" fill="#ffc857"/>
          <path d="M-12 20c8 6 16 6 24 0" stroke="#ffc857" stroke-width="3" fill="none" stroke-linecap="round"/>
          <path d="M-24 20c-14 6-26 16-30 30" stroke="#8fb0e0" stroke-width="4" fill="none" stroke-linecap="round"/>
          <circle cx="-56" cy="52" r="6" fill="#ff7d7d"/>
        </g>
      </svg>`,

    moon: () => `
      <svg viewBox="0 0 400 260" role="img" aria-label="A lunar lander touching down on the Moon">
        <defs>
          <linearGradient id="mn-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#04070f"/><stop offset="100%" stop-color="#111a2e"/>
          </linearGradient>
          <linearGradient id="mn-grd" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#5d6880"/><stop offset="100%" stop-color="#2b3245"/>
          </linearGradient>
          <linearGradient id="mn-flame" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#fff3c4"/><stop offset="60%" stop-color="#ffb347" stop-opacity=".8"/><stop offset="100%" stop-color="#ff7d3d" stop-opacity="0"/>
          </linearGradient>
        </defs>
        <rect width="400" height="260" rx="14" fill="url(#mn-sky)"/>
        <g fill="#fff"><circle cx="48" cy="40" r="1.2" opacity=".7"/><circle cx="112" cy="24" r="1" opacity=".6"/>
          <circle cx="320" cy="34" r="1.4" opacity=".7"/><circle cx="368" cy="92" r="1" opacity=".5"/><circle cx="272" cy="58" r="1" opacity=".6"/></g>
        <circle cx="330" cy="66" r="24" fill="#e8eeff" opacity=".92"/>
        <circle cx="322" cy="60" r="5" fill="#c3cbe6" opacity=".7"/><circle cx="338" cy="74" r="4" fill="#c3cbe6" opacity=".6"/>
        <path d="M0 186c46-22 92-6 138-14s86-18 132-6 92 16 130 6v88H0Z" fill="url(#mn-grd)"/>
        <path d="M0 186c46-22 92-6 138-14s86-18 132-6 92 16 130 6" fill="none" stroke="#93a0bd" stroke-width="2" opacity=".7"/>
        <g fill="#0b1020" opacity=".3">
          <ellipse cx="90" cy="212" rx="26" ry="7"/><ellipse cx="250" cy="226" rx="34" ry="9"/><ellipse cx="340" cy="204" rx="18" ry="5"/>
        </g>
        <g transform="translate(196 118)">
          <path d="M-34 -30h68l14 40h-96Z" fill="#c9d3e8"/>
          <rect x="-18" y="-44" width="36" height="18" rx="6" fill="#9dabc8"/>
          <circle cx="0" cy="-36" r="6" fill="#0c1934"/><circle cx="0" cy="-36" r="3.5" fill="#4fe3ff"/>
          <rect x="-30" y="10" width="60" height="12" rx="4" fill="#8b98b8"/>
          <path d="M-44 10 -56 34M44 10 56 34M-20 22 -24 40M20 22 24 40" stroke="#8b98b8" stroke-width="4" stroke-linecap="round"/>
          <ellipse cx="-56" cy="36" rx="8" ry="3" fill="#6c7793"/><ellipse cx="56" cy="36" rx="8" ry="3" fill="#6c7793"/>
          <ellipse cx="-24" cy="42" rx="7" ry="3" fill="#6c7793"/><ellipse cx="24" cy="42" rx="7" ry="3" fill="#6c7793"/>
          <path d="M-8 24c0 16 3 28 8 40 5-12 8-24 8-40Z" fill="url(#mn-flame)" opacity=".9"/>
        </g>
        <g fill="#5a6580" opacity=".55">
          <circle cx="70" cy="176" r="2"/><circle cx="146" cy="162" r="1.6"/><circle cx="286" cy="166" r="1.8"/>
        </g>
      </svg>`
  };

  /* ---- level 8: solar storm ---- */
  SCENES.sunstorm = () => `
      <svg viewBox="0 0 400 260" role="img" aria-label="The Sun throwing a storm of particles towards Earth">
        <defs>
          <radialGradient id="ss-sun" cx="50%" cy="50%">
            <stop offset="0%" stop-color="#fff6d0"/><stop offset="45%" stop-color="#ffc857"/><stop offset="100%" stop-color="#ff7d3d"/>
          </radialGradient>
          <radialGradient id="ss-glow" cx="50%" cy="50%">
            <stop offset="0%" stop-color="#ffb347" stop-opacity=".55"/><stop offset="100%" stop-color="#ffb347" stop-opacity="0"/>
          </radialGradient>
          <linearGradient id="ss-earth" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#4fe3ff"/><stop offset="100%" stop-color="#1b6fa8"/>
          </linearGradient>
        </defs>
        <rect width="400" height="260" rx="14" fill="#04070f"/>
        <g fill="#fff"><circle cx="60" cy="30" r="1.1" opacity=".6"/><circle cx="200" cy="18" r="1" opacity=".5"/>
          <circle cx="300" cy="46" r="1.2" opacity=".6"/><circle cx="150" cy="240" r="1" opacity=".4"/><circle cx="360" cy="200" r="1.1" opacity=".5"/></g>
        <circle cx="86" cy="130" r="86" fill="url(#ss-glow)"/>
        <circle cx="86" cy="130" r="46" fill="url(#ss-sun)"/>
        <g stroke="#ffb347" stroke-width="2.4" stroke-linecap="round" opacity=".85">
          <path d="M86 66v-16M86 194v16M22 130H6M150 130h16M41 85 30 74M131 175l11 11M131 85l11-11M41 175l-11 11"/>
        </g>
        <g fill="#ff7d3d" opacity=".5">
          <ellipse cx="70" cy="118" rx="9" ry="6"/><ellipse cx="104" cy="146" rx="7" ry="5"/>
        </g>
        <g stroke="#ffc857" stroke-width="2" fill="none" opacity=".8" stroke-dasharray="5 6">
          <path d="M136 108c40-16 78-24 118-22"/><path d="M136 130c42 0 80 2 118 6"/><path d="M136 152c40 16 78 24 118 22"/>
        </g>
        <g fill="#ffd166"><circle cx="176" cy="98" r="2.4"/><circle cx="214" cy="92" r="2"/><circle cx="252" cy="90" r="2.2"/>
          <circle cx="180" cy="132" r="2.2"/><circle cx="222" cy="134" r="2.4"/><circle cx="258" cy="138" r="2"/>
          <circle cx="178" cy="164" r="2"/><circle cx="216" cy="170" r="2.2"/><circle cx="254" cy="172" r="2.4"/></g>
        <circle cx="316" cy="130" r="34" fill="url(#ss-earth)"/>
        <path d="M292 112c14 6 30 4 44-2M290 140c16 8 34 8 50 0M300 156c12 4 24 4 34 0" stroke="#5ff0b6" stroke-width="3" fill="none" opacity=".7"/>
        <ellipse cx="316" cy="130" rx="52" ry="52" fill="none" stroke="#4fe3ff" stroke-width="1.6" opacity=".45"/>
        <ellipse cx="316" cy="130" rx="62" ry="62" fill="none" stroke="#4fe3ff" stroke-width="1.2" opacity=".25"/>
      </svg>`,

  /* ---- level 9: EVA ---- */
  SCENES.eva = () => `
      <svg viewBox="0 0 400 260" role="img" aria-label="An astronaut on a spacewalk tethered to a space station">
        <defs>
          <linearGradient id="ev-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#03060e"/><stop offset="100%" stop-color="#0a1226"/>
          </linearGradient>
          <linearGradient id="ev-earth" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#2f7fd0"/><stop offset="100%" stop-color="#0d3a63"/>
          </linearGradient>
        </defs>
        <rect width="400" height="260" rx="14" fill="url(#ev-sky)"/>
        <g fill="#fff"><circle cx="40" cy="34" r="1.2" opacity=".7"/><circle cx="120" cy="20" r="1" opacity=".5"/>
          <circle cx="250" cy="30" r="1.3" opacity=".6"/><circle cx="350" cy="60" r="1" opacity=".5"/><circle cx="300" cy="16" r="1.1" opacity=".6"/></g>
        <path d="M0 260c0-70 60-118 150-118s150 48 150 118Z" fill="url(#ev-earth)"/>
        <path d="M40 200c30-14 60-10 88 2M120 176c26-10 52-6 74 6M210 190c22-8 44-4 62 6" stroke="#5ff0b6" stroke-width="4" fill="none" opacity=".55"/>
        <path d="M0 260c0-70 60-118 150-118s150 48 150 118" fill="none" stroke="#7fd8ff" stroke-width="2" opacity=".5"/>
        <g transform="translate(300 74)">
          <rect x="-46" y="-16" width="92" height="34" rx="8" fill="#c9d3e8"/>
          <rect x="-30" y="-30" width="60" height="16" rx="5" fill="#9dabc8"/>
          <rect x="-70" y="-6" width="26" height="14" rx="3" fill="#4fe3ff" opacity=".85"/>
          <rect x="44" y="-6" width="26" height="14" rx="3" fill="#4fe3ff" opacity=".85"/>
          <circle cx="0" cy="1" r="7" fill="#0c1934"/><circle cx="0" cy="1" r="4" fill="#4fe3ff"/>
        </g>
        <path d="M262 78C210 96 176 130 160 168" stroke="#ffc857" stroke-width="2.4" fill="none" stroke-dasharray="6 5"/>
        <g transform="translate(150 178)">
          <rect x="-16" y="-14" width="32" height="30" rx="9" fill="#eef3ff"/>
          <circle cx="0" cy="-24" r="17" fill="#eef3ff"/>
          <path d="M-13 -26a13 13 0 0 1 26 0Z" fill="#2b3f66" opacity=".9"/>
          <rect x="-22" y="-6" width="10" height="20" rx="5" fill="#dbe4f7"/>
          <rect x="12" y="-6" width="10" height="20" rx="5" fill="#dbe4f7"/>
          <rect x="-12" y="16" width="10" height="22" rx="5" fill="#dbe4f7"/>
          <rect x="2" y="16" width="10" height="22" rx="5" fill="#dbe4f7"/>
          <rect x="-14" y="-30" width="28" height="8" rx="4" fill="#4fe3ff" opacity=".8"/>
        </g>
        <g fill="#ffc857" opacity=".9"><circle cx="196" cy="120" r="2"/><circle cx="216" cy="140" r="1.6"/><circle cx="232" cy="104" r="1.8"/></g>
      </svg>`,

  /* ---- level 10: rocket engineering ---- */
  SCENES.engineering = () => `
      <svg viewBox="0 0 400 260" role="img" aria-label="A rocket shown in cutaway with its stages and engine nozzle">
        <defs>
          <linearGradient id="en-body" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="#8b98b8"/><stop offset="45%" stop-color="#eef3ff"/><stop offset="100%" stop-color="#9dabc8"/>
          </linearGradient>
          <linearGradient id="en-flame" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#fff3c4"/><stop offset="55%" stop-color="#ffb347" stop-opacity=".85"/><stop offset="100%" stop-color="#ff5f3d" stop-opacity="0"/>
          </linearGradient>
        </defs>
        <rect width="400" height="260" rx="14" fill="#060b18"/>
        <g stroke="#1d2a4a" stroke-width="1"><path d="M0 60h400M0 120h400M0 180h400M0 240h400"/></g>
        <g transform="translate(200 0)">
          <path d="M0 18c14 22 22 48 22 78v70h-44V96c0-30 8-56 22-78Z" fill="url(#en-body)"/>
          <path d="M-22 96h44v70h-44Z" fill="#c9d3e8" opacity=".55"/>
          <rect x="-24" y="104" width="48" height="4" fill="#ff7d7d" opacity=".8"/>
          <rect x="-24" y="150" width="48" height="4" fill="#4fe3ff" opacity=".8"/>
          <path d="M-22 166 -40 196h80l-18-30Z" fill="#8b98b8"/>
          <path d="M-40 196 -52 214h104l-12-18Z" fill="#6c7793"/>
          <path d="M-16 214c0 18 4 30 16 44 12-14 16-26 16-44Z" fill="url(#en-flame)"/>
          <circle cx="0" cy="60" r="9" fill="#0c1934"/><circle cx="0" cy="60" r="5" fill="#4fe3ff"/>
          <path d="M-22 40 -40 62v22l18-14Z" fill="#ff7d7d" opacity=".85"/>
          <path d="M22 40 40 62v22l-18-14Z" fill="#ff7d7d" opacity=".85"/>
        </g>
        <g stroke="#4fe3ff" stroke-width="1.4" fill="none" opacity=".7">
          <path d="M244 60h44"/><path d="M244 120h44"/><path d="M244 180h44"/>
        </g>
        <g fill="#7fd8ff" font-size="11" font-family="monospace">
          <text x="294" y="64">STAGE 1</text><text x="294" y="124">STAGE 2</text><text x="294" y="184">NOZZLE</text>
        </g>
        <g fill="#ffc857" font-size="10" font-family="monospace" opacity=".9">
          <text x="20" y="40">FUEL</text><text x="20" y="56">OXIDISER</text>
        </g>
      </svg>`,

  /* ---- level 11: satellites & GPS ---- */
  SCENES.satellite = () => `
      <svg viewBox="0 0 400 260" role="img" aria-label="GPS satellites orbiting Earth and sending signals to a phone on the ground">
        <defs>
          <radialGradient id="sa-earth" cx="35%" cy="30%">
            <stop offset="0%" stop-color="#5fd0ff"/><stop offset="60%" stop-color="#1b6fa8"/><stop offset="100%" stop-color="#0a2c4d"/>
          </radialGradient>
        </defs>
        <rect width="400" height="260" rx="14" fill="#04070f"/>
        <g fill="#fff"><circle cx="30" cy="30" r="1.1" opacity=".6"/><circle cx="370" cy="40" r="1.2" opacity=".6"/>
          <circle cx="200" cy="16" r="1" opacity=".5"/><circle cx="330" cy="230" r="1" opacity=".4"/></g>
        <circle cx="200" cy="196" r="96" fill="url(#sa-earth)"/>
        <path d="M120 150c26 12 54 8 78-4M150 200c30 10 62 6 88-6M180 240c26 6 50 2 70-6" stroke="#5ff0b6" stroke-width="4" fill="none" opacity=".5"/>
        <ellipse cx="200" cy="196" rx="150" ry="52" fill="none" stroke="#4fe3ff" stroke-width="1.4" opacity=".4"/>
        <ellipse cx="200" cy="196" rx="186" ry="70" fill="none" stroke="#4fe3ff" stroke-width="1.1" opacity=".22"/>
        <g transform="translate(96 96)">
          <rect x="-16" y="-11" width="32" height="22" rx="4" fill="#c9d3e8"/>
          <rect x="-46" y="-8" width="28" height="16" rx="2" fill="#4fe3ff" opacity=".9"/>
          <rect x="18" y="-8" width="28" height="16" rx="2" fill="#4fe3ff" opacity=".9"/>
          <circle cx="0" cy="0" r="4" fill="#0c1934"/>
        </g>
        <g transform="translate(300 84)">
          <rect x="-16" y="-11" width="32" height="22" rx="4" fill="#c9d3e8"/>
          <rect x="-46" y="-8" width="28" height="16" rx="2" fill="#4fe3ff" opacity=".9"/>
          <rect x="18" y="-8" width="28" height="16" rx="2" fill="#4fe3ff" opacity=".9"/>
          <circle cx="0" cy="0" r="4" fill="#0c1934"/>
        </g>
        <g transform="translate(200 40)">
          <rect x="-16" y="-11" width="32" height="22" rx="4" fill="#c9d3e8"/>
          <rect x="-46" y="-8" width="28" height="16" rx="2" fill="#4fe3ff" opacity=".9"/>
          <rect x="18" y="-8" width="28" height="16" rx="2" fill="#4fe3ff" opacity=".9"/>
          <circle cx="0" cy="0" r="4" fill="#0c1934"/>
        </g>
        <g stroke="#ffc857" stroke-width="1.6" fill="none" opacity=".75" stroke-dasharray="4 5">
          <path d="M96 108 176 176"/><path d="M300 96 224 176"/><path d="M200 52 200 176"/>
        </g>
        <g transform="translate(200 200)">
          <rect x="-13" y="-22" width="26" height="44" rx="6" fill="#0f1a33" stroke="#4fe3ff" stroke-width="1.6"/>
          <rect x="-9" y="-17" width="18" height="30" rx="3" fill="#4fe3ff" opacity=".35"/>
          <circle cx="0" cy="16" r="2.6" fill="#5ff0b6"/>
        </g>
        <g fill="#ffc857"><circle cx="176" cy="176" r="3"/><circle cx="224" cy="176" r="3"/><circle cx="200" cy="176" r="3"/></g>
      </svg>`,

  /* ---- level 12: living in zero gravity ---- */
  SCENES.zeroglife = () => `
      <svg viewBox="0 0 400 260" role="img" aria-label="An astronaut sleeping in a wall-mounted sleeping bag while objects float around">
        <defs>
          <linearGradient id="zg-wall" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#101a33"/><stop offset="100%" stop-color="#070d1c"/>
          </linearGradient>
        </defs>
        <rect width="400" height="260" rx="14" fill="url(#zg-wall)"/>
        <g stroke="#1d2a4a" stroke-width="1.4" fill="none">
          <path d="M0 52h400M0 208h400M60 0v260M340 0v260"/>
        </g>
        <g fill="#4fe3ff" opacity=".5"><circle cx="30" cy="26" r="3"/><circle cx="370" cy="26" r="3"/><circle cx="30" cy="234" r="3"/><circle cx="370" cy="234" r="3"/></g>
        <g transform="translate(96 130)">
          <rect x="-34" y="-72" width="68" height="144" rx="26" fill="#1b2745" stroke="#4fe3ff" stroke-width="1.6" opacity=".9"/>
          <rect x="-26" y="-62" width="52" height="124" rx="20" fill="#243356"/>
          <circle cx="0" cy="-34" r="20" fill="#eef3ff"/>
          <path d="M-15 -36a15 15 0 0 1 30 0Z" fill="#2b3f66" opacity=".9"/>
          <path d="M-8 -30c3 3 13 3 16 0" stroke="#2b3f66" stroke-width="2" fill="none" stroke-linecap="round"/>
          <rect x="-20" y="-6" width="40" height="52" rx="14" fill="#dbe4f7" opacity=".9"/>
          <path d="M-20 6h40M-20 22h40" stroke="#9dabc8" stroke-width="2"/>
        </g>
        <g transform="translate(232 74) rotate(-14)">
          <rect x="-20" y="-14" width="40" height="28" rx="5" fill="#c9d3e8"/>
          <rect x="-14" y="-8" width="28" height="16" rx="3" fill="#4fe3ff" opacity=".5"/>
        </g>
        <g transform="translate(300 150) rotate(18)">
          <path d="M-16 -18h32l6 36h-44Z" fill="#ffc857" opacity=".9"/>
          <rect x="-12" y="-26" width="24" height="10" rx="4" fill="#ff7d7d"/>
        </g>
        <g transform="translate(196 200) rotate(-8)">
          <circle cx="0" cy="0" r="15" fill="#5ff0b6" opacity=".85"/>
          <path d="M-6 -4c4 4 8 4 12 0" stroke="#063d2c" stroke-width="2" fill="none" stroke-linecap="round"/>
        </g>
        <g transform="translate(268 40) rotate(24)">
          <rect x="-14" y="-10" width="28" height="20" rx="4" fill="#a99bff" opacity=".85"/>
        </g>
        <g stroke="#4fe3ff" stroke-width="1.2" fill="none" opacity=".35" stroke-dasharray="3 6">
          <path d="M232 74c-20 20-30 40-36 60"/><path d="M300 150c-30 10-60 20-90 34"/>
        </g>
      </svg>`,

  /* ---- level 13: deep space telescope ---- */
  SCENES.telescope = () => `
      <svg viewBox="0 0 400 260" role="img" aria-label="A space telescope with a segmented mirror looking at a distant galaxy">
        <defs>
          <radialGradient id="ts-gal" cx="50%" cy="50%">
            <stop offset="0%" stop-color="#fff6d0"/><stop offset="35%" stop-color="#ffc857" stop-opacity=".8"/><stop offset="100%" stop-color="#a99bff" stop-opacity="0"/>
          </radialGradient>
          <linearGradient id="ts-tube" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#eef3ff"/><stop offset="100%" stop-color="#8b98b8"/>
          </linearGradient>
        </defs>
        <rect width="400" height="260" rx="14" fill="#03060e"/>
        <g fill="#fff"><circle cx="40" cy="40" r="1.2" opacity=".7"/><circle cx="120" cy="24" r="1" opacity=".5"/>
          <circle cx="250" cy="34" r="1.3" opacity=".6"/><circle cx="360" cy="70" r="1" opacity=".5"/>
          <circle cx="330" cy="200" r="1.1" opacity=".5"/><circle cx="60" cy="220" r="1" opacity=".4"/></g>
        <g transform="translate(300 70)">
          <ellipse cx="0" cy="0" rx="52" ry="30" fill="url(#ts-gal)" transform="rotate(-24)"/>
          <ellipse cx="0" cy="0" rx="30" ry="16" fill="none" stroke="#ffc857" stroke-width="1.6" opacity=".7" transform="rotate(-24)"/>
          <ellipse cx="0" cy="0" rx="14" ry="7" fill="#fff6d0" opacity=".9" transform="rotate(-24)"/>
        </g>
        <g transform="translate(150 150) rotate(-18)">
          <rect x="-70" y="-30" width="140" height="60" rx="10" fill="url(#ts-tube)"/>
          <rect x="-70" y="-30" width="140" height="60" rx="10" fill="none" stroke="#6c7793" stroke-width="1.6"/>
          <g fill="#ffc857" opacity=".9">
            <path d="M-56 -18h20l10 18-10 18h-20l-10-18Z"/><path d="M-30 -18h20l10 18-10 18h-20l-10-18Z"/>
            <path d="M-4 -18h20l10 18-10 18h-20l-10-18Z"/><path d="M22 -18h20l10 18-10 18h-20l-10-18Z"/>
          </g>
          <rect x="70" y="-14" width="26" height="28" rx="6" fill="#4fe3ff" opacity=".85"/>
          <rect x="-96" y="-20" width="26" height="40" rx="6" fill="#9dabc8"/>
        </g>
        <g stroke="#4fe3ff" stroke-width="1.4" fill="none" opacity=".6" stroke-dasharray="5 6">
          <path d="M76 138 250 78"/>
        </g>
        <g transform="translate(150 150) rotate(-18)">
          <rect x="-40" y="30" width="80" height="10" rx="4" fill="#6c7793"/>
        </g>
        <g fill="#5ff0b6" opacity=".8"><circle cx="200" cy="228" r="2"/><circle cx="230" cy="236" r="1.6"/><circle cx="170" cy="238" r="1.8"/></g>
      </svg>`,

  /* ---- level 14: Mars colony ---- */
  SCENES.marsbase = () => `
      <svg viewBox="0 0 400 260" role="img" aria-label="A Mars colony of domes and greenhouses under a dusty pink sky">
        <defs>
          <linearGradient id="mb-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#2a1220"/><stop offset="55%" stop-color="#7a3a2e"/><stop offset="100%" stop-color="#c97a52"/>
          </linearGradient>
          <linearGradient id="mb-grd" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#b5643f"/><stop offset="100%" stop-color="#6d3520"/>
          </linearGradient>
          <linearGradient id="mb-dome" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#dff6ff" stop-opacity=".85"/><stop offset="100%" stop-color="#4fe3ff" stop-opacity=".35"/>
          </linearGradient>
        </defs>
        <rect width="400" height="260" rx="14" fill="url(#mb-sky)"/>
        <circle cx="330" cy="52" r="20" fill="#ffd9a8" opacity=".55"/>
        <g fill="#fff" opacity=".5"><circle cx="60" cy="30" r="1"/><circle cx="180" cy="22" r="1.1"/><circle cx="260" cy="40" r="1"/></g>
        <path d="M0 150c50-26 96-10 146-20s92-22 140-8 78 18 114 8v130H0Z" fill="url(#mb-grd)"/>
        <path d="M0 150c50-26 96-10 146-20s92-22 140-8 78 18 114 8" fill="none" stroke="#e0a077" stroke-width="2" opacity=".6"/>
        <g fill="#5a2a18" opacity=".35"><ellipse cx="80" cy="196" rx="30" ry="8"/><ellipse cx="300" cy="212" rx="38" ry="10"/></g>
        <g transform="translate(120 150)">
          <path d="M-52 0a52 52 0 0 1 104 0Z" fill="url(#mb-dome)" stroke="#7fd8ff" stroke-width="2"/>
          <path d="M-30 0a30 30 0 0 1 60 0Z" fill="#0f2a3a" opacity=".5"/>
          <rect x="-8" y="-30" width="16" height="30" rx="4" fill="#0f2a3a" opacity=".6"/>
          <rect x="-56" y="0" width="112" height="8" rx="3" fill="#8b98b8"/>
        </g>
        <g transform="translate(250 158)">
          <path d="M-40 0a40 40 0 0 1 80 0Z" fill="url(#mb-dome)" stroke="#7fd8ff" stroke-width="2"/>
          <g fill="#5ff0b6" opacity=".8">
            <path d="M-22 0c0-12 6-20 12-24 6 4 12 12 12 24Z"/><path d="M2 0c0-10 5-17 10-20 5 3 10 10 10 20Z"/>
          </g>
          <rect x="-44" y="0" width="88" height="8" rx="3" fill="#8b98b8"/>
        </g>
        <g transform="translate(196 120)">
          <rect x="-3" y="-40" width="6" height="40" fill="#8b98b8"/>
          <path d="M-16 -40h32l-6 -12h-20Z" fill="#4fe3ff" opacity=".8"/>
          <circle cx="0" cy="-46" r="3" fill="#ff7d7d"/>
        </g>
        <g transform="translate(60 190)">
          <rect x="-18" y="-10" width="36" height="20" rx="5" fill="#c9d3e8"/>
          <circle cx="-10" cy="12" r="5" fill="#6c7793"/><circle cx="10" cy="12" r="5" fill="#6c7793"/>
          <rect x="-12" y="-18" width="24" height="8" rx="3" fill="#4fe3ff" opacity=".8"/>
        </g>
        <g stroke="#ffc857" stroke-width="1.4" fill="none" opacity=".5" stroke-dasharray="4 5">
          <path d="M196 80 120 150"/><path d="M196 80 250 158"/>
        </g>
      </svg>`,

  /* ---- level 15: graduation ---- */
  SCENES.graduation = () => `
      <svg viewBox="0 0 400 260" role="img" aria-label="A cadet graduating with wings and a certificate in front of a starry sky">
        <defs>
          <radialGradient id="gr-glow" cx="50%" cy="45%">
            <stop offset="0%" stop-color="#ffc857" stop-opacity=".45"/><stop offset="100%" stop-color="#ffc857" stop-opacity="0"/>
          </radialGradient>
          <linearGradient id="gr-suit" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#ffffff"/><stop offset="100%" stop-color="#c9d3e8"/>
          </linearGradient>
        </defs>
        <rect width="400" height="260" rx="14" fill="#04070f"/>
        <g fill="#fff"><circle cx="50" cy="36" r="1.2" opacity=".7"/><circle cx="140" cy="22" r="1" opacity=".5"/>
          <circle cx="260" cy="30" r="1.3" opacity=".6"/><circle cx="350" cy="56" r="1" opacity=".5"/>
          <circle cx="90" cy="220" r="1" opacity=".4"/><circle cx="320" cy="216" r="1.1" opacity=".5"/></g>
        <circle cx="200" cy="120" r="120" fill="url(#gr-glow)"/>
        <g transform="translate(200 150)">
          <rect x="-30" y="-30" width="60" height="70" rx="16" fill="url(#gr-suit)"/>
          <circle cx="0" cy="-52" r="26" fill="#eef3ff"/>
          <path d="M-20 -54a20 20 0 0 1 40 0Z" fill="#2b3f66" opacity=".9"/>
          <path d="M-11 -46c4 4 18 4 22 0" stroke="#2b3f66" stroke-width="2.4" fill="none" stroke-linecap="round"/>
          <rect x="-38" y="-24" width="14" height="34" rx="7" fill="#dbe4f7"/>
          <rect x="24" y="-24" width="14" height="34" rx="7" fill="#dbe4f7"/>
          <rect x="-22" y="40" width="16" height="34" rx="7" fill="#dbe4f7"/>
          <rect x="6" y="40" width="16" height="34" rx="7" fill="#dbe4f7"/>
          <g transform="translate(0 -6)">
            <path d="M-16 0h32v10h-32Z" fill="#ffc857"/>
            <path d="M-16 0 -30 -8v10Z" fill="#ffc857"/><path d="M16 0 30 -8v10Z" fill="#ffc857"/>
            <circle cx="0" cy="5" r="4" fill="#ff7d7d"/>
          </g>
          <g transform="translate(0 -78)">
            <path d="M-34 0h68l-8 -10h-52Z" fill="#0f1a33"/>
            <rect x="-30" y="-10" width="60" height="10" rx="2" fill="#1b2745"/>
            <path d="M30 -6 44 4" stroke="#ffc857" stroke-width="3" stroke-linecap="round"/>
            <circle cx="46" cy="6" r="4" fill="#ffc857"/>
          </g>
        </g>
        <g transform="translate(96 196) rotate(-12)">
          <rect x="-30" y="-20" width="60" height="40" rx="4" fill="#f4f7ff"/>
          <path d="M-22 -10h44M-22 0h44M-22 10h30" stroke="#9dabc8" stroke-width="2"/>
          <circle cx="20" cy="10" r="6" fill="#ff7d7d" opacity=".8"/>
        </g>
        <g fill="#ffc857" opacity=".9">
          <path d="M300 60 303 68 311 68 305 73 307 81 300 76 293 81 295 73 289 68 297 68Z"/>
          <path d="M330 120 332 126 338 126 333 130 335 136 330 132 325 136 327 130 322 126 328 126Z"/>
        </g>
      </svg>`,

  /* ---- focus target: a distant galaxy ---- */
  SCENES.galaxy = () => `
      <svg viewBox="0 0 200 200" role="img" aria-label="A distant spiral galaxy">
        <defs>
          <radialGradient id="gx-core" cx="50%" cy="50%">
            <stop offset="0%" stop-color="#fff6d0"/><stop offset="40%" stop-color="#ffc857" stop-opacity=".85"/><stop offset="100%" stop-color="#a99bff" stop-opacity="0"/>
          </radialGradient>
        </defs>
        <rect width="200" height="200" fill="none"/>
        <ellipse cx="100" cy="100" rx="92" ry="52" fill="url(#gx-core)" transform="rotate(-24 100 100)"/>
        <g fill="none" stroke="#a99bff" stroke-width="2.4" opacity=".75" transform="rotate(-24 100 100)">
          <ellipse cx="100" cy="100" rx="70" ry="34"/>
          <ellipse cx="100" cy="100" rx="48" ry="22"/>
          <ellipse cx="100" cy="100" rx="26" ry="12"/>
        </g>
        <ellipse cx="100" cy="100" rx="18" ry="9" fill="#fff6d0" opacity=".95" transform="rotate(-24 100 100)"/>
        <g fill="#fff" opacity=".9">
          <circle cx="46" cy="72" r="1.6"/><circle cx="150" cy="128" r="1.6"/>
          <circle cx="70" cy="140" r="1.3"/><circle cx="132" cy="62" r="1.3"/>
          <circle cx="100" cy="40" r="1.2"/><circle cx="100" cy="162" r="1.2"/>
        </g>
      </svg>`;

  function scene(name) {
    return (SCENES[name] || SCENES.constellation)();
  }

  /* ---- cadet avatar ---- */
  function cadet(opts) {
    const o = opts || {};
    const u = "cd" + (++__uid);
    const suit = SUITS.find(s => s.id === o.suit) || SUITS[0];
    const skin = SKINS.find(s => s.id === o.skin) || SKINS[0];
    const face = skin.colors;
    const characterFeatures = skin.features || {};
    const hairItem = HAIR_STYLES.find(item => item.id === o.hair) || HAIR_STYLES[0];
    const eyeItem = EYE_STYLES.find(item => item.id === o.eyes) || EYE_STYLES[0];
    const expressionItem = EXPRESSIONS.find(item => item.id === o.expression) || EXPRESSIONS[0];
    const hairStyle = hairItem.style === "skin" ? (characterFeatures.hair || "none") : hairItem.style;
    const hairColor = hairItem.style === "skin" ? (characterFeatures.hair === "silver_swept" || characterFeatures.hair === "white_curly" ? "#e7edf5" : characterFeatures.hair === "dark_curls" ? "#30251f" : "#65402c") : (hairItem.color || "#65402c");
    let hairMark = "";
    if (hairStyle === "silver_swept" || hairStyle === "silver") hairMark = `<path d="M77 65c-5-13 2-24 14-24 7-10 25-9 30 2 10 0 15 10 8 19-8-7-16-9-24-6-9-4-18 3-28 9Z" fill="${hairColor}" stroke="#9da9b8" stroke-width="1.4"/><path d="M84 49q10-9 19-3M108 45q9-3 15 4" stroke="#fff" stroke-width="2" fill="none" opacity=".75"/>`;
    else if (hairStyle === "white_curly" || hairStyle === "curly") hairMark = `<g fill="${hairColor}" stroke="#aeb9c7" stroke-width="1.2"><circle cx="82" cy="53" r="9"/><circle cx="92" cy="45" r="10"/><circle cx="105" cy="43" r="10"/><circle cx="117" cy="49" r="9"/><circle cx="123" cy="59" r="7"/></g>`;
    else if (hairStyle === "brown_tuft" || hairStyle === "classic") hairMark = `<path d="M77 64c-4-11 2-20 12-21l5-8 8 7 8-5 5 9c10 1 14 9 9 18-8-6-14-7-22-4-8-3-16 1-25 4Z" fill="${hairColor}" stroke="#422b22" stroke-width="1.4"/>`;
    else if (hairStyle === "dark_curls") hairMark = `<g fill="${hairColor}"><circle cx="80" cy="57" r="7"/><circle cx="87" cy="47" r="8"/><circle cx="98" cy="43" r="8"/><circle cx="109" cy="45" r="8"/><circle cx="119" cy="53" r="8"/><circle cx="123" cy="62" r="6"/></g>`;
    else if (hairStyle === "spiky") hairMark = `<path d="M77 64 72 45 88 54 91 34 103 52 116 33 117 54 132 43 126 66Z" fill="${hairColor}" stroke="#422b22" stroke-width="1.3"/>`;
    else if (hairStyle === "flow") hairMark = `<path d="M77 66c-8-17-1-31 13-34 16-8 34 1 38 15 3 9-1 16-7 22-1-16-10-22-19-19-9-3-17 6-25 16Z" fill="${hairColor}" stroke="#3b5272" stroke-width="1.3"/><path d="M116 47q15 8 13 26" stroke="${hairColor}" stroke-width="6" fill="none" stroke-linecap="round"/>`;
    const glassesMark = characterFeatures.glasses === "round" ? `<g fill="none" stroke="#25344d" stroke-width="2.5"><circle cx="89" cy="75" r="8"/><circle cx="111" cy="75" r="8"/><path d="M97 75h6M81 73l-4-2M119 73l4-2"/></g>` : characterFeatures.glasses === "rectangular" ? `<g fill="none" stroke="#35465f" stroke-width="2.5"><rect x="80" y="68" width="18" height="14" rx="3"/><rect x="102" y="68" width="18" height="14" rx="3"/><path d="M98 74h4M80 73l-4-2M120 73l4-2"/></g>` : "";
    const beardColor = characterFeatures.beard || characterFeatures.mustache || "#6b4938";
    const beardMark = characterFeatures.beard ? `<path d="M80 91q20 13 40 0l-4 17q-16 13-32 0Z" fill="${beardColor}" stroke="#9da9b8" stroke-width="1.1"/><path d="M88 99q12 5 24 0" stroke="#fff" stroke-width="1.4" opacity=".5" fill="none"/>` : "";
    const mustacheMark = characterFeatures.mustache ? `<path d="M99 88q-7-6-14-2-4 4-9 1 2 9 11 8 7-1 12-5 5 4 12 5 9 1 11-8-5 3-9-1-7-4-14 2Z" fill="${characterFeatures.mustache}"/>` : "";
    const expressionMark = expressionItem.style === "grin" ? `<path d="M88 86q12 17 24 0v5q-12 12-24 0Z" fill="#7c2f3d" stroke="${face.shadow}" stroke-width="2"/>` : expressionItem.style === "surprised" ? `<ellipse cx="100" cy="89" rx="4.5" ry="6" fill="#7c2f3d" stroke="${face.shadow}" stroke-width="2"/>` : expressionItem.style === "curious" ? `<path d="M92 89q7-7 14-1" stroke="${face.shadow}" stroke-width="2.5" fill="none" stroke-linecap="round"/>` : expressionItem.style === "calm" ? `<path d="M92 89h16" stroke="${face.shadow}" stroke-width="2.5" fill="none" stroke-linecap="round"/>` : `<path d="M92 88c5 4 11 4 16 0" stroke="${face.shadow}" stroke-width="2.5" fill="none" stroke-linecap="round"/>`;
    const helmet = o.helmet || "helm_bubble";
    const badge = o.badge || "badge_none";
    const visorId = o.visor || "visor_clear";
    const hatId = o.hat || "hat_none";
    const packId = o.backpack || "pack_std";
    const bootId = o.boots || "boot_std";
    const gloveId = o.gloves || "glove_std";
    const capeId = o.cape || "cape_none";
    const petId = o.pet || "pet_none";
    const trailId = o.trail || "trail_none";
    const c = suit.colors;
    const bodyDark = shadeColor(c.body, -0.34);
    const bodyMid = shadeColor(c.body, -0.14);

    const visorItem = VISORS.find(v => v.id === visorId) || VISORS[0];
    const visorFill = helmet === "helm_gold" ? "#ffcf4d" : visorItem.tint;
    const visorOpacity = helmet === "helm_gold" ? ".92" : String(visorItem.alpha);

    const antenna = helmet === "helm_horn" ? `
      <g transform="translate(150 44)">
        <rect x="-2" y="0" width="4" height="22" rx="2" fill="${c.trim}"/>
        <ellipse cx="0" cy="-4" rx="15" ry="6" fill="${c.trim}" opacity=".9"/>
        <ellipse cx="0" cy="-6" rx="15" ry="6" fill="${bodyDark}" opacity=".55"/>
        <circle cx="0" cy="-4" r="3" fill="#4fe3ff"/>
      </g>` : "";
    const crest = helmet === "helm_star" ? `
      <g transform="translate(100 26)">
        <path d="M0 -10 3 -3 10 -3 4.5 1.5 6.5 8.5 0 4.5 -6.5 8.5 -4.5 1.5 -10 -3 -3 -3Z" fill="#ffc857"/>
      </g>` : "";
    const ringHalo = helmet === "helm_ring" ? `
      <ellipse cx="100" cy="76" rx="62" ry="16" fill="none" stroke="#ffc857" stroke-width="3" opacity=".85" transform="rotate(-16 100 76)"/>
      <ellipse cx="100" cy="76" rx="62" ry="16" fill="none" stroke="#fff6d0" stroke-width="1.2" opacity=".6" transform="rotate(-16 100 76)"/>` : "";
    const surveyDome = helmet === "helm_dome" ? `
      <circle cx="100" cy="76" r="52" fill="none" stroke="${c.trim}" stroke-width="2" opacity=".7"/>
      <path d="M100 24v104M48 76h104" stroke="${c.trim}" stroke-width="1.2" opacity=".35"/>` : "";
    const reactorCowl = helmet === "helm_reactor" ? `
      <path d="M62 40h76l-8-16H70Z" fill="#8b98b8"/>
      <rect x="86" y="14" width="28" height="12" rx="4" fill="#5ff0b6" opacity=".9"/>
      <path d="M70 30c-8-6-14-14-16-22M130 30c8-6 14-14 16-22" stroke="#5ff0b6" stroke-width="3" fill="none" opacity=".6" stroke-linecap="round"/>` : "";
    const crystalShell = helmet === "helm_crystal" ? `
      <path d="M100 22 148 60 132 122 68 122 52 60Z" fill="#a99bff" opacity=".22" stroke="#a99bff" stroke-width="2"/>
      <path d="M100 22v100M52 60h96" stroke="#a99bff" stroke-width="1.2" opacity=".5"/>` : "";
    const commanderCrown = helmet === "helm_crown" ? `
      <path d="M62 34 74 14 88 30 100 8 112 30 126 14 138 34Z" fill="#ffc857"/>
      <circle cx="100" cy="20" r="4" fill="#ff7d7d"/><circle cx="74" cy="22" r="3" fill="#4fe3ff"/><circle cx="126" cy="22" r="3" fill="#4fe3ff"/>` : "";
    const eventHorizon = helmet === "helm_blackhole" ? `
      <circle cx="100" cy="76" r="50" fill="#05070f" opacity=".55"/>
      <ellipse cx="100" cy="76" rx="66" ry="18" fill="none" stroke="#a99bff" stroke-width="3" opacity=".9" transform="rotate(-14 100 76)"/>
      <ellipse cx="100" cy="76" rx="66" ry="18" fill="none" stroke="#fff6d0" stroke-width="1.2" opacity=".5" transform="rotate(-14 100 76)"/>` : "";

    /* ---- hats ---- */
    let hatMark = "";
    if (hatId === "hat_cap") hatMark = `<path d="M62 40h76v14H62Z" fill="#2b3f66"/><path d="M138 40h26v9h-26Z" fill="#1b2745"/><circle cx="100" cy="34" r="5" fill="#4fe3ff"/>`;
    else if (hatId === "hat_beanie") hatMark = `<path d="M64 44a36 36 0 0 1 72 0Z" fill="#ff7d7d"/><rect x="60" y="40" width="80" height="14" rx="7" fill="#ffd9a8"/><circle cx="100" cy="14" r="7" fill="#ffd9a8"/>`;
    else if (hatId === "hat_headset") hatMark = `<path d="M60 46a40 40 0 0 1 80 0" fill="none" stroke="#4fe3ff" stroke-width="6"/><rect x="46" y="40" width="18" height="28" rx="8" fill="#4fe3ff"/><rect x="136" y="40" width="18" height="28" rx="8" fill="#4fe3ff"/><path d="M145 68c0 16-14 22-28 22" stroke="#4fe3ff" stroke-width="4" fill="none"/><circle cx="117" cy="90" r="5" fill="#4fe3ff"/>`;
    else if (hatId === "hat_tophat") hatMark = `<rect x="70" y="0" width="60" height="42" rx="4" fill="#0f1a33"/><rect x="52" y="38" width="96" height="12" rx="6" fill="#0f1a33"/><rect x="70" y="28" width="60" height="9" fill="#ffc857"/>`;
    else if (hatId === "hat_antennae") hatMark = `<path d="M84 40 70 8M116 40 130 8" stroke="#5ff0b6" stroke-width="4" stroke-linecap="round"/><circle cx="70" cy="6" r="7" fill="#5ff0b6"/><circle cx="130" cy="6" r="7" fill="#5ff0b6"/><circle cx="70" cy="6" r="3" fill="#fff"/><circle cx="130" cy="6" r="3" fill="#fff"/>`;
    else if (hatId === "hat_mohawk") hatMark = `<path d="M100 -6 112 34 100 28 88 34Z" fill="#ff5f8f"/><path d="M100 4 108 34 100 30 92 34Z" fill="#ffc857"/>`;
    else if (hatId === "hat_wizard") hatMark = `<path d="M100 -14 142 40H58Z" fill="#3b2a6b"/><path d="M100 -14 122 40H78Z" fill="#a99bff" opacity=".55"/><circle cx="100" cy="-8" r="6" fill="#ffc857"/><path d="M74 30h52" stroke="#ffc857" stroke-width="3"/>`;
    else if (hatId === "hat_halo") hatMark = `<ellipse cx="100" cy="6" rx="40" ry="11" fill="none" stroke="#ffc857" stroke-width="6"/><ellipse cx="100" cy="6" rx="40" ry="11" fill="none" stroke="#fff6d0" stroke-width="2"/>`;
    else if (hatId === "hat_dragon") hatMark = `<path d="M62 40c0-24 17-38 38-38s38 14 38 38Z" fill="#5ff0b6"/><path d="M68 24 54 6l18 4ZM132 24 146 6l-18 4Z" fill="#0d4a37"/><circle cx="86" cy="30" r="5" fill="#0f1a33"/><circle cx="114" cy="30" r="5" fill="#0f1a33"/><path d="M92 40c5 4 11 4 16 0" stroke="#0d4a37" stroke-width="3" fill="none" stroke-linecap="round"/>`;

    /* ---- backpack ---- */
    let packMark = "";
    if (packId === "pack_std") packMark = `<rect x="47" y="120" width="7" height="26" rx="3" fill="${c.trim}" opacity=".55"/><rect x="146" y="120" width="7" height="26" rx="3" fill="${c.trim}" opacity=".55"/>`;
    else if (packId === "pack_slim") packMark = `<rect x="44" y="116" width="20" height="58" rx="9" fill="${bodyDark}"/><rect x="136" y="116" width="20" height="58" rx="9" fill="${bodyDark}"/>`;
    else if (packId === "pack_twin") packMark = `<path d="M55 176v18M145 176v18" stroke="#ff7d7d" stroke-width="7" stroke-linecap="round"/><path d="M55 194c0 8 3 12 6 16M145 194c0 8-3 12-6 16" stroke="#ffb347" stroke-width="5" fill="none" stroke-linecap="round"/>`;
    else if (packId === "pack_solar") packMark = `<rect x="40" y="112" width="30" height="34" rx="3" fill="#4fe3ff" opacity=".9"/><rect x="130" y="112" width="30" height="34" rx="3" fill="#4fe3ff" opacity=".9"/><path d="M40 124h30M40 136h30M55 112v34M130 124h30M130 136h30M145 112v34" stroke="#0c1934" stroke-width="1.4"/>`;
    else if (packId === "pack_cargo") packMark = `<rect x="38" y="110" width="34" height="40" rx="5" fill="#c9a06a"/><rect x="128" y="110" width="34" height="40" rx="5" fill="#c9a06a"/><path d="M38 126h34M55 110v40M128 126h34M145 110v40" stroke="#7a5a34" stroke-width="2"/>`;
    else if (packId === "pack_jet") packMark = `<rect x="44" y="112" width="22" height="52" rx="9" fill="#8b98b8"/><rect x="134" y="112" width="22" height="52" rx="9" fill="#8b98b8"/><path d="M55 164c0 14 3 22 0 30-3-8 0-16 0-30ZM145 164c0 14-3 22 0 30 3-8 0-16 0-30Z" fill="#ffb347"/>`;
    else if (packId === "pack_reactor") packMark = `<circle cx="55" cy="140" r="17" fill="#0f1a33" stroke="#5ff0b6" stroke-width="3"/><circle cx="55" cy="140" r="7" fill="#5ff0b6"/><circle cx="145" cy="140" r="17" fill="#0f1a33" stroke="#5ff0b6" stroke-width="3"/><circle cx="145" cy="140" r="7" fill="#5ff0b6"/>`;
    else if (packId === "pack_wings") packMark = `<path d="M44 118 4 96v34l40 20Z" fill="#4fe3ff" opacity=".8"/><path d="M156 118 196 96v34l-40 20Z" fill="#4fe3ff" opacity=".8"/><path d="M44 118 4 96M156 118 196 96" stroke="#7fd8ff" stroke-width="2"/>`;
    else if (packId === "pack_blackhole") packMark = `<circle cx="55" cy="140" r="18" fill="#05070f"/><ellipse cx="55" cy="140" rx="26" ry="8" fill="none" stroke="#a99bff" stroke-width="3"/><circle cx="145" cy="140" r="18" fill="#05070f"/><ellipse cx="145" cy="140" rx="26" ry="8" fill="none" stroke="#a99bff" stroke-width="3"/>`;

    /* ---- boots ---- */
    let bootMark = "";
    if (bootId === "boot_red") bootMark = `<rect x="62" y="228" width="38" height="9" rx="4.5" fill="#ff7d7d"/><rect x="100" y="228" width="38" height="9" rx="4.5" fill="#ff7d7d"/>`;
    else if (bootId === "boot_steel") bootMark = `<rect x="58" y="234" width="46" height="12" rx="4" fill="#c9d3e8"/><rect x="96" y="234" width="46" height="12" rx="4" fill="#c9d3e8"/>`;
    else if (bootId === "boot_spring") bootMark = `<path d="M70 244c0 8 4 12 8 12M130 244c0 8-4 12-8 12" stroke="#ffc857" stroke-width="5" fill="none" stroke-linecap="round"/>`;
    else if (bootId === "boot_ice") bootMark = `<path d="M62 246h38M100 246h38" stroke="#7fd8ff" stroke-width="4"/><path d="M72 246v8M90 246v8M110 246v8M128 246v8" stroke="#7fd8ff" stroke-width="3"/>`;
    else if (bootId === "boot_rocket") bootMark = `<path d="M74 244c0 12 4 18 8 24 4-6 8-12 8-24ZM112 244c0 12 4 18 8 24 4-6 8-12 8-24Z" fill="#ffb347"/>`;
    else if (bootId === "boot_plasma") bootMark = `<rect x="62" y="230" width="38" height="7" fill="#ff5f8f"/><rect x="100" y="230" width="38" height="7" fill="#ff5f8f"/><rect x="62" y="240" width="38" height="7" fill="#ff5f8f"/><rect x="100" y="240" width="38" height="7" fill="#ff5f8f"/>`;
    else if (bootId === "boot_gravity") bootMark = `<circle cx="81" cy="238" r="9" fill="none" stroke="#a99bff" stroke-width="3"/><circle cx="81" cy="238" r="3" fill="#a99bff"/><circle cx="119" cy="238" r="9" fill="none" stroke="#a99bff" stroke-width="3"/><circle cx="119" cy="238" r="3" fill="#a99bff"/>`;

    /* ---- gloves ---- */
    let gloveMark = "";
    if (gloveId === "glove_blue") gloveMark = `<circle cx="48" cy="182" r="10" fill="#4fe3ff"/><circle cx="152" cy="182" r="10" fill="#4fe3ff"/>`;
    else if (gloveId === "glove_armor") gloveMark = `<circle cx="48" cy="182" r="11" fill="#c9d3e8"/><circle cx="152" cy="182" r="11" fill="#c9d3e8"/><path d="M42 178h12M146 178h12" stroke="#6c7793" stroke-width="2"/>`;
    else if (gloveId === "glove_heater") gloveMark = `<circle cx="48" cy="182" r="10" fill="#ff7d7d"/><circle cx="152" cy="182" r="10" fill="#ff7d7d"/><path d="M48 176c3 4 3 7 0 10-3-3-3-6 0-10ZM152 176c3 4 3 7 0 10-3-3-3-6 0-10Z" fill="#fff6d0"/>`;
    else if (gloveId === "glove_tool") gloveMark = `<circle cx="48" cy="182" r="10" fill="#ffc857"/><circle cx="152" cy="182" r="10" fill="#ffc857"/><circle cx="48" cy="182" r="4" fill="#0f1a33"/><circle cx="152" cy="182" r="4" fill="#0f1a33"/>`;
    else if (gloveId === "glove_plasma") gloveMark = `<circle cx="48" cy="182" r="11" fill="#4fe3ff" opacity=".85"/><circle cx="152" cy="182" r="11" fill="#4fe3ff" opacity=".85"/><path d="M42 176 50 182 44 186 52 192M146 176 154 182 148 186 156 192" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round"/>`;
    else if (gloveId === "glove_gauntlet") gloveMark = `<circle cx="48" cy="182" r="12" fill="#c9a06a"/><circle cx="152" cy="182" r="12" fill="#c9a06a"/><circle cx="44" cy="178" r="3" fill="#ffc857"/><circle cx="52" cy="178" r="3" fill="#4fe3ff"/><circle cx="44" cy="186" r="3" fill="#ff7d7d"/><circle cx="52" cy="186" r="3" fill="#a99bff"/><circle cx="148" cy="178" r="3" fill="#ffc857"/><circle cx="156" cy="178" r="3" fill="#4fe3ff"/><circle cx="148" cy="186" r="3" fill="#ff7d7d"/><circle cx="156" cy="186" r="3" fill="#a99bff"/>`;
    else if (gloveId === "glove_star") gloveMark = `<circle cx="48" cy="182" r="11" fill="#ffc857"/><circle cx="152" cy="182" r="11" fill="#ffc857"/><path d="M48 175 50 180 55 180 51 183 53 188 48 185 43 188 45 183 41 180 46 180ZM152 175 154 180 159 180 155 183 157 188 152 185 147 188 149 183 145 180 150 180Z" fill="#fff6d0"/>`;

    /* ---- cape ---- */
    let capeMark = "";
    if (capeId === "cape_short") capeMark = `<path d="M62 118h76l-10 62H72Z" fill="#ff7d7d" opacity=".9"/>`;
    else if (capeId === "cape_hero") capeMark = `<path d="M60 116h80l-8 88-32-16-32 16Z" fill="#4fe3ff" opacity=".9"/>`;
    else if (capeId === "cape_thermal") capeMark = `<path d="M60 116h80l-8 88-32-16-32 16Z" fill="#e8eeff" opacity=".92"/><path d="M70 130h60M74 152h52M78 174h44" stroke="#9dabc8" stroke-width="2.4"/>`;
    else if (capeId === "cape_aurora") capeMark = `<path d="M60 116h80l-8 88-32-16-32 16Z" fill="#5ff0b6" opacity=".9"/><path d="M80 118h40l-4 78-16-8-16 8Z" fill="#a99bff" opacity=".7"/>`;
    else if (capeId === "cape_void") capeMark = `<path d="M60 116h80l-8 88-32-16-32 16Z" fill="#05070f"/><path d="M60 116h80l-8 88-32-16-32 16Z" fill="none" stroke="#a99bff" stroke-width="2.4"/>`;
    else if (capeId === "cape_comet") capeMark = `<path d="M60 116h80l-8 88-32-16-32 16Z" fill="#7fd8ff" opacity=".9"/><path d="M88 122h24l-4 70-8-4-8 4Z" fill="#fff6d0" opacity=".85"/>`;

    /* ---- pet ---- */
    let petMark = "";
    if (petId === "pet_orb") petMark = `<circle cx="176" cy="196" r="17" fill="#4fe3ff" opacity=".9"/><circle cx="170" cy="192" r="3.4" fill="#0c1934"/><circle cx="182" cy="192" r="3.4" fill="#0c1934"/><path d="M169 203c4 3 10 3 14 0" stroke="#0c1934" stroke-width="2.2" fill="none" stroke-linecap="round"/>`;
    else if (petId === "pet_star") petMark = `<path d="M176 176 182 192 199 192 185 202 190 219 176 209 162 219 167 202 153 192 170 192Z" fill="#ffc857"/><circle cx="170" cy="196" r="2.6" fill="#0f1a33"/><circle cx="182" cy="196" r="2.6" fill="#0f1a33"/>`;
    else if (petId === "pet_moon") petMark = `<path d="M176 178c-12 0-21 10-21 22s9 22 21 22c-7-5-11-13-11-22s4-17 11-22Z" fill="#e8eeff"/><path d="M186 184c-8 3-13 10-13 16s5 13 13 16c-5-5-8-11-8-16s3-11 8-16Z" fill="#c3cbe6"/>`;
    else if (petId === "pet_rover") petMark = `<rect x="156" y="188" width="40" height="18" rx="4" fill="#c9d3e8"/><circle cx="163" cy="210" r="6" fill="#6c7793"/><circle cx="176" cy="210" r="6" fill="#6c7793"/><circle cx="189" cy="210" r="6" fill="#6c7793"/><rect x="166" y="180" width="20" height="9" rx="3" fill="#4fe3ff"/>`;
    else if (petId === "pet_fox") petMark = `<path d="M160 186 156 170l12 7ZM192 186 196 170l-12 7Z" fill="#ff9d5c"/><circle cx="176" cy="200" r="18" fill="#ff9d5c"/><circle cx="169" cy="196" r="3.4" fill="#0f1a33"/><circle cx="183" cy="196" r="3.4" fill="#0f1a33"/><path d="M176 205l-4 4h8Z" fill="#0f1a33"/>`;
    else if (petId === "pet_alien") petMark = `<ellipse cx="176" cy="198" rx="20" ry="17" fill="#5ff0b6"/><ellipse cx="169" cy="194" rx="5" ry="7" fill="#0f1a33"/><ellipse cx="183" cy="194" rx="5" ry="7" fill="#0f1a33"/><path d="M168 208c5 3 11 3 16 0" stroke="#0d4a37" stroke-width="2.2" fill="none"/><path d="M156 200 144 194M196 200 208 194" stroke="#5ff0b6" stroke-width="3.4" stroke-linecap="round"/>`;
    else if (petId === "pet_dragon") petMark = `<circle cx="176" cy="198" r="19" fill="#a99bff"/><path d="M162 184 154 172l11 4ZM190 184 198 172l-11 4Z" fill="#6b3fd0"/><circle cx="169" cy="195" r="3.4" fill="#0f1a33"/><circle cx="183" cy="195" r="3.4" fill="#0f1a33"/><path d="M169 207c4 4 10 4 14 0" stroke="#0f1a33" stroke-width="2.2" fill="none"/>`;
    else if (petId === "pet_phoenix") petMark = `<path d="M176 176c-7 9-17 12-26 10 7 7 16 10 26 10s19-3 26-10c-9 2-19-1-26-10Z" fill="#ffb347"/><path d="M176 188c-5 7-12 10-19 10 5 5 12 8 19 8s14-3 19-8c-7 0-14-3-19-10Z" fill="#ff5f8f"/><circle cx="176" cy="204" r="7" fill="#fff6d0"/>`;

    /* ---- trail ---- */
    let trailMark = "";
    if (trailId === "trail_dust") trailMark = `<circle cx="30" cy="212" r="9" fill="#9dabc8" opacity=".6"/><circle cx="16" cy="196" r="6" fill="#9dabc8" opacity=".4"/><circle cx="6" cy="180" r="4" fill="#9dabc8" opacity=".28"/>`;
    else if (trailId === "trail_spark") trailMark = `<circle cx="30" cy="214" r="6" fill="#ffb347"/><circle cx="16" cy="198" r="4.4" fill="#ffc857"/><circle cx="6" cy="182" r="3" fill="#fff6d0"/><path d="M22 226 12 236M8 210 0 218" stroke="#ffb347" stroke-width="2.6" stroke-linecap="round"/>`;
    else if (trailId === "trail_bubble") trailMark = `<circle cx="30" cy="212" r="11" fill="none" stroke="#7fd8ff" stroke-width="2.6"/><circle cx="14" cy="194" r="7" fill="none" stroke="#7fd8ff" stroke-width="2.2"/><circle cx="4" cy="178" r="4.6" fill="none" stroke="#7fd8ff" stroke-width="1.8"/>`;
    else if (trailId === "trail_star") trailMark = `<path d="M30 202 33 212 43 212 35 218 38 228 30 222 22 228 25 218 17 212 27 212Z" fill="#ffc857"/><path d="M12 184 14 191 21 191 15 195 17 202 12 198 7 202 9 195 3 191 10 191Z" fill="#fff6d0"/>`;
    else if (trailId === "trail_flame") trailMark = `<path d="M6 232c0-18 10-28 20-38 3 13 10 18 10 28 0 10-8 18-15 18s-15-3-15-8Z" fill="#ffb347"/><path d="M14 232c0-10 6-16 12-22 2 8 6 11 6 17 0 6-5 10-9 10s-9-1-9-5Z" fill="#fff6d0"/>`;
    else if (trailId === "trail_rainbow") trailMark = `<path d="M0 226c14-22 34-34 58-34" stroke="#ff7d7d" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M0 238c14-22 34-34 58-34" stroke="#ffc857" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M0 250c14-22 34-34 58-34" stroke="#5ff0b6" stroke-width="6" fill="none" stroke-linecap="round"/>`;
    else if (trailId === "trail_aurora") trailMark = `<path d="M0 234c18-26 40-38 66-38" stroke="#5ff0b6" stroke-width="9" fill="none" stroke-linecap="round" opacity=".85"/><path d="M0 250c18-26 40-38 66-38" stroke="#a99bff" stroke-width="9" fill="none" stroke-linecap="round" opacity=".7"/>`;
    else if (trailId === "trail_void") trailMark = `<ellipse cx="26" cy="212" rx="26" ry="11" fill="none" stroke="#a99bff" stroke-width="3.4" transform="rotate(-24 26 212)"/><ellipse cx="8" cy="186" rx="15" ry="6" fill="none" stroke="#a99bff" stroke-width="2.6" transform="rotate(-24 8 186)"/>`;

    let badgeMark = "";
    if (badge === "badge_rocket") {
      badgeMark = `<g transform="translate(0 -1.5)">
        <path d="M0 -7c3.4 2.6 4.6 6 4.6 9.4V6h-9.2v-3.6C-4.6 -1 -3.4 -4.4 0 -7Z" fill="#ff7d7d"/>
        <path d="M-4.6 6 -7 11 -4.6 9.6ZM4.6 6 7 11 4.6 9.6Z" fill="#ffc857"/>
      </g>`;
    } else if (badge === "badge_planet") {
      badgeMark = `<g transform="translate(0 -1)">
        <circle cx="0" cy="0" r="5.4" fill="#ffc857"/>
        <ellipse cx="0" cy="0" rx="9" ry="3" fill="none" stroke="#ff7d7d" stroke-width="1.8" transform="rotate(-18)"/>
      </g>`;
    } else if (badge === "badge_comet") {
      badgeMark = `<g transform="translate(0 -1)">
        <circle cx="2" cy="-1" r="3.4" fill="#ffc857"/>
        <path d="M-1 1 -8 6M0 -3 -7 -1M-1 -4 -7 -7" stroke="#4fe3ff" stroke-width="1.8" stroke-linecap="round"/>
      </g>`;
    } else if (badge === "badge_wings") {
      badgeMark = `<g transform="translate(0 -1)">
        <path d="M0 -6h2v12h-2Z" fill="#ffc857"/>
        <path d="M0 -5 -9 -8v5l9 3Z" fill="#ffc857"/><path d="M2 -5 11 -8v5l-9 3Z" fill="#ffc857"/>
        <circle cx="1" cy="-7" r="2.4" fill="#ff7d7d"/>
      </g>`;
    } else if (badge === "badge_shield") {
      badgeMark = `<g transform="translate(0 -1)">
        <path d="M0 -8 8 -5v6c0 5-4 8-8 10-4-2-8-5-8-10v-6Z" fill="#4fe3ff" opacity=".9"/>
        <path d="M0 -5v11" stroke="#0c1934" stroke-width="1.4"/>
      </g>`;
    } else if (badge === "badge_flame") {
      badgeMark = `<g transform="translate(0 -1)">
        <path d="M0 -8c3 4 6 6 6 10a6 6 0 0 1-12 0c0-4 3-6 6-10Z" fill="#ffb347"/>
        <path d="M0 -3c1.6 2 3 3 3 5a3 3 0 0 1-6 0c0-2 1.4-3 3-5Z" fill="#fff6d0"/>
      </g>`;
    } else if (badge === "badge_eye") {
      badgeMark = `<g transform="translate(0 -1)">
        <ellipse cx="0" cy="0" rx="9" ry="5.6" fill="#0f1a33"/>
        <circle cx="0" cy="0" r="3.4" fill="#4fe3ff"/><circle cx="0" cy="0" r="1.4" fill="#fff"/>
        <path d="M-9 0 -13 -4M9 0 13 -4" stroke="#a99bff" stroke-width="1.6" stroke-linecap="round"/>
      </g>`;
    } else if (badge === "badge_laurel") {
      badgeMark = `<g transform="translate(0 -1)">
        <path d="M0 5c-5 0-9-3-10-7 4 0 7 2 9 5" fill="#5ff0b6"/>
        <path d="M0 5c5 0 9-3 10-7-4 0-7 2-9 5" fill="#5ff0b6"/>
        <circle cx="0" cy="-4" r="3.6" fill="#ffc857"/>
      </g>`;
    } else if (badge === "badge_galaxy") {
      badgeMark = `<g transform="translate(0 -1)">
        <ellipse cx="0" cy="0" rx="10" ry="4.4" fill="none" stroke="#a99bff" stroke-width="1.8" transform="rotate(-22)"/>
        <circle cx="0" cy="0" r="3" fill="#fff6d0"/>
        <circle cx="-8" cy="-3" r="1.2" fill="#4fe3ff"/><circle cx="8" cy="3" r="1.2" fill="#ffc857"/>
      </g>`;
    }

    const svgOut = `
<svg viewBox="0 0 200 260" width="100%" role="img" aria-label="${o.label || "A cadet astronaut"}">
  <defs>
    <linearGradient id="bd-s" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${shadeColor(c.body, .16)}"/>
      <stop offset="55%" stop-color="${c.body}"/>
      <stop offset="100%" stop-color="${bodyDark}"/>
    </linearGradient>
    <linearGradient id="bd-visor" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${shadeColor(visorFill, .35)}" stop-opacity="${visorOpacity}"/>
      <stop offset="52%" stop-color="${visorFill}" stop-opacity="${visorOpacity}"/>
      <stop offset="100%" stop-color="${shadeColor(visorFill, -.45)}" stop-opacity="${visorOpacity}"/>
    </linearGradient>
    <linearGradient id="bd-glass" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#fff" stop-opacity=".55"/>
      <stop offset="60%" stop-color="#fff" stop-opacity=".06"/>
      <stop offset="100%" stop-color="#fff" stop-opacity="0"/>
    </linearGradient>
    <radialGradient id="bd-glow" cx="50%" cy="50%" r="50%">
      <stop offset="55%" stop-color="${c.accent}" stop-opacity=".22"/>
      <stop offset="100%" stop-color="${c.accent}" stop-opacity="0"/>
    </radialGradient>
    <filter id="bd-sh" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="8" stdDeviation="7" flood-color="#000" flood-opacity=".45"/>
    </filter>
  </defs>

  <ellipse cx="100" cy="128" rx="96" ry="120" fill="url(#bd-glow)"/>
  ${trailMark}

  <g filter="url(#bd-sh)">
    <!-- cape (behind everything) -->
    ${capeMark}

    <!-- backpack -->
    <rect x="42" y="112" width="26" height="62" rx="12" fill="${bodyDark}"/>
    <rect x="132" y="112" width="26" height="62" rx="12" fill="${bodyDark}"/>
    ${packMark}

    <!-- legs -->
    <rect x="70" y="196" width="24" height="40" rx="11" fill="url(#bd-s)"/>
    <rect x="106" y="196" width="24" height="40" rx="11" fill="url(#bd-s)"/>
    <rect x="66" y="228" width="32" height="15" rx="7" fill="${bodyDark}"/>
    <rect x="102" y="228" width="32" height="15" rx="7" fill="${bodyDark}"/>
    <rect x="62" y="236" width="38" height="9" rx="4.5" fill="${c.trim}"/>
    <rect x="100" y="236" width="38" height="9" rx="4.5" fill="${c.trim}"/>
    ${bootMark}

    <!-- arms -->
    <rect x="44" y="130" width="21" height="52" rx="10.5" fill="url(#bd-s)" transform="rotate(9 54 156)"/>
    <rect x="135" y="130" width="21" height="52" rx="10.5" fill="url(#bd-s)" transform="rotate(-9 146 156)"/>
    <circle cx="48" cy="182" r="10" fill="${bodyMid}"/>
    <circle cx="152" cy="182" r="10" fill="${bodyMid}"/>
    ${gloveMark}

    <!-- torso -->
    <path d="M76 116h48c9 0 16 7 16 16v46c0 9-7 16-16 16H76c-9 0-16-7-16-16v-46c0-9 7-16 16-16Z" fill="url(#bd-s)"/>
    <path d="M62 128c0-7 6-12 14-12h8v82h-8c-8 0-14-6-14-13Z" fill="#fff" opacity=".07"/>
    <rect x="60" y="168" width="80" height="9" fill="${c.trim}" opacity=".85"/>
    <rect x="62" y="176" width="76" height="4" fill="${bodyDark}" opacity=".5"/>

    <!-- badge -->
    <g transform="translate(100 132)">
      <circle cx="0" cy="0" r="13" fill="${bodyDark}" opacity=".55"/>
      <circle cx="0" cy="0" r="10.5" fill="${c.accent}" opacity=".22"/>
      <circle cx="0" cy="0" r="10.5" fill="none" stroke="${c.trim}" stroke-width="1.6" opacity=".9"/>
      ${badgeMark}
    </g>

    <!-- helmet -->
    <circle cx="100" cy="76" r="46" fill="${shadeColor(c.body, .06)}"/>
    <circle cx="100" cy="76" r="46" fill="none" stroke="${c.trim}" stroke-width="3"/>
    <circle cx="100" cy="76" r="40" fill="url(#bd-visor)"/>
    <circle cx="100" cy="76" r="40" fill="none" stroke="${bodyDark}" stroke-width="1.2" opacity=".5"/>
    <ellipse cx="84" cy="60" rx="16" ry="11" fill="url(#bd-glass)" transform="rotate(-24 84 60)"/>
    <ellipse cx="112" cy="92" rx="8" ry="5" fill="#fff" opacity=".14" transform="rotate(-24 112 92)"/>
    <!-- customizable character skin and face -->
    <ellipse cx="100" cy="80" rx="23" ry="25" fill="${face.face}" stroke="${face.shadow}" stroke-width="1.5"/>
    <ellipse cx="89" cy="64" rx="8" ry="4" fill="${face.accent}" opacity=".28"/>
    ${hairMark}
    <g fill="${face.eyes}">
      ${eyeItem.style === "bright" ? `<ellipse cx="89" cy="75" rx="4.2" ry="5.3"/><ellipse cx="111" cy="75" rx="4.2" ry="5.3"/>` : eyeItem.style === "sleepy" ? `<path d="M84 76q5-5 10 0v2q-5 3-10 0ZM106 76q5-5 10 0v2q-5 3-10 0Z"/>` : eyeItem.style === "confident" ? `<path d="M85 76q4-6 9 0v4q-5 2-9-1ZM107 76q4-6 9 0v4q-5 2-9-1Z"/>` : `<ellipse cx="89" cy="75" rx="3.1" ry="4"/><ellipse cx="111" cy="75" rx="3.1" ry="4"/>`}
    </g>
    <g fill="#fff" opacity=".85"><circle cx="90" cy="74" r="${eyeItem.style === "bright" ? 1.5 : 1.1}"/><circle cx="112" cy="74" r="${eyeItem.style === "bright" ? 1.5 : 1.1}"/></g>
    ${eyeItem.style === "star" ? `<path d="M89 69l1.5 3 3 .5-2.2 2 .5 3-2.8-1.5-2.8 1.5.5-3-2.2-2 3-.5Z" fill="#ffc857"/><path d="M111 69l1.5 3 3 .5-2.2 2 .5 3-2.8-1.5-2.8 1.5.5-3-2.2-2 3-.5Z" fill="#ffc857"/>` : ""}
    ${expressionMark}
    ${beardMark}${mustacheMark}${glassesMark}
    <circle cx="82" cy="84" r="3" fill="${face.accent}" opacity=".45"/><circle cx="118" cy="84" r="3" fill="${face.accent}" opacity=".45"/>
    ${antenna}${crest}${ringHalo}${surveyDome}${reactorCowl}${crystalShell}${commanderCrown}${eventHorizon}
    ${hatMark}

    <!-- helmet collar -->
    <rect x="70" y="112" width="60" height="10" rx="5" fill="${bodyDark}"/>
    <rect x="70" y="112" width="60" height="4" rx="2" fill="${c.trim}" opacity=".8"/>
  </g>
  ${petMark}
</svg>`;
    return svgOut.split("bd-").join(u + "-");
  }

  function shadeColor(hex, amt) {
    const h = hex.replace("#", "");
    const n = parseInt(h.length === 3 ? h.split("").map(x => x + x).join("") : h, 16);
    let r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
    if (amt >= 0) {
      r = Math.round(r + (255 - r) * amt); g = Math.round(g + (255 - g) * amt); b = Math.round(b + (255 - b) * amt);
    } else {
      r = Math.round(r * (1 + amt)); g = Math.round(g * (1 + amt)); b = Math.round(b * (1 + amt));
    }
    return "#" + [r, g, b].map(v => Math.max(0, Math.min(255, v)).toString(16).padStart(2, "0")).join("");
  }

  /* ---- small shop thumbnails ---- */
  function thumb(kind, item, equip) {
    if (kind === "skin") {
      const f = item.colors;
      return `<svg viewBox="0 0 100 100" role="img" aria-label="${item.name}">
        <circle cx="50" cy="51" r="39" fill="#172748" stroke="#4fe3ff" stroke-width="2"/>
        <path d="M17 49a33 33 0 0 1 66 0" fill="none" stroke="#a99bff" stroke-width="3" opacity=".8"/>
        <ellipse cx="50" cy="54" rx="25" ry="29" fill="${f.face}" stroke="${f.shadow}" stroke-width="2"/>
        ${item.features?.hair ? `<path d="M26 47q-2-22 21-22 22-2 27 22-13-10-25-5-11-4-23 5Z" fill="${item.features.hair.includes("silver") || item.features.hair.includes("white") ? "#e7edf5" : item.features.hair === "dark_curls" ? "#30251f" : "#65402c"}"/>` : ""}
        <ellipse cx="40" cy="49" rx="3" ry="4" fill="${f.eyes}"/><ellipse cx="60" cy="49" rx="3" ry="4" fill="${f.eyes}"/>
        ${item.features?.glasses ? `<g fill="none" stroke="#25344d" stroke-width="2"><circle cx="40" cy="49" r="8"/><circle cx="60" cy="49" r="8"/><path d="M48 49h4"/></g>` : ""}
        ${item.features?.beard ? `<path d="M27 64q23 18 46 0l-5 18H32Z" fill="${item.features.beard}"/>` : ""}
        ${item.features?.mustache ? `<path d="M49 63q-8-7-15 0 7 8 15 2 7 6 15-2-7-7-15 0Z" fill="${item.features.mustache}"/>` : ""}
        <path d="M43 65q7 6 14 0" fill="none" stroke="${f.shadow}" stroke-width="2.5" stroke-linecap="round"/>
        <path d="M19 36q31-27 62 0" fill="none" stroke="#4fe3ff" stroke-width="3"/>
      </svg>`;
    }
    if (kind === "suit") {
      const c = item.colors;
      return `<svg viewBox="0 0 100 100" role="img" aria-label="${item.name}">
        <defs><linearGradient id="th-${item.id}" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${shadeColor(c.body, .18)}"/><stop offset="100%" stop-color="${shadeColor(c.body, -.3)}"/>
        </linearGradient></defs>
        <rect x="30" y="46" width="40" height="40" rx="12" fill="url(#th-${item.id})" stroke="${c.trim}" stroke-width="2"/>
        <rect x="43" y="44" width="14" height="44" fill="${c.trim}" opacity=".7"/>
        <circle cx="50" cy="30" r="19" fill="${shadeColor(c.body, .05)}" stroke="${c.trim}" stroke-width="2.4"/>
        <circle cx="50" cy="30" r="14" fill="${c.visor}" opacity=".92"/>
        <ellipse cx="44" cy="24" rx="6" ry="4" fill="#fff" opacity=".35" transform="rotate(-25 44 24)"/>
      </svg>`;
    }
    if (kind === "helmet") {
      const c = equip ? equip.colors : SUITS[0].colors;
      let extra = "";
      if (item.id === "helm_gold") extra = "";
      if (item.id === "helm_horn") extra = `<rect x="48" y="8" width="4" height="14" rx="2" fill="${c.trim}"/><ellipse cx="50" cy="7" rx="12" ry="5" fill="${c.trim}"/>`;
      if (item.id === "helm_star") extra = `<path d="M50 4 53 11 60 11 55 15 57 22 50 18 43 22 45 15 40 11 47 11Z" fill="#ffc857"/>`;
      const vf = item.id === "helm_gold" ? "#ffcf4d" : "#2b3f66";
      return `<svg viewBox="0 0 100 100" role="img" aria-label="${item.name}">
        ${extra}
        <circle cx="50" cy="52" r="32" fill="${shadeColor(c.body, .12)}" stroke="${c.trim}" stroke-width="3"/>
        <circle cx="50" cy="52" r="25" fill="${vf}"/>
        <ellipse cx="41" cy="42" rx="9" ry="6" fill="#fff" opacity=".32" transform="rotate(-25 41 42)"/>
        <ellipse cx="60" cy="66" rx="5" ry="3" fill="#fff" opacity=".13"/>
        <rect x="26" y="80" width="48" height="8" rx="4" fill="${shadeColor(c.body, -.25)}"/>
      </svg>`;
    }
    if (kind === "hair" || kind === "eyes" || kind === "expression") {
      const face = SKINS[0].colors;
      let detail = "";
      if (kind === "hair") {
        const color = item.color || "#65402c";
        detail = item.style === "skin" ? `<path d="M25 47q2-25 25-25t25 25q-13-10-25-5-13-4-25 5Z" fill="#65402c"/>` : item.style === "spiky" ? `<path d="M25 48 22 27 39 38 43 16 53 37 68 18 66 40 80 30 75 50Z" fill="${color}"/>` : item.style === "curly" ? `<g fill="${color}"><circle cx="30" cy="37" r="10"/><circle cx="42" cy="27" r="11"/><circle cx="56" cy="27" r="11"/><circle cx="69" cy="38" r="10"/></g>` : `<path d="M25 49q-8-25 18-29 27-8 34 19l-4 12q-14-17-27-9-10-4-21 7Z" fill="${color}"/>`;
      } else if (kind === "eyes") {
        detail = item.style === "bright" ? `<ellipse cx="40" cy="54" rx="6" ry="8" fill="${face.eyes}"/><ellipse cx="60" cy="54" rx="6" ry="8" fill="${face.eyes}"/>` : item.style === "sleepy" ? `<path d="M32 55q8-8 16 0M52 55q8-8 16 0" stroke="${face.eyes}" stroke-width="4" fill="none" stroke-linecap="round"/>` : item.style === "confident" ? `<path d="M32 54l16 2M52 56l16-2" stroke="${face.eyes}" stroke-width="4" stroke-linecap="round"/>` : `<ellipse cx="40" cy="54" rx="4" ry="6" fill="${face.eyes}"/><ellipse cx="60" cy="54" rx="4" ry="6" fill="${face.eyes}"/>${item.style === "star" ? `<path d="M40 45l2 4 4 1-3 3 1 4-4-2-4 2 1-4-3-3 4-1Z" fill="#ffc857"/>` : ""}`;
      } else {
        detail = item.style === "grin" ? `<path d="M34 68q16 20 32 0v5q-16 14-32 0Z" fill="#8d3545"/>` : item.style === "surprised" ? `<ellipse cx="50" cy="70" rx="5" ry="7" fill="#8d3545"/>` : item.style === "curious" ? `<path d="M42 70q8-7 16-1" stroke="${face.shadow}" stroke-width="3" fill="none"/>` : item.style === "calm" ? `<path d="M42 70h16" stroke="${face.shadow}" stroke-width="3"/>` : `<path d="M40 68q10 8 20 0" stroke="${face.shadow}" stroke-width="3" fill="none"/>`;
      }
      return `<svg viewBox="0 0 100 100" role="img" aria-label="${item.name}"><circle cx="50" cy="52" r="39" fill="#172748" stroke="#4fe3ff" stroke-width="2"/><ellipse cx="50" cy="55" rx="25" ry="29" fill="${face.face}" stroke="${face.shadow}" stroke-width="2"/>${kind === "hair" ? detail : `<ellipse cx="40" cy="54" rx="4" ry="6" fill="${face.eyes}"/><ellipse cx="60" cy="54" rx="4" ry="6" fill="${face.eyes}"/>${detail}`}${kind === "hair" ? "" : `<path d="M40 68q10 8 20 0" stroke="${face.shadow}" stroke-width="2.5" fill="none"/>`}</svg>`;
    }
    const c = equip ? equip.colors : SUITS[0].colors;
    const base = shadeColor(c.body, .1);

    if (kind === "visor") {
      return `<svg viewBox="0 0 100 100" role="img" aria-label="${item.name}">
        <circle cx="50" cy="50" r="34" fill="${shadeColor(c.body, .12)}" stroke="${c.trim}" stroke-width="3"/>
        <path d="M22 46a28 28 0 0 1 56 0v10a28 28 0 0 1-56 0Z" fill="${item.tint}" opacity="${item.alpha}"/>
        <ellipse cx="38" cy="42" rx="9" ry="5" fill="#fff" opacity=".3" transform="rotate(-22 38 42)"/>
        <ellipse cx="62" cy="60" rx="5" ry="3" fill="#fff" opacity=".12"/>
      </svg>`;
    }
    if (kind === "hat") {
      let g = "";
      if (item.id === "hat_cap") g = `<path d="M26 40h48v10H26Z" fill="#2b3f66"/><path d="M74 40h16v6H74Z" fill="#1b2745"/>`;
      else if (item.id === "hat_beanie") g = `<path d="M28 44a22 22 0 0 1 44 0Z" fill="#ff7d7d"/><rect x="26" y="42" width="48" height="9" rx="4" fill="#ffd9a8"/>`;
      else if (item.id === "hat_headset") g = `<path d="M26 46a24 24 0 0 1 48 0" fill="none" stroke="#4fe3ff" stroke-width="4"/><rect x="18" y="42" width="12" height="18" rx="5" fill="#4fe3ff"/><rect x="70" y="42" width="12" height="18" rx="5" fill="#4fe3ff"/><path d="M76 60c0 10-8 14-16 14" stroke="#4fe3ff" stroke-width="3" fill="none"/>`;
      else if (item.id === "hat_tophat") g = `<rect x="30" y="14" width="40" height="30" rx="3" fill="#0f1a33"/><rect x="20" y="42" width="60" height="8" rx="4" fill="#0f1a33"/><rect x="30" y="34" width="40" height="6" fill="#ffc857"/>`;
      else if (item.id === "hat_antennae") g = `<path d="M40 40 32 20M60 40 68 20" stroke="#5ff0b6" stroke-width="3" stroke-linecap="round"/><circle cx="32" cy="18" r="5" fill="#5ff0b6"/><circle cx="68" cy="18" r="5" fill="#5ff0b6"/>`;
      else if (item.id === "hat_mohawk") g = `<path d="M50 8 58 30 50 26 42 30Z" fill="#ff5f8f"/><path d="M50 14 55 30 50 27 45 30Z" fill="#ffc857"/>`;
      else if (item.id === "hat_wizard") g = `<path d="M50 6 74 44H26Z" fill="#3b2a6b"/><path d="M50 6 62 44H38Z" fill="#a99bff" opacity=".6"/><circle cx="50" cy="10" r="4" fill="#ffc857"/>`;
      else if (item.id === "hat_halo") g = `<ellipse cx="50" cy="18" rx="24" ry="7" fill="none" stroke="#ffc857" stroke-width="4"/><ellipse cx="50" cy="18" rx="24" ry="7" fill="none" stroke="#fff6d0" stroke-width="1.6"/>`;
      else if (item.id === "hat_dragon") g = `<path d="M30 40c0-14 10-22 20-22s20 8 20 22Z" fill="#5ff0b6"/><path d="M34 30 26 20l10 2ZM66 30 74 20l-10 2Z" fill="#0d4a37"/><circle cx="42" cy="34" r="3" fill="#0f1a33"/><circle cx="58" cy="34" r="3" fill="#0f1a33"/>`;
      else g = `<circle cx="50" cy="50" r="30" fill="none" stroke="${c.trim}" stroke-width="2" opacity=".4"/>`;
      return `<svg viewBox="0 0 100 100" role="img" aria-label="${item.name}">
        <circle cx="50" cy="58" r="26" fill="${base}" stroke="${c.trim}" stroke-width="2.4"/>
        ${g}
      </svg>`;
    }
    if (kind === "backpack") {
      let g = "";
      if (item.id === "pack_std") g = `<rect x="34" y="30" width="14" height="40" rx="7" fill="#9dabc8"/><rect x="52" y="30" width="14" height="40" rx="7" fill="#9dabc8"/>`;
      else if (item.id === "pack_slim") g = `<rect x="40" y="28" width="20" height="44" rx="8" fill="#9dabc8"/>`;
      else if (item.id === "pack_twin") g = `<rect x="34" y="30" width="14" height="40" rx="7" fill="#9dabc8"/><rect x="52" y="30" width="14" height="40" rx="7" fill="#9dabc8"/><path d="M41 70v10M59 70v10" stroke="#ff7d7d" stroke-width="4" stroke-linecap="round"/>`;
      else if (item.id === "pack_solar") g = `<rect x="30" y="30" width="40" height="30" rx="4" fill="#4fe3ff" opacity=".85"/><path d="M30 40h40M30 50h40M43 30v30M57 30v30" stroke="#0c1934" stroke-width="1.4"/>`;
      else if (item.id === "pack_cargo") g = `<rect x="28" y="28" width="44" height="44" rx="6" fill="#c9a06a"/><path d="M28 44h44M50 28v44" stroke="#7a5a34" stroke-width="2"/>`;
      else if (item.id === "pack_jet") g = `<rect x="36" y="28" width="28" height="40" rx="8" fill="#8b98b8"/><path d="M42 68c0 10 3 16 8 22 5-6 8-12 8-22Z" fill="#ffb347"/>`;
      else if (item.id === "pack_reactor") g = `<circle cx="50" cy="48" r="20" fill="#0f1a33" stroke="#5ff0b6" stroke-width="3"/><circle cx="50" cy="48" r="9" fill="#5ff0b6"/><circle cx="50" cy="48" r="4" fill="#fff"/>`;
      else if (item.id === "pack_wings") g = `<path d="M50 40 14 26v22l36 12Z" fill="#4fe3ff" opacity=".8"/><path d="M50 40 86 26v22L50 60Z" fill="#4fe3ff" opacity=".8"/>`;
      else if (item.id === "pack_blackhole") g = `<circle cx="50" cy="48" r="22" fill="#05070f"/><ellipse cx="50" cy="48" rx="30" ry="9" fill="none" stroke="#a99bff" stroke-width="3"/>`;
      return `<svg viewBox="0 0 100 100" role="img" aria-label="${item.name}">
        <rect x="30" y="24" width="40" height="52" rx="12" fill="${shadeColor(c.body, -.2)}" stroke="${c.trim}" stroke-width="2"/>
        ${g}
      </svg>`;
    }
    if (kind === "boots") {
      let g = "";
      if (item.id === "boot_red") g = `<rect x="24" y="30" width="52" height="14" fill="#ff7d7d"/>`;
      else if (item.id === "boot_steel") g = `<rect x="20" y="52" width="60" height="12" rx="3" fill="#c9d3e8"/>`;
      else if (item.id === "boot_spring") g = `<path d="M30 58c0 8 4 12 8 12M70 58c0 8-4 12-8 12" stroke="#ffc857" stroke-width="4" fill="none"/>`;
      else if (item.id === "boot_ice") g = `<path d="M26 60h48" stroke="#7fd8ff" stroke-width="4"/><path d="M34 60v8M50 60v8M66 60v8" stroke="#7fd8ff" stroke-width="3"/>`;
      else if (item.id === "boot_rocket") g = `<path d="M38 62c0 10 4 16 12 22 8-6 12-12 12-22Z" fill="#ffb347"/>`;
      else if (item.id === "boot_plasma") g = `<rect x="24" y="34" width="52" height="10" fill="#ff5f8f"/><rect x="24" y="50" width="52" height="10" fill="#ff5f8f"/>`;
      else if (item.id === "boot_gravity") g = `<circle cx="50" cy="46" r="14" fill="none" stroke="#a99bff" stroke-width="3"/><circle cx="50" cy="46" r="5" fill="#a99bff"/>`;
      return `<svg viewBox="0 0 100 100" role="img" aria-label="${item.name}">
        <path d="M30 20h16v34h20a8 8 0 0 1 8 8v10H30Z" fill="${base}" stroke="${c.trim}" stroke-width="2.4"/>
        <path d="M30 62h44v10H30Z" fill="${shadeColor(c.body, -.3)}"/>
        ${g}
      </svg>`;
    }
    if (kind === "gloves") {
      let g = "";
      if (item.id === "glove_blue") g = `<rect x="30" y="30" width="40" height="12" fill="#4fe3ff"/>`;
      else if (item.id === "glove_armor") g = `<rect x="28" y="34" width="44" height="10" rx="3" fill="#c9d3e8"/><rect x="28" y="50" width="44" height="10" rx="3" fill="#c9d3e8"/>`;
      else if (item.id === "glove_heater") g = `<path d="M50 30c6 8 6 14 0 20-6-6-6-12 0-20Z" fill="#ff7d7d"/>`;
      else if (item.id === "glove_tool") g = `<circle cx="38" cy="46" r="5" fill="#ffc857"/><circle cx="62" cy="46" r="5" fill="#ffc857"/>`;
      else if (item.id === "glove_plasma") g = `<path d="M34 40 44 48 36 52 48 62" stroke="#4fe3ff" stroke-width="3" fill="none" stroke-linecap="round"/>`;
      else if (item.id === "glove_gauntlet") g = `<circle cx="36" cy="40" r="4" fill="#ffc857"/><circle cx="50" cy="36" r="4" fill="#4fe3ff"/><circle cx="64" cy="40" r="4" fill="#ff7d7d"/><circle cx="40" cy="56" r="4" fill="#a99bff"/><circle cx="60" cy="56" r="4" fill="#5ff0b6"/>`;
      else if (item.id === "glove_star") g = `<path d="M50 34 53 44 63 44 55 50 58 60 50 54 42 60 45 50 37 44 47 44Z" fill="#ffc857"/>`;
      return `<svg viewBox="0 0 100 100" role="img" aria-label="${item.name}">
        <path d="M32 26h36v22a18 18 0 0 1-36 0Z" fill="${base}" stroke="${c.trim}" stroke-width="2.4"/>
        <rect x="32" y="60" width="36" height="16" rx="6" fill="${shadeColor(c.body, -.22)}"/>
        ${g}
      </svg>`;
    }
    if (kind === "cape") {
      let g = "";
      if (item.id === "cape_short") g = `<path d="M30 30h40l-6 34H36Z" fill="#ff7d7d"/>`;
      else if (item.id === "cape_hero") g = `<path d="M30 28h40l-4 46-16-8-16 8Z" fill="#4fe3ff"/>`;
      else if (item.id === "cape_thermal") g = `<path d="M30 28h40l-4 46-16-8-16 8Z" fill="#e8eeff" opacity=".9"/><path d="M36 36h28M38 48h24M40 60h20" stroke="#9dabc8" stroke-width="2"/>`;
      else if (item.id === "cape_aurora") g = `<path d="M30 28h40l-4 46-16-8-16 8Z" fill="#5ff0b6"/><path d="M40 30h20l-2 40-8-4-8 4Z" fill="#a99bff" opacity=".7"/>`;
      else if (item.id === "cape_void") g = `<path d="M30 28h40l-4 46-16-8-16 8Z" fill="#05070f"/><path d="M30 28h40l-4 46-16-8-16 8Z" fill="none" stroke="#a99bff" stroke-width="2"/>`;
      else if (item.id === "cape_comet") g = `<path d="M30 28h40l-4 46-16-8-16 8Z" fill="#7fd8ff"/><path d="M44 34h12l-2 34-4-2-4 2Z" fill="#fff6d0" opacity=".8"/>`;
      else g = `<path d="M34 30h32l-4 40-12-6-12 6Z" fill="${c.trim}" opacity=".35"/>`;
      return `<svg viewBox="0 0 100 100" role="img" aria-label="${item.name}">
        <circle cx="50" cy="24" r="9" fill="${base}" stroke="${c.trim}" stroke-width="2"/>
        ${g}
      </svg>`;
    }
    if (kind === "pet") {
      let g = "";
      if (item.id === "pet_orb") g = `<circle cx="50" cy="50" r="20" fill="#4fe3ff" opacity=".85"/><circle cx="43" cy="45" r="4" fill="#0c1934"/><circle cx="57" cy="45" r="4" fill="#0c1934"/><path d="M42 58c5 4 11 4 16 0" stroke="#0c1934" stroke-width="2.4" fill="none" stroke-linecap="round"/>`;
      else if (item.id === "pet_star") g = `<path d="M50 22 58 44 82 44 62 58 70 82 50 68 30 82 38 58 18 44 42 44Z" fill="#ffc857"/><circle cx="43" cy="48" r="3" fill="#0f1a33"/><circle cx="57" cy="48" r="3" fill="#0f1a33"/>`;
      else if (item.id === "pet_moon") g = `<path d="M50 24c-14 0-24 12-24 26s10 26 24 26c-8-6-12-16-12-26s4-20 12-26Z" fill="#e8eeff"/><path d="M62 30c-10 4-16 12-16 20s6 16 16 20c-6-6-9-13-9-20s3-14 9-20Z" fill="#c3cbe6"/>`;
      else if (item.id === "pet_rover") g = `<rect x="26" y="40" width="48" height="22" rx="5" fill="#c9d3e8"/><circle cx="34" cy="66" r="7" fill="#6c7793"/><circle cx="50" cy="66" r="7" fill="#6c7793"/><circle cx="66" cy="66" r="7" fill="#6c7793"/><rect x="40" y="30" width="20" height="10" rx="3" fill="#4fe3ff"/>`;
      else if (item.id === "pet_fox") g = `<path d="M30 34 26 18l14 8ZM70 34 74 18 60 26Z" fill="#ff9d5c"/><circle cx="50" cy="50" r="22" fill="#ff9d5c"/><circle cx="42" cy="46" r="4" fill="#0f1a33"/><circle cx="58" cy="46" r="4" fill="#0f1a33"/><path d="M50 56l-5 5h10Z" fill="#0f1a33"/>`;
      else if (item.id === "pet_alien") g = `<ellipse cx="50" cy="48" rx="24" ry="20" fill="#5ff0b6"/><ellipse cx="42" cy="44" rx="6" ry="8" fill="#0f1a33"/><ellipse cx="58" cy="44" rx="6" ry="8" fill="#0f1a33"/><path d="M40 60c6 4 14 4 20 0" stroke="#0d4a37" stroke-width="2.4" fill="none"/><path d="M26 52 12 44M74 52 88 44" stroke="#5ff0b6" stroke-width="4" stroke-linecap="round"/>`;
      else if (item.id === "pet_dragon") g = `<path d="M50 24c-16 0-26 12-26 26s10 26 26 26 26-12 26-26-10-26-26-26Z" fill="#a99bff"/><path d="M34 30 26 18l12 4ZM66 30 74 18l-12 4Z" fill="#6b3fd0"/><circle cx="42" cy="46" r="4" fill="#0f1a33"/><circle cx="58" cy="46" r="4" fill="#0f1a33"/><path d="M42 60c5 5 11 5 16 0" stroke="#0f1a33" stroke-width="2.4" fill="none"/>`;
      else if (item.id === "pet_phoenix") g = `<path d="M50 20c-8 10-20 14-30 12 8 8 18 12 30 12s22-4 30-12c-10 2-22-2-30-12Z" fill="#ffb347"/><path d="M50 34c-6 8-14 12-22 12 6 6 14 10 22 10s16-4 22-10c-8 0-16-4-22-12Z" fill="#ff5f8f"/><circle cx="50" cy="52" r="8" fill="#fff6d0"/>`;
      else g = `<circle cx="50" cy="50" r="18" fill="none" stroke="${c.trim}" stroke-width="2" stroke-dasharray="4 4" opacity=".5"/>`;
      return `<svg viewBox="0 0 100 100" role="img" aria-label="${item.name}">${g}</svg>`;
    }
    if (kind === "trail") {
      let g = "";
      if (item.id === "trail_dust") g = `<circle cx="30" cy="60" r="7" fill="#9dabc8" opacity=".7"/><circle cx="46" cy="52" r="5" fill="#9dabc8" opacity=".5"/><circle cx="60" cy="46" r="3.5" fill="#9dabc8" opacity=".35"/>`;
      else if (item.id === "trail_spark") g = `<circle cx="28" cy="62" r="5" fill="#ffb347"/><circle cx="44" cy="54" r="4" fill="#ffc857"/><circle cx="58" cy="46" r="3" fill="#fff6d0"/><path d="M20 70 12 78M36 62 30 72" stroke="#ffb347" stroke-width="2.4" stroke-linecap="round"/>`;
      else if (item.id === "trail_bubble") g = `<circle cx="30" cy="60" r="9" fill="none" stroke="#7fd8ff" stroke-width="2.4"/><circle cx="50" cy="48" r="6" fill="none" stroke="#7fd8ff" stroke-width="2"/><circle cx="64" cy="40" r="4" fill="none" stroke="#7fd8ff" stroke-width="1.8"/>`;
      else if (item.id === "trail_star") g = `<path d="M28 60 31 68 39 68 33 73 35 81 28 76 21 81 23 73 17 68 25 68Z" fill="#ffc857"/><path d="M52 44 54 50 60 50 55 54 57 60 52 56 47 60 49 54 44 50 50 50Z" fill="#fff6d0"/>`;
      else if (item.id === "trail_flame") g = `<path d="M20 74c0-14 8-22 16-30 2 10 8 14 8 22 0 8-6 14-12 14s-12-2-12-6Z" fill="#ffb347"/><path d="M26 74c0-8 5-13 10-18 1 6 5 9 5 14 0 5-4 8-8 8s-7-1-7-4Z" fill="#fff6d0"/>`;
      else if (item.id === "trail_rainbow") g = `<path d="M14 70c10-16 26-24 44-24" stroke="#ff7d7d" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M14 78c10-16 26-24 44-24" stroke="#ffc857" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M14 86c10-16 26-24 44-24" stroke="#5ff0b6" stroke-width="5" fill="none" stroke-linecap="round"/>`;
      else if (item.id === "trail_aurora") g = `<path d="M12 76c14-20 30-30 50-30" stroke="#5ff0b6" stroke-width="7" fill="none" stroke-linecap="round" opacity=".85"/><path d="M12 86c14-20 30-30 50-30" stroke="#a99bff" stroke-width="7" fill="none" stroke-linecap="round" opacity=".7"/>`;
      else if (item.id === "trail_void") g = `<ellipse cx="34" cy="62" rx="20" ry="9" fill="none" stroke="#a99bff" stroke-width="3" transform="rotate(-24 34 62)"/><ellipse cx="58" cy="46" rx="12" ry="5" fill="none" stroke="#a99bff" stroke-width="2.4" transform="rotate(-24 58 46)"/>`;
      else g = `<path d="M20 70c12-14 26-20 42-20" stroke="${c.trim}" stroke-width="3" fill="none" stroke-dasharray="5 6" opacity=".5"/>`;
      return `<svg viewBox="0 0 100 100" role="img" aria-label="${item.name}">${g}</svg>`;
    }

    let glyph = "";
    if (item.id === "badge_rocket") glyph = `<path d="M50 34c4 3 6 8 6 12v8H44v-8c0-4 2-9 6-12Z" fill="#ff7d7d"/><path d="M44 54 40 61l4-2ZM56 54 60 61l-4-2Z" fill="#ffc857"/>`;
    if (item.id === "badge_planet") glyph = `<circle cx="50" cy="52" r="10" fill="#ffc857"/><ellipse cx="50" cy="52" rx="17" ry="5" fill="none" stroke="#ff7d7d" stroke-width="3" transform="rotate(-18 50 52)"/>`;
    if (item.id === "badge_comet") glyph = `<circle cx="55" cy="48" r="6" fill="#ffc857"/><path d="M48 52 36 60M52 45 40 44M49 41 40 35" stroke="#4fe3ff" stroke-width="3" stroke-linecap="round"/>`;
    if (item.id === "badge_wings") glyph = `<path d="M50 44h4v18h-4Z" fill="#ffc857"/><path d="M50 46 30 40v10l20 6Z" fill="#ffc857"/><path d="M54 46 74 40v10l-20 6Z" fill="#ffc857"/><circle cx="52" cy="42" r="4" fill="#ff7d7d"/>`;
    if (item.id === "badge_shield") glyph = `<path d="M50 34 66 40v12c0 10-8 16-16 20-8-4-16-10-16-20V40Z" fill="#4fe3ff" opacity=".9"/><path d="M50 40v22" stroke="#0c1934" stroke-width="2"/>`;
    if (item.id === "badge_flame") glyph = `<path d="M50 34c6 8 12 12 12 20a12 12 0 0 1-24 0c0-8 6-12 12-20Z" fill="#ffb347"/><path d="M50 44c3 4 6 6 6 10a6 6 0 0 1-12 0c0-4 3-6 6-10Z" fill="#fff6d0"/>`;
    if (item.id === "badge_eye") glyph = `<ellipse cx="50" cy="52" rx="18" ry="11" fill="#0f1a33"/><circle cx="50" cy="52" r="7" fill="#4fe3ff"/><circle cx="50" cy="52" r="3" fill="#fff"/><path d="M32 52 24 44M68 52 76 44" stroke="#a99bff" stroke-width="2.4" stroke-linecap="round"/>`;
    if (item.id === "badge_laurel") glyph = `<path d="M50 62c-10 0-18-6-20-14 8 0 14 4 18 10" fill="#5ff0b6"/><path d="M50 62c10 0 18-6 20-14-8 0-14 4-18 10" fill="#5ff0b6"/><circle cx="50" cy="44" r="7" fill="#ffc857"/>`;
    if (item.id === "badge_galaxy") glyph = `<ellipse cx="50" cy="52" rx="20" ry="9" fill="none" stroke="#a99bff" stroke-width="3" transform="rotate(-22 50 52)"/><circle cx="50" cy="52" r="6" fill="#fff6d0"/><circle cx="34" cy="46" r="2" fill="#4fe3ff"/><circle cx="66" cy="58" r="2" fill="#ffc857"/>`;
    if (item.id === "badge_none") glyph = `<circle cx="50" cy="52" r="6" fill="${c.trim}" opacity=".5"/>`;
    return `<svg viewBox="0 0 100 100" role="img" aria-label="${item.name}">
      <circle cx="50" cy="52" r="30" fill="${c.accent}" opacity=".16"/>
      <circle cx="50" cy="52" r="30" fill="none" stroke="${c.trim}" stroke-width="2.5"/>
      ${glyph}
    </svg>`;
  }

  /* ---- medal ---- */
  function medal(hue) {
    const u = "md" + (++__uid);
    const out = `<svg viewBox="0 0 120 120" role="img" aria-label="Mission medal">
      <defs>
        <radialGradient id="md-g" cx="34%" cy="28%" r="76%">
          <stop offset="0%" stop-color="#fff6cf"/><stop offset="48%" stop-color="#ffc857"/><stop offset="100%" stop-color="#b8781a"/>
        </radialGradient>
      </defs>
      <path d="M40 8 52 44 34 52 24 18Z" fill="hsl(${hue} 90% 62%)" opacity=".9"/>
      <path d="M80 8 68 44 86 52 96 18Z" fill="hsl(${hue} 90% 46%)" opacity=".9"/>
      <circle cx="60" cy="72" r="36" fill="url(#md-g)"/>
      <circle cx="60" cy="72" r="29" fill="none" stroke="#8a5a10" stroke-width="2" opacity=".45"/>
      <circle cx="60" cy="72" r="22" fill="#0f1730" opacity=".18"/>
      <path d="M60 52 65 66 80 66 68 75 72 90 60 81 48 90 52 75 40 66 55 66Z" fill="#fff8dc" opacity=".95"/>
      <circle cx="44" cy="56" r="8" fill="#fff" opacity=".28"/>
    </svg>`;
    return out.split("md-").join(u + "-");
  }

  return { planet, scene, cadet, thumb, medal, shadeColor };
})();
/*@@END_JS_ART@@*/

export { ART };
