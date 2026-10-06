/* ---------- Views: Today ---------- */
function viewToday(){
  const sch=schedInfo(), n=viewDayNum(), d=DAYS[n-1], ph=phaseOf(d), r=getRec(n,false)||{s:[],r:0,n:"",hist:[]};
  const need=sessCount(n), done=doneCount(n), mins=minutesFor(n), name=esc(dogName());
  if(timer.day!==n && !timer.running) { timer.day=n; timer.done=false; timer.total=timer.remain=mins*60; }
  const isToday = !sch.notStarted && n===sch.day && !sch.finished;
  let banners="";
  if(sch.notStarted) banners+=`<div class="banner info">📅 <div>${name}’s program starts <b>${esc(fmtDate(state.profile.startDate,{weekday:"long",month:"long",day:"numeric"}))}</b> (in ${sch.startsIn} day${sch.startsIn>1?"s":""}). Here’s a sneak peek — feel free to start early!</div></div>`;
  if(sch.finished && n===TOTAL) banners+=`<div class="banner good">🎓 <div>You’ve reached the end of the 6-week program! Keep skills sharp with 5 minutes a day, and revisit any day from the Program tab.</div></div>`;
  if(!sch.notStarted && !sch.finished && n>sch.day) banners+=`<div class="banner warm">👀 <div>Peeking ahead — this lesson is scheduled ${n-sch.day} day${n-sch.day>1?"s":""} from now. It’s fine to practice early if ${name} is ready.</div></div>`;
  if(r.hist && r.hist.length) banners+=`<div class="banner info">🔁 <div><b>Attempt #${r.hist.length+1}.</b> Earlier tries: ${r.hist.map(h=>esc(fmtDate(h.date,{month:"short",day:"numeric"}))+" ("+h.s+" session"+(h.s===1?"":"s")+(h.r?", "+RATINGS[h.r][1].toLowerCase():"")+")").join(" · ")}</div></div>`;

  const skillChips = d.skills.map(id=>`<button class="chip ${state.mastered[id]?"g":""}" data-act="skill" data-id="${id}" style="border:0">${SKILL[id].emoji} ${esc(SKILL[id].name)}${state.mastered[id]?" ✓":""}</button>`).join("");
  const sessBtns = Array.from({length:need},(_,i)=>`<button class="sess ${r.s[i]?"done":""}" data-act="sess" data-i="${i}" aria-pressed="${!!r.s[i]}"><span class="box">✓</span>Session ${i+1}<small>${mins} min</small></button>`).join("");
  const masterTargets = d.skills.length ? d.skills : [];
  const masterBtns = masterTargets.length<=3 ? masterTargets.map(id=>`<button class="mbtn ${state.mastered[id]?"on":""}" data-act="master" data-id="${id}">${state.mastered[id]?"⭐ Mastered":"☆ Mark mastered"}: ${esc(SKILL[id].name)}</button>`).join("")
     : `<span class="small muted">Mark individual skills as mastered from the Progress tab.</span>`;

  return `
  <section class="day-hero" style="--phase:${ph.color};--phase2:${shade(ph.color,-0.32)}">
    <div class="nav-row">
      <button class="icon-btn" data-act="prev" ${n<=1?"disabled":""} aria-label="Previous day">‹</button>
      <div class="center"><div class="kicker">Week ${d.week} · ${esc(ph.name)}</div><h1>Day ${n} with ${name}</h1></div>
      <button class="icon-btn" data-act="next" ${n>=TOTAL?"disabled":""} aria-label="Next day">›</button>
    </div>
    <div class="lesson"><div class="big">${dayEmoji(d)}</div><div><h2>${P(d.title)}</h2><p>${P(d.goal)}</p></div></div>
    <div class="chips"><span class="chip">⏱ ${need} × ${mins} min</span><span class="chip">🔁 ${P(d.reps)}</span>${isToday?'<span class="chip">📍 Today</span>':""}${d.review?'<span class="chip">⭐ Review day</span>':""}${d.trick?'<span class="chip">✨ Trick</span>':""}</div>
    ${(!isToday && !sch.notStarted && !(sch.finished && n===TOTAL)) ? `<button class="today-link" data-act="today">↩ Back to today (Day ${sch.day})</button>`:""}
  </section>
  ${banners}
  <div class="today-grid">
    <div class="t-top">
      <div class="card">
        <h3><span class="h-ic">✅</span> ${isToday?"Today’s sessions":"Sessions"} <span class="spacer"></span><span class="small muted" id="sess-count">${done}/${need} done</span></h3>
        <div class="sessions" style="--n:${need}">${sessBtns}</div>
        <div class="meter g" style="margin-top:12px"><i style="width:${Math.round(done/need*100)}%"></i></div>
      </div>
      <div class="card">
        <h3><span class="h-ic">⏱️</span> Session timer</h3>
        <div class="timer" id="tm-wrap">
          <div class="ring"><svg width="118" height="118" viewBox="0 0 118 118"><circle cx="59" cy="59" r="52" fill="none" stroke="#F1EADF" stroke-width="10"/><circle id="tm-arc" cx="59" cy="59" r="52" fill="none" stroke="${ph.color}" stroke-width="10" stroke-linecap="round" stroke-dasharray="${C.toFixed(2)}" stroke-dashoffset="0"/></svg>
            <div class="t"><div><span id="tm-text">${fmtTime(timer.remain)}</span><small id="tm-state">ready</small></div></div></div>
          <div class="timer-ctrls">
            <button class="btn" id="tm-start" data-act="tm-toggle">▶ Start</button>
            <div class="row"><button class="btn sec sm" data-act="tm-add" data-s="-60" aria-label="Minus one minute">−1m</button><button class="btn sec sm" data-act="tm-reset">Reset</button><button class="btn sec sm" data-act="tm-add" data-s="60" aria-label="Plus one minute">+1m</button></div>
            <button class="btn green sm" id="tm-mark" data-act="tm-mark" hidden>✓ Mark session done</button>
          </div>
        </div>
      </div>
    </div>
    <div class="t-main">
      ${state.profile && state.profile.age ? `<div class="age-tip">${P(AGE_NOTES[state.profile.age])}</div>`:""}
      <div class="card"><h3><span class="h-ic">💡</span> Why it matters</h3><p style="margin:0">${P(d.why)}</p>
        <div class="skill-tags" style="margin-top:12px">${skillChips}</div></div>
      <div class="card"><h3><span class="h-ic">🎒</span> What you need</h3><div class="need">${d.need.map(x=>`<span class="chip">${P(x)}</span>`).join("")}</div>
        <p class="small muted" style="margin:10px 0 0">Plan: <b>${need} session${need>1?"s":""} × ${mins} min</b> · ${P(d.reps)}. Spread sessions through the day.</p></div>
      <div class="card"><h3><span class="h-ic">🪜</span> Step by step</h3><ol class="steps">${d.steps.map(s=>`<li>${P(s)}</li>`).join("")}</ol></div>
      <div class="card"><h3><span class="h-ic">🎯</span> Ready to move on when…</h3><ul class="ticks">${d.success.map(s=>`<li>${P(s)}</li>`).join("")}</ul></div>
      <div class="card"><h3><span class="h-ic">🛠️</span> Common mistakes & troubleshooting</h3><ul class="ticks warn">${d.mistakes.map(s=>`<li>${P(s)}</li>`).join("")}</ul>
        <p class="small muted" style="margin:10px 0 0">Struggling? Make it easier: shorter time, less distance, a quieter room, or better treats. Then use “Repeat this day”.</p></div>
      ${d.levelUp?`<div class="card levelup"><h3><span class="h-ic">🚀</span> Level-up challenge</h3><p style="margin:0">${P(d.levelUp)}</p></div>`:""}
    </div>
    <div class="t-bot">
      <div class="card">
        <h3><span class="h-ic">📝</span> How did it go?</h3>
        <div class="rating">${[1,2,3].map(v=>`<button class="${r.r===v?"on":""}" data-act="rate" data-v="${v}"><span class="e">${RATINGS[v][0]}</span>${RATINGS[v][1]}</button>`).join("")}</div>
        <label class="f" for="notes">Notes for Day ${n} <span class="saved" id="saved">Saved ✓</span></label>
        <textarea id="notes" placeholder="What worked? What was tricky? Treats used, distractions, ${name}’s mood…">${esc(r.n)}</textarea>
        <div style="display:flex;flex-direction:column;gap:8px;margin-top:12px">${masterBtns}</div>
        <button class="btn ghost block" data-act="repeat" style="margin-top:12px">🔁 Repeat this day${isToday?" tomorrow":""}</button>
        <p class="small muted" style="margin:6px 0 0">${isToday?"Saves today’s attempt to history and brings this lesson back tomorrow, shifting the rest of the program by a day.":"Saves this attempt to history and clears the check-offs so you can practice it again."}</p>
      </div>
    </div>
  </div>`;
}

/* ---------- Heatmap ---------- */
function heatmap(){
  const sch=schedInfo(), vd=viewDayNum();
  let h=`<div class="heat" role="grid" aria-label="Program calendar">`;
  for(let w=0; w<TOTAL/7; w++){
    h+=`<div class="wk">W${w+1}</div>`;
    for(let i=1;i<=7;i++){ const n=w*7+i, d=DAYS[n-1], st=status(n);
      const isT = !sch.notStarted && !sch.finished && n===sch.day;
      const tag = d.graduation?"🎓":d.review?"⭐":d.trick?"✨":"";
      h+=`<button class="cell ${st} ${isT?"today":""}" data-act="open" data-n="${n}" title="Day ${n}: ${esc(d.title)} — ${STATUS_LABEL[st]}" aria-label="Day ${n}, ${STATUS_LABEL[st]}">${n}${tag?`<span class="tag">${tag}</span>`:""}</button>`; }
  }
  h+=`</div><div class="legend"><span><i style="background:var(--green)"></i>Done</span><span><i style="background:var(--amber)"></i>In progress</span><span><i style="background:var(--coral)"></i>Struggled</span><span><i style="background:#fff;border:1.5px dashed #D9CBB8"></i>Not done</span><span><i style="box-shadow:0 0 0 2px var(--navy)"></i>Today</span><span>⭐ Review ✨ Trick</span></div>`;
  return h;
}

/* ---------- Program ---------- */
function viewProgram(){
  const sch=schedInfo(), comp=daysCompleted(), name=esc(dogName());
  let h=`<h1 class="page-title">${name}’s 6-week program</h1><p class="page-sub">${TOTAL} days · ${comp} complete · ${sch.notStarted?"starts "+esc(fmtDate(state.profile.startDate)):sch.finished?"program finished 🎓":"you’re on Day "+sch.day}</p>
  <div class="card"><h3><span class="h-ic">🗓️</span> Calendar <span class="spacer"></span><span class="small muted">Tap a day to open it</span></h3>${heatmap()}</div>`;
  PHASES.forEach(ph=>{
    const days=DAYS.filter(d=>d.week===ph.week), wc=days.filter(d=>isComplete(d.day)).length;
    h+=`<div class="week"><div class="week-head"><div class="num" style="background:${ph.color}">${ph.week}</div><div style="flex:1;min-width:0"><h3>${esc(ph.name)}</h3><div class="small muted">${esc(ph.tag)}</div></div><span class="chip">${wc}/7</span></div>`;
    days.forEach(d=>{ const st=status(d.day), isT=st==="today";
      const sk = d.skill ? SKILL[d.skill].name : "";
      const sub = d.review ? (d.combo?"Combines ":"Reviews ")+d.skills.length+" skills" : (d.title.toLowerCase().includes(sk.toLowerCase().split(" ")[0]) ? (d.trick?"Trick":SKILL[d.skill].cat) : sk);
      h+=`<button class="day-row ${isT?"is-today":""}" data-act="open" data-n="${d.day}"><div class="dn">DAY<b>${d.day}</b></div><div class="em">${dayEmoji(d)}</div><div class="tt"><b>${P(d.title)}</b><span>${esc(sub)} · ${sessCount(d.day)}×${minutesFor(d.day)} min</span></div><span class="status ${st}">${STATUS_LABEL[st]}${st==="partial"?" "+doneCount(d.day)+"/"+sessCount(d.day):""}</span></button>`; });
    h+=`</div>`;
  });
  return h;
}

/* ---------- Progress ---------- */
function viewProgress(){
  const name=esc(dogName()), comp=daysCompleted(), pct=Math.round(comp/TOTAL*100), st=streak(), best=bestStreak(), tot=totalSessions(), sch=schedInfo();
  const mastered=SKILLS.filter(s=>state.mastered[s.id]).length;
  const ratings={1:0,2:0,3:0}; Object.values(state.days).forEach(r=>{ if(r.r) ratings[r.r]++; });
  const notes=Object.keys(state.days).map(Number).filter(k=>state.days[k].n && state.days[k].n.trim()).sort((a,b)=>b-a);
  let h=`<h1 class="page-title">${name}’s progress</h1><p class="page-sub">${sch.notStarted?"Program starts "+esc(fmtDate(state.profile.startDate)):sch.finished?"Program complete — amazing work!":"Day "+sch.day+" of "+TOTAL}</p>
  <div class="stats">
    <div class="stat"><span class="e">🔥</span><div class="v">${st}</div><div class="l">Day streak${best>st?" · best "+best:""}</div></div>
    <div class="stat"><span class="e">✅</span><div class="v">${tot}</div><div class="l">Total sessions</div></div>
    <div class="stat"><span class="e">📅</span><div class="v">${comp}<span class="small muted">/${TOTAL}</span></div><div class="l">Days completed</div></div>
    <div class="stat"><span class="e">📈</span><div class="v">${pct}%</div><div class="l">Program complete</div></div>
  </div>
  <div class="card"><div class="row" style="margin-bottom:8px"><b>Overall progress</b><span class="spacer"></span><span class="small muted">${mastered}/${SKILLS.length} skills mastered</span></div>
    <div class="meter"><i style="width:${pct}%"></i></div>
    <div class="row small muted" style="margin-top:10px;gap:14px"><span>😅 Struggled: <b>${ratings[1]}</b></span><span>🙂 Okay: <b>${ratings[2]}</b></span><span>🌟 Nailed it: <b>${ratings[3]}</b></span></div></div>
  <div class="two-col"><div>
    <div class="card"><h3><span class="h-ic">🗓️</span> Training calendar</h3>${heatmap()}</div>
    <div class="card"><h3><span class="h-ic">📓</span> Training journal</h3>${notes.length?notes.slice(0,12).map(k=>{ const r=state.days[k]; return `<div class="journal-item"><b>Day ${k} · ${P(DAYS[k-1].title)}</b> ${r.r?RATINGS[r.r][0]:""}<p>${esc(r.n)}</p></div>`; }).join(""):`<div class="empty">No notes yet. Add notes on the Today tab after each day’s training.</div>`}</div>
  </div><div>
    <div class="card"><h3><span class="h-ic">🏅</span> Skills <span class="spacer"></span><span class="small muted">${mastered} mastered</span></h3>
      ${SKILLS.map(s=>{ const ss=skillStatus(s.id); return `<div class="skill-row"><div class="em">${s.emoji}</div><div class="nm"><b>${esc(s.name)}</b><span>${ss==="mastered"?"⭐ Mastered "+esc(fmtDate(state.mastered[s.id],{month:"short",day:"numeric"})):ss==="practicing"?"🟡 Practicing":"⚪ Not started"} · ${esc(s.cat)}</span></div><button class="mbtn ${ss==="mastered"?"on":""}" data-act="master" data-id="${s.id}">${ss==="mastered"?"⭐ Mastered":"☆ Mastered?"}</button></div>`; }).join("")}
    </div>
  </div></div>`;
  return h;
}
