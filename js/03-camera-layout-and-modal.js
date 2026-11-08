/* ---------- camera director ---------- */
const view={az:.3,el:.2,r:2.7},from={az:1.3,el:.6,r:6.2},tgt=new T.Vector3(0,1.37,0);let introT=0;
const ease=x=>1-Math.pow(1-x,3),SHOTS=[[.5,.25,2.9],[-.25,.12,1.9],[.9,.45,2.3],[0,.05,1.7],[-.7,.3,2.7]];
let styV='cin',lcamV='o';
function director(t){if(styV=='loop'){const p=2*Math.PI*t/10;return lcamV=='o'?[.3+p,.2+.05*Math.sin(2*p),2.6]:[.3+.45*Math.sin(p),.18+.05*Math.cos(p),2.5+.2*Math.cos(p)]}
const L=4.5,i=Math.floor(t/L),f=t/L-i,s=SHOTS[i%SHOTS.length];return[s[0]+f*.12,s[1]+f*.02,s[2]-f*.1]}

/* ---------- CSS 3D overlay for websites ---------- */
let cw=1,ch=1;const mat=new T.Matrix4(),sc=new T.Matrix4().makeScale(1/K,1/K,1/K),nz=v=>Math.abs(v)<1e-10?0:v;
function css3d(){const f=.5/Math.tan(cam.fov*Math.PI/360)*ch;$('css').style.perspective=f+'px';cam.updateMatrixWorld();
const e=mat.copy(cam.matrixWorld).invert().elements;
$('cm').style.transform=`translateZ(${f}px) matrix3d(${[e[0],-e[1],e[2],e[3],e[4],-e[5],e[6],e[7],e[8],-e[9],e[10],e[11],e[12],-e[13],e[14],e[15]].map(nz)}) translate(${cw/2}px,${ch/2}px)`;
scr.updateMatrixWorld(true);const o=new T.Matrix4().copy(scr.matrixWorld).multiply(sc).elements;
$('web').style.transform=`translate(-50%,-50%) matrix3d(${[o[0],o[1],o[2],o[3],-o[4],-o[5],-o[6],-o[7],o[8],o[9],o[10],o[11],o[12],o[13],o[14],o[15]].map(nz)})`}

/* ---------- layout ---------- */
let recording=false;
function dims(){const s=qual.value=='s'?720:1080,l=s*16/9|0;return asp.value=='9:16'?[s,l]:[l,s]}
function layout(){
const vw=innerWidth,vh=innerHeight;
if(vw<2||vh<2)return;
const P=pro.checked,D=dims();
let ar=P?D[0]/D[1]:vw/vh;
if(!isFinite(ar)||ar<=0)ar=16/9;
ar=clamp(ar,0.1,10);
let w=vw,h=vw/ar;if(h>vh){h=vh;w=vh*ar}
cw=w;ch=h;
for(const e of[cv,$('css')]){e.style.width=w+'px';e.style.height=h+'px';e.style.left=(vw-w)/2+'px';e.style.top=(vh-h)/2+'px'}
$('cm').style.width=w+'px';$('cm').style.height=h+'px';
let bw,bh;if(P){const k=recording?1:.5;bw=D[0]*k;bh=D[1]*k}else{const d=Math.min(devicePixelRatio||1,matchMedia('(pointer:coarse)').matches?1.5:2);bw=w*d;bh=h*d}
R.setSize(Math.max(1,bw|0),Math.max(1,bh|0),false);
cam.aspect=ar;cam.updateProjectionMatrix()}

/* ---------- modal ---------- */
let modalURL=null;
function closeModal(){
const v=$('mv').querySelector('video');
if(v){try{v.pause();v.removeAttribute('src');v.load()}catch(e){}}
$('mv').replaceChildren();
if(modalURL){URL.revokeObjectURL(modalURL);modalURL=null}
$('modal').style.display='none';
$('dl').removeAttribute('href');
}
function modal(el,url,ext){
closeModal();
$('mv').appendChild(el);
$('dl').href=url;
$('dl').download='tablet-studio.'+ext;
$('modal').style.display='flex';
if(url&&url.startsWith('blob:'))modalURL=url;
}
$('mc').onclick=closeModal;

