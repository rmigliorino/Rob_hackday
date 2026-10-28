/* ---------- State and UI ---------- */
const st={};FORCES.forEach(f=>st[f.id]=null);
const $=s=>document.querySelector(s);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const cites=a=>(a||[]).map(k=>`<a class="cite" href="${SRC[k].u}" target="_blank" rel="noopener" title="${esc(SRC[k].t)}">[${num(k)}]</a>`).join(" ");
let generated=null,dirty=false,tuning=false;
const answered=()=>FORCES.filter(f=>st[f.id]).length;
const complete=()=>answered()===FORCES.length;
const hz=s=>(110+(hash(s)%78000)/100).toFixed(1);

function buildQs(){
  $("#qs").innerHTML=FORCES.map((f,n)=>`
   <fieldset class="q">
     <legend><span class="ch">CH 0${n+1}</span>${f.q}<small>${f.help}</small></legend>
     <div class="seg">${f.stages.map((s,i)=>`<input type="radio" name="q-${f.id}" id="q-${f.id}-${i+1}" value="${i+1}"><label for="q-${f.id}-${i+1}">${s[0]}</label>`).join("")}</div>
   </fieldset>`).join("");
  FORCES.forEach(f=>document.querySelectorAll(`input[name="q-${f.id}"]`).forEach(r=>r.addEventListener("change",e=>{st[f.id]=+e.target.value;onChange();})));
}
function syncQs(){FORCES.forEach(f=>{const r=document.getElementById(`q-${f.id}-${st[f.id]}`);if(r)r.checked=true;});}
function updateStatus(){
  const s=$("#status"),b=$("#genBtn"),n=answered();
  b.disabled=!complete()||tuning;
  s.classList.toggle("dirty",!!(generated&&dirty));
  if(tuning)s.textContent="Tuning…";
  else if(!complete())s.textContent=`Answer all five to generate · ${n} of 5 set`;
  else if(generated&&dirty)s.textContent="Choices changed. Generate again.";
  else if(generated)s.textContent="Generated from your current choices.";
  else s.textContent="All five set. Ready to generate.";
}
function onChange(){if(generated)dirty=true;updateStatus();}
function nearest(){const v=FORCES.map(f=>st[f.id]);return FUTURES.map(F=>({F,d:Math.sqrt(F.p.reduce((a,x,i)=>a+(x-v[i])**2,0))})).sort((a,b)=>a.d-b.d);}
function unit(){return{ai:(st.ai-1)/2,gains:(st.gains-1)/2,earn:(st.earn-1)/2,shock:(st.world-1)/2,climate:(st.climate-1)/2};}
const level=s=>s>=.7?"Strong signal":s>=.5?"Building":"Faint";
function code(snap){return FORCES.map(f=>f.ab+snap[f.id]).join(".");}

function pickSubs(random){
  const u=unit(),scored=SUBS.map(x=>({...x,sc:Math.min(1,x.s(u))})).sort((a,b)=>b.sc-a.sc),out=[],used=new Set();
  if(!random){for(const x of scored){if(out.length===3)break;if(used.has(x.d))continue;out.push(x);used.add(x.d);}}
  else{
    let pool=scored.filter(x=>x.sc>=.45);if(pool.length<4)pool=scored.slice(0,6);
    const prev=new Set((generated?.subs||[]).map(x=>x.t));
    while(out.length<3&&pool.length){
      const cand=pool.filter(x=>!used.has(x.d)&&!(prev.has(x.t)&&pool.length>4)),list=cand.length?cand:pool;
      const tot=list.reduce((a,x)=>a+x.sc**2,0);let q=Math.random()*tot,ch=list[0];
      for(const x of list){q-=x.sc**2;if(q<=0){ch=x;break;}}
      out.push(ch);used.add(ch.d);pool=pool.filter(x=>x!==ch);
    }
    out.sort((a,b)=>b.sc-a.sc);
  }
  return out;
}

/* ---------- Tuning animation ---------- */
function runTuner(F,snap,done){
  const tuner=$("#tuner"),win=$("#tunerWin"),cv=$("#tunerCanvas"),P=PAL[F.pal],cd=code(snap),fin=+hz(cd+F.name);
  win.style.setProperty("--c1",P[0]);win.style.setProperty("--c2",P[1]);
  $("#meters").innerHTML=FORCES.map((f,i)=>`<li><span class="mlab">CH 0${i+1} · ${f.label}</span><span class="meter" id="m${i}">${"<i></i>".repeat(12)}</span><span class="mval">${f.stages[snap[f.id]-1][0]}</span></li>`).join("");
  tuner.hidden=false;
  const steps=["Reading your five channels","Tuning frequencies","Mixing the signal","Mastering your future"];
  const DUR=RM.matches?500:1900,t0=performance.now();
  const freqs=FORCES.map((f,i)=>1.1+snap[f.id]*.85+i*.37),amps=FORCES.map((f,i)=>.55+.15*snap[f.id]);
  const ease=x=>1-Math.pow(1-x,3);
  function frame(now){
    const t=Math.min(1,(now-t0)/DUR),e=ease(t);
    const box=cv.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,2);
    if(cv.width!==Math.round(box.width*dpr)){cv.width=Math.round(box.width*dpr);cv.height=Math.round(box.height*dpr);}
    const ctx=cv.getContext("2d"),w=box.width,h=box.height;ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);
    const ph=RM.matches?0:now/520;
    // faint grid like a scope
    ctx.strokeStyle="rgba(255,255,255,.08)";ctx.lineWidth=1;
    for(let x=0;x<=w;x+=w/8){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,h);ctx.stroke();}
    for(let y=0;y<=h;y+=h/4){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke();}
    // five channel waves converging to one
    FORCES.forEach((f,i)=>{
      const lane=(i-2)*h*.1*(1-e),A=h*.07*amps[i]*(1-.4*e),jit=(1-e);
      ctx.beginPath();
      for(let k=0;k<=160;k++){const u=k/160,x=u*w;
        const y=h/2+lane+Math.sin(u*TAU*freqs[i]+ph+i)*A+(jit?(Math.sin(u*97+ph*3+i*5)*h*.01*jit):0);
        k?ctx.lineTo(x,y):ctx.moveTo(x,y);}
      ctx.strokeStyle=`rgba(255,255,255,${.2+.25*(1-e)})`;ctx.lineWidth=1.1;ctx.stroke();
    });
    if(t>.55){const a=Math.min(1,(t-.55)/.35);
      ctx.beginPath();
      for(let k=0;k<=200;k++){const u=k/200,x=u*w;let y=0;FORCES.forEach((f,i)=>{y+=Math.sin(u*TAU*freqs[i]+ph+i)*amps[i];});
        y=h/2+y/FORCES.length*h*.28*Math.sin(u*Math.PI);k?ctx.lineTo(x,y):ctx.moveTo(x,y);}
      ctx.strokeStyle=`rgba(255,255,255,${a*.9})`;ctx.lineWidth=1.8;ctx.shadowColor="rgba(255,255,255,.6)";ctx.shadowBlur=4*a;ctx.stroke();ctx.shadowBlur=0;}
    // scan line
    
    // meters
    FORCES.forEach((f,i)=>{const lock=.18+i*.12,target=snap[f.id]*4;
      const lvl=t>=lock?target:Math.max(1,Math.round(2+Math.abs(Math.sin(now/220+i*1.7))*5));
      const m=document.getElementById("m"+i);if(m)[...m.children].forEach((c,j)=>c.classList.toggle("on",j<lvl));
      const li=m&&m.parentElement;if(li)li.classList.toggle("locked",t>=lock);});
    $("#tunerHz").textContent=(t<1?110+(fin-110)*e:fin).toFixed(1)+" HZ";
    $("#tunerStatus").textContent=t<1?steps[Math.min(3,Math.floor(t*4))]+"…":`Locked on ${fin.toFixed(1)} Hz · ${F.name}`;
    if(t<1)requestAnimationFrame(frame);
    else setTimeout(()=>{tuner.hidden=true;done();},RM.matches?100:250);
  }
  requestAnimationFrame(frame);
}

function generate(){
  if(!complete()||tuning)return;
  const ranked=nearest(),F=ranked[0].F,next=ranked[1].F,close=ranked[1].d-ranked[0].d<0.5;
  generated={F,next,close,subs:pickSubs(false),snap:{...st},roll:0};
  dirty=false;tuning=true;updateStatus();
  $("#out").hidden=false;$("#results").hidden=true;
  $("#out").scrollIntoView({behavior:RM.matches?"auto":"smooth",block:"start"});
  runTuner(F,generated.snap,()=>{tuning=false;$("#results").hidden=false;render();updateStatus();});
}
function windowHTML(pal,mat,seed,tab,codeTxt,live){
  const p=PAL[pal];
  return `<div class="window" style="--c1:${p[0]};--c2:${p[1]}">
    <span class="tab">${tab}</span>
    <div class="float"><canvas data-pal="${pal}" data-mat="${mat}" data-seed="${seed}" ${live?"data-live":""} aria-hidden="true"></canvas></div>
    <span class="code">${codeTxt}</span></div>`;
}
function render(){
  const {F,next,close,subs,snap,roll,showChoices}=generated,cd=code(snap),fhz=hz(cd+F.name);
  $("#future").innerHTML=`
    ${windowHTML(F.pal,F.mat,hash(cd+F.name),"2050",fhz+" HZ",true)}
    <div class="card-body">
      <span class="subtitle">Your generated future · signal ${cd}${close?` · close to <b>${next.name}</b>`:""}</span>
      <h2 class="caps">${F.name}</h2>
      <p class="lede">${F.lede}</p>
      <div class="world">
        <button class="ghost playback" id="playBtn" type="button" aria-expanded="${!!showChoices}" aria-controls="worldList"><svg viewBox="0 0 10 10" aria-hidden="true"><path d="M2 1l7 4-7 4z" fill="currentColor"/></svg><span>${showChoices?"Hide your choices":"Play back your choices"}</span></button>
        <div class="world-list" id="worldList" ${showChoices?"":"hidden"}><span class="label">Life in this world · your five choices</span>${FORCES.map((f,n)=>{const sg=f.stages[snap[f.id]-1];return `<div class="wi"><span class="k">${sg[0]}<small>CH 0${n+1} · ${f.label}</small></span><span>${sg[1]} ${cites(sg[2])}</span></div>`}).join("")}</div>
      </div>
      <div class="readouts">${F.figs.map(x=>`<div class="readout"><b>${x[0]}</b><span>${x[1]} ${cites(x[2])}</span></div>`).join("")}</div>
      <div class="finlife"><span class="chip">Financial life in this world</span><p>${F.fin}</p></div>
      <p class="refs">Built from: ${F.refs.map(r=>`${r[0]} ${cites(r[1])}`).join(" · ")}</p>
    </div>`;
  $("#subs").innerHTML=subs.map((x,i)=>{
    const look=DRIVER_LOOK[x.d],p=PAL[look[0]];
    return `<article class="card sub" style="--c1:${p[0]};--c2:${p[1]}">
      ${windowHTML(look[0],look[1],hash(x.t+cd+roll),"SUB-FUTURE 0"+(i+1),hz(x.t+cd)+" HZ",false)}
      <div class="card-body">
        <div class="steps"><span>0${i+1}</span><span class="bar"><i style="width:${(i+1)/3*100}%"></i></span><span class="of">03</span></div>
        <h3 class="caps">${x.t}</h3>
        <span class="drv">Driven by ${DRIVER_LABEL[x.d].toLowerCase()}</span>
        <div class="tags"><span class="str">${level(x.sc)}</span>${x.areas.map(a=>`<span>${a}</span>`).join("")}</div>
        <p class="what">${x.what}</p>
        <ul class="timeline">${x.tl.map(t=>`<li><span class="when">${t[0]}</span><span>${t[1]} ${cites(t[2])}</span></li>`).join("")}</ul>
        <div class="story"><span class="who">${x.who} · illustrative</span>${x.story}</div>
        <div class="hmw"><span class="chip">Financial services · How might we</span><p>How might we ${x.hmw}</p></div>
      </div>
    </article>`}).join("");
  const r=$("#results");r.classList.remove("fresh");void r.offsetWidth;r.classList.add("fresh");
  $("#playBtn").addEventListener("click",e=>{const b=e.currentTarget,open=b.getAttribute("aria-expanded")!=="true";
    generated.showChoices=open;b.setAttribute("aria-expanded",open);$("#worldList").hidden=!open;
    b.lastElementChild.textContent=open?"Hide your choices":"Play back your choices";});
  requestAnimationFrame(paintAll);
}
function summary(){
  const {F,subs,snap}=generated,L=[`FUTURE: ${F.name}`,F.lede,"",
    "Choices: "+FORCES.map(f=>`${f.label}: ${f.stages[snap[f.id]-1][0]}`).join(" | "),
    "",`Financial life: ${F.fin}`,""];
  subs.forEach((x,i)=>L.push(`SUB-FUTURE ${i+1}: ${x.t}`,x.what,`Story (illustrative), ${x.who}: ${x.story}`,`HMW: How might we ${x.hmw}`,""));
  L.push("Sources: see the Futures Mixing Desk source list.");return L.join("\n");
}
$("#genBtn").addEventListener("click",generate);
$("#rerollBtn").addEventListener("click",()=>{if(dirty){generate();return;}generated.subs=pickSubs(true);generated.roll++;render();});
$("#drawBtn").addEventListener("click",()=>{FORCES.forEach(f=>st[f.id]=1+Math.floor(Math.random()*3));syncQs();onChange();});
$("#copyBtn").addEventListener("click",()=>{
  const txt=summary(),t=$("#toast");
  navigator.clipboard.writeText(txt).then(()=>{t.textContent="Copied. Paste it into Mural or your notes.";})
  .catch(()=>{t.textContent="Copying is blocked here, so the text is selected below. Copy it manually.";
    let ta=document.getElementById("copyFallback");if(!ta){ta=document.createElement("textarea");ta.id="copyFallback";ta.rows=8;t.after(ta);}
    ta.value=txt;ta.select();});
});
$("#sources").innerHTML=KEYS.map((k,i)=>`<li><span class="k">[${i+1}]</span><a href="${SRC[k].u}" target="_blank" rel="noopener">${esc(SRC[k].t)}</a></li>`).join("");
buildQs();updateStatus();
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(()=>{if(generated)paintAll();});
