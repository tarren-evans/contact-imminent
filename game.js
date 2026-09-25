(()=>{function ciPhysicalPhoneMapFit(){const m=document.getElementById('map'),w=document.getElementById('mapWrap');if(!m||!w)return;m.setAttribute('viewBox','0 0 900 650');const phone=window.innerWidth>680&&window.innerHeight<=500&&window.matchMedia('(pointer: coarse)').matches;if(!phone){m.style.removeProperty('width');m.style.removeProperty('height');m.style.removeProperty('left');m.style.removeProperty('right');m.style.removeProperty('top');m.style.removeProperty('bottom');return;}const cs=getComputedStyle(w),sl=parseFloat(cs.getPropertyValue('--phone-safe-left'))||8,sr=parseFloat(cs.getPropertyValue('--phone-safe-right'))||8,st=parseFloat(cs.getPropertyValue('--phone-safe-top'))||8,sb=parseFloat(cs.getPropertyValue('--phone-safe-bottom'))||8,aw=Math.max(1,w.clientWidth-sl-sr),ah=Math.max(1,w.clientHeight-st-sb),scale=Math.min(aw/900,ah/650),mw=Math.floor(900*scale),mh=Math.floor(650*scale);m.style.width=mw+'px';m.style.height=mh+'px';m.style.left=(sl+Math.max(0,(aw-mw)/2))+'px';m.style.right='auto';m.style.top=(st+Math.max(0,(ah-mh)/2))+'px';m.style.bottom='auto';}window.ciPhysicalPhoneMapFit=ciPhysicalPhoneMapFit;ciPhysicalPhoneMapFit();window.addEventListener('resize',ciPhysicalPhoneMapFit,{passive:true});window.visualViewport?.addEventListener('resize',ciPhysicalPhoneMapFit,{passive:true});const $=s=>document.querySelector(s),NS='http://www.w3.org/2000/svg',D=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y),H=(x,y)=>(Math.atan2(x,-y)*180/Math.PI+360)%360;
const CI_VERSION='0.11.6.39';
const ARCADE_INTEL_KEY='ci-arcade-intel-assist';
let arcadeIntelAssist=(()=>{let v=localStorage.getItem(ARCADE_INTEL_KEY);return ['FULL','TACTICAL','OFF'].includes(v)?v:'TACTICAL'})();
const ARCADE_OA_KEY='ci-arcade-oa';let arcadeOA=localStorage.getItem(ARCADE_OA_KEY)==='VANTAGE'?'VANTAGE':'KESTREL';let activeOA='KESTREL';let networkAssociations=new Map(),networkLastPair=new Map(),campaign02AssocEvents=0,campaign02PatternTracks=new Set(),campaign02ContinuityTracks=new Set();
function intelAssistMode(){return campaignMission==='ARCADE'?arcadeIntelAssist:'FULL'}
function arcadeIntelHelp(mode){return mode==='FULL'?'COMPLETE INTELLIGENCE PICTURE':mode==='TACTICAL'?'LKP + POSITION CONFIDENCE':'LIVE CONTACT PICTURE ONLY'}
function refreshArcadeIntelAssist(){
 const label=$('#arcadeIntelModeLabel'),help=$('#arcadeIntelHelp');if(label)label.textContent=arcadeIntelAssist;if(help)help.textContent=arcadeIntelHelp(arcadeIntelAssist);
 function resetGlobalGlobe(){globalGlobe.drag=false;globalGlobe.pointer=null;globalGlobe.moved=false;globalGlobe.yaw=0;globalGlobe.pitch=0;globalGlobe.zoom=1;globalGlobe.lastX=0;globalGlobe.lastY=0;}
$('#globalBtn')?.addEventListener('click',openGlobal);$('#globalGlobeReset')?.addEventListener('click',resetGlobalGlobe);$('#globalBack')?.addEventListener('click',closeGlobal);$('#globalCampaign')?.addEventListener('click',globalCampaignActivity);$('#globalArcade')?.addEventListener('click',globalArcadeActivity);$('#globalTraining')?.addEventListener('click',globalTrainingActivity);$('#globalPlanNAI')?.addEventListener('click',openGlobalPlanning);$('#planningClose')?.addEventListener('click',closeGlobalPlanning);$('#planningClear')?.addEventListener('click',clearGlobalPlanning);$('#planningUndo')?.addEventListener('click',undoGlobalPlanningPoint);$('#planningRevise')?.addEventListener('click',reviseGlobalPlanning);$('#planningCommit')?.addEventListener('click',commitGlobalPlanning);document.querySelectorAll('[data-global-oa]').forEach(b=>b.addEventListener('click',()=>selectGlobalOA(b.dataset.globalOa)));document.querySelectorAll('[data-global-rate]').forEach(b=>b.addEventListener('click',()=>setGlobalRate(Number(b.dataset.globalRate))));setGlobalRate(1.5);
document.querySelectorAll('[data-campaign-oa]').forEach(b=>b.addEventListener('click',()=>selectCampaignOA(b.dataset.campaignOa)));document.querySelectorAll('[data-intel-assist]').forEach(b=>b.classList.toggle('selected',b.dataset.intelAssist===arcadeIntelAssist));
}
function setArcadeIntelAssist(mode){if(!['FULL','TACTICAL','OFF'].includes(mode))return;arcadeIntelAssist=mode;localStorage.setItem(ARCADE_INTEL_KEY,mode);refreshArcadeIntelAssist();ui(true)}
function applyIntelAssistPresentation(){
 const mode=intelAssistMode(),hist=$('#intelHistory'),obs=$('#intelObservationHistory'),pat=$('#patternIndicators'),assess=$('#intelAssessmentBlock');
 if(hist)hist.classList.toggle('hidden',mode==='OFF');if(obs)obs.classList.toggle('hidden',mode!=='FULL');if(assess)assess.classList.toggle('hidden',mode!=='FULL');if(pat&&mode!=='FULL')pat.classList.add('hidden');
}
function renderTerrain(){
 const base=$('#terrainBase'),grid=$('#geometricGrid'),feat=$('#terrainFeatures');
 if(!base)return;
 while(base.firstChild)base.removeChild(base.firstChild);
 if(grid)while(grid.firstChild)grid.removeChild(grid.firstChild);
 if(feat)while(feat.firstChild)feat.removeChild(feat.firstChild);
 // v0.6.7.5: terrain imagery lives on #mapWrap as overscan. The SVG now
 // contains only the authoritative 900x650 playable tactical coordinate space.
 if(grid){
   const r=52, dx=1.5*r, dy=Math.sqrt(3)*r;
   const points=(cx,cy)=>Array.from({length:6},(_,i)=>{
     const a=Math.PI/180*(60*i);
     return (cx+r*Math.cos(a)).toFixed(2)+','+(cy+r*Math.sin(a)).toFixed(2);
   }).join(' ');
   // v0.6.7.5: keep the original 6.6.10 hex geometry and phase exactly,
   // but continue the same lattice through the horizontal aspect-fit gutters.
   // Negative/overflow tactical coordinates render into the SVG viewport gutters;
   // gameplay coordinates and the 900x650 viewBox remain unchanged.
   for(let col=-4;col<=16;col++){
     const cx=col*dx;
     const offset=((col%2)+2)%2*dy/2;
     for(let cy=-dy;cy<=650+dy;cy+=dy){
       const poly=document.createElementNS(NS,'polygon');
       poly.setAttribute('points',points(cx,cy+offset));
       poly.setAttribute('class','geoHex');
       grid.appendChild(poly);
     }
   }
 }
}renderTerrain();setTimeout(applyVisualSettings,0);const A={x:145,y:510,r:118,speed:82,mode:'IDLE',dest:null,heading:0,lastMove:performance.now()};
// v0.8.1 earned ISR capability packages. Base A.r/A.speed remain authoritative and untouched.
const DEV_ACCESS_UNLOCK_KEY='ci-dev-access-unlocked',DEV_MODE_KEY='ci-dev-mode',DEV_ACCESS_CODE='CI-DEV';
let devAccessUnlocked=localStorage.getItem(DEV_ACCESS_UNLOCK_KEY)==='1';
let devMode=devAccessUnlocked&&localStorage.getItem(DEV_MODE_KEY)==='1';
function devAccessActive(){return devAccessUnlocked&&devMode}
function refreshDevAccessUI(){
 const locked=$('#devAccessLocked'),controls=$('#devAccessControls'),state=$('#devModeState');
 if(locked)locked.classList.toggle('hidden',devAccessUnlocked);
 if(controls)controls.classList.toggle('hidden',!devAccessUnlocked);
 if(state)state.textContent=devMode?'DEV ACTIVE':'STANDARD';
 $('#devModeOn')?.classList.toggle('selected',devMode);
 $('#devModeOff')?.classList.toggle('selected',!devMode);
 document.body.classList.toggle('dev-mode-active',devAccessActive());
}
function refreshDevAccessState(){
 refreshDevAccessUI();
 cpRefreshCampaign();
 cpRefreshCampaign02();
 if(globalSelectedOA)selectGlobalOA(globalSelectedOA);
 setArcadeOA(arcadeOA);
}
function unlockDevAccess(){
 const input=$('#devAccessCode'),msg=$('#devAccessMessage');
 const code=(input?.value||'').trim().toUpperCase();
 if(code!==DEV_ACCESS_CODE){if(msg)msg.textContent='ACCESS DENIED';sound('click');return}
 devAccessUnlocked=true;localStorage.setItem(DEV_ACCESS_UNLOCK_KEY,'1');
 if(input)input.value='';if(msg)msg.textContent='';
 refreshDevAccessState();cpNotice('DEVELOPER ACCESS','TEST CONTROLS UNLOCKED','intel');sound('click');
}
function setDevMode(on){
 if(!devAccessUnlocked)return;
 devMode=!!on;localStorage.setItem(DEV_MODE_KEY,devMode?'1':'0');
 refreshDevAccessState();cpNotice('DEVELOPER MODE',devMode?'PROGRESSION LOCKS BYPASSED':'STANDARD ACCESS RESTORED','intel');sound('click');
}
const ISR_CAPABILITY_KEY='ci-isr-capability';let isrCapability=localStorage.getItem(ISR_CAPABILITY_KEY)||'STANDARD';
function isrCapabilityUnlocked(k){if(k==='STANDARD')return true;if(k==='WIDE')return localStorage.getItem('ci-c01-complete')==='1';if(k==='RAPID')return localStorage.getItem('ci-c02-complete')==='1';return false}
function normalizeISRCapability(){if(!isrCapabilityUnlocked(isrCapability))isrCapability='STANDARD'}
function cpEffectiveISRSpeed(){if(campaignMission==='RETRO')return A.speed;normalizeISRCapability();return A.speed*(isrCapability==='RAPID'?1.12:1)}
let B=[],T=[],sel=null,col=null,pct=0,score=0,integrity=100,decisionCorrect=0,decisionTotal=0,resolved=0,ints=0,next=1,campaignMission=null,campaignIds=0,campaignCorrect=0,campaignThreatResolved=0,campaignNonThreatResolved=0,campaignStationaryAssessed=0,campaignStationarySpawned=0,campaignProximityAssessed=0,campaignCollectionInterrupted=0,campaignCompromise=0,campaignFinished=false,arcadeStreak=0,arcadeBestStreak=0,arcadeCorrect=0,arcadeWrong=0,arcadeStart=0,arcadeThreatLevel=1,arcadeNextLevel=0,intelDropOffered=false,intelDropActive=false,intelDropAt=0,intelDropExpires=0,intelFusionUntil=0,passiveCredits=0,passiveNodes=[],passiveNAIs=[],passiveDeployMode=false,passiveNextId=1,ewoTargetMode=false,ewoUses=0,tutorialStep=0,supplyPackages=0,supplyRepairMode=false,running=false,start=0,lastSpawn=0,last=performance.now(),phase=1,ct=null,ci=null,lastUi=0,stallLogged=false;const C={raf:0,isr:0,map:0,track:0,orders:0,errors:0,lastRaf:performance.now(),maxGap:0,fps:0,fpsFrames:0,fpsAt:performance.now()};let dbg=[],lastDiag=0;let campaignHintSig='',campaignHintAt=0,campaignHintLevel=0;function rec(kind,msg){let ts=((performance.now()-(start||performance.now()))/1000).toFixed(3);dbg.push(`${ts}s | ${kind} | ${msg}`);if(dbg.length>500)dbg.shift()}window.addEventListener('error',e=>{C.errors++;rec('ERROR',`${e.message} @ ${e.filename}:${e.lineno}:${e.colno}`)});window.addEventListener('unhandledrejection',e=>{C.errors++;rec('REJECTION',String(e.reason))});function log(s){let d=document.createElement('div');d.textContent='> '+s;$('#log').prepend(d);while($('#log').children.length>7)$('#log').lastChild.remove()}function banner(s,d=1000){$('#bannerText').textContent=s;$('#banner').classList.add('show');setTimeout(()=>$('#banner').classList.remove('show'),d)}
// v0.6.2.1 AUDIO IDENTITY // retained tactile/menu SFX + recorded background
let audioCtx=null,audioReady=false,audioEnabled=true,lastContactTone=0,lastWarningTone=0;const savedMute=localStorage.getItem('ci-audio-muted'),muteExplicit=localStorage.getItem('ci-audio-mute-explicit')==='1';let masterMuted=muteExplicit&&savedMute==='1';if(!muteExplicit){localStorage.setItem('ci-audio-muted','0');masterMuted=false;}if(savedMute!==null&&savedMute!=='0'&&savedMute!=='1'){localStorage.removeItem('ci-audio-muted');masterMuted=false;}
// v0.6.2 TACTICAL SCORE // beat-first score + tactile UI transients
let musicMode='off',musicNoiseBuffer=null,lastHoverTone=0;
const audioLevels={music:Number(localStorage.getItem('ci-audio-music')??70)/100,ui:Number(localStorage.getItem('ci-audio-ui')??80)/100,sfx:Number(localStorage.getItem('ci-audio-sfx')??85)/100};let synthGain=1;
const backgroundMusic=new Audio('assets/audio/mission-background-loop.ogg');backgroundMusic.loop=true;backgroundMusic.preload='auto';let ciMusicCtx=null,ciMusicGain=null,ciMusicSource=null;
function ensureMusicGain(){try{if(!ciMusicCtx){const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;ciMusicCtx=new AC();ciMusicSource=ciMusicCtx.createMediaElementSource(backgroundMusic);ciMusicGain=ciMusicCtx.createGain();ciMusicSource.connect(ciMusicGain);ciMusicGain.connect(ciMusicCtx.destination)}if(ciMusicCtx.state==='suspended')ciMusicCtx.resume().catch(()=>{})}catch(e){}}
function applyMusicLevel(){const level=(window.CP_PAUSED?.16:.34)*audioLevels.music*(masterMuted?0:1);backgroundMusic.muted=masterMuted;backgroundMusic.volume=Math.max(0,Math.min(1,level));if(ciMusicGain)ciMusicGain.gain.setValueAtTime(Math.max(0,Math.min(1,level)),ciMusicCtx.currentTime)}
const missionFailAudio=new Audio('assets/audio/mission-fail.wav'),missionSuccessAudio=new Audio('assets/audio/mission-success.wav');const interceptImpact=new Audio('assets/audio/intercept-impact.wav'),ewoAudio=new Audio('assets/audio/ewo-sweep.wav'),clearRadio=[new Audio('assets/audio/radio-clear-user-01.wav'),new Audio('assets/audio/radio-clear-user-02.wav'),new Audio('assets/audio/radio-clear-user-03.wav'),new Audio('assets/audio/radio-clear-user-04.wav'),new Audio('assets/audio/radio-clear-user-05.wav'),new Audio('assets/audio/radio-clear-user-06.wav'),new Audio('assets/audio/radio-clear-user-07.wav'),new Audio('assets/audio/radio-clear-user-08.wav')];[interceptImpact,ewoAudio,missionFailAudio,missionSuccessAudio,...clearRadio].forEach(a=>a.preload='auto');function playAsset(a,vol=1,bus='sfx'){try{a._ciBaseVol=vol;a._ciBus=bus;a.currentTime=0;a.volume=Math.max(0,Math.min(1,vol*audioLevels[bus]*(masterMuted?0:1)));const p=a.play();if(p&&p.catch)p.catch(()=>{})}catch(e){rec('AUDIO_ASSET_FAIL',String(e))}}
function applyAudioSettings(){applyMusicLevel();[interceptImpact,ewoAudio,missionFailAudio,missionSuccessAudio,...clearRadio].forEach(a=>{if(a._ciBaseVol!=null){a.volume=Math.max(0,Math.min(1,a._ciBaseVol*audioLevels[a._ciBus||'sfx']*(masterMuted?0:1)))}});const mb=$('#muteBtn');if(mb){mb.textContent=masterMuted?'AUDIO MUTED':'AUDIO ON';mb.classList.toggle('muted',masterMuted)};[['musicSlider','musicValue','music'],['uiSlider','uiValue','ui'],['sfxSlider','sfxValue','sfx']].forEach(([sid,vid,k])=>{const sl=$('#'+sid),v=$('#'+vid);if(sl)sl.value=Math.round(audioLevels[k]*100);if(v)v.textContent=Math.round(audioLevels[k]*100)+'%'})}
function setAudioLevel(k,v){audioLevels[k]=Math.max(0,Math.min(1,Number(v)/100));localStorage.setItem('ci-audio-'+k,String(Math.round(audioLevels[k]*100)));if(k==='music')ensureMusicGain();applyAudioSettings()}
const visualSettings={gridOpacity:Number(localStorage.getItem('ci-grid-opacity')??42)/100,gridWeight:Number(localStorage.getItem('ci-grid-weight')??1.45),gridColor:localStorage.getItem('ci-grid-color')||'#e0e9ec',isrColor:localStorage.getItem('ci-isr-color')||'#dce5e8',isrSymbol:localStorage.getItem('ci-isr-symbol')||'AIRCRAFT'};
const ISR_PATHS={AIRCRAFT:'M0 -19L15 10L5 6L0 18L-5 6L-15 10Z',DIAMOND:'M0 -20L18 0L0 20L-18 0Z',CROSSHAIR:'M-18 -4H-4V-18H4V-4H18V4H4V18H-4V4H-18Z'};
function applyVisualSettings(){const root=document.documentElement;root.style.setProperty('--ci-grid-color',visualSettings.gridColor);root.style.setProperty('--ci-grid-opacity',String(visualSettings.gridOpacity));root.style.setProperty('--ci-grid-weight',String(visualSettings.gridWeight));document.querySelectorAll('#geometricGrid .geoHex').forEach(h=>{h.style.stroke=visualSettings.gridColor;h.style.strokeOpacity=String(visualSettings.gridOpacity);h.style.strokeWidth=String(visualSettings.gridWeight)});const asset=$('#asset'),sensor=$('#sensor'),label=$('#alabel');if(asset)asset.style.color=visualSettings.isrColor;if(sensor)sensor.style.color=visualSettings.isrColor;if(label)label.style.fill=visualSettings.isrColor;const path=$('#plane path');if(path)path.setAttribute('d',ISR_PATHS[visualSettings.isrSymbol]||ISR_PATHS.AIRCRAFT);const go=$('#gridOpacitySlider'),gov=$('#gridOpacityValue'),gw=$('#gridWeightSlider'),gwv=$('#gridWeightValue'),gc=$('#gridColorSelect'),ic=$('#isrColorSelect'),is=$('#isrSymbolSelect');if(go)go.value=Math.round(visualSettings.gridOpacity*100);if(gov)gov.textContent=Math.round(visualSettings.gridOpacity*100)+'%';if(gw)gw.value=visualSettings.gridWeight;if(gwv)gwv.textContent=visualSettings.gridWeight.toFixed(2);if(gc)gc.value=visualSettings.gridColor;if(ic)ic.value=visualSettings.isrColor;if(is)is.value=visualSettings.isrSymbol}
function saveVisualSetting(k,v){if(k==='gridOpacity'){visualSettings[k]=Number(v)/100;localStorage.setItem('ci-grid-opacity',String(Math.round(Number(v))))}else if(k==='gridWeight'){visualSettings[k]=Number(v);localStorage.setItem('ci-grid-weight',String(v))}else{visualSettings[k]=v;localStorage.setItem(k==='gridColor'?'ci-grid-color':k==='isrColor'?'ci-isr-color':'ci-isr-symbol',v)}applyVisualSettings()}
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
document.addEventListener('pointerdown',audioUnlock,{capture:true});function point(e){let p=$('#map').createSVGPoint();p.x=e.clientX;p.y=e.clientY;return p.matrixTransform($('#map').getScreenCTM().inverse())}function valid(p){return p&&Number.isFinite(p.x)&&Number.isFinite(p.y)}function stopCollect(){if(ct)clearTimeout(ct);if(ci)clearInterval(ci);ct=ci=null;if(col)col.collecting=false;col=null;pct=0}function acquire(){C.isr++;tutorialAdvance('acquire');rec('ISR_CLICK',`mode=${A.mode} pos=${A.x.toFixed(1)},${A.y.toFixed(1)}`);stopCollect();sel=null;A.mode='ISR_SELECTED';A.dest=null;stallLogged=false;log('ISR CONTROL // ACQUIRED');sound('acquire');ui(true)}function order(p){C.orders++;tutorialAdvance('order');rec('ORDER',valid(p)?`to=${p.x.toFixed(1)},${p.y.toFixed(1)}`:'INVALID');if(!valid(p)){A.dest=null;A.mode='ON_STATION';return}A.dest=campaignMission==='RETRO'?{x:Math.max(125,Math.min(775,p.x)),y:Math.max(125,Math.min(525,p.y))}:{x:Math.max(0,Math.min(900,p.x)),y:Math.max(0,Math.min(650,p.y))};A.heading=H(A.dest.x-A.x,A.dest.y-A.y);A.mode='ENROUTE';A.lastMove=performance.now();stallLogged=false;log('ISR ORDER // DESTINATION SET');sound('order')}function makeBlue(id,x,y){let b={id,x,y,exposure:0,degraded:false},g=document.createElementNS(NS,'g');{const k=activeOA==='VERDANT'?cpVerdantSymbolAspect():1;g.setAttribute('transform',`translate(${x} ${y}) scale(${k} 1)`);}g.innerHTML=`<circle r="24" fill="#0d1418" stroke="#4da3ff" stroke-width="2"/><path d="M-10 -10H10V10H-10ZM-5 -5H5V5H-5Z" fill="none" stroke="#4da3ff" stroke-width="2"/><text x="31" y="4" font-size="11" fill="#4da3ff">${id}</text>`;$('#blueSites').append(g);b.el=g;b.circle=g.querySelector('circle');b.icon=g.querySelector('path');b.label=g.querySelector('text');g.style.pointerEvents='all';g.addEventListener('pointerdown',e=>{if(!supplyRepairMode||!b.degraded)return;e.preventDefault();e.stopPropagation();reconstituteSite(b)});B.push(b)}function initBlue(){$('#blueSites').textContent='';B=[];
const sites=campaignMission==='RETRO'?[{id:'BLU-BASE',x:705,y:485},{id:'BLU-C2',x:600,y:170},{id:'BLU-LOG',x:300,y:310}]:activeOA==='VANTAGE'&&window.CP_VANTAGE_MAP?window.CP_VANTAGE_MAP.blufor:[{id:'BLU-FOB',x:705,y:485},{id:'BLU-C2',x:600,y:170},{id:'BLU-LOG',x:300,y:310},{id:'BLU-AIR',x:775,y:285},{id:'BLU-AOB',x:425,y:205}];
sites.forEach(s=>makeBlue(s.id,s.x,s.y));B.forEach(b=>{b.exposure=0;b.degraded=false;cpRenderBlueSite(b)})}
function cpNotice(title,detail,kind='intel'){
 const stack=$('#notificationStack');if(!stack)return;
 const n=document.createElement('div');n.className='op-notice '+kind;
 n.innerHTML='<b>'+title+'</b><span>'+detail+'</span>';stack.appendChild(n);
 while(stack.children.length>4)stack.firstElementChild.remove();
 setTimeout(()=>{n.classList.add('leaving');setTimeout(()=>n.remove(),350)},2600);
}
// v0.8.0 shared mission capability layer. Campaign systems query capabilities rather than hard-coding campaign numbers throughout the runtime.
function isCampaignMission(){return /^0[12]-\d{2}$/.test(campaignMission||'')}
function isCampaign02(){return /^02-/.test(campaignMission||'')}
function campaignStage(){let m=String(campaignMission||'').match(/^\d{2}-(\d{2})$/);return m?Number(m[1]):0}
function usesObjectiveTracker(){return isCampaignMission()||campaignMission==='ARCADE'||campaignMission==='RETRO'}
function usesThreatEnvironment(){return campaignMission==='ARCADE'||campaignMission==='01-04'||campaignMission==='01-05'||(isCampaign02()&&campaignStage()>=4)}
function usesPassiveISR(){return campaignMission==='TUTORIAL'||usesThreatEnvironment()}
function usesIntelDrops(){return campaignMission==='TUTORIAL'||usesThreatEnvironment()}
function usesNetworkAnalysis(){return isCampaign02()&&campaignStage()>=3}
const PASSIVE_MAX=9,PASSIVE_RADIUS=92,PASSIVE_COSTS=[30,35,40,45,50,60,70,80,90],NAI_LINK_MAX=360,NAI_MIN_AREA=1800,NAI_COLLECT_MS=1000,EWO_COST=75;
function passiveEnabled(){return usesPassiveISR()}
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
function passiveToggleDeploy(){if(!passiveEnabled()||!running)return;if(passiveNodes.length>=PASSIVE_MAX){cpNotice('PASSIVE ISR','MAXIMUM 9 NODES ACTIVE','intel');return}const cost=passiveCost();if(passiveCredits<cost){cpNotice('PASSIVE ISR','INSUFFICIENT ISR CREDITS // '+passiveCredits+'/'+cost,'intel');return}passiveDeployMode=!passiveDeployMode;A.mode=passiveDeployMode?'PASSIVE_DEPLOY':(A.dest?'ENROUTE':'ON_STATION');if(passiveDeployMode){A.dest=null;stopCollect();sel=null;log('PASSIVE ISR // SELECT DEPLOYMENT POINT')}ui(true)
}
function truth(){let r=Math.random();if(campaignMission==='ARCADE'){let threat=Math.min(.72,.42+(arcadeThreatLevel-1)*.045);return r<threat/2?'HOSTILE':r<threat?'IRREGULAR':r<threat+(1-threat)/2?'NEUTRAL':'FRIENDLY'}if(/^02-/.test(campaignMission||''))return r<.28?'HOSTILE':r<.50?'IRREGULAR':r<.76?'NEUTRAL':'FRIENDLY';if(campaignMission==='01-05')return r<.30?'HOSTILE':r<.60?'IRREGULAR':r<.80?'NEUTRAL':'FRIENDLY';if(campaignMission==='01-01'||campaignMission==='01-02'||campaignMission==='01-03'||campaignMission==='01-04')return r<.25?'HOSTILE':r<.50?'IRREGULAR':r<.75?'NEUTRAL':'FRIENDLY';if(phase===1)return r<.25?'HOSTILE':r<.38?'IRREGULAR':r<.68?'NEUTRAL':'FRIENDLY';if(phase===2)return r<.30?'HOSTILE':r<.48?'IRREGULAR':r<.75?'NEUTRAL':'FRIENDLY';return r<.34?'HOSTILE':r<.58?'IRREGULAR':r<.80?'NEUTRAL':'FRIENDLY'}function parms(){
 if(campaignMission==='ARCADE'){let l=Math.max(1,arcadeThreatLevel);return {gap:Math.max(2.4,8.5-(l-1)*.7),cap:Math.min(10,5+Math.floor((l-1)/2))}}
 if(/^02-/.test(campaignMission||''))return phase===1?{gap:8.2,cap:6}:phase===2?{gap:5.8,cap:7}:{gap:4.2,cap:8};
 if(campaignMission==='01-05')return phase===1?{gap:8.0,cap:6}:phase===2?{gap:5.5,cap:7}:{gap:3.8,cap:8};
 return phase===1?{gap:9.5,cap:5}:phase===2?{gap:6.5,cap:6}:{gap:4.5,cap:7}
}const PREFIX={UNKNOWN:'UNK',NEUTRAL:'NTL',HOSTILE:'HST',IRREGULAR:'IRG',FRIENDLY:'FRI'};function designation(t){let n=String(t.id).split('-').pop();return (t.type==='UNKNOWN'?'UNK':PREFIX[t.type])+'-'+n}function color(t){return t.type==='HOSTILE'?'#ff5b55':t.type==='IRREGULAR'?'#d8a83e':t.type==='NEUTRAL'?'#55d66b':t.type==='FRIENDLY'?'#4da3ff':'#dce5e8'}function spawn(stationary=null){let p=parms();
if(stationary===null){
  if(campaignMission==='01-02'){
    stationary=campaignStationarySpawned<4 ? true : Math.random()<.45;
  }else stationary=Math.random()<.3;
}if(!running||T.filter(t=>!t.done).length>=p.cap)return;let x,y,vx=0,vy=0;if(stationary){x=130+Math.random()*640;y=90+Math.random()*460}else{let side=Math.floor(Math.random()*4),s=1.5+Math.random()*1.9;if(side===0){x=40;y=60+Math.random()*520;vx=s;vy=(Math.random()-.5)*1.3}else if(side===1){x=860;y=60+Math.random()*520;vx=-s;vy=(Math.random()-.5)*1.3}else if(side===2){x=60+Math.random()*780;y=40;vx=(Math.random()-.5)*1.3;vy=s}else{x=60+Math.random()*780;y=610;vx=(Math.random()-.5)*1.3;vy=-s}}let tr=truth(),t={id:'UNK-'+String(next++).padStart(3,'0'),x,y,vx,vy,stationary,truth:tr,type:'UNKNOWN',done:false,collecting:false,enemyRange:stationary?145:105,ring:null,bornAt:performance.now(),proxSite:null,proxSince:0,proxAssessed:false,hostileCollect:false,collectStarted:0,compromiseAdded:0,stallX:null,stallY:null,stallAt:performance.now(),stallLogged:false,naiSince:0,naiPct:0,naiDerived:false,priorityNAISince:0,priorityNAIPct:0,priorityNAICued:false,priorityNAIObserved:false,intel:{firstObserved:0,lastObserved:0,observations:0,wasObserved:false,lastX:null,lastY:null,obsPoints:[],siteObs:{},areaRecurrence:false,baselineEstablished:false,baselineX:null,baselineY:null,deviationCount:0,lastDeviationAt:0,lastDeviationX:null,lastDeviationY:null},lkp:null};
if(/^02-/.test(campaignMission||'')&&window.CP_VANTAGE_MAP){const hs=window.CP_VANTAGE_MAP.hotspots;if(hs.length&&Math.random()<.76){let h=hs[Math.floor(Math.random()*hs.length)];t.hotspot=h.id;t.x=h.x+(Math.random()-.5)*90;t.y=h.y+(Math.random()-.5)*90;t.stationary=Math.random()<.38;}}
if(campaignMission==='01-03'||campaignMission==='01-04'||campaignMission==='01-05'||/^02-/.test(campaignMission||'')||campaignMission==='ARCADE'){
  const siteList=B.map(b=>({name:b.id,x:b.x,y:b.y}));
  if(siteList.length&&Math.random()<(campaignMission==='ARCADE'?.72:(campaignMission==='01-05'?.70:.58))){let ps=siteList[Math.floor(Math.random()*siteList.length)];t.proxSite=ps.name;t.x=ps.x+(Math.random()-.5)*105;t.y=ps.y+(Math.random()-.5)*105;t.proxSince=performance.now();t.stationary=Math.random()<.62}
}if(campaignMission==='01-02'&&stationary)campaignStationarySpawned++;if(tr==='IRREGULAR'&&!stationary&&Math.random()<.72){let target=B[Math.floor(Math.random()*B.length)],dx=target.x-x,dy=target.y-y,d=Math.hypot(dx,dy),s=2.2+Math.random();t.vx=dx/d*s;t.vy=dy/d*s}let g=document.createElementNS(NS,'g'),hit=document.createElementNS(NS,'circle'),v=document.createElementNS(NS,'line'),c=document.createElementNS(NS,'circle'),d=document.createElementNS(NS,'path'),tx=document.createElementNS(NS,'text');g.style.cursor='pointer';g.style.pointerEvents='all';hit.setAttribute('r','29');hit.setAttribute('fill','transparent');v.setAttribute('stroke-opacity','.55');v.setAttribute('stroke-width','1.5');v.style.pointerEvents='none';c.setAttribute('r','17');c.setAttribute('fill','#0d1418');c.setAttribute('stroke-width','2');c.style.pointerEvents='none';d.setAttribute('d',stationary?'M-9 -9H9V9H-9Z':'M0 -8L8 0L0 8L-8 0Z');d.setAttribute('fill','none');d.setAttribute('stroke-width','2');d.style.pointerEvents='none';tx.setAttribute('x','25');tx.setAttribute('y','4');tx.setAttribute('font-size','11');tx.style.pointerEvents='none';g.append(hit,v,c,d,tx);Object.assign(t,{el:g,v,c,d,tx});g.addEventListener('pointerdown',e=>{e.preventDefault();C.track++;rec('TRACK_POINTER',`${t.id} mode=${A.mode}`);e.stopPropagation();if(!running)return;if(passiveDeployMode){passivePlace({x:t.x,y:t.y});return}if(A.mode==='ISR_SELECTED'){order({x:t.x,y:t.y});ui(true);return}sel=t;ui(true)});$('#tracks').append(g);T.push(t);log('NEW '+(stationary?'STATIC ':'')+'TRACK // '+t.id);sound('contact')}function ensureLKP(t){
 if(!t||!t.intel)return null;
 if(!t.lkp){
  let g=document.createElementNS(NS,'g'),r=document.createElementNS(NS,'circle'),h=document.createElementNS(NS,'line'),v=document.createElementNS(NS,'line'),tx=document.createElementNS(NS,'text');
  g.setAttribute('visibility','hidden');g.style.pointerEvents='none';g.setAttribute('opacity','.68');
  r.setAttribute('r','13');r.setAttribute('fill','rgba(8,13,16,.72)');r.setAttribute('stroke','#a9c0c9');r.setAttribute('stroke-width','1.5');r.setAttribute('stroke-dasharray','3 3');
  h.setAttribute('x1','-18');h.setAttribute('x2','18');h.setAttribute('y1','0');h.setAttribute('y2','0');h.setAttribute('stroke','#a9c0c9');h.setAttribute('stroke-width','1');h.setAttribute('stroke-opacity','.72');
  v.setAttribute('x1','0');v.setAttribute('x2','0');v.setAttribute('y1','-18');v.setAttribute('y2','18');v.setAttribute('stroke','#a9c0c9');v.setAttribute('stroke-width','1');v.setAttribute('stroke-opacity','.72');
  tx.setAttribute('x','22');tx.setAttribute('y','4');tx.setAttribute('font-size','10');tx.setAttribute('font-weight','700');tx.setAttribute('fill','#a9c0c9');tx.setAttribute('letter-spacing','.04em');
  g.append(r,h,v,tx);$('#lastKnownPositions').append(g);t.lkp={g,r,h,v,tx};
 }
 return t.lkp;
}
function lkpAgeSeconds(t,now=performance.now()){return t?.intel?.lastObserved?Math.max(0,Math.floor((now-t.intel.lastObserved)/1000)):0}
function lkpAge(t,now=performance.now()){let sec=lkpAgeSeconds(t,now);return String(Math.floor(sec/60)).padStart(2,'0')+':'+String(sec%60).padStart(2,'0')}
function lkpConfidence(t,now=performance.now()){let sec=lkpAgeSeconds(t,now);return sec<12?'HIGH':sec<25?'MODERATE':sec<40?'LOW':'STALE'}
function renderLKP(t){if(intelAssistMode()==='OFF'){if(t.lkp?.g)t.lkp.g.setAttribute('visibility','hidden');return}
 let l=ensureLKP(t),i=t?.intel;if(!l||!i)return;
 let show=!t.done&&i.observations>0&&!i.wasObserved&&!passiveCovered(t)&&i.lastX!=null&&i.lastY!=null;
 l.g.setAttribute('visibility',show?'visible':'hidden');
 if(show){
  let conf=lkpConfidence(t),style=conf==='HIGH'?{op:.68,stroke:'#a9c0c9',dash:'3 3',text:'#a9c0c9'}:conf==='MODERATE'?{op:.50,stroke:'#93a7ae',dash:'4 4',text:'#93a7ae'}:conf==='LOW'?{op:.34,stroke:'#78898f',dash:'2 5',text:'#78898f'}:{op:.20,stroke:'#66757a',dash:'1 6',text:'#66757a'};
  {const k=activeOA==='VERDANT'?cpVerdantSymbolAspect():1;l.g.setAttribute('transform',`translate(${i.lastX} ${i.lastY}) scale(${k} 1)`);}l.g.setAttribute('opacity',String(style.op));
  l.r.setAttribute('stroke',style.stroke);l.r.setAttribute('stroke-dasharray',style.dash);l.h.setAttribute('stroke',style.stroke);l.v.setAttribute('stroke',style.stroke);l.tx.setAttribute('fill',style.text);
  l.tx.textContent=designation(t)+' // LKP '+lkpAge(t)+' // '+conf;
 }
}
function ensureRing(t){let threat=t.type==='HOSTILE'||t.type==='IRREGULAR';if(threat&&!t.ring){let c=document.createElementNS(NS,'circle');c.setAttribute('r',t.enemyRange);c.setAttribute('fill-opacity','.025');c.setAttribute('stroke-opacity','.36');c.setAttribute('stroke-dasharray','5 7');$('#enemyRings').append(c);t.ring=c}if(t.ring){let intelVisible=!(t.intel&&t.intel.observations>0&&!t.intel.wasObserved&&!passiveCovered(t));t.ring.setAttribute('visibility',threat&&!t.done&&intelVisible?'visible':'hidden');if(threat){let c=color(t);t.ring.setAttribute('cx',t.x);t.ring.setAttribute('cy',t.y);t.ring.setAttribute('fill',c);t.ring.setAttribute('stroke',c)}}}function draw(t){if(t.done){t.el.setAttribute('visibility','hidden');renderLKP(t);ensureRing(t);return}let inside=D(A,t)<=cpEffectiveISRRadius(),knownLost=!!(t.intel&&t.intel.observations>0&&!t.intel.wasObserved&&!passiveCovered(t));t.el.setAttribute('visibility',knownLost?'hidden':'visible');renderLKP(t);{const k=activeOA==='VERDANT'?cpVerdantSymbolAspect():1;t.el.setAttribute('transform',`translate(${t.x} ${t.y}) scale(${k} 1)`);}let c=color(t);t.c.setAttribute('r',sel===t?'22':'17');t.c.setAttribute('stroke',c);t.d.setAttribute('stroke',c);t.tx.setAttribute('fill',c);t.v.setAttribute('stroke',c);t.v.setAttribute('x2',t.vx*13);t.v.setAttribute('y2',t.vy*13);t.tx.textContent=designation(t)+' // '+(t.type==='UNKNOWN'&&t.naiSince?'NAI COLLECTING '+t.naiPct+'%':t.collecting?'COLLECTING '+pct+'%':t.type==='UNKNOWN'?(t.priorityNAISince?'PRIORITY NAI // AUTO COLLECTION '+t.priorityNAIPct+'%':naiForTrack(t)?'NAI // AUTO COLLECTION':passiveCovered(t)?(inside?'PASSIVE CUE // IN RANGE':'PASSIVE CUE'):(inside?'IN RANGE':'UNKNOWN')):t.type);ensureRing(t)}function pulse(k){let c=k==='HOSTILE'?'#ff5b55':k==='IRREGULAR'?'#d8a83e':k==='NEUTRAL'?'#55d66b':'#4da3ff';$('#sr').setAttribute('stroke',c);$('#sf').setAttribute('fill',c);$('#sr').setAttribute('stroke-width','5');$('#sf').setAttribute('fill-opacity','.13');setTimeout(()=>{$('#sr').setAttribute('stroke','currentColor');$('#sf').setAttribute('fill','currentColor');$('#sr').setAttribute('stroke-width','2.4');$('#sf').setAttribute('fill-opacity','.025')},850)}function naiClassify(t){if(!t||t.done||t.type!=='UNKNOWN')return;t.naiSince=0;t.naiPct=100;t.naiDerived=true;t.type=t.truth;score+=25;if(campaignMission==='01-01'||campaignMission==='01-02')campaignIds++;if(campaignMission==='01-02'&&t.stationary)campaignStationaryAssessed++;if(campaignMission==='01-03'&&t.proxSite&&!t.proxAssessed){t.proxAssessed=true;campaignProximityAssessed++;}pulse(t.type);ensureRing(t);log('NAI CLASSIFIED // '+designation(t)+' // '+t.type);cpNotice('NAI AUTO COLLECTION',designation(t)+' // '+t.type,'intel');sound('classify');if(campaignMission==='01-02')cpCheck0102();if(campaignMission==='01-03')cpCheck0103();ui(true)}
function naiTick(now){if(!passiveEnabled()||!passiveNAIs.length)return;T.forEach(t=>{if(t.done||t.type!=='UNKNOWN'||t.collecting){t.naiSince=0;t.naiPct=0;return}const z=naiForTrack(t);if(!z){t.naiSince=0;t.naiPct=0;return}if(!t.naiSince){t.naiSince=now;t.naiPct=0;log('NAI-'+String(z.id).padStart(2,'0')+' // AUTO COLLECTION // '+t.id)}t.naiPct=Math.min(99,Math.floor((now-t.naiSince)*100/NAI_COLLECT_MS));if(now-t.naiSince>=NAI_COLLECT_MS)naiClassify(t)})}
const PRIORITY_NAI_COLLECT_MS=NAI_COLLECT_MS;
function cpCommittedPriorityNAIPoints(){const saved=readGlobalNAIs()[activeOA];return saved?.committed&&Array.isArray(saved.points)&&saved.points.length>=3?saved.points.map(p=>({x:p.x*900,y:p.y*650})):[];}
function cpPointInPoly(x,y,pts){let inside=false;for(let i=0,j=pts.length-1;i<pts.length;j=i++){const a=pts[i],b=pts[j],cross=((a.y>y)!==(b.y>y))&&(x<(b.x-a.x)*(y-a.y)/((b.y-a.y)||1e-9)+a.x);if(cross)inside=!inside;}return inside;}
function cpPriorityNAICovered(t){const pts=cpCommittedPriorityNAIPoints();return pts.length>=3&&cpPointInPoly(t.x,t.y,pts);}
function cpPriorityNAIClassify(t){if(!t||t.done||t.type!=='UNKNOWN')return;t.priorityNAISince=0;t.priorityNAIPct=100;t.priorityNAICued=false;t.priorityNAIObserved=true;t.naiDerived=true;t.type=t.truth;score+=25;if(campaignMission==='01-01'||campaignMission==='01-02')campaignIds++;if(campaignMission==='01-02'&&t.stationary)campaignStationaryAssessed++;if(campaignMission==='01-03'&&t.proxSite&&!t.proxAssessed){t.proxAssessed=true;campaignProximityAssessed++;}pulse(t.type);ensureRing(t);log('PRIORITY NAI CLASSIFIED // '+designation(t)+' // '+t.type);cpNotice('PRIORITY NAI AUTO COLLECTION',designation(t)+' // '+t.type,'intel');sound('classify');if(campaignMission==='01-02')cpCheck0102();if(campaignMission==='01-03')cpCheck0103();ui(true);}
function cpPriorityNAITick(now){const pts=cpCommittedPriorityNAIPoints();T.forEach(t=>{if(t.done||t.type!=='UNKNOWN'||t.collecting||pts.length<3||!cpPointInPoly(t.x,t.y,pts)){t.priorityNAISince=0;t.priorityNAIPct=0;return;}if(!t.priorityNAISince){t.priorityNAISince=now;t.priorityNAIPct=0;log('PRIORITY NAI // AUTO COLLECTION // '+t.id);}t.priorityNAIPct=Math.min(99,Math.floor((now-t.priorityNAISince)*100/PRIORITY_NAI_COLLECT_MS));if(now-t.priorityNAISince>=PRIORITY_NAI_COLLECT_MS)cpPriorityNAIClassify(t);});}
function collect(){if(!running||!sel||sel.done||sel.type!=='UNKNOWN'||D(A,sel)>cpEffectiveISRRadius()||col)return;col=sel;col.collecting=true;pct=0;let st=Date.now(),collectMs=passiveCovered(col)?550:1000;ci=setInterval(()=>{pct=Math.min(99,Math.floor((Date.now()-st)*100/collectMs));ui(true)},80);ct=setTimeout(()=>{clearInterval(ci);ci=ct=null;col.collecting=false;col.type=col.truth;score+=25;if(campaignMission==='01-01'||campaignMission==='01-02')campaignIds++;
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
 if(campaignMission==='RETRO'){
   if(ok){score+=100;if(threat)ints++;log(a+' // '+designation(target)+' // CORRECT');if(threat&&a==='INTERCEPT')sound('explosion');else if(a==='CLEAR')sound('clear');}
   else{score-=50;log(a+' // '+designation(target)+' // ERROR');sound('wrong');}
   decisionTotal++;if(ok)decisionCorrect++;integrity=decisionTotal?Math.round(decisionCorrect/decisionTotal*100):100;
   cpDecisionFloat(target,ok);
   target.done=true;ensureRing(target);resolved++;sel=null;ui(true);return;
 }
 if(ok){
   if(campaignMission==='ARCADE'){arcadeCorrect++;arcadeStreak++;arcadeBestStreak=Math.max(arcadeBestStreak,arcadeStreak);score+=Math.min(250,arcadeStreak*10);}
   score+=100;
   if(threat&&a==='INTERCEPT')sound('explosion');
   passiveAward(target.naiDerived?5:10,target.naiDerived?'NAI DISPOSITION':'CORRECT DISPOSITION');
   if(campaignMission==='01-01'||campaignMission==='01-02'||campaignMission==='01-03'||campaignMission==='01-04'||campaignMission==='01-05'||/^02-/.test(campaignMission||'')||campaignMission==='ARCADE'){
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
   else if(/^02-/.test(campaignMission||''))cpCheckCampaign02();
 }
 if(campaignMission==='ARCADE'&&integrity<=0&&!campaignFinished)arcadeFinish('INTELLIGENCE FAILURE');
 sel=null;ui(true);
}
function compromise(){return B.reduce((a,b)=>a+b.exposure,0)/B.length}let cpRecoveryTimer=0;
function cpThreatMission(){return usesThreatEnvironment()}
function cpRecoveryFlash(title,detail,kind){
 cpNotice(title,detail,kind==='FRIENDLY'?'friendly':kind==='NEUTRAL'?'neutral':'hostile');
}
function cpIntelDropReset(){
 intelDropOffered=false;intelDropActive=false;intelDropAt=performance.now()+65000;intelDropExpires=0;intelFusionUntil=0;
 const d=$('#intelDrop'),b=$('#intelFusionBadge');if(d)d.classList.add('hidden');if(b)b.classList.add('hidden');
}
function cpIntelDropOffer(){
 if(!usesIntelDrops()||intelDropOffered||campaignFinished)return;
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
 if(!usesIntelDrops()||campaignFinished)return;
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
function cpFusionActive(){return usesIntelDrops()&&intelFusionUntil&&performance.now()<intelFusionUntil}
function cpEffectiveISRRadius(){if(campaignMission==='RETRO')return A.r;normalizeISRCapability();return A.r*(isrCapability==='WIDE'?1.10:1)*(cpFusionActive()?1.30:1)}
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
 if(campaignMission==='RETRO'){T.forEach(t=>{if(t.done||(t.truth!=='HOSTILE'&&t.truth!=='IRREGULAR'))return;B.forEach(b=>{if(D(t,b)<=t.enemyRange){let mult=t.truth==='IRREGULAR'?2.15:1,burn=(t.stationary?1.8:1.05)*mult*dt;b.exposure=Math.min(100,b.exposure+burn);score-=burn*.12}})});return;}
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
function intelClock(ms){if(!ms)return '--';let sec=Math.max(0,Math.floor((ms-start)/1000));return String(Math.floor(sec/60)).padStart(2,'0')+':'+String(sec%60).padStart(2,'0')}
function patternBaseline(points){if(!points||points.length<3)return null;let best=[];for(const seed of points){let cluster=points.filter(o=>Math.hypot(o.x-seed.x,o.y-seed.y)<=135);if(cluster.length>best.length)best=cluster}if(best.length<3)return null;let x=best.reduce((sum,o)=>sum+o.x,0)/best.length,y=best.reduce((sum,o)=>sum+o.y,0)/best.length;return{x,y,count:best.length}}
function recordPatternObservation(t,now){let i=t.intel;if(!i)return;let p={x:t.x,y:t.y,at:now},prior=i.obsPoints.slice(),baseline=patternBaseline(prior);if(baseline){i.baselineEstablished=true;i.baselineX=baseline.x;i.baselineY=baseline.y;let delta=Math.hypot(p.x-baseline.x,p.y-baseline.y);if(delta>=190){i.deviationCount=(i.deviationCount||0)+1;i.lastDeviationAt=now;i.lastDeviationX=p.x;i.lastDeviationY=p.y;rec('PATTERN_DEVIATION',t.id+' delta='+Math.round(delta)+' count='+i.deviationCount);cpNotice('PATTERN DEVIATION // OBSERVED',designation(t)+' // '+Math.round(delta)+' GRID FROM ESTABLISHED BASELINE','intel')}}if(i.obsPoints.some(o=>Math.hypot(o.x-p.x,o.y-p.y)<=115))i.areaRecurrence=true;i.obsPoints.push(p);if(i.obsPoints.length>12)i.obsPoints.shift();let refreshed=patternBaseline(i.obsPoints);if(refreshed){i.baselineEstablished=true;i.baselineX=refreshed.x;i.baselineY=refreshed.y}let near=null,nearD=Infinity;B.forEach(site=>{let d=Math.hypot(site.x-p.x,site.y-p.y);if(d<nearD){nearD=d;near=site}});if(near&&nearD<=145)i.siteObs[near.id]=(i.siteObs[near.id]||0)+1;if(activeOA==='VANTAGE'&&window.CP_VANTAGE_MAP){i.hotspotObs=i.hotspotObs||{};let h=null,hd=Infinity;window.CP_VANTAGE_MAP.hotspots.forEach(q=>{let d=Math.hypot(q.x-p.x,q.y-p.y);if(d<hd){hd=d;h=q}});if(h&&hd<=115){i.hotspotObs[h.id]=(i.hotspotObs[h.id]||0)+1;if(i.hotspotObs[h.id]>=2)campaign02PatternTracks.add(t.id)}}}
function patternIndicators(t){let i=t?.intel;if(!i)return[];let out=[];if(i.observations>=2)out.push(['REPEATED ACTIVITY',i.observations+' OBS']);if(i.baselineEstablished)out.push(['BASELINE','ESTABLISHED']);if(i.deviationCount>0)out.push(['PATTERN DEVIATION',i.deviationCount+' OBSERVED']);let hs=Object.entries(i.hotspotObs||{}).filter(([,n])=>n>=2).sort((a,b)=>b[1]-a[1]);hs.slice(0,2).forEach(([id,n])=>out.push([id.replaceAll('-',' ')+' ACTIVITY',n+' OBS']));let sites=Object.entries(i.siteObs||{}).filter(([,n])=>n>=2).sort((a,b)=>b[1]-a[1]);sites.slice(0,2).forEach(([id,n])=>out.push([id+' PROXIMITY',n+' OBS']));if(i.areaRecurrence)out.push(['AREA RECURRENCE','DETECTED']);return out}
function intelligenceAssessment(t){let i=t?.intel;if(!i||i.observations<2)return'INSUFFICIENT INFORMATION';let pats=patternIndicators(t),siteRepeated=Object.values(i.siteObs||{}).some(n=>n>=2),signals=(i.areaRecurrence?1:0)+(siteRepeated?1:0)+(i.observations>=3?1:0)+(i.deviationCount>0?1:0);return signals>=2?'SIGNIFICANT ACTIVITY':pats.length?'PATTERN DEVELOPING':'INSUFFICIENT INFORMATION'}
function updateTrackMemory(now){if(!running||campaignMission==='RETRO')return;T.forEach(t=>{if(t.done||!t.intel)return;const observed=D(A,t)<=cpEffectiveISRRadius(),was=t.intel.wasObserved;if(observed){if(!was){t.intel.observations++;if(!t.intel.firstObserved)t.intel.firstObserved=now;recordPatternObservation(t,now);rec('TRACK_OBS',t.id+' observation='+t.intel.observations)}t.intel.lastObserved=now;t.intel.lastX=t.x;t.intel.lastY=t.y}else if(was){rec('TRACK_LKP',t.id+' '+Math.round(t.intel.lastX)+'/'+Math.round(t.intel.lastY));if(sel===t)sel=null}t.intel.wasObserved=observed})}
function associationLevel(n){return n>=3?'ESTABLISHED':n>=2?'SUPPORTED':'POSSIBLE'}
function associationEntries(t){let out=[];networkAssociations.forEach((v,k)=>{let [a,b]=k.split('|');if(a===t.id||b===t.id)out.push({id:a===t.id?b:a,count:v.count,level:associationLevel(v.count),hotspot:v.hotspot})});return out.sort((a,b)=>b.count-a.count)}
function networkTick(now){if(!/^02-/.test(campaignMission||''))return;let obs=T.filter(t=>!t.done&&t.intel?.wasObserved);obs.forEach(t=>{if(t.intel.observations>=2)campaign02ContinuityTracks.add(t.id)});for(let a=0;a<obs.length;a++)for(let b=a+1;b<obs.length;b++){let x=obs[a],y=obs[b];if(Math.hypot(x.x-y.x,x.y-y.y)>125)continue;let hotspot='CO-LOCATION';if(window.CP_VANTAGE_MAP){let best=Infinity;window.CP_VANTAGE_MAP.hotspots.forEach(h=>{let d=(Math.hypot(x.x-h.x,x.y-h.y)+Math.hypot(y.x-h.x,y.y-h.y))/2;if(d<best&&d<135){best=d;hotspot=h.id}})}let key=[x.id,y.id].sort().join('|'),lastAt=networkLastPair.get(key)||0;if(now-lastAt<14000)continue;networkLastPair.set(key,now);let v=networkAssociations.get(key)||{count:0,hotspot};v.count++;v.hotspot=hotspot;networkAssociations.set(key,v);campaign02AssocEvents++;cpNotice('ASSOCIATION OBSERVED',x.id+' + '+y.id+' // '+associationLevel(v.count),'intel');}}
function campaign02Stats(){let established=0,supported=0;networkAssociations.forEach(v=>{if(v.count>=3)established++;if(v.count>=2)supported++});return{continuity:campaign02ContinuityTracks.size,patterns:campaign02PatternTracks.size,associations:campaign02AssocEvents,supported,established}}

function detail(){if(!sel||sel.done){$('#none').hidden=false;$('#detail').hidden=true;return}$('#none').hidden=true;$('#detail').hidden=false;let d=D(A,sel),inside=d<=cpEffectiveISRRadius(),u=sel.type==='UNKNOWN';$('#tid').textContent=designation(sel);$('#type').textContent=sel.type;$('#motion').textContent=sel.stationary?'STATIONARY':'MOBILE';
let obsRow=$('#observedRow');if(obsRow){let show=sel.type!=='UNKNOWN';obsRow.hidden=!show;if(show){let sec=Math.max(0,Math.floor((performance.now()-sel.bornAt)/1000));$('#observed').textContent=String(Math.floor(sec/60)).padStart(2,'0')+':'+String(sec%60).padStart(2,'0')}}
let intel=sel.intel;if(intel){$('#intelObs').textContent=String(intel.observations);$('#intelFirst').textContent=intelClock(intel.firstObserved);$('#intelLast').textContent=intelClock(intel.lastObserved);$('#intelPos').textContent=intel.lastX==null?'--':Math.round(intel.lastX)+' / '+Math.round(intel.lastY);let posStatus=$('#intelPositionStatus'),posConf=$('#intelPositionConfidence'),assessment=$('#intelAssessment');if(posStatus)posStatus.textContent=intel.wasObserved?'CURRENT':'LAST KNOWN';if(posConf)posConf.textContent=intel.wasObserved?'CURRENT':lkpConfidence(sel);if(assessment){let a=intelligenceAssessment(sel);assessment.textContent=a;assessment.className=a==='SIGNIFICANT ACTIVITY'?'assessment-significant':a==='PATTERN DEVELOPING'?'assessment-developing':'assessment-insufficient'}let pats=patternIndicators(sel),box=$('#patternIndicators'),list=$('#patternList');if(box&&list){box.classList.toggle('hidden',intelAssistMode()!=='FULL'||!pats.length);list.textContent='';pats.forEach(([label,val])=>{let row=document.createElement('div');row.className='pattern-indicator';let a=document.createElement('span'),b=document.createElement('b');a.textContent=label;b.textContent=val;row.append(a,b);list.append(row)})}let nb=$('#networkAssociations'),nl=$('#networkAssociationList');if(nb&&nl){let ae=associationEntries(sel);nb.classList.toggle('hidden',!usesNetworkAnalysis()||!ae.length);nl.textContent='';ae.slice(0,5).forEach(e=>{let r=document.createElement('div');r.className='pattern-indicator';r.innerHTML='<span>'+e.id+' // '+e.hotspot.replaceAll('-',' ')+'</span><b>'+e.level+' // '+e.count+'</b>';nl.append(r)})}applyIntelAssistPresentation()}$('#dist').textContent=Math.round(d)+' GRID';$('#sense').textContent=inside?'IN RANGE':'OUT OF RANGE';$('#collect').hidden=!u;$('#collect').disabled=!inside||!!col;$('#prog').hidden=col!==sel;$('#pct').textContent=pct+'%';$('#bar').style.width=pct+'%';$('#dec').hidden=u}function cpStatusClass(el,state){if(!el)return;el.classList.remove('status-good','status-warn','status-bad');el.classList.add(state)}
function cpRefreshStatusColors(){
 let integrityState=integrity>=80?'status-good':integrity>=60?'status-warn':'status-bad';
 let oeState=campaignCompromise<30?'status-good':campaignCompromise<50?'status-warn':'status-bad';
 cpStatusClass($('#integrity'),integrityState);cpStatusClass($('#objIntegrity'),integrityState);
 cpStatusClass($('#comp'),oeState);cpStatusClass($('#objCompromise'),oeState);
}
function displayMode(mode){return String(mode||'STANDBY').replaceAll('_',' ')}function ui(force=false){let now=performance.now();if(!force&&now-lastUi<200)return;lastUi=now;let p=parms(),c=(cpThreatMission()?campaignCompromise:compromise()),n=T.filter(t=>!t.done&&t.type==='UNKNOWN'&&D(A,t)<=cpEffectiveISRRadius()).length;$('#stateLine').textContent=A.mode==='ISR_SELECTED'?'ISR CONTROL // SELECT DESTINATION':'ISR // '+displayMode(A.mode);$('#rangeLine').textContent='SENSOR // '+n+' UNKNOWN IN RANGE';$('#score').textContent=String(Math.max(0,Math.round(score))).padStart(4,'0');$('#integrity').textContent=Math.round(integrity)+'%';$('#comp').textContent=Math.round(c)+'%';const cm=$('#compMeter'),im=$('#integrityMeter');if(cm){cm.style.width=Math.min(100,Math.max(0,c))+'%';cm.className=c>=50?'danger':c>=30?'warn':''}if(im){im.style.width=Math.min(100,Math.max(0,integrity))+'%';im.className=integrity<40?'danger':integrity<80?'warn':''}$('#compTop').textContent=Math.round(c)+'%';$('#resolved').textContent=resolved;$('#ints').textContent=ints;
let or=$('#objResolved'),oi=$('#objInterrupted'),og=$('#objIntegrity'),oc=$('#objCompromise'),ot=$('#objectiveTracker'),
    ott=$('#objectiveTitle'),osl=$('#objectiveSecondaryLabel'),osc=$('#objectiveSecondaryChip'),oec=$('#objectiveOEChip');
if(ot)ot.style.display=usesObjectiveTracker()?'flex':'none';
if(campaignMission&&or){
 let title='ESTABLISH',resolveTarget=10,secondaryLabel='',secondaryValue='',secondaryComplete=false,showOE=false;
 if(campaignMission==='ARCADE'){title='ARCADE // THREAT '+arcadeThreatLevel;resolveTarget=Math.max(1,arcadeCorrect);secondaryLabel='STREAK';secondaryValue=arcadeStreak+' / '+arcadeBestStreak;secondaryComplete=arcadeStreak>=5;showOE=true}
 if(campaignMission==='RETRO'){title='SURVIVE';resolveTarget=Math.max(1,resolved);secondaryLabel='';secondaryValue='';secondaryComplete=false;showOE=true}
 if(campaignMission==='01-02'){title='PATTERN';resolveTarget=12;secondaryLabel='STATIONARY';secondaryValue=campaignStationaryAssessed+'/4';secondaryComplete=campaignStationaryAssessed>=4}
 if(campaignMission==='01-03'){title='INDICATORS';resolveTarget=14;secondaryLabel='PROXIMITY';secondaryValue=campaignProximityAssessed+'/5';secondaryComplete=campaignProximityAssessed>=5}
 if(campaignMission==='01-04'){title='CONTESTED';resolveTarget=14;secondaryLabel='INTERRUPT';secondaryValue=campaignCollectionInterrupted+'/4';secondaryComplete=campaignCollectionInterrupted>=4;showOE=true}
 if(campaignMission==='01-05'){title='CONDITIONS SET';resolveTarget=16;secondaryLabel='INTERRUPT';secondaryValue=campaignCollectionInterrupted+'/5';secondaryComplete=campaignCollectionInterrupted>=5;showOE=true}
 if(/^02-/.test(campaignMission||'')){let s=campaign02Stats(),m=C02[campaignMission];title=m?m.title:'NETWORK';if(campaignMission==='02-01'){resolveTarget=8;secondaryLabel='CONTINUITY';secondaryValue=s.continuity+'/4';secondaryComplete=s.continuity>=4}else if(campaignMission==='02-02'){resolveTarget=10;secondaryLabel='PATTERNS';secondaryValue=s.patterns+'/3';secondaryComplete=s.patterns>=3}else if(campaignMission==='02-03'){resolveTarget=10;secondaryLabel='ASSOC';secondaryValue=s.associations+'/3';secondaryComplete=s.associations>=3&&s.supported>=1}else if(campaignMission==='02-04'){resolveTarget=12;secondaryLabel='SUPPORTED';secondaryValue=s.supported+'/3';secondaryComplete=s.supported>=3&&s.established>=1}else{resolveTarget=14;secondaryLabel='ESTABLISHED';secondaryValue=s.established+'/2';secondaryComplete=s.established>=2}showOE=usesThreatEnvironment()}
 if(ott){ott.textContent='OBJECTIVES // '+title;if(campaignMission==='RETRO'){ott.classList.remove('retro-survive-green','retro-survive-yellow','retro-survive-orange','retro-survive-red');ott.classList.add(c<25?'retro-survive-green':c<50?'retro-survive-yellow':c<75?'retro-survive-orange':'retro-survive-red')}}
 or.textContent=campaignMission==='RETRO'?String(resolved):(campaignMission==='ARCADE'?String(arcadeCorrect):campaignCorrect+'/'+resolveTarget);
 if(osc)osc.style.display=secondaryLabel?'inline-flex':'none';
 if(osl)osl.textContent=secondaryLabel;
 if(oi)oi.textContent=secondaryValue;
 og.textContent=campaignMission==='RETRO'?Math.round(integrity)+'%':(campaignMission==='ARCADE'?Math.round(integrity)+'/0':Math.round(integrity)+'/80');
 if(oec)oec.style.display=showOE?'inline-flex':'none';
 if(oc)oc.textContent=campaignMission==='RETRO'?Math.round(c)+'%':Math.round(campaignCompromise)+'/'+((campaignMission==='01-05'||campaignMission==='02-05')?'50':'60');
 or.parentElement.classList.toggle('complete',campaignMission==='ARCADE'?arcadeStreak>=5:campaignCorrect>=resolveTarget);
 if(oi&&oi.parentElement){oi.parentElement.classList.toggle('complete',secondaryComplete);oi.parentElement.classList.remove('danger')}
 og.parentElement.classList.toggle('complete',integrity>=80);og.parentElement.classList.toggle('danger',integrity<80);
 if(oc&&oc.parentElement){oc.parentElement.classList.toggle('complete',showOE&&campaignCompromise<60);oc.parentElement.classList.toggle('danger',showOE&&campaignCompromise>=50)}
 let od=$('#objDegraded');if(od)od.textContent=cpDegradedCount()+' / 5 // FLOOR '+cpCompromiseFloor()+'%';
 cpRefreshStatusColors();
}
B.forEach(cpRenderBlueSite);$('#active').textContent=T.filter(t=>!t.done).length;$('#cap').textContent=p.cap;$('#isrTop').textContent=displayMode(A.mode);let mb=$('#isrModeBadge');mb.textContent=A.mode==='ISR_SELECTED'?'ISR // CONTROL ACTIVE // SELECT DESTINATION':A.mode==='ENROUTE'?'ISR // ENROUTE':A.mode==='ON_STATION'?'ISR // ON STATION':'ISR // STANDBY';mb.classList.toggle('active',A.mode==='ISR_SELECTED');$('#sites').innerHTML=B.map(b=>`<div class="site ${b.degraded?'degraded':''} ${b.reconstituting?'reconstituting':''}"><div class="row"><span>${b.id}${b.reconstituting?' // RECON '+(b.repairPct||0)+'%':b.degraded?' // DEGRADED':''}</span><b>${Math.round(b.exposure)}%</b></div><div class="meter"><i style="width:${b.reconstituting?(b.repairPct||0):b.exposure}%"></i></div></div>`).join('');const pp=$('#passiveIsrPanel'),pb=$('#passiveDeploy');if(pp)pp.classList.toggle('hidden',!passiveEnabled());if(passiveEnabled()){const pc=$('#passiveCredits'),pn=$('#passiveCount'),ph=$('#passiveHint');if(pc)pc.textContent=passiveCredits;if(pn)pn.textContent=passiveNodes.length+' / '+PASSIVE_MAX;if(pb){const cost=passiveCost(),maxed=passiveNodes.length>=PASSIVE_MAX;pb.textContent=maxed?'NODE LIMIT // 9 / 9':(passiveDeployMode?'CANCEL DEPLOYMENT':'DEPLOY NODE // '+cost);pb.disabled=!running||(campaignMission==='TUTORIAL'&&!(tutorialStep===6||tutorialStep===7))||(!passiveDeployMode&&(maxed||passiveCredits<cost));pb.classList.toggle('deploying',passiveDeployMode)}if(ph)ph.textContent=ewoTargetMode?'EWO TARGETING // SELECT SWEEP ORIGIN':passiveDeployMode?'SELECT A POINT ON THE MAP // NODE FOOTPRINT '+PASSIVE_RADIUS:'Correct +10 // interrupt +10 // NAI: 3 nodes / 4 hex max // SUPPLY '+supplyPackages+'/1';const su=$('#supplyUse');if(su){su.textContent=supplyRepairMode?'CANCEL SUPPLY TARGETING':'SUPPLY // '+supplyPackages+' / 1'+(supplyPackages?' // READY':'');su.disabled=!running||supplyPackages<1||(campaignMission==='TUTORIAL'&&tutorialStep<9);}const ew=$('#ewoSweep');if(ew){ew.textContent=ewoTargetMode?'CANCEL EWO TARGETING':'EWO SWEEP // '+EWO_COST+' // BUY';ew.disabled=!running||(campaignMission==='TUTORIAL'&&tutorialStep!==8)||(!ewoTargetMode&&(passiveCredits<EWO_COST||!T.some(t=>!t.done&&t.type==='UNKNOWN')))}}detail()}function geometry(){let now=performance.now();if(running&&A.mode==='ENROUTE'&&valid(A.dest)&&now-A.lastMove>700&&!stallLogged){stallLogged=true;log('ISR MONITOR // STALL DETECTED')}{const k=activeOA==='VERDANT'?cpVerdantSymbolAspect():1;$('#sensor').setAttribute('transform',`translate(${A.x} ${A.y}) scale(${k} 1)`);$('#asset').setAttribute('transform',`translate(${A.x} ${A.y}) scale(${k} 1)`);}$('#plane').setAttribute('transform',`rotate(${A.heading})`);$('#halo').setAttribute('stroke-opacity',A.mode==='ISR_SELECTED'?'.8':'0');$('#alabel').setAttribute('x',A.x+31);$('#alabel').setAttribute('y',A.y+5);if(valid(A.dest)){ $('#wp').setAttribute('visibility','visible');$('#route').setAttribute('x1',A.x);$('#route').setAttribute('y1',A.y);$('#route').setAttribute('x2',A.dest.x);$('#route').setAttribute('y2',A.dest.y);$('#dest').setAttribute('cx',A.dest.x);$('#dest').setAttribute('cy',A.dest.y)}else $('#wp').setAttribute('visibility','hidden');if(col){$('#beam').setAttribute('visibility','visible');$('#beamLine').setAttribute('x1',A.x);$('#beamLine').setAttribute('y1',A.y);$('#beamLine').setAttribute('x2',col.x);$('#beamLine').setAttribute('y2',col.y)}else $('#beam').setAttribute('visibility','hidden');T.forEach(draw)}function diagnostic(now){if(now-lastDiag<100)return;lastDiag=now;let age=Math.round(now-A.lastMove),stall=running&&A.mode==='ENROUTE'&&valid(A.dest)&&age>700;$('#diagStatus').textContent=stall?'ISR STALL DETECTED':'NOMINAL';$('#diagStatus').classList.toggle('stall',stall);$('#diag1').textContent=`FPS ${C.fps} | RAF ${C.raf} | GAP ${Math.round(C.maxGap)}ms | ERR ${C.errors}`;$('#diag2').textContent=`ISR POINTER ${C.isr} | MAP POINTER ${C.map} | TRACK POINTER ${C.track} | ORDERS ${C.orders}`;$('#diag3').textContent=`MODE ${A.mode} | POS ${A.x.toFixed(1)},${A.y.toFixed(1)} | DEST ${valid(A.dest)?A.dest.x.toFixed(1)+','+A.dest.y.toFixed(1):'--'} | MOVE AGE ${age}ms`;let vv=window.visualViewport,vw=Math.round(window.innerWidth),vh=Math.round(window.innerHeight),vww=vv?Math.round(vv.width):vw,vvh=vv?Math.round(vv.height):vh,vs=vv?vv.scale:1;$('#viewportDiag').textContent=`VIEWPORT // ${vw}x${vh} -> ${vww}x${vvh} | SCALE ${vs.toFixed(2)}`;if(stall&&!stallLogged){stallLogged=true;rec('STALL',`mode=${A.mode} pos=${A.x.toFixed(2)},${A.y.toFixed(2)} dest=${A.dest.x.toFixed(2)},${A.dest.y.toFixed(2)} age=${age} gap=${C.maxGap.toFixed(1)}`)}}function diagText(){return [`CONTACT IMMINENT v0.11.6.45 OA KESTREL / OA VANTAGE CAMPAIGN RUNTIME DIAGNOSTICS`,new Date().toISOString(),`running=${running} phase=${phase} score=${Math.round(score)} integrity=${integrity} compromise=${compromise().toFixed(2)}`,`fps=${C.fps} raf=${C.raf} maxGapMs=${C.maxGap.toFixed(1)} errors=${C.errors}`,`isrClicks=${C.isr} mapClicks=${C.map} trackClicks=${C.track} orders=${C.orders}`,`mode=${A.mode} pos=${A.x.toFixed(2)},${A.y.toFixed(2)} dest=${valid(A.dest)?A.dest.x.toFixed(2)+','+A.dest.y.toFixed(2):'--'} moveAgeMs=${Math.round(performance.now()-A.lastMove)}`,'','ROLLING DEBUG LOG',...dbg].join('\n')}async function copyDiag(){let t=diagText();try{await navigator.clipboard.writeText(t);log('DIAGNOSTICS // COPIED')}catch(e){rec('COPY_FAIL',String(e));let ta=document.createElement('textarea');ta.value=t;document.body.append(ta);ta.select();document.execCommand('copy');ta.remove();log('DIAGNOSTICS // COPIED')}}function saveDiag(){let a=document.createElement('a');a.href=URL.createObjectURL(new Blob([diagText()],{type:'text/plain'}));a.download='contact-imminent-v0.11.6.45-debug.txt';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),(cpFusionActive()?600:1000));log('DIAGNOSTICS // SAVED')}function finish(){if(!running)return;if(/^02-/.test(campaignMission||'')){cpFinishCampaign02(false);return;}if(campaignMission==='01-04'){cpFinish0104('TIMEOUT');return;}if(campaignMission==='01-05'){cpFinish0105('TIMEOUT');return;}running=false;stopCollect();A.dest=null;A.mode='IDLE';let c=compromise();$('#endTitle').textContent=c<60?'CONDITIONS HAVE BEEN SET':'CONDITIONS NOT SET';$('#fs').textContent=Math.max(0,Math.round(score));$('#fr').textContent=resolved;$('#fi').textContent=ints;$('#fc').textContent=Math.round(c)+'%';$('#end').classList.add('show');ui(true)}function loop(now){if(window.CP_PAUSED||window.CP_MENU){last=now;requestAnimationFrame(loop);return;}C.raf++;let gap=now-C.lastRaf;C.lastRaf=now;if(gap>C.maxGap)C.maxGap=gap;C.fpsFrames++;if(now-C.fpsAt>=1000){C.fps=Math.round(C.fpsFrames*1000/(now-C.fpsAt));C.fpsFrames=0;C.fpsAt=now}let dt=Math.min(.05,(now-last)/1000);last=now;if(running){campaignHintTick(now);let elapsed=(now-start)/1000,left=Math.max(0,180-elapsed),np=elapsed<60?1:elapsed<120?2:3;if(campaignMission==='RETRO'){let s=Math.floor(elapsed);$('#clock').textContent=String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0');$('#phase').textContent='SURVIVE';if(compromise()>=99.9){running=false;stopCollect();A.dest=null;A.mode='IDLE';$('#endTitle').textContent='OE LOST // SURVIVED '+$('#clock').textContent;$('#fs').textContent=Math.max(0,Math.round(score));$('#fr').textContent=resolved;$('#fi').textContent=ints;$('#fc').textContent=Math.round(compromise())+'%';$('#end').classList.add('show')}}else if(campaignMission==='ARCADE'){arcadeThreatLevel=1+Math.floor(elapsed/75);if(arcadeThreatLevel!==phase){phase=arcadeThreatLevel;let nm='THREAT LEVEL '+arcadeThreatLevel;$('#phase').textContent='ARCADE // '+nm;banner(nm,1300);sound('level');log(nm)}let s=Math.floor(elapsed);$('#clock').textContent=String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0')}else{if(np!==phase){phase=np;let nm=phase===2?'PHASE II // CONTEST':'PHASE III // DOMINATE';$('#phase').textContent=nm;banner(nm,1300);log(nm)}let s=Math.ceil(left);$('#clock').textContent=String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0')}if(campaignMission!=='ARCADE'&&campaignMission!=='RETRO'&&campaignMission!=='TUTORIAL'&&!/^03-/.test(campaignMission||'')&&left<=0)finish();else{let p=parms();if(campaignMission!=='TUTORIAL'&&!/^03-/.test(campaignMission||'')&&(now-lastSpawn)/1000>=p.gap&&T.filter(t=>!t.done).length<p.cap){spawn();lastSpawn=now}T.forEach(t=>{if(t.done||t.stationary)return;t.x+=t.vx*dt;t.y+=t.vy*dt;if(t.x<35||t.x>865)t.vx*=-1;if(t.y<35||t.y>615)t.vy*=-1});naiTick(now);enemy(dt);cpContestedTick(dt);cpIntelDropTick();reconstitutionTick(now);cpTrackStallGuard();if(A.mode==='ENROUTE'&&valid(A.dest)){let dx=A.dest.x-A.x,dy=A.dest.y-A.y,d=Math.hypot(dx,dy);if(d>2){A.heading=H(dx,dy);let q=Math.min(cpEffectiveISRSpeed()*dt,d),ox=A.x,oy=A.y;A.x+=dx/d*q;A.y+=dy/d*q;if(A.x!==ox||A.y!==oy){A.lastMove=now;stallLogged=false}}else{A.x=A.dest.x;A.y=A.dest.y;A.dest=null;A.mode='ON_STATION';A.lastMove=now;stallLogged=false}}}}verdantSmartTick(dt);cpPriorityNAITick(now);updateTrackMemory(now);networkTick(now);if(/^02-/.test(campaignMission||''))cpCheckCampaign02();geometry();ui();diagnostic(now);requestAnimationFrame(loop)}function supplyTargetFromPoint(p){if(!supplyRepairMode||supplyPackages<1||!valid(p))return false;const candidates=B.filter(b=>b.degraded&&!b.reconstituting).map(b=>({b,d:Math.hypot(b.x-p.x,b.y-p.y)})).sort((a,b)=>a.d-b.d);if(!candidates.length)return false;const hit=candidates[0];if(hit.d>62){cpNotice('SUPPLY TARGETING','SELECT A HIGHLIGHTED DEGRADED SITE','intel');return false;}reconstituteSite(hit.b);return true}
$('#map').addEventListener('pointerdown',e=>{if(!running||!supplyRepairMode)return;const p=point(e);if(supplyTargetFromPoint(p)){e.preventDefault();e.stopImmediatePropagation();}},true);
$('#asset').addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();if(running)acquire()});$('#map').addEventListener('pointerdown',e=>{e.preventDefault();C.map++;rec('MAP_POINTER',`mode=${A.mode}`);if(!running)return;if(passiveDeployMode){passivePlace(point(e));return}if(ewoTargetMode){ewoFire(point(e));return}if(A.mode!=='ISR_SELECTED')return;order(point(e));ui(true)});function actionPointer(el,fn){el.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();fn();requestAnimationFrame(()=>el.blur())});el.addEventListener('click',e=>e.preventDefault())}actionPointer($('#collect'),collect);actionPointer($('#clear'),()=>decide('CLEAR'));actionPointer($('#intercept'),()=>decide('INTERCEPT'));actionPointer($('#passiveDeploy'),passiveToggleDeploy);actionPointer($('#ewoSweep'),ewoSweep);actionPointer($('#supplyUse'),supplyActivate);function deploy(){stopCollect();passiveReset();Object.assign(C,{raf:0,isr:0,map:0,track:0,orders:0,errors:0,lastRaf:performance.now(),maxGap:0,fps:0,fpsFrames:0,fpsAt:performance.now()});dbg=[];rec('DEPLOY','diagnostic session started');T.forEach(t=>{t.el?.remove();t.ring?.remove();t.lkp?.g?.remove()});T=[];sel=null;next=1;score=0;integrity=100;decisionCorrect=0;decisionTotal=0;resolved=0;ints=0;phase=1;campaignStationarySpawned=0;stallLogged=false;Object.assign(A,{x:145,y:510,dest:null,mode:'IDLE',heading:0,lastMove:performance.now()});$('#phase').textContent=campaignMission==='RETRO'?'SURVIVE':campaignMission==='ARCADE'?'ARCADE // THREAT LEVEL 1':campaignMission==='TUTORIAL'?'TRAINING // COMMAND ORIENTATION':'PHASE I // ESTABLISH';$('#log').textContent='';$('#enemyRings').textContent='';let lk=$('#lastKnownPositions');if(lk)lk.textContent='';let df=$('#decisionFeedback');if(df)df.textContent='';$('#end').classList.remove('show');initBlue();running=false;$('#clock').textContent=(campaignMission==='ARCADE'||campaignMission==='RETRO')?'00:00':campaignMission==='TUTORIAL'?'TRAIN':'03:00';let n=campaignMission==='TUTORIAL'?1:5;banner(campaignMission==='TUTORIAL'?'TRAINING ENVIRONMENT':String(n),700);let timer=setInterval(()=>{n--;if(n>0)banner(String(n),700);else{clearInterval(timer);banner(campaignMission==='TUTORIAL'?'TRAINING // SYSTEMS ONLINE':campaignMission==='RETRO'?'SURVIVE':'PREPARE THE OPERATIONAL ENVIRONMENT',1600);setTimeout(()=>{running=true;A.mode='ON_STATION';start=performance.now();lastSpawn=start;A.lastMove=start;if(campaignMission==='01-02'){spawn(false);spawn(true);spawn(true)}
else if(campaignMission==='01-03'||campaignMission==='01-04'||campaignMission==='01-05'||campaignMission==='ARCADE'||/^02-/.test(campaignMission||'')){spawn();spawn();spawn()}
else{spawn(false);spawn(false);spawn(true)}
log(campaignMission==='RETRO'?'MISSION START // CONTACT IMMINENT // RETRO':'MISSION START // CONTACT IMMINENT 0.11.6.39 // OA RUNTIME')},900)}},850);ui(true)}$('#copyDiag').addEventListener('click',copyDiag);$('#saveDiag').addEventListener('click',saveDiag);$('#again').addEventListener('click',deploy);document.addEventListener('dblclick',e=>e.preventDefault(),{passive:false});document.addEventListener('wheel',e=>{if(e.ctrlKey)e.preventDefault()},{passive:false});window.visualViewport?.addEventListener('resize',()=>rec('VIEWPORT',`${Math.round(innerWidth)}x${Math.round(innerHeight)} scale=${visualViewport.scale}`));initBlue();running=false;$('#clock').textContent=(campaignMission==='ARCADE'||campaignMission==='RETRO')?'00:00':campaignMission==='TUTORIAL'?'TRAIN':'03:00';$('#phase').textContent='MISSION STANDBY';ui(true);$('#startMission').addEventListener('click',()=>{$('#startScreen').style.display='none';deploy()});
window.CP_PAUSED=false;window.CP_MENU=true;window.CP_PAUSE_AT=0;
function cpRenderStrategicPriorityNAI(){
 const poly=$('#strategicPriorityNAIPolygon'),label=$('#strategicPriorityNAILabel');if(!poly||!label)return;
 const saved=readGlobalNAIs()[activeOA],pts=saved?.committed&&Array.isArray(saved.points)?saved.points:[];
 if(pts.length<3){poly.setAttribute('points','');poly.classList.add('hidden');label.classList.add('hidden');return;}
 const tactical=pts.map(p=>({x:Math.max(0,Math.min(900,p.x*900)),y:Math.max(0,Math.min(650,p.y*650))}));
 poly.setAttribute('points',tactical.map(p=>p.x+','+p.y).join(' '));poly.classList.remove('hidden');
 const c=polygonCentroid(pts),lx=Math.max(4,Math.min(770,c.x*900-63)),ly=Math.max(4,Math.min(622,c.y*650+12));
 label.setAttribute('transform','translate('+lx+' '+ly+')');label.classList.remove('hidden');
}
let verdantSmartActive=false,verdantSmartLastState='';
const VERDANT_CELL={suspected:0.825,probable:2.2,confirmed:4.4};
function verdantEnsureCells(r){
 if(r.cells?.length)return;
 const seen=new Set();r.cells=[];
 // Collapse the dense route point cloud into ~20px spatial cells. These are collection cells,
 // not route segments: the route remains one object end-to-end.
 for(const p of (r.points||[])){const gx=Math.round(p[0]/25),gy=Math.round(p[1]/25),k=gx+','+gy;if(seen.has(k))continue;seen.add(k);r.cells.push({x:p[0],y:p[1],progress:0,state:'unassessed'})}
}
function verdantCellState(c){return c.progress>=VERDANT_CELL.confirmed?'confirmed':c.progress>=VERDANT_CELL.probable?'probable':c.progress>=VERDANT_CELL.suspected?'suspected':'unassessed'}
function verdantRouteMetrics(r){verdantEnsureCells(r);const n=Math.max(1,r.cells.length),ct={suspected:0,probable:0,confirmed:0,observed:0};for(const c of r.cells){const s=verdantCellState(c);if(s!=='unassessed')ct.observed++;if(s==='suspected')ct.suspected++;if(s==='probable')ct.probable++;if(s==='confirmed')ct.confirmed++}return{...ct,n,coverage:ct.observed/n,probableCoverage:(ct.probable+ct.confirmed)/n,confirmedCoverage:ct.confirmed/n}}
function verdantStateFor(r){const m=verdantRouteMetrics(r);return m.confirmedCoverage>=.72?'confirmed':m.probableCoverage>=.45?'probable':m.coverage>=.15?'suspected':'unassessed'}
function cpRenderVerdantRoutes(){
 const g=$('#verdantRouteNetwork');if(!g)return;g.textContent='';if(activeOA!=='VERDANT')return;
 const cfg=window.CP_VERDANT_MAP?.routeFoundation;if(!cfg)return;const ns='http://www.w3.org/2000/svg';
 // Mobile optimization: one persistent visual image per assessed route. Collection
 // remains cell-based, but the DOM no longer grows with every discovered cell/state.
 cfg.routes.forEach(r=>{verdantEnsureCells(r);const rs=verdantStateFor(r);if(rs==='unassessed')return;const im=document.createElementNS(ns,'image');im.setAttribute('href',r.asset);im.setAttribute('x','0');im.setAttribute('y','0');im.setAttribute('width','900');im.setAttribute('height','650');im.setAttribute('preserveAspectRatio','none');im.setAttribute('class','verdant-smart-route state-'+rs);im.dataset.route=r.id;g.appendChild(im);const tx=document.createElementNS(ns,'text');tx.setAttribute('x',r.label[0]);tx.setAttribute('y',r.label[1]);tx.setAttribute('class','verdant-smart-label state-'+rs);tx.textContent=r.id;g.appendChild(tx)});
}
function verdantResetSmartRoutes(){const cfg=window.CP_VERDANT_MAP?.routeFoundation;if(!cfg)return;cfg.routes.forEach(r=>{verdantEnsureCells(r);r.cells.forEach(c=>{c.progress=0;c.state='unassessed'});r.state='unassessed'});verdantSmartLastState='';cpRenderVerdantRoutes();verdantUpdateHud()}
function verdantUpdateHud(){if(!verdantSmartActive)return;const cfg=window.CP_VERDANT_MAP?.routeFoundation;if(!cfg)return;const counts={unassessed:0,suspected:0,probable:0,confirmed:0};cfg.routes.forEach(r=>counts[verdantStateFor(r)]++);const el=$('#verdantRouteStatus');if(el)el.textContent=`UNASSESSED ${counts.unassessed} // SUSPECTED ${counts.suspected} // PROBABLE ${counts.probable} // CONFIRMED ${counts.confirmed}`;$('#clock').textContent=String(counts.confirmed).padStart(2,'0')+' / 20';}
function verdantSmartTick(dt){if(!verdantSmartActive||activeOA!=='VERDANT')return;const cfg=window.CP_VERDANT_MAP?.routeFoundation;if(!cfg)return;let routesInRange=0,visualChanged=false;const radius=118,r2=radius*radius;
 cfg.routes.forEach(r=>{verdantEnsureCells(r);let hit=false;const before=verdantStateFor(r);for(const c of r.cells){const dx=c.x-A.x,dy=c.y-A.y;if(dx*dx+dy*dy<=r2){hit=true;c.progress+=dt}}if(hit)routesInRange++;const after=verdantStateFor(r);if(after!==before){r.state=after;visualChanged=true;const m=verdantRouteMetrics(r);cpNotice('ROUTE INTELLIGENCE // '+r.id,after.toUpperCase()+' // '+Math.round(m.coverage*100)+'% COVERAGE','intel');log('VERDANT // '+r.id+' // '+after.toUpperCase()+' // '+Math.round(m.coverage*100)+'%')}});
 if(visualChanged)cpRenderVerdantRoutes();const rl=$('#rangeLine');if(rl)rl.textContent='SENSOR // '+routesInRange+' ROUTE'+(routesInRange===1?'':'S')+' // SPATIAL COLLECTION ACTIVE';verdantUpdateHud();}
function cpVerdantRaster(){const im=$('#verdantRaster');if(!im)return;if(activeOA!=='VERDANT'){im.setAttribute('visibility','hidden');im.removeAttribute('href');return}im.setAttribute('href','assets/maps/oa-verdant-overscan.png');im.setAttribute('x','-37.5');im.setAttribute('y','0');im.setAttribute('width','975');im.setAttribute('height','650');im.setAttribute('preserveAspectRatio','none');im.setAttribute('visibility','visible')}
function cpVerdantSymbolAspect(){const map=$('#map');if(activeOA!=='VERDANT'||!map)return 1;const m=map.getScreenCTM?.();if(!m)return 1;const sx=Math.hypot(m.a,m.b),sy=Math.hypot(m.c,m.d);return sx>0&&sy>0?sy/sx:1}
function cpVerdantHexAspect(){
 const map=$('#map'),grid=$('#geometricGrid');if(!map||!grid)return;
 if(activeOA!=='VERDANT'){grid.removeAttribute('transform');return}
 const r=map.getBoundingClientRect();if(!(r.width>0&&r.height>0))return;
 // VERDANT deliberately stretches the unified 900x650 tactical world so raster,
 // routes, ISR and collection stay registered. Counter-scale ONLY the cosmetic
 // hex lattice in X so its screen-space hexagons remain regular.
 const sx=r.width/900,sy=r.height/650,k=sy/sx;
 grid.setAttribute('transform','translate(450 325) scale('+k+' 1) translate(-450 -325)');
 const sk=cpVerdantSymbolAspect();
 for(const b of B){if(b?.el)b.el.setAttribute('transform',`translate(${b.x} ${b.y}) scale(${sk} 1)`)}
}
window.ciVerdantHexAspect=cpVerdantHexAspect;
window.addEventListener('resize',()=>requestAnimationFrame(cpVerdantHexAspect),{passive:true});
window.visualViewport?.addEventListener('resize',()=>requestAnimationFrame(cpVerdantHexAspect),{passive:true});
function cpSetOAVisual(oa){const w=$('#mapWrap'),brand=document.querySelector('.brand-block small'),map=$('#map');if(!w)return;const retroDisplay=oa==='RETRO';activeOA=['VANTAGE','VERDANT','MIRAGE','TEMPEST','ARCTIC'].includes(oa)?oa:'KESTREL';['vantage','verdant','mirage','tempest'].forEach(k=>w.classList.toggle('oa-'+k,activeOA===k.toUpperCase()));if(map)map.setAttribute('preserveAspectRatio',activeOA==='VERDANT'?'none':'xMidYMid meet');if(brand)brand.textContent=retroDisplay?'v0.11.6.45 // OA RETRO // BLANK CANVAS // RETRO CONTACT IMMINENT':'v0.11.6.45 // OA '+activeOA+' // GEOMETRIC GRID';initBlue();cpVerdantRaster();cpRenderStrategicPriorityNAI();cpRenderVerdantRoutes();requestAnimationFrame(()=>{window.ciPhysicalPhoneMapFit?.();cpVerdantHexAspect();requestAnimationFrame(()=>{window.ciPhysicalPhoneMapFit?.();cpVerdantHexAspect()})});}
function cpVantagePreview(){clearTutorialState();running=false;stopCollect();window.CP_MENU=true;cpSetOAVisual('VANTAGE');$('#campaignMenu').classList.add('hidden');$('#mainMenu').classList.add('hidden');$('#vantagePreviewHud').classList.remove('hidden');$('#phase').textContent='OA VANTAGE // PREVIEW';$('#clock').textContent='--:--';}
function cpExitVantagePreview(){$('#vantagePreviewHud').classList.add('hidden');cpSetOAVisual('KESTREL');cpCampaignMenu();}
function cpVerdantPreview(){clearTutorialState();stopCollect();campaignMission='03-01';window.CP_MENU=false;window.CP_PAUSED=false;cpSetOAVisual('VERDANT');$('#campaignMenu').classList.add('hidden');$('#mainMenu').classList.add('hidden');$('#verdantPreviewHud').classList.remove('hidden');$('#phase').textContent='03-01 // ROUTES // LIVE COLLECTION';verdantSmartActive=true;verdantResetSmartRoutes();running=true;Object.assign(A,{x:145,y:510,dest:null,mode:'ON_STATION',heading:0,lastMove:performance.now()});start=performance.now();last=performance.now();geometry();ui(true);cpNotice('VERDANT SMART ROUTES','FLY THE ISR FOOTPRINT ALONG ROUTES // ONLY OBSERVED TERRAIN REVEALS','intel');}
function cpExitVerdantPreview(){verdantSmartActive=false;running=false;stopCollect();A.dest=null;A.mode='IDLE';$('#verdantPreviewHud').classList.add('hidden');campaignMenuOA='VERDANT';cpCampaignMenu();}
function cpMiragePreview(){clearTutorialState();running=false;stopCollect();window.CP_MENU=true;cpSetOAVisual('MIRAGE');$('#campaignMenu').classList.add('hidden');$('#mainMenu').classList.add('hidden');$('#miragePreviewHud').classList.remove('hidden');$('#phase').textContent='OA MIRAGE // PREVIEW';$('#clock').textContent='--:--';}
function cpExitMiragePreview(){$('#miragePreviewHud').classList.add('hidden');campaignMenuOA='MIRAGE';cpCampaignMenu();}
function cpTempestPreview(){clearTutorialState();running=false;stopCollect();window.CP_MENU=true;cpSetOAVisual('TEMPEST');$('#campaignMenu').classList.add('hidden');$('#mainMenu').classList.add('hidden');$('#tempestPreviewHud').classList.remove('hidden');$('#phase').textContent='OA TEMPEST // PREVIEW';$('#clock').textContent='--:--';}
function cpExitTempestPreview(){$('#tempestPreviewHud').classList.add('hidden');campaignMenuOA='TEMPEST';cpCampaignMenu();}
function cpHideCampaignOverlays(){['campaignMenu','briefing0101','briefing0102','briefing0103','briefing0104','briefing0105','campaignResult'].forEach(id=>$('#'+id).classList.add('hidden'))}
let campaignMenuOA='KESTREL';function selectCampaignOA(oa){campaignMenuOA=['VANTAGE','VERDANT','MIRAGE','TEMPEST','ARCTIC'].includes(oa)?oa:'KESTREL';document.querySelectorAll('[data-campaign-oa]').forEach(b=>b.classList.toggle('selected',b.dataset.campaignOa===campaignMenuOA));$('#campaignPaneKestrel')?.classList.toggle('hidden',campaignMenuOA!=='KESTREL');$('#campaignPaneVantage')?.classList.toggle('hidden',campaignMenuOA!=='VANTAGE');$('#campaignPaneVerdant')?.classList.toggle('hidden',campaignMenuOA!=='VERDANT');$('#campaignPaneMirage')?.classList.toggle('hidden',campaignMenuOA!=='MIRAGE');$('#campaignPaneTempest')?.classList.toggle('hidden',campaignMenuOA!=='TEMPEST')}
function cpCampaignMenu(){cpSetOAVisual(campaignMenuOA);selectCampaignOA(campaignMenuOA);cpRefreshCampaign02();clearTutorialState();musicSetMode('menu');cpRefreshCampaign();window.CP_MENU=true;window.CP_PAUSED=false;running=false;stopCollect();$('#mainMenu').classList.add('hidden');$('#pauseMenu').classList.add('hidden');$('#briefing0101').classList.add('hidden');$('#briefing0102').classList.add('hidden');$('#briefing0103').classList.add('hidden');$('#briefing0104').classList.add('hidden');$('#briefing0105').classList.add('hidden');$('#campaignResult').classList.add('hidden');$('#campaignMenu').classList.remove('hidden')}
function cpBrief0101(){$('#campaignMenu').classList.add('hidden');$('#briefing0101').classList.remove('hidden')}
function cpUnlocked0102(){
  if(devAccessActive())return true;
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
function cpUnlocked0103(){return devAccessActive()||localStorage.getItem('ci-c01-0103-unlocked')==='1'}
function cpBrief0103(){if(!cpUnlocked0103())return;$('#campaignMenu').classList.add('hidden');$('#briefing0103').classList.remove('hidden')}
function cpUnlocked0104(){return devAccessActive()||localStorage.getItem('ci-c01-0104-unlocked')==='1'}
function cpBrief0104(){if(!cpUnlocked0104())return;$('#campaignMenu').classList.add('hidden');$('#briefing0104').classList.remove('hidden')}
function cpUnlocked0105(){return devAccessActive()||localStorage.getItem('ci-c01-0105-unlocked')==='1'}
function cpBrief0105(){if(!cpUnlocked0105())return;$('#campaignMenu').classList.add('hidden');$('#briefing0105').classList.remove('hidden')}
const tutorialIntelSeen=new Set();function clearTutorialState(){tutorialStep=0;tutorialIntelSeen.clear();const g=$('#tutorialGuide');if(g)g.classList.add('hidden');const n=$('#tutorialNext');if(n){n.textContent='CONTINUE';n.classList.add('hidden')} }
function missionTransition(title,sub,fn){clearTutorialState();document.querySelectorAll('.gameoverlay').forEach(el=>el.classList.add('hidden'));const m=$('#missionLoad');$('#missionLoadTitle').textContent=title||'OA KESTREL';$('#missionLoadSub').textContent=sub||'ESTABLISHING TACTICAL PICTURE';m.classList.remove('hidden');m.classList.add('show');window.CP_MENU=true;setTimeout(()=>{m.classList.remove('show');m.classList.add('hidden');window.CP_MENU=false;fn()},3000)}
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
const C02={
 '02-01':{title:'MEMORY',sub:'MAINTAIN CONTACT CONTINUITY',need:'Reacquire 4 persistent contacts and resolve 8 correctly.',pass:s=>s.continuity>=4&&campaignCorrect>=8},
 '02-02':{title:'PATTERN',sub:'DEVELOP RECURRING LOCATION PATTERNS',need:'Develop patterns on 3 contacts and resolve 10 correctly.',pass:s=>s.patterns>=3&&campaignCorrect>=10},
 '02-03':{title:'ASSOCIATION',sub:'OBSERVE CONTACT RELATIONSHIPS',need:'Record 3 co-location events with at least 1 supported relationship.',pass:s=>s.associations>=3&&s.supported>=1&&campaignCorrect>=10},
 '02-04':{title:'NETWORK',sub:'BUILD THE OBSERVED NETWORK',need:'Develop 3 supported relationships and 1 established relationship while holding OE below 60%.',pass:s=>s.supported>=3&&s.established>=1&&campaignCorrect>=12&&campaignCompromise<60},
 '02-05':{title:'DISRUPTION',sub:'RESOLVE THE NETWORK UNDER PRESSURE',need:'Establish 2 relationships, resolve 14 contacts, maintain 80% integrity, and finish OE below 50%.',pass:s=>s.established>=2&&campaignCorrect>=14&&integrity>=80&&campaignCompromise<50}
};
function c02Unlocked(id){if(devAccessActive())return true;let n=Number(id.slice(-1));if(n===1)return localStorage.getItem('ci-c01-complete')==='1';return localStorage.getItem('ci-c02-0'+(n-1)+'-complete')==='1'}
function cpRefreshCampaign02(){Object.keys(C02).forEach(id=>{let b=$('#mission'+id.replace('-','')),s=$('#mission'+id.replace('-','')+'Status');if(!b)return;let u=c02Unlocked(id),done=localStorage.getItem('ci-c02-'+id.slice(-2)+'-complete')==='1';b.disabled=!u;b.classList.toggle('available',u);if(s)s.textContent=done?'COMPLETE':u?'AVAILABLE':'LOCKED'})}
function cpBrief02(id){if(!C02[id]||!c02Unlocked(id))return;let m=C02[id];$('#campaignMenu').classList.add('hidden');$('#briefing02').classList.remove('hidden');$('#briefing02Kicker').textContent='CAMPAIGN 02 // OA VANTAGE';$('#briefing02Title').textContent=id+' // '+m.title;$('#briefing02Copy').textContent=m.sub;$('#briefing02Need').textContent=m.need;$('#briefing02Begin').dataset.mission=id}
function cpBegin02(id){let m=C02[id];if(!m)return;missionTransition(id+' // '+m.title,'OA VANTAGE // LOADING OPERATION',()=>cpBegin02Now(id))}
function cpBegin02Now(id){musicSetMode('mission');cpSetOAVisual('VANTAGE');campaignMission=id;campaignIds=0;campaignCorrect=0;campaignThreatResolved=0;campaignNonThreatResolved=0;campaignCollectionInterrupted=0;campaignCompromise=0;campaignFinished=false;networkAssociations.clear();networkLastPair.clear();campaign02AssocEvents=0;campaign02PatternTracks.clear();campaign02ContinuityTracks.clear();resetCampaignHints();cpIntelDropReset();cpHideCampaignOverlays();$('#briefing02').classList.add('hidden');window.CP_MENU=false;window.CP_PAUSED=false;$('#startScreen').style.display='none';deploy();last=performance.now()}
function resetCampaignHints(){campaignHintSig='';campaignHintAt=performance.now();campaignHintLevel=0}
function campaignHintTick(now){if(campaignMission!=='02-05'||!running||campaignFinished)return;const s=campaign02Stats(),sig=[campaignCorrect,s.established,campaignCollectionInterrupted,Math.round(campaignCompromise/5)].join(':');if(sig!==campaignHintSig){campaignHintSig=sig;campaignHintAt=now;campaignHintLevel=0;return}const idle=now-campaignHintAt;if(idle>65000&&campaignHintLevel<2){campaignHintLevel=2;cpNotice('ANALYST ASSIST // DISRUPTION','Build repeated co-location into ESTABLISHED links, then interrupt hostile collection while keeping OE below 50%.','intel')}else if(idle>35000&&campaignHintLevel<1){campaignHintLevel=1;cpNotice('ANALYST ASSIST','Reobserve contacts around shared VANTAGE hotspots. Repeated co-location strengthens association confidence.','intel')}}
function cpCheckCampaign02(){if(!isCampaign02()||campaignFinished)return;if(usesThreatEnvironment()&&campaignCompromise>=60){cpFinishCampaign02(false);return}let m=C02[campaignMission],s=campaign02Stats();if(m&&m.pass(s))cpFinishCampaign02(true)}
function cpFinishCampaign02(pass){if(campaignFinished)return;campaignFinished=true;running=false;stopCollect();window.CP_MENU=true;let id=campaignMission,m=C02[id],s=campaign02Stats();if(pass){localStorage.setItem('ci-c02-'+id.slice(-2)+'-complete','1');if(id==='02-05')localStorage.setItem('ci-c02-complete','1');cpRefreshCampaign02()}$('#resultTitle').textContent=pass?'NETWORK PICTURE ADVANCED':'NETWORK PICTURE INCOMPLETE';$('#resultBody').innerHTML='OA VANTAGE // '+id+' '+m.title+'<br><br>CONTACTS RESOLVED&nbsp;&nbsp;'+campaignCorrect+'<br>CONTINUITY TRACKS&nbsp;&nbsp;&nbsp;'+s.continuity+'<br>PATTERN TRACKS&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+s.patterns+'<br>ASSOCIATION EVENTS&nbsp;&nbsp;&nbsp;'+s.associations+'<br>SUPPORTED LINKS&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+s.supported+'<br>ESTABLISHED LINKS&nbsp;&nbsp;&nbsp;&nbsp;'+s.established+'<br>INTEL INTEGRITY&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+Math.round(integrity)+'%';$('#resultContinue').classList.toggle('hidden',!pass);$('#resultRetry').classList.toggle('hidden',pass);$('#campaignResult').classList.remove('hidden');outcomeFeedback(pass)}
function tutorialGuide(step,title,text,button=false){tutorialStep=step;if(campaignMission==='TUTORIAL'&&(step===2||step===3||step===4)&&!T.some(t=>!t.done)){spawn(false);const q=T[T.length-1];if(q){q.truth='FRIENDLY';q.type='UNKNOWN';q.x=430;q.y=315;q.vx=.25;q.vy=.1}}const g=$('#tutorialGuide');g.classList.remove('hidden');$('#tutorialTitle').textContent=title;$('#tutorialText').textContent=text;const n=$('#tutorialNext');n.textContent=step>=12?'RETURN TO MENU':'CONTINUE';n.classList.toggle('hidden',!button)}
function tutorialMenu(){window.CP_MENU=true;clearTutorialState();$('#mainMenu').classList.add('hidden');$('#tutorialBriefing').classList.remove('hidden')}
function tutorialBegin(){missionTransition('TRAINING // OA KESTREL','FULL SYSTEMS WALKTHROUGH',tutorialBeginNow)}
function tutorialBeginNow(){musicSetMode('mission');campaignMission='TUTORIAL';campaignFinished=false;$('#phase').textContent='TRAINING // SYSTEMS';cpHideCampaignOverlays();$('#tutorialBriefing').classList.add('hidden');window.CP_MENU=false;window.CP_PAUSED=false;$('#startScreen').style.display='none';deploy();setTimeout(()=>{if(campaignMission!=='TUTORIAL')return;trainingPrime();spawn(false);const t=T[T.length-1];if(t){t.truth='FRIENDLY';t.x=430;t.y=315;t.vx=.25;t.vy=.1;}tutorialGuide(1,'1 // ACQUIRE ISR-01','Select ISR-01 on the map. Guidance advances only after you complete each action.')},2100)}
function tutorialAdvance(event){if(campaignMission!=='TUTORIAL')return;if(tutorialStep===1&&event==='acquire')tutorialGuide(2,'2 // MOVE ISR-01','Tap near the UNKNOWN to order ISR-01. Put the contact inside the collection footprint.');else if(tutorialStep===2&&event==='order')tutorialGuide(3,'3 // COLLECT','Select the UNKNOWN and press COLLECT. Complete collection to identify it.');else if(tutorialStep===3&&event==='classified')tutorialGuide(4,'4 // DISPOSITION','This contact is FRIENDLY. Press CLEAR. Threats are INTERCEPTED.');else if(tutorialStep===4&&event==='decision'){intelDropActive=true;intelDropOffered=true;intelDropExpires=performance.now()+3600000;$('#intelDrop').classList.remove('hidden');tutorialGuide(5,'5 // INTEL REPORTING','Use all three report options: MITIGATE, EXPLOIT and SUPPLY. The panel will remain available until each has been demonstrated.');}else if(tutorialStep===5&&event==='intel'){if(tutorialIntelSeen.size<3){intelDropActive=true;intelDropExpires=performance.now()+3600000;$('#intelDrop').classList.remove('hidden');tutorialGuide(5,'5 // INTEL REPORTING',`Reporting demonstrated ${tutorialIntelSeen.size}/3. Use the remaining MITIGATE, EXPLOIT or SUPPLY option.`);}else{intelDropActive=false;$('#intelDrop').classList.add('hidden');passiveCredits=9999;tutorialGuide(6,'6 // PASSIVE ISR','Deploy one Passive ISR node from the right rail, then place it on the map.');ui(true)}}else if(tutorialStep===6&&event==='passive'){tutorialGuide(7,'7 // BUILD AN NAI','Deploy two more nodes near the first. Three nodes within four hexes must form an NAI.');}else if(tutorialStep===7&&event==='nai'){for(const pos of [[760,500],[720,155],[190,520]]){spawn(false);const q=T[T.length-1];if(q){q.type='UNKNOWN';q.truth='HOSTILE';q.x=pos[0];q.y=pos[1];q.vx=0;q.vy=0;}}tutorialGuide(8,'8 // EWO SWEEP','Buy EWO SWEEP, then select an origin on the map and fire the radial collection wave. Three training UNKNOWNs have been added for the sweep.');ui(true);}else if(tutorialStep===8&&event==='ewo'){supplyPackages=1;trainingPrime();tutorialGuide(9,'9 // BLUFOR SUPPLY','Two BLUFOR sites are degraded in red. Activate SUPPLY, then select a red base directly on the map.');ui(true)}else if(tutorialStep===9&&event==='supply-target'){tutorialGuide(10,'10 // RECONSTITUTION','Repair is underway. Watch the site exposure fall and wait for the site to return blue/OPERATIONAL.');}else if(tutorialStep===10&&event==='repair-complete'){tutorialGuide(11,'11 // SUPPORT ECONOMY','Normal play earns ISR Credits from correct decisions and interrupted collection. Passive ISR is persistent; EWO is a repeatable tactical purchase.',true)} }
function tutorialSupportNext(){if(campaignMission!=='TUTORIAL')return;if(tutorialStep===11){tutorialGuide(12,'TRAINING COMPLETE','Core command, collection, reporting, Passive ISR, NAI, EWO and BLUFOR reconstitution complete.',true)}else if(tutorialStep>=12){clearTutorialState();cpShowMenu()}}
function arcadeHide(){const a=$('#arcadeBriefing'),r=$('#arcadeResult');if(a)a.classList.add('hidden');if(r)r.classList.add('hidden')}
function setArcadeOA(oa){const allowed=devAccessActive()?['KESTREL','VANTAGE','VERDANT','MIRAGE','TEMPEST']:['KESTREL','VANTAGE'];arcadeOA=allowed.includes(oa)?oa:'KESTREL';localStorage.setItem(ARCADE_OA_KEY,arcadeOA);document.querySelectorAll('[data-arcade-oa]').forEach(b=>b.classList.toggle('selected',b.dataset.arcadeOa===arcadeOA));let l=$('#arcadeOALabel');if(l)l.textContent=arcadeOA}
function arcadeBegin(){missionTransition('ARCADE // OA '+arcadeOA,'ENDLESS OPERATION // LOADING',arcadeBeginNow)}
function arcadeBeginNow(){musicSetMode('mission');cpSetOAVisual(arcadeOA);campaignMission='ARCADE';campaignIds=0;campaignCorrect=0;campaignThreatResolved=0;campaignNonThreatResolved=0;campaignCollectionInterrupted=0;campaignCompromise=0;campaignFinished=false;arcadeStreak=0;arcadeBestStreak=0;arcadeCorrect=0;arcadeWrong=0;arcadeThreatLevel=1;cpIntelDropReset();arcadeHide();cpHideCampaignOverlays();window.CP_MENU=false;window.CP_PAUSED=false;$('#startScreen').style.display='none';deploy();arcadeStart=performance.now();last=performance.now()}
function arcadeFinish(reason){if(campaignMission!=='ARCADE'||campaignFinished)return;campaignFinished=true;playAsset(missionFailAudio,.95,'sfx');banner('ARCADE FAILURE // '+reason,2600);running=false;stopCollect();window.CP_MENU=true;const w=$('#hostileCollectionWarning');if(w)w.classList.add('hidden');const elapsed=Math.max(0,Math.floor((performance.now()-(arcadeStart||start))/1000)),acc=(arcadeCorrect+arcadeWrong)?Math.round(arcadeCorrect*100/(arcadeCorrect+arcadeWrong)):100;$('#arcadeResultTitle').textContent=reason;$('#arcadeResultBody').innerHTML='OA '+activeOA+' // ARCADE AAR<br><br>SCORE&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+Math.max(0,Math.round(score))+'<br>SURVIVAL TIME&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+String(Math.floor(elapsed/60)).padStart(2,'0')+':'+String(elapsed%60).padStart(2,'0')+'<br>THREAT LEVEL&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+arcadeThreatLevel+'<br>CONTACTS RESOLVED&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+resolved+'<br>THREATS INTERCEPTED&nbsp;&nbsp;&nbsp;&nbsp;'+ints+'<br>COLLECTION INTERRUPTED&nbsp;&nbsp;'+campaignCollectionInterrupted+'<br>DECISION ACCURACY&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+acc+'%<br>LONGEST STREAK&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+arcadeBestStreak+'<br>SITES DEGRADED&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+cpDegradedCount()+' / 5<br>FINAL OE COMPROMISE&nbsp;&nbsp;&nbsp;&nbsp;'+Math.round(campaignCompromise)+'%';$('#arcadeResult').classList.remove('hidden');$('#arcadeResult').classList.add('loss-flash')}
function arcadeMenu(){clearTutorialState();musicSetMode('menu');setArcadeOA(arcadeOA);cpHideCampaignOverlays();$('#mainMenu').classList.add('hidden');$('#arcadeResult').classList.add('hidden');$('#arcadeBriefing').classList.remove('hidden');refreshArcadeIntelAssist();window.CP_MENU=true}
function cpShowMenu(){
  clearTutorialState();musicSetMode('menu');rotateCommandBackground();
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

function refreshCommandProfile(){
  const c1=localStorage.getItem('ci-c01-complete')==='1',c2=localStorage.getItem('ci-c02-complete')==='1',done=(c1?1:0)+(c2?1:0);
  const a=$('#profileC01'),b=$('#profileC02'),tier=$('#profileTier'),bar=$('#profileProgress'),txt=$('#profileProgressText'),isr=$('#profileISR');
  if(a)a.textContent=c1?'COMPLETE':'IN PROGRESS';if(b)b.textContent=c2?'COMPLETE':'IN PROGRESS';
  if(tier)tier.textContent=done>=2?'NETWORK QUALIFIED':done===1?'OPERATIONAL':'FOUNDATION';if(bar)bar.style.width=(done*50)+'%';if(txt)txt.textContent='OPERATIONAL EXPERIENCE // '+done+' / 2 CAMPAIGNS COMPLETE';
  if(isr){const names={'#dce5e8':'TACTICAL WHITE','#4da3ff':'ISR BLUE','#d8a83e':'COMMAND GOLD','#55d66b':'FIELD GREEN'};isr.textContent=visualSettings.isrSymbol+' // '+(names[visualSettings.isrColor]||'CUSTOM');}
  normalizeISRCapability();const cap=$('#profileCapability'),help=$('#profileCapabilityHelp');const capNames={STANDARD:'STANDARD SENSOR',WIDE:'WIDE AREA COLLECTION',RAPID:'RAPID TASKING'};if(cap)cap.textContent=capNames[isrCapability]||capNames.STANDARD;document.querySelectorAll('[data-isr-capability]').forEach(btn=>{const k=btn.dataset.isrCapability,u=isrCapabilityUnlocked(k);btn.disabled=!u;btn.classList.toggle('selected',k===isrCapability);});if(help)help.textContent=(c1&&c2)?'ALL CURRENT PACKAGES UNLOCKED // ONE ACTIVE AT A TIME':(!c1&&!c2?'COMPLETE CAMPAIGNS TO UNLOCK ISR CAPABILITIES':(!c1?'COMPLETE CAMPAIGN 01 TO UNLOCK WIDE AREA':'COMPLETE CAMPAIGN 02 TO UNLOCK RAPID TASKING'));
}
function setISRCapability(k){if(!isrCapabilityUnlocked(k))return;isrCapability=k;localStorage.setItem(ISR_CAPABILITY_KEY,k);refreshCommandProfile();sound('click')}
function rotateCommandBackground(){const maps=["url('assets/maps/oa-kestrel-overscan.png')","url('assets/maps/oa-vantage-overscan.png')","url('assets/maps/oa-verdant-overscan.png')","url('assets/maps/oa-mirage-overscan.png')","url('assets/maps/oa-tempest-overscan.png')"];const raw=sessionStorage.getItem('ci-command-bg-index');let last=raw===null?-1:Number(raw),next;if(last<0||!Number.isFinite(last))next=Math.floor(Math.random()*maps.length);else if(maps.length>1){const choices=maps.map((_,i)=>i).filter(i=>i!==last);next=choices[Math.floor(Math.random()*choices.length)]}else next=0;sessionStorage.setItem('ci-command-bg-index',String(next));const home=document.getElementById('mainMenu');if(home)home.style.setProperty('--ci-command-bg',maps[next]);document.documentElement.style.setProperty('--ci-command-bg',maps[next])}
function openCommandProfile(){refreshCommandProfile();$('#mainMenu').classList.add('hidden');$('#commandProfileMenu').classList.remove('hidden')}
function closeCommandProfile(){$('#commandProfileMenu').classList.add('hidden');$('#mainMenu').classList.remove('hidden')}


// v0.10.0 // GLOBAL FOUNDATION PROTOTYPE
let globalSelectedOA=null;
const GLOBAL_OA={KESTREL:'MOUNTAIN-COAST // FOUNDATION',VANTAGE:'URBAN-INDUSTRIAL // NETWORK',VERDANT:'TROPICAL RIVER-COAST // PREVIEW',MIRAGE:'ARID ROUTE-LOGISTICS // PREVIEW',TEMPEST:'MARITIME ARCHIPELAGO // PREVIEW',ARCTIC:'POLARIS // POLAR ARCHIPELAGO / ICE / MOUNTAIN CORRIDORS',RETRO:'LEGACY SIMULATION // CONTACT IMMINENT // NO TERRAIN'};
function openGlobal(){window.CP_MENU=true;document.body.classList.remove('retro-mode');$('#objectiveTracker')?.classList.remove('retro-objectives-hidden');globalSelectedOA=null;$('#mainMenu').classList.add('hidden');$('#globalMenu').classList.remove('hidden');document.querySelectorAll('[data-global-oa]').forEach(b=>b.classList.remove('selected'));$('#globalOAName').textContent='NO OA SELECTED';$('#globalOADetail').textContent='Select an operational-area marker on the globe to inspect the regional picture.';$('#globalCampaign').style.display='';$('#globalArcade').style.display='';$('#globalTraining').style.display='';$('#globalPlanNAI').style.display='';$('#globalCampaign').disabled=true;$('#globalArcade').disabled=true;$('#globalTraining').disabled=true;$('#globalPlanNAI').disabled=true;}
function closeGlobal(){$('#globalMenu').classList.add('hidden');$('#mainMenu').classList.remove('hidden');rotateCommandBackground();}
function selectGlobalOA(oa){globalSelectedOA=oa;document.querySelectorAll('[data-global-oa]').forEach(b=>b.classList.toggle('selected',b.dataset.globalOa===oa));const num=GLOBAL_OA_NUM[oa]||'--';$('#globalOAName').textContent=oa==='RETRO'?'R0 // RETRO STATION // CONTACT IMMINENT':'OA '+num+' // '+(oa==='ARCTIC'?'POLARIS':oa);$('#globalOADetail').textContent=(GLOBAL_OA[oa]||oa)+' // REGIONAL PICTURE AVAILABLE';const retro=oa==='RETRO',campaignReady=['KESTREL','VANTAGE'].includes(oa)||(devAccessActive()&&['VERDANT','MIRAGE','TEMPEST'].includes(oa)),arcadeReady=['KESTREL','VANTAGE','RETRO'].includes(oa);$('#globalCampaign').style.display=retro?'none':'';$('#globalTraining').style.display=retro?'none':'';$('#globalPlanNAI').style.display=retro?'none':'';$('#globalPlanNAI').classList.toggle('hidden',retro);$('#globalArcade').style.display='';$('#globalCampaign').disabled=!campaignReady;$('#globalArcade').disabled=!arcadeReady;$('#globalTraining').disabled=oa==='ARCTIC';$('#globalPlanNAI').disabled=retro;refreshGlobalTaskingDetail(oa);}

let globalActivityContext=false;
function cpRetroGrid(){const g=$('#retroGrid');if(!g)return;g.textContent='';const ns='http://www.w3.org/2000/svg';for(let x=45;x<900;x+=45){let l=document.createElementNS(ns,'line');l.setAttribute('x1',x);l.setAttribute('y1','0');l.setAttribute('x2',x);l.setAttribute('y2','650');l.setAttribute('class',x%225===0?'retro-major':'retro-minor');g.appendChild(l)}for(let y=45;y<650;y+=45){let l=document.createElementNS(ns,'line');l.setAttribute('x1','0');l.setAttribute('y1',y);l.setAttribute('x2','900');l.setAttribute('y2',y);l.setAttribute('class',y%225===0?'retro-major':'retro-minor');g.appendChild(l)}}
function cpRetroExit(){running=false;stopCollect();A.dest=null;A.mode='IDLE';window.CP_PAUSED=false;window.CP_MENU=false;$('#pauseMenu')?.classList.add('hidden');$('#utilityMenu')?.classList.add('hidden');$('#settingsMenu')?.classList.add('hidden');campaignMission=null;document.body.classList.remove('retro-mode');cpSetOAVisual('KESTREL');openGlobal();}
function globalRetroActivity(){missionTransition('RETRO // ARCADE','BLANK CANVAS // LOADING OPERATION',globalRetroActivityNow)}function globalRetroActivityNow(){campaignMission='RETRO';globalActivityContext=false;document.body.classList.add('retro-mode');cpSetOAVisual('RETRO');cpRetroGrid();window.CP_MENU=false;window.CP_PAUSED=false;$('#startScreen').style.display='none';$('#objectiveTracker')?.classList.remove('retro-objectives-hidden');deploy();last=performance.now();}
function globalCampaignActivity(){
 if(!globalSelectedOA)return;
 if(globalSelectedOA==='RETRO'){globalRetroActivity();return;}
 const implemented=['KESTREL','VANTAGE'].includes(globalSelectedOA);
 const devPreview=devAccessActive()&&['VERDANT','MIRAGE','TEMPEST'].includes(globalSelectedOA);
 if(!implemented&&!devPreview)return;
 globalActivityContext=true;
 campaignMenuOA=globalSelectedOA;
 closeGlobal();
 cpCampaignMenu();
 document.body.classList.add('global-context-campaign');
}
function globalArcadeActivity(){
 if(globalSelectedOA==='RETRO'){globalRetroActivity();return;}
 if(!globalSelectedOA||!['KESTREL','VANTAGE'].includes(globalSelectedOA))return;
 globalActivityContext=true;setArcadeOA(globalSelectedOA);closeGlobal();arcadeMenu();document.body.classList.add('global-context-arcade');
}
function globalTrainingActivity(){if(!globalSelectedOA||globalSelectedOA==='ARCTIC')return;closeGlobal();tutorialMenu();}
function setGlobalRate(rate){document.documentElement.style.setProperty('--global-rate',rate);document.querySelectorAll('[data-global-rate]').forEach(b=>b.classList.toggle('selected',Number(b.dataset.globalRate)===rate));$('#globalRateLabel').textContent=rate+'X';const mult=rate;document.querySelectorAll('.orbit').forEach((el,i)=>{const base=[24,34,19][i]||24;el.style.animationDuration=(base/mult)+'s'});}
// v0.11.6.11 // LEAN LIVE GLOBAL GLOBE
const GLOBAL_OA_GEO={KESTREL:{lat:42,lon:-118},VANTAGE:{lat:35,lon:20},VERDANT:{lat:-8,lon:-48},MIRAGE:{lat:22,lon:58},TEMPEST:{lat:-24,lon:143},ARCTIC:{lat:73,lon:28}};
const GLOBAL_OA_DISPLAY={KESTREL:'KESTREL',VANTAGE:'VANTAGE',VERDANT:'VERDANT',MIRAGE:'MIRAGE',TEMPEST:'TEMPEST',ARCTIC:'POLARIS',RETRO:'RETRO STATION'};
const GLOBAL_OA_NUM={KESTREL:'01',VANTAGE:'02',VERDANT:'03',MIRAGE:'04',TEMPEST:'05',ARCTIC:'06',RETRO:'R0'};
const GLOBAL_ORBITS=[{inc:52,raan:-28,phase:15,period:24},{inc:67,raan:66,phase:142,period:34},{inc:31,raan:154,phase:254,period:19}];const GLOBAL_RETRO_ORBIT={inc:43,raan:112,phase:205,period:42};
let globalGlobe={yaw:-18,pitch:0,zoom:1,drag:false,pointer:null,lastX:0,lastY:0,moved:false,lastT:performance.now(),orbitT:0};
function globeRad(d){return d*Math.PI/180} function globeVec(lat,lon){const a=globeRad(lat),o=globeRad(lon);return{x:Math.cos(a)*Math.sin(o),y:-Math.sin(a),z:Math.cos(a)*Math.cos(o)}} function globeRotate(v){let y=globeRad(globalGlobe.yaw),p=globeRad(globalGlobe.pitch),cy=Math.cos(y),sy=Math.sin(y),cp=Math.cos(p),sp=Math.sin(p),x=v.x*cy+v.z*sy,z=-v.x*sy+v.z*cy;return{x,y:v.y*cp-z*sp,z:v.y*sp+z*cp}} function globeProject(lat,lon,cx,cy,r){const q=globeRotate(globeVec(lat,lon));return{x:cx+q.x*r,y:cy+q.y*r,z:q.z}}
function initGlobalGlobe(){const c=$('#globalGlobeCanvas'),ov=$('#globalGlobeOverlay');if(!c||!ov||c.dataset.ready)return;c.dataset.ready='1';Object.keys(GLOBAL_OA_GEO).forEach(oa=>{const b=document.createElement('button');b.className='globe-oa-marker';b.dataset.oa=oa;b.innerHTML='<i class="oa-anchor"></i><svg class="oa-leader-svg" viewBox="0 0 96 28" preserveAspectRatio="none" aria-hidden="true"><polyline points="0,14 30,2 96,2"/></svg><span class="oa-callout-text">'+GLOBAL_OA_NUM[oa]+' '+(oa==='ARCTIC'?'POLARIS':oa)+'</span>';b.addEventListener('click',()=>{if(!globalGlobe.moved)selectGlobalOA(oa)});ov.appendChild(b)});GLOBAL_ORBITS.forEach((o,i)=>{const d=document.createElement('div');d.className='globe-sat globe-sat-'+i;d.textContent='SAT-'+String(i+1).padStart(2,'0');ov.appendChild(d)});const rs=document.createElement('button');rs.className='globe-retro-station';rs.type='button';rs.setAttribute('aria-label','RETRO legacy simulation station');rs.innerHTML='<i></i><span>R0 // RETRO</span>';rs.addEventListener('click',()=>{if(!globalGlobe.moved)selectGlobalOA('RETRO')});ov.appendChild(rs);c.addEventListener('wheel',e=>{e.preventDefault();const dir=Math.sign(e.deltaY);globalGlobe.zoom=Math.max(.78,Math.min(1.55,globalGlobe.zoom-dir*.055));},{passive:false});c.addEventListener('pointerdown',e=>{globalGlobe.drag=true;globalGlobe.pointer=e.pointerId;globalGlobe.lastX=e.clientX;globalGlobe.lastY=e.clientY;globalGlobe.moved=false;c.setPointerCapture?.(e.pointerId)});c.addEventListener('pointermove',e=>{if(!globalGlobe.drag||e.pointerId!==globalGlobe.pointer)return;let dx=e.clientX-globalGlobe.lastX,dy=e.clientY-globalGlobe.lastY;if(Math.abs(dx)+Math.abs(dy)>2)globalGlobe.moved=true;globalGlobe.yaw+=dx*.34;globalGlobe.pitch=Math.max(-70,Math.min(70,globalGlobe.pitch-dy*.28));globalGlobe.lastX=e.clientX;globalGlobe.lastY=e.clientY});const end=e=>{if(e.pointerId===globalGlobe.pointer){globalGlobe.drag=false;globalGlobe.pointer=null;setTimeout(()=>globalGlobe.moved=false,0)}};c.addEventListener('pointerup',end);c.addEventListener('pointercancel',end)}
function globeOrbitLatLon(o,t){const u=globeRad((o.phase+t*360/o.period)%360),inc=globeRad(o.inc),raan=globeRad(o.raan);let x=Math.cos(u),y=Math.sin(u)*Math.sin(inc),z=Math.sin(u)*Math.cos(inc),cr=Math.cos(raan),sr=Math.sin(raan),X=x*cr+z*sr,Z=-x*sr+z*cr;return{lat:-Math.asin(Math.max(-1,Math.min(1,y)))*180/Math.PI,lon:Math.atan2(X,Z)*180/Math.PI}}
const GLOBAL_MOBILE=matchMedia('(pointer:coarse)').matches||/iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
const GLOBAL_RENDER_DPR=GLOBAL_MOBILE?Math.min(1.25,window.devicePixelRatio||1):Math.min(2,window.devicePixelRatio||1);
const GLOBAL_FRAME_MS=GLOBAL_MOBILE?1000/30:0;
let globalLastFrame=0;
function drawGlobalSpace(now){}
const GLOBAL_EARTH_TEXTURE_SRC='assets/maps/global-notional-earth-surface.jpg';
let globalSurfaceGL=null;
function initGlobalSurfaceGL(){if(globalSurfaceGL)return globalSurfaceGL;const c=$('#globalSurfaceCanvas');if(!c)return null;const gl=c.getContext('webgl',{alpha:true,antialias:true,premultipliedAlpha:false});if(!gl)return null;const vs=`attribute vec3 aPos;attribute vec2 aUV;uniform float uYaw;uniform float uPitch;uniform float uScale;varying vec2 vUV;varying float vZ;void main(){float cy=cos(uYaw),sy=sin(uYaw),cp=cos(uPitch),sp=sin(uPitch);vec3 q=vec3(aPos.x*cy+aPos.z*sy,aPos.y,-aPos.x*sy+aPos.z*cy);q=vec3(q.x,q.y*cp+q.z*sp,-q.y*sp+q.z*cp);vUV=aUV;vZ=q.z;gl_Position=vec4(q.x*uScale,q.y*uScale,-q.z*.5,1.0);}`;const fs=`precision mediump float;uniform sampler2D uTex;varying vec2 vUV;varying float vZ;void main(){if(vZ<-0.002)discard;vec4 c=texture2D(uTex,vUV);gl_FragColor=vec4(c.rgb,1.0);}`;function sh(type,src){const x=gl.createShader(type);gl.shaderSource(x,src);gl.compileShader(x);return x}const pr=gl.createProgram();gl.attachShader(pr,sh(gl.VERTEX_SHADER,vs));gl.attachShader(pr,sh(gl.FRAGMENT_SHADER,fs));gl.linkProgram(pr);const verts=[],idx=[],latN=64,lonN=128;for(let iy=0;iy<=latN;iy++){const lat=Math.PI/2-iy*Math.PI/latN,cl=Math.cos(lat),yy=-Math.sin(lat);for(let ix=0;ix<=lonN;ix++){const lon=-Math.PI+ix*Math.PI*2/lonN;verts.push(cl*Math.sin(lon),yy,cl*Math.cos(lon),ix/lonN,iy/latN)}}for(let iy=0;iy<latN;iy++)for(let ix=0;ix<lonN;ix++){let p=iy*(lonN+1)+ix,q=p+lonN+1;idx.push(p,q,p+1,p+1,q,q+1)}const vb=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,vb);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(verts),gl.STATIC_DRAW);const ib=gl.createBuffer();gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,ib);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(idx),gl.STATIC_DRAW);const tex=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,tex);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.REPEAT);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);const img=new Image();img.onload=()=>{gl.bindTexture(gl.TEXTURE_2D,tex);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,0);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGB,gl.RGB,gl.UNSIGNED_BYTE,img);globalSurfaceGL.ready=true};img.src=GLOBAL_EARTH_TEXTURE_SRC;globalSurfaceGL={c,gl,pr,vb,ib,tex,count:idx.length,ready:false};return globalSurfaceGL}
function drawGlobalSurfaceGL(W,H,r){const o=initGlobalSurfaceGL();if(!o)return;const {c,gl,pr,vb,ib,tex}=o;if(c.width!==W||c.height!==H){c.width=W;c.height=H}gl.viewport(0,0,W,H);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);if(!o.ready)return;gl.useProgram(pr);gl.bindBuffer(gl.ARRAY_BUFFER,vb);const ap=gl.getAttribLocation(pr,'aPos'),au=gl.getAttribLocation(pr,'aUV');gl.enableVertexAttribArray(ap);gl.vertexAttribPointer(ap,3,gl.FLOAT,false,20,0);gl.enableVertexAttribArray(au);gl.vertexAttribPointer(au,2,gl.FLOAT,false,20,12);gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,ib);gl.uniform1f(gl.getUniformLocation(pr,'uYaw'),globeRad(globalGlobe.yaw));gl.uniform1f(gl.getUniformLocation(pr,'uPitch'),globeRad(globalGlobe.pitch));gl.uniform1f(gl.getUniformLocation(pr,'uScale'),r/(Math.min(W,H)/2));gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,tex);gl.uniform1i(gl.getUniformLocation(pr,'uTex'),0);gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LEQUAL);gl.drawElements(gl.TRIANGLES,o.count,gl.UNSIGNED_SHORT,0)}
function drawGlobalGlobe(now){drawGlobalSpace(now);const c=$('#globalGlobeCanvas'),wrap=$('#globalEarthWrap'),ov=$('#globalGlobeOverlay');if(!c||!wrap||!ov)return;initGlobalGlobe();const rect=wrap.getBoundingClientRect(),dpr=GLOBAL_RENDER_DPR,logical=Math.max(2,Math.round(Math.min(rect.width,rect.height)*dpr)),pad=1.72,W=Math.round(logical*pad),H=Math.round(logical*pad);if(c.width!==W||c.height!==H){c.width=W;c.height=H}const ctx=c.getContext('2d'),cx=W/2,cy=H/2,r=logical*.40*globalGlobe.zoom;ctx.clearRect(0,0,W,H);drawGlobalSurfaceGL(W,H,r);
 // Lightweight atmosphere + terminator only. No city lights, cloud fields, storms, or aurora in this isolation build.
 ctx.save();ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.clip();const sunX=cx+r*.58,sunY=cy-r*.10,term=ctx.createRadialGradient(sunX,sunY,r*.10,sunX,sunY,r*1.30);term.addColorStop(0,'rgba(118,194,214,.035)');term.addColorStop(.48,'rgba(4,14,20,.025)');term.addColorStop(.64,'rgba(0,4,10,.30)');term.addColorStop(.82,'rgba(0,2,7,.62)');term.addColorStop(1,'rgba(0,1,5,.78)');ctx.fillStyle=term;ctx.fillRect(cx-r,cy-r,r*2,r*2);ctx.restore();let atm=ctx.createRadialGradient(cx,cy,r*.91,cx,cy,r*1.075);atm.addColorStop(0,'rgba(85,181,215,0)');atm.addColorStop(.72,'rgba(93,191,224,.075)');atm.addColorStop(.9,'rgba(116,211,238,.16)');atm.addColorStop(1,'rgba(116,211,238,0)');ctx.beginPath();ctx.arc(cx,cy,r*1.08,0,Math.PI*2);ctx.fillStyle=atm;ctx.fill();ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.strokeStyle='rgba(143,218,235,.42)';ctx.lineWidth=1.5*dpr;ctx.stroke();
 const rate=Number(getComputedStyle(document.documentElement).getPropertyValue('--global-rate')||1.5),dt=Math.min(.05,(now-globalGlobe.lastT)/1000);globalGlobe.lastT=now;if(!globalGlobe.drag)globalGlobe.yaw-=dt*.8;globalGlobe.orbitT+=dt*rate;const ovRect=ov.getBoundingClientRect(),sx=ovRect.width/W,sy=ovRect.height/H;Object.entries(GLOBAL_OA_GEO).forEach(([oa,ll])=>{let q=globeProject(ll.lat,ll.lon,cx,cy,r),el=ov.querySelector('[data-oa="'+oa+'"]');if(el){el.style.left=(q.x*sx)+'px';el.style.top=(q.y*sy)+'px';el.classList.toggle('callout-left',q.x<cx);el.classList.toggle('callout-right',q.x>=cx);el.classList.toggle('backside',q.z<=0);el.classList.toggle('selected',globalSelectedOA===oa)}});GLOBAL_ORBITS.forEach((o,i)=>{let ll=globeOrbitLatLon(o,globalGlobe.orbitT),q=globeProject(ll.lat,ll.lon,cx,cy,r),el=ov.querySelector('.globe-sat-'+i);if(el){el.style.left=(q.x*sx)+'px';el.style.top=(q.y*sy)+'px';el.classList.toggle('backside',q.z<=0)}});{let ll=globeOrbitLatLon(GLOBAL_RETRO_ORBIT,globalGlobe.orbitT),q=globeProject(ll.lat,ll.lon,cx,cy,r),el=ov.querySelector('.globe-retro-station');if(el){el.style.left=(q.x*sx)+'px';el.style.top=(q.y*sy)+'px';el.classList.toggle('backside',q.z<=0);el.classList.toggle('selected',globalSelectedOA==='RETRO')}}}
function globalGlobeFrame(now){const visible=!$('#globalMenu')?.classList.contains('hidden');if(visible&&(!GLOBAL_FRAME_MS||now-globalLastFrame>=GLOBAL_FRAME_MS)){globalLastFrame=now;drawGlobalGlobe(now)}requestAnimationFrame(globalGlobeFrame)} requestAnimationFrame(globalGlobeFrame);
const GLOBAL_DESCENT_IMAGE={KESTREL:'assets/maps/oa-kestrel-overscan.png',VANTAGE:'assets/maps/oa-vantage-overscan.png',VERDANT:'assets/maps/oa-verdant-overscan.png',MIRAGE:'assets/maps/oa-mirage-overscan.png',TEMPEST:'assets/maps/oa-tempest-overscan.png',ARCTIC:'assets/maps/oa-arctic-basemap.png'};
const GLOBAL_MAP_IMAGE={KESTREL:'assets/maps/oa-kestrel-basemap.png',VANTAGE:'assets/maps/oa-vantage-basemap.png',VERDANT:'assets/maps/oa-verdant-basemap.png',MIRAGE:'assets/maps/oa-mirage-basemap.png',TEMPEST:'assets/maps/oa-tempest-basemap.png',ARCTIC:'assets/maps/oa-arctic-basemap.png'};
function resetGlobalOAEntryOverlays(){['#mainMenu','#globalMenu','#globalPlanning','#campaignMenu'].forEach(sel=>$(sel)?.classList.add('hidden'));['#vantagePreviewHud','#verdantPreviewHud','#miragePreviewHud','#tempestPreviewHud'].forEach(sel=>$(sel)?.classList.add('hidden'));}
function enterSelectedGlobalOA(oa){resetGlobalOAEntryOverlays();if(oa==='VERDANT'){cpVerdantPreview();return}if(oa==='MIRAGE'){cpMiragePreview();return}if(oa==='TEMPEST'){cpTempestPreview();return}cpCampaignMenu();selectCampaignOA(oa);}
let globalDescentTimer=0;
function beginGlobalDescent(oa,destination='oa'){const layer=$('#globalDescent'),earth=$('#globalDescentEarth'),region=$('#globalDescentRegion'),label=$('#globalDescentLabel'),copy=layer?.querySelector('.global-descent-copy small');const finish=()=>destination==='planning'?openGlobalPlanningDirect():enterSelectedGlobalOA(oa);if(!layer||!earth){finish();return;}clearTimeout(globalDescentTimer);label.textContent='OA '+({'KESTREL':'01','VANTAGE':'02','VERDANT':'03','MIRAGE':'04','TEMPEST':'05','ARCTIC':'06'}[oa]||'--')+' // '+(oa==='ARCTIC'?'POLARIS':oa);if(copy)copy.textContent=destination==='planning'?'DESCENDING TO COLLECTION PLANNING LAYER':'DESCENDING THROUGH COLLECTION LAYER';earth.style.backgroundImage="url('"+GLOBAL_DESCENT_IMAGE[oa]+"')";if(region)region.style.backgroundImage="linear-gradient(rgba(2,7,10,.05),rgba(2,7,10,.05)),url('"+GLOBAL_MAP_IMAGE[oa]+"')";layer.classList.remove('hidden','run');layer.classList.toggle('to-planning',destination==='planning');layer.setAttribute('aria-hidden','false');void layer.offsetWidth;layer.classList.add('run');globalDescentTimer=setTimeout(()=>{layer.classList.add('hidden');layer.classList.remove('run','to-planning');layer.setAttribute('aria-hidden','true');finish();},3000);}
function openSelectedGlobalOA(){if(!globalSelectedOA)return;enterSelectedGlobalOA(globalSelectedOA);}

const GLOBAL_NAI_KEY='ci-global-priority-nai-v2';
const GLOBAL_NAI_MAX_AREA=.04;
let globalPlanningPoints=[],globalPlanningCommitted=false,globalPlanningDrag=-1;
function readGlobalNAIs(){try{return JSON.parse(localStorage.getItem(GLOBAL_NAI_KEY)||'{}')||{}}catch(e){return {}}}
function polygonArea(pts){if(pts.length<3)return 0;let a=0;for(let i=0;i<pts.length;i++){const p=pts[i],q=pts[(i+1)%pts.length];a+=p.x*q.y-q.x*p.y;}return Math.abs(a)/2;}
function polygonCentroid(pts){if(!pts.length)return null;let x=0,y=0;pts.forEach(p=>{x+=p.x;y+=p.y});return{x:x/pts.length,y:y/pts.length};}
function planningAreaFraction(){return polygonArea(globalPlanningPoints);}
function orient(a,b,c){return (b.x-a.x)*(c.y-a.y)-(b.y-a.y)*(c.x-a.x);}
function onSeg(a,b,c){return Math.min(a.x,b.x)-1e-9<=c.x&&c.x<=Math.max(a.x,b.x)+1e-9&&Math.min(a.y,b.y)-1e-9<=c.y&&c.y<=Math.max(a.y,b.y)+1e-9;}
function segCross(a,b,c,d){const o1=orient(a,b,c),o2=orient(a,b,d),o3=orient(c,d,a),o4=orient(c,d,b),eps=1e-9;if(((o1>eps&&o2<-eps)||(o1<-eps&&o2>eps))&&((o3>eps&&o4<-eps)||(o3<-eps&&o4>eps)))return true;if(Math.abs(o1)<=eps&&onSeg(a,b,c))return true;if(Math.abs(o2)<=eps&&onSeg(a,b,d))return true;if(Math.abs(o3)<=eps&&onSeg(c,d,a))return true;if(Math.abs(o4)<=eps&&onSeg(c,d,b))return true;return false;}
function planningSelfIntersects(){const p=globalPlanningPoints,n=p.length;if(n<4)return false;for(let i=0;i<n;i++){const i2=(i+1)%n;for(let j=i+1;j<n;j++){const j2=(j+1)%n;if(i===j||i2===j||j2===i)continue;if(segCross(p[i],p[i2],p[j],p[j2]))return true;}}return false;}
function planningValid(){return globalPlanningPoints.length>=3&&globalPlanningPoints.length<=4&&!planningSelfIntersects()&&planningAreaFraction()>0.00005&&planningAreaFraction()<=GLOBAL_NAI_MAX_AREA;}
function refreshGlobalTaskingDetail(oa){const p=readGlobalNAIs()[oa];if(!p)return;$('#globalOADetail').textContent=GLOBAL_OA[oa]+' // PRIORITY NAI TASKED // '+(p.points?.length||0)+'-POINT AREA // REGIONAL PICTURE AVAILABLE';}
function openGlobalPlanning(){if(!globalSelectedOA)return;openGlobalPlanningDirect();}
function openGlobalPlanningDirect(){if(!globalSelectedOA)return;const oa=globalSelectedOA,saved=readGlobalNAIs()[oa];globalPlanningPoints=(saved?.points||[]).map(p=>({x:p.x,y:p.y}));globalPlanningCommitted=!!saved?.committed;globalPlanningDrag=-1;$('#planningOAName').textContent='OA '+({'KESTREL':'01','VANTAGE':'02','VERDANT':'03','MIRAGE':'04','TEMPEST':'05','ARCTIC':'06'}[oa])+' // '+(oa==='ARCTIC'?'POLARIS':oa);$('#planningMap').style.backgroundImage="linear-gradient(rgba(4,10,13,.08),rgba(4,10,13,.08)),url('"+GLOBAL_MAP_IMAGE[oa]+"')";$('#globalPlanning').classList.remove('hidden');renderGlobalPlanning();}
function closeGlobalPlanning(){$('#globalPlanning').classList.add('hidden');globalPlanningDrag=-1;}
function eventPlanningPoint(e){const r=$('#planningMap').getBoundingClientRect();return{x:Math.max(0,Math.min(1,(e.clientX-r.left)/r.width)),y:Math.max(0,Math.min(1,(e.clientY-r.top)/r.height))};}
function placeGlobalNAI(e){if(!globalSelectedOA||globalPlanningCommitted||globalPlanningDrag>=0||globalPlanningPoints.length>=4||e.target.closest?.('.planning-vertex'))return;globalPlanningPoints.push(eventPlanningPoint(e));renderGlobalPlanning();}
function startPlanningDrag(e,i){if(globalPlanningCommitted)return;e.preventDefault();e.stopPropagation();globalPlanningDrag=i;e.currentTarget.setPointerCapture?.(e.pointerId);}
function movePlanningDrag(e){if(globalPlanningDrag<0||globalPlanningCommitted)return;globalPlanningPoints[globalPlanningDrag]=eventPlanningPoint(e);renderGlobalPlanning();}
function endPlanningDrag(){globalPlanningDrag=-1;}
function renderGlobalPlanning(){const poly=$('#planningNAIPolygon'),vg=$('#planningNAIVertices'),pts=globalPlanningPoints,area=planningAreaFraction(),cross=planningSelfIntersects(),valid=planningValid(),over=pts.length>=3&&area>GLOBAL_NAI_MAX_AREA;poly.setAttribute('points',pts.map(p=>`${p.x*900},${p.y*650}`).join(' '));poly.classList.toggle('hidden',pts.length<2);poly.classList.toggle('invalid',over||cross);poly.classList.toggle('committed',globalPlanningCommitted);vg.innerHTML='';pts.forEach((p,i)=>{const ns='http://www.w3.org/2000/svg',g=document.createElementNS(ns,'g');g.setAttribute('class','planning-vertex'+(globalPlanningCommitted?' committed':''));g.setAttribute('transform',`translate(${p.x*900} ${p.y*650})`);g.innerHTML=`<circle r="18" class="planning-vertex-hit"></circle><circle r="7" class="planning-vertex-dot"></circle><text x="0" y="-13" text-anchor="middle">${i+1}</text>`;g.addEventListener('pointerdown',e=>startPlanningDrag(e,i));vg.appendChild(g);});const c=polygonCentroid(pts);$('#planningCoord').textContent=c?'CENTROID // '+String(Math.round(c.x*900)).padStart(3,'0')+' / '+String(Math.round(c.y*650)).padStart(3,'0'):'CENTROID // --- / ---';$('#planningVertexCount').textContent=pts.length+' / 4';$('#planningArea').textContent=(pts.length<3?'0':Math.round(area/GLOBAL_NAI_MAX_AREA*100))+'%';$('#planningArea').classList.toggle('planning-invalid',over||cross);$('#planningCommit').disabled=!valid||globalPlanningCommitted;$('#planningUndo').disabled=!pts.length||globalPlanningCommitted;$('#planningRevise').classList.toggle('hidden',!globalPlanningCommitted);if(globalPlanningCommitted){$('#planningStatus').textContent='COMMITTED';$('#planningPrompt').textContent='PRIORITY NAI // COLLECTION TASKED';}else if(cross){$('#planningStatus').textContent='INVALID GEOMETRY';$('#planningPrompt').textContent='INVALID GEOMETRY // EDGES MAY NOT CROSS';}else if(over){$('#planningStatus').textContent='AREA EXCEEDED';$('#planningPrompt').textContent='AUTHORIZED AREA EXCEEDED // REDUCE POLYGON';}else if(valid){$('#planningStatus').textContent='READY';$('#planningPrompt').textContent='COLLECTION AREA VALID // COMMIT WHEN READY';}else if(pts.length){const need=Math.max(0,3-pts.length);$('#planningStatus').textContent='DRAFT';$('#planningPrompt').textContent=need?'DEFINE AREA OF INTELLIGENCE INTEREST // '+need+' MORE POINT'+(need===1?'':'S')+' REQUIRED':'OPTIONAL FOURTH POINT // OR COMMIT';}else{$('#planningStatus').textContent='NOT TASKED';$('#planningPrompt').textContent='DEFINE AREA OF INTELLIGENCE INTEREST // 3-4 CONTROL POINTS';}}
function undoGlobalPlanningPoint(){if(globalPlanningCommitted||!globalPlanningPoints.length)return;globalPlanningPoints.pop();renderGlobalPlanning();}
function clearGlobalPlanning(){globalPlanningPoints=[];globalPlanningCommitted=false;if(globalSelectedOA){const all=readGlobalNAIs();delete all[globalSelectedOA];localStorage.setItem(GLOBAL_NAI_KEY,JSON.stringify(all));$('#globalOADetail').textContent=GLOBAL_OA[globalSelectedOA]+' // REGIONAL PICTURE AVAILABLE';if(activeOA===globalSelectedOA)cpRenderStrategicPriorityNAI();}renderGlobalPlanning();}
function reviseGlobalPlanning(){if(!globalSelectedOA)return;globalPlanningCommitted=false;renderGlobalPlanning();}
function commitGlobalPlanning(){if(!globalSelectedOA||!planningValid())return;globalPlanningCommitted=true;const all=readGlobalNAIs();all[globalSelectedOA]={points:globalPlanningPoints.map(p=>({x:p.x,y:p.y})),committed:true,updated:Date.now()};localStorage.setItem(GLOBAL_NAI_KEY,JSON.stringify(all));renderGlobalPlanning();refreshGlobalTaskingDetail(globalSelectedOA);if(activeOA===globalSelectedOA)cpRenderStrategicPriorityNAI();}
let planningSuppressClick=false;
const planningMapEl=$('#planningMap');if(planningMapEl){planningMapEl.addEventListener('pointermove',e=>{if(globalPlanningDrag>=0){planningSuppressClick=true;movePlanningDrag(e);}});planningMapEl.addEventListener('click',e=>{if(planningSuppressClick){planningSuppressClick=false;return;}if(e.target.closest?.('.planning-vertex'))return;placeGlobalNAI(e);});}window.addEventListener('pointerup',()=>{endPlanningDrag();setTimeout(()=>{planningSuppressClick=false},0)});window.addEventListener('pointercancel',()=>{endPlanningDrag();planningSuppressClick=false});


let settingsReturn='main';function openSettings(from){settingsReturn=from||'main';$('#settingsMenu').classList.remove('hidden');if(settingsReturn==='pause')$('#pauseMenu').classList.add('hidden');else $('#mainMenu').classList.add('hidden');applyAudioSettings();refreshDevAccessUI()}function closeSettings(){$('#settingsMenu').classList.add('hidden');if(settingsReturn==='pause')$('#pauseMenu').classList.remove('hidden');else $('#mainMenu').classList.remove('hidden')}[['musicSlider','music'],['uiSlider','ui'],['sfxSlider','sfx']].forEach(([id,k])=>{const el=$('#'+id);if(el)el.addEventListener('input',e=>setAudioLevel(k,e.target.value))});[['gridOpacitySlider','gridOpacity'],['gridWeightSlider','gridWeight']].forEach(([id,k])=>$('#'+id)?.addEventListener('input',e=>saveVisualSetting(k,e.target.value)));$('#gridColorSelect')?.addEventListener('change',e=>saveVisualSetting('gridColor',e.target.value));$('#isrColorSelect')?.addEventListener('change',e=>saveVisualSetting('isrColor',e.target.value));$('#isrSymbolSelect')?.addEventListener('change',e=>saveVisualSetting('isrSymbol',e.target.value));$('#settingsBtn').addEventListener('click',()=>openSettings('main'));$('#commandProfileBtn')?.addEventListener('click',openCommandProfile);$('#commandProfileBack')?.addEventListener('click',closeCommandProfile);document.querySelectorAll('[data-isr-capability]').forEach(b=>b.addEventListener('click',()=>setISRCapability(b.dataset.isrCapability)));$('#pauseSettingsBtn').addEventListener('click',()=>openSettings('pause'));$('#settingsBack').addEventListener('click',closeSettings);
$('#devAccessUnlock')?.addEventListener('click',unlockDevAccess);
$('#devAccessCode')?.addEventListener('keydown',e=>{if(e.key==='Enter')unlockDevAccess()});
$('#devModeOn')?.addEventListener('click',()=>setDevMode(true));
$('#devModeOff')?.addEventListener('click',()=>setDevMode(false));applyAudioSettings();installMenuButtonAudio();
document.querySelectorAll('[data-campaign-oa]').forEach(b=>b.addEventListener('click',()=>selectCampaignOA(b.dataset.campaignOa)));document.querySelectorAll('[data-intel-assist]').forEach(b=>b.addEventListener('click',()=>setArcadeIntelAssist(b.dataset.intelAssist)));refreshArcadeIntelAssist();
$('#tutorialBtn').addEventListener('click',tutorialMenu);$('#tutorialBegin').addEventListener('click',tutorialBegin);$('#tutorialBack').addEventListener('click',()=>{$('#tutorialBriefing').classList.add('hidden');$('#mainMenu').classList.remove('hidden')});$('#tutorialNext').addEventListener('click',tutorialSupportNext);$('#campaignBtn').addEventListener('click',cpCampaignMenu);$('#vantagePreviewBtn').addEventListener('click',cpVantagePreview);$('#vantagePreviewExit').addEventListener('click',cpExitVantagePreview);$('#verdantPreviewBtn').addEventListener('click',cpVerdantPreview);$('#verdantPreviewExit').addEventListener('click',cpExitVerdantPreview);$('#miragePreviewBtn').addEventListener('click',cpMiragePreview);$('#miragePreviewExit').addEventListener('click',cpExitMiragePreview);$('#tempestPreviewBtn').addEventListener('click',cpTempestPreview);$('#tempestPreviewExit').addEventListener('click',cpExitTempestPreview);$('#arcadeBtn').addEventListener('click',arcadeMenu);$('#arcadeBegin').addEventListener('click',arcadeBegin);$('#arcadeBack').addEventListener('click',()=>{$('#arcadeBriefing').classList.add('hidden');if(globalActivityContext){document.body.classList.remove('global-context-arcade');globalActivityContext=false;openGlobal();if(globalSelectedOA)selectGlobalOA(globalSelectedOA);}else $('#mainMenu').classList.remove('hidden')});$('#arcadeRedeploy').addEventListener('click',arcadeBegin);$('#arcadeMenuBtn').addEventListener('click',()=>{arcadeHide();cpShowMenu()});$('#mission0101').addEventListener('click',cpBrief0101);$('#mission0102').addEventListener('click',cpBrief0102);$('#mission0103').addEventListener('click',cpBrief0103);$('#mission0104').addEventListener('click',cpBrief0104);$('#mission0105').addEventListener('click',cpBrief0105);$('#campaignBack').addEventListener('click',()=>{$('#campaignMenu').classList.add('hidden');if(globalActivityContext){document.body.classList.remove('global-context-campaign');globalActivityContext=false;openGlobal();if(globalSelectedOA)selectGlobalOA(globalSelectedOA);}else $('#mainMenu').classList.remove('hidden')});$('#briefBack').addEventListener('click',()=>{$('#briefing0101').classList.add('hidden');$('#campaignMenu').classList.remove('hidden')});$('#briefBack0102').addEventListener('click',()=>{$('#briefing0102').classList.add('hidden');$('#campaignMenu').classList.remove('hidden')});$('#briefBack0103').addEventListener('click',()=>{$('#briefing0103').classList.add('hidden');$('#campaignMenu').classList.remove('hidden')});$('#briefBack0104').addEventListener('click',()=>{$('#briefing0104').classList.add('hidden');$('#campaignMenu').classList.remove('hidden')});$('#briefBack0105').addEventListener('click',()=>{$('#briefing0105').classList.add('hidden');$('#campaignMenu').classList.remove('hidden')});$('#begin0101').addEventListener('click',cpBegin0101);$('#begin0102').addEventListener('click',cpBegin0102);$('#begin0103').addEventListener('click',cpBegin0103);$('#begin0104').addEventListener('click',cpBegin0104);$('#begin0105').addEventListener('click',cpBegin0105);$('#intelMitigate').addEventListener('click',()=>cpIntelDropChoose('MITIGATE'));$('#intelExploit').addEventListener('click',()=>cpIntelDropChoose('EXPLOIT'));$('#intelSupply').addEventListener('click',()=>cpIntelDropChoose('SUPPLY'));$('#resultRetry').addEventListener('click',()=>/^02-/.test(campaignMission||'')?cpBegin02(campaignMission):(campaignMission==='01-05'?cpBegin0105():(campaignMission==='01-04'?cpBegin0104():(campaignMission==='01-03'?cpBegin0103():(campaignMission==='01-02'?cpBegin0102():cpBegin0101())))));$('#resultContinue').addEventListener('click',cpCampaignMenu);
$('#pauseBtn').addEventListener('click',()=>cpSetPause(!window.CP_PAUSED));$('#muteBtn').addEventListener('click',()=>{masterMuted=!masterMuted;localStorage.setItem('ci-audio-muted',masterMuted?'1':'0');localStorage.setItem('ci-audio-mute-explicit','1');applyAudioSettings();if(!masterMuted){audioUnlock();musicSetMode((running&&!window.CP_MENU)?'mission':'menu')}});
$('#resumeBtn').addEventListener('click',()=>cpSetPause(false));
$('#restartBtn').addEventListener('click',()=>{if(!confirm('Restart this mission? Current mission progress will be reset.'))return;window.CP_PAUSED=false;$('#pauseMenu').classList.add('hidden');if(campaignMission==='ARCADE')arcadeBegin();else{deploy();last=performance.now()}});$('#pauseUtilitiesBtn')?.addEventListener('click',()=>{$('#pauseMenu').classList.add('hidden');$('#utilityMenu').classList.remove('hidden')});$('#utilityBack')?.addEventListener('click',()=>{$('#utilityMenu').classList.add('hidden');$('#pauseMenu').classList.remove('hidden')});
$('#abortBtn').addEventListener('click',()=>{campaignMission==='RETRO'?cpRetroExit():(campaignMission==='ARCADE'?cpShowMenu():(campaignMission?cpCampaignMenu():cpShowMenu()))});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!window.CP_MENU&&running){e.preventDefault();cpSetPause(!window.CP_PAUSED)}});

document.querySelectorAll('[data-arcade-oa]').forEach(b=>b.addEventListener('click',()=>setArcadeOA(b.dataset.arcadeOa)));
['0201','0202','0203','0204','0205'].forEach(n=>{let b=$('#mission'+n);if(b)b.addEventListener('click',()=>cpBrief02('02-'+n.slice(-2)))});
$('#briefing02Back')?.addEventListener('click',()=>{$('#briefing02').classList.add('hidden');cpCampaignMenu()});
$('#briefing02Begin')?.addEventListener('click',e=>cpBegin02(e.currentTarget.dataset.mission));

const eventPanel=$('#eventPanel'),devPanel=$('#devPanel');if(eventPanel){eventPanel.open=true;$('#utilityEventHost')?.appendChild(eventPanel)}if(devPanel){devPanel.open=false;$('#utilityDevHost')?.appendChild(devPanel)}applyVisualSettings();applyAudioSettings();refreshDevAccessUI();cpRefreshCampaign();cpRefreshCampaign02();setArcadeOA(arcadeOA);cpShowMenu();(function bootSequence(){const splash=$('#bootSplash'),bar=$('#bootLoadBar'),pct=$('#bootPct'),minBoot=1800,t0=performance.now();try{backgroundMusic.volume=.34*audioLevels.music*(masterMuted?0:1);const p=backgroundMusic.play();if(p&&p.catch)p.catch(()=>{})}catch(e){}const critical=[GLOBAL_EARTH_TEXTURE_SRC,'assets/maps/global-deep-space.png',...Object.values(GLOBAL_MAP_IMAGE)];let complete=0,total=critical.length+1;function paint(){const n=Math.min(99,Math.round(complete/total*100));if(bar){bar.style.width=n+'%';bar.style.backgroundColor=n<50?'#ff4b45':n<80?'#e0b23d':'#55d67a'}if(pct){pct.textContent=n+'%';pct.style.color=n<50?'#ff6b65':n<80?'#e0b23d':'#55d67a'}}function preload(src){return new Promise(resolve=>{const img=new Image();let done=false;const finish=()=>{if(done)return;done=true;complete++;paint();resolve()};img.onload=()=>{const d=img.decode?.();if(d&&d.then)d.then(finish).catch(finish);else finish()};img.onerror=finish;img.src=src;if(img.complete&&img.naturalWidth)img.onload()})}async function warm(){paint();await Promise.all(critical.map(preload));try{const gl=initGlobalSurfaceGL();const limit=performance.now()+2200;while(gl&&!gl.ready&&performance.now()<limit)await new Promise(r=>setTimeout(r,32));if(gl){drawGlobalSurfaceGL(8,8,3);try{gl.gl.finish()}catch(e){}}}catch(e){}complete++;paint();const wait=Math.max(0,minBoot-(performance.now()-t0));if(wait)await new Promise(r=>setTimeout(r,wait));if(bar){bar.style.width='100%';bar.style.backgroundColor='#55d67a'}if(pct){pct.textContent='100%';pct.style.color='#55d67a'}requestAnimationFrame(()=>requestAnimationFrame(()=>splash?.classList.add('done')))}warm()})();
requestAnimationFrame(loop)})();
