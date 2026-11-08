/* ---------- input ---------- */
let dr=null,lw=0;
cv.onpointerdown=e=>{
audio();
const h=hit(e);
dr={x:e.clientX,y:e.clientY,sx:e.clientX,sy:e.clientY,m:0,uy:h?h.uv.y:0,pen:!!h&&mode!='cam',on:!!h&&(mode=='pdf'||(mode=='web'&&webLocal)),vy:0,vt:0};
if(dr.pen){penTouch(h.uv);penDown=true}
cv.setPointerCapture(e.pointerId);
};
cv.onpointermove=e=>{
if(dr&&dr.pen){
  if(dr.on){const h=hit(e);if(h)penTouch(h.uv)}
  else if(dr.m>6)penDown=false;
}
if(!dr)return;
const dx=e.clientX-dr.x,dy=e.clientY-dr.y;
dr.m+=Math.abs(dx)+Math.abs(dy);dr.x=e.clientX;dr.y=e.clientY;
if(dr.on&&mode=='web'){
  const h=hit(e);
  if(h){
    const d=(h.uv.y-dr.uy)*1024;
    dr.uy=h.uv.y;
    wy=clamp(wy+d,0,WMAX);
    webDirty=true;
    dr.vy=d;dr.vt=performance.now();
  }
}
if(!pro.checked&&!dr.on){view.az-=dx*.006;view.el=clamp(view.el+dy*.004,-.05,1.2)}
};
function releaseDr(e,cancelled){
if(!dr)return;
const d=dr;dr=null;
penDown=false;penHold=performance.now()+(d.m<6?420:150);
/* fling */
if(mode=='web'&&webLocal&&!cancelled){
  const dt=(performance.now()-(d.vt||performance.now()))/1000;
  if(dt>0&&dt<0.15&&Math.abs(d.vy||0)>2){wv=clamp((d.vy||0)/dt,-5000,5000);webDirty=true}
}
if(cancelled)return;
const tx=e?(e.clientX-d.sx):0;
	if(d.on&&Math.abs(tx)>40)turn(tx<0?1:-1);
	else if(d.m<6&&e){const h=hit(e);
	if(h&&mode=='web'&&h.uv.y<.095&&h.uv.x<.13){tabletBack();return}
	if(h&&mode=='pdf')turn(h.uv.x>.5?1:-1);else if(h&&mode=='video')vp()}
}
cv.onpointerup=e=>releaseDr(e,false);
cv.onpointercancel=e=>releaseDr(e,true);
cv.onlostpointercapture=e=>releaseDr(e,true);
cv.addEventListener('wheel',e=>{
e.preventDefault();
const H=hit(e);
if(H&&mode=='web'&&webLocal){wy=clamp(wy+e.deltaY*.9,0,WMAX);wv=e.deltaY*3;webDirty=true}
else if(H&&mode=='pdf'){if(performance.now()-lw>550){lw=performance.now();turn(e.deltaY>0?1:-1)}}
else view.r=clamp(view.r*(1+e.deltaY*.001),1.2,5)
},{passive:false});
function vp(){if(vid.paused)safePlay();else vid.pause()}
function pause(){paused=!paused;$('pb').textContent=paused?'▶ Play':'⏸ Pause';$('qp').textContent=paused?'▶':'⏸';if(mode=='video'){if(paused)vid.pause();else safePlay()}}
function mute(){muted=!muted;$('mb').textContent=muted?'🔇 Unmute':'🔊 Mute';volume()}
$('pb').onclick=$('qp').onclick=pause;$('mb').onclick=mute;$('vol').oninput=volume;
$('rs').onclick=()=>{introT=0;Object.assign(view,{az:.3,el:.2,r:2.7});reset()};
spd.oninput=()=>{sp=+spd.value;$('spv').textContent=sp.toFixed(1)+'×'};
document.querySelectorAll('[data-m]').forEach(b=>b.onclick=()=>{audio();setMode(b.dataset.m)});
$('pv').onclick=()=>turn(-1);$('nx').onclick=()=>turn(1);
$('dm').onclick=()=>{pdf=null;count=6;reset()};
$('pdfB').onclick=()=>{
  if(typeof pdfjsLib==='undefined'){alert('PDF library failed to load — check your connection.');return}
  $('pdfIn').click()
};
$('vidB').onclick=()=>$('vidIn').click();
$('pdfIn').onchange=async e=>{
  const f=e.target.files[0];if(!f)return;
  if(typeof pdfjsLib==='undefined'){alert('PDF library failed to load.');e.target.value='';return}
  try{pdf=await pdfjsLib.getDocument({data:await f.arrayBuffer()}).promise;count=pdf.numPages;await reset();setMode('pdf')}
  catch(x){alert('That file couldn’t be read as a PDF.');pdf=null;count=6;reset()}
  e.target.value=''
};
$('vidIn').onchange=e=>{
  const f=e.target.files[0];if(!f)return;
  audio();demoOn=false;
  if(ac&&!vid._s){try{vid._s=ac.createMediaElementSource(vid);vid._s.connect(master)}catch(x){}}
  camToken++;stopCam();
  vsrc='file';vid.srcObject=null;vid.src=URL.createObjectURL(f);vid.muted=!ac;safePlay();
  e.target.value='';setMode('video')
};
vid.onloadedmetadata=()=>{if(vid.videoWidth)fit(vid.videoWidth/vid.videoHeight,vsrc=='cam'&&camFacing=='user')};
$('vd').onclick=useDemo;
$('go').onclick=()=>{let u=$('url').value.trim();if(!u)return;if(!/^https?:/i.test(u))u='https://'+u;openSite(u)};
$('bi').onclick=()=>{webLocal=true;curUrl=null;webHist=[];fr.src='about:blank';syncWeb();webDirty=true};
$('tabletBack').onclick=tabletBack;
$('ot').onclick=()=>{let u=$('url').value.trim();if(u)window.open(/^https?:/i.test(u)?u:'https://'+u,'_blank','noopener')};
$('cs').onclick=shoot;
$('cf').onclick=()=>{if(mode!=='cam')return;camFacing=camFacing=='user'?'environment':'user';startCam()};
$('url').onkeydown=e=>{if(e.key=='Enter')$('go').click()};
$('rbn').onclick=$('qr').onclick=startRec;
$('snap').onclick=snap;
$('qg').onclick=()=>$('panel').classList.toggle('open');
$('mc').onclick=closeModal;
const proUI=()=>{
[asp,sty,qual,len].forEach(s=>s.disabled=!pro.checked);
$('loopO').hidden=!(pro.checked&&sty.value=='loop');
styV=sty.value;lcamV=$('lcam').value;
proT=0;flipT=0;
if(!pro.checked&&introT<1)introT=1;
layout()
};
[pro,asp,sty,qual,len,$('lcam')].forEach(e=>e.addEventListener('change',proUI));
addEventListener('resize',layout);
addEventListener('keydown',e=>{
if(e.key=='Escape'&&$('modal').style.display=='flex'){closeModal();return}
if(e.target.matches('input[type=text],input[type=range],select,textarea,[contenteditable]'))return;
audio();const k=e.key.toLowerCase();
if(k==' '){e.preventDefault();pause()}
else if(k=='r')startRec();else if(k=='m')mute();else if(k=='p')snap();
else if(e.key=='ArrowRight')turn(1);else if(e.key=='ArrowLeft')turn(-1);
else if(k=='1')setMode('pdf');else if(k=='2')setMode('video');else if(k=='3')setMode('web');else if(k=='4')setMode('cam')
});
if(matchMedia('(max-width:700px),(pointer:coarse)').matches)$('panel').classList.remove('open');

/* boot */
layout();reset();requestAnimationFrame(frame);
