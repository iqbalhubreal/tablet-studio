/* ---------- loop ---------- */
let paused=false,proT=0,flipT=0,ad=1,last=performance.now(),fc=0,ft=0,sp=1;
const rc=new T.Raycaster(),v2=new T.Vector2();
const hudModeEl=$('sMode'),hudPgEl=$('sPg'),hudCamEl=$('sCam'),hudFpsEl=$('sFps'),rtEl=$('rt');
let hudMode='',hudPg='',hudCam='';
const modeNames={pdf:'PDF',video:'Video',web:'Web',cam:'Camera'};
function hit(e){const b=cv.getBoundingClientRect();v2.set((e.clientX-b.left)/b.width*2-1,-((e.clientY-b.top)/b.height*2-1));rc.setFromCamera(v2,cam);return rc.intersectObject(base)[0]||null}
function frame(now){
requestAnimationFrame(frame);
const rd=Math.min(.05,(now-last)/1000);last=now;
const dt=paused?0:rd;
fc++;ft+=rd;
if(ft>.5){hudFpsEl.textContent=Math.round(fc/ft);fc=ft=0}
/* page turn animation */
if(turning&&turning.go){turning.t=Math.min(1,turning.t+dt*sp/.4);comp(1-Math.pow(1-turning.t,3),turning.d);if(turning.t>=1)endTurn()}
/* built-in browser inertia + dirty-flagged redraw */
if(mode=='web'&&webLocal){
  if(Math.abs(wv)>1&&!(dr&&dr.on)){wy=clamp(wy+wv*rd,0,WMAX);wv*=Math.exp(-rd*4);webDirty=true}
  if(webDirty){drawWeb();webDirty=false}
}
if(mode=='video'&&demoOn&&!paused)drawClip(now/1000);
/* camera */
let az,el,rr;
if(pro.checked){
  proT+=dt;[az,el,rr]=director(proT);
  if(styV!='loop'&&mode=='pdf'&&!turning&&!paused){flipT+=dt*sp;if(flipT>3.2){flipT=0;if(idx+ad<0||idx+ad>=count)ad=-ad;turn(ad)}}
}else{
  introT=Math.min(1,introT+dt*sp/3.6);
  const k=1-ease(introT);
  az=view.az+(from.az-view.az)*k;el=view.el+(from.el-view.el)*k;rr=view.r+(from.r-view.r)*k;
}
if(cam.aspect<1)rr*=1.45;
cam.position.set(rr*Math.sin(az)*Math.cos(el),tgt.y+rr*Math.sin(el),.05+rr*Math.cos(az)*Math.cos(el));
cam.lookAt(tgt);
penUpdate(now,rd);
R.render(S,cam);
if(mode=='web'&&!webLocal){css3d();$('web').style.visibility=cam.position.z>.2?'visible':'hidden'}
/* HUD change-only updates */
const mTxt=modeNames[mode];
if(hudMode!==mTxt){hudModeEl.textContent=mTxt;hudMode=mTxt}
const pTxt=mode=='pdf'?`${idx+1} / ${count}`:'—';
if(hudPg!==pTxt){hudPgEl.textContent=pTxt;hudPg=pTxt}
const cTxt=pro.checked?'Auto shoot':introT<1?'Intro':'Free orbit';
if(hudCam!==cTxt){hudCamEl.textContent=cTxt;hudCam=cTxt}
/* recording clock */
if(rec&&rec.state==='recording'){
  const e=(now-recT0)/1000;
  if(now-lastRecHud>200){const m=e/60|0;rtEl.textContent='REC '+String(m).padStart(2,'0')+':'+String(e%60|0).padStart(2,'0');lastRecHud=now}
  if(recLen&&e>=recLen){try{rec.stop()}catch(x){}}
}
}
