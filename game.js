(()=>{function ciPhysicalPhoneMapFit(){const m=document.getElementById('map'),w=document.getElementById('mapWrap');if(!m||!w)return;m.setAttribute('viewBox','0 0 900 650');const phone=window.innerWidth>680&&window.innerHeight<=500;if(!phone){m.style.removeProperty('width');m.style.removeProperty('height');m.style.removeProperty('left');m.style.removeProperty('right');m.style.removeProperty('top');m.style.removeProperty('bottom');return;}const cs=getComputedStyle(w),sl=parseFloat(cs.getPropertyValue('--phone-safe-left'))||8,sr=parseFloat(cs.getPropertyValue('--phone-safe-right'))||8,st=parseFloat(cs.getPropertyValue('--phone-safe-top'))||8,sb=parseFloat(cs.getPropertyValue('--phone-safe-bottom'))||8,aw=Math.max(1,w.clientWidth-sl-sr),ah=Math.max(1,w.clientHeight-st-sb),scale=Math.min(aw/900,ah/650),mw=Math.floor(900*scale),mh=Math.floor(650*scale);m.style.width=mw+'px';m.style.height=mh+'px';m.style.left=(sl+Math.max(0,(aw-mw)/2))+'px';m.style.right='auto';m.style.top=(st+Math.max(0,(ah-mh)/2))+'px';m.style.bottom='auto';}ciPhysicalPhoneMapFit();window.addEventListener('resize',ciPhysicalPhoneMapFit,{passive:true});window.visualViewport?.addEventListener('resize',ciPhysicalPhoneMapFit,{passive:true});const $=s=>document.querySelector(s),NS='http://www.w3.org/2000/svg',D=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y),H=(x,y)=>(Math.atan2(x,-y)*180/Math.PI+360)%360;function renderPhysicalGrid(){const g=$('#physicalGrid'),m=$('#map');if(!g||!m)return;const w=Math.max(1,g.clientWidth),h=Math.max(1,g.clientHeight),scale=Math.min(w/900,h/650),padX=(w-900*scale)/2,padY=(h-650*scale)/2,r=52*scale,dx=78*scale,dy=Math.sqrt(3)*52*scale;g.setAttribute('viewBox',`0 0 ${w} ${h}`);g.textContent='';const points=(cx,cy)=>Array.from({length:6},(_,i)=>{const a=Math.PI/180*(60*i);return (cx+r*Math.cos(a)).toFixed(2)+','+(cy+r*Math.sin(a)).toFixed(2)}).join(' ');const firstX=padX;let col=0;for(let cx=firstX;cx>=-r-dx;cx-=dx)col--;const startX=firstX+col*dx;for(let cx=startX,c=col;cx<=w+r+dx;cx+=dx,c++){const offset=((c%2)+2)%2*dy/2;for(let cy=padY-dy;cy<=padY+650*scale+dy;cy+=dy){const poly=document.createElementNS(NS,'polygon');poly.setAttribute('points',points(cx,cy+offset));poly.setAttribute('class','geoHex');g.appendChild(poly)}}}let physicalGridRAF=0;function schedulePhysicalGrid(){cancelAnimationFrame(physicalGridRAF);physicalGridRAF=requestAnimationFrame(renderPhysicalGrid)}schedulePhysicalGrid();window.addEventListener('resize',schedulePhysicalGrid,{passive:true});window.visualViewport?.addEventListener('resize',schedulePhysicalGrid,{passive:true});function renderTerrain(){
 const base=$('#terrainBase'),grid=$('#geometricGrid'),feat=$('#terrainFeatures');
 if(!base)return;
 while(base.firstChild)base.removeChild(base.firstChild);
 if(grid)while(grid.firstChild)grid.removeChild(grid.firstChild);
 if(feat)while(feat.firstChild)feat.removeChild(feat.firstChild);
 // v0.6.6.15: terrain imagery lives on #mapWrap as overscan. The SVG now
 // contains only the authoritative 900x650 playable tactical coordinate space.
 if(grid){
   const r=52, dx=1.5*r, dy=Math.sqrt(3)*r;
   const points=(cx,cy)=>Array.from({length:6},(_,i)=>{
     const a=Math.PI/180*(60*i);
     return (cx+r*Math.cos(a)).toFixed(2)+','+(cy+r*Math.sin(a)).toFixed(2);
   }).join(' ');
   let col=0;
   for(let cx=0;cx<=900+r;cx+=dx,col++){
     const offset=(col%2)*dy/2;
     for(let cy=-dy;cy<=650+dy;cy+=dy){
       const poly=document.createElementNS(NS,'polygon');
       poly.setAttribute('points',points(cx,cy+offset));
       poly.setAttribute('class','geoHex');
       grid.appendChild(poly);
     }
   }
 }
}renderTerrain();const A={x:145,y:510,r:118,speed:82,mode:'IDLE',dest:null,heading:0,lastMove:performance.now()};let B=[],T=[],sel=null,col=null,pct=0,score=0,integrity=100,decisionCorrect=0,decisionTotal=0,resolved=0,ints=0,next=1,campaignMission=null,campaignIds=0,campaignCorrect=0,campaignThreatResolved=0,campaignNonThreatResolved=0,campaignStationaryAssessed=0,campaignStationarySpawned=0,campaignProximityAssessed=0,campaignCollectionInterrupted=0,campaignCompromise=0,campaignFinished=false,arcadeStreak=0,arcadeBestStreak=0,arcadeCorrect=0,arcadeWrong=0,arcadeStart=0,arcadeThreatLevel=1,arcadeNextLevel=0,intelDropOffered=false,intelDropActive=false,intelDropAt=0,intelDropExpires=0,intelFusionUntil=0,passiveCredits=0,passiveNodes=[],passiveNAIs=[],passiveDeployMode=false,passiveNextId=1,ewoTargetMode=false,ewoUses=0,tutorialStep=0,supplyPackages=0,supplyRepairMode=false,running=false,start=0,lastSpawn=0,last=performance.now(),phase=1,ct=null,ci=null,lastUi=0,stallLogged=false;const C={raf:0,isr:0,map:0,track:0,orders:0,errors:0,lastRaf:performance.now(),maxGap:0,fps:0,fpsFrames:0,fpsAt:performance.now()};let dbg=[],lastDiag=0;function rec(kind,msg){let ts=((performance.now()-(start||performance.now()))/1000).toFixed(3);dbg.push(`${ts}s | ${kind} | ${msg}`);if(dbg.length>500)dbg.shift()}window.addEventListener('error',e=>{C.errors++;rec('ERROR',`${e.message} @ ${e.filename}:${e.lineno}:${e.colno}`)});window.addEventListener('unhandledrejection',e=>{C.errors++;rec('REJECTION',String(e.reason))});function log(s){let d=document.createElement('div');d.textContent='> '+s;$('#log').prepend(d);while($('#log').children.length>7)$('#log').lastChild.remove()}function banner(s,d=1000){$('#bannerText').textContent=s;$('#banner').classList.add('show');setTimeout(()=>$('#banner').classList.remove('show'),d)}
// v0.6.2.1 AUDIO IDENTITY // retained tactile/menu SFX + recorded background
let audioCtx=null,audioReady=false,audioEnabled=true,lastContactTone=0,lastWarningTone=0;const savedMute=localStorage.getItem('ci-audio-muted'),muteExplicit=localStorage.getItem('ci-audio-mute-explicit')==='1';let masterMuted=muteExplicit&&savedMute==='1';if(!muteExplicit){localStorage.setItem('ci-audio-muted','0');masterMuted=false;}if(savedMute!==null&&savedMute!=='0'&&savedMute!=='1'){localStorage.removeItem('ci-audio-muted');masterMuted=false;}
// v0.6.2 TACTICAL SCORE // beat-first score + tactile UI transients
let musicMode='off',musicNoiseBuffer=null,lastHoverTone=0;
const audioLevels={music:Number(localStorage.getItem('ci-audio-music')??70)/100,ui:Number(localStorage.getItem('ci-audio-ui')??80)/100,sfx:Number(localStorage.getItem('ci-audio-sfx')??85)/100};let synthGain=1;
const backgroundMusic=new Audio('assets/audio/mission-background-loop.ogg');backgroundMusic.loop=true;backgroundMusic.preload='auto';const missionFailAudio=new Audio('assets/audio/mission-fail.wav'),missionSuccessAudio=new Audio('assets/audio/mission-success.wav');const interceptImpact=new Audio('assets/audio/intercept-impact.wav'),ewoAudio=new Audio('assets/audio/ewo-sweep.wav'),clearRadio=[new Audio('assets/audio/radio-clear-user-01.wav'),new Audio('assets/audio/radio-clear-user-02.wav'),new Audio('assets/audio/radio-clear-user-03.wav'),new Audio('assets/audio/radio-clear-user-04.wav'),new Audio('assets/audio/radio-clear-user-05.wav'),new Audio('assets/audio/radio-clear-user-06.wav'),new Audio('assets/audio/radio-clear-user-07.wav'),new Audio('assets/audio/radio-clear-user-08.wav')];[interceptImpact,ewoAudio,missionFailAudio,missionSuccessAudio,...clearRadio].forEach(a=>a.preload='auto');function playAsset(a,vol=1,bus='sfx'){try{a.currentTime=0;a.volume=Math.max(0,Math.min(1,vol*audioLevels[bus]*(masterMuted?0:1)));const p=a.play();if(p&&p.catch)p.catch(()=>{})}catch(e){rec('AUDIO_ASSET_FAIL',String(e))}}
function applyAudioSettings(){backgroundMusic.muted=masterMuted;backgroundMusic.volume=(window.CP_PAUSED?.16:.34)*audioLevels.music*(masterMuted?0:1);const mb=$('#muteBtn');if(mb){mb.textContent=masterMuted?'AUDIO MUTED':'AUDIO ON';mb.classList.toggle('muted',masterMuted)};[['musicSlider','musicValue','music'],['uiSlider','uiValue','ui'],['sfxSlider','sfxValue','sfx']].forEach(([sid,vid,k])=>{const sl=$('#'+sid),v=$('#'+vid);if(sl)sl.value=Math.round(audioLevels[k]*100);if(v)v.textContent=Math.round(audioLevels[k]*100)+'%'})}
function setAudioLevel(k,v){audioLevels[k]=Math.max(0,Math.min(1,Number(v)/100));localStorage.setItem('ci-audio-'+k,String(Math.round(audioLevels[k]*100)));applyAudioSettings()}
function makeNoiseBuffer(){if(!audioCtx)return null;const len=Math.max(1,Math.floor(audioCtx.sampleRate*2)),b=audioCtx.createBuffer(1,len,audioCtx.sampleRate),d=b.getChannelData(0);for(let i=0;i<len;i++)d[i]=(Math.random()*2-1);return b}
function audioUnlock(){if(!audioEnabled)return;try{if(!audioCtx)audioCtx=new (window.AudioContext||window.webkitAudioContext)();if(audioCtx.state==='suspended')audioCtx.resume();audioReady=true;if(!musicNoiseBuffer)musicNoiseBuffer=makeNoiseBuffer();musicSetMode((running&&!window.CP_MENU)?'mission':'menu')}catch(e){rec('AUDIO_FAIL',String(e));audioEnabled=false}}
function routeGain(vol,t,dur,dest=null,attack=.003){const g=audioCtx.createGain();vol*=synthGain;g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(Math.max(.0002,vol),t+attack);g.gain.exponentialRampToValueAtTime(.0001,t+dur);g.connect(dest||audioCtx.destination);return g}
function tone(freq=220,dur=.06,vol=.018,type='sine',delay=0,endFreq=null,dest=null){if(!audioEnabled||!audioReady||!audioCtx)return;const t=audioCtx.currentTime+delay,o=audioCtx.createOscillator(),g=routeGain(vol,t,dur,dest);o.type=type;o.frequency.setValueAtTime(freq,t);if(endFreq)o.frequency.exponentialRampToValueAtTime(Math.max(20,endFreq),t+dur);o.connect(g);o.start(t);o.stop(t+dur+.03)}
function noiseBurst(dur=.045,vol=.009,cutoff=1100,delay=0,filterType='bandpass',q=1.2,dest=null){if(!audioReady||!audioCtx||!musicNoiseBuffer)return;const t=audioCtx.currentTime+delay,n=audioCtx.createBufferSource(),f=audioCtx.createBiquadFilter(),g=routeGain(vol,t,dur,dest);n.buffer=musicNoiseBuffer;f.type=filterType;f.frequency.value=cutoff;f.Q.value=q;n.connect(f);f.connect(g);n.start(t);n.stop(t+dur+.02)}
function uiTick(){noiseBurst(.018,.022,2350,0,'highpass',.7);noiseBurst(.010,.010,4200,.004,'bandpass',2.2)}
function uiClack(){noiseBurst(.038,.034,1450,0,'bandpass',1.4);noiseBurst(.025,.020,420,0,'lowpass',.8);tone(72,.038,.012,'triangle',.004,55)}
function sound(kind){if(!audioReady||masterMuted)return;const uiKinds=kind==='hover'||kind==='click';synthGain=uiKinds?audioLevels.ui:audioLevels.sfx;switch(kind){
 case'hover':uiTick();break;
 case'click':uiClack();break;
 case'acquire':noiseBurst(.026,.016,1500);tone(132,.04,.010,'square',.008,118);break;
 case'order':noiseBurst(.022,.013,1050);tone(105,.035,.009,'triangle',.006,92);break;
 case'contact':{let n=performance.now();if(n-lastContactTone<650)return;lastContactTone=n;noiseBurst(.020,.009,1900);tone(220,.025,.006,'square',.005,205);break;}
 case'classify':noiseBurst(.040,.015,1150);noiseBurst(.025,.008,1850,.032);break;
 case'correct':noiseBurst(.025,.012,900);tone(96,.045,.008,'triangle',.006,88);break;
 case'wrong':tone(92,.13,.026,'sawtooth',0,64);noiseBurst(.07,.014,360);break;
 case'warning':{let n=performance.now();if(n-lastWarningTone<1800)return;lastWarningTone=n;tone(92,.09,.022,'square');tone(92,.09,.022,'square',.15);break;}
 case'intel':noiseBurst(.050,.016,1650);noiseBurst(.035,.011,1100,.065);tone(118,.035,.007,'square',.105,108);break;
 case'fusion':tone(68,.18,.018,'sawtooth',0,96);noiseBurst(.08,.010,620,.10);break;
 case'level':tone(72,.14,.026,'square');noiseBurst(.07,.012,430,.06);tone(72,.12,.020,'square',.20);break;
 case'degraded':tone(64,.30,.034,'sawtooth',0,46);noiseBurst(.16,.016,290);break;
 case'explosion':playAsset(interceptImpact,.92,'sfx');break;
 case'clear':{noiseBurst(.035,.012,1800);setTimeout(()=>playAsset(clearRadio[Math.floor(Math.random()*clearRadio.length)],.9,'sfx'),45);break;}
 case'ewo':playAsset(ewoAudio,.88,'sfx');break;
 case'fail':tone(58,.48,.036,'sawtooth',0,36);tone(43,.62,.028,'sine',.18,32);noiseBurst(.24,.014,240,.06);break;
 }}
function musicSetMode(mode){
 musicMode=mode;
 if(mode==='off'){backgroundMusic.pause();return}
 backgroundMusic.muted=masterMuted;backgroundMusic.volume=(window.CP_PAUSED?.16:.34)*audioLevels.music*(masterMuted?0:1);
 const play=backgroundMusic.play();if(play&&play.catch)play.catch(()=>{});
}
function installMenuButtonAudio(){document.querySelectorAll('button').forEach(btn=>{if(btn.dataset.audioUi)return;btn.dataset.audioUi='1';btn.addEventListener('mouseenter',()=>{if(btn.disabled||!audioReady)return;const n=performance.now();if(n-lastHoverTone<45)return;lastHoverTone=n;sound('hover')});btn.addEventListener('pointerdown',()=>{audioUnlock();if(!btn.disabled){setTimeout(()=>sound('click'),0)}},{capture:true})})}
installMenuButtonAudio();
document.addEventListener('pointerdown',audioUnlock,{capture:true});function point(e){let p=$('#map').createSVGPoint();p.x=e.clientX;p.y=e.clientY;return p.matrixTransform($('#map').getScreenCTM().inverse())}function valid(p){return p&&Number.isFinite(p.x)&&Number.isFinite(p.y)}function stopCollect(){if(ct)clearTimeout(ct);if(ci)clearInterval(ci);ct=ci=null;if(col)col.collecting=false;col=null;pct=0}function acquire(){C.isr++;tutorialAdvance('acquire');rec('ISR_CLICK',`mode=${A.mode} pos=${A.x.toFixed(1)},${A.y.toFixed(1)}`);stopCollect();sel=null;A.mode='ISR_SELECTED';A.dest=null;stallLogged=false;log('ISR CONTROL // ACQUIRED');sound('acquire');ui(true)}function order(p){C.orders++;tutorialAdvance('order');rec('ORDER',valid(p)?`to=${p.x.toFixed(1)},${p.y.toFixed(1)}`:'INVALID');if(!valid(p)){A.dest=null;A.mode='ON_STATION';return}A.dest={x:Math.max(125,Math.min(775,p.x)),y:Math.max(125,Math.min(525,p.y))};A.heading=H(A.dest.x-A.x,A.dest.y-A.y);A.mode='ENROUTE';A.lastMove=performance.now();stallLogged=false;log('ISR ORDER // DESTINATION SET');sound('order')}function makeBlue(id,x,y){let b={id,x,y,exposure:0,degraded:false},g=document.createElementNS(NS,'g');g.setAttribute('transform',`translate(${x} ${y})`);g.innerHTML=`<circle r="24" fill="#0d1418" stroke="#4da3ff" stroke-width="2"/><path d="M-10 -10H10V10H-10ZM-5 -5H5V5H-5Z" fill="none" stroke="#4da3ff" stroke-width="2"/><text x="31" y="4" font-size="11" fill="#4da3ff">${id}</text>`;$('#blueSites').append(g);b.el=g;b.circle=g.querySelector('circle');b.icon=g.querySelector('path');b.label=g.querySelector('text');g.style.pointerEvents='all';g.addEventListener('pointerdown',e=>{if(!supplyRepairMode||!b.degraded)return;e.preventDefault();e.stopPropagation();reconstituteSite(b)});B.push(b)}function initBlue(){$('#blueSites').textContent='';B=[];
makeBlue('BLU-FOB',705,485);makeBlue('BLU-C2',600,170);makeBlue('BLU-LOG',300,310);
makeBlue('BLU-AIR',775,285);makeBlue('BLU-AOB',425,205);
B.forEach(b=>{b.exposure=0;b.degraded=false;cpRenderBlueSite(b)})}
function cpNotice(title,detail,kind='intel'){
 const stack=$('#notificationStack');if(!stack)return;
 const n=document.createElement('div');n.className='op-notice '+kind;
 n.innerHTML='<b>'+title+'</b><span>'+detail+'</span>';stack.appendChild(n);
 while(stack.children.length>4)stack.firstElementChild.remove();
 setTimeout(()=>{n.classList.add('leaving');setTimeout(()=>n.remove(),350)},2600);
}
const PASSIVE_MAX=6,PASSIVE_RADIUS=92,PASSIVE_COSTS=[30,45,68,102,153,230],NAI_LINK_MAX=360,NAI_MIN_AREA=1800,NAI_COLLECT_MS=1000,EWO_COST=75;
function passiveEnabled(){return campaignMission==='ARCADE'||campaignMission==='01-04'||campaignMission==='01-05'||campaignMission==='TUTORIAL'}
function passiveCost(){return PASSIVE_COSTS[Math.min(passiveNodes.length,PASSIVE_COSTS.length-1)]}
function passiveCovered(t){return passiveEnabled()&&passiveNodes.some(n=>D(n,t)<=PASSIVE_RADIUS)}
function triArea(a,b,c){return Math.abs((a.x*(b.y-c.y)+b.x*(c.y-a.y)+c.x*(a.y-b.y))/2)}
function inTri(p,a,b,c){const s=(p1,p2,p3)=>(p1.x-p3.x)*(p2.y-p3.y)-(p2.x-p3.x)*(p1.y-p3.y),d1=s(p,a,b),d2=s(p,b,c),d3=s(p,c,a),neg=d1<0||d2<0||d3<0,pos=d1>0||d2>0||d3>0;return !(neg&&pos)}
function naiForTrack(t){return passiveNAIs.find(z=>inTri(t,z.nodes[0],z.nodes[1],z.nodes[2]))||null}
function rebuildNAIs(){
 passiveNAIs=[];const layer=$('#passiveNAIs');if(layer)layer.textContent='';const used=new Set();
 for(let i=0;i<passiveNodes.length-2;i++)for(let j=i+1;j<passiveNodes.length-1;j++)for(let k=j+1;k<passiveNodes.length;k++){
   const a=passiveNodes[i],b=passiveNodes[j],c=passiveNodes[k];if(used.has(a.id)||used.has(b.id)||used.has(c.id))continue;
   if(Math.max(D(a,b),D(b,c),D(c,a))>NAI_LINK_MAX||triArea(a,b,c)<NAI_MIN_AREA)continue;
   const z={id:passiveNAIs.length+1,nodes:[a,b,c]};passiveNAIs.push(z);used.add(a.id);used.add(b.id);used.add(c.id);
   const g=document.createElementNS(NS,'g');g.setAttribute('class','passive-nai');const pts=z.nodes.map(n=>`${n.x},${n.y}`).join(' '),cx=(a.x+b.x+c.x)/3,cy=(a.y+b.y+c.y)/3;
   g.innerHTML=`<polygon points="${pts}"/><text x="${cx}" y="${cy}">NAI-${String(z.id).padStart(2,'0')} // AUTO COLLECTION</text>`;layer?.append(g);z.el=g;
 }
 if(passiveNAIs.length){tutorialAdvance('nai');log('PASSIVE ISR // '+passiveNAIs.length+' NAI ACTIVE');cpNotice('NAI ESTABLISHED',passiveNAIs.length+' AUTO-COLLECTION ZONE'+(passiveNAIs.length>1?'S':''),'intel')}
}
function passiveAward(n,why){if(!passiveEnabled()||n<=0)return;passiveCredits+=n;log('ISR CREDITS // +'+n+' // '+why);cpNotice('ISR CREDITS // +'+n,why,'intel');ui(true)}
function passiveReset(){passiveCredits=0;passiveDeployMode=false;ewoTargetMode=false;ewoUses=0;supplyPackages=0;supplyRepairMode=false;passiveNextId=1;passiveNodes=[];passiveNAIs=[];['#passiveSensors','#passiveRanges','#passiveNAIs'].forEach(q=>{const g=$(q);if(g)g.textContent=''});const b=$('#passiveDeploy');if(b)b.classList.remove('deploying')}
function passivePlace(p){
 if(!passiveEnabled()||!running||!passiveDeployMode||!valid(p))return false;
 if(passiveNodes.length>=PASSIVE_MAX){passiveDeployMode=false;ui(true);return false}
 const cost=passiveCost();if(passiveCredits<cost){passiveDeployMode=false;ui(true);return false}
 const n={id:passiveNextId++,x:Math.max(55,Math.min(845,p.x)),y:Math.max(55,Math.min(590,p.y))};passiveCredits-=cost;passiveNodes.push(n);passiveDeployMode=false;
 const rg=document.createElementNS(NS,'g');rg.setAttribute('transform',`translate(${n.x} ${n.y})`);rg.setAttribute('class','passive-range-layer');rg.innerHTML=`<circle class="passive-range" r="${PASSIVE_RADIUS}"/>`;$('#passiveRanges').append(rg);n.rangeEl=rg;
 const g=document.createElementNS(NS,'g');g.setAttribute('transform',`translate(${n.x} ${n.y})`);g.setAttribute('class','passive-node');g.innerHTML=`<circle class="passive-core" r="13"/><path class="passive-mark" d="M-7 0H7M0-7V7M-5-5L5 5M5-5L-5 5"/><text x="18" y="4">PSR-${String(n.id).padStart(2,'0')}</text>`;
 $('#passiveSensors').append(g);n.el=g;rebuildNAIs();tutorialAdvance('passive');log('PASSIVE ISR // PSR-'+String(n.id).padStart(2,'0')+' DEPLOYED');cpNotice('PASSIVE ISR DEPLOYED','COLLECTION FOOTPRINT ACTIVE','intel');sound('order');ui(true);return true
}
function ewoSweep(){
 if(!passiveEnabled()||!running)return;
  if(passiveCredits<EWO_COST){cpNotice('EWO SUPPORT','INSUFFICIENT ISR CREDITS // '+passiveCredits+'/'+EWO_COST,'intel');return}
 if(!T.some(t=>!t.done&&t.type==='UNKNOWN')){cpNotice('EWO SUPPORT','NO UNRESOLVED TRACKS IN AO','intel');return}
 ewoTargetMode=!ewoTargetMode;passiveDeployMode=false;A.mode=ewoTargetMode?'EWO_TARGET':(A.dest?'ENROUTE':'ON_STATION');
 cpNotice('EWO SUPPORT',ewoTargetMode?'SELECT SWEEP ORIGIN ON MAP':'TARGETING CANCELLED','intel');ui(true)
}
function ewoFire(origin){
 if(!ewoTargetMode||passiveCredits<EWO_COST)return;ewoTargetMode=false;passiveCredits-=EWO_COST;ewoUses++;A.mode='ON_STATION';stopCollect();
 const targets=T.filter(t=>!t.done&&t.type==='UNKNOWN').map(t=>({t,d:Math.hypot(t.x-origin.x,t.y-origin.y)})).sort((a,b)=>a.d-b.d);
 const layer=$('#ewoEffects');if(layer)layer.textContent='';const ring=document.createElementNS(NS,'circle');ring.setAttribute('class','ewo-wave');ring.setAttribute('cx',origin.x);ring.setAttribute('cy',origin.y);ring.setAttribute('r','0');layer.append(ring);
 const particles=[];for(let i=0;i<42;i++){let q=document.createElementNS(NS,'circle');q.setAttribute('class','ewo-particle');q.setAttribute('r',1+Math.random()*1.8);layer.append(q);particles.push({q,a:Math.random()*Math.PI*2,j:(Math.random()-.5)*18})}
 tutorialAdvance('ewo');const maxR=1100,dur=1900,t0=performance.now();sound('ewo');banner('EWO SWEEP // ELECTROMAGNETIC COLLECTION',1500);cpNotice('EWO SWEEP ACTIVE','RADIAL COLLECTION WAVE','intel');log('EWO SUPPORT // RADIAL SWEEP');
 let done=new Set();function frame(now){let f=Math.min(1,(now-t0)/dur),r=maxR*f;ring.setAttribute('r',r);ring.setAttribute('stroke-opacity',String(.95*(1-f*.55)));particles.forEach(p=>{let rr=Math.max(0,r+p.j);p.q.setAttribute('cx',origin.x+Math.cos(p.a)*rr);p.q.setAttribute('cy',origin.y+Math.sin(p.a)*rr);p.q.setAttribute('fill-opacity',String(.85*(1-f*.45)))});targets.forEach(o=>{if(done.has(o.t)||o.d>r)return;done.add(o.t);let t=o.t;if(t.done||t.type!=='UNKNOWN')return;t.naiDerived=false;t.type=t.truth;score+=25;ensureRing(t);pulse(t.type);log('EWO COLLECTION // '+designation(t)+' // '+t.type)});ui(true);if(f<1)requestAnimationFrame(frame);else{setTimeout(()=>layer.textContent='',220);cpNotice('EWO SWEEP COMPLETE',done.size+' TRACKS IDENTIFIED','intel');sound('classify')}}requestAnimationFrame(frame)
}
function passiveToggleDeploy(){if(!passiveEnabled()||!running)return;if(passiveNodes.length>=PASSIVE_MAX){cpNotice('PASSIVE ISR','MAXIMUM 6 NODES ACTIVE','intel');return}const cost=passiveCost();if(passiveCredits<cost){cpNotice('PASSIVE ISR','INSUFFICIENT ISR CREDITS // '+passiveCredits+'/'+cost,'intel');return}passiveDeployMode=!passiveDeployMode;A.mode=passiveDeployMode?'PASSIVE_DEPLOY':(A.dest?'ENROUTE':'ON_STATION');if(passiveDeployMode){A.dest=null;stopCollect();sel=null;log('PASSIVE ISR // SELECT DEPLOYMENT POINT')}ui(true)
}
function truth(){let r=Math.random();if(campaignMission==='ARCADE'){let threat=Math.min(.72,.42+(arcadeThreatLevel-1)*.045);return r<threat/2?'HOSTILE':r<threat?'IRREGULAR':r<threat+(1-threat)/2?'NEUTRAL':'FRIENDLY'}if(campaignMission==='01-05')return r<.30?'HOSTILE':r<.60?'IRREGULAR':r<.80?'NEUTRAL':'FRIENDLY';if(campaignMission==='01-01'||campaignMission==='01-02'||campaignMission==='01-03'||campaignMission==='01-04')return r<.25?'HOSTILE':r<.50?'IRREGULAR':r<.75?'NEUTRAL':'FRIENDLY';if(phase===1)return r<.25?'HOSTILE':r<.38?'IRREGULAR':r<.68?'NEUTRAL':'FRIENDLY';if(phase===2)return r<.30?'HOSTILE':r<.48?'IRREGULAR':r<.75?'NEUTRAL':'FRIENDLY';return r<.34?'HOSTILE':r<.58?'IRREGULAR':r<.80?'NEUTRAL':'FRIENDLY'}function parms(){
 if(campaignMission==='ARCADE'){let l=Math.max(1,arcadeThreatLevel);return {gap:Math.max(2.4,8.5-(l-1)*.7),cap:Math.min(10,5+Math.floor((l-1)/2))}}
 if(campaignMission==='01-05')return phase===1?{gap:8.0,cap:6}:phase===2?{gap:5.5,cap:7}:{gap:3.8,cap:8};
 return phase===1?{gap:9.5,cap:5}:phase===2?{gap:6.5,cap:6}:{gap:4.5,cap:7}
}const PREFIX={UNKNOWN:'UNK',NEUTRAL:'NTL',HOSTILE:'HST',IRREGULAR:'IRG',FRIENDLY:'FRI'};function designation(t){let n=String(t.id).split('-').pop();return (t.type==='UNKNOWN'?'UNK':PREFIX[t.type])+'-'+n}function color(t){return t.type==='HOSTILE'?'#ff5b55':t.type==='IRREGULAR'?'#d8a83e':t.type==='NEUTRAL'?'#55d66b':t.type==='FRIENDLY'?'#4da3ff':'#dce5e8'}function spawn(stationary=null){let p=parms();
if(stationary===null){
  if(campaignMission==='01-02'){
    stationary=campaignStationarySpawned<4 ? true : Math.random()<.45;
  }else stationary=Math.random()<.3;
}if(!running||T.filter(t=>!t.done).length>=p.cap)return;let x,y,vx=0,vy=0;if(stationary){x=130+Math.random()*640;y=90+Math.random()*460}else{let side=Math.floor(Math.random()*4),s=1.5+Math.random()*1.9;if(side===0){x=40;y=60+Math.random()*520;vx=s;vy=(Math.random()-.5)*1.3}else if(side===1){x=860;y=60+Math.random()*520;vx=-s;vy=(Math.random()-.5)*1.3}else if(side===2){x=60+Math.random()*780;y=40;vx=(Math.random()-.5)*1.3;vy=s}else{x=60+Math.random()*780;y=610;vx=(Math.random()-.5)*1.3;vy=-s}}let tr=truth(),t={id:'UNK-'+String(next++).padStart(3,'0'),x,y,vx,vy,stationary,truth:tr,type:'UNKNOWN',done:false,collecting:false,enemyRange:stationary?145:105,ring:null,bornAt:performance.now(),proxSite:null,proxSince:0,proxAssessed:false,hostileCollect:false,collectStarted:0,compromiseAdded:0,stallX:null,stallY:null,stallAt:performance.now(),stallLogged:false,naiSince:0,naiPct:0,naiDerived:false};
if(campaignMission==='01-03'||campaignMission==='01-04'||campaignMission==='01-05'||campaignMission==='ARCADE'){
  const siteList=B.map(b=>({name:b.id,x:b.x,y:b.y}));
  if(siteList.length&&Math.random()<(campaignMission==='ARCADE'?.72:(campaignMission==='01-05'?.70:.58))){let ps=siteList[Math.floor(Math.random()*siteList.length)];t.proxSite=ps.name;t.x=ps.x+(Math.random()-.5)*105;t.y=ps.y+(Math.random()-.5)*105;t.proxSince=performance.now();t.stationary=Math.random()<.62}
}if(campaignMission==='01-02'&&stationary)campaignStationarySpawned++;if(tr==='IRREGULAR'&&!stationary&&Math.random()<.72){let target=B[Math.floor(Math.random()*B.length)],dx=target.x-x,dy=target.y-y,d=Math.hypot(dx,dy),s=2.2+Math.random();t.vx=dx/d*s;t.vy=dy/d*s}let g=document.createElementNS(NS,'g'),hit=document.createElementNS(NS,'circle'),v=document.createElementNS(NS,'line'),c=document.createElementNS(NS,'circle'),d=document.createElementNS(NS,'path'),tx=document.createElementNS(NS,'text');g.style.cursor='pointer';g.style.pointerEvents='all';hit.setAttribute('r','29');hit.setAttribute('fill','transparent');v.setAttribute('stroke-opacity','.55');v.setAttribute('stroke-width','1.5');v.style.pointerEvents='none';c.setAttribute('r','17');c.setAttribute('fill','#0d1418');c.setAttribute('stroke-width','2');c.style.pointerEvents='none';d.setAttribute('d',stationary?'M-9 -9H9V9H-9Z':'M0 -8L8 0L0 8L-8 0Z');d.setAttribute('fill','none');d.setAttribute('stroke-width','2');d.style.pointerEvents='none';tx.setAttribute('x','25');tx.setAttribute('y','4');tx.setAttribute('font-size','11');tx.style.pointerEvents='none';g.append(hit,v,c,d,tx);Object.assign(t,{el:g,v,c,d,tx});g.addEventListener('pointerdown',e=>{e.preventDefault();C.track++;rec('TRACK_POINTER',`${t.id} mode=${A.mode}`);e.stopPropagation();if(!running)return;if(passiveDeployMode){passivePlace({x:t.x,y:t.y});return}if(A.mode==='ISR_SELECTED'){order({x:t.x,y:t.y});ui(true);return}sel=t;ui(true)});$('#tracks').append(g);T.push(t);log('NEW '+(stationary?'STATIC ':'')+'TRACK // '+t.id);sound('contact')}function ensureRing(t){let threat=t.type==='HOSTILE'||t.type==='IRREGULAR';if(threat&&!t.ring){let c=document.createElementNS(NS,'circle');c.setAttribute('r',t.enemyRange);c.setAttribute('fill-opacity','.025');c.setAttribute('stroke-opacity','.36');c.setAttribute('stroke-dasharray','5 7');$('#enemyRings').append(c);t.ring=c}if(t.ring){t.ring.setAttribute('visibility',threat&&!t.done?'visible':'hidden');if(threat){let c=color(t);t.ring.setAttribute('cx',t.x);t.ring.setAttribute('cy',t.y);t.ring.setAttribute('fill',c);t.ring.setAttribute('stroke',c)}}}function draw(t){if(t.done){t.el.setAttribute('visibility','hidden');ensureRing(t);return}t.el.setAttribute('visibility','visible');t.el.setAttribute('transform',`translate(${t.x} ${t.y})`);let inside=D(A,t)<=cpEffectiveISRRadius(),c=color(t);t.c.setAttribute('r',sel===t?'22':'17');t.c.setAttribute('stroke',c);t.d.setAttribute('stroke',c);t.tx.setAttribute('fill',c);t.v.setAttribute('stroke',c);t.v.setAttribute('x2',t.vx*13);t.v.setAttribute('y2',t.vy*13);t.tx.textContent=designation(t)+' // '+(t.type==='UNKNOWN'&&t.naiSince?'NAI COLLECTING '+t.naiPct+'%':t.collecting?'COLLECTING '+pct+'%':t.type==='UNKNOWN'?(naiForTrack(t)?'NAI // AUTO COLLECTION':passiveCovered(t)?(inside?'PASSIVE CUE // IN RANGE':'PASSIVE CUE'):(inside?'IN RANGE':'UNKNOWN')):t.type);ensureRing(t)}function pulse(k){let c=k==='HOSTILE'?'#ff5b55':k==='IRREGULAR'?'#d8a83e':k==='NEUTRAL'?'#55d66b':'#4da3ff';$('#sr').setAttribute('stroke',c);$('#sf').setAttribute('fill',c);$('#sr').setAttribute('stroke-width','5');$('#sf').setAttribute('fill-opacity','.13');setTimeout(()=>{$('#sr').setAttribute('stroke','currentColor');$('#sf').setAttribute('fill','currentColor');$('#sr').setAttribute('stroke-width','2.4');$('#sf').setAttribute('fill-opacity','.025')},850)}function naiClassify(t){if(!t||t.done||t.type!=='UNKNOWN')return;t.naiSince=0;t.naiPct=100;t.naiDerived=true;t.type=t.truth;score+=25;if(campaignMission==='01-01'||campaignMission==='01-02')campaignIds++;if(campaignMission==='01-02'&&t.stationary)campaignStationaryAssessed++;if(campaignMission==='01-03'&&t.proxSite&&!t.proxAssessed){t.proxAssessed=true;campaignProximityAssessed++;}pulse(t.type);ensureRing(t);log('NAI CLASSIFIED // '+designation(t)+' // '+t.type);cpNotice('NAI AUTO COLLECTION',designation(t)+' // '+t.type,'intel');sound('classify');if(campaignMission==='01-02')cpCheck0102();if(campaignMission==='01-03')cpCheck0103();ui(true)}
function naiTick(now){if(!passiveEnabled()||!passiveNAIs.length)return;T.forEach(t=>{if(t.done||t.type!=='UNKNOWN'||t.collecting){t.naiSince=0;t.naiPct=0;return}const z=naiForTrack(t);if(!z){t.naiSince=0;t.naiPct=0;return}if(!t.naiSince){t.naiSince=now;t.naiPct=0;log('NAI-'+String(z.id).padStart(2,'0')+' // AUTO COLLECTION // '+t.id)}t.naiPct=Math.min(99,Math.floor((now-t.naiSince)*100/NAI_COLLECT_MS));if(now-t.naiSince>=NAI_COLLECT_MS)naiClassify(t)})}
function collect(){if(!running||!sel||sel.done||sel.type!=='UNKNOWN'||D(A,sel)>A.r||col)return;col=sel;col.collecting=true;pct=0;let st=Date.now(),collectMs=passiveCovered(col)?550:1000;ci=setInterval(()=>{pct=Math.min(99,Math.floor((Date.now()-st)*100/collectMs));ui(true)},80);ct=setTimeout(()=>{clearInterval(ci);ci=ct=null;col.collecting=false;col.type=col.truth;score+=25;if(campaignMission==='01-01'||campaignMission==='01-02')campaignIds++;
if(campaignMission==='01-02'&&col.stationary)campaignStationaryAssessed++;
if(campaignMission==='01-03'&&col.proxSite&&!col.proxAssessed){col.proxAssessed=true;campaignProximityAssessed++;}
pct=100;pulse(col.type);ensureRing(col);log('CLASSIFIED // '+designation(col)+' // '+col.type);sound('classify');tutorialAdvance('classified');col=null;if(campaignMission==='01-02')cpCheck0102();if(campaignMission==='01-03')cpCheck0103();ui(true)},collectMs)}function cpDecisionFloat(t,ok){
 const layer=$('#decisionFeedback');if(!layer||!t)return;
 const n=document.createElementNS(NS,'text');
 let cls='bad';
 if(ok)cls=t.truth==='HOSTILE'?'good-hostile':t.truth==='IRREGULAR'?'good-irregular':t.truth==='FRIENDLY'?'good-friendly':'good-neutral';
 n.setAttribute('class','decision-float '+cls);
 n.setAttribute('x',t.x);n.setAttribute('y',t.y-24);
 n.textContent=ok?'+1':'-1';layer.appendChild(n);
 setTimeout(()=>n.remove(),1150);
}
function decide(a){
 if(!running||!sel||sel.done||sel.type==='UNKNOWN')return;
 const target=sel;
 const threat=target.type==='HOSTILE'||target.type==='IRREGULAR';
 const ok=(threat&&a==='INTERCEPT')||(!threat&&a==='CLEAR');
 if(ok){
   if(campaignMission==='ARCADE'){arcadeCorrect++;arcadeStreak++;arcadeBestStreak=Math.max(arcadeBestStreak,arcadeStreak);score+=Math.min(250,arcadeStreak*10);}
   score+=100;
   if(threat&&a==='INTERCEPT')sound('explosion');
   passiveAward(target.naiDerived?5:10,target.naiDerived?'NAI DISPOSITION':'CORRECT DISPOSITION');
   if(campaignMission==='01-01'||campaignMission==='01-02'||campaignMission==='01-03'||campaignMission==='01-04'||campaignMission==='01-05'||campaignMission==='ARCADE'){
     campaignCorrect++;
     if(threat)campaignThreatResolved++;else campaignNonThreatResolved++;
   }
   if(cpThreatMission()&&threat&&target.hostileCollect){
     campaignCollectionInterrupted++;passiveAward(10,'HOSTILE COLLECTION INTERRUPTED');
     const before=campaignCompromise;
     campaignCompromise=Math.max(cpCompromiseFloor(),campaignCompromise-2);
     const reduced=before-campaignCompromise;
     log('HOSTILE COLLECTION DISRUPTED // AO COMPROMISE -'+reduced.toFixed(1)+'%');
     cpRecoveryFlash('HOSTILE COLLECTION DISRUPTED','AO COMPROMISE -'+reduced.toFixed(1)+'%','HOSTILE');
   }
   if(cpThreatMission()&&!threat){
     if(target.truth==='FRIENDLY'){
       const before=campaignCompromise;campaignCompromise=Math.max(cpCompromiseFloor(),campaignCompromise-5);
       const reduced=before-campaignCompromise;
       log('FRIENDLY PRESENCE CONFIRMED // AO COMPROMISE -'+reduced.toFixed(1)+'%');
       cpRecoveryFlash('FRIENDLY PRESENCE CONFIRMED','AO COMPROMISE -'+reduced.toFixed(1)+'%','FRIENDLY');
     }else if(target.truth==='NEUTRAL'){
       const before=campaignCompromise;campaignCompromise=Math.max(cpCompromiseFloor(),campaignCompromise-3);
       const reduced=before-campaignCompromise;
       log('NEUTRAL REPORTING CORROBORATED // AO COMPROMISE -'+reduced.toFixed(1)+'%');
       cpRecoveryFlash('NEUTRAL REPORTING CORROBORATED','AO COMPROMISE -'+reduced.toFixed(1)+'%','NEUTRAL');
     }
   }
   if(threat)ints++;
   log(a+' // '+designation(target)+' // CORRECT');
 }else{
   if(campaignMission==='ARCADE'){arcadeWrong++;arcadeStreak=0;}
   score-=50;
   log(a+' // '+designation(target)+' // ERROR');
 }
 decisionTotal++;if(ok)decisionCorrect++;
 // Integrity is analytical accuracy with a four-call confidence buffer. One early error matters,
 // but no single contact can erase 20 points of mission health.
 integrity=Math.round(((decisionCorrect+4)/(decisionTotal+4))*100);
 if(!ok)sound('wrong');else if(!threat&&a==='CLEAR')sound('clear');
 cpDecisionFloat(target,ok);if(campaignMission==='TUTORIAL'&&ok){tutorialAdvance('decision');setTimeout(tutorialFinish,450);}
 target.done=true;ensureRing(target);resolved++;
 if(ok){
   if(campaignMission==='01-01')cpCheck0101();
   else if(campaignMission==='01-02')cpCheck0102();
   else if(campaignMission==='01-03')cpCheck0103();
   else if(campaignMission==='01-04')cpCheck0104();
   else if(campaignMission==='01-05')cpCheck0105();
 }
 if(campaignMission==='ARCADE'&&integrity<=0&&!campaignFinished)arcadeFinish('INTELLIGENCE FAILURE');
 sel=null;ui(true);
}
function compromise(){return B.reduce((a,b)=>a+b.exposure,0)/B.length}let cpRecoveryTimer=0;
function cpThreatMission(){return campaignMission==='01-04'||campaignMission==='01-05'||campaignMission==='ARCADE'}
function cpRecoveryFlash(title,detail,kind){
 cpNotice(title,detail,kind==='FRIENDLY'?'friendly':kind==='NEUTRAL'?'neutral':'hostile');
}
function cpIntelDropReset(){
 intelDropOffered=false;intelDropActive=false;intelDropAt=performance.now()+65000;intelDropExpires=0;intelFusionUntil=0;
 const d=$('#intelDrop'),b=$('#intelFusionBadge');if(d)d.classList.add('hidden');if(b)b.classList.add('hidden');
}
function cpIntelDropOffer(){
 if(!cpThreatMission()||intelDropOffered||campaignFinished)return;
 intelDropOffered=true;intelDropActive=true;intelDropExpires=performance.now()+10000;
 const d=$('#intelDrop');if(d)d.classList.remove('hidden');
 log('INTEL DROP // NEW REPORTING AVAILABLE');sound('intel');cpNotice('INTEL DROP','NEW REPORTING AVAILABLE','intel');
}
function reconstituteSite(b){if(!supplyRepairMode||supplyPackages<1||!b||!b.degraded||b.reconstituting)return;supplyPackages--;supplyRepairMode=false;B.forEach(x=>x.el.classList.remove('blue-repairable'));b.reconstituting=true;tutorialAdvance('supply-target');b.repairStarted=performance.now();b.repairUntil=b.repairStarted+12000;b.repairGraceUntil=0;cpRenderBlueSite(b);cpNotice('RECONSTITUTION',b.id+' // SUPPLY RECEIVED // 12 SEC','friendly');banner('RECONSTITUTING // '+b.id,1400);log('SUPPLY // '+b.id+' // RECONSTITUTING');ui(true)}
function reconstitutionTick(now){B.forEach(b=>{if(!b.reconstituting)return;const left=Math.max(0,b.repairUntil-now),f=Math.min(1,1-left/12000);b.repairPct=Math.round(f*100);b.exposure=Math.max(35,100-65*f);if(left<=0){b.reconstituting=false;b.degraded=false;b.exposure=35;b.repairGraceUntil=now+15000;b.repairPct=100;b.el.classList.remove('training-degraded');campaignCompromise=cpCompromiseFloor();cpRenderBlueSite(b);cpNotice('SITE RESTORED',b.id+' // OPERATIONAL // 35% EXPOSURE // 15 SEC PROTECTED','friendly');banner(b.id+' // RESTORED',1800);log('RECONSTITUTION COMPLETE // '+b.id);tutorialAdvance('repair-complete')}ui(true)})}
function supplyActivate(){if(supplyPackages<1){cpNotice('SUPPLY','NO RECONSTITUTION PACKAGE HELD','intel');return}const lost=B.filter(b=>b.degraded&&!b.reconstituting);if(!lost.length){cpNotice('SUPPLY HELD','NO DEGRADED SITE // PACKAGE RETAINED','intel');return}supplyRepairMode=!supplyRepairMode;B.forEach(b=>b.el.classList.toggle('blue-repairable',supplyRepairMode&&b.degraded&&!b.reconstituting));cpNotice('SUPPLY PACKAGE',supplyRepairMode?'SELECT A RED DEGRADED BLUFOR SITE':'RECONSTITUTION TARGETING CANCELLED','intel');if(supplyRepairMode)banner('RECONSTITUTION // SELECT DEGRADED SITE',1400);ui(true)}
function cpIntelDropChoose(kind){
 if(!intelDropActive)return;
 if(campaignMission==='TUTORIAL'){tutorialIntelSeen.add(kind);}
 intelDropActive=false;const d=$('#intelDrop');if(d)d.classList.add('hidden');
 if(kind==='MITIGATE'){
   campaignCompromise=Math.max(cpCompromiseFloor(),campaignCompromise-10);
   log('INTEL DROP // MITIGATION APPLIED // AO COMPROMISE -10%');cpNotice('INTEL DROP // MITIGATE','AO COMPROMISE -10%','intel');
 }else if(kind==='SUPPLY'){
   supplyPackages=Math.min(1,supplyPackages+1);log('INTEL DROP // RECONSTITUTION SUPPLY ACQUIRED');cpNotice('SUPPLY ACQUIRED','PACKAGE HELD // USE SUPPLY WHEN A SITE IS DEGRADED','intel');sound('intel');ui(true);
 }else{
   intelFusionUntil=performance.now()+20000;
   const b=$('#intelFusionBadge');if(b)b.classList.remove('hidden');
   log('INTEL DROP // ISR FUSION ACTIVE // 20 SEC');sound('fusion');cpNotice('INTEL DROP // EXPLOIT','ISR FUSION ACTIVE // 20 SEC','intel');
 }
 if(campaignMission==='TUTORIAL'){tutorialAdvance('intel');}else if(campaignMission==='ARCADE'){intelDropOffered=false;intelDropAt=performance.now()+70000+Math.random()*25000;}
}
function cpIntelDropTick(){
 if(!cpThreatMission()||campaignFinished)return;
 const now=performance.now();
 if(!intelDropOffered&&intelDropAt&&now>=intelDropAt)cpIntelDropOffer();
 if(intelDropActive){
   const left=Math.max(0,Math.ceil((intelDropExpires-now)/1000));
   const t=$('#intelDropTimer');if(t)t.textContent='REPORT EXPIRES // '+left;
   if(now>=intelDropExpires){intelDropActive=false;const d=$('#intelDrop');if(d)d.classList.add('hidden');log('INTEL DROP EXPIRED');cpNotice('INTEL DROP','REPORT EXPIRED','intel');if(campaignMission==='ARCADE'){intelDropOffered=false;intelDropAt=now+70000+Math.random()*25000;}}
 }
 if(intelFusionUntil){
   const left=Math.max(0,Math.ceil((intelFusionUntil-now)/1000));
   const b=$('#intelFusionBadge');
   if(now<intelFusionUntil){if(b){b.classList.remove('hidden');b.textContent='INTEL FUSION // '+left+' SEC';}}
   else{intelFusionUntil=0;if(b)b.classList.add('hidden');log('INTEL FUSION // ENDED');cpNotice('INTEL FUSION','EFFECT ENDED','intel');}
 }
}
function cpFusionActive(){return cpThreatMission()&&intelFusionUntil&&performance.now()<intelFusionUntil}
function cpEffectiveISRRadius(){return A.r*(cpFusionActive()?1.30:1)}
function cpDegradedCount(){return B.filter(b=>b.degraded).length}
function cpRenderBlueSite(b){if(!b||!b.el)return;const c=b.reconstituting?'#d8a83e':b.degraded?'#ff5b55':'#4da3ff';if(b.circle)b.circle.setAttribute('stroke',c);if(b.icon)b.icon.setAttribute('stroke',c);if(b.label){b.label.setAttribute('fill',c);b.label.textContent=b.id+' // '+Math.round(b.exposure||0)+'%'+(b.reconstituting?' // RECON':b.degraded?' // DEGRADED':'')}}
function cpCompromiseFloor(){const exposure=B.reduce((sum,b)=>sum+(b.exposure||0),0);if(campaignMission==='ARCADE')return Math.min(100,exposure/20+cpDegradedCount()*8);return Math.min(50,exposure/10)}
function cpApplyCompromiseFloor(){const floor=cpCompromiseFloor();if(cpThreatMission()&&campaignCompromise<floor)campaignCompromise=floor;return floor}
function cpMobilizeFromDegradedSite(siteName){
 T.forEach(t=>{
   if(t.done||t.dead||t.proxSite!==siteName)return;
   t.stationary=false;t.hostileCollect=false;t.collectStarted=0;t.proxSince=0;
   const a=Math.random()*Math.PI*2,s=2.0+Math.random()*1.8;
   t.vx=Math.cos(a)*s;t.vy=Math.sin(a)*s;
   t.proxSite=null;
   t.stallX=t.x;t.stallY=t.y;t.stallAt=performance.now();t.stallLogged=false;
 });
}
function cpContestedTick(dt){
 if(!cpThreatMission()||campaignFinished)return;
 let active=0,pendingAdds=[],requestedTotal=0;
 T.forEach(t=>{
   const threat=(t.truth==='HOSTILE'||t.truth==='IRREGULAR');
   if(threat&&t.proxSite&&!t.dead&&!t.done){
     const site=B.find(b=>b.id===t.proxSite);
     if(site&&site.reconstituting){t.hostileCollect=false;t.collectStarted=0;return;}
     if(site&&site.repairGraceUntil&&performance.now()<site.repairGraceUntil){t.hostileCollect=false;t.collectStarted=0;return;}
     if(site&&site.degraded){
       t.stationary=false;t.hostileCollect=false;t.collectStarted=0;t.proxSite=null;
       const a=Math.random()*Math.PI*2,s=2.0+Math.random()*1.8;t.vx=Math.cos(a)*s;t.vy=Math.sin(a)*s;
       return;
     }
     if(!t.collectStarted)t.collectStarted=performance.now();
     const setupMs=campaignMission==='ARCADE'?Math.max(6000,12000-(arcadeThreatLevel-1)*750):5000;
     if(performance.now()-t.collectStarted>setupMs&&!t.hostileCollect){t.hostileCollect=true;sound('warning');}
     if(t.hostileCollect){
       active++;
       const room=Math.max(0,10-(t.compromiseAdded||0));
       const requested=Math.min(room,dt*.12);
       if(requested>0)pendingAdds.push([t,site,requested]),requestedTotal+=requested;
     }
   }
 });
 if(requestedTotal>0){
   const aoAllowed=Math.min(requestedTotal,dt*.25),scale=aoAllowed/requestedTotal;
   pendingAdds.forEach(([t,site,requested])=>{
     const add=requested*scale;
     t.compromiseAdded=(t.compromiseAdded||0)+add;
     campaignCompromise=Math.min(100,campaignCompromise+add);
     if(site&&!site.degraded){
       site.exposure=Math.min(100,(site.exposure||0)+add*4);
       if(site.exposure>=100){
         site.exposure=100;site.degraded=true;cpRenderBlueSite(site);
         const floor=cpApplyCompromiseFloor();
         log(site.id+' // FULLY EXPOSED // BASE DEGRADED // OE FLOOR '+floor+'%');
         sound('degraded');cpNotice(site.id+' // DEGRADED','OE FLOOR '+floor+'% // TRACKS MOBILIZING','hostile');
         cpMobilizeFromDegradedSite(site.id);
       }
     }
   });
 }
 cpApplyCompromiseFloor();
 const w=$('#hostileCollectionWarning');if(w)w.classList.toggle('hidden',active===0);
 if(campaignMission==='01-05')cpCheck0105();
 if(campaignCompromise>=60&&!campaignFinished){if(campaignMission==='ARCADE')arcadeFinish('OE COMPROMISED');else cpFinish0104('COMPROMISE');}
}
function cpTrackStallGuard(){
if(!running||window.CP_PAUSED)return;
const now=performance.now();
T.forEach(t=>{if(t.dead||t.stationary)return;if(t.stallX===null){t.stallX=t.x;t.stallY=t.y;t.stallAt=now;return}
let moved=Math.hypot(t.x-t.stallX,t.y-t.stallY);
if(moved>3){t.stallX=t.x;t.stallY=t.y;t.stallAt=now;t.stallLogged=false}
else if(now-t.stallAt>8000&&!t.stallLogged){t.stallLogged=true;log('TRACK STALL // '+String(t.type||'UNKNOWN')+'-'+String(t.id).padStart(3,'0'));}
});
}
function enemy(dt){
 if(campaignMission==='01-02'||campaignMission==='01-03')return;
 T.forEach(t=>{
  if(t.done||(t.truth!=='HOSTILE'&&t.truth!=='IRREGULAR'))return;
  B.forEach(b=>{
   if(b.reconstituting||(b.repairGraceUntil&&performance.now()<b.repairGraceUntil))return;
   if(D(t,b)<=t.enemyRange&&!b.degraded){
    let mult=t.truth==='IRREGULAR'?2.15:1,burn=(t.stationary?1.8:1.05)*mult*dt;
    b.exposure=Math.min(100,b.exposure+burn);score-=burn*.12;
    if(b.exposure>=100){
     b.exposure=100;b.degraded=true;cpRenderBlueSite(b);
     const floor=cpApplyCompromiseFloor();
     log(b.id+' // FULLY EXPOSED // BASE DEGRADED // OE FLOOR '+floor.toFixed(1)+'%');
     sound('degraded');cpNotice(b.id+' // DEGRADED','OE FLOOR '+floor.toFixed(1)+'% // TRACKS MOBILIZING','hostile');
     cpMobilizeFromDegradedSite(b.id);
    }
   }
  });
 });
}
function detail(){if(!sel||sel.done){$('#none').hidden=false;$('#detail').hidden=true;return}$('#none').hidden=true;$('#detail').hidden=false;let d=D(A,sel),inside=d<=cpEffectiveISRRadius(),u=sel.type==='UNKNOWN';$('#tid').textContent=designation(sel);$('#type').textContent=sel.type;$('#motion').textContent=sel.stationary?'STATIONARY':'MOBILE';
let obsRow=$('#observedRow');if(obsRow){let show=sel.type!=='UNKNOWN';obsRow.hidden=!show;if(show){let sec=Math.max(0,Math.floor((performance.now()-sel.bornAt)/1000));$('#observed').textContent=String(Math.floor(sec/60)).padStart(2,'0')+':'+String(sec%60).padStart(2,'0')}}
$('#dist').textContent=Math.round(d)+' GRID';$('#sense').textContent=inside?'IN RANGE':'OUT OF RANGE';$('#collect').hidden=!u;$('#collect').disabled=!inside||!!col;$('#prog').hidden=col!==sel;$('#pct').textContent=pct+'%';$('#bar').style.width=pct+'%';$('#dec').hidden=u}function cpStatusClass(el,state){if(!el)return;el.classList.remove('status-good','status-warn','status-bad');el.classList.add(state)}
function cpRefreshStatusColors(){
 let integrityState=integrity>=80?'status-good':integrity>=60?'status-warn':'status-bad';
 let oeState=campaignCompromise<30?'status-good':campaignCompromise<50?'status-warn':'status-bad';
 cpStatusClass($('#integrity'),integrityState);cpStatusClass($('#objIntegrity'),integrityState);
 cpStatusClass($('#comp'),oeState);cpStatusClass($('#objCompromise'),oeState);
}
function displayMode(mode){return String(mode||'STANDBY').replaceAll('_',' ')}function ui(force=false){let now=performance.now();if(!force&&now-lastUi<200)return;lastUi=now;let p=parms(),c=(cpThreatMission()?campaignCompromise:compromise()),n=T.filter(t=>!t.done&&t.type==='UNKNOWN'&&D(A,t)<=cpEffectiveISRRadius()).length;$('#stateLine').textContent=A.mode==='ISR_SELECTED'?'ISR CONTROL // SELECT DESTINATION':'ISR // '+displayMode(A.mode);$('#rangeLine').textContent='SENSOR // '+n+' UNKNOWN IN RANGE';$('#score').textContent=String(Math.max(0,Math.round(score))).padStart(4,'0');$('#integrity').textContent=Math.round(integrity)+'%';$('#comp').textContent=Math.round(c)+'%';const cm=$('#compMeter'),im=$('#integrityMeter');if(cm){cm.style.width=Math.min(100,Math.max(0,c))+'%';cm.className=c>=50?'danger':c>=30?'warn':''}if(im){im.style.width=Math.min(100,Math.max(0,integrity))+'%';im.className=integrity<40?'danger':integrity<80?'warn':''}$('#compTop').textContent=Math.round(c)+'%';$('#resolved').textContent=resolved;$('#ints').textContent=ints;
let or=$('#objResolved'),oi=$('#objInterrupted'),og=$('#objIntegrity'),oc=$('#objCompromise'),ot=$('#objectiveTracker'),
    ott=$('#objectiveTitle'),osl=$('#objectiveSecondaryLabel'),osc=$('#objectiveSecondaryChip'),oec=$('#objectiveOEChip');
if(ot)ot.style.display=(campaignMission&&['01-01','01-02','01-03','01-04','01-05','ARCADE'].includes(campaignMission))?'flex':'none';
if(campaignMission&&or){
 let title='ESTABLISH',resolveTarget=10,secondaryLabel='',secondaryValue='',secondaryComplete=false,showOE=false;
 if(campaignMission==='ARCADE'){title='ARCADE // THREAT '+arcadeThreatLevel;resolveTarget=Math.max(1,arcadeCorrect);secondaryLabel='STREAK';secondaryValue=arcadeStreak+' / '+arcadeBestStreak;secondaryComplete=arcadeStreak>=5;showOE=true}
 if(campaignMission==='01-02'){title='PATTERN';resolveTarget=12;secondaryLabel='STATIONARY';secondaryValue=campaignStationaryAssessed+'/4';secondaryComplete=campaignStationaryAssessed>=4}
 if(campaignMission==='01-03'){title='INDICATORS';resolveTarget=14;secondaryLabel='PROXIMITY';secondaryValue=campaignProximityAssessed+'/5';secondaryComplete=campaignProximityAssessed>=5}
 if(campaignMission==='01-04'){title='CONTESTED';resolveTarget=14;secondaryLabel='INTERRUPT';secondaryValue=campaignCollectionInterrupted+'/4';secondaryComplete=campaignCollectionInterrupted>=4;showOE=true}
 if(campaignMission==='01-05'){title='CONDITIONS SET';resolveTarget=16;secondaryLabel='INTERRUPT';secondaryValue=campaignCollectionInterrupted+'/5';secondaryComplete=campaignCollectionInterrupted>=5;showOE=true}
 if(ott)ott.textContent='OBJECTIVES // '+title;
 or.textContent=campaignMission==='ARCADE'?String(arcadeCorrect):campaignCorrect+'/'+resolveTarget;
 if(osc)osc.style.display=secondaryLabel?'inline-flex':'none';
 if(osl)osl.textContent=secondaryLabel;
 if(oi)oi.textContent=secondaryValue;
 og.textContent=campaignMission==='ARCADE'?Math.round(integrity)+'/0':Math.round(integrity)+'/80';
 if(oec)oec.style.display=showOE?'inline-flex':'none';
 if(oc)oc.textContent=Math.round(campaignCompromise)+'/'+(campaignMission==='01-05'?'50':'60');
 or.parentElement.classList.toggle('complete',campaignMission==='ARCADE'?arcadeStreak>=5:campaignCorrect>=resolveTarget);
 if(oi&&oi.parentElement){oi.parentElement.classList.toggle('complete',secondaryComplete);oi.parentElement.classList.remove('danger')}
 og.parentElement.classList.toggle('complete',integrity>=80);og.parentElement.classList.toggle('danger',integrity<80);
 if(oc&&oc.parentElement){oc.parentElement.classList.toggle('complete',showOE&&campaignCompromise<60);oc.parentElement.classList.toggle('danger',showOE&&campaignCompromise>=50)}
 let od=$('#objDegraded');if(od)od.textContent=cpDegradedCount()+' / 5 // FLOOR '+cpCompromiseFloor()+'%';
 cpRefreshStatusColors();
}
B.forEach(cpRenderBlueSite);$('#active').textContent=T.filter(t=>!t.done).length;$('#cap').textContent=p.cap;$('#isrTop').textContent=displayMode(A.mode);let mb=$('#isrModeBadge');mb.textContent=A.mode==='ISR_SELECTED'?'ISR ΓùÅ CONTROL ACTIVE ΓÇö SELECT DESTINATION':A.mode==='ENROUTE'?'ISR ΓùÅ ENROUTE':A.mode==='ON_STATION'?'ISR ΓùÅ ON STATION':'ISR ΓùÅ STANDBY';mb.classList.toggle('active',A.mode==='ISR_SELECTED');$('#sites').innerHTML=B.map(b=>`<div class="site ${b.degraded?'degraded':''} ${b.reconstituting?'reconstituting':''}"><div class="row"><span>${b.id}${b.reconstituting?' // RECON '+(b.repairPct||0)+'%':b.degraded?' // DEGRADED':''}</span><b>${Math.round(b.exposure)}%</b></div><div class="meter"><i style="width:${b.reconstituting?(b.repairPct||0):b.exposure}%"></i></div></div>`).join('');const pp=$('#passiveIsrPanel'),pb=$('#passiveDeploy');if(pp)pp.classList.toggle('hidden',!passiveEnabled());if(passiveEnabled()){const pc=$('#passiveCredits'),pn=$('#passiveCount'),ph=$('#passiveHint');if(pc)pc.textContent=passiveCredits;if(pn)pn.textContent=passiveNodes.length+' / '+PASSIVE_MAX;if(pb){const cost=passiveCost(),maxed=passiveNodes.length>=PASSIVE_MAX;pb.textContent=maxed?'NODE LIMIT // 6 / 6':(passiveDeployMode?'CANCEL DEPLOYMENT':'DEPLOY NODE // '+cost);pb.disabled=!running||(!passiveDeployMode&&(maxed||passiveCredits<cost));pb.classList.toggle('deploying',passiveDeployMode)}if(ph)ph.textContent=ewoTargetMode?'EWO TARGETING // SELECT SWEEP ORIGIN':passiveDeployMode?'SELECT A POINT ON THE MAP // NODE FOOTPRINT '+PASSIVE_RADIUS:'Correct +10 // interrupt +10 // NAI: 3 nodes / 4 hex max // SUPPLY '+supplyPackages+'/1';const su=$('#supplyUse');if(su){su.textContent=supplyRepairMode?'CANCEL SUPPLY TARGETING':'SUPPLY // '+supplyPackages+' / 1'+(supplyPackages?' // READY':'');su.disabled=!running||supplyPackages<1;}const ew=$('#ewoSweep');if(ew){ew.textContent=ewoTargetMode?'CANCEL EWO TARGETING':'EWO SWEEP // '+EWO_COST+' // BUY';ew.disabled=!running||(!ewoTargetMode&&(passiveCredits<EWO_COST||!T.some(t=>!t.done&&t.type==='UNKNOWN')))}}detail()}function geometry(){let now=performance.now();if(running&&A.mode==='ENROUTE'&&valid(A.dest)&&now-A.lastMove>700&&!stallLogged){stallLogged=true;log('ISR MONITOR // STALL DETECTED')}$('#sensor').setAttribute('transform',`translate(${A.x} ${A.y})`);$('#asset').setAttribute('transform',`translate(${A.x} ${A.y})`);$('#plane').setAttribute('transform',`rotate(${A.heading})`);$('#halo').setAttribute('stroke-opacity',A.mode==='ISR_SELECTED'?'.8':'0');$('#alabel').setAttribute('x',A.x+31);$('#alabel').setAttribute('y',A.y+5);if(valid(A.dest)){ $('#wp').setAttribute('visibility','visible');$('#route').setAttribute('x1',A.x);$('#route').setAttribute('y1',A.y);$('#route').setAttribute('x2',A.dest.x);$('#route').setAttribute('y2',A.dest.y);$('#dest').setAttribute('cx',A.dest.x);$('#dest').setAttribute('cy',A.dest.y)}else $('#wp').setAttribute('visibility','hidden');if(col){$('#beam').setAttribute('visibility','visible');$('#beamLine').setAttribute('x1',A.x);$('#beamLine').setAttribute('y1',A.y);$('#beamLine').setAttribute('x2',col.x);$('#beamLine').setAttribute('y2',col.y)}else $('#beam').setAttribute('visibility','hidden');T.forEach(draw)}function diagnostic(now){if(now-lastDiag<100)return;lastDiag=now;let age=Math.round(now-A.lastMove),stall=running&&A.mode==='ENROUTE'&&valid(A.dest)&&age>700;$('#diagStatus').textContent=stall?'ISR STALL DETECTED':'NOMINAL';$('#diagStatus').classList.toggle('stall',stall);$('#diag1').textContent=`FPS ${C.fps} | RAF ${C.raf} | GAP ${Math.round(C.maxGap)}ms | ERR ${C.errors}`;$('#diag2').textContent=`ISR POINTER ${C.isr} | MAP POINTER ${C.map} | TRACK POINTER ${C.track} | ORDERS ${C.orders}`;$('#diag3').textContent=`MODE ${A.mode} | POS ${A.x.toFixed(1)},${A.y.toFixed(1)} | DEST ${valid(A.dest)?A.dest.x.toFixed(1)+','+A.dest.y.toFixed(1):'--'} | MOVE AGE ${age}ms`;let vv=window.visualViewport,vw=Math.round(window.innerWidth),vh=Math.round(window.innerHeight),vww=vv?Math.round(vv.width):vw,vvh=vv?Math.round(vv.height):vh,vs=vv?vv.scale:1;$('#viewportDiag').textContent=`VIEWPORT // ${vw}x${vh} -> ${vww}x${vvh} | SCALE ${vs.toFixed(2)}`;if(stall&&!stallLogged){stallLogged=true;rec('STALL',`mode=${A.mode} pos=${A.x.toFixed(2)},${A.y.toFixed(2)} dest=${A.dest.x.toFixed(2)},${A.dest.y.toFixed(2)} age=${age} gap=${C.maxGap.toFixed(1)}`)}}function diagText(){return [`CONTACT IMMINENT v0.6.6.15 OA KESTREL OPERATIONAL REFINEMENT DIAGNOSTICS`,new Date().toISOString(),`running=${running} phase=${phase} score=${Math.round(score)} integrity=${integrity} compromise=${compromise().toFixed(2)}`,`fps=${C.fps} raf=${C.raf} maxGapMs=${C.maxGap.toFixed(1)} errors=${C.errors}`,`isrClicks=${C.isr} mapClicks=${C.map} trackClicks=${C.track} orders=${C.orders}`,`mode=${A.mode} pos=${A.x.toFixed(2)},${A.y.toFixed(2)} dest=${valid(A.dest)?A.dest.x.toFixed(2)+','+A.dest.y.toFixed(2):'--'} moveAgeMs=${Math.round(performance.now()-A.lastMove)}`,'','ROLLING DEBUG LOG',...dbg].join('\n')}async function copyDiag(){let t=diagText();try{await navigator.clipboard.writeText(t);log('DIAGNOSTICS // COPIED')}catch(e){rec('COPY_FAIL',String(e));let ta=document.createElement('textarea');ta.value=t;document.body.append(ta);ta.select();document.execCommand('copy');ta.remove();log('DIAGNOSTICS // COPIED')}}function saveDiag(){let a=document.createElement('a');a.href=URL.createObjectURL(new Blob([diagText()],{type:'text/plain'}));a.download='contact-imminent-v0.4.3.1-debug.txt';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),(cpFusionActive()?600:1000));log('DIAGNOSTICS // SAVED')}function finish(){if(!running)return;if(campaignMission==='01-04'){cpFinish0104('TIMEOUT');return;}if(campaignMission==='01-05'){cpFinish0105('TIMEOUT');return;}running=false;stopCollect();A.dest=null;A.mode='IDLE';let c=compromise();$('#endTitle').textContent=c<60?'CONDITIONS HAVE BEEN SET':'CONDITIONS NOT SET';$('#fs').textContent=Math.max(0,Math.round(score));$('#fr').textContent=resolved;$('#fi').textContent=ints;$('#fc').textContent=Math.round(c)+'%';$('#end').classList.add('show');ui(true)}function loop(now){if(window.CP_PAUSED||window.CP_MENU){last=now;requestAnimationFrame(loop);return;}C.raf++;let gap=now-C.lastRaf;C.lastRaf=now;if(gap>C.maxGap)C.maxGap=gap;C.fpsFrames++;if(now-C.fpsAt>=1000){C.fps=Math.round(C.fpsFrames*1000/(now-C.fpsAt));C.fpsFrames=0;C.fpsAt=now}let dt=Math.min(.05,(now-last)/1000);last=now;if(running){let elapsed=(now-start)/1000,left=Math.max(0,180-elapsed),np=elapsed<60?1:elapsed<120?2:3;if(campaignMission==='ARCADE'){arcadeThreatLevel=1+Math.floor(elapsed/75);if(arcadeThreatLevel!==phase){phase=arcadeThreatLevel;let nm='THREAT LEVEL '+arcadeThreatLevel;$('#phase').textContent='ARCADE // '+nm;banner(nm,1300);sound('level');log(nm)}let s=Math.floor(elapsed);$('#clock').textContent=String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0')}else{if(np!==phase){phase=np;let nm=phase===2?'PHASE II // CONTEST':'PHASE III // DOMINATE';$('#phase').textContent=nm;banner(nm,1300);log(nm)}let s=Math.ceil(left);$('#clock').textContent=String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0')}if(campaignMission!=='ARCADE'&&campaignMission!=='TUTORIAL'&&left<=0)finish();else{let p=parms();if(campaignMission!=='TUTORIAL'&&(now-lastSpawn)/1000>=p.gap&&T.filter(t=>!t.done).length<p.cap){spawn();lastSpawn=now}T.forEach(t=>{if(t.done||t.stationary)return;t.x+=t.vx*dt;t.y+=t.vy*dt;if(t.x<35||t.x>865)t.vx*=-1;if(t.y<35||t.y>615)t.vy*=-1});naiTick(now);enemy(dt);cpContestedTick(dt);cpIntelDropTick();reconstitutionTick(now);cpTrackStallGuard();if(A.mode==='ENROUTE'&&valid(A.dest)){let dx=A.dest.x-A.x,dy=A.dest.y-A.y,d=Math.hypot(dx,dy);if(d>2){A.heading=H(dx,dy);let q=Math.min(A.speed*dt,d),ox=A.x,oy=A.y;A.x+=dx/d*q;A.y+=dy/d*q;if(A.x!==ox||A.y!==oy){A.lastMove=now;stallLogged=false}}else{A.x=A.dest.x;A.y=A.dest.y;A.dest=null;A.mode='ON_STATION';A.lastMove=now;stallLogged=false}}}}geometry();ui();diagnostic(now);requestAnimationFrame(loop)}function supplyTargetFromPoint(p){if(!supplyRepairMode||supplyPackages<1||!valid(p))return false;const candidates=B.filter(b=>b.degraded&&!b.reconstituting).map(b=>({b,d:Math.hypot(b.x-p.x,b.y-p.y)})).sort((a,b)=>a.d-b.d);if(!candidates.length)return false;const hit=candidates[0];if(hit.d>62){cpNotice('SUPPLY TARGETING','SELECT A HIGHLIGHTED DEGRADED SITE','intel');return false;}reconstituteSite(hit.b);return true}
$('#map').addEventListener('pointerdown',e=>{if(!running||!supplyRepairMode)return;const p=point(e);if(supplyTargetFromPoint(p)){e.preventDefault();e.stopImmediatePropagation();}},true);
$('#asset').addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();if(running)acquire()});$('#map').addEventListener('pointerdown',e=>{e.preventDefault();C.map++;rec('MAP_POINTER',`mode=${A.mode}`);if(!running)return;if(passiveDeployMode){passivePlace(point(e));return}if(ewoTargetMode){ewoFire(point(e));return}if(A.mode!=='ISR_SELECTED')return;order(point(e));ui(true)});function actionPointer(el,fn){el.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();fn();requestAnimationFrame(()=>el.blur())});el.addEventListener('click',e=>e.preventDefault())}actionPointer($('#collect'),collect);actionPointer($('#clear'),()=>decide('CLEAR'));actionPointer($('#intercept'),()=>decide('INTERCEPT'));actionPointer($('#passiveDeploy'),passiveToggleDeploy);actionPointer($('#ewoSweep'),ewoSweep);actionPointer($('#supplyUse'),supplyActivate);function deploy(){stopCollect();passiveReset();Object.assign(C,{raf:0,isr:0,map:0,track:0,orders:0,errors:0,lastRaf:performance.now(),maxGap:0,fps:0,fpsFrames:0,fpsAt:performance.now()});dbg=[];rec('DEPLOY','diagnostic session started');T.forEach(t=>{t.el?.remove();t.ring?.remove()});T=[];sel=null;next=1;score=0;integrity=100;decisionCorrect=0;decisionTotal=0;resolved=0;ints=0;phase=1;campaignStationarySpawned=0;stallLogged=false;Object.assign(A,{x:145,y:510,dest:null,mode:'IDLE',heading:0,lastMove:performance.now()});$('#phase').textContent=campaignMission==='ARCADE'?'ARCADE // THREAT LEVEL 1':campaignMission==='TUTORIAL'?'TRAINING // COMMAND ORIENTATION':'PHASE I // ESTABLISH';$('#log').textContent='';$('#enemyRings').textContent='';let df=$('#decisionFeedback');if(df)df.textContent='';$('#end').classList.remove('show');initBlue();running=false;$('#clock').textContent=campaignMission==='ARCADE'?'00:00':campaignMission==='TUTORIAL'?'TRAIN':'03:00';let n=campaignMission==='TUTORIAL'?1:5;banner(campaignMission==='TUTORIAL'?'TRAINING ENVIRONMENT':String(n),700);let timer=setInterval(()=>{n--;if(n>0)banner(String(n),700);else{clearInterval(timer);banner(campaignMission==='TUTORIAL'?'TRAINING // SYSTEMS ONLINE':'PREPARE THE OPERATIONAL ENVIRONMENT',1600);setTimeout(()=>{running=true;A.mode='ON_STATION';start=performance.now();lastSpawn=start;A.lastMove=start;if(campaignMission==='01-02'){spawn(false);spawn(true);spawn(true)}
else if(campaignMission==='01-03'||campaignMission==='01-04'||campaignMission==='01-05'||campaignMission==='ARCADE'){spawn();spawn();spawn()}
else{spawn(false);spawn(false);spawn(true)}
log('MISSION START // CONTACT IMMINENT 0.6.5.8 OA KESTREL // MOBILE UX + GUIDED TRAINING')},900)}},850);ui(true)}$('#copyDiag').addEventListener('click',copyDiag);$('#saveDiag').addEventListener('click',saveDiag);$('#reset').addEventListener('click',()=>campaignMission==='ARCADE'?arcadeBegin():deploy());$('#again').addEventListener('click',deploy);document.addEventListener('dblclick',e=>e.preventDefault(),{passive:false});document.addEventListener('wheel',e=>{if(e.ctrlKey)e.preventDefault()},{passive:false});window.visualViewport?.addEventListener('resize',()=>rec('VIEWPORT',`${Math.round(innerWidth)}x${Math.round(innerHeight)} scale=${visualViewport.scale}`));initBlue();running=false;$('#clock').textContent=campaignMission==='ARCADE'?'00:00':campaignMission==='TUTORIAL'?'TRAIN':'03:00';$('#phase').textContent='MISSION STANDBY';ui(true);$('#startMission').addEventListener('click',()=>{$('#startScreen').style.display='none';deploy()});
window.CP_PAUSED=false;window.CP_MENU=true;window.CP_PAUSE_AT=0;
function cpHideCampaignOverlays(){['campaignMenu','briefing0101','briefing0102','briefing0103','briefing0104','briefing0105','campaignResult'].forEach(id=>$('#'+id).classList.add('hidden'))}
function cpCampaignMenu(){clearTutorialState();musicSetMode('menu');cpRefreshCampaign();window.CP_MENU=true;window.CP_PAUSED=false;running=false;stopCollect();$('#mainMenu').classList.add('hidden');$('#pauseMenu').classList.add('hidden');$('#briefing0101').classList.add('hidden');$('#briefing0102').classList.add('hidden');$('#briefing0103').classList.add('hidden');$('#briefing0104').classList.add('hidden');$('#briefing0105').classList.add('hidden');$('#campaignResult').classList.add('hidden');$('#campaignMenu').classList.remove('hidden')}
function cpBrief0101(){$('#campaignMenu').classList.add('hidden');$('#briefing0101').classList.remove('hidden')}
function cpUnlocked0102(){
  const key='ci-c01-0102-unlocked';
  if(sessionStorage.getItem(key)==='1'){localStorage.setItem(key,'1');return true}
  return localStorage.getItem(key)==='1';
}
function cpRefreshCampaign(){
  const b=$('#mission0102'),st=$('#mission0102Status');if(!b||!st)return;
  const unlocked=cpUnlocked0102();b.disabled=!unlocked;b.classList.toggle('available',unlocked);st.textContent=unlocked?'AVAILABLE':'LOCKED';
  const b3=$('#mission0103'),st3=$('#mission0103Status');if(b3&&st3){const u3=cpUnlocked0103();b3.disabled=!u3;b3.classList.toggle('available',u3);st3.textContent=u3?'AVAILABLE':'LOCKED';}const b4=$('#mission0104'),st4=$('#mission0104Status');if(b4&&st4){const u4=cpUnlocked0104();b4.disabled=!u4;b4.classList.toggle('available',u4);st4.textContent=u4?'AVAILABLE':'LOCKED';}const b5=$('#mission0105'),st5=$('#mission0105Status');if(b5&&st5){const u5=cpUnlocked0105();b5.disabled=!u5;b5.classList.toggle('available',u5);st5.textContent=localStorage.getItem('ci-c01-complete')==='1'?'COMPLETE':(u5?'AVAILABLE':'LOCKED');}
}
function cpBrief0102(){if(!cpUnlocked0102())return;$('#campaignMenu').classList.add('hidden');$('#briefing0102').classList.remove('hidden')}
function cpUnlocked0103(){return localStorage.getItem('ci-c01-0103-unlocked')==='1'}
function cpBrief0103(){if(!cpUnlocked0103())return;$('#campaignMenu').classList.add('hidden');$('#briefing0103').classList.remove('hidden')}
function cpUnlocked0104(){return localStorage.getItem('ci-c01-0104-unlocked')==='1'}
function cpBrief0104(){if(!cpUnlocked0104())return;$('#campaignMenu').classList.add('hidden');$('#briefing0104').classList.remove('hidden')}
function cpUnlocked0105(){return localStorage.getItem('ci-c01-0105-unlocked')==='1'}
function cpBrief0105(){if(!cpUnlocked0105())return;$('#campaignMenu').classList.add('hidden');$('#briefing0105').classList.remove('hidden')}
const tutorialIntelSeen=new Set();function clearTutorialState(){tutorialStep=0;tutorialIntelSeen.clear();const g=$('#tutorialGuide');if(g)g.classList.add('hidden');const n=$('#tutorialNext');if(n){n.textContent='CONTINUE';n.classList.add('hidden')} }
function missionTransition(title,sub,fn){clearTutorialState();const m=$('#missionLoad');$('#missionLoadTitle').textContent=title||'OA KESTREL';$('#missionLoadSub').textContent=sub||'ESTABLISHING TACTICAL PICTURE';m.classList.remove('hidden');m.classList.add('show');window.CP_MENU=true;setTimeout(()=>{m.classList.remove('show');m.classList.add('hidden');window.CP_MENU=false;fn()},3000)}
function trainingPrime(){passiveCredits=9999;ewoUses=0;supplyPackages=1;const d=B.slice(0,2);d.forEach(b=>{b.exposure=100;b.degraded=true;b.reconstituting=false;cpRenderBlueSite(b);b.el.classList.add('training-degraded')});campaignCompromise=cpCompromiseFloor();ui(true)}
function cpBegin0105(){missionTransition('01-05 // CONDITIONS SET','OA KESTREL // LOADING OPERATION',cpBegin0105Now)}
function cpBegin0105Now(){musicSetMode('mission');campaignMission='01-05';campaignIds=0;campaignCorrect=0;campaignThreatResolved=0;campaignNonThreatResolved=0;campaignStationaryAssessed=0;campaignStationarySpawned=0;campaignProximityAssessed=0;campaignCollectionInterrupted=0;campaignCompromise=0;campaignFinished=false;cpIntelDropReset();cpHideCampaignOverlays();let w=$('#hostileCollectionWarning');if(w)w.classList.add('hidden');window.CP_MENU=false;window.CP_PAUSED=false;$('#startScreen').style.display='none';deploy();last=performance.now()}
function cpBegin0104(){missionTransition('01-04 // CONTESTED','OA KESTREL // LOADING OPERATION',cpBegin0104Now)}
function cpBegin0104Now(){musicSetMode('mission');campaignMission='01-04';campaignIds=0;campaignCorrect=0;campaignThreatResolved=0;campaignNonThreatResolved=0;campaignStationaryAssessed=0;campaignStationarySpawned=0;campaignProximityAssessed=0;campaignCollectionInterrupted=0;campaignCompromise=0;campaignFinished=false;cpIntelDropReset();cpHideCampaignOverlays();let w=$('#hostileCollectionWarning');if(w)w.classList.add('hidden');window.CP_MENU=false;window.CP_PAUSED=false;$('#startScreen').style.display='none';deploy();last=performance.now()}

function cpBegin0103(){missionTransition('01-03 // INDICATORS','OA KESTREL // LOADING OPERATION',cpBegin0103Now)}
function cpBegin0103Now(){musicSetMode('mission');campaignMission='01-03';campaignIds=0;campaignCorrect=0;campaignThreatResolved=0;campaignNonThreatResolved=0;campaignStationaryAssessed=0;campaignStationarySpawned=0;campaignProximityAssessed=0;campaignFinished=false;cpHideCampaignOverlays();window.CP_MENU=false;window.CP_PAUSED=false;$('#startScreen').style.display='none';deploy();last=performance.now()}

function cpBegin0102(){missionTransition('01-02 // PATTERN','OA KESTREL // LOADING OPERATION',cpBegin0102Now)}
function cpBegin0102Now(){musicSetMode('mission');campaignMission='01-02';campaignIds=0;campaignCorrect=0;campaignThreatResolved=0;campaignNonThreatResolved=0;campaignStationaryAssessed=0;campaignStationarySpawned=0;campaignFinished=false;cpHideCampaignOverlays();window.CP_MENU=false;window.CP_PAUSED=false;$('#startScreen').style.display='none';deploy();last=performance.now()}

function cpBegin0101(){missionTransition('01-01 // ESTABLISH','OA KESTREL // LOADING OPERATION',cpBegin0101Now)}
function cpBegin0101Now(){musicSetMode('mission');campaignMission='01-01';campaignIds=0;campaignCorrect=0;campaignThreatResolved=0;campaignNonThreatResolved=0;campaignFinished=false;cpHideCampaignOverlays();window.CP_MENU=false;window.CP_PAUSED=false;$('#startScreen').style.display='none';deploy();last=performance.now()}
function outcomeFeedback(pass){const overlay=$('#campaignResult');if(pass){playAsset(missionSuccessAudio,.9,'sfx');banner('MISSION COMPLETE // CONDITIONS SET',2200);overlay.classList.remove('loss-flash');overlay.classList.add('win-flash')}else{playAsset(missionFailAudio,.95,'sfx');banner('MISSION FAILURE // CONDITIONS NOT SET',2600);overlay.classList.remove('win-flash');overlay.classList.add('loss-flash')}}
function cpCheck0101(){if(campaignMission!=='01-01'||campaignFinished)return;if(campaignCorrect>=10){campaignFinished=true;running=false;stopCollect();window.CP_MENU=true;const pass=integrity>=80;if(pass){localStorage.setItem('ci-c01-0102-unlocked','1');sessionStorage.setItem('ci-c01-0102-unlocked','1');cpRefreshCampaign()}$('#resultTitle').textContent=pass?'CONDITIONS HAVE BEEN SET':'CONDITIONS NOT SET';$('#resultBody').innerHTML='OA KESTREL<br>INITIAL OPERATIONAL PICTURE '+(pass?'ESTABLISHED':'INCOMPLETE')+'<br><br>CONTACTS IDENTIFIED&nbsp;&nbsp;&nbsp;&nbsp;'+campaignIds+'<br>CORRECT DISPOSITIONS&nbsp;&nbsp;'+campaignCorrect+'<br>HOSTILE / IRREGULAR&nbsp;&nbsp;&nbsp;'+campaignThreatResolved+'<br>FRIENDLY / NEUTRAL&nbsp;&nbsp;&nbsp;'+campaignNonThreatResolved+'<br>INTELLIGENCE INTEGRITY&nbsp;'+Math.round(integrity)+'%<br>SCORE&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+Math.max(0,Math.round(score));$('#resultContinue').classList.toggle('hidden',!pass);$('#resultRetry').classList.toggle('hidden',pass);$('#campaignResult').classList.remove('hidden');outcomeFeedback(pass)}}
function cpCheck0102(){
if(campaignMission!=='01-02'||campaignFinished)return;
if(campaignCorrect>=12&&campaignStationaryAssessed>=4){
  campaignFinished=true;running=false;stopCollect();window.CP_MENU=true;
  const pass=integrity>=80;if(pass){localStorage.setItem('ci-c01-0103-unlocked','1');cpRefreshCampaign()}
  $('#resultTitle').textContent=pass?'CONDITIONS HAVE BEEN SET':'CONDITIONS NOT SET';
  $('#resultBody').innerHTML='OA KESTREL<br>PATTERN OF ACTIVITY '+(pass?'DEVELOPED':'INCOMPLETE')+
  '<br><br>CONTACTS RESOLVED&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+campaignCorrect+
  '<br>MOBILE CONTACTS&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+Math.max(0,campaignCorrect-campaignStationaryAssessed)+
  '<br>STATIONARY ASSESSED&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+campaignStationaryAssessed+
  '<br>HOSTILE / IRREGULAR&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+campaignThreatResolved+
  '<br>FRIENDLY / NEUTRAL&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+campaignNonThreatResolved+
  '<br>INTELLIGENCE INTEGRITY&nbsp;&nbsp;'+Math.round(integrity)+'%'+
  '<br>SCORE&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+Math.max(0,Math.round(score));
  $('#resultContinue').classList.toggle('hidden',!pass);$('#resultRetry').classList.toggle('hidden',pass);$('#campaignResult').classList.remove('hidden');outcomeFeedback(pass);
}}
function cpCheck0103(){
if(campaignMission!=='01-03'||campaignFinished)return;
if(campaignCorrect>=14&&campaignProximityAssessed>=5){
  campaignFinished=true;running=false;stopCollect();window.CP_MENU=true;
  const pass=integrity>=80;if(pass){localStorage.setItem('ci-c01-0104-unlocked','1');cpRefreshCampaign()}
  $('#resultTitle').textContent=pass?'CONDITIONS HAVE BEEN SET':'CONDITIONS NOT SET';
  $('#resultBody').innerHTML='OA KESTREL<br>INDICATORS ASSESSED'+
  '<br><br>CONTACTS RESOLVED&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+campaignCorrect+
  '<br>SITE-PROXIMITY EVENTS&nbsp;&nbsp;&nbsp;'+campaignProximityAssessed+
  '<br>HOSTILE / IRREGULAR&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+campaignThreatResolved+
  '<br>FRIENDLY / NEUTRAL&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+campaignNonThreatResolved+
  '<br>INTELLIGENCE INTEGRITY&nbsp;&nbsp;'+Math.round(integrity)+'%'+
  '<br>SCORE&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+Math.max(0,Math.round(score));
  $('#resultContinue').classList.toggle('hidden',!pass);$('#resultRetry').classList.toggle('hidden',pass);$('#campaignResult').classList.remove('hidden');outcomeFeedback(pass);
}}
function cpFinish0104(reason){
 if(campaignFinished)return;
 campaignFinished=true;running=false;stopCollect();window.CP_MENU=true;
 const w=$('#hostileCollectionWarning');if(w)w.classList.add('hidden');
 const pass=(reason==='SUCCESS'&&campaignCorrect>=14&&campaignCollectionInterrupted>=4&&integrity>=80&&campaignCompromise<60);
 let title,lead;
 if(campaignCompromise>=60||reason==='COMPROMISE'){
   title='OE COMPROMISED';lead='THRESHOLD EXCEEDED';
 }else if(pass){
   localStorage.setItem('ci-c01-0105-unlocked','1');cpRefreshCampaign();
   title='CONDITIONS HAVE BEEN SET';lead='CONTESTED ENVIRONMENT ASSESSED';
 }else{
   title='CONDITIONS NOT SET';lead='MISSION OBJECTIVES INCOMPLETE';
 }
 $('#resultTitle').textContent=title;
 $('#resultBody').innerHTML='OA KESTREL<br>'+lead+
 '<br><br>CONTACTS RESOLVED&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+campaignCorrect+
 '<br>COLLECTION INTERRUPTED&nbsp;&nbsp;'+campaignCollectionInterrupted+
 '<br>AO COMPROMISE&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+Math.round(campaignCompromise)+'%'+
 '<br>HOSTILE / IRREGULAR&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+campaignThreatResolved+
 '<br>FRIENDLY / NEUTRAL&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+campaignNonThreatResolved+
 '<br>INTELLIGENCE INTEGRITY&nbsp;&nbsp;'+Math.round(integrity)+'%'+
 '<br>SCORE&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+Math.max(0,Math.round(score));
 $('#resultContinue').classList.toggle('hidden',!pass);
 $('#resultRetry').classList.toggle('hidden',pass);
 $('#campaignResult').classList.remove('hidden');outcomeFeedback(pass);
}
function cpCheck0104(){
if(!cpThreatMission()||campaignFinished)return;
if(campaignCorrect>=14&&campaignCollectionInterrupted>=4){
 cpFinish0104('SUCCESS');
}}
function cpFinish0105(reason){
 if(campaignFinished)return;
 campaignFinished=true;running=false;stopCollect();window.CP_MENU=true;
 const w=$('#hostileCollectionWarning');if(w)w.classList.add('hidden');
 const pass=(reason==='SUCCESS'&&campaignCorrect>=16&&campaignCollectionInterrupted>=5&&integrity>=80&&campaignCompromise<50);
 let title,lead;
 if(campaignCompromise>=60||reason==='COMPROMISE'){title='OE COMPROMISED';lead='THRESHOLD EXCEEDED';}
 else if(pass){title='CONDITIONS HAVE BEEN SET';lead='CAMPAIGN 01 // OA KESTREL COMPLETE';localStorage.setItem('ci-c01-complete','1');cpRefreshCampaign();}
 else{title='CONDITIONS NOT SET';lead='FINAL OPERATION OBJECTIVES INCOMPLETE';}
 $('#resultTitle').textContent=title;
 $('#resultBody').innerHTML='OA KESTREL<br>'+lead+
 '<br><br>CONTACTS RESOLVED&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+campaignCorrect+
 '<br>COLLECTION INTERRUPTED&nbsp;&nbsp;'+campaignCollectionInterrupted+
 '<br>OE COMPROMISE&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+Math.round(campaignCompromise)+'%'+
 '<br>SITES DEGRADED&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+cpDegradedCount()+' / 5'+
 '<br>HOSTILE / IRREGULAR&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+campaignThreatResolved+
 '<br>FRIENDLY / NEUTRAL&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+campaignNonThreatResolved+
 '<br>INTELLIGENCE INTEGRITY&nbsp;&nbsp;'+Math.round(integrity)+'%'+
 '<br>SCORE&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+Math.max(0,Math.round(score));
 $('#resultContinue').classList.toggle('hidden',!pass);$('#resultRetry').classList.toggle('hidden',pass);$('#campaignResult').classList.remove('hidden');outcomeFeedback(pass);
}
function cpCheck0105(){if(campaignMission!=='01-05'||campaignFinished)return;if(campaignCorrect>=16&&campaignCollectionInterrupted>=5&&integrity>=80&&campaignCompromise<50)cpFinish0105('SUCCESS')}
function tutorialGuide(step,title,text,button=false){tutorialStep=step;const g=$('#tutorialGuide');g.classList.remove('hidden');$('#tutorialTitle').textContent=title;$('#tutorialText').textContent=text;const n=$('#tutorialNext');n.textContent=step>=12?'RETURN TO MENU':'CONTINUE';n.classList.toggle('hidden',!button)}
function tutorialMenu(){window.CP_MENU=true;clearTutorialState();$('#mainMenu').classList.add('hidden');$('#tutorialBriefing').classList.remove('hidden')}
function tutorialBegin(){missionTransition('TRAINING // OA KESTREL','FULL SYSTEMS WALKTHROUGH',tutorialBeginNow)}
function tutorialBeginNow(){musicSetMode('mission');campaignMission='TUTORIAL';campaignFinished=false;$('#phase').textContent='TRAINING // SYSTEMS';cpHideCampaignOverlays();$('#tutorialBriefing').classList.add('hidden');window.CP_MENU=false;window.CP_PAUSED=false;$('#startScreen').style.display='none';deploy();setTimeout(()=>{if(campaignMission!=='TUTORIAL')return;trainingPrime();spawn(false);const t=T[T.length-1];if(t){t.truth='FRIENDLY';t.x=430;t.y=315;t.vx=.25;t.vy=.1;}tutorialGuide(1,'1 // ACQUIRE ISR-01','Select ISR-01 on the map. Guidance advances only after you complete each action.')},2100)}
function tutorialAdvance(event){if(campaignMission!=='TUTORIAL')return;if(tutorialStep===1&&event==='acquire')tutorialGuide(2,'2 // MOVE ISR-01','Tap near the UNKNOWN to order ISR-01. Put the contact inside the collection footprint.');else if(tutorialStep===2&&event==='order')tutorialGuide(3,'3 // COLLECT','Select the UNKNOWN and press COLLECT. Complete collection to identify it.');else if(tutorialStep===3&&event==='classified')tutorialGuide(4,'4 // DISPOSITION','This contact is FRIENDLY. Press CLEAR. Threats are INTERCEPTED.');else if(tutorialStep===4&&event==='decision'){intelDropActive=true;intelDropOffered=true;intelDropExpires=performance.now()+3600000;$('#intelDrop').classList.remove('hidden');tutorialGuide(5,'5 // INTEL REPORTING','Use all three report options: MITIGATE, EXPLOIT and SUPPLY. The panel will remain available until each has been demonstrated.');}else if(tutorialStep===5&&event==='intel'){if(tutorialIntelSeen.size<3){intelDropActive=true;intelDropExpires=performance.now()+3600000;$('#intelDrop').classList.remove('hidden');tutorialGuide(5,'5 // INTEL REPORTING',`Reporting demonstrated ${tutorialIntelSeen.size}/3. Use the remaining MITIGATE, EXPLOIT or SUPPLY option.`);}else{intelDropActive=false;$('#intelDrop').classList.add('hidden');passiveCredits=9999;tutorialGuide(6,'6 // PASSIVE ISR','Deploy one Passive ISR node from the right rail, then place it on the map.');ui(true)}}else if(tutorialStep===6&&event==='passive'){tutorialGuide(7,'7 // BUILD AN NAI','Deploy two more nodes near the first. Three nodes within four hexes must form an NAI.');}else if(tutorialStep===7&&event==='nai'){for(const pos of [[760,500],[720,155],[190,520]]){spawn(false);const q=T[T.length-1];if(q){q.type='UNKNOWN';q.truth='HOSTILE';q.x=pos[0];q.y=pos[1];q.vx=0;q.vy=0;}}tutorialGuide(8,'8 // EWO SWEEP','Buy EWO SWEEP, then select an origin on the map and fire the radial collection wave. Three training UNKNOWNs have been added for the sweep.');ui(true);}else if(tutorialStep===8&&event==='ewo'){supplyPackages=1;trainingPrime();tutorialGuide(9,'9 // BLUFOR SUPPLY','Two BLUFOR sites are degraded in red. Activate SUPPLY, then select a red base directly on the map.');ui(true)}else if(tutorialStep===9&&event==='supply-target'){tutorialGuide(10,'10 // RECONSTITUTION','Repair is underway. Watch the site exposure fall and wait for the site to return blue/OPERATIONAL.');}else if(tutorialStep===10&&event==='repair-complete'){tutorialGuide(11,'11 // SUPPORT ECONOMY','Normal play earns ISR Credits from correct decisions and interrupted collection. Passive ISR is persistent; EWO is a repeatable tactical purchase.',true)} }
function tutorialSupportNext(){if(campaignMission!=='TUTORIAL')return;if(tutorialStep===11){tutorialGuide(12,'TRAINING COMPLETE','Core command, collection, reporting, Passive ISR, NAI, EWO and BLUFOR reconstitution complete.',true)}else if(tutorialStep>=12){clearTutorialState();cpShowMenu()}}
function arcadeHide(){const a=$('#arcadeBriefing'),r=$('#arcadeResult');if(a)a.classList.add('hidden');if(r)r.classList.add('hidden')}
function arcadeBegin(){missionTransition('ARCADE // OA KESTREL','ENDLESS OPERATION // LOADING',arcadeBeginNow)}
function arcadeBeginNow(){musicSetMode('mission');campaignMission='ARCADE';campaignIds=0;campaignCorrect=0;campaignThreatResolved=0;campaignNonThreatResolved=0;campaignCollectionInterrupted=0;campaignCompromise=0;campaignFinished=false;arcadeStreak=0;arcadeBestStreak=0;arcadeCorrect=0;arcadeWrong=0;arcadeThreatLevel=1;cpIntelDropReset();arcadeHide();cpHideCampaignOverlays();window.CP_MENU=false;window.CP_PAUSED=false;$('#startScreen').style.display='none';deploy();arcadeStart=performance.now();last=performance.now()}
function arcadeFinish(reason){if(campaignMission!=='ARCADE'||campaignFinished)return;campaignFinished=true;playAsset(missionFailAudio,.95,'sfx');banner('ARCADE FAILURE // '+reason,2600);running=false;stopCollect();window.CP_MENU=true;const w=$('#hostileCollectionWarning');if(w)w.classList.add('hidden');const elapsed=Math.max(0,Math.floor((performance.now()-(arcadeStart||start))/1000)),acc=(arcadeCorrect+arcadeWrong)?Math.round(arcadeCorrect*100/(arcadeCorrect+arcadeWrong)):100;$('#arcadeResultTitle').textContent=reason;$('#arcadeResultBody').innerHTML='OA KESTREL // ARCADE AAR<br><br>SCORE&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+Math.max(0,Math.round(score))+'<br>SURVIVAL TIME&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+String(Math.floor(elapsed/60)).padStart(2,'0')+':'+String(elapsed%60).padStart(2,'0')+'<br>THREAT LEVEL&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+arcadeThreatLevel+'<br>CONTACTS RESOLVED&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+resolved+'<br>THREATS INTERCEPTED&nbsp;&nbsp;&nbsp;&nbsp;'+ints+'<br>COLLECTION INTERRUPTED&nbsp;&nbsp;'+campaignCollectionInterrupted+'<br>DECISION ACCURACY&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+acc+'%<br>LONGEST STREAK&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+arcadeBestStreak+'<br>SITES DEGRADED&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+cpDegradedCount()+' / 5<br>FINAL OE COMPROMISE&nbsp;&nbsp;&nbsp;&nbsp;'+Math.round(campaignCompromise)+'%';$('#arcadeResult').classList.remove('hidden');$('#arcadeResult').classList.add('loss-flash')}
function arcadeMenu(){clearTutorialState();musicSetMode('menu');cpHideCampaignOverlays();$('#mainMenu').classList.add('hidden');$('#arcadeResult').classList.add('hidden');$('#arcadeBriefing').classList.remove('hidden');window.CP_MENU=true}
function cpShowMenu(){
  clearTutorialState();musicSetMode('menu');
  window.CP_PAUSED=false;window.CP_MENU=true;running=false;stopCollect();A.dest=null;
  $('#pauseMenu').classList.add('hidden');$('#mainMenu').classList.remove('hidden');
}
function cpCampaign(){
  window.CP_MENU=false;window.CP_PAUSED=false;
  $('#mainMenu').classList.add('hidden');$('#pauseMenu').classList.add('hidden');
  $('#startScreen').style.display='none';deploy();last=performance.now();
}
function cpSetPause(v){
  if(window.CP_MENU||!running)return;
  if(v){
    window.CP_PAUSED=true;window.CP_PAUSE_AT=performance.now();applyAudioSettings();
    $('#pauseMenu').classList.remove('hidden');
  }else{
    const now=performance.now(),d=now-window.CP_PAUSE_AT;
    start+=d;lastSpawn+=d;A.lastMove+=d;T.forEach(t=>{if(t.bornAt)t.bornAt+=d;if(t.proxSince)t.proxSince+=d;if(t.collectStarted)t.collectStarted+=d;if(t.stallAt)t.stallAt+=d});if(intelDropAt)intelDropAt+=d;if(intelDropExpires)intelDropExpires+=d;if(intelFusionUntil)intelFusionUntil+=d;
    window.CP_PAUSED=false;last=now;applyAudioSettings();
    $('#pauseMenu').classList.add('hidden');
  }
}
let settingsReturn='main';function openSettings(from){settingsReturn=from||'main';$('#settingsMenu').classList.remove('hidden');if(settingsReturn==='pause')$('#pauseMenu').classList.add('hidden');else $('#mainMenu').classList.add('hidden');applyAudioSettings()}function closeSettings(){$('#settingsMenu').classList.add('hidden');if(settingsReturn==='pause')$('#pauseMenu').classList.remove('hidden');else $('#mainMenu').classList.remove('hidden')}[['musicSlider','music'],['uiSlider','ui'],['sfxSlider','sfx']].forEach(([id,k])=>{const el=$('#'+id);if(el)el.addEventListener('input',e=>setAudioLevel(k,e.target.value))});$('#settingsBtn').addEventListener('click',()=>openSettings('main'));$('#pauseSettingsBtn').addEventListener('click',()=>openSettings('pause'));$('#settingsBack').addEventListener('click',closeSettings);applyAudioSettings();installMenuButtonAudio();
$('#tutorialBtn').addEventListener('click',tutorialMenu);$('#tutorialBegin').addEventListener('click',tutorialBegin);$('#tutorialBack').addEventListener('click',()=>{$('#tutorialBriefing').classList.add('hidden');$('#mainMenu').classList.remove('hidden')});$('#tutorialNext').addEventListener('click',tutorialSupportNext);$('#campaignBtn').addEventListener('click',cpCampaignMenu);$('#arcadeBtn').addEventListener('click',arcadeMenu);$('#arcadeBegin').addEventListener('click',arcadeBegin);$('#arcadeBack').addEventListener('click',()=>{$('#arcadeBriefing').classList.add('hidden');$('#mainMenu').classList.remove('hidden')});$('#arcadeRedeploy').addEventListener('click',arcadeBegin);$('#arcadeMenuBtn').addEventListener('click',()=>{arcadeHide();cpShowMenu()});$('#mission0101').addEventListener('click',cpBrief0101);$('#mission0102').addEventListener('click',cpBrief0102);$('#mission0103').addEventListener('click',cpBrief0103);$('#mission0104').addEventListener('click',cpBrief0104);$('#mission0105').addEventListener('click',cpBrief0105);$('#campaignBack').addEventListener('click',()=>{$('#campaignMenu').classList.add('hidden');$('#mainMenu').classList.remove('hidden')});$('#briefBack').addEventListener('click',()=>{$('#briefing0101').classList.add('hidden');$('#campaignMenu').classList.remove('hidden')});$('#briefBack0102').addEventListener('click',()=>{$('#briefing0102').classList.add('hidden');$('#campaignMenu').classList.remove('hidden')});$('#briefBack0103').addEventListener('click',()=>{$('#briefing0103').classList.add('hidden');$('#campaignMenu').classList.remove('hidden')});$('#briefBack0104').addEventListener('click',()=>{$('#briefing0104').classList.add('hidden');$('#campaignMenu').classList.remove('hidden')});$('#briefBack0105').addEventListener('click',()=>{$('#briefing0105').classList.add('hidden');$('#campaignMenu').classList.remove('hidden')});$('#begin0101').addEventListener('click',cpBegin0101);$('#begin0102').addEventListener('click',cpBegin0102);$('#begin0103').addEventListener('click',cpBegin0103);$('#begin0104').addEventListener('click',cpBegin0104);$('#begin0105').addEventListener('click',cpBegin0105);$('#intelMitigate').addEventListener('click',()=>cpIntelDropChoose('MITIGATE'));$('#intelExploit').addEventListener('click',()=>cpIntelDropChoose('EXPLOIT'));$('#intelSupply').addEventListener('click',()=>cpIntelDropChoose('SUPPLY'));$('#resultRetry').addEventListener('click',()=>campaignMission==='01-05'?cpBegin0105():(campaignMission==='01-04'?cpBegin0104():(campaignMission==='01-03'?cpBegin0103():(campaignMission==='01-02'?cpBegin0102():cpBegin0101()))));$('#resultContinue').addEventListener('click',cpCampaignMenu);
$('#pauseBtn').addEventListener('click',()=>cpSetPause(!window.CP_PAUSED));$('#muteBtn').addEventListener('click',()=>{masterMuted=!masterMuted;localStorage.setItem('ci-audio-muted',masterMuted?'1':'0');localStorage.setItem('ci-audio-mute-explicit','1');applyAudioSettings();if(!masterMuted){audioUnlock();musicSetMode((running&&!window.CP_MENU)?'mission':'menu')}});
$('#resumeBtn').addEventListener('click',()=>cpSetPause(false));
$('#restartBtn').addEventListener('click',()=>{window.CP_PAUSED=false;$('#pauseMenu').classList.add('hidden');if(campaignMission==='ARCADE')arcadeBegin();else{deploy();last=performance.now()}});
$('#abortBtn').addEventListener('click',()=>{campaignMission==='ARCADE'?cpShowMenu():(campaignMission?cpCampaignMenu():cpShowMenu())});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!window.CP_MENU&&running){e.preventDefault();cpSetPause(!window.CP_PAUSED)}});
applyAudioSettings();cpRefreshCampaign();cpShowMenu();(function bootSequence(){const splash=$('#bootSplash'),bar=$('#bootLoadBar'),pct=$('#bootPct'),dur=7000,t0=performance.now();try{backgroundMusic.volume=.34*audioLevels.music*(masterMuted?0:1);const p=backgroundMusic.play();if(p&&p.catch)p.catch(()=>{})}catch(e){}function tick(now){let f=Math.min(1,(now-t0)/dur),n=Math.round(f*100);if(bar){bar.style.width=n+'%';bar.style.backgroundColor=n<50?'#ff4b45':n<80?'#e0b23d':'#55d67a'}if(pct){pct.textContent=n+'%';pct.style.color=n<50?'#ff6b65':n<80?'#e0b23d':'#55d67a'}if(f<1)requestAnimationFrame(tick);else splash?.classList.add('done')}requestAnimationFrame(tick)})();
requestAnimationFrame(loop)})();
