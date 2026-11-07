/* ---------- audio ---------- */
let ac,master,dest,muted=false;
function volume(){if(master)master.gain.value=muted?0:+$('vol').value}
function audio(){if(!ac){try{ac=new(window.AudioContext||window.webkitAudioContext)();master=ac.createGain();dest=ac.createMediaStreamDestination();master.connect(ac.destination);master.connect(dest);volume()}catch(e){}}if(ac&&ac.state=='suspended')ac.resume().catch(()=>{})}
function rustle(){if(!ac)return;if(ac.state=='suspended')ac.resume().catch(()=>{});const n=ac.sampleRate*.4|0,b=ac.createBuffer(1,n,ac.sampleRate),d=b.getChannelData(0);
for(let i=0;i<n;i++)d[i]=(Math.random()*2-1)*Math.sin(Math.PI*i/n)**2;const s=ac.createBufferSource();s.buffer=b;
const f=ac.createBiquadFilter();f.type='bandpass';f.frequency.setValueAtTime(1500,ac.currentTime);f.frequency.linearRampToValueAtTime(4200,ac.currentTime+.4);
const g=ac.createGain();g.gain.value=.5;s.connect(f).connect(g).connect(master);s.start()}

/* ---------- pages ---------- */
let pdf=null,count=6,idx=0,turning=null,mode='pdf',turnToken=0;
function demo(n,x){const h=[210,160,25,280,345,100][n%6];x.fillStyle='#fffdf8';x.fillRect(0,0,768,1024);
const g=x.createLinearGradient(0,0,768,0);g.addColorStop(0,`hsl(${h},65%,42%)`);g.addColorStop(1,`hsl(${h+40},70%,55%)`);x.fillStyle=g;x.fillRect(0,0,768,170);
x.fillStyle='#fff';x.font='700 46px system-ui,sans-serif';x.fillText('Chapter '+(n+1),48,100);x.font='22px system-ui,sans-serif';x.fillText('Sample document · swipe or tap to turn',48,138);
x.fillStyle='#d9dde4';for(let i=0;i<9;i++)x.fillRect(48,220+i*30,i%4==3?420:672,12);
x.fillStyle=`hsl(${h},60%,50%)`;for(let i=0;i<6;i++){const v=60+((n*37+i*53)%140);x.fillRect(60+i*108,760-v,80,v)}
x.fillStyle='#8a93a3';x.fillRect(48,770,672,3);for(let i=0;i<4;i++)x.fillRect(48,820+i*30,i==3?300:672,12);x.font='20px system-ui,sans-serif';x.fillText(String(n+1),370,990)}
async function draw(n,P){const x=P.x;
if(!pdf)demo(n,x);else{x.fillStyle='#fff';x.fillRect(0,0,768,1024);const pg=await pdf.getPage(n+1),v=pg.getViewport({scale:1}),s=Math.min(768/v.width,1024/v.height),vp=pg.getViewport({scale:s});
await pg.render({canvasContext:x,viewport:vp,transform:[1,0,0,1,(768-vp.width)/2,(1024-vp.height)/2]}).promise}}
async function turn(d){const n=idx+d;if(mode!='pdf'||turning||n<0||n>=count)return;
const my=++turnToken;turning={d,n,t:0,go:false};
try{await draw(n,B)}catch(e){if(my===turnToken)turning=null;return}
if(my!==turnToken||!turning)return;
turning.go=true;rustle()}
function endTurn(){[A,B]=[B,A];idx=turning.n;turning=null;comp(0,1)}
async function reset(){turnToken++;turning=null;idx=0;try{await draw(0,A)}catch(e){pdf=null;count=6;try{await draw(0,A)}catch(e2){demo(0,A.x)}}
comp(0,1);wy=0;wv=0;webDirty=true}

/* ---------- camera stream ---------- */
let vsrc='demo',camFacing='user',camStream=null,camToken=0;
function stopCam(){if(camStream)camStream.getTracks().forEach(t=>t.stop());camStream=null}
async function startCam(){
const my=++camToken;stopCam();demoOn=false;
try{
  camStream=await navigator.mediaDevices.getUserMedia({video:{facingMode:camFacing,width:{ideal:1280}},audio:false});
  if(my!==camToken){camStream.getTracks().forEach(t=>t.stop());camStream=null;return}
  vid.removeAttribute('src');vid.srcObject=camStream;vsrc='cam';vid.muted=true;safePlay();
  $('camMsg').textContent=camFacing=='user'?'Front camera':'Rear camera';
}catch(e){
  if(my!==camToken)return;
  vid.srcObject=null;
  $('camMsg').textContent='Camera blocked. Allow access in the browser, or open this page directly if it is embedded.';
  if(mode=='cam'){led.material.color.set(0x2a2f38);useDemo();setMode('video')}
}}
function shoot(){if(!camStream||!vid.videoWidth){if(mode!=='cam')setMode('cam');return}
const c=document.createElement('canvas');c.width=vid.videoWidth;c.height=vid.videoHeight;const x=c.getContext('2d');
if(camFacing=='user'){x.translate(c.width,0);x.scale(-1,1)}x.drawImage(vid,0,0);rustle();
const u=c.toDataURL('image/jpeg',.92),im=new Image();im.src=u;modal(im,u,'jpg')}
function useDemo(){camToken++;stopCam();vsrc='demo';demoOn=true;dstream=dstream||dc.captureStream(30);
vid.removeAttribute('src');vid.srcObject=dstream;vid.muted=!vid._s;fit(.75,false);safePlay()}

/* ---------- mode ---------- */
function setMode(m){
const pv=mode;
turnToken++;turning=null;mode=m;comp(0,1);
base.visible=m=='pdf';vg.visible=m=='video'||m=='cam';syncWeb();
if(m=='web')webDirty=true;
document.querySelectorAll('[data-m]').forEach(b=>b.classList.toggle('on',b.dataset.m==m));
['pdf','video','web','cam'].forEach(k=>$('o_'+k).hidden=k!=m);
if(pv=='cam'&&m!='cam'){camToken++;stopCam()}
led.material.color.set(m=='cam'?0x22ee66:0x2a2f38);
if(m=='cam')startCam();
else if(m=='video'){if(vsrc=='cam'||(!vid.src&&!vid.srcObject))useDemo();else if(!paused)safePlay()}
else vid.pause()}

