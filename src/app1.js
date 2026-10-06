/* ===================== APP ===================== */
(function(){
"use strict";
const KEY = "pawsteps-dog-training-v1";
const TOTAL = DAYS.length;
const AGES = {puppy:["🍼","Puppy","Under 6 months"], adolescent:["⚡","Adolescent","6–18 months"], adult:["🐕","Adult","1.5–7 years"], senior:["🧡","Senior","7+ years"]};
const RATINGS = {1:["😅","Struggled"],2:["🙂","Okay"],3:["🌟","Nailed it"]};
const CATS = ["Foundations","Life Skills","Impulse Control","Calm & Comfort","Tricks"];
const SKILL = Object.fromEntries(SKILLS.map(s=>[s.id,s]));
const $ = (s,r=document)=>r.querySelector(s);

/* ---------- utils ---------- */
const pad = n => String(n).padStart(2,"0");
const ymd = d => d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate());
const todayStr = () => ymd(new Date());
const dnum = s => { const [y,m,d]=s.split("-").map(Number); return Math.round(Date.UTC(y,m-1,d)/864e5); };
const daysBetween = (a,b) => dnum(b)-dnum(a);
const addDays = (s,n) => { const [y,m,d]=s.split("-").map(Number); const dt=new Date(Date.UTC(y,m-1,d+n)); return dt.getUTCFullYear()+"-"+pad(dt.getUTCMonth()+1)+"-"+pad(dt.getUTCDate()); };
const fmtDate = (s,o={weekday:"short",month:"short",day:"numeric"}) => { const [y,m,d]=s.split("-").map(Number); return new Date(y,m-1,d).toLocaleDateString(undefined,o); };
const esc = s => String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const isValidDate = s => /^\d{4}-\d{2}-\d{2}$/.test(s||"") && !isNaN(dnum(s));
function dogName(){ return (state.profile && state.profile.name) || "your dog"; }
/* personalize trusted content: escape, then insert escaped name */
const P = t => esc(t).replace(/\{dog\}/g, esc(dogName()));

/* ---------- state ---------- */
let storageOK = true;
function defaults(){ return {v:1, profile:null, spd:0, sound:true, days:{}, mastered:{}, activity:{}, repeats:[], created:todayStr()}; }
function load(){
  try{ const raw = localStorage.getItem(KEY); if(!raw) return defaults(); return normalize(JSON.parse(raw)); }
  catch(e){ storageOK=false; return defaults(); }
}
function normalize(o){
  const d = defaults(); if(!o || typeof o!=="object") return d;
  const s = Object.assign(d, o);
  ["days","mastered","activity"].forEach(k=>{ if(!s[k]||typeof s[k]!=="object"||Array.isArray(s[k])) s[k]={}; });
  if(!Array.isArray(s.repeats)) s.repeats=[];
  Object.keys(s.days).forEach(k=>{ const r=s.days[k]; if(!r||typeof r!=="object"){delete s.days[k];return;}
    r.s=Array.isArray(r.s)?r.s:[]; r.sd=Array.isArray(r.sd)?r.sd:[]; r.hist=Array.isArray(r.hist)?r.hist:[]; r.r=Number(r.r)||0; r.n=typeof r.n==="string"?r.n:""; });
  if(s.profile && (!s.profile.name || !isValidDate(s.profile.startDate))) s.profile=null;
  return s;
}
function save(){ try{ localStorage.setItem(KEY, JSON.stringify(state)); storageOK=true; }catch(e){ storageOK=false; toast("⚠️ Couldn’t save — storage is unavailable in this browser mode"); } }
let state = load();

/* ---------- program logic ---------- */
function rawDay(){ if(!state.profile) return 1; return daysBetween(state.profile.startDate, todayStr())+1; }
function shiftCount(){ const t=todayStr(), st=state.profile?state.profile.startDate:t; return state.repeats.filter(d=>d<t && d>=st).length; }
function schedInfo(){
  const raw = rawDay();
  if(raw<1) return {day:0, notStarted:true, startsIn:1-raw, finished:false};
  const n = raw - shiftCount();
  return {day:Math.min(Math.max(n,1),TOTAL), notStarted:false, finished:n>TOTAL};
}
function sessCount(n){ return state.spd>0 ? state.spd : DAYS[n-1].sessions; }
function minutesFor(n){ const m=DAYS[n-1].minutes, a=state.profile&&state.profile.age;
  if(a==="puppy") return Math.max(2, Math.round(m*0.6)); if(a==="senior") return Math.max(2, Math.round(m*0.8)); return m; }
function getRec(n, create){ let r=state.days[n]; if(!r && create){ r=state.days[n]={s:[],sd:[],r:0,n:"",hist:[]}; } return r; }
function doneCount(n){ const r=state.days[n]; if(!r) return 0; return r.s.slice(0,sessCount(n)).filter(Boolean).length; }
function isComplete(n){ return doneCount(n)>=sessCount(n); }
function status(n){
  const r=state.days[n], done=doneCount(n), sch=schedInfo();
  if(r && r.r===1 && done>0) return "struggled";
  if(done>=sessCount(n)) return "done";
  if(done>0) return "partial";
  if(!sch.notStarted && n===sch.day && !sch.finished) return "today";
  if(!sch.notStarted && (n<sch.day || sch.finished)) return "missed";
  return "upcoming";
}
const STATUS_LABEL = {done:"Done",partial:"In progress",struggled:"Struggled",today:"Today",missed:"Not done",upcoming:"Upcoming"};
function streak(){ let s=0, d=todayStr(); if(!(state.activity[d]>0)) d=addDays(d,-1); while(state.activity[d]>0){ s++; d=addDays(d,-1); } return s; }
function bestStreak(){ const ks=Object.keys(state.activity).filter(k=>state.activity[k]>0).sort(); let best=0,cur=0,prev=null;
  ks.forEach(k=>{ cur = (prev && daysBetween(prev,k)===1) ? cur+1 : 1; best=Math.max(best,cur); prev=k; }); return best; }
function totalSessions(){ let t=0; Object.keys(state.days).forEach(k=>{ const r=state.days[k]; t+=r.s.filter(Boolean).length; r.hist.forEach(h=>t+=(h.s||0)); }); return t; }
function daysCompleted(){ let c=0; for(let i=1;i<=TOTAL;i++) if(isComplete(i)) c++; return c; }
function skillStatus(id){ if(state.mastered[id]) return "mastered"; return DAYS.some(d=>d.skills.includes(id) && (doneCount(d.day)>0 || (state.days[d.day]&&state.days[d.day].hist.length))) ? "practicing" : "new"; }
function dayEmoji(d){ return d.graduation?"🎓":d.combo?"🧩":d.review?"🔁":SKILL[d.skill].emoji; }
function phaseOf(d){ return PHASES[d.week-1]; }
function shade(hex,amt){ const n=parseInt(hex.slice(1),16); let r=n>>16,g=(n>>8)&255,b=n&255; const t=amt<0?0:255,p=Math.abs(amt);
  r=Math.round((t-r)*p+r); g=Math.round((t-g)*p+g); b=Math.round((t-b)*p+b); return "#"+((1<<24)+(r<<16)+(g<<8)+b).toString(16).slice(1); }

/* ---------- UI helpers ---------- */
let toastTimer;
function toast(msg){ const t=$("#toast"); if(!t) return; t.textContent=msg; t.classList.add("show"); clearTimeout(toastTimer); toastTimer=setTimeout(()=>t.classList.remove("show"),2600); }
function confetti(){ const c=document.createElement("div"); c.className="confetti"; const em=["🐾","🦴","🎉","⭐","🐶","💛"];
  for(let i=0;i<26;i++){ const s=document.createElement("span"); s.textContent=em[i%em.length]; s.style.left=Math.random()*100+"vw"; s.style.animationDelay=(Math.random()*.6)+"s"; s.style.fontSize=(18+Math.random()*18)+"px"; c.appendChild(s); }
  document.body.appendChild(c); setTimeout(()=>c.remove(),2800); }

/* ---------- routing ---------- */
const ROUTES = [["today","🐕","Today"],["program","🗓️","Program"],["progress","📈","Progress"],["skills","📚","Skills"],["settings","⚙️","Settings"]];
let route = "today", viewDay = null;
function readRoute(){ const h=(location.hash||"").replace(/^#\/?/,""); route = ROUTES.some(r=>r[0]===h) ? h : "today"; }
function go(r){ if(location.hash!=="#"+r){ try{ history.pushState(null,"","#"+r); }catch(e){ location.hash=r; return; } } render(); window.scrollTo(0,0); }
function openDay(n){ viewDay=n; go("today"); }

/* ---------- Timer ---------- */
const C = 2*Math.PI*52;
const timer = {total:300, remain:300, running:false, end:0, iv:null, day:null, done:false};
let audioCtx = null;
function timerReset(n){ clearInterval(timer.iv); timer.running=false; timer.done=false; timer.day=n; timer.total=timer.remain=minutesFor(n)*60; updateTimer(); }
function timerToggle(){
  if(timer.running){ timer.remain=Math.max(0,(timer.end-Date.now())/1000); timer.running=false; clearInterval(timer.iv); }
  else{
    if(timer.remain<=0){ timer.remain=timer.total; }
    try{ audioCtx = audioCtx || new (window.AudioContext||window.webkitAudioContext)(); if(audioCtx.state==="suspended") audioCtx.resume(); }catch(e){}
    timer.done=false; timer.running=true; timer.end=Date.now()+timer.remain*1000;
    clearInterval(timer.iv); timer.iv=setInterval(tick,250);
  }
  updateTimer();
}
function timerAdd(sec){ if(timer.running){ timer.end+=sec*1000; timer.remain=(timer.end-Date.now())/1000; } else { timer.remain=Math.max(0,timer.remain+sec); }
  timer.total=Math.max(60, timer.total+sec); if(timer.remain>timer.total) timer.total=timer.remain; if(timer.remain<=0 && timer.running){ timer.remain=0; } timer.done=false; updateTimer(); }
function tick(){ timer.remain=(timer.end-Date.now())/1000; if(timer.remain<=0){ timer.remain=0; timer.running=false; timer.done=true; clearInterval(timer.iv); onTimerDone(); } updateTimer(); }
function beep(){ if(!state.sound || !audioCtx) return; try{ [0,0.35,0.7].forEach((t,i)=>{ const o=audioCtx.createOscillator(), g=audioCtx.createGain(); o.type="sine"; o.frequency.value=i===2?988:784;
  g.gain.setValueAtTime(0.0001,audioCtx.currentTime+t); g.gain.exponentialRampToValueAtTime(0.3,audioCtx.currentTime+t+0.02); g.gain.exponentialRampToValueAtTime(0.0001,audioCtx.currentTime+t+0.3);
  o.connect(g); g.connect(audioCtx.destination); o.start(audioCtx.currentTime+t); o.stop(audioCtx.currentTime+t+0.32); }); }catch(e){} }
function onTimerDone(){ beep(); try{ navigator.vibrate && navigator.vibrate([200,100,200]); }catch(e){} toast("⏰ Time’s up! End on a win and give "+dogName()+" a break."); }
function fmtTime(s){ s=Math.ceil(s); return Math.floor(s/60)+":"+pad(s%60); }
function updateTimer(){
  const txt=$("#tm-text"); if(!txt) return;
  txt.textContent=fmtTime(timer.remain);
  $("#tm-arc").setAttribute("stroke-dashoffset", (C*(1-(timer.total?timer.remain/timer.total:0))).toFixed(2));
  $("#tm-start").innerHTML = timer.running ? "⏸ Pause" : (timer.remain<timer.total && timer.remain>0 ? "▶ Resume" : "▶ Start");
  $("#tm-state").textContent = timer.running ? "running" : timer.done ? "done!" : (timer.remain<timer.total ? "paused" : "ready");
  $("#tm-wrap").classList.toggle("finished", timer.done);
  const mk=$("#tm-mark"); if(mk) mk.hidden = !(timer.done && viewDayNum() && doneCount(viewDayNum())<sessCount(viewDayNum()));
}
function viewDayNum(){ const s=schedInfo(); return viewDay || (s.notStarted?1:s.day); }
