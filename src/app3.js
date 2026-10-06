/* ---------- Skills library ---------- */
let skillFilter = "All", skillQuery = "", openSkill = null;
function lessonBlock(d){
  return `<div class="lib-day"><h4><span class="chip p">Day ${d.day}</span>${P(d.title)}<span class="spacer"></span><button class="btn sec sm" data-act="open" data-n="${d.day}">Open day →</button></h4>
    <div class="small"><b>Goal:</b> ${P(d.goal)} <span class="muted">· ${sessCount(d.day)} × ${minutesFor(d.day)} min</span></div>
    <div class="sub">Steps</div><ol>${d.steps.map(s=>`<li>${P(s)}</li>`).join("")}</ol>
    <div class="sub">Success looks like</div><ul class="ticks small">${d.success.map(s=>`<li>${P(s)}</li>`).join("")}</ul>
    <div class="sub">Troubleshooting</div><ul class="ticks warn small">${d.mistakes.map(s=>`<li>${P(s)}</li>`).join("")}</ul>
    ${d.levelUp?`<div class="sub">Level up</div><p class="small" style="margin:0">🚀 ${P(d.levelUp)}</p>`:""}</div>`;
}
function viewSkills(){
  const name=esc(dogName());
  const cats=["All",...CATS,"Mastered","Not mastered"];
  let h=`<h1 class="page-title">Skills library</h1><p class="page-sub">${SKILLS.length} skills · everything ${name} will learn, with full instructions.</p>
  <input type="search" id="skill-search" placeholder="🔍  Search skills, cues or steps (e.g. “door”, “leash”)" value="${esc(skillQuery)}" aria-label="Search skills">
  <div class="filters">${cats.map(c=>`<button class="${skillFilter===c?"on":""}" data-act="filter" data-c="${esc(c)}">${esc(c)}</button>`).join("")}</div>
  <details class="lib"><summary><div class="em">🧭</div><div class="nm"><b>Training basics</b><span>Force-free principles that make every skill easier</span></div><span class="chev">›</span></summary>
    <div class="lib-body"><div class="basics">${BASICS.map(b=>`<div><b>${P(b[0])}</b>${P(b[1])}</div>`).join("")}</div></div></details>`;
  SKILLS.forEach(s=>{
    const lessons=DAYS.filter(d=>d.skill===s.id || (!d.review && d.skills.includes(s.id)));
    const reviews=DAYS.filter(d=>d.review && d.skills.includes(s.id));
    const ss=skillStatus(s.id);
    const text=[s.name,s.cue,s.summary,s.why,s.cat,...lessons.map(d=>[d.title,d.goal,d.steps.join(" "),d.mistakes.join(" ")].join(" "))].join(" ").replace(/\{dog\}/g,dogName()).toLowerCase();
    h+=`<details class="lib skill-card" data-id="${s.id}" data-cat="${esc(s.cat)}" data-m="${ss==="mastered"?1:0}" data-text="${esc(text)}" ${openSkill===s.id?"open":""}>
      <summary><div class="em">${s.emoji}</div><div class="nm"><b>${esc(s.name)} ${ss==="mastered"?'<span class="chip g">⭐ Mastered</span>':""}</b><span>${P(s.summary)}</span></div><span class="chev">›</span></summary>
      <div class="lib-body">
        <div class="row" style="margin-bottom:8px"><span class="chip">${esc(s.cat)}</span><span class="chip p">Cue: ${P(s.cue)}</span></div>
        <p style="margin:6px 0">${P(s.why)}</p>
        <div class="row" style="margin-top:8px"><button class="mbtn ${ss==="mastered"?"on":""}" data-act="master" data-id="${s.id}">${ss==="mastered"?"⭐ Mastered":"☆ Mark as mastered"}</button>
        ${reviews.length?`<span class="small muted">Reviewed on ${reviews.map(d=>`<a href="#today" data-act="open" data-n="${d.day}">Day ${d.day}</a>`).join(", ")}</span>`:""}</div>
        ${lessons.map(lessonBlock).join("")}
      </div></details>`;
  });
  h+=`<div class="empty" id="skill-empty" hidden>No skills match your search.</div>`;
  return h;
}
function applySkillFilter(){
  const q=skillQuery.trim().toLowerCase(); let shown=0;
  document.querySelectorAll(".skill-card").forEach(el=>{
    const okCat = skillFilter==="All" || (skillFilter==="Mastered"?el.dataset.m==="1": skillFilter==="Not mastered"?el.dataset.m==="0": el.dataset.cat===skillFilter);
    const okQ = !q || q.split(/\s+/).every(w=>el.dataset.text.includes(w));
    el.hidden = !(okCat && okQ); if(!el.hidden) shown++;
  });
  const e=$("#skill-empty"); if(e) e.hidden = shown>0;
}

/* ---------- Settings ---------- */
function profileForm(p, isOnb){
  p = p || {name:"",age:"",breed:"",startDate:todayStr()};
  return `
    <label class="f" for="f-name">Dog’s name</label>
    <input type="text" id="f-name" maxlength="30" placeholder="e.g. Biscuit" value="${esc(p.name)}" autocomplete="off">
    <label class="f">Age group</label>
    <div class="seg" id="f-age">${Object.keys(AGES).map(k=>`<button type="button" class="${p.age===k?"on":""}" data-act="age" data-v="${k}"><span class="e">${AGES[k][0]}</span>${AGES[k][1]}<small class="muted" style="font-weight:600;font-size:.68rem">${AGES[k][2]}</small></button>`).join("")}</div>
    <label class="f" for="f-breed">Breed <span class="muted" style="font-weight:600">(optional)</span></label>
    <input type="text" id="f-breed" maxlength="40" placeholder="e.g. Labrador mix" value="${esc(p.breed||"")}">
    <label class="f" for="f-start">Program start date</label>
    <input type="date" id="f-start" value="${esc(p.startDate)}">
    <p class="small muted" style="margin:6px 0 0">${isOnb?"Already started training? Pick an earlier date and the app will jump to the right day.":"Changing the start date moves which day is ‘today’. Your logged progress is kept."}</p>`;
}
function readProfileForm(){
  const name=$("#f-name").value.trim(), ageBtn=$("#f-age .on"), breed=$("#f-breed").value.trim(), start=$("#f-start").value;
  if(!name){ toast("Please enter your dog’s name 🐶"); $("#f-name").focus(); return null; }
  if(!ageBtn){ toast("Please choose an age group"); return null; }
  if(!isValidDate(start)){ toast("Please choose a valid start date"); return null; }
  return {name, age:ageBtn.dataset.v, breed, startDate:start};
}
function viewSettings(){
  const p=state.profile;
  return `<h1 class="page-title">Settings</h1><p class="page-sub">Update ${esc(dogName())}’s profile and manage your data.</p>
  <div class="two-col"><div>
  <div class="card"><h3><span class="h-ic">🐶</span> Dog profile</h3>${profileForm(p,false)}
    <button class="btn block" data-act="save-profile" style="margin-top:16px">Save profile</button></div>
  </div><div>
  <div class="card"><h3><span class="h-ic">🎛️</span> Preferences</h3>
    <label class="f" for="f-spd">Sessions per day</label>
    <select id="f-spd"><option value="0" ${state.spd===0?"selected":""}>Follow the program (1–3 per day)</option>${[1,2,3,4,5].map(v=>`<option value="${v}" ${state.spd===v?"selected":""}>${v} every day</option>`).join("")}</select>
    <label class="row" style="margin-top:14px;gap:10px;font-weight:700"><input type="checkbox" id="f-sound" ${state.sound?"checked":""} style="width:22px;height:22px;accent-color:var(--primary)"> Timer sound when a session ends</label>
    ${state.repeats.length?`<p class="small muted" style="margin:12px 0 0">Schedule shifted by <b>${shiftCount()}</b> repeat day(s). <button class="btn ghost sm" data-act="clear-repeats">Undo shifts</button></p>`:""}
  </div>
  <div class="card"><h3><span class="h-ic">💾</span> Your data</h3>
    <p class="small muted" style="margin-top:0">Progress is saved automatically in this browser only. Export a backup to move it to another device or browser.</p>
    <div class="row"><button class="btn sec" data-act="export">⬇️ Export JSON</button><button class="btn sec" data-act="import">⬆️ Import JSON</button>
    <input type="file" id="import-file" accept="application/json,.json" hidden></div>
    <hr style="border:0;border-top:1px solid var(--line);margin:16px 0">
    <button class="btn danger block" data-act="reset">🗑️ Reset all data</button>
  </div>
  <div class="card"><h3><span class="h-ic">ℹ️</span> About</h3>
    <p class="small" style="margin:0">PawSteps uses positive-reinforcement, force-free methods: reward what you want, manage what you don’t, and never use pain or fear. It’s a general guide — for aggression, severe fear, or separation anxiety, please work with a certified force-free trainer or veterinary behaviorist.</p>
    <p class="small muted" style="margin:8px 0 0">Tip: on a phone, use your browser’s “Add to Home Screen” for one-tap access.</p></div>
  </div></div>`;
}
function viewOnboarding(){
  return `<div class="onb"><div class="card">
    <div class="hero-emoji">🐕‍🦺</div><h1>Welcome to PawSteps</h1>
    <p class="lead">A 6-week, positive-reinforcement training plan — a few short sessions a day.</p>
    ${profileForm(null,true)}
    <button class="btn block" data-act="onb-save" style="margin-top:18px">Start training 🐾</button>
    ${storageOK?"":`<p class="small" style="color:var(--coral)">⚠️ This browser is blocking local storage, so progress won’t be saved.</p>`}
  </div></div>`;
}

/* ---------- Render ---------- */
function render(){
  const root=$("#app");
  if(!state.profile){ root.innerHTML=viewOnboarding()+`<div class="toast" id="toast" role="status"></div>`; document.title="PawSteps · Daily Dog Training"; return; }
  readRoute();
  const name=esc(dogName()), st=streak();
  const navBtns = cls => ROUTES.map(r=>`<button class="${route===r[0]?"active":""}" data-act="nav" data-r="${r[0]}" aria-current="${route===r[0]?"page":"false"}"><span class="ic">${r[1]}</span>${r[2]}</button>`).join("");
  let body = route==="program"?viewProgram(): route==="progress"?viewProgress(): route==="skills"?viewSkills(): route==="settings"?viewSettings(): viewToday();
  root.innerHTML = `<div class="app">
    <header class="topbar"><div class="topbar-inner">
      <div class="brand"><div class="logo">🐾</div><div>PawSteps<small>Training with ${name}</small></div></div>
      <nav class="topnav" aria-label="Main">${navBtns()}</nav>
      <div class="streak-pill" title="Day streak">🔥 ${st}</div>
    </div></header>
    <main class="main">${storageOK?"":`<div class="banner warm">⚠️ <div>Local storage is unavailable, so progress won’t be saved after you close this page.</div></div>`}${body}
      <p class="footer-note">🐾 PawSteps · progress is saved in this browser</p></main>
    <nav class="nav" aria-label="Main">${navBtns()}</nav>
    <div class="toast" id="toast" role="status" aria-live="polite"></div>
  </div>`;
  document.title = `${dogName()}’s Training · PawSteps`;
  if(route==="today") updateTimer();
  if(route==="skills") applySkillFilter();
}
function rerenderKeepScroll(){ const y=window.scrollY; render(); window.scrollTo(0,y); }

/* ---------- Actions ---------- */
function toggleSession(i){
  const n=viewDayNum(), need=sessCount(n), r=getRec(n,true), was=isComplete(n);
  if(r.s[i]){ r.s[i]=false; const dt=r.sd[i]; if(dt && state.activity[dt]>0){ state.activity[dt]--; if(!state.activity[dt]) delete state.activity[dt]; } r.sd[i]=null; }
  else { r.s[i]=true; const t=todayStr(); r.sd[i]=t; state.activity[t]=(state.activity[t]||0)+1; }
  save(); rerenderKeepScroll();
  if(!was && isComplete(n)){ confetti(); toast(`🎉 Day ${n} complete! Great work, ${dogName()}!`); }
  else if(r.s[i]) toast(`✅ Session ${i+1} logged`);
}
function repeatDay(){
  const n=viewDayNum(), sch=schedInfo(), isToday=!sch.notStarted && !sch.finished && n===sch.day, r=getRec(n,true), t=todayStr();
  const msg = isToday ? `Repeat Day ${n} tomorrow?\n\nToday’s check-offs and rating are saved to history, and Day ${n} will come up again tomorrow (the rest of the program shifts by one day).`
                      : `Repeat Day ${n}?\n\nThis attempt is saved to history and the check-offs are cleared so you can practice it again.`;
  if(!confirm(msg)) return;
  r.hist.push({date:t, s:r.s.filter(Boolean).length, r:r.r});
  r.s=[]; r.sd=[]; r.r=0;
  if(isToday && !state.repeats.includes(t)) state.repeats.push(t);
  save(); rerenderKeepScroll(); toast(isToday?`🔁 Day ${n} will come up again tomorrow`:`🔁 Day ${n} reset — practice again anytime`);
}
function exportData(){
  const data={app:"PawSteps", version:1, exportedAt:new Date().toISOString(), state};
  const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"});
  const a=document.createElement("a"); a.href=URL.createObjectURL(blob);
  a.download=`${dogName().replace(/[^\w-]+/g,"_")}-training-progress-${todayStr()}.json`;
  document.body.appendChild(a); a.click(); setTimeout(()=>{ URL.revokeObjectURL(a.href); a.remove(); },500);
  toast("⬇️ Backup downloaded");
}
function importData(file){
  const fr=new FileReader();
  fr.onload=()=>{ try{
      const o=JSON.parse(fr.result), s=o && o.state ? o.state : o;
      if(!s || typeof s!=="object" || !s.profile || typeof s.days!=="object") throw new Error("bad");
      const ns=normalize(s); if(!ns.profile) throw new Error("bad");
      if(!confirm(`Import progress for ${ns.profile.name}? This replaces the current data in this browser.`)) return;
      state=ns; save(); viewDay=null; timer.day=null; toast("✅ Progress imported"); go("today");
    }catch(e){ toast("⚠️ That file isn’t a valid PawSteps backup"); } };
  fr.readAsText(file);
}

document.addEventListener("click", e=>{
  const el=e.target.closest("[data-act]"); if(!el) return;
  const a=el.dataset.act;
  if(el.tagName==="A") e.preventDefault();
  switch(a){
    case "nav": if(el.dataset.r==="today") viewDay=null; go(el.dataset.r); break;
    case "prev": viewDay=Math.max(1,viewDayNum()-1); rerenderKeepScroll(); break;
    case "next": viewDay=Math.min(TOTAL,viewDayNum()+1); rerenderKeepScroll(); break;
    case "today": viewDay=null; render(); window.scrollTo(0,0); break;
    case "open": openDay(Number(el.dataset.n)); break;
    case "sess": toggleSession(Number(el.dataset.i)); break;
    case "rate": { const n=viewDayNum(), r=getRec(n,true), v=Number(el.dataset.v); r.r = r.r===v?0:v; save(); rerenderKeepScroll(); if(r.r===1) toast("That’s okay! Make it easier next time, or repeat this day 💛"); else if(r.r===3) toast("🌟 Awesome — "+dogName()+" nailed it!"); break; }
    case "master": { const id=el.dataset.id; if(state.mastered[id]) delete state.mastered[id]; else { state.mastered[id]=todayStr(); toast(`⭐ ${SKILL[id].name} mastered!`); }
      save(); if(route==="skills"){ openSkill=id; } rerenderKeepScroll(); break; }
    case "repeat": repeatDay(); break;
    case "skill": openSkill=el.dataset.id; skillFilter="All"; skillQuery=""; go("skills"); setTimeout(()=>{ const c=document.querySelector(`.skill-card[data-id="${openSkill}"]`); if(c) c.scrollIntoView({block:"start"}); },30); break;
    case "tm-toggle": timerToggle(); break;
    case "tm-reset": timerReset(viewDayNum()); break;
    case "tm-add": timerAdd(Number(el.dataset.s)); break;
    case "tm-mark": { const n=viewDayNum(), r=getRec(n,true); for(let i=0;i<sessCount(n);i++){ if(!r.s[i]){ timer.done=false; timer.remain=timer.total; toggleSession(i); break; } } break; }
    case "filter": skillFilter=el.dataset.c; document.querySelectorAll(".filters button").forEach(b=>b.classList.toggle("on",b===el)); applySkillFilter(); break;
    case "age": el.parentElement.querySelectorAll("button").forEach(b=>b.classList.toggle("on",b===el)); break;
    case "onb-save": { const p=readProfileForm(); if(!p) return; state.profile=p; save(); viewDay=null; location.hash="today"; render(); window.scrollTo(0,0); setTimeout(()=>toast(`Welcome, ${p.name}! 🐾 Let’s get started.`),50); break; }
    case "save-profile": { const p=readProfileForm(); if(!p) return; state.profile=p; save(); viewDay=null; timer.day=null; rerenderKeepScroll(); toast("✅ Profile saved"); break; }
    case "clear-repeats": if(confirm("Undo all schedule shifts from repeated days?")){ state.repeats=[]; save(); rerenderKeepScroll(); toast("Schedule reset"); } break;
    case "export": exportData(); break;
    case "import": $("#import-file").click(); break;
    case "reset": if(confirm(`Reset ALL data for ${dogName()}? This deletes the profile, every check-off, rating and note in this browser. This can’t be undone.\n\nTip: export a backup first.`)){
        try{ localStorage.removeItem(KEY); }catch(err){} state=defaults(); viewDay=null; timer.day=null; clearInterval(timer.iv); timer.running=false; location.hash=""; render(); } break;
  }
});
let noteTimer;
document.addEventListener("input", e=>{
  if(e.target.id==="notes"){ const n=viewDayNum(); clearTimeout(noteTimer); const val=e.target.value;
    noteTimer=setTimeout(()=>{ getRec(n,true).n=val; save(); const s=$("#saved"); if(s){ s.classList.add("show"); setTimeout(()=>s.classList.remove("show"),1200); } },350); }
  if(e.target.id==="skill-search"){ skillQuery=e.target.value; applySkillFilter(); }
});
document.addEventListener("change", e=>{
  if(e.target.id==="f-spd"){ state.spd=Number(e.target.value)||0; save(); toast("✅ Sessions per day updated"); }
  if(e.target.id==="f-sound"){ state.sound=e.target.checked; save(); }
  if(e.target.id==="import-file" && e.target.files[0]){ importData(e.target.files[0]); e.target.value=""; }
});
document.addEventListener("toggle", e=>{ if(e.target.classList && e.target.classList.contains("skill-card") && e.target.open) openSkill=e.target.dataset.id; }, true);
window.addEventListener("hashchange", ()=>{ render(); });
window.addEventListener("storage", e=>{ if(e.key===KEY){ state=load(); render(); } });
/* refresh when the date changes (e.g. app left open overnight) */
let lastDay=todayStr();
setInterval(()=>{ if(todayStr()!==lastDay){ lastDay=todayStr(); if(!timer.running) render(); } }, 60000);
document.addEventListener("visibilitychange", ()=>{ if(!document.hidden && todayStr()!==lastDay){ lastDay=todayStr(); render(); } });

render();
})();
