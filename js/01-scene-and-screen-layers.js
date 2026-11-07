const $=i=>document.getElementById(i),T=THREE,cv=$('c'),clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const pro=$('pro'),asp=$('asp'),sty=$('sty'),qual=$('qual'),len=$('len'),spd=$('spd'),fr=$('fr');
if(typeof pdfjsLib!=='undefined'){try{pdfjsLib.GlobalWorkerOptions.workerSrc='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'}catch(e){}}

/* ---------- scene ---------- */
const R=new T.WebGLRenderer({canvas:cv,antialias:true,preserveDrawingBuffer:true});
R.outputEncoding=T.sRGBEncoding;R.toneMapping=T.ACESFilmicToneMapping;R.shadowMap.enabled=true;R.shadowMap.type=T.PCFSoftShadowMap;
const S=new T.Scene();S.background=new T.Color(0x1a2233);S.fog=new T.Fog(0x1a2233,8,20);
const cam=new T.PerspectiveCamera(38,1,.05,60);
S.add(new T.HemisphereLight(0xcfe3ff,0x3a2a1a,.75));
const sun=new T.DirectionalLight(0xfff2dd,1.1);sun.position.set(2.5,4,3);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);
Object.assign(sun.shadow.camera,{left:-3,right:3,top:3,bottom:-3,near:.5,far:12});
sun.shadow.camera.updateProjectionMatrix();S.add(sun);
const add=(g,m,x,y,z)=>{const o=new T.Mesh(g,m);o.position.set(x,y,z);o.castShadow=o.receiveShadow=true;S.add(o);return o};
add(new T.PlaneGeometry(30,30),new T.MeshStandardMaterial({color:0x232b3a,roughness:1}),0,0,0).rotation.x=-Math.PI/2;
function wood(){const c=document.createElement('canvas');c.width=c.height=256;const x=c.getContext('2d');x.fillStyle='#8b5a2b';x.fillRect(0,0,256,256);
for(let i=0;i<90;i++){x.strokeStyle=`rgba(${60+Math.random()*40|0},35,10,${.08+Math.random()*.12})`;x.lineWidth=1+Math.random()*3;const y=Math.random()*256;x.beginPath();x.moveTo(0,y);x.bezierCurveTo(80,y+8*Math.random(),170,y-8*Math.random(),256,y);x.stroke()}
const t=new T.CanvasTexture(c);t.wrapS=t.wrapT=T.RepeatWrapping;t.encoding=T.sRGBEncoding;return t}
const wm=new T.MeshStandardMaterial({map:wood(),roughness:.6});
add(new T.BoxGeometry(3.4,.12,1.9),wm,0,.74,0);
for(const[x,z]of[[-1.6,-.85],[1.6,-.85],[-1.6,.85],[1.6,.85]])add(new T.BoxGeometry(.1,.68,.1),wm,x,.34,z);
add(new T.CylinderGeometry(.07,.06,.12,24),new T.MeshStandardMaterial({color:0xf2f2f2,roughness:.4}),1.0,.86,.35);
/* tablet */
const W=.9,H=1.2,SW=.8,SH=1.0667,K=960;
const tab=new T.Group();tab.position.set(0,.8,.05);tab.rotation.x=-.2;S.add(tab);
const sh=new T.Shape(),r=.06,x0=-W/2,y0=-H/2;
sh.moveTo(x0+r,y0);sh.lineTo(-x0-r,y0);sh.quadraticCurveTo(-x0,y0,-x0,y0+r);sh.lineTo(-x0,-y0-r);sh.quadraticCurveTo(-x0,-y0,-x0-r,-y0);sh.lineTo(x0+r,-y0);sh.quadraticCurveTo(x0,-y0,x0,-y0-r);sh.lineTo(x0,y0+r);sh.quadraticCurveTo(x0,y0,x0+r,y0);
const body=new T.Mesh(new T.ExtrudeGeometry(sh,{depth:.03,bevelEnabled:true,bevelSize:.008,bevelThickness:.008,bevelSegments:2,curveSegments:6}),new T.MeshStandardMaterial({color:0x2b2f38,metalness:.7,roughness:.35}));
body.position.set(0,H/2,-.03);body.castShadow=true;tab.add(body);
add(new T.BoxGeometry(.5,.75,.03),new T.MeshStandardMaterial({color:0x20242c,metalness:.6,roughness:.5}),0,1.16,-.28).rotation.x=.45;
const scr=new T.Group();scr.position.set(0,H/2,.012);tab.add(scr);
/* front camera lens + indicator LED */
const lensY=H-.033;
const ring=new T.Mesh(new T.CylinderGeometry(.0135,.0135,.004,32),new T.MeshStandardMaterial({color:0x6b7280,metalness:.9,roughness:.25}));ring.rotation.x=Math.PI/2;ring.position.set(0,lensY,.0105);tab.add(ring);
const lens=new T.Mesh(new T.CircleGeometry(.0095,32),new T.MeshStandardMaterial({color:0x04060a,metalness:.95,roughness:.08}));lens.position.set(0,lensY,.0128);tab.add(lens);
const glint=new T.Mesh(new T.CircleGeometry(.0025,12),new T.MeshBasicMaterial({color:0x6aa7ff}));glint.position.set(-.003,lensY+.003,.0131);tab.add(glint);
const led=new T.Mesh(new T.CircleGeometry(.0035,16),new T.MeshBasicMaterial({color:0x2a2f38}));led.position.set(.04,lensY,.0128);tab.add(led);
const mk=()=>{const c=document.createElement('canvas');c.width=768;c.height=1024;return{c,x:c.getContext('2d')}};
let A=mk(),B=mk();
const D=mk();D.t=new T.CanvasTexture(D.c);D.t.encoding=T.sRGBEncoding;D.t.anisotropy=8;
const base=new T.Mesh(new T.PlaneGeometry(SW,SH),new T.MeshBasicMaterial({map:D.t}));scr.add(base);
/* page slide compositor */
function comp(p,d){const x=D.x,o=Math.round(p*768);x.fillStyle='#000';x.fillRect(0,0,768,1024);
if(d>0){x.drawImage(A.c,-o,0);x.drawImage(B.c,768-o,0)}else{x.drawImage(B.c,o-768,0);x.drawImage(A.c,o,0)}
if(p>.001&&p<.999){const e=d>0?768-o:o,g=x.createLinearGradient(e-26,0,e+26,0);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(.5,'rgba(0,0,0,.3)');g.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=g;x.fillRect(e-26,0,52,1024)}
D.t.needsUpdate=true}
/* built-in browser page */
const WC=document.createElement('canvas');WC.width=768;WC.height=3600;
(function(){const x=WC.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,768,3600);
const g=x.createLinearGradient(0,0,768,0);g.addColorStop(0,'#0ea5e9');g.addColorStop(1,'#6366f1');x.fillStyle=g;x.fillRect(0,0,768,420);
x.fillStyle='#fff';x.font='700 56px system-ui,sans-serif';x.fillText('Weekend Notes',48,200);x.font='26px system-ui,sans-serif';x.fillText('Stories, photos and ideas worth a slow read.',48,252);
x.fillStyle='rgba(255,255,255,.22)';x.fillRect(48,300,220,56);x.fillStyle='#fff';x.font='600 22px system-ui,sans-serif';x.fillText('Start reading',82,336);
for(let i=0;i<9;i++){const y=470+i*340,h=i*41;x.fillStyle=`hsl(${h+180},60%,82%)`;x.fillRect(48,y,672,190);x.fillStyle=`hsl(${h+180},55%,55%)`;x.beginPath();x.arc(150,y+95,52,0,7);x.fill();
x.fillStyle='#111827';x.font='700 30px system-ui,sans-serif';x.fillText('Article '+(i+1)+': A quiet place to think',48,y+244);
x.fillStyle='#cbd1db';for(let j=0;j<3;j++)x.fillRect(48,y+266+j*18,j==2?380:672,9)}})();
const BV=mk(),wt=new T.CanvasTexture(BV.c);wt.encoding=T.sRGBEncoding;wt.anisotropy=8;
const wmesh=new T.Mesh(new T.PlaneGeometry(SW,SH),new T.MeshBasicMaterial({map:wt}));wmesh.visible=false;wmesh.position.z=.0005;scr.add(wmesh);
let wy=0,wv=0,webLocal=true,webDirty=true;const WMAX=3600-928;
function tabletBack(){
if(webLocal){wy=0;wv=0;webDirty=true;return}
try{fr.contentWindow.history.back()}catch(e){}
}
function drawWeb(){const x=BV.x;x.drawImage(WC,0,wy,768,928,0,96,768,928);x.fillStyle='#eef0f4';x.fillRect(0,0,768,96);x.fillStyle='#fff';x.beginPath();(x.roundRect||x.rect).call(x,28,22,712,52,26);x.fill();
	x.fillStyle='#374151';x.beginPath();x.arc(54,48,25,0,7);x.fill();x.fillStyle='#fff';x.font='400 42px system-ui,sans-serif';x.fillText('‹',44,62);
	x.fillStyle='#4b5563';x.font='24px system-ui,sans-serif';x.fillText('🔒 tablet.local/weekend-notes',92,57);
const bh=928*928/3600;x.fillStyle='rgba(0,0,0,.28)';x.fillRect(758,100+wy/WMAX*(920-bh),6,bh);wt.needsUpdate=true}
function syncWeb(){const w=mode=='web';wmesh.visible=w&&webLocal;$('web').style.display=w&&!webLocal?'block':'none'}
/* stylus */
const penG=new T.Group(),pm=new T.MeshStandardMaterial({color:0xf3f4f6,roughness:.3,metalness:.2});
const ptip=new T.Mesh(new T.CylinderGeometry(.0085,.0008,.022,16),new T.MeshStandardMaterial({color:0x1f2937,roughness:.5}));ptip.position.y=.011;
const pbody=new T.Mesh(new T.CylinderGeometry(.0085,.0085,.3,20),pm);pbody.position.y=.172;
const pband=new T.Mesh(new T.CylinderGeometry(.0089,.0089,.03,20),new T.MeshStandardMaterial({color:0x3b82f6,metalness:.6,roughness:.3}));pband.position.y=.292;
penG.add(ptip,pbody,pband);penG.scale.setScalar(1.8);penG.traverse(o=>o.castShadow=true);tab.add(penG);
const qAct=new T.Quaternion().setFromUnitVectors(new T.Vector3(0,1,0),new T.Vector3(.65,.5,.6).normalize()),qRest=new T.Quaternion(),penRest=new T.Vector3(W/2+.017,H/2-.31,-.011),penTgt=new T.Vector3();
penG.position.copy(penRest);
let penPos={x:.5,y:.5},penDown=false,penHold=0;
function penTouch(u){penPos={x:u.x,y:u.y}}
function penUpdate(now,rd){const act=penDown||now<penHold;
if(act)penTgt.set((penPos.x-.5)*SW,H/2+(penPos.y-.5)*SH,penDown?.013:.03);else penTgt.copy(penRest);
const k=1-Math.exp(-rd*(act?18:9));penG.position.lerp(penTgt,k);penG.quaternion.slerp(act?qAct:qRest,k)}
/* video layer */
const vid=document.createElement('video');vid.playsInline=true;vid.loop=true;vid.muted=true;
const vt=new T.VideoTexture(vid);vt.encoding=T.sRGBEncoding;
const vg=new T.Group();vg.position.z=.001;vg.visible=false;scr.add(vg);
vg.add(new T.Mesh(new T.PlaneGeometry(SW,SH),new T.MeshBasicMaterial({color:0})));
const vm=new T.Mesh(new T.PlaneGeometry(SW,SH),new T.MeshBasicMaterial({map:vt}));vm.position.z=.001;vg.add(vm);
const fit=(a,m)=>vm.scale.set((a>.75?1:a/.75)*(m?-1:1),a>.75?.75/a:1,1);
const dc=document.createElement('canvas');dc.width=540;dc.height=720;const dx=dc.getContext('2d');let demoOn=true,dstream=null;
function drawClip(t){const g=dx.createLinearGradient(0,0,540,720);g.addColorStop(0,`hsl(${t*30%360},70%,35%)`);g.addColorStop(1,`hsl(${(t*30+90)%360},70%,55%)`);dx.fillStyle=g;dx.fillRect(0,0,540,720);
for(let i=0;i<6;i++){dx.fillStyle=`rgba(255,255,255,${.12+i*.04})`;dx.beginPath();dx.arc(270+Math.sin(t*.9+i)*190,360+Math.cos(t*1.3+i*1.7)*260,40+i*14,0,7);dx.fill()}
dx.fillStyle='#fff';dx.font='700 40px system-ui,sans-serif';dx.fillText('Demo clip',40,70);dx.font='22px system-ui,sans-serif';dx.fillText(t.toFixed(1)+' s',40,104)}
function safePlay(){try{const p=vid.play();if(p&&p.catch)p.catch(()=>{})}catch(e){}}
