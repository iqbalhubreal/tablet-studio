/* ---------- recording ---------- */
let rec=null,chunks=[],recT0=0,recLen=0,starting=false,lastRecHud=0;
function stopRecUI(){rec=null;recording=false;layout();
$('rb').style.display='none';
['rbn','qr'].forEach(i=>$(i).classList.remove('recording'));
$('rbn').textContent='⏺ Start recording';$('qr').textContent='⏺'}
function countdown(){return new Promise(res=>{let n=3;const c=$('cd');c.style.display='flex';
(function s(){if(!n){c.style.display='none';return res()}$('cdn').textContent=n--;setTimeout(s,1000)})()})}
async function startRec(){
if(starting)return;
if(rec){
  const r=rec;rec=null;
  if(r.state!=='inactive'){try{r.stop()}catch(e){stopRecUI()}}
  return;
}
if(!window.MediaRecorder||typeof cv.captureStream!=='function'){alert('Recording isn’t supported in this browser.');return}
starting=true;
try{
  audio();
  if(pro.checked)await countdown();
  const q=qual.value,st=cv.captureStream(q=='u'?60:30);
  if($('rsnd').checked&&dest)dest.stream.getAudioTracks().forEach(t=>st.addTrack(t));
  const mt=['video/mp4;codecs=avc1','video/webm;codecs=vp9,opus','video/webm;codecs=vp8,opus','video/webm'].find(m=>MediaRecorder.isTypeSupported(m));
  if(!mt)throw new Error('No supported recording format.');
  chunks=[];
  const r=new MediaRecorder(st,{mimeType:mt,videoBitsPerSecond:pro.checked?(q=='s'?5e6:q=='u'?14e6:9e6):6e6});
  rec=r;
  r.ondataavailable=e=>{if(e.data&&e.data.size)chunks.push(e.data)};
  r.onerror=()=>{stopRecUI()};
  r.onstop=()=>{
    const type=r.mimeType||'video/webm';
    if(!chunks.length){stopRecUI();alert('Recording produced no data. Try again.');return}
    const blob=new Blob(chunks,{type});
    const u=URL.createObjectURL(blob);
    const v=document.createElement('video');
    v.src=u;v.controls=true;v.playsInline=true;
    modal(v,u,type.includes('mp4')?'mp4':'webm');
    stopRecUI();
  };
  recT0=performance.now();
  recLen=pro.checked?(sty.value=='loop'?10*+$('cyc').value:+len.value):0;
  recording=true;layout();
  proT=0;flipT=0;lastRecHud=0;
  r.start(250);
  $('rb').style.display='flex';
  ['rbn','qr'].forEach(i=>$(i).classList.add('recording'));
  $('rbn').textContent='⏹ Stop recording';$('qr').textContent='⏹';
  $('rt').textContent='REC 00:00';
}catch(e){
  alert('Recording failed: '+(e.message||e));
  stopRecUI();
}finally{starting=false}
}
function snap(){R.render(S,cam);const u=cv.toDataURL('image/png'),im=new Image();im.src=u;modal(im,u,'png')}

