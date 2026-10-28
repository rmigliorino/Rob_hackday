/* ---------- Generated specimens: sound and frequency forms (canvas) ---------- */
function rng(seed){let a=seed>>>0;return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function hash(s){let h=2166136261;for(const c of s){h^=c.charCodeAt(0);h=Math.imul(h,16777619);}return h>>>0;}
function sphere(ctx,x,y,rad,light,mid,dark){
  const g=ctx.createRadialGradient(x-rad*.35,y-rad*.4,rad*.05,x,y,rad);
  g.addColorStop(0,light);g.addColorStop(.55,mid);g.addColorStop(1,dark);
  ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,rad,0,6.2832);ctx.fill();
}
function mixHex(a,b,t){const p=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));const A=p(a),B=p(b);return "rgb("+A.map((v,i)=>Math.round(v+(B[i]-v)*t)).join(",")+")";}
const TAU=6.2832;
const DRAW={
  /* Lissajous trace: a glassy oscilloscope figure */
  glass(ctx,w,h,r,pal,p){
    const R=Math.min(w,h)*.27,a=2+Math.floor(r()*3),b=a+1+Math.floor(r()*2),d=r()*3.14+p*.35,rot=-.5+r();
    ctx.save();ctx.translate(w/2,h/2);ctx.rotate(rot);ctx.lineJoin="round";ctx.lineCap="round";
    const path=()=>{ctx.beginPath();for(let i=0;i<=720;i++){const t=i/720*TAU,x=Math.sin(a*t+d)*R,y=Math.sin(b*t)*R*.82;i?ctx.lineTo(x,y):ctx.moveTo(x,y);}};
    ctx.filter="blur("+Math.max(2,Math.round(R*.06))+"px)";path();ctx.strokeStyle="rgba(255,255,255,.3)";ctx.lineWidth=R*.11;ctx.stroke();ctx.filter="none";
    const g=ctx.createLinearGradient(-R,-R,R,R);g.addColorStop(0,"rgba(255,140,185,.7)");g.addColorStop(.5,"rgba(255,255,255,.85)");g.addColorStop(1,"rgba(110,145,255,.7)");
    path();ctx.strokeStyle=g;ctx.lineWidth=R*.05;ctx.stroke();
    path();ctx.strokeStyle="rgba(255,255,255,.9)";ctx.lineWidth=Math.max(1,R*.014);ctx.stroke();
    ctx.restore();
  },
  /* Ripples: rings of pearls spreading like a sound wave */
  pearls(ctx,w,h,r,pal,p){
    const R=Math.min(w,h)*.34,cx=w/2,cy=h/2,n=2+Math.floor(r()*4),dots=[];
    for(let k=0;k<6;k++){const base=R*(.1+k*.15),cnt=Math.round(9+k*9),sz=R*(.066-k*.007);
      for(let j=0;j<cnt;j++){const t=j/cnt*TAU,m=1+.045*Math.sin(n*t+p*1.3-k*.8);
        dots.push({x:cx+Math.cos(t)*base*m,y:cy+Math.sin(t)*base*m*.88,s:Math.max(1.4,sz*(1+.28*Math.sin(t*n+p-k))),hot:(j+k*3)%19===0});}}
    dots.sort((a,b)=>a.y-b.y);
    dots.forEach(d=>sphere(ctx,d.x,d.y,d.s,"#ffffff",d.hot?"#f3a3b8":pal[2],d.hot?"#d0306a":"#e1a596"));
  },
  /* Radial spectrum: an equaliser ring with studded tips */
  studded(ctx,w,h,r,pal,p){
    const R=Math.min(w,h)*.32,cx=w/2,cy=h/2,N=60,f1=2+r()*4,f2=1+r()*3,ph=r()*6;
    const cols=["#6f6f52","#c8ac52","#2c5bd2","#3a3a3a","#d8c174"];
    ctx.lineCap="round";
    for(let i=0;i<N;i++){const t=i/N*TAU,amp=.12+.34*Math.abs(Math.sin(t*f1+ph+p*.9)*Math.cos(t*f2-p*.5)),r0=R*.44,r1=r0+R*amp*.9;
      const c=Math.cos(t),s=Math.sin(t),x0=cx+c*r0,y0=cy+s*r0,x1=cx+c*r1,y1=cy+s*r1;
      ctx.strokeStyle="#cfcfd6";ctx.lineWidth=R*.04;ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(x1,y1);ctx.stroke();
      ctx.strokeStyle="rgba(255,255,255,.95)";ctx.lineWidth=R*.016;ctx.beginPath();ctx.moveTo(x0-1,y0-1);ctx.lineTo(x1-1,y1-1);ctx.stroke();
      if(i%2===0)sphere(ctx,x1,y1,R*.024,"#ffffff",cols[i%cols.length],"#444");}
    const g=ctx.createRadialGradient(cx-R*.12,cy-R*.15,R*.02,cx,cy,R*.42);g.addColorStop(0,"#ffffff");g.addColorStop(.7,"#dcdce2");g.addColorStop(1,"#a3a3ad");
    ctx.fillStyle=g;ctx.beginPath();ctx.arc(cx,cy,R*.4,0,TAU);ctx.fill();
    for(let i=0;i<34;i++){const a=r()*TAU,d=Math.sqrt(r())*R*.34;sphere(ctx,cx+Math.cos(a)*d,cy+Math.sin(a)*d,R*.016,"#ffffff",cols[i%4],"#222");}
  },
  /* Waveform ribbons: layered sine tubes */
  ribbon(ctx,w,h,r,pal,p){
    const R=Math.min(w,h)*.3,cx=w/2,cy=h/2,L=R*.085,k=1.5+r()*2;
    const dark="#3b2a8f",mid="#5a46c8",lite="#8d7ce6";ctx.lineCap="round";ctx.lineJoin="round";
    for(let j=0;j<5;j++){const off=(j-2)*R*.18,ph=j*.55+p;
      const path=(dx,dy)=>{ctx.beginPath();for(let i=0;i<=90;i++){const u=i/90*2-1,env=Math.cos(u*1.5708),x=cx+u*R*1.3,y=cy+off*env+Math.sin(u*k*3.1416+ph)*R*.26*env;i?ctx.lineTo(x+dx,y+dy):ctx.moveTo(x+dx,y+dy);}};
      path(0,0);ctx.strokeStyle=dark;ctx.lineWidth=L;ctx.stroke();
      path(-L*.12,-L*.16);ctx.strokeStyle=mid;ctx.lineWidth=L*.68;ctx.stroke();
      ctx.globalAlpha=.65;path(-L*.2,-L*.26);ctx.strokeStyle=lite;ctx.lineWidth=L*.24;ctx.stroke();ctx.globalAlpha=1;}
  },
  /* Frequency ridges: stacked signal traces in gold */
  branch(ctx,w,h,r,pal,p){
    const cx=w/2,cy=h/2,W=Math.min(w,h)*.74,H=Math.min(w,h)*.52,n=12,peaks=Array.from({length:6},()=>[r()*2-1,r()*.5+.3,r()*6]);
    ctx.lineJoin="round";
    for(let j=0;j<n;j++){const base=cy-H/2+j*(H/(n-1)),pts=[];
      for(let i=0;i<=100;i++){const u=i/100*2-1,env=Math.exp(-u*u*3.2);let a=0;
        peaks.forEach(s=>{a+=s[1]*Math.exp(-((u-s[0]*.5)**2)*30)*(.6+.4*Math.sin(s[2]+j*.7+p));});
        a+=.07*Math.sin(u*40+j*3+p*2);pts.push([cx+u*W/2,base-env*a*H*.55]);}
      const trace=()=>{ctx.beginPath();pts.forEach((q,i)=>i?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]));};
      trace();ctx.lineTo(cx+W/2,base+6);ctx.lineTo(cx-W/2,base+6);ctx.closePath();
      ctx.fillStyle=mixHex(pal[0],pal[1],Math.min(1,Math.max(0,base/h)));ctx.fill();
      trace();ctx.strokeStyle="rgba(138,106,34,.55)";ctx.lineWidth=2;ctx.stroke();ctx.strokeStyle="rgba(255,248,225,.9)";ctx.lineWidth=1;ctx.stroke();}
  },
  /* Speaker: a perforated driver whose cone pulses */
  metal(ctx,w,h,r,pal,p){
    const R=Math.min(w,h)*.27,H=R*.62;ctx.save();ctx.translate(w/2,h/2+R*.1);ctx.rotate(-.32+r()*.12);
    const ry=R*.42;
    const side=ctx.createLinearGradient(-R,0,R,0);side.addColorStop(0,"#1c1c1e");side.addColorStop(.45,"#4a4a4e");side.addColorStop(.6,"#2a2a2d");side.addColorStop(1,"#121214");
    ctx.beginPath();ctx.ellipse(0,0,R,ry,0,0,Math.PI);ctx.lineTo(-R,-H);ctx.ellipse(0,-H,R,ry,0,Math.PI,0,true);ctx.closePath();ctx.fillStyle=side;ctx.fill();
    ctx.save();ctx.clip();
    for(let row=0;row<7;row++)for(let c=-16;c<=16;c++){const t=c/16,x=t*R*.97,yb=Math.sqrt(1-t*t)*ry,y=-H*.12-row*H*.12+yb,s=R*.022*Math.sqrt(1-t*t);
      if(s<.6)continue;ctx.fillStyle="#08080a";ctx.beginPath();ctx.ellipse(x,y,s,s*1.1,0,0,TAU);ctx.fill();}
    ctx.restore();
    const rim=ctx.createLinearGradient(-R,-H-ry,R,-H+ry);rim.addColorStop(0,"#f4f4f5");rim.addColorStop(.5,"#9c9da1");rim.addColorStop(1,"#d9dadc");
    ctx.beginPath();ctx.ellipse(0,-H,R,ry,0,0,TAU);ctx.fillStyle=rim;ctx.fill();
    const top=ctx.createLinearGradient(-R,-H,R,-H);top.addColorStop(0,"#c8c9cc");top.addColorStop(.35,"#ffffff");top.addColorStop(.7,"#a4a5a9");top.addColorStop(1,"#e6e7e9");
    ctx.beginPath();ctx.ellipse(0,-H,R*.9,ry*.88,0,0,TAU);ctx.fillStyle=top;ctx.fill();
    for(let k=1;k<=6;k++){const s=k/7*(1+.012*Math.sin(p*3-k));ctx.beginPath();ctx.ellipse(0,-H,R*.9*s,ry*.88*s,0,0,TAU);ctx.strokeStyle="rgba(20,20,24,"+(.08+k*.025)+")";ctx.lineWidth=1.2;ctx.stroke();}
    const dome=ctx.createRadialGradient(-R*.05,-H-ry*.12,1,0,-H,R*.16);dome.addColorStop(0,"#ffffff");dome.addColorStop(1,"#8d8e92");
    ctx.beginPath();ctx.ellipse(0,-H,R*.15*(1+.02*Math.sin(p*3)),ry*.14*(1+.02*Math.sin(p*3)),0,0,TAU);ctx.fillStyle=dome;ctx.fill();
    ctx.restore();
  }
};
function paintSpecimen(canvas,p){
  const pal=PAL[canvas.dataset.pal],mat=canvas.dataset.mat,seed=+canvas.dataset.seed;
  const box=canvas.getBoundingClientRect();if(!box.width)return;
  const dpr=Math.min(window.devicePixelRatio||1,2),W=Math.round(box.width*dpr),Hh=Math.round(box.height*dpr);
  if(canvas.width!==W||canvas.height!==Hh){canvas.width=W;canvas.height=Hh;}
  const ctx=canvas.getContext("2d");ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,box.width,box.height);
  const w=box.width,h=box.height;
  const sh=ctx.createRadialGradient(w/2,h*.88,0,w/2,h*.88,w*.28);sh.addColorStop(0,"rgba(0,0,0,.05)");sh.addColorStop(1,"rgba(0,0,0,0)");
  ctx.fillStyle=sh;ctx.fillRect(0,0,w,h);
  try{DRAW[mat](ctx,w,h,rng(seed),pal,p||0);}catch(e){}
}
function paintAll(){document.querySelectorAll("canvas[data-mat]").forEach(c=>paintSpecimen(c,0));}
let rz;window.addEventListener("resize",()=>{clearTimeout(rz);rz=setTimeout(paintAll,150);});
const RM=matchMedia("(prefers-reduced-motion: reduce)");
let liveLast=0;
function liveLoop(now){
  if(now-liveLast>60){liveLast=now;
    document.querySelectorAll("canvas[data-live]").forEach(c=>{const b=c.getBoundingClientRect();if(b.bottom>0&&b.top<innerHeight)paintSpecimen(c,now/4500);});}
  requestAnimationFrame(liveLoop);
}
if(!RM.matches)requestAnimationFrame(liveLoop);
