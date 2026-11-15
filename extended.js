/* Astro, cinema, lab, contact and About feature bundle. */
import { CINEMA_ITEMS } from "../data/videos.js";
import { $ as $x, $$ as $$x, escapeHTML as safe } from "../utils.js";
(function(){
"use strict";
function state(){return window.AstroCadet&&AstroCadet.Store.state}
function save(){try{AstroCadet.Store.save();AstroCadet.UI.syncHUD()}catch(e){}}
function notify(msg){try{AstroCadet.UI.toast(msg)}catch(e){let n=document.createElement('div');n.className='toast';n.textContent=msg;document.body.appendChild(n);setTimeout(()=>n.remove(),2500)}}
function awardOnce(key,amount,label){
 const s=state();if(!s)return false;
 s.extraRewards=s.extraRewards||{};
 if(s.extraRewards[key])return false;
 s.extraRewards[key]=true;s.stars=(s.stars||0)+amount;s.earnedTotal=(s.earnedTotal||0)+amount;save();
 notify('⭐ +'+amount+' Stars — '+label);return true;
}
function addTab(label,view){
 const nav=$x('.tabs');if(!nav||$x('[data-extra-view="'+view+'"]'))return;
 const b=document.createElement('button');b.className='tab';b.dataset.extraView=view;b.textContent=label;nav.appendChild(b);
 b.addEventListener('click',()=>showExtra(view));
}
function addView(id){
 let el=document.createElement('section');el.id='extra-'+id;el.className='extra-view';el.dataset.extraView=id;$x('#app').appendChild(el);return el;
}
function showExtra(id){
 $$x('.view').forEach(x=>x.classList.remove('is-active'));
 $$x('.extra-view').forEach(x=>x.classList.toggle('active',x.id==='extra-'+id));
 $$x('.tabs .tab').forEach(x=>x.classList.toggle('is-active',x.dataset.extraView===id));
 if(id==='cinema')renderCinema(); if(id==='lab')renderLab(); if(id==='about')renderAbout();
}
const cinemaItems = CINEMA_ITEMS;;
let selectedCinemaId=cinemaItems[0].id;
let cinemaSearch='';
let cinemaCategory='All';
let cinemaAudience='kids';

function cinemaPlayer(){
 const v=cinemaItems.find(x=>x.id===selectedCinemaId)||cinemaItems[0];
 const player=$x('#cinema-player');if(!player)return;
 player.innerHTML=`<div class="cinema-now-playing">
  <div class="cinema-player-frame">
   <video class="cinema-native-video" controls playsinline preload="metadata" poster="" aria-label="${safe(v.title)}">
    <source src="${v.videoUrl}" type="video/mp4">
    Your browser does not support HTML5 video.
   </video>
  </div>
  <div class="cinema-player-meta">
   <span class="cinema-eyebrow">NOW PLAYING · ${safe(v.category)} · ${safe(v.ageLabel)}</span>
   <h3>${safe(v.title)}</h3><p>${safe(v.desc)}</p>
   <small>Video source: ${safe(v.source)} · <a href="${v.pageUrl}" target="_blank" rel="noopener noreferrer">NASA lesson and transcript</a></small>
   <button class="extra-btn cinema-quiz-launch" onclick="AstroExtra.quizVideo('${v.id}')">🧠 Take this video’s quiz</button>
   <div id="video-quiz-${v.id}"></div>
   <p class="cinema-player-note">If playback does not start, check your internet connection or try another NASA video.</p>
  </div>
 </div>`;
 const video=player.querySelector('video');
 if(video){
  video.addEventListener('error',function(){
   const note=player.querySelector('.cinema-player-note');
   if(note)note.innerHTML='This video could not load right now. <a href="'+v.pageUrl+'" target="_blank" rel="noopener noreferrer">Open the official NASA lesson</a>.';
  },{once:true});
 }
}
function cinemaGrid(){
 const grid=$x('#cinema-grid');if(!grid)return;
 const q=cinemaSearch.trim().toLowerCase();
 const shown=cinemaItems.filter(v=>(cinemaAudience==='all'||v.audience===cinemaAudience)
  &&(cinemaCategory==='All'||v.category===cinemaCategory)
  &&(!q||(v.title+' '+v.desc+' '+v.category+' '+v.ageLabel).toLowerCase().includes(q)));
 grid.innerHTML=shown.length?shown.map(v=>`<button type="button" class="cinema-video-card ${v.id===selectedCinemaId?'is-selected':''}" onclick="AstroExtra.playCinema('${v.id}')" aria-pressed="${v.id===selectedCinemaId}">
  <span class="cinema-thumb cinema-thumb-art"><span class="cinema-thumb-icon" aria-hidden="true">${v.icon}</span><span class="cinema-play" aria-hidden="true">▶</span><span class="cinema-age">${safe(v.ageLabel)}</span></span>
  <span class="cinema-card-copy"><small>${safe(v.category)}</small><b>${safe(v.title)}</b><span>${safe(v.desc)}</span></span>
 </button>`).join(''):'<p class="cinema-empty">No videos match this selection. Try another age group or search term.</p>';
}
function renderCinema(){
 const el=$x('#extra-cinema');if(!el)return;
 const categories=['All',...new Set(cinemaItems.filter(v=>cinemaAudience==='all'||v.audience===cinemaAudience).map(v=>v.category))];
 el.innerHTML=`<div class="extra-hero cinema-hero">
  <div>🎬 ASTRO CINEMA</div><h2>NASA science films for every curious mind</h2>
  <p>Choose an age group, watch official NASA Space Place videos right here, and test what you learned. The videos use NASA-hosted MP4 files, so the YouTube Error 153 player issue is avoided.</p>
  <div class="cinema-hero-stats"><span>🎞️ ${cinemaItems.length} learning picks</span><span>🛰️ Official NASA sources</span><span>⭐ Video quizzes</span></div>
 </div>
 <section class="cinema-feature" aria-label="Selected video">
  <div class="cinema-section-heading"><div><small>ASTRO CINEMA THEATER</small><h2>Now showing</h2></div><span class="cinema-live-dot">● PLAYS INSIDE ASTRO JR</span></div>
  <div id="cinema-player"></div>
 </section>
 <section class="cinema-library">
  <div class="cinema-section-heading"><div><small>VIDEO LIBRARY</small><h2>Choose your next discovery</h2></div><span class="cinema-count">${cinemaItems.length} videos</span></div>
  <div class="cinema-tools">
   <label class="cinema-age-label" for="cinema-audience">Choose an age group</label>
   <select id="cinema-audience" class="cinema-audience" onchange="AstroExtra.audienceCinema(this.value)">
    <option value="kids" ${cinemaAudience==='kids'?'selected':''}>Kids · up to 13 years</option>
    <option value="advanced" ${cinemaAudience==='advanced'?'selected':''}>Older learners · 14+</option>
    <option value="all" ${cinemaAudience==='all'?'selected':''}>Show all videos</option>
   </select>
   <input id="cinema-search" type="search" placeholder="Search rockets, planets, black holes…" aria-label="Search videos" oninput="AstroExtra.filterCinema(this.value)">
   <div class="cinema-categories">${categories.map(c=>`<button type="button" class="cinema-filter ${c===cinemaCategory?'active':''}" onclick="AstroExtra.categoryCinema('${safe(c)}')">${safe(c)}</button>`).join('')}</div>
  </div>
  <div class="cinema-video-grid" id="cinema-grid"></div>
 </section>
 <p class="cinema-footnote">All videos are played from NASA Space Place MP4 files inside this page. An internet connection is required. NASA lesson pages include explanations and transcripts.</p>
 <p class="cinema-source-note">Sources: <a href="https://spaceplace.nasa.gov/menu/videos/" target="_blank" rel="noopener noreferrer">NASA Space Place video library</a>. Content is presented for educational use with source attribution.</p>`;
 cinemaPlayer();cinemaGrid();
}
function playCinema(id){if(!cinemaItems.some(v=>v.id===id))return;selectedCinemaId=id;cinemaPlayer();cinemaGrid();$x('#cinema-player')?.scrollIntoView({behavior:'smooth',block:'nearest'});}
function filterCinema(value){cinemaSearch=String(value||'');cinemaGrid();}
function categoryCinema(value){
 cinemaCategory=value;
 const tools=$x('.cinema-categories');
 if(tools)$$x('button',tools).forEach(b=>b.classList.toggle('active',b.textContent===value));
 cinemaGrid();
}
function audienceCinema(value){
 cinemaAudience=['kids','advanced','all'].includes(value)?value:'kids';
 cinemaCategory='All';
 const categories=['All',...new Set(cinemaItems.filter(v=>cinemaAudience==='all'||v.audience===cinemaAudience).map(v=>v.category))];
 const holder=$x('.cinema-categories');
 if(holder)holder.innerHTML=categories.map(c=>`<button type="button" class="cinema-filter ${c===cinemaCategory?'active':''}" onclick="AstroExtra.categoryCinema('${safe(c)}')">${safe(c)}</button>`).join('');
 const available=cinemaItems.filter(v=>cinemaAudience==='all'||v.audience===cinemaAudience);
 if(!available.some(v=>v.id===selectedCinemaId)){selectedCinemaId=available[0].id;cinemaPlayer();}
 const count=$x('.cinema-count');if(count)count.textContent=available.length+' videos';
 cinemaGrid();
}
function quizVideo(id){
 const v=cinemaItems.find(x=>x.id===id);if(!v)return;
 const target=$x('#video-quiz-'+id);if(target.dataset.done==='1'){target.innerHTML='<p>You already completed this video quiz. Great memory, cadet!</p>';return}
 target.innerHTML=`<div class="extra-card"><b>${v.quiz}</b><div class="quiz-options">${v.opts.map((o,i)=>`<button class="extra-btn" onclick="AstroExtra.answerVideo('${id}',${i})">${safe(o)}</button>`).join('')}</div><p id="video-feedback-${id}" aria-live="polite"></p></div>`;
}
function answerVideo(id,i){
 const v=cinemaItems.find(x=>x.id===id);const t=$x('#video-quiz-'+id);if(!v||!t||t.dataset.done==='1')return;
 if(i===v.correct){t.dataset.done='1';$x('#video-feedback-'+id).textContent=window.AstroLanguage&&AstroLanguage.get()==='ar'?'إجابة صحيحة! لقد ربحت 5 نجوم.':'Correct! You earned 5 Stars.';awardOnce('cinema-'+id,5,'AstroCinema quiz');$$x('button',t).forEach(b=>b.disabled=true)}
 else{$x('#video-feedback-'+id).textContent='Not quite — watch again and have another try.'}
}
const puzzles=[
 {id:'gravity',emoji:'🪂',title:'Gravity Detective',desc:'A dropped tool and a feather fall together in a vacuum. Why?',q:'What is true when there is no air resistance?',opts:['Heavier things always fall faster','Objects accelerate equally under gravity','Gravity disappears'],a:1,stars:4},
 {id:'orbit',emoji:'🛰️',title:'Orbit Builder',desc:'A satellite keeps falling around Earth instead of straight down.',q:'What keeps a satellite in orbit?',opts:['Gravity bends its forward motion','There is no gravity in space','It has invisible wings'],a:0,stars:4},
 {id:'light',emoji:'🌈',title:'Light Lab',desc:'White light contains many colours.',q:'What can a prism do to white light?',opts:['Turn it into sound','Separate it into colours','Make it heavier'],a:1,stars:4}
];
function renderLab(){
 const el=$x('#extra-lab');if(!el)return;
 const s=state();const day=new Date().toISOString().slice(0,10);
 el.innerHTML=`<div class="extra-hero"><div>🧪 CADET TRAINING LAB</div><h2>Earn Stars by getting curious</h2><p>Daily challenge, science puzzles, and a quick planet discovery. Rewards are saved and each challenge pays only once.</p><button class="extra-btn" onclick="AstroExtra.daily()">🌟 Claim daily challenge</button> <button class="extra-btn" onclick="AstroExtra.discovery()">🪐 Discover a planet</button></div>
 <section class="global-sim-hub" aria-labelledby="global-sim-title">
  <div class="global-sim-heading"><div><span class="global-sim-kicker">🌍 REAL MISSIONS · REAL SCIENCE</span><h2 id="global-sim-title">Global Space Simulator Hub</h2><p>Explore real interactive tools from NASA and PhET — right here in your training lab.</p></div><span class="global-sim-orbit-art" aria-hidden="true">🪐</span></div>
  <div class="global-sim-tabs" role="group" aria-label="Choose a space simulation">
   <button type="button" class="global-sim-tab active" data-global-sim="nasa-solar" onclick="AstroExtra.openGlobalSim('nasa-solar')">🌌 Solar System 3D</button>
   <button type="button" class="global-sim-tab" data-global-sim="nasa-asteroids" onclick="AstroExtra.openGlobalSim('nasa-asteroids')">☄️ Asteroid Tracker</button>
   <button type="button" class="global-sim-tab" data-global-sim="nasa-mars" onclick="AstroExtra.openGlobalSim('nasa-mars')">🔴 Mars Landing</button>
   <button type="button" class="global-sim-tab" data-global-sim="nasa-exoplanets" onclick="AstroExtra.openGlobalSim('nasa-exoplanets')">🪐 Exoplanets</button>
   <button type="button" class="global-sim-tab" data-global-sim="phet-gravity" onclick="AstroExtra.openGlobalSim('phet-gravity')">🧲 Gravity & Orbits</button>
   <button type="button" class="global-sim-tab" data-global-sim="phet-system" onclick="AstroExtra.openGlobalSim('phet-system')">☀️ Build a Solar System</button>
  </div>
  <div class="global-sim-frame-wrap"><div class="global-sim-loading" id="global-sim-loading">🚀 Preparing your mission...</div><iframe id="global-sim-frame" title="NASA Eyes on the Solar System interactive simulation" src="https://eyes.nasa.gov/apps/solar-system/" loading="lazy" allow="fullscreen; autoplay" allowfullscreen referrerpolicy="no-referrer"></iframe></div>
  <div class="global-sim-caption"><div><b id="global-sim-name">NASA Eyes on the Solar System</b><p id="global-sim-desc">Explore planets, moons, spacecraft and real NASA missions in an interactive 3D universe.</p><small id="global-sim-source">Official source: NASA / JPL</small></div><a id="global-sim-open" class="global-sim-open" href="https://eyes.nasa.gov/apps/solar-system/" target="_blank" rel="noopener noreferrer">Open full screen ↗</a></div>
  <p class="global-sim-note">NASA Eyes supports website embeds, but browser privacy settings, school networks, firewalls, or provider outages can still block an embedded frame. If you see a blank screen or “connection refused”, use “Open full screen” to launch the official simulation directly. NASA planet fact pages open directly rather than being forced into an iframe.</p>
 </section>
 <div class="extra-grid">${puzzles.map(p=>`<article class="extra-card"><div style="font-size:2rem">${p.emoji}</div><h3>${p.title}</h3><p>${p.desc}</p><b>${p.q}</b><div class="quiz-options">${p.opts.map((o,i)=>`<button class="extra-btn" onclick="AstroExtra.puzzle('${p.id}',${i})">${safe(o)}</button>`).join('')}</div><p id="puzzle-feedback-${p.id}" aria-live="polite"></p></article>`).join('')}<article class="extra-card"><h3>🏅 Achievements</h3><p>Keep exploring to build your explorer streak.</p><div id="extra-achievements"></div></article></div>
 <div class="extra-card simulation-card"><div class="pill">INTERACTIVE SIMULATION</div><h3>🪐 Gravity & Orbit Simulator</h3>
 <p>Change the planet's gravity and see how strongly it pulls a satellite. Increase gravity to tighten the orbit; decrease it to loosen the pull.</p>
 <label for="gravity-slider">Gravity strength: <b id="gravity-value">50%</b></label>
 <input id="gravity-slider" class="sim-slider" type="range" min="10" max="100" value="50" oninput="AstroExtra.simulateGravity(this.value)">
 <div class="sim-stage"><div class="sim-planet">🌍</div><div class="sim-orbit" id="sim-orbit"><span class="sim-satellite">🛰️</span></div></div>
 <p id="gravity-explanation" class="sim-explanation" aria-live="polite">At 50%, gravity provides a balanced pull that bends the satellite's path around Earth.</p>
 </div>
 <div class="lab-sim-grid">
  <article class="extra-card simulation-card"><div class="pill">MISSION 02 · ROCKET PIONEERS</div><h3>🚀 Rocket Thrust Lab</h3><p>Change the engine thrust and watch how the rocket's acceleration changes. Rockets move forward by pushing exhaust backward.</p><label for="thrust-slider">Engine thrust: <b id="thrust-value">60%</b></label><input id="thrust-slider" class="sim-slider" type="range" min="0" max="100" value="60" oninput="AstroExtra.simulateThrust(this.value)"><div class="thrust-stage" id="thrust-stage"><div class="thrust-rocket" id="thrust-rocket">🚀</div><div class="thrust-flame" id="thrust-flame">🔥</div></div><p id="thrust-explanation" class="sim-explanation" aria-live="polite">At 60% thrust, the engine produces a strong forward push.</p></article>
  <article class="extra-card simulation-card"><div class="pill">MISSION 05 · SPACE NAVIGATION</div><h3>🛰️ Build an Orbit</h3><p>Adjust the satellite's sideways speed. Gravity keeps pulling it inward while its forward motion carries it around Earth.</p><label for="speed-slider">Forward speed: <b id="speed-value">50%</b></label><input id="speed-slider" class="sim-slider" type="range" min="0" max="100" value="50" oninput="AstroExtra.simulateSpeed(this.value)"><div class="orbit-lab-stage"><div class="orbit-lab-earth">🌍</div><div class="orbit-lab-track" id="orbit-lab-track"><span>🛰️</span></div></div><p id="speed-explanation" class="sim-explanation" aria-live="polite">Balanced forward speed lets the satellite keep missing Earth and stay in orbit.</p></article>
  <article class="extra-card simulation-card"><div class="pill">MISSION 03 · SPACECRAFT PILOT</div><h3>☀️ Solar Power Station</h3><p>Turn the solar panels toward the Sun. Panels collect the most energy when sunlight hits them directly.</p><label for="panel-slider">Panel angle: <b id="panel-value">0°</b></label><input id="panel-slider" class="sim-slider" type="range" min="-90" max="90" value="0" oninput="AstroExtra.simulatePanels(this.value)"><div class="solar-stage"><div class="solar-sun">☀️</div><div class="solar-rays">\\\</div><div class="solar-panel" id="solar-panel">▰▰▰</div><div class="solar-meter"><span id="solar-fill"></span></div></div><p id="panel-explanation" class="sim-explanation" aria-live="polite">Perfect alignment! The panels receive maximum sunlight and generate full power.</p></article>
  <article class="extra-card simulation-card"><div class="pill">MISSION 07 · THE MOON LANDING</div><h3>🌙 Moon Phase Explorer</h3><p>Move the Moon around Earth and see how the sunlit half creates the phases we observe from home.</p><label for="phase-slider">Moon position: <b id="phase-value">0° · New Moon</b></label><input id="phase-slider" class="sim-slider" type="range" min="0" max="7" value="0" oninput="AstroExtra.simulatePhase(this.value)"><div class="phase-stage"><div class="phase-earth">🌍</div><div class="phase-moon" id="phase-moon">🌑</div><div class="phase-sun">☀️ Sunlight</div></div><p id="phase-explanation" class="sim-explanation" aria-live="polite">At New Moon, the Moon is between Earth and the Sun, so its bright side faces away from us.</p></article>
 </div>`;
 const ach=s&&s.extraRewards||{};$x('#extra-achievements').innerHTML=Object.keys(ach).filter(k=>ach[k]).map(k=>'🏅 '+safe(k.replace(/-/g,' '))).join('<br>')||'Your first badge is waiting!';
 const firstFrame=$x('#global-sim-frame'),firstLoading=$x('#global-sim-loading');if(firstFrame&&firstLoading)firstFrame.addEventListener('load',()=>{firstLoading.hidden=true;},{once:true});
}
const globalSimulations={
 'nasa-solar':{name:'NASA Eyes on the Solar System',desc:'Explore planets, moons, spacecraft and real NASA missions in an interactive 3D universe.',source:'Official source: NASA / JPL',url:'https://eyes.nasa.gov/apps/solar-system/',title:'NASA Eyes on the Solar System interactive simulation'},
 'nasa-asteroids':{name:'NASA Eyes on Asteroids',desc:'Track near-Earth asteroids and explore their paths through the Solar System.',source:'Official source: NASA / JPL',url:'https://eyes.nasa.gov/apps/asteroids/',title:'NASA Eyes on Asteroids interactive simulation'},
 'nasa-mars':{name:'NASA Mars 2020 Landing Experience',desc:'Experience the entry, descent and landing sequence of the Perseverance rover on Mars.',source:'Official source: NASA / JPL',url:'https://eyes.nasa.gov/apps/mars2020/',title:'NASA Mars 2020 landing simulation'},
 'nasa-exoplanets':{name:'NASA Eyes on Exoplanets',desc:'Visit distant planetary systems and compare worlds beyond our Solar System.',source:'Official source: NASA / JPL',url:'https://eyes.nasa.gov/apps/exo/',title:'NASA Eyes on Exoplanets interactive simulation'},
 'phet-gravity':{name:'PhET Gravity and Orbits',desc:'Experiment with gravity and orbital motion using an interactive physics model.',source:'Official source: PhET · University of Colorado Boulder',url:'https://phet.colorado.edu/sims/html/gravity-and-orbits/latest/gravity-and-orbits_all.html?locale=en',title:'PhET Gravity and Orbits simulation'},
 'phet-system':{name:'PhET My Solar System',desc:'Build a model solar system and investigate how gravity shapes the motion of objects.',source:'Official source: PhET · University of Colorado Boulder',url:'https://phet.colorado.edu/sims/html/my-solar-system/latest/my-solar-system_all.html?locale=en',title:'PhET My Solar System simulation'}
};
let globalSimLoadTimer=null;
function openGlobalSim(key){
 const sim=globalSimulations[key];if(!sim)return;
 const frame=$x('#global-sim-frame'),name=$x('#global-sim-name'),desc=$x('#global-sim-desc'),source=$x('#global-sim-source'),open=$x('#global-sim-open'),loading=$x('#global-sim-loading');
 if(!frame||!name||!desc||!source||!open)return;
 if(globalSimLoadTimer)clearTimeout(globalSimLoadTimer);
 $$x('.global-sim-tab').forEach(b=>b.classList.toggle('active',b.dataset.globalSim===key));
 const activeLang=window.AstroLanguage&&AstroLanguage.get()==='ar'?'ar':'en';const simUrl=key.startsWith('phet-')?sim.url.replace(/locale=[^&]+/,'locale='+activeLang):sim.url;
 name.textContent=sim.name;desc.textContent=sim.desc;source.textContent=sim.source;open.href=simUrl;frame.title=sim.title;
 if(loading){loading.hidden=false;loading.textContent='🚀 Loading '+sim.name+'…';}
 frame.onload=()=>{if(loading)loading.hidden=true;};
 frame.onerror=()=>{if(loading){loading.hidden=false;loading.textContent='This simulation could not be embedded. Use “Open official simulation” below.';}};
 frame.src=simUrl;
 globalSimLoadTimer=setTimeout(()=>{
   if(loading&&!loading.hidden){loading.textContent='Still loading? Your browser or network may block embedded content. Open the official simulation in a new tab.';}
 },12000);
}
function simulateGravity(value){
 const v=Math.max(10,Math.min(100,Number(value)||50));
 const orbit=$x('#sim-orbit'),read=$x('#gravity-value'),ex=$x('#gravity-explanation');
 if(!orbit||!read||!ex)return;
 const size=220-(v*1.25);
 orbit.style.width=size+'px';orbit.style.height=size+'px';
 orbit.style.animationDuration=Math.max(2.2,8-(v*.055))+'s';
 read.textContent=v+'%';
 ex.textContent=v>=70?'High gravity: the pull is stronger, so the satellite needs more forward speed to stay in a stable orbit.':v<=30?'Low gravity: the pull is weaker, so the satellite follows a wider path and may drift away.':'Balanced gravity: the pull bends the satellite’s forward motion into an orbit around Earth.';
}
function simulateThrust(value){
 const v=Math.max(0,Math.min(100,Number(value)||0));
 const read=$x('#thrust-value'),rocket=$x('#thrust-rocket'),flame=$x('#thrust-flame'),ex=$x('#thrust-explanation');if(!read||!rocket||!flame||!ex)return;
 read.textContent=v+'%';rocket.style.transform=`translateX(${(v-50)*1.15}px) translateY(${-v*.35}px)`;flame.style.opacity=String(v/100);flame.style.transform=`scale(${.35+v/65})`;
 ex.textContent=v===0?'Engine off: with no thrust, the rocket does not accelerate.':v<35?'Low thrust: the rocket gets a gentle push and accelerates slowly.':v<75?'Medium thrust: the rocket accelerates more strongly as exhaust shoots backward.':'Maximum thrust: the strongest push! The rocket accelerates rapidly while fuel is being used.';
}
function simulateSpeed(value){
 const v=Math.max(0,Math.min(100,Number(value)||0));const read=$x('#speed-value'),track=$x('#orbit-lab-track'),ex=$x('#speed-explanation');if(!read||!track||!ex)return;
 read.textContent=v+'%';track.style.animationDuration=Math.max(1.4,10-v*.085)+'s';track.style.opacity=v<12?'.35':'1';track.style.transform=`scale(${v<20?1.25:v>82?.78:1})`;
 ex.textContent=v<20?'Too slow: gravity pulls the satellite down before it can travel around Earth.':v>82?'Very fast: the satellite can escape into a much wider path instead of staying in this low orbit.':'Good orbital range: forward motion and gravity work together, so the satellite continually falls around Earth.';
}
function simulatePanels(value){
 const v=Math.max(-90,Math.min(90,Number(value)||0));const efficiency=Math.round(Math.cos(v*Math.PI/180)*100);const read=$x('#panel-value'),panel=$x('#solar-panel'),fill=$x('#solar-fill'),ex=$x('#panel-explanation');if(!read||!panel||!fill||!ex)return;
 read.textContent=v+'°';panel.style.transform=`rotate(${v*.45}deg)`;fill.style.width=efficiency+'%';
 ex.textContent=efficiency>95?'Perfect alignment! The panels receive maximum sunlight and generate full power.':efficiency>65?'Good collection: sunlight still reaches the panels well, but some energy is lost.':'Poor alignment: sunlight spreads across the panel at an angle, so less electrical energy is collected.';
}
const moonPhases=[['New Moon','🌑','The Moon is between Earth and the Sun, so its bright side faces away from us.'],['Waxing Crescent','🌒','A small bright crescent appears as the Moon moves along its orbit.'],['First Quarter','🌓','We see half of the Moon’s lit side.'],['Waxing Gibbous','🌔','More than half of the visible Moon is lit as it approaches Full Moon.'],['Full Moon','🌕','Earth sees the Moon’s fully illuminated side.'],['Waning Gibbous','🌖','The bright part begins shrinking after Full Moon.'],['Last Quarter','🌗','Half of the visible Moon is lit again, on the opposite side.'],['Waning Crescent','🌘','A thin crescent remains before the cycle begins again.']];
function simulatePhase(value){const i=Math.max(0,Math.min(7,Number(value)||0)),p=moonPhases[i],read=$x('#phase-value'),moon=$x('#phase-moon'),ex=$x('#phase-explanation');if(!read||!moon||!ex)return;read.textContent=i*45+'° · '+p[0];moon.textContent=p[1];ex.textContent=p[2];}

function daily(){
 const s=state();if(!s)return;const key='daily-'+new Date().toISOString().slice(0,10);
 if((s.extraRewards||{})[key]){notify('Daily challenge already claimed. Come back tomorrow!');return}
 AstroCadet.UI.showLearningDialog('Daily science challenge',
  '<p class="dialog-question">Which planet is famous for its rings?</p><div class="dialog-options"><button class="btn btn-ghost" type="button" onclick="AstroExtra.answerDaily(\'mars\')">Mars</button><button class="btn btn-ghost" type="button" onclick="AstroExtra.answerDaily(\'saturn\')">Saturn</button><button class="btn btn-ghost" type="button" onclick="AstroExtra.answerDaily(\'mercury\')">Mercury</button></div><p id="daily-feedback" class="dialog-feedback" aria-live="polite">Choose an answer to check your knowledge.</p>',
  '<button class="btn btn-ghost btn-sm" type="button" onclick="AstroExtra.closeLearningDialog()">Close</button>');
}
function answerDaily(answer){
 const s=state();if(!s)return;const key='daily-'+new Date().toISOString().slice(0,10);const feedback=$x('#daily-feedback');
 if(answer==='saturn'){
  awardOnce(key,7,'Daily science challenge');
  if(feedback)feedback.textContent='Correct! Saturn is famous for its bright ring system. You earned 7 stars.';
  $x('#learningDialogBody').querySelectorAll('button').forEach(b=>b.disabled=true);
 }else if(feedback)feedback.textContent='Not quite. Hint: it is a gas giant with a wide, bright ring system. Try again!';
}
function discovery(){
 const s=state();if(!s)return;
 const planets=(window.AstroCadet.PLANETS||[]);const fresh=planets.filter(p=>!(s.extraDiscoveries||[]).includes(p.id));
 if(!fresh.length){notify('You discovered every planet in this bonus log!');return}
 const p=fresh[Math.floor(Math.random()*fresh.length)];s.extraDiscoveries=s.extraDiscoveries||[];s.extraDiscoveries.push(p.id);save();
 awardOnce('discovery-'+p.id,3,p.name+' discovery');
 AstroCadet.UI.showLearningDialog('Planet discovery',`<div class="discovery-card"><span class="discovery-emoji">🪐</span><h3>${safe(p.name)}</h3><p>${safe(p.blurb)}</p><p class="dialog-feedback">You logged this discovery and earned 3 stars.</p></div>`);
}
function puzzle(id,i){
 const p=puzzles.find(x=>x.id===id);if(!p)return;const f=$x('#puzzle-feedback-'+id);
 if(i===p.a){f.textContent=window.AstroLanguage&&AstroLanguage.get()==='ar'?'أحسنت يا محقق العلوم!':'Correct, science detective!';awardOnce('puzzle-'+id,p.stars,p.title);$$x('button',f.parentElement).forEach(b=>b.disabled=true)}
 else f.textContent=window.AstroLanguage&&AstroLanguage.get()==='ar'?'ليس تمامًا. فكّر في الدليل العلمي وحاول مرة أخرى.':'Not quite. Think about the science clue and try again.';
}
function aiAnswer(q){
 const text=String(q||'').toLowerCase().trim();
 const facts=[
  [/\b(hello|hi|hey|good morning|good evening)\b/,'Hello, cadet! 🚀 I’m Astro, your curious space buddy. Ask me about science, space, school topics, or everyday questions. What shall we explore?'],
  [/\b(your name|who are you|what are you)\b/,'I’m Astro, the friendly guide aboard Astro Jr! I can explain ideas, share space facts, help you think through a question, and give you a mini-quiz.'],
  [/\b(gravity|gravitation|weight)\b/,'Gravity is the attraction between objects that have mass. It keeps planets moving around the Sun and keeps us on the ground. The Moon’s surface gravity is about one-sixth of Earth’s.'],
  [/\b(orbit|satellite)\b/,'An orbit is the curved path one object follows around another. A satellite keeps moving forward while gravity continually bends its path, so it keeps falling around Earth instead of straight down.'],
  [/\b(black hole)\b/,'A black hole is a region of space where gravity is so strong that, past its event horizon, even light cannot escape. Scientists study black holes by observing their effects on nearby matter and light.'],
  [/\b(sun|solar energy|sunlight)\b/,'The Sun is a star at the center of our Solar System. It releases energy through nuclear fusion in its core, giving Earth much of the light and warmth needed for life.'],
  [/\b(mars|red planet)\b/,'Mars is a rocky planet often called the Red Planet because iron-rich minerals in its dust have rusted. It has giant volcanoes, polar ice, and evidence that liquid water once flowed on its surface.'],
  [/\b(moon|lunar|moon phases)\b/,'The Moon is Earth’s natural satellite. Its phases happen because, as it orbits Earth, we see different portions of its half-lit side. The Moon does not make its own light; it reflects sunlight.'],
  [/\b(planet|solar system)\b/,'Our Solar System has eight planets: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune. They all orbit the Sun. Pluto is classified as a dwarf planet.'],
  [/\b(rocket|how do rockets work)\b/,'A rocket pushes hot exhaust backward. The exhaust pushes the rocket forward in the opposite direction. That is why rockets can work in space without needing air to push against.'],
  [/\b(star|stars|constellation)\b/,'A star is a huge, glowing ball of hot gas (plasma) that produces energy in its core. Our Sun is the closest star to Earth. Other stars look tiny because they are extremely far away.'],
  [/\b(galaxy|milky way)\b/,'A galaxy is a huge collection of stars, gas, dust, and dark matter held together by gravity. Our Solar System is inside the Milky Way galaxy.'],
  [/\b(comet|asteroid|meteor)\b/,'Asteroids are rocky objects that orbit the Sun. Comets contain ice, dust, and rock and can grow glowing comas and tails near the Sun. A meteor is the streak of light made when a space rock enters an atmosphere.'],
  [/\b(light|rainbow|colour|color)\b/,'Visible white light is made of different colors. A prism can bend the colors by different amounts and spread them into a rainbow.'],
  [/\b(aurora|northern lights)\b/,'Auroras are colorful lights in the sky. They happen when charged particles from space interact with gases in Earth’s upper atmosphere, guided by Earth’s magnetic field.'],
  [/\b(exoplanet)\b/,'An exoplanet is a planet that orbits a star beyond our Solar System. Astronomers often find them by noticing a star dim slightly when a planet passes in front of it.'],
  [/\b(quiz|test me|question me)\b/,'Mini-quiz time, cadet! 🌟 Which planet is famous for its beautiful rings? A) Mars  B) Saturn  C) Mercury. Type A, B, or C and I’ll check your answer.'],
  [/\b(thank you|thanks)\b/,'You’re welcome, cadet! Keep asking questions — curiosity is your superpower. ✨'],
  [/\b(help|explain|how do i learn)\b/,'Absolutely! Tell me the topic and I’ll break it into small, clear steps, give you an example, and check your understanding.']
 ];
 for(const [pattern,answer] of facts){if(pattern.test(text))return answer;}
 if(/\b(what|why|how|when|where|who|can|does|do|is|are|explain|tell me)\b/.test(text)){
  return 'That’s a thoughtful question, cadet! I don’t have a live AI brain connected in this browser-only version, so I may not know the exact answer yet. I can still help you explore it: try adding a little context or splitting it into smaller questions. For open-ended answers on any topic, the team must first approve and connect a secure server-side AI service.';
 }
 return 'I’m listening, cadet! 🚀 I can chat about space and science, help explain a school topic, or make a mini-quiz. For a question outside my built-in guide, Astro needs a secure AI service connected through a backend.';
}
async function askPip(q){
 const log=$x('#pipLog');if(!log)return;
 const row=(who,txt)=>{const d=document.createElement('div');d.className='pip-msg '+who;d.textContent=txt;log.appendChild(d);log.scrollTop=log.scrollHeight};
 row('cadet',q);const s=state();if(s){s.pipAsked=(s.pipAsked||0)+1;save()}
 let answer='';
 // No direct browser-to-AI transfer in the child-facing prototype. A reviewed server proxy is required before enabling AI.
 answer=aiAnswer(q);
 if(window.AstroLanguage && AstroLanguage.get()==='ar') answer=AstroLanguage.translate(answer);
 row('pip',answer);
 if(s&&/quiz me|quick quiz/i.test(q))setTimeout(()=>{
  AstroCadet.UI.showLearningDialog('Astro quick quiz','<p class="dialog-question">Which planet is called the Red Planet?</p><div class="dialog-options"><button class="btn btn-ghost" type="button" onclick="AstroExtra.answerQuickQuiz(\'venus\')">Venus</button><button class="btn btn-ghost" type="button" onclick="AstroExtra.answerQuickQuiz(\'mars\')">Mars</button><button class="btn btn-ghost" type="button" onclick="AstroExtra.answerQuickQuiz(\'jupiter\')">Jupiter</button></div><p id="quick-quiz-feedback" class="dialog-feedback" aria-live="polite">Choose one answer.</p>','<button class="btn btn-ghost btn-sm" type="button" onclick="AstroExtra.closeLearningDialog()">Close</button>');
 },50);
}
function answerQuickQuiz(answer){
 const feedback=$x('#quick-quiz-feedback');
 if(answer==='mars'){
  const paid=awardOnce('pip-quiz-'+new Date().toISOString().slice(0,10),3,'Astro quick quiz');
  if(feedback)feedback.textContent=paid?'Correct! Mars is called the Red Planet. You earned 3 stars.':'Correct! Mars is called the Red Planet. This quiz reward has already been claimed today.';
  $x('#learningDialogBody').querySelectorAll('button').forEach(b=>b.disabled=true);
 }else if(feedback)feedback.textContent='Not quite. Think about the planet whose rusty iron-rich surface gives it a reddish colour.';
}
function initPip(){
 const form=$x('#pipForm');if(!form||form.dataset.extraBound)return;form.dataset.extraBound='1';
 form.addEventListener('submit',e=>{e.preventDefault();const i=$x('#pipInput');const q=i.value.trim();if(q){i.value='';askPip(q)}});
}
let game=null;
function openLunarRescue(){
 const overlay=$x('#missionOverlay');$x('#missionKicker').textContent='MISSION 07 · SPECIAL SIMULATOR';$x('#missionTitle').textContent='Lunar Rescue';
 $x('#lessonDots').innerHTML='';
 const body=$x('#missionBody');$x('#missionFoot').innerHTML='<button class="btn btn-ghost" onclick="app.closeMission()">Close simulator</button><button class="btn btn-primary" onclick="AstroExtra.startLander()">↻ Restart flight</button>';
 body.innerHTML=`<div class="mission-briefing lunar-briefing"><span class="pill amber">Landing & precision</span><h3>Mission objective</h3><p class="mission-objective">Bring the rescue lander down safely. Use short engine burns to reduce speed, keep fuel for the final approach, and touch down below 3.2 m/s inside the landing zone.</p><div class="briefing-steps"><div><b>1 · Read the instruments</b><span>Watch altitude, speed and remaining fuel.</span></div><div><b>2 · Control the descent</b><span>Use short engine burns and small steering adjustments.</span></div><div><b>3 · Check the landing</b><span>Touch down slowly and stay inside the marked pad.</span></div></div><p class="resume-note">Your simulator checkpoint is saved locally while you fly. The simulator starts below.</p></div><div class="extra-hero"><h2>🌕 Lunar Rescue</h2><p>Use the controls or keyboard to guide the lander. On mobile, tap the controls.</p><label for="lander-difficulty">Difficulty</label> <select id="lander-difficulty" class="extra-btn" onchange="AstroExtra.startLander()"><option value="easy">Cadet · gentle gravity</option><option value="normal" selected>Pilot · balanced</option><option value="expert">Commander · tight fuel</option></select></div><div class="game-hud"><div class="game-meter">ALTITUDE<b id="lander-alt">1200 m</b></div><div class="game-meter">SPEED<b id="lander-speed">18 m/s</b></div><div class="game-meter">FUEL<b id="lander-fuel">100%</b></div></div><div class="lander-stage" id="lander-stage"><div style="position:absolute;top:12px;left:12px;color:#b9d7ff">MISSION CONTROL · MOON</div><div class="lander-ship" id="lander-ship" style="top:22px">🚀<div class="lander-flame" id="lander-flame">🔥</div></div><div class="lander-moon"></div><div id="lander-pad" style="position:absolute;bottom:44px;left:43%;width:14%;height:5px;background:#5ff0b6;box-shadow:0 0 12px #5ff0b6"></div></div><p id="lander-message" aria-live="polite">Astro: Short burns are safer than waiting until the last second.</p><div class="lander-controls"><button class="extra-btn" onclick="AstroExtra.burn(-1)">↖ LEFT</button><button class="extra-btn" onclick="AstroExtra.burn(1)">🔥 BURN</button><button class="extra-btn" onclick="AstroExtra.burn(0)">RIGHT ↗</button></div><p><small>Keyboard: Space = burn, ← / → = steer. On mobile, tap the controls.</small></p>`;
 overlay.classList.add('is-open');overlay.setAttribute('aria-hidden','false');startLander(true);
}
function saveLanderCheckpoint(){
 const s=state();if(!s||!game||game.done)return;
 s.missionCheckpoint={stageId:7,phase:'lunar-sim',game:{alt:game.alt,speed:game.speed,fuel:game.fuel,x:game.x,thrust:game.thrust,gravity:game.gravity,diff:game.diff,bonus:game.bonus}};
 save();game.lastSaved=Date.now();
}
function startLander(allowResume){
 if(game&&game.timer)clearInterval(game.timer);
 const saved=state()&&state().missionCheckpoint;
 const diff=$x('#lander-difficulty')?.value||'normal';
 if(allowResume&&saved&&saved.stageId===7&&saved.phase==='lunar-sim'&&saved.game){
  game={...saved.game,done:false,timer:null,lastSaved:Date.now()};
  const difficulty=$x('#lander-difficulty');if(difficulty) difficulty.value=game.diff||'normal';
  notify('Lunar Rescue checkpoint restored. Continue your descent.');
 }else{
  game={alt:1200,speed:diff==='easy'?13:diff==='expert'?24:18,fuel:diff==='easy'?100:diff==='expert'?72:86,x:50,thrust:diff==='easy'?3:diff==='expert'?1.7:2.4,gravity:diff==='easy'?.45:diff==='expert'?.9:.65,done:false,diff,timer:null,bonus:false,lastSaved:Date.now()};
  const s=state();if(s&&s.missionCheckpoint&&s.missionCheckpoint.stageId===7){s.missionCheckpoint=null;save();}
 }
 updateGame();game.timer=setInterval(tick,350);
}
function updateGame(){
 if(!game)return;
 const a=$x('#lander-alt'),s=$x('#lander-speed'),f=$x('#lander-fuel'),ship=$x('#lander-ship');if(!a||!ship)return;
 a.textContent=Math.max(0,Math.round(game.alt))+' m';s.textContent=Math.max(0,game.speed).toFixed(1)+' m/s';f.textContent=Math.round(game.fuel)+'%';
 ship.style.top=(18+(1-game.alt/1200)*185)+'px';ship.style.left=game.x+'%';
 const msg=$x('#lander-message');if(msg&&game.fuel<20)msg.textContent='Astro: Fuel is low! Use small burns and aim for a gentle touchdown.';
}
function tick(){
 if(!game||game.done)return;
 game.speed=Math.max(0,game.speed+game.gravity);game.alt-=game.speed*0.35;
 if(game.alt<=0){
  game.alt=0;game.done=true;clearInterval(game.timer);
  const s=state();if(s&&s.missionCheckpoint&&s.missionCheckpoint.stageId===7){s.missionCheckpoint=null;save();}
  const safe=game.speed<=3.2&&game.fuel>=0&&game.x>30&&game.x<70;
  const msg=$x('#lander-message');
  if(safe){
   msg.textContent='🌟 Touchdown! Rescue team is safe. '+(game.fuel>=20?'Bonus objective complete: 20% fuel remaining!':'Safe landing medal earned!');
   awardOnce('lunar-rescue-'+game.diff,game.diff==='expert'?18:game.diff==='normal'?15:12,'Lunar Rescue');
   awardOnce('lunar-medal-'+game.diff,0,'Lunar Rescue medal');
   if(game.fuel>=20)awardOnce('lunar-bonus-'+game.diff,5,'Fuel saver bonus');

   // Mission 7 uses the same canonical completion path as the standard missions.
   // Award.completeStage is idempotent: first success records the mission and
   // pays its one-time completion bonus; later successful replays pay no bonus.
   const cadet=window.AstroCadet;
   const mission7=cadet&&cadet.STAGES&&cadet.STAGES.find(stage=>stage.id===7);
   if(cadet&&mission7&&cadet.Award){
    const completion=cadet.Award.completeStage(mission7);
    if(cadet.UI){
     cadet.UI.syncHUD();
     cadet.UI.renderMissions();
     if(!completion.already){
      cadet.UI.toast('Mission 7 completed — Mission 8 unlocked!','mint');
      if(cadet.Trophies&&typeof cadet.Trophies.check==='function')cadet.Trophies.check(false);
      if(cadet.UI.confetti)cadet.UI.confetti();
     }else{
      cadet.UI.toast('Safe landing! Mission 7 was already completed.','mint');
     }
    }
   }
  }
  else msg.textContent='Astro: The landing was too rough or off the pad. Restart and burn earlier in short bursts.';
  return;
 }
 updateGame();
 if(game&&Date.now()-(game.lastSaved||0)>2100)saveLanderCheckpoint();
}
function burn(dir){
 if(!game||game.done)return;
 if(dir===0){game.x=Math.min(82,game.x+4);game.bonus=true;saveLanderCheckpoint();return}
 if(dir===-1){game.x=Math.max(18,game.x-4);game.bonus=true;saveLanderCheckpoint();return}
 if(game.fuel<=0){$x('#lander-message').textContent='Astro: No fuel left. Restart and use shorter burns.';return}
 game.fuel=Math.max(0,game.fuel-7);game.speed=Math.max(0,game.speed-game.thrust*2.8);
 $x('#lander-flame').style.display='block';setTimeout(()=>{const flame=$x('#lander-flame');if(flame)flame.style.display='none'},180);
 updateGame();saveLanderCheckpoint();
}
function keyGame(e){if(!$x('#missionOverlay')?.classList.contains('is-open')||!game)return;if(e.code==='Space'){e.preventDefault();burn(1)}else if(e.key==='ArrowLeft')burn(-1);else if(e.key==='ArrowRight')burn(0)}
function missionOverride(){
 if(!window.app||!window.AstroCadet)return;
 const original=app.openMission.bind(app);
 app.openMission=function(id){if(Number(id)===7){if(window.Pip&&Pip.toggle)Pip.toggle(false);openLunarRescue();return}original(id)};
 const oldClose=app.closeMission.bind(app);
 app.closeMission=function(){if(game&&game.timer){saveLanderCheckpoint();clearInterval(game.timer)}game=null;oldClose()};
}

function renderContact(){
 const el=$x('#extra-contact');if(!el||el.dataset.rendered)return;
 el.dataset.rendered='1';
 el.innerHTML=`<div class="extra-hero"><div>✉️ MISSION CONTROL</div><h2>Contact Us</h2><p>For questions or support, please ask a parent, guardian, or teacher to contact the team.</p></div>
 <div class="extra-card"><h3>Adult-supervised support</h3><p>This demo does not collect or send messages from children through an external form.</p><a href="mailto:astronautjr.space@gmail.com">Contact the Astronaut Jr team</a></div>`;
}
/* ---------- Media fallback: preserve layout when a local or remote image fails ---------- */
if (!window.__astroMediaFallbackBound) {
 document.addEventListener('error', event => {
  const img = event.target;
  if (!(img instanceof HTMLImageElement) || img.dataset.fallbackShown) return;
  img.dataset.fallbackShown = '1';
  const fallback = document.createElement('span');
  fallback.className = 'media-fallback';
  fallback.setAttribute('role', 'img');
  fallback.setAttribute('aria-label', img.alt || 'Image unavailable');
  fallback.textContent = '🪐';
  img.hidden = true;
  img.insertAdjacentElement('afterend', fallback);
  if (img.parentElement) img.parentElement.classList.add('has-media-fallback');
 }, true);
 window.__astroMediaFallbackBound = true;
}

/* ---------- About Us: photo-led native webpage (PDF viewer removed) ---------- */
function renderAbout(){
 const el=$x('#extra-about');
 if(!el||el.dataset.rendered)return;
 el.dataset.rendered='1';
 el.innerHTML=`
  <div class="about-page">
   <section class="about-hero" aria-labelledby="aboutHeroTitle">
    <div class="about-hero-copy">
     <span class="about-eyebrow">🚀 A GAMIFIED SPACE ACADEMY</span>
     <h1 id="aboutHeroTitle">Explore space.<br><span>Build the future.</span></h1>
     <p>Gamified Space Academy for the Next Generation</p>
     <div class="about-hero-actions">
      <a class="about-primary-link" href="#about-mission">Discover our mission <span aria-hidden="true">↓</span></a>
      <button class="about-secondary-link" type="button" data-about-go="missions">Explore the prototype ↗</button>
     </div>
    </div>
    <div class="about-hero-image-wrap">
     <img class="about-hero-image" src="./astronaut-jr-about-assets/hero-astronaut.webp" alt="A young astronaut looking toward Earth from space" fetchpriority="high" decoding="async" width="920" height="650">
     <span class="about-image-orbit" aria-hidden="true"></span>
    </div>
    <div class="about-hero-foot"><span>HURGHADA HACKATHON</span><span>CURIOUS MINDS · BOLD MISSIONS · BIG DREAMS</span></div>
   </section>

   <nav class="about-anchor-nav" aria-label="About page sections">
    <a href="#about-challenge">The challenge</a>
    <a href="#about-mission">Our mission</a>
    <a href="#about-team">The team</a>
    <a href="#about-prototype">The prototype</a>
    <a href="#about-future">The future</a>
   </nav>

   <section class="about-story-grid" id="about-challenge">
    <div class="about-story-image about-image-frame">
     <img src="./astronaut-jr-about-assets/planetarium-child.webp" alt="A young learner looking through a telescope beneath the night sky" loading="lazy" decoding="async" width="1018" height="933">
     <span class="about-image-tag">THE PROBLEM WE WANT TO SOLVE</span>
    </div>
    <div class="about-story-copy">
     <span class="about-kicker">01 / THE CHALLENGE</span>
     <h2>Space should feel <span>within reach.</span></h2>
     <p>Planetariums, telescopes and hands-on science experiences can spark a lifelong interest in space. But access to these experiences depends on location, availability and resources.</p>
     <p>We want to bring more of that curiosity into a digital learning experience that children can explore from school or home.</p>
     <div class="about-highlight-line"><span>Our question:</span> How can we make astronomy easier and more exciting to explore?</div>
    </div>
   </section>

   <section class="about-mission-section" id="about-mission">
    <div class="about-mission-copy">
     <span class="about-kicker">02 / OUR MISSION</span>
     <h2>Make space science an <span>interactive academy</span> for every young learner.</h2>
     <p>Astronaut Jr turns astronomy topics into a guided journey. Learners read short explanations, try activities, answer questions and keep progressing as they discover the universe.</p>
     <div class="about-mission-points">
      <div><b>Learn</b><span>Clear, age-aware explanations.</span></div>
      <div><b>Explore</b><span>Planets, missions and simulations.</span></div>
      <div><b>Progress</b><span>Quizzes, stars and achievements.</span></div>
     </div>
    </div>
    <div class="about-mission-image about-image-frame">
     <img src="./astronaut-jr-about-assets/mission-telescope.webp" alt="A young explorer observing the night sky through a telescope" loading="lazy" decoding="async" width="445" height="578">
     <div class="about-image-caption">Curiosity is the beginning of discovery.</div>
    </div>
   </section>

   <section class="about-trajectory-section">
    <div class="about-section-heading">
     <span class="about-kicker">03 / OUR JOURNEY</span>
     <h2>From a local challenge to a <span>learning experience.</span></h2>
     <p>Our project follows three connected steps: understand the gap, demonstrate a working prototype, and plan how the idea could grow.</p>
    </div>
    <div class="about-trajectory-layout">
     <div class="about-trajectory-image about-image-frame">
      <img src="./astronaut-jr-about-assets/launch-roadmap.webp" alt="A young astronaut watching a rocket launch above Earth" loading="lazy" decoding="async" width="888" height="858">
     </div>
     <div class="about-trajectory-list">
      <article class="about-trajectory-item"><span>01</span><div><h3>The local gap</h3><p>Understand how students currently access astronomy learning and what makes it difficult.</p></div></article>
      <article class="about-trajectory-item"><span>02</span><div><h3>The live prototype</h3><p>Show how missions, planet files and character rewards make learning interactive.</p></div></article>
      <article class="about-trajectory-item"><span>03</span><div><h3>Technology and scaling</h3><p>Improve the platform, validate it with learners and explore future school partnerships.</p></div></article>
     </div>
    </div>
   </section>

   <section class="about-team-section" id="about-team">
    <div class="about-section-heading">
     <span class="about-kicker">04 / MEET THE FLIGHT CREW</span>
     <h2>Four students. <span>One mission.</span></h2>
     <p>The team behind Astronaut Jr.</p>
    </div>
    <div class="about-team-grid">
     <article class="about-member-card"><div class="about-member-photo"><img src="./astronaut-jr-about-assets/team-omar.webp" alt="Omar Hassan in an astronaut suit" loading="lazy" decoding="async" width="315" height="365"></div><h3>Omar Hassan</h3><span>Leader</span></article>
     <article class="about-member-card"><div class="about-member-photo"><img src="./astronaut-jr-about-assets/team-philopateer.webp" alt="Philopateer Hanna in an astronaut suit" loading="lazy" decoding="async" width="330" height="365"></div><h3>Philopateer Hanna</h3><span>Manager</span></article>
     <article class="about-member-card"><div class="about-member-photo"><img src="./astronaut-jr-about-assets/team-ziad.webp" alt="Ziad Waleed in an astronaut suit" loading="lazy" decoding="async" width="360" height="375"></div><h3>Ziad Waleed</h3><span>Designer</span></article>
     <article class="about-member-card"><div class="about-member-photo"><img src="./astronaut-jr-about-assets/team-samer.webp" alt="Samer Samir in an astronaut suit" loading="lazy" decoding="async" width="355" height="370"></div><h3>Samer Samir</h3><span>Researcher</span></article>
    </div>
   </section>

   <section class="about-creator-video" id="about-creator">
    <div class="about-creator-copy">
     <span class="about-kicker">MEET THE CREATOR</span>
     <h2>A message from <span>the creator.</span></h2>
     <p>Discover the idea behind Astronaut Jr and the journey that brought this space-learning experience to life.</p>
    </div>
    <div class="about-creator-player">
     <video controls playsinline preload="metadata" poster="./astronaut-jr-about-assets/hero-astronaut.webp" aria-label="Creator introduction video">
      <source src="./assets/creator-intro.mp4" type="video/mp4">
      Your browser does not support the video element.
     </video>
     <span class="about-video-file-hint">Video file: <code>assets/creator-intro.mp4</code></span>
    </div>
   </section>

   <section class="about-prototype-section" id="about-prototype">
    <div class="about-section-heading">
     <span class="about-kicker">05 / PROTOTYPE SHOWCASE</span>
     <h2>Learning becomes a <span>space mission.</span></h2>
     <p>These are the three core areas learners can explore in the current prototype.</p>
    </div>
    <div class="about-feature-grid">
     <article class="about-feature-card"><div class="about-feature-icon" aria-hidden="true">🚀</div><span class="about-feature-index">01</span><h3>Training Missions</h3><p>Short lessons, hands-on activities and quizzes guide learners through astronaut-themed topics.</p><button type="button" data-about-go="missions">Open missions ↗</button></article>
     <article class="about-feature-card"><div class="about-feature-icon" aria-hidden="true">🪐</div><span class="about-feature-index">02</span><h3>Planet Files</h3><p>Explore the Sun and the eight planets through facts, comparisons and planet information.</p><button type="button" data-about-go="planets">Explore planets ↗</button></article>
     <article class="about-feature-card"><div class="about-feature-icon" aria-hidden="true">🧑‍🚀</div><span class="about-feature-index">03</span><h3>Character Shop</h3><p>Earn stars through learning and use them to unlock and equip cadet customization items.</p><button type="button" data-about-go="cadet">Visit the wardrobe ↗</button></article>
    </div>
   </section>

   <section class="about-solution-section">
    <div class="about-solution-copy">
     <span class="about-kicker">06 / WHY THIS APPROACH</span>
     <h2>From passive reading to <span>active discovery.</span></h2>
     <p>Our goal is not to replace teachers or textbooks. Astronaut Jr is designed as an additional way to practise concepts, explore visual explanations and receive feedback while learning.</p>
     <ul><li>Interactive missions instead of reading alone.</li><li>Simplified explanations alongside visual learning resources.</li><li>Progress and rewards that encourage learners to keep exploring.</li></ul>
    </div>
    <div class="about-solution-image about-image-frame">
     <img src="./astronaut-jr-about-assets/solutions-learning.webp" alt="A child using an astronomy learning experience on a laptop" loading="lazy" decoding="async" width="635" height="365">
    </div>
   </section>

   <section class="about-tech-section">
    <div class="about-section-heading">
     <span class="about-kicker">07 / TECHNOLOGY</span>
     <h2>The tools behind <span>the experience.</span></h2>
     <p>We distinguish what is present in the prototype from capabilities we want to develop next.</p>
    </div>
    <div class="about-tech-grid">
     <article class="about-tech-card"><img src="./astronaut-jr-about-assets/tech-ai.webp" alt="Abstract artificial intelligence illustration" loading="lazy" decoding="async" width="480" height="335"><div><span class="about-tech-status">CURRENT PROTOTYPE</span><h3>Astro learning guide</h3><p>The current assistant includes built-in space and science responses, with an optional endpoint for a future connected AI service.</p></div></article>
     <article class="about-tech-card"><img src="./astronaut-jr-about-assets/tech-nasa.webp" alt="Mars rover exploring the surface of Mars" loading="lazy" decoding="async" width="450" height="335"><div><span class="about-tech-status">EDUCATIONAL RESOURCES</span><h3>NASA learning content</h3><p>The prototype links to NASA Space Place learning videos. Direct live-data API integration is a future development task.</p></div></article>
     <article class="about-tech-card"><img src="./astronaut-jr-about-assets/tech-responsive.webp" alt="Astronomy content displayed on multiple digital devices" loading="lazy" decoding="async" width="308" height="335"><div><span class="about-tech-status">CURRENT FRONTEND</span><h3>Responsive web interface</h3><p>Built with HTML, CSS and JavaScript, with responsive layouts intended for desktop, tablet and mobile screens.</p></div></article>
    </div>
   </section>

   <section class="about-future-section" id="about-future">
    <div class="about-future-image about-image-frame"><img src="./astronaut-jr-about-assets/future-learning.webp" alt="A young learner exploring astronomy on an interactive display" loading="lazy" decoding="async" width="907" height="778"></div>
    <div class="about-future-copy">
     <span class="about-kicker">08 / POST-HACKATHON VISION</span>
     <h2>Start local. <span>Grow through learning.</span></h2>
     <p>These are proposed next steps. They depend on school partnerships, technical readiness, resources and feedback from learners and teachers.</p>
     <div class="about-future-step"><b>01</b><div><h3>Validate with schools in Hurghada</h3><p>Begin with a small supervised pilot, then work toward the proposed five-school pilot.</p></div></div>
     <div class="about-future-step"><b>02</b><div><h3>Explore science-center kiosks</h3><p>Assess touchscreen access in science centers and youth hubs.</p></div></div>
     <div class="about-future-step"><b>03</b><div><h3>Develop classroom missions</h3><p>Explore group activities and a model that could be adapted for more schools.</p></div></div>
    </div>
   </section>

   <section class="about-cta-section">
    <div class="about-cta-image"><img src="./astronaut-jr-about-assets/hero-astronaut.webp" alt="Young astronaut looking toward Earth" loading="lazy" decoding="async" width="920" height="650"></div>
    <div class="about-cta-copy"><span class="about-kicker">YOUR NEXT DISCOVERY STARTS HERE</span><h2>Ready for <span>launch?</span></h2><p>Join the academy and start exploring the universe, one mission at a time.</p><button type="button" class="about-cta-button" data-about-go="missions">Start exploring 🚀</button></div>
   </section>
  </div>`;

 el.addEventListener('click',e=>{
  const action=e.target.closest('[data-about-go]');
  if(!action)return;
  const view=action.dataset.aboutGo;
  // Leave the added About view before routing to one of the original app views.
  document.querySelectorAll('.extra-view').forEach(panel=>panel.classList.remove('active'));
  document.querySelectorAll('.tabs .tab').forEach(tab=>tab.classList.toggle('is-active',tab.dataset.view===view));
  if(window.app&&typeof app.go==='function')app.go(view);
 });
}
function install(){
 if(!window.AstroCadet||!window.app){setTimeout(install,60);return}
 addTab('🎬 AstroCinema','cinema');addTab('🧪 Training Lab','lab');addTab('✉️ Contact Us','contact');addTab('ℹ️ About Us','about');
 addView('cinema');addView('lab');addView('contact');addView('about');renderContact();renderAbout();
 initPip();missionOverride();
 const s=state();if(s){s.version=4;s.extraRewards=s.extraRewards||{};save()}
 // Astro can be opened by existing UI; bind capture so this enhanced tutor owns new questions.
 const form=$x('#pipForm');if(form&&!form.dataset.extraCapture){form.dataset.extraCapture='1';form.addEventListener('submit',e=>{e.preventDefault();e.stopImmediatePropagation();const i=$x('#pipInput');const q=i.value.trim();if(q){i.value='';askPip(q)}},true)}
 document.addEventListener('keydown',keyGame);
 // Switching back to any original section hides the added screens.
 const nav=$x('.tabs'); if(nav) nav.addEventListener('click',e=>{const b=e.target.closest('[data-view]');if(b){$$x('.extra-view').forEach(v=>v.classList.remove('active'));$$x('.tabs .tab').forEach(t=>t.classList.toggle('is-active',t===b));}});
}
window.AstroExtra={showExtra,renderCinema,renderLab,renderContact,renderAbout,quizVideo,answerVideo,playCinema,filterCinema,categoryCinema,audienceCinema,daily,answerDaily,discovery,puzzle,askPip,answerQuickQuiz,closeLearningDialog:()=>AstroCadet.UI.closeLearningDialog(),startLander,burn,openGlobalSim,simulateGravity,simulateThrust,simulateSpeed,simulatePanels,simulatePhase};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(install,0));else setTimeout(install,0);
})();

;
