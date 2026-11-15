import { $, storageGet, storageSet, storageRemove } from "../utils.js";

/* ============================================================
   AUTH — local cadet accounts (saved on this device)
   Each account gets its own save slot, so several cadets can
   share one device without mixing up their progress.
   ============================================================ */
(function(){
"use strict";
var USERS_KEY="astrocadet.auth.users", SESSION_KEY="astrocadet.auth.session", GUEST="__guest__";
var BASE_SAVE="astrocadet.v3.save";
// LOCAL DEMO AUTH ONLY. Production identity and roles must come from Supabase Auth + server checks.


function storageOK(){try{var k="__astro_t";localStorage.setItem(k,"1");localStorage.removeItem(k);return true}catch(e){return false}}
function readUsers(){try{var u=JSON.parse(storageGet(localStorage,USERS_KEY)||"{}");return u&&typeof u==="object"?u:{}}catch(e){return {}}}
function writeUsers(u){return storageSet(localStorage,USERS_KEY,JSON.stringify(u))}

function getSession(){
  var raw=storageGet(localStorage,SESSION_KEY)||storageGet(sessionStorage,SESSION_KEY);
  if(!raw)return null;
  try{
    var s=JSON.parse(raw);
    if(!s||!s.user)return null;
    if(s.user===GUEST)return s;
    return readUsers()[s.user]?s:null;
  }catch(e){return null}
}
function setSession(user,remember){
  storageRemove(localStorage,SESSION_KEY);storageRemove(sessionStorage,SESSION_KEY);
  var val=JSON.stringify({user:user,remember:!!remember});
  storageSet(remember?localStorage:sessionStorage,SESSION_KEY,val);
}
function clearSession(){storageRemove(localStorage,SESSION_KEY);storageRemove(sessionStorage,SESSION_KEY)}

/* ---- password hashing (PBKDF2 where available) ---- */
function hex(buf){return Array.prototype.map.call(new Uint8Array(buf),function(b){return("0"+b.toString(16)).slice(-2)}).join("")}
function randomSalt(){
  if(!window.crypto||!crypto.getRandomValues)throw new Error("Secure randomness unavailable");
  var a=new Uint8Array(16);crypto.getRandomValues(a);return hex(a.buffer);
}
function hashPw(pw,salt){
  if(!window.crypto||!crypto.subtle||!window.TextEncoder)return Promise.reject(new Error("Secure password hashing unavailable"));
  var enc=new TextEncoder();
  return crypto.subtle.importKey("raw",enc.encode(pw),"PBKDF2",false,["deriveBits"]).then(function(key){
    return crypto.subtle.deriveBits({name:"PBKDF2",salt:enc.encode(salt),iterations:100000,hash:"SHA-256"},key,256);
  }).then(function(bits){return "p1:"+hex(bits)});
}

/* ---- public pieces the app needs BEFORE it boots ---- */
var Auth={
  saveKey:function(){
    var s=getSession();
    return(s&&s.user!==GUEST)?BASE_SAVE+".u."+s.user:BASE_SAVE;
  },
  ready:function(){return !storageOK()||!!getSession()},
  show:function(){
    var intro=document.getElementById("welcomeIntro");
    document.body.classList.add("is-locked");
    if(intro){syncWelcomeLanguage();intro.hidden=false;intro.classList.add("is-visible");return;}
    showLogin();
  },
  afterInit:function(){
    var s=getSession(),who=document.getElementById("authWho"),out=document.getElementById("btnSignOut");
    var user=s&&s.user!==GUEST?readUsers()[s.user]:null;
    if(who)who.textContent=user?user.display+(isAdmin(user)?" · Admin":""):"Guest (this device)";
    if(out)out.textContent=user?"Sign out":"Sign in";
    mountTabs(user);
    var name=document.getElementById("cadetName");
    if(user&&name&&!name.value&&document.getElementById("setupModal").classList.contains("is-open"))name.value=user.display.slice(0,18);
  }
};
window.AstroAuth=Auth;

/* ---- screen logic ---- */
function syncWelcomeLanguage(){
  var intro=document.getElementById("welcomeIntro");if(!intro)return;
  var lang="en";try{lang=localStorage.getItem("aj-lang")==="ar"?"ar":"en"}catch(e){}
  intro.dir=lang==="ar"?"rtl":"ltr";
  intro.querySelectorAll("[data-welcome-en][data-welcome-ar]").forEach(function(node){node.textContent=node.getAttribute("data-welcome-"+lang)});
  intro.querySelectorAll(".welcome-langs [data-lang]").forEach(function(btn){var active=btn.dataset.lang===lang;btn.classList.toggle("on",active);btn.setAttribute("aria-pressed",String(active))});
}
function showLogin(){
  var intro=document.getElementById("welcomeIntro");
  if(intro){intro.classList.remove("is-visible");intro.hidden=true;}
  var el=document.getElementById("authScreen");
  if(!el)return;
  el.classList.add("is-open");document.body.classList.add("is-locked");
  stars();
  setTimeout(function(){var u=document.getElementById("authUser");if(u)u.focus({preventScroll:true})},120);
}
var mode="signin",busy=false,fails=0,lockUntil=0;


function setMode(m){
  mode=m;var up=m==="signup";
  $("#tabSignin").setAttribute("aria-selected",String(!up));
  $("#tabSignup").setAttribute("aria-selected",String(up));
  $("#authTitle").textContent=up?"Join the Academy!":"Welcome back, cadet!";
  $("#authLead").textContent=up?"Create a local demo username. Do not use a real password.":"Local demo accounts only. Do not use a real password or personal email.";
  $("#authConfirmWrap").hidden=!up;
  $("#authUserLabel").textContent="Username";
  $("#authUser").placeholder=up?"e.g. nova_42":"Your demo username";
  $("#authMeter").hidden=!up;
  $("#authPass").autocomplete=up?"new-password":"current-password";
  $("#authSubmit").textContent=up?"Create my account ✨":"Sign in 🚀";
  $("#authRemember").checked=true;
  $("#authError").textContent="";
  if(up)meter($("#authPass").value);
}
function meter(v){
  var sc=0;
  if(v.length>=6)sc++;
  if(v.length>=10)sc++;
  if(/[a-z]/.test(v)&&/[A-Z]/.test(v)||/\d/.test(v)&&/[a-z]/i.test(v))sc++;
  if(/[^A-Za-z0-9]/.test(v)&&v.length>=8)sc++;
  if(!v)sc=0;
  $("#authMeter").setAttribute("data-s",String(sc));
  $("#authMeterText").textContent=!v?"":["Too short","Okay","Good","Strong","Stellar!"][Math.min(sc,4)]||"";
}
function fail(msg,focusId){
  $("#authError").textContent=msg;
  var c=$("#authCard");c.classList.remove("shake");void c.offsetWidth;c.classList.add("shake");
  if(focusId)$("#"+focusId).focus();
}
function go(user,remember){setSession(user,remember);location.reload()}

function submit(e){
  e.preventDefault();
  if(busy)return;
  var err=$("#authError");err.textContent="";
  var raw=$("#authUser").value.trim(),key=raw.toLowerCase(),pw=$("#authPass").value;
  if(!storageOK()){fail("This browser is blocking saving, so accounts can’t be used here.");return}
  if(!/^[a-z0-9_-]{3,16}$/.test(key)){fail("Usernames use 3–16 letters, numbers, _ or -.","authUser");return}
  if(!pw){fail("Type your secret code.","authPass");return}
  var users=readUsers();
  busy=true;$("#authSubmit").disabled=true;

  if(mode==="signup"){
    if(users[key]){busy=false;$("#authSubmit").disabled=false;fail("That username is taken. Try another one!","authUser");return}
    // Local demo accounts use a pseudonymous username; no email is collected.
    if(pw.length<6){busy=false;$("#authSubmit").disabled=false;fail("Secret codes need at least 6 characters.","authPass");return}
    if(pw!==$("#authPass2").value){busy=false;$("#authSubmit").disabled=false;fail("The two secret codes don’t match.","authPass2");return}
    var salt=randomSalt();
    hashPw(pw,salt).then(function(h){
      users[key]={display:raw,role:"player",salt:salt,hash:h,created:Date.now()};
      if(!writeUsers(users))throw new Error("save");
      go(key,$("#authRemember").checked);
    }).catch(function(){busy=false;$("#authSubmit").disabled=false;fail("Couldn’t create the account. Please try again.")});
    return;
  }

  /* sign in */
  var now=Date.now();
  if(now<lockUntil){busy=false;$("#authSubmit").disabled=false;fail("Too many tries. Wait "+Math.ceil((lockUntil-now)/1000)+"s and try again.");return}
  var u=users[key];
  var check=u?hashPw(pw,u.salt).then(function(h){return h===u.hash}):hashPw(pw,"x").then(function(){return false});
  check.then(function(ok){
    if(ok){go(key,$("#authRemember").checked);return}
    fails++;busy=false;$("#authSubmit").disabled=false;
    if(fails>=5){lockUntil=Date.now()+15000;fails=0;fail("Too many tries. Wait 15s and try again.")}
    else fail(u?"Wrong username or secret code.":"No account with that name on this device yet. Tap “Create account” to make one.","authUser");
  }).catch(function(){busy=false;$("#authSubmit").disabled=false;fail("Something went wrong. Please try again.")});
}

/* Authentication event reporting is intentionally disabled. Do not send login,
   failed-login, signup, or signout events to third-party endpoints from the browser. */
function unseenCount(){return 0}
function markSeen(){}
var adminTabBtn=null;
function badge(){}
function adminAlert(){}

/* ---- leaderboard + admin ---- */
function isAdmin(u){
  // Local browser state must never grant an administrator role.
  return false;
}
function currentUser(){var s=getSession();return s&&s.user!==GUEST?s.user:null}
function esc(v){return String(v).replace(/[&<>"']/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})}
function readSave(key){try{return JSON.parse(storageGet(localStorage,BASE_SAVE+".u."+key)||"null")||{}}catch(e){return {}}}
function localEntries(withHidden){
  var users=readUsers();
  return Object.keys(users).map(function(k){
    var u=users[k],s=readSave(k);
    return{id:k,name:String(s.name||u.display||k).slice(0,18),stars:+s.earnedTotal||0,missions:(s.completed||[]).length,
      trophies:(s.achievements||[]).length,hidden:!!u.hidden,created:u.created||0};
  }).filter(function(e){return withHidden||!e.hidden});
}
function sortEntries(list,metric){
  return list.slice().sort(function(a,b){
    var d=metric==="missions"?(b.missions-a.missions)||(b.stars-a.stars):(b.stars-a.stars)||(b.missions-a.missions);
    return d||(a.created-b.created)||a.name.localeCompare(b.name);
  });
}

var lbMetric="stars";
function renderLB(){
  var el=document.getElementById("extra-leaderboard");if(!el)return;
  var me=currentUser(),all=localEntries(true),mine=all.filter(function(e){return e.id===me})[0];
  paint(sortEntries(all.filter(function(e){return !e.hidden}),lbMetric),false);

  function val(e){return lbMetric==="missions"?e.missions+" missions":e.stars.toLocaleString()+" ★"}
  function sub(e){return lbMetric==="missions"?e.stars.toLocaleString()+" stars":e.missions+" missions · "+e.trophies+" trophies"}
  function paint(list,online){
    var top=list.slice(0,3),rest=list.slice(3,50),medals=["🥇","🥈","🥉"];
    var idx=-1;list.forEach(function(e,i){if(e.id===me)idx=i});
    var meLine;
    if(!me)meLine="Sign in to put your name on the board. Guests don’t appear here.";
    else if(mine&&mine.hidden)meLine="An admin has hidden your name from the board.";
    else if(idx>-1)meLine="You are #"+(idx+1)+" of "+list.length+" · "+val(list[idx]);
    else meLine="Complete a mission to climb the board!";
    var html='<div class="extra-hero"><h2>🏅 Leaderboard</h2><p>'+(online?"Cadets from everywhere, ranked live.":"Top cadets on this device.")+'</p>'+
      '<div class="lb-tools"><button class="extra-btn" data-metric="stars" aria-pressed="'+(lbMetric==="stars")+'">★ Stars earned</button>'+
      '<button class="extra-btn" data-metric="missions" aria-pressed="'+(lbMetric==="missions")+'">🚀 Missions</button>'+
      '<button class="extra-btn" data-refresh="1">↻ Refresh</button></div></div>'+
      '<p class="lb-me">'+esc(meLine)+'</p>';
    if(!list.length)html+='<div class="lb-empty">No cadets yet. Create an account and be the first on the board!</div>';
    else{
      html+='<div class="lb-podium">'+top.map(function(e,i){
        return'<div class="lb-pod p'+(i+1)+(e.id===me?' me':'')+'"><div class="lb-medal">'+medals[i]+'</div><div class="lb-name">'+esc(e.name)+(e.id===me?' (you)':'')+'</div><div class="lb-score">'+esc(val(e))+'</div><div class="lb-sub">'+esc(sub(e))+'</div></div>';
      }).join("")+'</div>';
      if(rest.length)html+='<div class="lb-list">'+rest.map(function(e,i){
        return'<div class="lb-row'+(e.id===me?' me':'')+'"><div class="lb-rank">#'+(i+4)+'</div><div style="min-width:0"><div class="lb-name">'+esc(e.name)+(e.id===me?' (you)':'')+'</div><div class="lb-sub">'+esc(sub(e))+'</div></div><div class="lb-score">'+esc(val(e))+'</div></div>';
      }).join("")+'</div>';
    }
    el.innerHTML=html;
  }
}

function adminNow(){var u=currentUser();return u&&isAdmin(readUsers()[u])?u:null}
function renderAdmin(){
  var el=document.getElementById("extra-admin");if(!el)return;
  if(!adminNow()){el.innerHTML='<div class="lb-empty">Admins only.</div>';return}
  var users=readUsers(),list=sortEntries(localEntries(true),"stars"),total=list.reduce(function(a,e){return a+e.stars},0);
  var rows=list.map(function(e){
    var u=users[e.id],self=e.id===adminNow();
    return'<tr><td><b>'+esc(e.name)+'</b>'+(isAdmin(u)?'<span class="adm-badge">ADMIN</span>':'')+(e.hidden?'<span class="adm-badge" style="background:rgba(255,125,125,.18);color:var(--coral)">HIDDEN</span>':'')+'<div class="lb-sub">@'+esc(e.id)+'</div></td>'+
      '<td>'+esc(u.email||"—")+'</td><td>'+e.stars.toLocaleString()+'</td><td>'+e.missions+'</td>'+
      '<td><div class="adm-actions">'+
      '<button class="extra-btn" data-act="hide" data-id="'+esc(e.id)+'">'+(e.hidden?"Show":"Hide")+'</button>'+
      '<button class="extra-btn" data-act="code" data-id="'+esc(e.id)+'">New code</button>'+
      '<button class="extra-btn adm-danger" data-act="reset" data-id="'+esc(e.id)+'">Reset progress</button>'+
      (self?'':'<button class="extra-btn adm-danger" data-act="delete" data-id="'+esc(e.id)+'">Delete</button>')+
      '</div></td></tr>';
  }).join("");
  el.innerHTML='<div class="extra-hero"><h2>🛡️ Admin panel</h2><p>'+list.length+' account'+(list.length===1?"":"s")+' on this device · '+total.toLocaleString()+' stars earned in total.</p>'+
    '<div class="lb-tools"><button class="extra-btn adm-danger" data-act="wipe">Reset the whole leaderboard</button></div></div>'+
    '<div class="extra-card adm-wrap"><table class="adm-table"><thead><tr><th>Cadet</th><th>Email</th><th>Stars</th><th>Missions</th><th>Actions</th></tr></thead><tbody>'+rows+'</tbody></table></div>'+
    activityHTML();
  markSeen();
}
function activityHTML(){return "<div class=\"lb-empty\">Admin activity reporting is disabled in this demo.</div>"}

function adminAct(act,id){
  var me=adminNow();if(!me)return;
  var users=readUsers();
  if(act==="clearlog"){storageSet(localStorage,LOG_KEY,"[]");renderAdmin();return}
  if(act==="notif"){try{Notification.requestPermission().then(renderAdmin)}catch(e){}return}
  if(act==="wipe"){
    if(!confirm("Reset progress for EVERY account? This clears all stars and missions."))return;
    Object.keys(users).forEach(function(k){storageRemove(localStorage,BASE_SAVE+".u."+k)});
    location.reload();return;
  }
  if(!users[id])return;
  if(act==="hide"){users[id].hidden=!users[id].hidden;writeUsers(users);renderAdmin();return}
  if(act==="reset"){
    if(!confirm("Reset all progress for @"+id+"?"))return;
    storageRemove(localStorage,BASE_SAVE+".u."+id);
    if(id===me){location.reload();return}
    renderAdmin();return;
  }
  if(act==="delete"){
    if(id===me||!confirm("Delete the account @"+id+" and all its progress?"))return;
    delete users[id];writeUsers(users);storageRemove(localStorage,BASE_SAVE+".u."+id);renderAdmin();return;
  }
  if(act==="code"){
    var pw=prompt("New secret code for @"+id+" (at least 6 characters):");
    if(pw===null)return;
    if(pw.length<6){alert("Secret codes need at least 6 characters.");return}
    var salt=randomSalt();
    hashPw(pw,salt).then(function(hs){var us=readUsers();if(us[id]){us[id].salt=salt;us[id].hash=hs;writeUsers(us);alert("Done. Give @"+id+" the new code.")}});
  }
}

function addExtraTab(nav,app,id,label,fn){
  if(document.getElementById("extra-"+id))return;
  var b=document.createElement("button");b.className="tab";b.dataset.extraView=id;b.textContent=label;nav.appendChild(b);
  var sec=document.createElement("section");sec.id="extra-"+id;sec.className="extra-view";sec.dataset.extraView=id;app.appendChild(sec);
  b.addEventListener("click",function(){
    document.querySelectorAll(".view").forEach(function(v){v.classList.remove("is-active")});
    document.querySelectorAll(".extra-view").forEach(function(v){v.classList.toggle("active",v===sec)});
    document.querySelectorAll(".tabs .tab").forEach(function(t){t.classList.toggle("is-active",t===b)});
    fn();window.scrollTo(0,0);
  });
  sec._tab=b;return sec;
}
function mountTabs(user){
  var nav=$(".tabs"),app=$("#app");if(!nav||!app)return;
  var lb=addExtraTab(nav,app,"leaderboard","🏅 Leaderboard",renderLB);
  if(lb)lb.addEventListener("click",function(e){
    var m=e.target.closest("[data-metric]");
    if(m){lbMetric=m.dataset.metric;renderLB();return}
    if(e.target.closest("[data-refresh]"))renderLB();
  });
  if(isAdmin(user)){
    var ad=addExtraTab(nav,app,"admin","🛡️ Admin",renderAdmin);
    if(ad){
      adminTabBtn=ad._tab;badge();
      ad.addEventListener("click",function(e){var b=e.target.closest("[data-act]");if(b)adminAct(b.dataset.act,b.dataset.id)});
    }
    setTimeout(function(){
      if(unseenCount())adminAlert();
      else try{AstroCadet.UI.toast("🛡️ Welcome back, admin","mint")}catch(e){}
    },700);
  }
}

/* ---- twinkling stars behind the card ---- */
var starsOn=false;
function stars(){
  if(starsOn)return;starsOn=true;
  var c=$("#authStars");if(!c)return;
  var x=c.getContext("2d"),w=0,h=0,st=[],t=0;
  var calm=window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches;
  function size(){
    w=c.width=window.innerWidth;h=c.height=window.innerHeight;
    var n=Math.min(150,Math.round(w*h/9000));st=[];
    for(var i=0;i<n;i++)st.push({x:Math.random()*w,y:Math.random()*h,r:.5+Math.random()*1.7,a:.3+Math.random()*.6,p:Math.random()*6.28,s:.04+Math.random()*.12,
      c:Math.random()>.85?"79,227,255":(Math.random()>.9?"255,200,87":"220,235,255")});
  }
  function draw(){
    t+=.012;x.clearRect(0,0,w,h);
    for(var i=0;i<st.length;i++){
      var s=st[i],tw=calm?1:.7+.3*Math.sin(t*1.6+s.p);
      x.beginPath();x.arc(s.x,s.y,s.r,0,6.283);x.fillStyle="rgba("+s.c+","+(s.a*tw).toFixed(3)+")";x.fill();
      if(!calm){s.y+=s.s;if(s.y>h+2){s.y=-2;s.x=Math.random()*w}}
    }
    requestAnimationFrame(draw);
  }
  size();window.addEventListener("resize",size);draw();
}

document.addEventListener("DOMContentLoaded",function(){
  syncWelcomeLanguage();
  var enter=$("#welcomeEnter");
  if(enter)enter.addEventListener("click",showLogin);
  var f=$("#authForm");if(!f)return;
  f.addEventListener("submit",submit);
  $("#tabSignin").addEventListener("click",function(){setMode("signin")});
  $("#tabSignup").addEventListener("click",function(){setMode("signup")});
  $("#authPass").addEventListener("input",function(){if(mode==="signup")meter(this.value)});
  $("#authEye").addEventListener("click",function(){
    var p=$("#authPass"),p2=$("#authPass2"),show=p.type==="password";
    p.type=show?"text":"password";p2.type=show?"text":"password";
    this.setAttribute("aria-pressed",String(show));
    this.setAttribute("aria-label",show?"Hide secret code":"Show secret code");
    this.textContent=show?"🙈":"👁";
  });
  $("#authGuest").addEventListener("click",function(){go(GUEST,true)});
  var out=$("#btnSignOut");
  if(out)out.addEventListener("click",function(){
    clearSession();location.reload();
  });
});
})();
;

export function getAuth(){ return window.AstroAuth; }
