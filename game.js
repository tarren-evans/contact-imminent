// v0.11.6.144 // MIRAGE ASSESSMENT & SIX-CAMPAIGN PROGRESSION CONSOLIDATION
// Incorporates MIRAGE 04-05 analytic assessment and six-campaign
// progression/UI corrections accumulated since v0.11.6.142.
// Release validation pending.
(()=>{function ciPhysicalPhoneMapFit(){const m=document.getElementById('map'),w=document.getElementById('mapWrap');if(!m||!w)return;m.setAttribute('viewBox','0 0 900 650');const phone=window.innerWidth>680&&window.innerHeight<=500&&window.matchMedia('(pointer: coarse)').matches;if(!phone){m.style.removeProperty('width');m.style.removeProperty('height');m.style.removeProperty('left');m.style.removeProperty('right');m.style.removeProperty('top');m.style.removeProperty('bottom');return;}const cs=getComputedStyle(w),sl=parseFloat(cs.getPropertyValue('--phone-safe-left'))||8,sr=parseFloat(cs.getPropertyValue('--phone-safe-right'))||8,st=parseFloat(cs.getPropertyValue('--phone-safe-top'))||8,sb=parseFloat(cs.getPropertyValue('--phone-safe-bottom'))||8,aw=Math.max(1,w.clientWidth-sl-sr),ah=Math.max(1,w.clientHeight-st-sb),scale=Math.min(aw/900,ah/650),mw=Math.floor(900*scale),mh=Math.floor(650*scale);m.style.width=mw+'px';m.style.height=mh+'px';m.style.left=(sl+Math.max(0,(aw-mw)/2))+'px';m.style.right='auto';m.style.top=(st+Math.max(0,(ah-mh)/2))+'px';m.style.bottom='auto';}window.ciPhysicalPhoneMapFit=ciPhysicalPhoneMapFit;ciPhysicalPhoneMapFit();window.addEventListener('resize',ciPhysicalPhoneMapFit,{passive:true});window.visualViewport?.addEventListener('resize',ciPhysicalPhoneMapFit,{passive:true});const $=s=>document.querySelector(s),NS='http://www.w3.org/2000/svg',D=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y),H=(x,y)=>(Math.atan2(x,-y)*180/Math.PI+360)%360;
const CI_VERSION='0.11.6.144';
const CI_INTERSTITIAL_COOLDOWN_MS=180000;
let ciInterstitialLastShown=0;
let ciInterstitialPreloadPending=false;

function ciAdsPlugin(){
  return window.Capacitor?.Plugins?.Ads||null;
}

async function ciPreloadInterstitial(){
  const ads=ciAdsPlugin();
  if(!ads||ciInterstitialPreloadPending)return false;

  ciInterstitialPreloadPending=true;
  try{
    const status=await ads.getInterstitialStatus();
    if(status?.ready)return true;
    if(status?.loading)return false;
    if(status?.canRequestAds===false)return false;

    const loaded=await ads.loadInterstitial();
    return !!loaded?.ready;
  }catch(e){
    rec('AD_PRELOAD_SKIP',String(e));
    return false;
  }finally{
    ciInterstitialPreloadPending=false;
  }
}

async function ciInterstitialThen(action){
  if(typeof action!=='function')return;

  const ads=ciAdsPlugin();
  const now=Date.now();

  if(!ads||now-ciInterstitialLastShown<CI_INTERSTITIAL_COOLDOWN_MS){
    action();
    ciPreloadInterstitial();
    return;
  }

  try{
    const status=await ads.getInterstitialStatus();

    if(!status?.ready){
      action();
      ciPreloadInterstitial();
      return;
    }

    ciInterstitialLastShown=now;

    try{
      await ads.showInterstitial();
    }catch(e){
      rec('AD_SHOW_SKIP',String(e));
    }

    action();
    ciPreloadInterstitial();
  }catch(e){
    rec('AD_STATUS_SKIP',String(e));
    action();
    ciPreloadInterstitial();
  }
}
const ARCADE_INTEL_KEY='ci-arcade-intel-assist';
let arcadeIntelAssist=(()=>{let v=localStorage.getItem(ARCADE_INTEL_KEY);return ['FULL','TACTICAL','OFF'].includes(v)?v:'TACTICAL'})();
const ARCADE_OA_KEY='ci-arcade-oa';let arcadeOA=(()=>{const oa=localStorage.getItem(ARCADE_OA_KEY);return ['KESTREL','VANTAGE','VERDANT','MIRAGE'].includes(oa)?oa:'KESTREL'})();let activeOA='KESTREL';let networkAssociations=new Map(),networkLastPair=new Map(),campaign02AssocEvents=0,campaign02PatternTracks=new Set(),campaign02ContinuityTracks=new Set();
function intelAssistMode(){return campaignMission==='ARCADE'?arcadeIntelAssist:'FULL'}
function arcadeIntelHelp(mode){return mode==='FULL'?'COMPLETE INTELLIGENCE PICTURE':mode==='TACTICAL'?'LKP + POSITION CONFIDENCE':'LIVE CONTACT PICTURE ONLY'}
function refreshArcadeIntelAssist(){
 const label=$('#arcadeIntelModeLabel'),help=$('#arcadeIntelHelp');if(label)label.textContent=arcadeIntelAssist;if(help)help.textContent=arcadeIntelHelp(arcadeIntelAssist);
 function resetGlobalGlobe(){globalGlobe.drag=false;globalGlobe.pointer=null;globalGlobe.moved=false;globalGlobe.yaw=118;globalGlobe.pitch=0;globalGlobe.zoom=1;globalGlobe.lastX=0;globalGlobe.lastY=0;}
$('#globalBtn')?.addEventListener('click',openGlobal);$('#globalGlobeReset')?.addEventListener('click',resetGlobalGlobe);$('#globalBack')?.addEventListener('click',closeGlobal);$('#globalCampaign')?.addEventListener('click',globalCampaignActivity);$('#globalArcade')?.addEventListener('click',globalArcadeActivity);$('#globalTraining')?.addEventListener('click',globalTrainingActivity);$('#globalPlanNAI')?.addEventListener('click',openGlobalPlanning);$('#planningClose')?.addEventListener('click',closeGlobalPlanning);$('#planningClear')?.addEventListener('click',clearGlobalPlanning);$('#planningUndo')?.addEventListener('click',undoGlobalPlanningPoint);$('#planningRevise')?.addEventListener('click',reviseGlobalPlanning);$('#planningCommit')?.addEventListener('click',commitGlobalPlanning);document.querySelectorAll('[data-global-oa]').forEach(b=>b.addEventListener('click',()=>selectGlobalOA(b.dataset.globalOa,true)));document.querySelectorAll('[data-global-rate]').forEach(b=>b.addEventListener('click',()=>setGlobalRate(Number(b.dataset.globalRate))));setGlobalRate(1.5);
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
}renderTerrain();setTimeout(applyVisualSettings,0);const A={x:145,y:510,r:118,speed:82,mode:'IDLE',dest:null,heading:0,lastMove:performance.now(),loiterCenter:null,loiterAngle:0,loiterDir:1,approachAngle:0,exitUntil:0,exitStarted:0,exitTurnDir:0,exitTurnCommitted:false,sensorPosture:1,controlSelected:false};
// v0.8.1 earned ISR capability packages. Base A.r/A.speed remain authoritative and untouched.
const DEV_ACCESS_UNLOCK_KEY='ci-dev-access-unlocked',DEV_MODE_KEY='ci-dev-mode',DEV_ACCESS_CODE='CI-DEV';
let devAccessUnlocked=localStorage.getItem(DEV_ACCESS_UNLOCK_KEY)==='1';
let devMode=devAccessUnlocked&&localStorage.getItem(DEV_MODE_KEY)==='1';
function devAccessActive(){return devAccessUnlocked&&devMode}
const DEV_PROGRESSION_STAGES=['NONE','KESTREL','VANTAGE','VERDANT','MIRAGE','TEMPEST','POLARIS'];
const DEV_PROGRESSION_KEYS={
 KESTREL:'ci-c01-complete',
 VANTAGE:'ci-c02-complete',
 VERDANT:'ci-c03-05-complete',
 MIRAGE:'ci-c04-05-complete',
 TEMPEST:'ci-c05-05-complete',
 POLARIS:'ci-c06-05-complete'
};
let devProgressionStage='NONE';

function devProgressionSimulationActive(){
 return devAccessActive()&&devProgressionStage!=='NONE';
}
function devProgressionBypassActive(){
 return devAccessActive()&&!devProgressionSimulationActive();
}
function simulatedProgressionComplete(key){
 if(!devProgressionSimulationActive())return false;

 const index=DEV_PROGRESSION_STAGES.indexOf(devProgressionStage);
 const completed=DEV_PROGRESSION_STAGES.slice(1,index+1);

 for(const stage of completed){
  if(DEV_PROGRESSION_KEYS[stage]===key)return true;

  const campaign={
   KESTREL:'01',
   VANTAGE:'02',
   VERDANT:'03',
   MIRAGE:'04',
   TEMPEST:'05',
   POLARIS:'06'
  }[stage];

  if(!campaign)continue;

  for(let n=1;n<=5;n++){
   const mission=String(n).padStart(2,'0');

   if(key==='ci-c'+campaign+'-'+mission+'-complete')return true;
  }

  if(stage==='KESTREL'){
   for(let n=2;n<=5;n++){
    if(key==='ci-c01-010'+n+'-unlocked')return true;
   }
  }
 }

 return false;
}

function campaignMissionUnlocked(id){
 const match=String(id||'').match(/^(0[1-6])-0([1-5])$/);if(!match)return false;
 if(devProgressionBypassActive())return true;
 const series=match[1],mission=Number(match[2]);
 if(mission===1){
  const prerequisite={
   '01':null,'02':'ci-c01-complete','03':'ci-c02-complete',
   '04':'ci-c03-05-complete','05':'ci-c04-05-complete','06':'ci-c05-05-complete'
  }[series];
  return prerequisite===null||!!prerequisite&&progressionComplete(prerequisite);
 }
 const previous=mission-1;
 if(progressionComplete('ci-c'+series+'-'+String(previous).padStart(2,'0')+'-complete'))return true;
 if(series==='01'){
  const legacy='ci-c01-010'+mission+'-unlocked';
  return progressionComplete(legacy)||sessionStorage.getItem(legacy)==='1';
 }
 return false;
}
function campaignProgressionWrite(key,value){
 if(devProgressionSimulationActive()||devProgressionBypassActive())return;
 localStorage.setItem(key,value);
 if(value==='1'&&/-complete$/.test(key))progressionCollectUnlocks();
}
function campaignSessionProgressionWrite(key,value){
 if(devProgressionSimulationActive()||devProgressionBypassActive())return;
 sessionStorage.setItem(key,value);
}
function progressionComplete(key){
 if(devProgressionSimulationActive())return simulatedProgressionComplete(key);
 return localStorage.getItem(key)==='1';
}
function progressionStatusLabel(key,available,done=progressionComplete(key)){
 if(!done)return devProgressionBypassActive()?'DEV ACCESS':available?'AVAILABLE':'LOCKED';
 const simulated=devProgressionSimulationActive()&&localStorage.getItem(key)!=='1'&&simulatedProgressionComplete(key);
 return simulated?'SIMULATED // REPLAY':'COMPLETE // REPLAY';
}

function refreshDevProgressionUI(){
 const panel=$('#devProgressionSimulator');
 const select=$('#devProgressionSelect');
 const state=$('#devProgressionState');
 const active=devAccessActive();

 if(panel)panel.classList.toggle('hidden',!active);
 if(select)select.value=active?devProgressionStage:'NONE';

 if(state){
  state.textContent=active&&devProgressionStage!=='NONE'
   ?'SIMULATING // '+devProgressionStage+' COMPLETE // SAVED PROGRESS UNCHANGED'
   :'SIMULATION OFF';
 }
}

function setDevProgressionStage(stage){
 if(!devAccessActive())return;
 if(!DEV_PROGRESSION_STAGES.includes(stage))return;

 devProgressionStage=stage;
 refreshDevProgressionUI();
 cpRefreshCampaign();
 cpRefreshCampaign02();
 cpRefreshVerdant();
 cpRefreshMirage();
 if(globalSelectedOA)selectGlobalOA(globalSelectedOA);
 refreshGlobalOAStatus();
 refreshProgressionBadges();
 setArcadeOA(localStorage.getItem(ARCADE_OA_KEY)||arcadeOA);
}
function refreshDevAccessUI(){
 const locked=$('#devAccessLocked'),controls=$('#devAccessControls'),state=$('#devModeState');
 if(locked)locked.classList.toggle('hidden',devAccessUnlocked);
 if(controls)controls.classList.toggle('hidden',!devAccessUnlocked);
 if(state)state.textContent=devMode?'DEV ACTIVE':'STANDARD';
 $('#devModeOn')?.classList.toggle('selected',devMode);
 $('#devModeOff')?.classList.toggle('selected',!devMode);
 document.body.classList.toggle('dev-mode-active',devAccessActive());
 refreshDevProgressionUI();
}
function refreshDevAccessState(){
 refreshDevAccessUI();
 cpRefreshCampaign();
 cpRefreshCampaign02();
 cpRefreshVerdant();
 cpRefreshMirage();
 if(globalSelectedOA)selectGlobalOA(globalSelectedOA);
 setArcadeOA(devAccessActive()?arcadeOA:(localStorage.getItem(ARCADE_OA_KEY)||arcadeOA));
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
 devMode=!!on;if(!devMode)devProgressionStage='NONE';localStorage.setItem(DEV_MODE_KEY,devMode?'1':'0');
 refreshDevAccessState();refreshGlobalOAStatus();refreshProgressionBadges();if(globalSelectedOA&&document.querySelector('#globalMenu:not(.hidden)'))selectGlobalOA(globalSelectedOA);cpNotice('DEVELOPER MODE',devMode?'PROGRESSION LOCKS BYPASSED':'STANDARD ACCESS RESTORED','intel');sound('click');
}
const ISR_CAPABILITY_KEY='ci-isr-capability';let isrCapability=localStorage.getItem(ISR_CAPABILITY_KEY)||'STANDARD';
function isrCapabilityUnlocked(k){if(k==='STANDARD')return true;if(k==='WIDE')return localStorage.getItem('ci-c01-complete')==='1';if(k==='RAPID')return localStorage.getItem('ci-c02-complete')==='1';if(k==='ORBIT')return localStorage.getItem('ci-c03-05-complete')==='1';if(k==='HARDENED')return localStorage.getItem('ci-c04-05-complete')==='1';return false}
function normalizeISRCapability(){if(!isrCapabilityUnlocked(isrCapability))isrCapability='STANDARD'}
function cpEffectiveISRSpeed(){if(campaignMission==='RETRO')return A.speed;normalizeISRCapability();const cyberFactor=cpCyberActive()?(isrCapability==='HARDENED'?.90:.80):1;return A.speed*(isrCapability==='RAPID'?1.12:1)*cyberFactor}
let B=[],T=[],sel=null,col=null,pct=0,score=0,integrity=100,decisionCorrect=0,decisionTotal=0,resolved=0,ints=0,next=1,campaignMission=null,campaignIds=0,campaignCorrect=0,campaignThreatResolved=0,campaignNonThreatResolved=0,campaignStationaryAssessed=0,campaignStationarySpawned=0,campaignProximityAssessed=0,campaignCollectionInterrupted=0,campaignCompromise=0,campaignFinished=false,arcadeStreak=0,arcadeBestStreak=0,arcadeCorrect=0,arcadeWrong=0,arcadeStart=0,arcadeThreatLevel=1,arcadeNextLevel=0,intelDropOffered=false,intelDropActive=false,intelDropAt=0,intelDropExpires=0,intelFusionUntil=0,passiveCredits=0,passiveNodes=[],passiveNAIs=[],passiveDeployMode=false,passiveNextId=1,ewoTargetMode=false,ewoUses=0,tutorialStep=0,supplyPackages=0,supplyRepairMode=false,cyberDegradedUntil=0,cyberRecoverNotice=false,cyberNextGlitch=0,running=false,start=0,lastSpawn=0,last=performance.now(),phase=1,ct=null,ci=null,lastUi=0,stallLogged=false;const C={raf:0,isr:0,map:0,track:0,orders:0,errors:0,lastRaf:performance.now(),maxGap:0,fps:0,fpsFrames:0,fpsAt:performance.now()};let dbg=[],lastDiag=0;let campaignHintSig='',campaignHintAt=0,campaignHintLevel=0;function rec(kind,msg){let ts=((performance.now()-(start||performance.now()))/1000).toFixed(3);dbg.push(`${ts}s | ${kind} | ${msg}`);if(dbg.length>500)dbg.shift()}window.addEventListener('error',e=>{C.errors++;rec('ERROR',`${e.message} @ ${e.filename}:${e.lineno}:${e.colno}`)});window.addEventListener('unhandledrejection',e=>{C.errors++;rec('REJECTION',String(e.reason))});function log(s){let d=document.createElement('div');d.textContent='> '+s;$('#log').prepend(d);while($('#log').children.length>7)$('#log').lastChild.remove()}function banner(s,d=1000){$('#bannerText').textContent=s;$('#banner').classList.add('show');setTimeout(()=>$('#banner').classList.remove('show'),d)}
// v0.6.2.1 AUDIO IDENTITY // retained tactile/menu SFX + recorded background
let audioCtx=null,audioReady=false,audioEnabled=true,lastContactTone=0,lastWarningTone=0;const savedMute=localStorage.getItem('ci-audio-muted'),muteExplicit=localStorage.getItem('ci-audio-mute-explicit')==='1';let masterMuted=muteExplicit&&savedMute==='1';if(!muteExplicit){localStorage.setItem('ci-audio-muted','0');masterMuted=false;}if(savedMute!==null&&savedMute!=='0'&&savedMute!=='1'){localStorage.removeItem('ci-audio-muted');masterMuted=false;}
// v0.6.2 TACTICAL SCORE // beat-first score + tactile UI transients
let musicMode='off',musicNoiseBuffer=null,lastHoverTone=0;
const audioLevels={music:Number(localStorage.getItem('ci-audio-music')??70)/100,ui:Number(localStorage.getItem('ci-audio-ui')??80)/100,sfx:Number(localStorage.getItem('ci-audio-sfx')??85)/100};let synthGain=1;
const musicTracks=['assets/audio/screen-tearing-loop.ogg','assets/audio/mission-background-loop.ogg'];
let musicTrackIndex=0;
const backgroundMusic=new Audio(musicTracks[0]),backgroundMusicB=new Audio(musicTracks[1]);
let ciMusicActive=backgroundMusic,ciMusicStandby=backgroundMusicB,ciCrossfadeTimer=null,ciCrossfadeInterval=null,ciCrossfading=false,ciMusicPlayPending=false,ciMusicLastAttempt=0,ciMusicUnlocked=false;
[backgroundMusic,backgroundMusicB].forEach(a=>{a.loop=false;a.preload='auto';a.playsInline=true});

function ciMusicBaseGain(){return window.CP_PAUSED?.16:.34}
function ciMusicTargetVolume(){return Math.max(0,Math.min(1,ciMusicBaseGain()*audioLevels.music*(masterMuted?0:1)))}
function ciMusicShouldPlay(){return musicMode!=='off'&&!masterMuted}
function ciApplyMusicVolumes(){
 const target=ciMusicTargetVolume();
 [backgroundMusic,backgroundMusicB].forEach(a=>a.muted=masterMuted);
 if(!ciCrossfading){ciMusicActive.volume=target;if(ciMusicStandby.paused)ciMusicStandby.volume=0}
}
function ciCancelCrossfadeSchedule(){if(ciCrossfadeTimer){clearTimeout(ciCrossfadeTimer);ciCrossfadeTimer=null}}
function ciStopCrossfadeInterval(){if(ciCrossfadeInterval){clearInterval(ciCrossfadeInterval);ciCrossfadeInterval=null}}
function ciLoadTrack(player,index){
 const wanted=musicTracks[index];
 if(!player.src.endsWith(wanted)){player.src=wanted;player.load()}
 player.dataset.ciTrackIndex=String(index);
}
function ciScheduleCrossfade(){
 ciCancelCrossfadeSchedule();
 if(ciCrossfading||!ciMusicShouldPlay())return;
 const a=ciMusicActive;
 if(!isFinite(a.duration)||a.duration<=0){a.addEventListener('loadedmetadata',ciScheduleCrossfade,{once:true});return}
 const remaining=a.duration-a.currentTime;
 const delay=Math.max(0,(remaining-8)*1000);
 ciCrossfadeTimer=setTimeout(()=>ciTransitionToNext('scheduled'),delay);
}
function ciTransitionToNext(reason='ended'){
 if(ciCrossfading||!ciMusicShouldPlay())return;
 ciCrossfading=true;ciCancelCrossfadeSchedule();ciStopCrossfadeInterval();
 const from=ciMusicActive,to=ciMusicStandby;
 const nextIndex=(musicTrackIndex+1)%musicTracks.length;
 ciLoadTrack(to,nextIndex);
 try{to.currentTime=0}catch(_){}
 to.volume=0;to.muted=masterMuted;
 let settled=false;
 const fail=(e)=>{if(settled)return;settled=true;ciCrossfading=false;rec('MUSIC_TRANSITION_BLOCKED',reason+' // '+String(e||''));ciScheduleCrossfade()};
 const p=to.play();if(p&&p.catch)p.catch(fail);
 const started=performance.now(),fadeMs=8000;
 ciCrossfadeInterval=setInterval(()=>{
   const q=Math.min(1,(performance.now()-started)/fadeMs),target=ciMusicTargetVolume();
   const fadeOut=Math.cos(q*Math.PI*.5),fadeIn=Math.sin(q*Math.PI*.5);from.volume=target*fadeOut;to.volume=target*fadeIn;
   if(q>=1){
     ciStopCrossfadeInterval();settled=true;
     from.pause();try{from.currentTime=0}catch(_){}
     musicTrackIndex=nextIndex;ciMusicActive=to;ciMusicStandby=from;ciCrossfading=false;
     ciApplyMusicVolumes();ciScheduleCrossfade();
     rec('MUSIC_TRACK_CHANGE',musicTrackIndex+' // '+reason);
   }
 },50);
}
function ciHandleEnded(player){
 if(player!==ciMusicActive||ciCrossfading)return;
 ciTransitionToNext('ended-fallback');
}
[backgroundMusic,backgroundMusicB].forEach(a=>a.addEventListener('ended',()=>ciHandleEnded(a)));

function ensureMusicGain(){return}
function applyMusicLevel(){ciApplyMusicVolumes()}
function ciMusicRecover(reason='state'){
 if(!ciMusicShouldPlay()||!ciMusicUnlocked||ciCrossfading)return;
 applyMusicLevel();
 if(!ciMusicActive.paused&&!ciMusicActive.ended)return;
 const now=performance.now();if(ciMusicPlayPending||now-ciMusicLastAttempt<250)return;
 ciMusicLastAttempt=now;
 try{
   ciLoadTrack(ciMusicActive,musicTrackIndex);
   const p=ciMusicActive.play();
   if(p&&p.then){ciMusicPlayPending=true;p.then(()=>{ciMusicPlayPending=false;ciScheduleCrossfade();rec('MUSIC_RECOVER','playing // '+reason)}).catch(e=>{ciMusicPlayPending=false;rec('MUSIC_PLAY_BLOCKED',reason+' // '+String(e))})}
 }catch(e){ciMusicPlayPending=false;rec('MUSIC_RECOVER_FAIL',reason+' // '+String(e))}
}
function ciMusicLifecycleRecover(reason){if(!ciMusicShouldPlay())return;ensureMusicGain();applyMusicLevel();ciMusicRecover(reason)}
[backgroundMusic,backgroundMusicB].forEach(a=>{
 a.addEventListener('stalled',()=>{if(a===ciMusicActive){rec('MUSIC_STALLED','network/decode stall');ciMusicRecover('stalled')}});
 a.addEventListener('suspend',()=>{if(a===ciMusicActive&&ciMusicShouldPlay()&&a.paused)rec('MUSIC_SUSPEND','paused while active')});
 a.addEventListener('error',()=>rec('MUSIC_MEDIA_ERROR',String(a.error?.code||'unknown')));
});
document.addEventListener('visibilitychange',()=>{if(!document.hidden)ciMusicLifecycleRecover('visibility')});
window.addEventListener('pageshow',()=>ciMusicLifecycleRecover('pageshow'));
window.addEventListener('focus',()=>ciMusicLifecycleRecover('focus'));
setInterval(()=>{if(ciMusicShouldPlay()&&!ciCrossfading&&ciMusicActive.paused)ciMusicRecover('watchdog')},1800);
const missionFailAudio=new Audio('assets/audio/mission-fail.wav'),missionSuccessAudio=new Audio('assets/audio/mission-success.wav');const studioCorruptionAudio=new Audio('assets/audio/studio-corruption-transition.ogg'),kineticInterceptAudio=[new Audio('assets/audio/kinetic-combined-03.ogg'),new Audio('assets/audio/kinetic-combined-04.ogg')];const interceptImpact=new Audio('assets/audio/intercept-impact.wav'),ewoAudio=new Audio('assets/audio/ewo-sweep.wav'),clearRadio=[new Audio('assets/audio/radio-clear-user-01.wav'),new Audio('assets/audio/radio-clear-user-02.wav'),new Audio('assets/audio/radio-clear-user-03.wav'),new Audio('assets/audio/radio-clear-user-04.wav'),new Audio('assets/audio/radio-clear-user-05.wav'),new Audio('assets/audio/radio-clear-user-06.wav'),new Audio('assets/audio/radio-clear-user-07.wav'),new Audio('assets/audio/radio-clear-user-08.wav')];[studioCorruptionAudio,...kineticInterceptAudio,interceptImpact,ewoAudio,missionFailAudio,missionSuccessAudio,...clearRadio].forEach(a=>a.preload='auto');function playAsset(a,vol=1,bus='sfx'){try{a._ciBaseVol=vol;a._ciBus=bus;a.currentTime=0;a.volume=Math.max(0,Math.min(1,vol*audioLevels[bus]*(masterMuted?0:1)));const p=a.play();if(p&&p.catch)p.catch(()=>{})}catch(e){rec('AUDIO_ASSET_FAIL',String(e))}}
function applyAudioSettings(){applyMusicLevel();[studioCorruptionAudio,...kineticInterceptAudio,interceptImpact,ewoAudio,missionFailAudio,missionSuccessAudio,...clearRadio].forEach(a=>{if(a._ciBaseVol!=null){a.volume=Math.max(0,Math.min(1,a._ciBaseVol*audioLevels[a._ciBus||'sfx']*(masterMuted?0:1)))}});const mb=$('#muteBtn');if(mb){mb.textContent=masterMuted?'AUDIO MUTED':'AUDIO ON';mb.classList.toggle('muted',masterMuted)};[['musicSlider','musicValue','music'],['uiSlider','uiValue','ui'],['sfxSlider','sfxValue','sfx']].forEach(([sid,vid,k])=>{const sl=$('#'+sid),v=$('#'+vid);if(sl)sl.value=Math.round(audioLevels[k]*100);if(v)v.textContent=Math.round(audioLevels[k]*100)+'%'})}
function setAudioLevel(k,v){audioLevels[k]=Math.max(0,Math.min(1,Number(v)/100));localStorage.setItem('ci-audio-'+k,String(Math.round(audioLevels[k]*100)));if(k==='music')ensureMusicGain();applyAudioSettings()}
const visualSettings={gridOpacity:Number(localStorage.getItem('ci-grid-opacity')??42)/100,gridWeight:Number(localStorage.getItem('ci-grid-weight')??1.45),gridColor:localStorage.getItem('ci-grid-color')||'#e0e9ec',isrColor:localStorage.getItem('ci-isr-color')||'#dce5e8',isrSymbol:localStorage.getItem('ci-isr-symbol')||'AIRCRAFT'};
const ISR_PATHS={AIRCRAFT:'M0 -19L15 10L5 6L0 18L-5 6L-15 10Z',DIAMOND:'M0 -20L18 0L0 20L-18 0Z',CROSSHAIR:'M-18 -4H-4V-18H4V-4H18V4H4V18H-4V4H-18Z'};
function applyVisualSettings(){const root=document.documentElement;root.style.setProperty('--ci-grid-color',visualSettings.gridColor);root.style.setProperty('--ci-grid-opacity',String(visualSettings.gridOpacity));root.style.setProperty('--ci-grid-weight',String(visualSettings.gridWeight));document.querySelectorAll('#geometricGrid .geoHex').forEach(h=>{h.style.stroke=visualSettings.gridColor;h.style.strokeOpacity=String(visualSettings.gridOpacity);h.style.strokeWidth=String(visualSettings.gridWeight)});const asset=$('#asset'),sensor=$('#sensor'),label=$('#alabel');if(asset)asset.style.color=visualSettings.isrColor;if(sensor)sensor.style.color=visualSettings.isrColor;if(label)label.style.fill=visualSettings.isrColor;const path=$('#plane path');if(path)path.setAttribute('d',ISR_PATHS[visualSettings.isrSymbol]||ISR_PATHS.AIRCRAFT);const go=$('#gridOpacitySlider'),gov=$('#gridOpacityValue'),gw=$('#gridWeightSlider'),gwv=$('#gridWeightValue'),gc=$('#gridColorSelect'),ic=$('#isrColorSelect'),is=$('#isrSymbolSelect');if(go)go.value=Math.round(visualSettings.gridOpacity*100);if(gov)gov.textContent=Math.round(visualSettings.gridOpacity*100)+'%';if(gw)gw.value=visualSettings.gridWeight;if(gwv)gwv.textContent=visualSettings.gridWeight.toFixed(2);if(gc)gc.value=visualSettings.gridColor;if(ic)ic.value=visualSettings.isrColor;if(is)is.value=visualSettings.isrSymbol}
function saveVisualSetting(k,v){if(k==='gridOpacity'){visualSettings[k]=Number(v)/100;localStorage.setItem('ci-grid-opacity',String(Math.round(Number(v))))}else if(k==='gridWeight'){visualSettings[k]=Number(v);localStorage.setItem('ci-grid-weight',String(v))}else{visualSettings[k]=v;localStorage.setItem(k==='gridColor'?'ci-grid-color':k==='isrColor'?'ci-isr-color':'ci-isr-symbol',v)}applyVisualSettings()}
function makeNoiseBuffer(){if(!audioCtx)return null;const len=Math.max(1,Math.floor(audioCtx.sampleRate*2)),b=audioCtx.createBuffer(1,len,audioCtx.sampleRate),d=b.getChannelData(0);for(let i=0;i<len;i++)d[i]=(Math.random()*2-1);return b}
function audioUnlock(){if(!audioEnabled)return;try{if(!audioCtx)audioCtx=new (window.AudioContext||window.webkitAudioContext)();if(audioCtx.state==='suspended')audioCtx.resume().catch(()=>{});audioReady=true;ciMusicUnlocked=true;if(!musicNoiseBuffer)musicNoiseBuffer=makeNoiseBuffer();musicSetMode((running&&!window.CP_MENU)?'mission':'menu');ciMusicRecover('user-gesture')}catch(e){rec('AUDIO_FAIL',String(e));audioEnabled=false}}
function routeGain(vol,t,dur,dest=null,attack=.003){const g=audioCtx.createGain();vol*=synthGain;g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(Math.max(.0002,vol),t+attack);g.gain.exponentialRampToValueAtTime(.0001,t+dur);g.connect(dest||audioCtx.destination);return g}
function tone(freq=220,dur=.06,vol=.018,type='sine',delay=0,endFreq=null,dest=null){if(!audioEnabled||!audioReady||!audioCtx)return;const t=audioCtx.currentTime+delay,o=audioCtx.createOscillator(),g=routeGain(vol,t,dur,dest);o.type=type;o.frequency.setValueAtTime(freq,t);if(endFreq)o.frequency.exponentialRampToValueAtTime(Math.max(20,endFreq),t+dur);o.connect(g);o.start(t);o.stop(t+dur+.03)}
function noiseBurst(dur=.045,vol=.009,cutoff=1100,delay=0,filterType='bandpass',q=1.2,dest=null){if(!audioReady||!audioCtx||!musicNoiseBuffer)return;const t=audioCtx.currentTime+delay,n=audioCtx.createBufferSource(),f=audioCtx.createBiquadFilter(),g=routeGain(vol,t,dur,dest);n.buffer=musicNoiseBuffer;f.type=filterType;f.frequency.value=cutoff;f.Q.value=q;n.connect(f);f.connect(g);n.start(t);n.stop(t+dur+.02)}
function uiTick(){noiseBurst(.018,.022,2350,0,'highpass',.7);noiseBurst(.010,.010,4200,.004,'bandpass',2.2)}
function uiClack(){noiseBurst(.038,.034,1450,0,'bandpass',1.4);noiseBurst(.025,.020,420,0,'lowpass',.8);tone(72,.038,.012,'triangle',.004,55)}
const studioKeySamples=[1,2,3,4,5,6,7,8,9].map(n=>new Audio(`assets/audio/studio-key-${n}.ogg`)),studioEnterSample=new Audio('assets/audio/studio-enter.ogg');[...studioKeySamples,studioEnterSample].forEach(a=>{a.preload='auto';a.playsInline=true});function studioTypeClack(index=0,kind='key'){if(masterMuted)return;const src=kind==='enter'?studioEnterSample:studioKeySamples[Math.abs(index-1)%studioKeySamples.length];try{const a=src.cloneNode();a.volume=Math.max(0,Math.min(1,(kind==='enter'?.34:.28)*audioLevels.ui));a.playbackRate=1;const p=a.play();if(p&&p.catch)p.catch(()=>{})}catch(e){rec('STUDIO_KEY_FAIL',String(e))}}
function studioKeyGlitch(lockup,index=0,strong=false){if(!lockup)return;const copy=lockup.querySelector('.studio-type-copy'),band=lockup.querySelector('.studio-glitch-band');if(!copy)return;const dir=index%2?-1:1;copy.style.transition='none';copy.style.opacity=strong?'.38':'.62';copy.style.transform=`translateX(${dir*(strong?8:3)}px) skewX(${dir*(strong?-2:-.7)}deg)`;copy.style.filter=strong?'contrast(1.8) brightness(1.35)':'contrast(1.35)';copy.style.textShadow=`${-dir*(strong?7:3)}px 0 rgba(74,91,58,.9),${dir*(strong?4:2)}px 0 rgba(242,241,237,.28)`;if(band){band.style.opacity=strong?'.9':'.5';band.style.top=`${28+(index*13)%48}%`;band.style.transform=`translateX(${dir*(strong?12:5)}px)`}setTimeout(()=>{copy.style.opacity='1';copy.style.transform='translateX(0) skewX(0)';copy.style.filter='none';copy.style.textShadow='none';if(band){band.style.opacity='0';band.style.transform='translateX(0)'}},strong?145:72)}
function studioPreTypeGlitch(el,lockup){
 if(!el||!lockup)return;
 const copy=lockup.querySelector('.studio-type-copy'),band=lockup.querySelector('.studio-glitch-band');
 el.classList.add('studio-pre-glitch');
 const mote=document.createElement('span');mote.className='studio-pre-binary';mote.textContent='01001001 01001110';el.appendChild(mote);
 setTimeout(()=>{if(copy){copy.style.transition='none';copy.style.transform='translateX(4px) skewX(-.8deg)';copy.style.textShadow='-3px 0 rgba(42,255,112,.65),2px 0 rgba(242,241,237,.22)'}if(band){band.style.opacity='.38';band.style.top='37%'}},65);
 setTimeout(()=>{if(copy){copy.style.transform='translateX(-2px)';copy.style.textShadow='2px 0 rgba(42,255,112,.38)'}if(band){band.style.opacity='.16';band.style.top='61%'}},165);
 setTimeout(()=>{el.classList.remove('studio-pre-glitch');if(copy){copy.style.transform='';copy.style.textShadow='';copy.style.filter='';copy.style.opacity=''}if(band){band.style.opacity='0';band.style.transform=''}mote.remove()},360);
}
function studioFinalGlitch(lockup){
 if(!lockup)return;
 const studioFailSafe=setTimeout(()=>{try{const r=document.querySelector('#studioReveal');document.body.classList.remove('studio-boot-pending');document.body.classList.add('studio-title-reveal');document.body.classList.remove('studio-title-glitch-in');if(r){r.classList.remove('show','exit','studio-corrupt-transition','studio-corrupt-terminal');r.style.opacity='';r.setAttribute('aria-hidden','true')}}catch(e){}},6200);try{playAsset(studioCorruptionAudio,.42,'sfx')}catch(e){}const reveal=document.querySelector('#studioReveal'),copy=lockup.querySelector('.studio-type-copy'),band=lockup.querySelector('.studio-glitch-band');if(!copy||!reveal)return;
 reveal.classList.add('studio-corrupt-transition');
 const bits=document.createElement('div');bits.className='studio-binary-corruption studio-binary-fullscreen';
 const easterEgg='01001001 01001110 01000001 01000011 01010100 01001001 01010110 01000101 00100000 01010011 01010100 01010101 01000100 01001001 01001111 01010011';
 const rows=[easterEgg,'10110100 00101101 11100010 01010101','00110111 11001010 01101001 10110010','01110011 00010110 10110100 00101101','11000101 01101001 00101110 10101010','00110100 11101001 01010110 00110111','10101010 00110011 11001100 01001001'];
 rows.forEach((txt,i)=>{const n=document.createElement('span');n.textContent=txt;n.className=i===0?'binary-easter-egg':'';n.style.left=(i===0?4:(3+((i*17)%82)))+'%';n.style.top=(i===0?48:(6+((i*13)%82)))+'%';n.style.animationDelay=(i*37)+'ms';bits.appendChild(n)});
 for(let i=0;i<8;i++){const v=document.createElement('i');v.className='cyber-green-column';v.textContent=(i%3===0?'01001001 01001110 01000001':'10100110 00110101 11001010');v.style.left=(5+i*13)+'%';v.style.animationDelay=(i*31)+'ms';bits.appendChild(v)}
 for(let i=0;i<10;i++){const t=document.createElement('b');t.className='binary-torn-bit';t.textContent=rows[(i+2)%rows.length].slice((i*7)%24,((i*7)%24)+24);t.style.left=(2+(i*19)%91)+'%';t.style.top=(7+(i*23)%86)+'%';t.style.animationDelay=(i*29)+'ms';bits.appendChild(t)}
 reveal.appendChild(bits);
 const frames=[[0,.92,-7,1.25],[320,.28,15,2.2],[690,.84,-18,1.6],[1080,.12,22,2.7],[1490,.76,-11,1.8],[1940,.06,19,3],[2410,.55,-24,2.3],[2920,.02,12,3.2],[3440,.38,-9,2.5],[3970,.08,18,3.1],[4300,0,0,0]];
 frames.forEach(([ms,op,x,c],i)=>setTimeout(()=>{reveal.style.opacity=String(Math.max(.02,op));copy.style.transition='none';copy.style.opacity=String(op);copy.style.transform=`translateX(${x}px) skewX(${x?x/5:0}deg)`;copy.style.filter=c?`contrast(${c}) brightness(1.35)`:'none';copy.style.textShadow=x?`${-x}px 0 rgba(147,72,255,.98),${x*.55}px 0 rgba(242,241,237,.55),${x*.28}px 0 rgba(74,91,58,.62)`:'none';if(band){band.style.opacity=x?'1':'0';band.style.top=`${12+(i*9)%74}%`;band.style.transform=`translateX(${-x}px) scaleX(${1+(i%3)*.15})`}},ms));
 setTimeout(()=>{reveal.classList.add('studio-corrupt-terminal')},3000);
 setTimeout(()=>{document.body.classList.remove('studio-boot-pending');document.body.classList.add('studio-title-reveal','studio-title-glitch-in');reveal.classList.add('exit');setTimeout(()=>document.body.classList.remove('studio-title-glitch-in'),950);},4050);
 setTimeout(()=>{reveal.classList.remove('show','exit','studio-corrupt-transition','studio-corrupt-terminal');reveal.style.opacity='';reveal.setAttribute('aria-hidden','true');bits.remove()},4700)
}
function cyberAttackSound(){if(!audioReady||masterMuted)return;const prev=synthGain;synthGain=audioLevels.sfx;noiseBurst(.28,.065,1850,0,'bandpass',5.2);noiseBurst(.18,.052,5600,.025,'highpass',1.1);tone(164,.30,.042,'sawtooth',0,43);tone(83,.34,.034,'square',.07,31);noiseBurst(.24,.042,390,.13,'lowpass',1.0);tone(46,.38,.028,'triangle',.12,29);synthGain=prev}
function cyberDisruptSound(){if(!audioReady||masterMuted)return;const prev=synthGain;synthGain=audioLevels.sfx;noiseBurst(.12,.026,3400,0,'bandpass',3.4);tone(155,.16,.022,'square',0,62);tone(82,.22,.018,'sawtooth',.08,42);synthGain=prev}
function interceptStrikeSound(){
 if(!audioReady||masterMuted)return;
 const available=kineticInterceptAudio.filter(a=>a.paused||a.ended);
 const kinetic=(available.length?available:kineticInterceptAudio)[Math.floor(Math.random()*(available.length?available.length:kineticInterceptAudio.length))];
 playAsset(kinetic,.54,'sfx');
}
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
 case'explosion':interceptStrikeSound();break;
 case'cyberAttack':cyberAttackSound();break;
 case'cyberDisrupt':cyberDisruptSound();break;
 case'clear':{noiseBurst(.035,.012,1800);setTimeout(()=>playAsset(clearRadio[Math.floor(Math.random()*clearRadio.length)],.9,'sfx'),45);break;}
 case'ewo':playAsset(ewoAudio,.88,'sfx');break;
 case'fail':tone(58,.48,.036,'sawtooth',0,36);tone(43,.62,.028,'sine',.18,32);noiseBurst(.24,.014,240,.06);break;
 }}
function musicSetMode(mode){
 musicMode=mode;
 if(mode==='off'){ciCancelCrossfadeSchedule();if(ciCrossfadeInterval){clearInterval(ciCrossfadeInterval);ciCrossfadeInterval=null}ciCrossfading=false;[backgroundMusic,backgroundMusicB].forEach(a=>a.pause());return}
 ensureMusicGain();applyMusicLevel();ciMusicRecover('mode-'+mode);
}
function ciPrimeBootAudio(){musicMode='menu';applyMusicLevel();try{ciMusicActive.load();const p=ciMusicActive.play();if(p&&p.then){ciMusicPlayPending=true;p.then(()=>{ciMusicPlayPending=false;ciMusicUnlocked=true;rec('MUSIC_BOOT','playing during loader')}).catch(e=>{ciMusicPlayPending=false;rec('MUSIC_BOOT_BLOCKED',String(e))})}}catch(e){rec('MUSIC_BOOT_FAIL',String(e))}}
function installMenuButtonAudio(){document.querySelectorAll('button').forEach(btn=>{if(btn.dataset.audioUi)return;btn.dataset.audioUi='1';btn.addEventListener('mouseenter',()=>{if(btn.disabled||!audioReady)return;const n=performance.now();if(n-lastHoverTone<45)return;lastHoverTone=n;sound('hover')});btn.addEventListener('pointerdown',()=>{audioUnlock();if(!btn.disabled){setTimeout(()=>sound('click'),0)}},{capture:true})})}
installMenuButtonAudio();
document.addEventListener('pointerdown',audioUnlock,{capture:true});document.addEventListener('touchstart',audioUnlock,{capture:true,passive:true});document.addEventListener('keydown',audioUnlock,{capture:true});function point(e){let p=$('#map').createSVGPoint();p.x=e.clientX;p.y=e.clientY;return p.matrixTransform($('#map').getScreenCTM().inverse())}function valid(p){return p&&Number.isFinite(p.x)&&Number.isFinite(p.y)}function stopCollect(){if(ct)clearTimeout(ct);if(ci)clearInterval(ci);ct=ci=null;if(col)col.collecting=false;col=null;pct=0}function acquire(){if(verdantTrafficSel){verdantTrafficSel=null;updateSpotReport(null,false)}if(mirageSiteSel||mirageTrafficSel){mirageSiteSel=null;mirageTrafficSel=null;updateSpotReport(null,false)}C.isr++;tutorialAdvance('acquire');rec('ISR_CLICK',`mode=${A.mode} pos=${A.x.toFixed(1)},${A.y.toFixed(1)}`);stopCollect();sel=null;A.controlSelected=true;stallLogged=false;log('ISR CONTROL // ACQUIRED');sound('acquire');ui(true)}function cpHeadingDelta(from,to){return((to-from+540)%360)-180}function order(p){C.orders++;tutorialAdvance('order');rec('ORDER',valid(p)?`to=${p.x.toFixed(1)},${p.y.toFixed(1)}`:'INVALID');if(!valid(p)){A.controlSelected=false;return}A.dest=campaignMission==='RETRO'?{x:Math.max(125,Math.min(775,p.x)),y:Math.max(125,Math.min(525,p.y))}:{x:Math.max(55,Math.min(845,p.x)),y:Math.max(45,Math.min(605,p.y))};A.controlSelected=false;const wasLoiter=A.mode==='LOITER'&&valid(A.loiterCenter);if(wasLoiter){const targetHeading=H(A.dest.x-A.x,A.dest.y-A.y),exitDelta=cpHeadingDelta(A.heading,targetHeading);A.mode='LOITER_EXIT';A.exitStarted=performance.now();A.exitUntil=A.exitStarted+4000;A.exitTurnCommitted=Math.abs(exitDelta)>=120;A.exitTurnDir=A.exitTurnCommitted?(Math.abs(exitDelta)>=179?(A.loiterDir||1):(exitDelta>=0?1:-1)):0;rec('LOITER_EXIT',`heading=${A.heading.toFixed(1)} target=${targetHeading.toFixed(1)} delta=${exitDelta.toFixed(1)}${A.exitTurnCommitted?' committed='+(A.exitTurnDir>0?'RIGHT':'LEFT'):''}`)}else{A.loiterCenter=null;A.heading=H(A.dest.x-A.x,A.dest.y-A.y);A.mode='ENROUTE'}A.lastMove=performance.now();stallLogged=false;log('ISR ORDER // DESTINATION SET');sound('order')}function makeBlue(id,x,y){let b={id,x,y,exposure:0,degraded:false},g=document.createElementNS(NS,'g');{const k=activeOA==='VERDANT'?cpVerdantSymbolAspect():1;g.setAttribute('transform',`translate(${x} ${y}) scale(${k} 1)`);}g.innerHTML=`<circle r="24" fill="#0d1418" stroke="#4da3ff" stroke-width="2"/><path d="M-10 -10H10V10H-10ZM-5 -5H5V5H-5Z" fill="none" stroke="#4da3ff" stroke-width="2"/><text x="31" y="4" font-size="11" fill="#4da3ff">${id}</text><g class="blue-health" transform="translate(-25 31)"><rect class="blue-health-bg" x="0" y="0" width="50" height="5" rx="1"/><rect class="blue-health-fill" x="0" y="0" width="50" height="5" rx="1"/><text class="blue-health-text" x="25" y="15" text-anchor="middle">100%</text></g>`;$('#blueSites').append(g);b.el=g;b.circle=g.querySelector('circle');b.icon=g.querySelector('path');b.label=g.querySelector(':scope > text');b.healthFill=g.querySelector('.blue-health-fill');b.healthText=g.querySelector('.blue-health-text');g.style.pointerEvents='all';g.addEventListener('pointerdown',e=>{if(!supplyRepairMode||!b.degraded)return;e.preventDefault();e.stopPropagation();reconstituteSite(b)});B.push(b)}function initBlue(){$('#blueSites').textContent='';B=[];
const sites=campaignMission==='RETRO'?[{id:'BLU-BASE',x:705,y:485},{id:'BLU-C2',x:600,y:170},{id:'BLU-LOG',x:300,y:310}]:((activeOA==='VERDANT'&&/^03-/.test(campaignMission||''))||(activeOA==='MIRAGE'&&/^04-/.test(campaignMission||'')))?[]:activeOA==='VANTAGE'&&window.CP_VANTAGE_MAP?window.CP_VANTAGE_MAP.blufor:[{id:'BLU-FOB',x:705,y:485},{id:'BLU-C2',x:600,y:170},{id:'BLU-LOG',x:300,y:310},{id:'BLU-AIR',x:775,y:285},{id:'BLU-AOB',x:425,y:205}];
sites.forEach(s=>makeBlue(s.id,s.x,s.y));B.forEach(b=>{b.exposure=0;b.degraded=false;cpRenderBlueSite(b)})}
function cpNotice(title,detail,kind='intel'){
 const stack=$('#notificationStack');if(!stack)return;
 const n=document.createElement('div');n.className='op-notice '+kind;
 n.innerHTML='<b>'+title+'</b><span>'+detail+'</span>';stack.appendChild(n);
 while(stack.children.length>4)stack.firstElementChild.remove();
 setTimeout(()=>{n.classList.add('leaving');setTimeout(()=>n.remove(),350)},2600);
}
// v0.8.0 shared mission capability layer. Campaign systems query capabilities rather than hard-coding campaign numbers throughout the runtime.
function isCampaignMission(){return /^0[1234]-\d{2}$/.test(campaignMission||'')||/^05-0[1-5]$/.test(campaignMission||'')||/^06-0[1-5]$/.test(campaignMission||'')}
function isCampaign02(){return /^02-/.test(campaignMission||'')}
function campaignStage(){let m=String(campaignMission||'').match(/^\d{2}-(\d{2})$/);return m?Number(m[1]):0}
function usesObjectiveTracker(){return (isCampaignMission()&&campaignMission!=='05-01')||campaignMission==='ARCADE'||campaignMission==='RETRO'}
function usesThreatEnvironment(){return campaignMission==='ARCADE'||campaignMission==='01-04'||campaignMission==='01-05'||(isCampaign02()&&campaignStage()>=4)}
function usesPassiveISR(){return campaignMission==='TUTORIAL'||usesThreatEnvironment()}
function usesIntelDrops(){return campaignMission==='TUTORIAL'||usesThreatEnvironment()}
function usesNetworkAnalysis(){return isCampaign02()&&campaignStage()>=3}
const PASSIVE_MAX=9,PASSIVE_RADIUS=92,PASSIVE_COSTS=[30,35,40,45,50,60,70,80,90],NAI_LINK_MAX=360,NAI_MIN_AREA=1800,NAI_COLLECT_MS=1000,EWO_COST=75;
function passiveEnabled(){return usesPassiveISR()}
function passiveCost(){return PASSIVE_COSTS[Math.min(passiveNodes.length,PASSIVE_COSTS.length-1)]}
function passiveCovered(t){return passiveEnabled()&&passiveNodes.some(n=>cpMapRadialDistance(n,t)<=PASSIVE_RADIUS)}
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
 const rg=document.createElementNS(NS,'g');rg.setAttribute('transform','translate('+n.x+' '+n.y+') scale('+(activeOA==='VERDANT'?cpVerdantSymbolAspect():1)+' 1)');rg.setAttribute('class','passive-range-layer');rg.innerHTML=`<circle class="passive-range" r="${PASSIVE_RADIUS}"/>`;$('#passiveRanges').append(rg);n.rangeEl=rg;
 const g=document.createElementNS(NS,'g');g.setAttribute('transform','translate('+n.x+' '+n.y+') scale('+(activeOA==='VERDANT'?cpVerdantSymbolAspect():1)+' 1)');g.setAttribute('class','passive-node');g.innerHTML=`<circle class="passive-core" r="13"/><path class="passive-mark" d="M-7 0H7M0-7V7M-5-5L5 5M5-5L-5 5"/><text x="18" y="4">PSR-${String(n.id).padStart(2,'0')}</text>`;
 $('#passiveSensors').append(g);n.el=g;rebuildNAIs();tutorialAdvance('passive');log('PASSIVE ISR // PSR-'+String(n.id).padStart(2,'0')+' DEPLOYED');cpNotice('PASSIVE ISR DEPLOYED','COLLECTION FOOTPRINT ACTIVE','intel');sound('order');ui(true);return true
}
function ewoSweep(){
 if(!passiveEnabled()||!running)return;
  if(passiveCredits<EWO_COST){cpNotice('EWO SUPPORT','INSUFFICIENT ISR CREDITS // '+passiveCredits+'/'+EWO_COST,'intel');return}
 if(!T.some(t=>!t.done&&t.type==='UNKNOWN')){cpNotice('EWO SUPPORT','NO UNRESOLVED TRACKS IN AO','intel');return}
 ewoTargetMode=!ewoTargetMode;passiveDeployMode=false;rec('FLIGHT_ISOLATION',`EWO_TARGET ${ewoTargetMode?'ON':'OFF'} // flight=${A.mode}`);
 cpNotice('EWO SUPPORT',ewoTargetMode?'SELECT SWEEP ORIGIN ON MAP':'TARGETING CANCELLED','intel');ui(true)
}
function ewoFire(origin){
 if(!ewoTargetMode||passiveCredits<EWO_COST)return;ewoTargetMode=false;passiveCredits-=EWO_COST;ewoUses++;rec('FLIGHT_ISOLATION',`EWO_FIRE // flight=${A.mode}`);stopCollect();
 const circleScale=activeOA==='VERDANT'?cpVerdantSymbolAspect():1;const targets=T.filter(t=>!t.done&&t.type==='UNKNOWN').map(t=>({t,d:Math.hypot((t.x-origin.x)*circleScale,t.y-origin.y)})).sort((a,b)=>a.d-b.d);
 const layer=$('#ewoEffects');if(layer)layer.textContent='';const ring=document.createElementNS(NS,'circle');ring.setAttribute('class','ewo-wave');ring.setAttribute('cx',origin.x);ring.setAttribute('cy',origin.y);ring.setAttribute('r','0');ring.setAttribute('transform','translate('+origin.x+' '+origin.y+') scale('+circleScale+' 1) translate('+(-origin.x)+' '+(-origin.y)+')');layer.append(ring);
 const particles=[];for(let i=0;i<42;i++){let q=document.createElementNS(NS,'circle');q.setAttribute('class','ewo-particle');q.setAttribute('r',1+Math.random()*1.8);layer.append(q);particles.push({q,a:Math.random()*Math.PI*2,j:(Math.random()-.5)*18})}
 tutorialAdvance('ewo');const maxR=1100,dur=1900,t0=performance.now();sound('ewo');cpNotice('EWO SWEEP ACTIVE','RADIAL COLLECTION WAVE','intel');log('EWO SUPPORT // RADIAL SWEEP');
 let done=new Set();function frame(now){let f=Math.min(1,(now-t0)/dur),r=maxR*f;ring.setAttribute('r',r);ring.setAttribute('stroke-opacity',String(.95*(1-f*.55)));particles.forEach(p=>{let rr=Math.max(0,r+p.j);const px=origin.x+Math.cos(p.a)*rr*circleScale,py=origin.y+Math.sin(p.a)*rr;p.q.setAttribute('cx',px);p.q.setAttribute('cy',py);p.q.setAttribute('transform','translate('+px+' '+py+') scale('+circleScale+' 1) translate('+(-px)+' '+(-py)+')');p.q.setAttribute('fill-opacity',String(.85*(1-f*.45)))});targets.forEach(o=>{if(done.has(o.t)||o.d>r)return;done.add(o.t);let t=o.t;if(t.done||t.type!=='UNKNOWN'||(t.maritime&&!t.discovered))return;t.naiDerived=false;t.type=t.truth;cpTempestRecordEvidence(t,'EWO COLLECTION');cpPolarisRecordEvidence(t,'EWO COLLECTION');score+=25;ensureRing(t);pulse(t.type);log('EWO COLLECTION // '+designation(t)+' // '+t.type)});ui(true);if(f<1)requestAnimationFrame(frame);else{setTimeout(()=>layer.textContent='',220);cpNotice('EWO SWEEP COMPLETE',done.size+' TRACKS IDENTIFIED','intel');sound('classify')}}requestAnimationFrame(frame)
}
function passiveToggleDeploy(){if(!passiveEnabled()||!running)return;if(passiveNodes.length>=PASSIVE_MAX){cpNotice('PASSIVE ISR','MAXIMUM 9 NODES ACTIVE','intel');return}const cost=passiveCost();if(passiveCredits<cost){cpNotice('PASSIVE ISR','INSUFFICIENT ISR CREDITS // '+passiveCredits+'/'+cost,'intel');return}passiveDeployMode=!passiveDeployMode;rec('FLIGHT_ISOLATION',`PASSIVE_DEPLOY ${passiveDeployMode?'ON':'OFF'} // flight=${A.mode}`);if(passiveDeployMode){stopCollect();sel=null;log('PASSIVE ISR // SELECT DEPLOYMENT POINT')}ui(true)
}
function truth(){let r=Math.random();if(campaignMission==='ARCADE'){let threat=Math.min(.72,.42+(arcadeThreatLevel-1)*.045);return r<threat/2?'HOSTILE':r<threat?'IRREGULAR':r<threat+(1-threat)/2?'NEUTRAL':'FRIENDLY'}if(/^02-/.test(campaignMission||''))return r<.28?'HOSTILE':r<.50?'IRREGULAR':r<.76?'NEUTRAL':'FRIENDLY';if(campaignMission==='01-05')return r<.30?'HOSTILE':r<.60?'IRREGULAR':r<.80?'NEUTRAL':'FRIENDLY';if(campaignMission==='01-01'||campaignMission==='01-02'||campaignMission==='01-03'||campaignMission==='01-04')return r<.25?'HOSTILE':r<.50?'IRREGULAR':r<.75?'NEUTRAL':'FRIENDLY';if(phase===1)return r<.25?'HOSTILE':r<.38?'IRREGULAR':r<.68?'NEUTRAL':'FRIENDLY';if(phase===2)return r<.30?'HOSTILE':r<.48?'IRREGULAR':r<.75?'NEUTRAL':'FRIENDLY';return r<.34?'HOSTILE':r<.58?'IRREGULAR':r<.80?'NEUTRAL':'FRIENDLY'}function parms(){
 if(/^05-0[1-5]$/.test(campaignMission||''))return {gap:99,cap:50};
 if(/^06-0[1-5]$/.test(campaignMission||''))return {gap:7.5,cap:7};if(campaignMission==='ARCADE'){let l=Math.max(1,arcadeThreatLevel);return {gap:Math.max(2.4,8.5-(l-1)*.7),cap:Math.min(10,5+Math.floor((l-1)/2))}}
 if(/^02-/.test(campaignMission||''))return phase===1?{gap:8.2,cap:6}:phase===2?{gap:5.8,cap:7}:{gap:4.2,cap:8};
 if(campaignMission==='01-05')return phase===1?{gap:8.0,cap:6}:phase===2?{gap:5.5,cap:7}:{gap:3.8,cap:8};
 return phase===1?{gap:9.5,cap:5}:phase===2?{gap:6.5,cap:6}:{gap:4.5,cap:7}
}const PREFIX={UNKNOWN:'UNK',NEUTRAL:'NTL',HOSTILE:'HST',IRREGULAR:'IRG',FRIENDLY:'FRI',CYBER:'CYB'};function designation(t){let n=String(t.id).split('-').pop();return (t.type==='UNKNOWN'?'UNK':PREFIX[t.type]||'UNK')+'-'+n}function color(t){return t.type==='CYBER'?'#c65cff':t.type==='HOSTILE'?'#ff5b55':t.type==='IRREGULAR'?'#d8a83e':t.type==='NEUTRAL'?'#55d66b':t.type==='FRIENDLY'?'#4da3ff':'#dce5e8'}function vantageNetworkMission(){return /^02-0[3-5]$/.test(campaignMission||'')}

function vantageAffinityPlan(){
 if(campaignMission==='02-03')return ['ALPHA','BRAVO'];
 if(campaignMission==='02-04'||campaignMission==='02-05')return ['ALPHA','BRAVO','CHARLIE'];
 return [];
}

function vantageAffinityCounts(){
 const counts={};

 T.forEach(t=>{
  if(t.done||!t.vantageAffinity)return;
  counts[t.vantageAffinity]=(counts[t.vantageAffinity]||0)+1;
 });

 return counts;
}

function vantageAssignAffinity(t){
 if(!vantageNetworkMission()||!window.CP_VANTAGE_MAP)return;

 const hs=window.CP_VANTAGE_MAP.hotspots||[];
 const pairs=vantageAffinityPlan();

 if(!hs.length||!pairs.length)return;

 /*
  Keep a meaningful amount of ambient traffic.
  Network-affiliated contacts are opportunities, not answers.
 */
 if(Math.random()>.62)return;

 const counts=vantageAffinityCounts();

 /*
  Prefer incomplete relationship groups, but don't guarantee
  that every spawn becomes the missing partner.
 */
 const available=pairs.filter(p=>(counts[p]||0)<2);

 if(!available.length)return;

 const affinity=
  available[Math.floor(Math.random()*available.length)];

 const pairIndex=pairs.indexOf(affinity);
 const h=hs[pairIndex%hs.length];

 t.vantageAffinity=affinity;
 t.vantagePreferredHotspot=h.id;

 /*
  Affiliated tracks begin somewhere in the wider neighborhood,
  not stacked on top of one another.
 */
 const angle=Math.random()*Math.PI*2;
 const radius=55+Math.random()*70;

 t.x=h.x+Math.cos(angle)*radius;
 t.y=h.y+Math.sin(angle)*radius;

 t.x=Math.max(45,Math.min(855,t.x));
 t.y=Math.max(45,Math.min(605,t.y));

 t.stationary=false;

 /*
  Give the track ordinary movement. It is NOT steered back
  toward its partner or hotspot every frame.
 */
 const travel=Math.random()*Math.PI*2;
 const speed=1.15+Math.random()*1.15;

 t.vx=Math.cos(travel)*speed;
 t.vy=Math.sin(travel)*speed;
}

function vantageAffinityTick(now){
 if(!vantageNetworkMission()||!window.CP_VANTAGE_MAP)return;

 const hs=window.CP_VANTAGE_MAP.hotspots||[];

 T.forEach(t=>{
  if(
   t.done||
   !t.vantageAffinity||
   !t.vantagePreferredHotspot
  )return;

  /*
   Only occasionally bias an affiliated contact back toward
   its operating area. Normal movement dominates.
  */
  if(!t.vantageAffinityNext){
   t.vantageAffinityNext=
    now+18000+Math.random()*18000;
   return;
  }

  if(now<t.vantageAffinityNext)return;

  const h=hs.find(x=>x.id===t.vantagePreferredHotspot);

  if(!h)return;

  const dx=h.x-t.x;
  const dy=h.y-t.y;
  const d=Math.hypot(dx,dy);

  /*
   If the contact has wandered well away from its normal area,
   gently bias its heading back. No teleportation and no
   requirement that its partner be present.
  */
  if(d>115){
   const desired=Math.atan2(dy,dx);
   const noise=(Math.random()-.5)*1.0;
   const speed=1.0+Math.random()*.9;

   t.vx=Math.cos(desired+noise)*speed;
   t.vy=Math.sin(desired+noise)*speed;
  }else{
   /*
    Inside the operating area, allow ordinary/random movement
    so contacts may overlap naturally rather than stack.
   */
   const travel=Math.random()*Math.PI*2;
   const speed=.8+Math.random()*1.3;

   t.vx=Math.cos(travel)*speed;
   t.vy=Math.sin(travel)*speed;
  }

  t.vantageAffinityNext=
   now+18000+Math.random()*18000;
 });
}
function spawn(stationary=null){let p=parms();
if(stationary===null){
  if(campaignMission==='01-02'){
    stationary=campaignStationarySpawned<4 ? true : Math.random()<.45;
  }else stationary=Math.random()<.3;
}if(!running||T.filter(t=>!t.done).length>=p.cap)return;let x,y,vx=0,vy=0;if(stationary){x=130+Math.random()*640;y=90+Math.random()*460}else{let side=Math.floor(Math.random()*4),s=1.5+Math.random()*1.9;if(side===0){x=40;y=60+Math.random()*520;vx=s;vy=(Math.random()-.5)*1.3}else if(side===1){x=860;y=60+Math.random()*520;vx=-s;vy=(Math.random()-.5)*1.3}else if(side===2){x=60+Math.random()*780;y=40;vx=(Math.random()-.5)*1.3;vy=s}else{x=60+Math.random()*780;y=610;vx=(Math.random()-.5)*1.3;vy=-s}}if(/^06-0[35]$/.test(campaignMission||'')&&B.length){const site=B[(next-1)%B.length];x=site.x+(Math.random()-.5)*110;y=site.y+(Math.random()-.5)*90;stationary=Math.random()<.42}let tr=truth(),t={id:'UNK-'+String(next++).padStart(3,'0'),x,y,vx,vy,stationary,truth:tr,type:'UNKNOWN',cyberTrap:campaignMission==='ARCADE'&&Math.random()<.10,done:false,collecting:false,enemyRange:stationary?145:105,ring:null,bornAt:performance.now(),proxSite:null,proxSince:0,proxAssessed:false,hostileCollect:false,collectStarted:0,compromiseAdded:0,stallX:null,stallY:null,stallAt:performance.now(),stallLogged:false,naiSince:0,naiPct:0,naiDerived:false,priorityNAISince:0,priorityNAIPct:0,priorityNAICued:false,priorityNAIObserved:false,intel:{firstObserved:0,lastObserved:0,observations:0,wasObserved:false,lastX:null,lastY:null,obsPoints:[],siteObs:{},areaRecurrence:false,baselineEstablished:false,baselineX:null,baselineY:null,deviationCount:0,lastDeviationAt:0,lastDeviationX:null,lastDeviationY:null},lkp:null};
if(/^02-/.test(campaignMission||'')&&window.CP_VANTAGE_MAP){const hs=window.CP_VANTAGE_MAP.hotspots;if(hs.length&&Math.random()<.76){let h=hs[Math.floor(Math.random()*hs.length)];t.hotspot=h.id;t.x=h.x+(Math.random()-.5)*90;t.y=h.y+(Math.random()-.5)*90;t.stationary=Math.random()<.38;}}
if(campaignMission==='01-03'||campaignMission==='01-04'||campaignMission==='01-05'||campaignMission==='ARCADE'){
  const siteList=B.map(b=>({name:b.id,x:b.x,y:b.y}));
  if(siteList.length&&Math.random()<(campaignMission==='ARCADE'?.72:(campaignMission==='01-05'?.70:.58))){let ps=siteList[Math.floor(Math.random()*siteList.length)];t.proxSite=ps.name;t.x=ps.x+(Math.random()-.5)*105;t.y=ps.y+(Math.random()-.5)*105;t.proxSince=performance.now();t.stationary=Math.random()<.62}
}if(vantageNetworkMission())vantageAssignAffinity(t);if(campaignMission==='01-02'&&stationary)campaignStationarySpawned++;if(tr==='IRREGULAR'&&!stationary&&Math.random()<.72){let target=B[Math.floor(Math.random()*B.length)],dx=target.x-x,dy=target.y-y,d=Math.hypot(dx,dy),s=2.2+Math.random();t.vx=dx/d*s;t.vy=dy/d*s}let g=document.createElementNS(NS,'g'),hit=document.createElementNS(NS,'circle'),v=document.createElementNS(NS,'line'),c=document.createElementNS(NS,'circle'),d=document.createElementNS(NS,'path'),tx=document.createElementNS(NS,'text');g.style.cursor='pointer';g.style.pointerEvents='all';hit.setAttribute('r','29');hit.setAttribute('fill','transparent');v.setAttribute('stroke-opacity','.55');v.setAttribute('stroke-width','1.5');v.style.pointerEvents='none';c.setAttribute('r','17');c.setAttribute('fill','#0d1418');c.setAttribute('stroke-width','2');c.style.pointerEvents='none';d.setAttribute('d',stationary?'M-9 -9H9V9H-9Z':'M0 -8L8 0L0 8L-8 0Z');d.setAttribute('fill','none');d.setAttribute('stroke-width','2');d.style.pointerEvents='none';tx.setAttribute('x','25');tx.setAttribute('y','4');tx.setAttribute('font-size','11');tx.style.pointerEvents='none';g.append(hit,v,c,d,tx);Object.assign(t,{el:g,hit,v,c,d,tx});g.addEventListener('pointerdown',e=>{e.preventDefault();C.track++;rec('TRACK_POINTER',`${t.id} mode=${A.mode}`);e.stopPropagation();if(!running)return;if(passiveDeployMode){passivePlace({x:t.x,y:t.y});return}if(A.controlSelected){order({x:t.x,y:t.y});ui(true);return}sel=t;ui(true)});$('#tracks').append(g);T.push(t);log('NEW '+(stationary?'STATIC ':'')+'TRACK // '+t.id);sound('contact')}function ensureLKP(t){
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
function ensureRing(t){
    // Threat-range rings retired. Preserve the call interface.
    if(t && t.ring){
        t.ring.remove();
        t.ring=null;
    }
}
function cpTouchRadius(map=$('#map'),targetPx=22){const ctm=map?.getScreenCTM(),scale=ctm?Math.hypot(ctm.a,ctm.b):1;return Math.max(1,targetPx/(scale||1))}function draw(t){if(t.done){t.el.setAttribute('visibility','hidden');renderLKP(t);ensureRing(t);return}let inside=cpMapRadialDistance(A,t)<=cpEffectiveISRRadius(),knownLost=!!(t.intel&&t.intel.observations>0&&!t.intel.wasObserved&&!passiveCovered(t)),undiscovered=!!(t.maritime&&!t.discovered);t.el.setAttribute('visibility',knownLost||undiscovered?'hidden':'visible');renderLKP(t);{const k=activeOA==='VERDANT'?cpVerdantSymbolAspect():1;t.el.setAttribute('transform',`translate(${t.x} ${t.y}) scale(${k} 1)`);}let c=color(t);const campaignTraffic=activeOA==='TEMPEST'&&/^05-0[1-5]$/.test(campaignMission||'');t.c.setAttribute('r',sel===t?(campaignTraffic?'25':'22'):(campaignTraffic?'20':'17'));if(campaignTraffic&&t.hit)t.hit.setAttribute('r',String(cpTouchRadius()));t.c.setAttribute('stroke',c);const symbolPath=t.type==='CYBER'?'M0 -11L9 -5L9 5L0 11L-9 5L-9 -5ZM-5 0H5M0 -6V6':(t.stationary?'M-9 -9H9V9H-9Z':'M0 -8L8 0L0 8L-8 0Z');if(t.d.getAttribute('d')!==symbolPath)t.d.setAttribute('d',symbolPath);t.d.setAttribute('transform',campaignTraffic?'scale(1.25)':'');t.d.setAttribute('stroke',c);t.tx.setAttribute('fill',c);t.v.setAttribute('stroke',c);t.v.setAttribute('x2',t.vx*13);t.v.setAttribute('y2',t.vy*13);t.tx.textContent=designation(t)+' // '+(t.type==='UNKNOWN'&&t.naiSince?'NAI COLLECTING '+t.naiPct+'%':t.collecting?'COLLECTING '+pct+'%':t.type==='UNKNOWN'?(t.priorityNAISince?'PRIORITY NAI // AUTO COLLECTION '+t.priorityNAIPct+'%':naiForTrack(t)?'NAI // AUTO COLLECTION':passiveCovered(t)?(inside?'PASSIVE CUE // IN RANGE':'PASSIVE CUE'):(inside?'IN RANGE':'UNKNOWN')):t.type);ensureRing(t)}function pulse(k){let c=k==='CYBER'?'#c65cff':k==='HOSTILE'?'#ff5b55':k==='IRREGULAR'?'#d8a83e':k==='NEUTRAL'?'#55d66b':'#4da3ff';$('#sr').setAttribute('stroke',c);$('#sf').setAttribute('fill',c);$('#sr').setAttribute('stroke-width','5');$('#sf').setAttribute('fill-opacity','.13');setTimeout(()=>{$('#sr').setAttribute('stroke','currentColor');$('#sf').setAttribute('fill','currentColor');$('#sr').setAttribute('stroke-width','2.4');$('#sf').setAttribute('fill-opacity','.025')},850)}function naiClassify(t){if(!t||t.done||t.type!=='UNKNOWN'||(t.maritime&&!t.discovered))return;t.naiSince=0;t.naiPct=100;t.naiDerived=true;t.type=t.truth;cpTempestRecordEvidence(t,'NAI COLLECTION');cpPolarisRecordEvidence(t,'NAI COLLECTION');score+=25;if(campaignMission==='01-01'||campaignMission==='01-02')campaignIds++;if(campaignMission==='01-02'&&t.stationary)campaignStationaryAssessed++;if(campaignMission==='01-03'&&t.proxSite&&!t.proxAssessed){t.proxAssessed=true;campaignProximityAssessed++;}pulse(t.type);ensureRing(t);log('NAI CLASSIFIED // '+designation(t)+' // '+t.type);cpNotice('NAI AUTO COLLECTION',designation(t)+' // '+t.type,'intel');sound('classify');if(campaignMission==='01-02')cpCheck0102();if(campaignMission==='01-03')cpCheck0103();ui(true)}
function naiTick(now){if(!passiveEnabled()||!passiveNAIs.length)return;T.forEach(t=>{if(t.done||t.type!=='UNKNOWN'||t.collecting){t.naiSince=0;t.naiPct=0;return}const z=naiForTrack(t);if(!z){t.naiSince=0;t.naiPct=0;return}if(!t.naiSince){t.naiSince=now;t.naiPct=0;log('NAI-'+String(z.id).padStart(2,'0')+' // AUTO COLLECTION // '+t.id)}t.naiPct=Math.min(99,Math.floor((now-t.naiSince)*100/NAI_COLLECT_MS));if(now-t.naiSince>=NAI_COLLECT_MS)naiClassify(t)})}
const PRIORITY_NAI_COLLECT_MS=NAI_COLLECT_MS;
function cpCommittedPriorityNAIPoints(){const saved=readGlobalNAIs()[activeOA];return saved?.committed&&Array.isArray(saved.points)&&saved.points.length>=3?saved.points.map(p=>({x:p.x*900,y:p.y*650})):[];}
function cpPointInPoly(x,y,pts){let inside=false;for(let i=0,j=pts.length-1;i<pts.length;j=i++){const a=pts[i],b=pts[j],cross=((a.y>y)!==(b.y>y))&&(x<(b.x-a.x)*(y-a.y)/((b.y-a.y)||1e-9)+a.x);if(cross)inside=!inside;}return inside;}
function cpPriorityNAICovered(t){const pts=cpCommittedPriorityNAIPoints();return pts.length>=3&&cpPointInPoly(t.x,t.y,pts);}
function cpPriorityNAIClassify(t){if(!t||t.done||t.type!=='UNKNOWN'||(t.maritime&&!t.discovered))return;t.priorityNAISince=0;t.priorityNAIPct=100;t.priorityNAICued=false;t.priorityNAIObserved=true;t.naiDerived=true;t.type=t.truth;cpTempestRecordEvidence(t,'NAI COLLECTION');score+=25;if(campaignMission==='01-01'||campaignMission==='01-02')campaignIds++;if(campaignMission==='01-02'&&t.stationary)campaignStationaryAssessed++;if(campaignMission==='01-03'&&t.proxSite&&!t.proxAssessed){t.proxAssessed=true;campaignProximityAssessed++;}pulse(t.type);ensureRing(t);log('PRIORITY NAI CLASSIFIED // '+designation(t)+' // '+t.type);cpNotice('PRIORITY NAI AUTO COLLECTION',designation(t)+' // '+t.type,'intel');sound('classify');if(campaignMission==='01-02')cpCheck0102();if(campaignMission==='01-03')cpCheck0103();ui(true);}
function cpPriorityNAITick(now){const pts=cpCommittedPriorityNAIPoints();T.forEach(t=>{if(t.done||t.type!=='UNKNOWN'||t.collecting||pts.length<3||!cpPointInPoly(t.x,t.y,pts)){t.priorityNAISince=0;t.priorityNAIPct=0;return;}if(!t.priorityNAISince){t.priorityNAISince=now;t.priorityNAIPct=0;log('PRIORITY NAI // AUTO COLLECTION // '+t.id);}t.priorityNAIPct=Math.min(99,Math.floor((now-t.priorityNAISince)*100/PRIORITY_NAI_COLLECT_MS));if(now-t.priorityNAISince>=PRIORITY_NAI_COLLECT_MS)cpPriorityNAIClassify(t);});}
function cpCyberActive(){return campaignMission==='ARCADE'&&cyberDegradedUntil>performance.now()}
function cpCyberPulse(t){const layer=$('#decisionFeedback');if(!layer||!t)return;const p=document.createElementNS(NS,'circle');p.setAttribute('class','cyber-compromise-pulse');p.setAttribute('cx',t.x);p.setAttribute('cy',t.y);p.setAttribute('r','18');layer.appendChild(p);setTimeout(()=>p.remove(),1100)}
function cpCyberTrigger(t){
 if(campaignMission!=='ARCADE'||!t)return;
 if(cpCyberActive()){cpNotice('CYBER/EW SIGNATURE','THREAT NODE EXPOSED // SYSTEM DEGRADATION ALREADY ACTIVE','intel');return;}
 sound('cyberAttack');
 cyberDegradedUntil=performance.now()+10000;cyberRecoverNotice=true;cyberNextGlitch=0;document.body.classList.add('cyber-compromised');cpCyberPulse(t);cpCyberGlitchBurst(true);setTimeout(()=>cpCyberActive()&&cpCyberGlitchBurst(true),110);setTimeout(()=>cpCyberActive()&&cpCyberGlitchBurst(true),260);banner('CYBER/EW COMPROMISE',1400);cpNotice('COLLECTION SYSTEM COMPROMISED','ISR SYSTEMS // DEGRADED // 10 SEC','hostile');log('CYBER/EW COMPROMISE // ISR RADIUS -40% // COLLECTION -50% // MOVEMENT -20%');
}
function cpCyberClear(reason='ISR SYSTEMS // RESTORED'){
 const was=cyberDegradedUntil>0;cyberDegradedUntil=0;cyberRecoverNotice=false;cyberNextGlitch=0;document.body.classList.remove('cyber-compromised');document.querySelectorAll('.cyber-glitch-fragment').forEach(n=>n.remove());if(was){cpNotice('CYBER/EW RECOVERY',reason,'friendly');log('CYBER/EW // '+reason)}
}
function cpCyberReset(){cyberDegradedUntil=0;cyberRecoverNotice=false;cyberNextGlitch=0;document.body.classList.remove('cyber-compromised');document.querySelectorAll('.cyber-glitch-fragment').forEach(n=>n.remove())}
function cpCyberGlitchBurst(strong=false){if(!cpCyberActive())return;const host=document.body,count=strong?9:3+Math.floor(Math.random()*4);for(let i=0;i<count;i++){const n=document.createElement('i');n.className='cyber-glitch-fragment'+(strong?' strong':'');n.style.left=(Math.random()*92)+'vw';n.style.top=(Math.random()*92)+'vh';n.style.width=(8+Math.random()*(strong?35:22))+'vw';n.style.height=(2+Math.random()*(strong?10:5))+'px';n.style.setProperty('--gx',((Math.random()-.5)*(strong?42:22)).toFixed(0)+'px');n.style.setProperty('--gy',((Math.random()-.5)*(strong?12:6)).toFixed(0)+'px');host.appendChild(n);setTimeout(()=>n.remove(),90+Math.random()*(strong?210:130));}}
function cpCyberTick(){const now=performance.now();if(cyberRecoverNotice&&cyberDegradedUntil&&now>=cyberDegradedUntil){cpCyberClear('ISR SYSTEMS // AUTOMATIC RECOVERY COMPLETE');return}if(cpCyberActive()&&now>=cyberNextGlitch){cpCyberGlitchBurst(false);cyberNextGlitch=now+180+Math.random()*620;}}
function verdantTrafficCollect(){
 const m=verdantTrafficSel;if(!running||!m||m.type!=='UNKNOWN'||!m.inCoverage||m.collecting)return;
 stopCollect();m.collecting=true;col=m;const started=performance.now(),base=m.collectMs||0;
 ci=setInterval(()=>{if(!m.inCoverage){m.collecting=false;clearInterval(ci);ci=null;col=null;verdantTrafficSpot();ui(true);return;}m.collectMs=Math.min(VERDANT_TRAFFIC_COLLECT_MS,base+(performance.now()-started));pct=Math.floor(m.collectMs/VERDANT_TRAFFIC_COLLECT_MS*100);verdantTrafficSpot();ui(true);if(m.collectMs>=VERDANT_TRAFFIC_COLLECT_MS){clearInterval(ci);ci=null;col=null;m.collecting=false;m.type=m.truth;m.collectMs=VERDANT_TRAFFIC_COLLECT_MS;score+=25;pulse(m.type);log('CLASSIFIED // '+m.id+' // '+m.type);sound('classify');verdantTrafficRender();verdantTrafficSpot();verdantMissionProgress();ui(true);}},80);
}
function collect(){if(/^04-0[1-5]$/.test(campaignMission||'')&&(mirageSiteSel||mirageTrafficSel)){mirageCollect();return;}if(/^03-0[1-5]$/.test(campaignMission||'')&&verdantTrafficSel){verdantTrafficCollect();return;}if(!running||!sel||sel.done||sel.type!=='UNKNOWN'||D(A,sel)>cpEffectiveISRRadius()||col)return;col=sel;col.collecting=true;pct=0;let st=Date.now(),collectMs=(passiveCovered(col)?550:1000)*(cpCyberActive()?2:1);ci=setInterval(()=>{pct=Math.min(99,Math.floor((Date.now()-st)*100/collectMs));ui(true)},80);ct=setTimeout(()=>{clearInterval(ci);ci=ct=null;col.collecting=false;if(campaignMission==='ARCADE'&&col.cyberTrap){col.truth='CYBER';col.type='CYBER';cpCyberTrigger(col)}else col.type=col.truth;cpTempestRecordEvidence(col);cpPolarisRecordEvidence(col,'ISR COLLECTION');score+=25;if(campaignMission==='01-01'||campaignMission==='01-02')campaignIds++;
if(campaignMission==='01-02'&&col.stationary)campaignStationaryAssessed++;
if(campaignMission==='01-03'&&col.proxSite&&!col.proxAssessed){col.proxAssessed=true;campaignProximityAssessed++;}
pct=100;pulse(col.type);ensureRing(col);log('CLASSIFIED // '+designation(col)+' // '+col.type);sound('classify');tutorialAdvance('classified');col=null;if(campaignMission==='01-02')cpCheck0102();if(campaignMission==='01-03')cpCheck0103();ui(true)},collectMs)}function cpDecisionFloat(t,ok){
 const layer=$('#decisionFeedback');if(!layer||!t)return;
 const n=document.createElementNS(NS,'text');
 let cls='bad';
 if(ok)cls=t.truth==='CYBER'?'good-cyber':t.truth==='HOSTILE'?'good-hostile':t.truth==='IRREGULAR'?'good-irregular':t.truth==='FRIENDLY'?'good-friendly':'good-neutral';
 n.setAttribute('class','decision-float '+cls);
 n.setAttribute('x',t.x);n.setAttribute('y',t.y-24);
 n.textContent=ok?'+1':'-1';layer.appendChild(n);
 setTimeout(()=>n.remove(),1150);
}
function decide(a){
 if(!running||!sel||sel.done||sel.type==='UNKNOWN')return;
 const target=sel;
 const threat=target.type==='HOSTILE'||target.type==='IRREGULAR'||target.type==='CYBER';
 const ok=(threat&&a==='INTERCEPT')||(!threat&&a==='CLEAR');
 if(campaignMission==='RETRO'){
   if(ok){score+=100;if(threat)ints++;log(a+' // '+designation(target)+' // CORRECT');if((target.type==='HOSTILE'||target.type==='IRREGULAR')&&a==='INTERCEPT')sound('explosion');else if(target.type==='CYBER'&&a==='INTERCEPT')sound('cyberDisrupt');else if(a==='CLEAR')sound('clear');}
   else{score-=50;log(a+' // '+designation(target)+' // ERROR');sound('wrong');}
   decisionTotal++;if(ok)decisionCorrect++;integrity=decisionTotal?Math.round(decisionCorrect/decisionTotal*100):100;
   cpDecisionFloat(target,ok);
   target.done=true;ensureRing(target);resolved++;sel=null;ui(true);return;
 }
 if(ok){
   if(campaignMission==='ARCADE'){arcadeCorrect++;arcadeStreak++;arcadeBestStreak=Math.max(arcadeBestStreak,arcadeStreak);score+=Math.min(250,arcadeStreak*10);}
   score+=100;
   if((target.type==='HOSTILE'||target.type==='IRREGULAR')&&a==='INTERCEPT')sound('explosion');
   if(target.type==='CYBER'&&a==='INTERCEPT'){sound('cyberDisrupt');cpNotice('CYBER/EW INTERCEPT','THREAT NODE DISRUPTION IN PROGRESS // 2 SEC','intel');setTimeout(()=>{if(cpCyberActive()){cpCyberGlitchBurst(true);setTimeout(()=>cpCyberClear('THREAT NODE DISRUPTED // ISR SYSTEMS RESTORED'),120)}},2000);}
   passiveAward(target.naiDerived?5:10,target.naiDerived?'NAI DISPOSITION':'CORRECT DISPOSITION');
   if(campaignMission==='01-01'||campaignMission==='01-02'||campaignMission==='01-03'||campaignMission==='01-04'||campaignMission==='01-05'||campaignMission==='05-01'||/^02-/.test(campaignMission||'')||/^06-0[1-5]$/.test(campaignMission||'')||campaignMission==='ARCADE'){
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
 if(!ok){sound('wrong');if(campaignMission==='05-01'&&target.maritime){log('UNSUPPORTED DISPOSITION // INTELLIGENCE INTEGRITY PENALTY');cpNotice('UNSUPPORTED CLASSIFICATION','Disposition conflicts with collected maritime ISR evidence. Intelligence integrity reduced.','intel')}}else if(!threat&&a==='CLEAR')sound('clear');
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
 if(/^05-0[1-5]$/.test(campaignMission||'')){if(!ok&&target.maritime&&campaignMission!=='05-01')cpTempestPenalty('Disposition conflicts with collected maritime evidence.');if(ok&&!['HOSTILE','IRREGULAR'].includes(target.truth)&&target.maritime)tempestMissionStats.benign.add(target.id);if(campaignMission==='05-01')cpCheck0501();else cpTempestCheck()}if(cpPolarisId())cpPolarisRecordResolution(target,ok);if(campaignMission==='ARCADE'&&integrity<=0&&!campaignFinished)arcadeFinish('INTELLIGENCE FAILURE');
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
 if(!usesIntelDrops()||campaignMission==='TUTORIAL'||intelDropOffered||campaignFinished)return;
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
 if(campaignMission!=='TUTORIAL'&&!intelDropOffered&&intelDropAt&&now>=intelDropAt)cpIntelDropOffer();
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
function cpEffectiveISRRadius(){const posture=Number.isFinite(A.sensorPosture)?A.sensorPosture:1;if(campaignMission==='RETRO')return A.r*posture;normalizeISRCapability();const packageRadius=isrCapability==='WIDE'?1.10:isrCapability==='ORBIT'&&A.mode==='LOITER'?1.15:1,cyberFactor=cpCyberActive()?(isrCapability==='HARDENED'?.75:.60):1;return A.r*posture*packageRadius*(cpFusionActive()?1.30:1)*cyberFactor}
function cpDegradedCount(){return B.filter(b=>b.degraded).length}
function cpRenderBlueSite(b){
    if(!b||!b.el)return;

    const c=b.reconstituting?'#d8a83e':b.degraded?'#ff5b55':'#4da3ff';
    const health=Math.max(0,Math.min(100,100-(b.exposure||0)));

    const attr=(el,name,value)=>{
        if(!el)return;
        const next=String(value);
        if(el.getAttribute(name)!==next)el.setAttribute(name,next);
    };

    const text=(el,value)=>{
        if(!el)return;
        const next=String(value);
        if(el.textContent!==next)el.textContent=next;
    };

    attr(b.circle,'stroke',c);
    attr(b.icon,'stroke',c);

    if(b.label){
        attr(b.label,'fill',c);
        text(b.label,b.id+(b.reconstituting?' // RECON':b.degraded?' // DEGRADED':''));
    }

    if(b.healthFill){
        attr(b.healthFill,'width',50*health/100);
        attr(b.healthFill,'fill',c);
    }

    if(b.healthText){
        attr(b.healthText,'fill',c);
        text(b.healthText,Math.round(health)+'%');
    }
}
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
function updateTrackMemory(now){if(!running||campaignMission==='RETRO')return;T.forEach(t=>{if(t.done||!t.intel)return;const observed=cpMapRadialDistance(A,t)<=cpEffectiveISRRadius(),was=t.intel.wasObserved;if(observed){if(!was){t.intel.observations++;if(!t.intel.firstObserved)t.intel.firstObserved=now;recordPatternObservation(t,now);cpPolarisRecordObservation(t);rec('TRACK_OBS',t.id+' observation='+t.intel.observations)}t.intel.lastObserved=now;t.intel.lastX=t.x;t.intel.lastY=t.y}else if(was){rec('TRACK_LKP',t.id+' '+Math.round(t.intel.lastX)+'/'+Math.round(t.intel.lastY))}t.intel.wasObserved=observed})}
function associationLevel(n){return n>=1?'SUPPORTED':'POSSIBLE'}
function associationEntries(t){let out=[];networkAssociations.forEach((v,k)=>{let [a,b]=k.split('|');if(a===t.id||b===t.id)out.push({id:a===t.id?b:a,count:v.count,level:associationLevel(v.count),hotspot:v.hotspot})});return out.sort((a,b)=>b.count-a.count)}
function networkTick(now){
 if(!/^02-/.test(campaignMission||''))return;

 let obs=T.filter(t=>!t.done&&t.intel?.wasObserved);

 obs.forEach(t=>{
  if(t.intel.observations>=2)campaign02ContinuityTracks.add(t.id)
 });

 for(let a=0;a<obs.length;a++)for(let b=a+1;b<obs.length;b++){
  let x=obs[a],y=obs[b];

  if(vantageNetworkMission()){
   if(
    !x.vantageAffinity||
    !y.vantageAffinity||
    x.vantageAffinity!==y.vantageAffinity
   )continue;
  }

  if(Math.hypot(x.x-y.x,x.y-y.y)>125)continue;

  let key=[x.id,y.id].sort().join('|');

  /*
   Relationship discovery is binary.
   Once this legitimate pair has been observed, it is known.
  */
  if(networkAssociations.has(key))continue;

  let hotspot='CO-LOCATION';

  if(window.CP_VANTAGE_MAP){
   let best=Infinity;

   window.CP_VANTAGE_MAP.hotspots.forEach(h=>{
    let d=(
     Math.hypot(x.x-h.x,x.y-h.y)+
     Math.hypot(y.x-h.x,y.y-h.y)
    )/2;

    if(d<best&&d<135){
     best=d;
     hotspot=h.id
    }
   })
  }

  networkAssociations.set(key,{
   count:1,
   hotspot,
   affinity:x.vantageAffinity||null
  });

  campaign02AssocEvents++;

  cpNotice(
   'RELATIONSHIP DEVELOPED',
   x.id+' + '+y.id+' // SUPPORTED',
   'intel'
  );
 }
}
function campaign02Stats(){
 let supported=networkAssociations.size;

 /*
  An established network means the analyst has developed
  at least three legitimate observed relationships.
 */
 let established=supported>=3?1:0;

 return{
  continuity:campaign02ContinuityTracks.size,
  patterns:campaign02PatternTracks.size,
  associations:campaign02AssocEvents,
  supported,
  established
 }
}
function updateSpotReport(t,inside){const box=$('#spotReport');if(!box)return;if(/^04-0[1-5]$/.test(campaignMission||'')&&(mirageSiteSel||mirageTrafficSel)){mirageSpot();return;}if(verdantSmartActive&&activeOA==='VERDANT'&&verdantTrafficSel){verdantTrafficSpot();return;}if(!t||t.done){box.hidden=true;return}box.hidden=false;const c=color(t);box.style.setProperty('--spot-color',c);$('#spotTitle').textContent='SPOT // '+designation(t);$('#spotClass').textContent=t.type;let context=t.type==='UNKNOWN'?(t.collecting?'COLLECTION // '+pct+'%':inside?'COLLECT // AVAILABLE':'COLLECT // NO COVERAGE'):'CONF // CONFIRMED';$('#spotContext').textContent=context;if(t.maritime&&/^05-0[2-5]$/.test(campaignMission||''))$('#spotContext').textContent='AIS // '+(t.aisAvailable?'REPORTING':'INTERMITTENT')+' // OBS '+(t.tempestObservationCount||0)+(t.identityDiscrepancy?' // ID DISCREPANCY':'')+(t.routeDeviation?' // ROUTE DEVIATION':'')+(t.collectionEvidence?' // EVIDENCE COLLECTED':'')+(['05-03','05-05'].includes(campaignMission)?' // SHARED PORT '+t.networkGroup:'')+' // HISTORY '+(t.tempestHistory?.length||0)+(t.intel?.lastX!=null?' // LKP '+Math.round(t.intel.lastX)+'/'+Math.round(t.intel.lastY):'')+(['05-04','05-05'].includes(campaignMission)?' // WINDOW '+Math.max(0,Math.ceil((t.priorityWindowMs-(performance.now()-t.tempestSpawnAt))/1000))+'s':'')}function detail(){if(/^04-0[1-5]$/.test(campaignMission||'')&&(mirageSiteSel||mirageTrafficSel)){mirageDetail();return;}if(/^03-0[1-5]$/.test(campaignMission||'')&&verdantTrafficSel){const m=verdantTrafficSel,inside=!!m.inCoverage,u=m.type==='UNKNOWN';$('#collect').hidden=false;$('#collect').textContent=u?(inside?(m.collectMs?'RESUME COLLECT':'COLLECT'):'COLLECT // NO COVERAGE'):'COLLECTION COMPLETE';$('#collect').disabled=!running||!u||!inside||m.collecting;$('#prog').hidden=!m.collecting;$('#pct').textContent=Math.floor((m.collectMs||0)/VERDANT_TRAFFIC_COLLECT_MS*100)+'%';$('#bar').style.width=Math.floor((m.collectMs||0)/VERDANT_TRAFFIC_COLLECT_MS*100)+'%';$('#dec').hidden=true;return;}if(!sel||sel.done){updateSpotReport(null,false);const pb=$('#tempestPriority'),priorityRow=$('#tempestPriorityRow');if(pb)pb.hidden=true;if(priorityRow)priorityRow.hidden=true;document.querySelector("#dec").classList.remove("has-tempest-priority");$('#none').hidden=false;$('#detail').hidden=true;return}$('#none').hidden=true;$('#detail').hidden=false;let d=D(A,sel),inside=d<=cpEffectiveISRRadius(),u=sel.type==='UNKNOWN';updateSpotReport(sel,inside);$('#tid').textContent=designation(sel);$('#type').textContent=sel.type;$('#motion').textContent=sel.stationary?'STATIONARY':'MOBILE';if(sel.maritime&&/^05-0[2-5]$/.test(campaignMission||'')){$('#type').textContent=sel.type;$('#motion').textContent='AIS '+(sel.aisAvailable?'REPORTING':'INTERMITTENT')+' // OBS '+(sel.tempestObservationCount||0)}
let obsRow=$('#observedRow');if(obsRow){let show=sel.type!=='UNKNOWN';obsRow.hidden=!show;if(show){let sec=Math.max(0,Math.floor((performance.now()-sel.bornAt)/1000));$('#observed').textContent=String(Math.floor(sec/60)).padStart(2,'0')+':'+String(sec%60).padStart(2,'0')}}
let intel=sel.intel;if(intel){$('#intelObs').textContent=String(intel.observations);$('#intelFirst').textContent=intelClock(intel.firstObserved);$('#intelLast').textContent=intelClock(intel.lastObserved);$('#intelPos').textContent=intel.lastX==null?'--':Math.round(intel.lastX)+' / '+Math.round(intel.lastY);let posStatus=$('#intelPositionStatus'),posConf=$('#intelPositionConfidence'),assessment=$('#intelAssessment');if(posStatus)posStatus.textContent=intel.wasObserved?'CURRENT':'LAST KNOWN';if(posConf)posConf.textContent=intel.wasObserved?'CURRENT':lkpConfidence(sel);if(assessment){let a=intelligenceAssessment(sel);assessment.textContent=a;assessment.className=a==='SIGNIFICANT ACTIVITY'?'assessment-significant':a==='PATTERN DEVELOPING'?'assessment-developing':'assessment-insufficient'}let pats=patternIndicators(sel),box=$('#patternIndicators'),list=$('#patternList');if(box&&list){box.classList.toggle('hidden',intelAssistMode()!=='FULL'||!pats.length);list.textContent='';pats.forEach(([label,val])=>{let row=document.createElement('div');row.className='pattern-indicator';let a=document.createElement('span'),b=document.createElement('b');a.textContent=label;b.textContent=val;row.append(a,b);list.append(row)})}let nb=$('#networkAssociations'),nl=$('#networkAssociationList');if(nb&&nl){let ae=associationEntries(sel);nb.classList.toggle('hidden',!usesNetworkAnalysis()||!ae.length);nl.textContent='';ae.slice(0,5).forEach(e=>{let r=document.createElement('div');r.className='pattern-indicator';r.innerHTML='<span>'+e.id+' // '+e.hotspot.replaceAll('-',' ')+'</span><b>'+e.level+' // '+e.count+'</b>';nl.append(r)})}applyIntelAssistPresentation()}$('#dist').textContent=Math.round(d)+' GRID';$('#sense').textContent=inside?'IN RANGE':'OUT OF RANGE';$('#collect').hidden=false;$('#collect').textContent=u?(inside?'COLLECT':'COLLECT // NO COVERAGE'):'COLLECTION COMPLETE';$('#collect').disabled=!u||!inside||!!col;$('#prog').hidden=col!==sel;$('#pct').textContent=pct+'%';$('#bar').style.width=pct+'%';$('#dec').hidden=u;const pb=$('#tempestPriority'),priorityRow=$('#tempestPriorityRow');if(pb){const show=['05-04','05-05'].includes(campaignMission)&&!!sel?.maritime;if(priorityRow)priorityRow.hidden=!show;document.querySelector("#dec").classList.toggle("has-tempest-priority",show);pb.hidden=!show;pb.disabled=!running||!sel||sel.type==='UNKNOWN'||!cpTempestPrioritySupported(sel)||!sel.priorityWindowOpen||tempestPrioritized.has(sel.id);pb.textContent=sel&&tempestPrioritized.has(sel.id)?'PRIORITY SET':'PRIORITIZE // SUPPORTED TARGET'}}function cpStatusClass(el,state){if(!el)return;el.classList.remove('status-good','status-warn','status-bad');el.classList.add(state)}
function cpRefreshStatusColors(){
 let integrityState=integrity>=80?'status-good':integrity>=60?'status-warn':'status-bad';
 let oeState=campaignCompromise<30?'status-good':campaignCompromise<50?'status-warn':'status-bad';
 cpStatusClass($('#integrity'),integrityState);cpStatusClass($('#objIntegrity'),integrityState);
 cpStatusClass($('#comp'),oeState);cpStatusClass($('#objCompromise'),oeState);
}
function displayMode(mode){return String(mode||'STANDBY').replaceAll('_',' ')}function ui(force=false){document.body.classList.toggle('arcade-ui',campaignMission==='ARCADE'||campaignMission==='RETRO');document.body.classList.toggle('verdant-timeless-ui',/^03-0[1-5]$/.test(campaignMission||''));let now=performance.now();if(!force&&now-lastUi<200)return;lastUi=now;const cpVerdantUiValues=/^03-0[1-5]$/.test(campaignMission||'')?verdantMissionValues():null;let p=parms(),c=(cpThreatMission()?campaignCompromise:compromise()),n=/^04-0[1-5]$/.test(campaignMission||'')?mirageTraffic.filter(t=>t.type==='UNKNOWN'&&Math.hypot(A.x-t.x,A.y-t.y)<=cpEffectiveISRRadius()).length:T.filter(t=>!t.done&&t.type==='UNKNOWN'&&cpMapRadialDistance(A,t)<=cpEffectiveISRRadius()).length;$('#stateLine').textContent=A.controlSelected?'ISR CONTROL // SELECT DESTINATION':'ISR // '+displayMode(A.mode);$('#rangeLine').textContent='SENSOR // '+n+' UNKNOWN IN RANGE';$('#score').textContent=String(Math.max(0,Math.round(score))).padStart(4,'0');$('#integrity').textContent=Math.round(integrity)+'%';$('#comp').textContent=Math.round(c)+'%';const compCard=$('#comp')?.closest('.op-status-item');if(compCard)compCard.style.display=((activeOA==='VERDANT'&&/^03-/.test(campaignMission||''))||(activeOA==='MIRAGE'&&/^04-/.test(campaignMission||'')))?'none':'';const cm=$('#compMeter'),im=$('#integrityMeter');if(cm){cm.style.width=Math.min(100,Math.max(0,c))+'%';cm.className=c>=50?'danger':c>=30?'warn':''}if(im){im.style.width=Math.min(100,Math.max(0,integrity))+'%';im.className=integrity<40?'danger':integrity<80?'warn':''}$('#compTop').textContent=Math.round(c)+'%';$('#resolved').textContent=resolved;$('#ints').textContent=ints;
let or=$('#objResolved'),oi=$('#objInterrupted'),og=$('#objIntegrity'),oc=$('#objCompromise'),ot=$('#objectiveTracker'),
    ott=$('#objectiveTitle'),osl=$('#objectiveSecondaryLabel'),osc=$('#objectiveSecondaryChip'),otc=$('#objectiveThirdChip'),otl=$('#objectiveThirdLabel'),oec=$('#objectiveOEChip');
if(ot)ot.style.display=usesObjectiveTracker()?'flex':'none';cpTempestObjectiveExtra();cpPolarisObjectiveExtra();
if(campaignMission&&or){
 let title='ESTABLISH',resolveTarget=10,secondaryLabel='',secondaryValue='',secondaryComplete=false,showOE=false;
 if(campaignMission==='ARCADE'){title='ARCADE // THREAT '+arcadeThreatLevel;resolveTarget=Math.max(1,arcadeCorrect);secondaryLabel='STREAK';secondaryValue=arcadeStreak+' / '+arcadeBestStreak;secondaryComplete=arcadeStreak>=5;showOE=true}
 if(campaignMission==='RETRO'){title='SURVIVE';resolveTarget=Math.max(1,resolved);secondaryLabel='';secondaryValue='';secondaryComplete=false;showOE=true}
 if(campaignMission==='01-02'){title='PATTERN';resolveTarget=12;secondaryLabel='STATIONARY';secondaryValue=campaignStationaryAssessed+'/4';secondaryComplete=campaignStationaryAssessed>=4}
 if(campaignMission==='01-03'){title='INDICATORS';resolveTarget=14;secondaryLabel='PROXIMITY';secondaryValue=campaignProximityAssessed+'/5';secondaryComplete=campaignProximityAssessed>=5}
 if(campaignMission==='01-04'){title='CONTESTED';resolveTarget=14;secondaryLabel='INTERRUPT';secondaryValue=campaignCollectionInterrupted+'/4';secondaryComplete=campaignCollectionInterrupted>=4;showOE=true}
 if(campaignMission==='01-05'){title='CONDITIONS SET';resolveTarget=16;secondaryLabel='INTERRUPT';secondaryValue=campaignCollectionInterrupted+'/5';secondaryComplete=campaignCollectionInterrupted>=5;showOE=true}
 if(campaignMission==='05-01'){title='SEA LANES';resolveTarget=10;secondaryLabel='COLLECTION';secondaryValue=Math.min(tempestEvidence,8)+'/8';secondaryComplete=tempestEvidence>=8;showOE=false;campaignCorrect=resolved}else if(/^05-0[2-5]$/.test(campaignMission||'')){const m=cpTempestMetrics(),g=TEMPEST_CAMPAIGN_OBJECTIVES[campaignMission];title=TEMPEST_BRIEFS[campaignMission].title;resolveTarget=g.resolve;secondaryLabel='EVIDENCE';secondaryValue=Math.min(m.evidence,g.evidence)+'/'+g.evidence;secondaryComplete=m.evidence>=g.evidence;showOE=false;campaignCorrect=Math.min(resolved,g.resolve)}
 if(campaignMission==='04-01'){const v=mirageMissionValues();title='INVENTORY';resolveTarget=4;secondaryLabel='TRACKS';secondaryValue=Math.min(v[1],4)+'/4';secondaryComplete=v[1]>=4;showOE=false;campaignCorrect=Math.min(v[0],4);}else if(campaignMission==='04-02'){const v=mirageMissionValues();title='CAPACITY';resolveTarget=3;secondaryLabel='LINKS';secondaryValue=Math.min(v[1],5)+'/5';secondaryComplete=v[1]>=5;showOE=false;campaignCorrect=Math.min(v[0],3);}else if(campaignMission==='04-03'){const v=mirageMissionValues();title='POSTURE';resolveTarget=3;secondaryLabel='CORROB';secondaryValue=Math.min(v[1],2)+'/2';secondaryComplete=v[1]>=2;showOE=false;campaignCorrect=Math.min(v[0],3);}else if(campaignMission==='04-04'){const v=mirageMissionValues();title='INDICATIONS';resolveTarget=3;secondaryLabel='CORROB';secondaryValue=Math.min(v[1],2)+'/2';secondaryComplete=v[1]>=2;showOE=false;campaignCorrect=Math.min(v[0],3);}else if(campaignMission==='04-05'){const v=mirageMissionValues();title='WARNING';resolveTarget=3;secondaryLabel='CORROB';secondaryValue=Math.min(v[1],2)+'/2';secondaryComplete=v[1]>=2;showOE=false;campaignCorrect=Math.min(v[0],3);}
 if(/^03-0[1-5]$/.test(campaignMission||'')){
   const m=VERDANT_MISSIONS[campaignMission],v=cpVerdantUiValues;
   title=m.title;resolveTarget=m.goals[0];secondaryLabel=campaignMission==='03-01'?'TRAFFIC':campaignMission==='03-02'?'ANOMALY':campaignMission==='03-03'?'TRANSFER':campaignMission==='03-04'?'SIGNATURE':'PRESERVE';
   secondaryValue=Math.min(v[1],m.goals[1])+'/'+m.goals[1];secondaryComplete=v[1]>=m.goals[1];showOE=false;campaignCorrect=Math.min(v[0],m.goals[0]);
  }
  if(/^06-0[1-5]$/.test(campaignMission||'')){const cfg=POLARIS_OBJECTIVES[campaignMission];title=POLARIS_BRIEFS[campaignMission].title;resolveTarget=cfg.resolve;secondaryLabel=cfg.metricLabel;secondaryValue=Math.min(cpPolarisMetricValue(),cfg.metricTarget)+'/'+cfg.metricTarget;secondaryComplete=cpPolarisMetricValue()>=cfg.metricTarget;showOE=false}if(/^02-/.test(campaignMission||'')){let s=campaign02Stats(),m=C02[campaignMission];title=m?m.title:'NETWORK';if(campaignMission==='02-01'){resolveTarget=8;secondaryLabel='CONTINUITY';secondaryValue=s.continuity+'/4';secondaryComplete=s.continuity>=4}else if(campaignMission==='02-02'){resolveTarget=10;secondaryLabel='PATTERNS';secondaryValue=s.patterns+'/3';secondaryComplete=s.patterns>=3}else if(campaignMission==='02-03'){resolveTarget=10;secondaryLabel='ASSOC';secondaryValue=s.associations+'/3';secondaryComplete=s.associations>=3&&s.supported>=1}else if(campaignMission==='02-04'){resolveTarget=12;secondaryLabel='SUPPORTED';secondaryValue=s.supported+'/3';secondaryComplete=s.supported>=3&&s.established>=1}else{resolveTarget=14;secondaryLabel='ESTABLISHED';secondaryValue=s.established+'/1';secondaryComplete=s.established>=1}showOE=usesThreatEnvironment()}
 if(ott){ott.textContent='OBJECTIVES // '+title;if(campaignMission==='RETRO'){ott.classList.remove('retro-survive-green','retro-survive-yellow','retro-survive-orange','retro-survive-red');ott.classList.add(c<25?'retro-survive-green':c<50?'retro-survive-yellow':c<75?'retro-survive-orange':'retro-survive-red')}}
 if(or.previousElementSibling)or.previousElementSibling.textContent=/^05-0[1-5]$/.test(campaignMission||'')?'RESOLVE':campaignMission==='04-01'?'SITES':campaignMission==='04-02'?'CAPABILITY':campaignMission==='04-03'?'ANOMALY':campaignMission==='04-04'?'INDICATOR':campaignMission==='04-05'?'INDICATOR':/^03-0[1-5]$/.test(campaignMission||'')?(campaignMission==='03-01'?'ROUTES':campaignMission==='03-02'?'PATTERN':campaignMission==='03-03'?'RECUR':campaignMission==='03-04'?'ANOMALY':'ACTION'):'RESOLVE';or.textContent=campaignMission==='RETRO'?String(resolved):(/^05-0[1-5]$/.test(campaignMission||'')?String(resolved)+'/'+resolveTarget:(campaignMission==='ARCADE'?String(arcadeCorrect):campaignCorrect+'/'+resolveTarget));
 if(osc)osc.style.display=secondaryLabel?'inline-flex':'none';
 if(osl)osl.textContent=secondaryLabel;
 if(oi)oi.textContent=secondaryValue;
 if(/^05-0[2-5]$/.test(campaignMission||'')){const m=cpTempestMetrics();if(otl)otl.textContent=campaignMission==='05-02'?'CORROB':campaignMission==='05-03'?'ASSOC':campaignMission==='05-04'?'PRIORITY':'ASSOC';og.textContent=campaignMission==='05-02'?Math.min(m.corroborated,2)+'/2':campaignMission==='05-03'||campaignMission==='05-05'?Math.min(m.associations,2)+'/2':Math.min(m.prioritized,3)+'/3';if(otc)otc.style.display='inline-flex'}else if(campaignMission==='04-01'){const v=mirageMissionValues();if(otl)otl.textContent='LINKS';og.textContent=Math.min(v[2],3)+'/3';if(otc)otc.style.display='inline-flex';}else if(campaignMission==='04-02'){const v=mirageMissionValues();if(otl)otl.textContent='NETWORK';og.textContent=Math.min(v[2],2)+'/2';if(otc)otc.style.display='inline-flex';}else if(campaignMission==='04-03'){const v=mirageMissionValues();if(otl)otl.textContent='TRACKS';og.textContent=Math.min(v[2],5)+'/5';if(otc)otc.style.display='inline-flex';}else if(/^04-0[45]$/.test(campaignMission||'')){const v=mirageMissionValues();if(otl)otl.textContent='TRACKS';og.textContent=Math.min(v[2],6)+'/6';if(otc)otc.style.display='inline-flex';}else if(/^03-0[1-5]$/.test(campaignMission||'')){const m=VERDANT_MISSIONS[campaignMission],v=cpVerdantUiValues;if(otl)otl.textContent=campaignMission==='03-01'?'RECUR':'CLASS';og.textContent=Math.min(v[2],m.goals[2])+'/'+m.goals[2];if(otc)otc.style.display='inline-flex';}else{if(otl)otl.textContent='INTEGRITY';og.textContent=campaignMission==='RETRO'?Math.round(integrity)+'%':(campaignMission==='ARCADE'?Math.round(integrity)+'/0':Math.round(integrity)+'/80');if(otc)otc.style.display='none';}
  if(/^06-0[1-5]$/.test(campaignMission||'')){const cfg=POLARIS_OBJECTIVES[campaignMission],v=cpPolarisThirdValue();if(otl)otl.textContent=cfg.thirdLabel;og.textContent=cfg.third==='relay'?Math.min(v,cfg.thirdTarget)+'/'+cfg.thirdTarget:Math.round(v)+'/80';if(otc)otc.style.display='inline-flex';const passed=cfg.third==='relay'?v>=cfg.thirdTarget:integrity>=80;og.parentElement.classList.toggle('complete',passed);og.parentElement.classList.toggle('danger',cfg.third!=='relay'&&integrity<80)}if(oec)oec.style.display=showOE?'inline-flex':'none';
 if(oc)oc.textContent=campaignMission==='RETRO'?Math.round(c)+'%':Math.round(campaignCompromise)+'/'+((campaignMission==='01-05'||campaignMission==='02-05')?'50':'60');
 or.parentElement.classList.toggle('complete',campaignMission==='ARCADE'?arcadeStreak>=5:campaignCorrect>=resolveTarget);
 if(oi&&oi.parentElement){oi.parentElement.classList.toggle('complete',secondaryComplete);oi.parentElement.classList.remove('danger')}
 if(/^05-0[2-5]$/.test(campaignMission||'')){const m=cpTempestMetrics(),complete=campaignMission==='05-02'?m.corroborated>=2:campaignMission==='05-03'||campaignMission==='05-05'?m.associations>=2:m.prioritized>=3;og.parentElement.classList.toggle('complete',complete);og.parentElement.classList.remove('danger')}else if(campaignMission==='04-01'){const v=mirageMissionValues();og.parentElement.classList.toggle('complete',v[2]>=3);og.parentElement.classList.remove('danger')}else if(campaignMission==='04-02'){const v=mirageMissionValues();og.parentElement.classList.toggle('complete',v[2]>=2);og.parentElement.classList.remove('danger')}else if(campaignMission==='04-03'){const v=mirageMissionValues();og.parentElement.classList.toggle('complete',v[2]>=5);og.parentElement.classList.remove('danger')}else if(/^04-0[45]$/.test(campaignMission||'')){const v=mirageMissionValues();og.parentElement.classList.toggle('complete',v[2]>=6);og.parentElement.classList.remove('danger')}else if(/^03-0[1-5]$/.test(campaignMission||'')){const m=VERDANT_MISSIONS[campaignMission],v=cpVerdantUiValues;og.parentElement.classList.toggle('complete',v[2]>=m.goals[2]);og.parentElement.classList.remove('danger')}else{og.parentElement.classList.toggle('complete',integrity>=80);og.parentElement.classList.toggle('danger',integrity<80);}
 if(oc&&oc.parentElement){oc.parentElement.classList.toggle('complete',showOE&&campaignCompromise<60);oc.parentElement.classList.toggle('danger',showOE&&campaignCompromise>=50)}
 let od=$('#objDegraded');if(od)od.textContent=cpDegradedCount()+' / 5 // FLOOR '+cpCompromiseFloor()+'%';
 cpRefreshStatusColors();
}
B.forEach(cpRenderBlueSite);$('#active').textContent=/^04-0[1-5]$/.test(campaignMission||'')?mirageTraffic.length:T.filter(t=>!t.done).length;$('#cap').textContent=/^04-0[1-5]$/.test(campaignMission||'')?mirageTraffic.length:p.cap;$('#isrTop').textContent=displayMode(A.mode);let mb=$('#isrModeBadge');mb.textContent=A.controlSelected?'ISR // CONTROL ACTIVE // SELECT DESTINATION':A.mode==='ENROUTE'?'ISR // ENROUTE':A.mode==='LOITER_ENTRY'?'ISR // ESTABLISHING LOITER':A.mode==='LOITER_EXIT'?'ISR // DEPARTING LOITER':A.mode==='LOITER'?'ISR // LOITERING':A.mode==='ON_STATION'?'ISR // ON STATION':'ISR // STANDBY';mb.classList.toggle('active',A.controlSelected);const sitePanel=$('#sites');if(sitePanel)sitePanel.innerHTML='';const pp=$('#passiveIsrPanel'),pb=$('#passiveDeploy'),it=$('#isrTask');if(pp){pp.classList.remove('hidden');pp.classList.toggle('passive-unavailable',!passiveEnabled())}if(it){it.textContent=A.controlSelected?'CANCEL ISR TASKING':(A.mode==='ON_STATION'||A.mode==='IDLE'?'TASK ISR':'RETASK ISR');it.classList.toggle('deploying',A.controlSelected)}if(passiveEnabled()){const pc=$('#passiveCredits'),pn=$('#passiveCount'),ph=$('#passiveHint');if(pc)pc.textContent=passiveCredits;if(pn)pn.textContent=passiveNodes.length+' / '+PASSIVE_MAX;if(pb){const cost=passiveCost(),maxed=passiveNodes.length>=PASSIVE_MAX;pb.textContent=maxed?'NODE LIMIT // 9 / 9':(passiveDeployMode?'CANCEL DEPLOYMENT':'DEPLOY NODE // '+cost);pb.disabled=!running||(campaignMission==='TUTORIAL'&&!(tutorialStep===6||tutorialStep===7))||(!passiveDeployMode&&(maxed||passiveCredits<cost));pb.classList.toggle('deploying',passiveDeployMode)}if(ph)ph.textContent=ewoTargetMode?'EWO TARGETING // SELECT SWEEP ORIGIN':passiveDeployMode?'SELECT A POINT ON THE MAP // NODE FOOTPRINT '+PASSIVE_RADIUS:'Correct +10 // interrupt +10 // NAI: 3 nodes / 4 hex max // SUPPLY '+supplyPackages+'/1';const su=$('#supplyUse');if(su){su.textContent=supplyRepairMode?'CANCEL SUPPLY TARGETING':'SUPPLY // '+supplyPackages+' / 1'+(supplyPackages?' // READY':'');su.disabled=!running||supplyPackages<1||(campaignMission==='TUTORIAL'&&tutorialStep<9);}const ew=$('#ewoSweep');if(ew){ew.textContent=ewoTargetMode?'CANCEL EWO TARGETING':'EWO SWEEP // '+EWO_COST+' // BUY';ew.disabled=!running||(campaignMission==='TUTORIAL'&&tutorialStep!==8)||(!ewoTargetMode&&(passiveCredits<EWO_COST||!T.some(t=>!t.done&&t.type==='UNKNOWN')))}}detail()}function geometry(){let now=performance.now();if(running&&A.mode==='ENROUTE'&&valid(A.dest)&&now-A.lastMove>700&&!stallLogged){stallLogged=true;log('ISR MONITOR // STALL DETECTED')}{const k=activeOA==='VERDANT'?cpVerdantSymbolAspect():1;const sensorR=cpEffectiveISRRadius();$('#sf').setAttribute('r',sensorR);$('#sr').setAttribute('r',sensorR);$('#sensor').setAttribute('transform',`translate(${A.x} ${A.y}) scale(${k} 1)`);$('#asset').setAttribute('transform',`translate(${A.x} ${A.y}) scale(${k} 1)`);}$('#plane').setAttribute('transform',`rotate(${A.heading})`);$('#halo').setAttribute('stroke-opacity',A.controlSelected?'.8':'0');$('#alabel').setAttribute('x',A.x+31);$('#alabel').setAttribute('y',A.y+5);if(valid(A.dest)){ $('#wp').setAttribute('visibility','visible');$('#route').setAttribute('x1',A.x);$('#route').setAttribute('y1',A.y);$('#route').setAttribute('x2',A.dest.x);$('#route').setAttribute('y2',A.dest.y);$('#dest').setAttribute('cx',A.dest.x);$('#dest').setAttribute('cy',A.dest.y)}else $('#wp').setAttribute('visibility','hidden');if(col){$('#beam').setAttribute('visibility','visible');$('#beamLine').setAttribute('x1',A.x);$('#beamLine').setAttribute('y1',A.y);$('#beamLine').setAttribute('x2',col.x);$('#beamLine').setAttribute('y2',col.y)}else $('#beam').setAttribute('visibility','hidden');T.forEach(draw)}function diagnostic(now){if(now-lastDiag<100)return;lastDiag=now;let age=Math.round(now-A.lastMove),stall=running&&A.mode==='ENROUTE'&&valid(A.dest)&&age>700;
if(stall&&!stallLogged){
 stallLogged=true;
 rec('STALL',`mode=${A.mode} pos=${A.x.toFixed(2)},${A.y.toFixed(2)} dest=${A.dest.x.toFixed(2)},${A.dest.y.toFixed(2)} age=${age} gap=${C.maxGap.toFixed(1)}`);
}
if(!$('#devPanel')?.open)return;
$('#diagStatus').textContent=stall?'ISR STALL DETECTED':'NOMINAL';$('#diagStatus').classList.toggle('stall',stall);$('#diag1').textContent=`FPS ${C.fps} | RAF ${C.raf} | GAP ${Math.round(C.maxGap)}ms | ERR ${C.errors}`;$('#diag2').textContent=`ISR POINTER ${C.isr} | MAP POINTER ${C.map} | TRACK POINTER ${C.track} | ORDERS ${C.orders}`;$('#diag3').textContent=`MODE ${A.mode} | POS ${A.x.toFixed(1)},${A.y.toFixed(1)} | DEST ${valid(A.dest)?A.dest.x.toFixed(1)+','+A.dest.y.toFixed(1):'--'} | MOVE AGE ${age}ms`;let vv=window.visualViewport,vw=Math.round(window.innerWidth),vh=Math.round(window.innerHeight),vww=vv?Math.round(vv.width):vw,vvh=vv?Math.round(vv.height):vh,vs=vv?vv.scale:1;$('#viewportDiag').textContent=`VIEWPORT // ${vw}x${vh} -> ${vww}x${vvh} | SCALE ${vs.toFixed(2)}`;}function diagText(){return [`CONTACT IMMINENT v0.11.6.144 OA KESTREL / OA VANTAGE CAMPAIGN RUNTIME DIAGNOSTICS`,new Date().toISOString(),`running=${running} phase=${phase} score=${Math.round(score)} integrity=${integrity} compromise=${compromise().toFixed(2)}`,`fps=${C.fps} raf=${C.raf} maxGapMs=${C.maxGap.toFixed(1)} errors=${C.errors}`,`isrClicks=${C.isr} mapClicks=${C.map} trackClicks=${C.track} orders=${C.orders}`,`mode=${A.mode} pos=${A.x.toFixed(2)},${A.y.toFixed(2)} dest=${valid(A.dest)?A.dest.x.toFixed(2)+','+A.dest.y.toFixed(2):'--'} moveAgeMs=${Math.round(performance.now()-A.lastMove)}`,'','ROLLING DEBUG LOG',...dbg].join('\n')}async function copyDiag(){let t=diagText();try{await navigator.clipboard.writeText(t);log('DIAGNOSTICS // COPIED')}catch(e){rec('COPY_FAIL',String(e));let ta=document.createElement('textarea');ta.value=t;document.body.append(ta);ta.select();document.execCommand('copy');ta.remove();log('DIAGNOSTICS // COPIED')}}function saveDiag(){let a=document.createElement('a');a.href=URL.createObjectURL(new Blob([diagText()],{type:'text/plain'}));a.download='contact-imminent-v0.11.6.144-debug.txt';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),(cpFusionActive()?600:1000));log('DIAGNOSTICS // SAVED')}function cpFailKestrelTimeout(){
 if(campaignFinished)return;
 const id=campaignMission;
 if(!/^01-0[1-3]$/.test(id||''))return;
 campaignFinished=true;running=false;stopCollect();window.CP_MENU=true;
 A.dest=null;A.mode='IDLE';
 const w=$('#hostileCollectionWarning');if(w)w.classList.add('hidden');
 const lead=id==='01-01'?'INITIAL OPERATIONAL PICTURE INCOMPLETE':id==='01-02'?'PATTERN OF ACTIVITY INCOMPLETE':'INDICATORS ASSESSED INCOMPLETE';
 let detail='';
 if(id==='01-01')detail='<br>CONTACTS IDENTIFIED&nbsp;&nbsp;&nbsp;&nbsp;'+campaignIds+'<br>CORRECT DISPOSITIONS&nbsp;&nbsp;'+campaignCorrect;
 if(id==='01-02')detail='<br>CONTACTS RESOLVED&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+campaignCorrect+'<br>MOBILE CONTACTS&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+Math.max(0,campaignCorrect-campaignStationaryAssessed)+'<br>STATIONARY ASSESSED&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+campaignStationaryAssessed;
 if(id==='01-03')detail='<br>CONTACTS RESOLVED&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+campaignCorrect+'<br>SITE-PROXIMITY EVENTS&nbsp;&nbsp;&nbsp;'+campaignProximityAssessed;
 $('#resultTitle').textContent='CONDITIONS NOT SET';
 $('#resultBody').innerHTML='OA KESTREL<br>'+lead+' // TIME EXPIRED'+detail+
  '<br>HOSTILE / IRREGULAR&nbsp;&nbsp;&nbsp;'+campaignThreatResolved+
  '<br>FRIENDLY / NEUTRAL&nbsp;&nbsp;&nbsp;'+campaignNonThreatResolved+
  '<br>INTELLIGENCE INTEGRITY&nbsp;'+Math.round(integrity)+'%'+
  '<br>SCORE&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+Math.max(0,Math.round(score));
 $('#resultContinue').classList.add('hidden');
 $('#resultRetry').classList.remove('hidden');
 $('#campaignResult').classList.remove('hidden');
 outcomeFeedback(false);
}function finish(){if(!running)return;if(cpPolarisId()){cpPolarisFinish(false,'TIME EXPIRED');return;}if(/^02-/.test(campaignMission||'')){cpFinishCampaign02(false);return;}if(/^01-0[1-3]$/.test(campaignMission||'')){cpFailKestrelTimeout();return;}if(campaignMission==='01-04'){cpFinish0104('TIMEOUT');return;}if(campaignMission==='01-05'){cpFinish0105('TIMEOUT');return;}running=false;stopCollect();A.dest=null;A.mode='IDLE';let c=compromise();$('#endTitle').textContent=c<60?'CONDITIONS HAVE BEEN SET':'CONDITIONS NOT SET';$('#fs').textContent=Math.max(0,Math.round(score));$('#fr').textContent=resolved;$('#fi').textContent=ints;$('#fc').textContent=Math.round(c)+'%';$('#end').classList.add('show');ui(true)}function headerMissionTitle(){
 const id=campaignMission||'';
 const kestrel={'01-01':'ESTABLISH','01-02':'PATTERN','01-03':'INDICATORS','01-04':'CONTESTED','01-05':'CONDITIONS SET'};
 if(kestrel[id])return id+' // '+kestrel[id];
 if(/^02-0[1-5]$/.test(id))return id+' // '+(C02[id]?.title||'VANTAGE');
 if(/^03-0[1-5]$/.test(id))return id+' // '+(VERDANT_MISSIONS[id]?.title||'VERDANT');
 if(/^04-0[1-5]$/.test(id))return id+' // '+(MIRAGE_MISSIONS[id]?.title||'MIRAGE');
 if(/^05-0[1-5]$/.test(id))return id+' // '+(TEMPEST_BRIEFS[id]?.title||'TEMPEST');
 if(/^06-0[1-5]$/.test(id))return id+' // '+(POLARIS_BRIEFS[id]?.title||'POLARIS');
 if(id==='ARCADE')return 'ARCADE // SURVIVAL';
 if(id==='RETRO')return 'RETRO // SURVIVE';
 if(id==='TUTORIAL')return 'TRAINING // COMMAND ORIENTATION';
 return 'OA KESTREL // OPERATIONS';
}function loop(now){if(window.CP_PAUSED){last=now;requestAnimationFrame(loop);return;}C.raf++;let gap=now-C.lastRaf;C.lastRaf=now;if(gap>C.maxGap)C.maxGap=gap;C.fpsFrames++;if(now-C.fpsAt>=1000){C.fps=Math.round(C.fpsFrames*1000/(now-C.fpsAt));C.fpsFrames=0;C.fpsAt=now}let dt=Math.min(.05,(now-last)/1000);last=now;if(running){campaignHintTick(now);cpPolarisWindowTick(now);let elapsed=(now-start)/1000,left=Math.max(0,180-elapsed),np=elapsed<60?1:elapsed<120?2:3;if(campaignMission==='RETRO'){let s=Math.floor(elapsed);$('#clock').textContent=String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0');$('#phase').textContent=headerMissionTitle();if(compromise()>=99.9){running=false;stopCollect();A.dest=null;A.mode='IDLE';$('#endTitle').textContent='OE LOST // SURVIVED '+$('#clock').textContent;$('#fs').textContent=Math.max(0,Math.round(score));$('#fr').textContent=resolved;$('#fi').textContent=ints;$('#fc').textContent=Math.round(compromise())+'%';$('#end').classList.add('show')}}else if(campaignMission==='ARCADE'){arcadeThreatLevel=1+Math.floor(elapsed/75);if(arcadeThreatLevel!==phase){phase=arcadeThreatLevel;let nm='THREAT LEVEL '+arcadeThreatLevel;$('#phase').textContent=headerMissionTitle();banner(nm,1300);sound('level');log(nm)}let s=Math.floor(elapsed);$('#clock').textContent=String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0')}else if(/^05-0[1-5]$/.test(campaignMission||'')){let seconds=Math.floor(elapsed);$('#clock').textContent=String(Math.floor(seconds/60)).padStart(2,'0')+':'+String(seconds%60).padStart(2,'0');$('#phase').textContent=headerMissionTitle()}else if(/^04-0[1-5]$/.test(campaignMission||'')){$('#phase').textContent=headerMissionTitle();let missionSeconds=Math.floor(elapsed);$('#clock').textContent=String(Math.floor(missionSeconds/60)).padStart(2,'0')+':'+String(missionSeconds%60).padStart(2,'0')}else if(/^03-0[1-5]$/.test(campaignMission||'')){$('#phase').textContent=headerMissionTitle()}else{if(np!==phase){phase=np;let nm=phase===2?'PHASE II // CONTEST':'PHASE III // DOMINATE';$('#phase').textContent=headerMissionTitle();banner(nm,1300);log(nm)}let s=Math.ceil(left);$('#clock').textContent=String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0')}if(campaignMission!=='ARCADE'&&campaignMission!=='RETRO'&&campaignMission!=='TUTORIAL'&&!/^05-0[1-5]$/.test(campaignMission||'')&&!/^0[34]-/.test(campaignMission||'')&&left<=0)finish();else{let p=parms();if(campaignMission!=='TUTORIAL'&&!/^05-0[1-5]$/.test(campaignMission||'')&&!/^0[34]-/.test(campaignMission||'')&&(now-lastSpawn)/1000>=p.gap&&T.filter(t=>!t.done).length<p.cap){spawn();lastSpawn=now}T.forEach(t=>{if(t.done||t.stationary||t.maritime)return;t.x+=t.vx*dt;t.y+=t.vy*dt;if(t.x<35||t.x>865)t.vx*=-1;if(t.y<35||t.y>615)t.vy*=-1});naiTick(now);enemy(dt);cpContestedTick(dt);cpIntelDropTick();cpCyberTick();reconstitutionTick(now);cpTrackStallGuard();const postureTarget=(A.mode==='LOITER'||A.mode==='LOITER_ENTRY'||A.mode==='LOITER_APPROACH')?.75:1;A.sensorPosture+=(postureTarget-A.sensorPosture)*Math.min(1,dt/.65);if(A.mode==='LOITER_EXIT'&&valid(A.dest)){const desired=H(A.dest.x-A.x,A.dest.y-A.y),delta=cpHeadingDelta(A.heading,desired),maxTurn=(A.exitTurnCommitted?95:110)*dt;let remaining=Math.abs(delta);if(A.exitTurnCommitted){const dir=A.exitTurnDir||1;remaining=dir>0?(desired-A.heading+360)%360:(A.heading-desired+360)%360;const turn=Math.min(maxTurn,remaining);A.heading=(A.heading+dir*turn+360)%360}else A.heading=(A.heading+Math.max(-maxTurn,Math.min(maxTurn,delta))+360)%360;const rad=A.heading*Math.PI/180,step=cpEffectiveISRSpeed()*dt;A.x+=Math.sin(rad)*step;A.y-=Math.cos(rad)*step;A.lastMove=now;stallLogged=false;const exitAge=now-(A.exitStarted||now),aligned=A.exitTurnCommitted?remaining<7:Math.abs(delta)<7;if(exitAge>=220&&aligned){const committed=A.exitTurnCommitted;A.loiterCenter=null;A.exitTurnCommitted=false;A.exitTurnDir=0;A.mode='ENROUTE';rec('LOITER_EXIT_COMPLETE',`heading=${A.heading.toFixed(1)} delta=${delta.toFixed(1)} age=${Math.round(exitAge)}${committed?' committed-turn':''}`)}else if(now>=A.exitUntil&&exitAge%1000<60){rec('LOITER_EXIT_HOLD',`heading=${A.heading.toFixed(1)} target=${desired.toFixed(1)} remaining=${remaining.toFixed(1)}`)}}else if(A.mode==='ENROUTE'&&valid(A.dest)){const rx=57,ry=32,approach=108;let dx=A.dest.x-A.x,dy=A.dest.y-A.y,d=Math.hypot(dx,dy);if(d<=approach){A.loiterCenter={x:A.dest.x,y:A.dest.y};let th=Math.atan2((A.y-A.dest.y)/ry,(A.x-A.dest.x)/rx);if(!Number.isFinite(th))th=0;const tangentHeading=dir=>H(-rx*Math.sin(th)*dir,ry*Math.cos(th)*dir),cw=tangentHeading(1),ccw=tangentHeading(-1);A.loiterDir=Math.abs(cpHeadingDelta(A.heading,cw))<=Math.abs(cpHeadingDelta(A.heading,ccw))?1:-1;A.approachAngle=th;A.mode='LOITER_APPROACH';A.lastMove=now;stallLogged=false;rec('LOITER_APPROACH',`distance=${d.toFixed(2)} dir=${A.loiterDir>0?'CW':'CCW'} heading=${A.heading.toFixed(1)}`)}else{A.heading=H(dx,dy);let q=Math.min(cpEffectiveISRSpeed()*dt,Math.max(.08,d-approach)),ox=A.x,oy=A.y;A.x+=dx/d*q;A.y+=dy/d*q;if(Math.hypot(A.x-ox,A.y-oy)>.0001){A.lastMove=now;stallLogged=false}}}else if(A.mode==='LOITER_APPROACH'&&valid(A.loiterCenter)){const rx=57,ry=32,base=cpEffectiveISRSpeed(),loiterSpeed=base*.70,tx=A.loiterCenter.x+Math.cos(A.approachAngle)*rx,ty=A.loiterCenter.y+Math.sin(A.approachAngle)*ry,dx=tx-A.x,dy=ty-A.y,d=Math.hypot(dx,dy),desired=d>2?H(dx,dy):H(-rx*Math.sin(A.approachAngle)*A.loiterDir,ry*Math.cos(A.approachAngle)*A.loiterDir),delta=cpHeadingDelta(A.heading,desired),maxTurn=105*dt;A.heading+=Math.max(-maxTurn,Math.min(maxTurn,delta));const centerD=Math.hypot(A.x-A.loiterCenter.x,A.y-A.loiterCenter.y),blend=Math.max(0,Math.min(1,(centerD-59)/(108-59))),speed=loiterSpeed+(base-loiterSpeed)*blend,rad=A.heading*Math.PI/180,step=Math.min(speed*dt,Math.max(.35,d));A.x+=Math.sin(rad)*step;A.y-=Math.cos(rad)*step;A.lastMove=now;stallLogged=false;if(d<=3.5&&Math.abs(cpHeadingDelta(A.heading,H(-rx*Math.sin(A.approachAngle)*A.loiterDir,ry*Math.cos(A.approachAngle)*A.loiterDir)))<24){A.loiterAngle=A.approachAngle;A.dest=null;A.mode='LOITER';rec('LOITER_CAPTURE',`dir=${A.loiterDir>0?'CW':'CCW'} merge=${d.toFixed(2)}`)}}else if(A.mode==='LOITER_ENTRY'&&valid(A.loiterCenter)){const rx=57,ry=32;A.loiterAngle=Math.atan2((A.y-A.loiterCenter.y)/ry,(A.x-A.loiterCenter.x)/rx);if(!Number.isFinite(A.loiterAngle))A.loiterAngle=0;A.dest=null;A.mode='LOITER';A.lastMove=now;stallLogged=false}else if(A.mode==='LOITER'&&valid(A.loiterCenter)){const rx=57,ry=32,loiterSpeed=cpEffectiveISRSpeed()*.70,omega=loiterSpeed/Math.max(1,(rx+ry)*.5);A.loiterAngle=(A.loiterAngle+(A.loiterDir||1)*omega*dt)%(Math.PI*2);const nx=A.loiterCenter.x+Math.cos(A.loiterAngle)*rx,ny=A.loiterCenter.y+Math.sin(A.loiterAngle)*ry,dx=nx-A.x,dy=ny-A.y;if(Math.hypot(dx,dy)>.01)A.heading=H(dx,dy);A.x=nx;A.y=ny;A.lastMove=now;stallLogged=false}}}if(running){mirageTick(dt);verdantSmartTick(dt);verdantTrafficTick(dt);cpTempestVesselTick(dt);cpTempestMissionTick(dt,now);cpPriorityNAITick(now);vantageAffinityTick(now);updateTrackMemory(now);networkTick(now);}if(/^02-/.test(campaignMission||''))cpCheckCampaign02();geometry();ui();diagnostic(now);requestAnimationFrame(loop)}function supplyTargetFromPoint(p){if(!supplyRepairMode||supplyPackages<1||!valid(p))return false;const candidates=B.filter(b=>b.degraded&&!b.reconstituting).map(b=>({b,d:Math.hypot(b.x-p.x,b.y-p.y)})).sort((a,b)=>a.d-b.d);if(!candidates.length)return false;const hit=candidates[0];if(hit.d>62){cpNotice('SUPPLY TARGETING','SELECT A HIGHLIGHTED DEGRADED SITE','intel');return false;}reconstituteSite(hit.b);return true}
$('#map').addEventListener('pointerdown',e=>{if(!running||!supplyRepairMode)return;const p=point(e);if(supplyTargetFromPoint(p)){e.preventDefault();e.stopImmediatePropagation();}},true);
function cpTrackUnderISRPointer(e){if(!running)return null;const p=point(e);return T.filter(t=>!t.done&&t.el?.getAttribute('visibility')!=='hidden').map(t=>({t,d:Math.hypot(t.x-p.x,t.y-p.y)})).filter(o=>o.d<=34).sort((a,b)=>a.d-b.d)[0]?.t||null}
$('#asset').addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();if(!running)return;const t=cpTrackUnderISRPointer(e);if(t){C.track++;rec('TRACK_THROUGH_ISR',`${t.id} mode=${A.mode}`);sel=t;ui(true);return}acquire()});$('#map').addEventListener('pointerdown',e=>{e.preventDefault();if(verdantTrafficSel){verdantTrafficSel=null;updateSpotReport(null,false)}if(mirageSiteSel||mirageTrafficSel){mirageSiteSel=null;mirageTrafficSel=null;updateSpotReport(null,false)}C.map++;rec('MAP_POINTER',`mode=${A.mode}`);if(!running)return;if(passiveDeployMode){passivePlace(point(e));return}if(ewoTargetMode){ewoFire(point(e));return}if(!A.controlSelected)return;order(point(e));ui(true)});function actionPointer(el,fn){el.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();fn();requestAnimationFrame(()=>el.blur())});el.addEventListener('click',e=>e.preventDefault())}actionPointer($('#collect'),collect);actionPointer($('#isrTask'),()=>{if(A.controlSelected){A.controlSelected=false;ui(true)}else acquire()});actionPointer($('#clear'),()=>decide('CLEAR'));actionPointer($('#intercept'),()=>decide('INTERCEPT'));actionPointer($('#tempestPriority'),cpTempestPrioritize);actionPointer($('#assessRoutine'),()=>mirageSelectJudgment('ROUTINE'));actionPointer($('#assessElevated'),()=>mirageSelectJudgment('ELEVATED'));actionPointer($('#assessWarning'),()=>mirageSelectJudgment('WARNING'));actionPointer($('#mirageSubmitJudgment'),mirageConfirmAssessment);actionPointer($('#mirageReturnToMap'),mirageCloseAssessment);actionPointer($('#mirageReopenAssessment'),mirageShowAssessment);actionPointer($('#passiveDeploy'),passiveToggleDeploy);actionPointer($('#ewoSweep'),ewoSweep);actionPointer($('#supplyUse'),supplyActivate);function deploy(){cpRenderStrategicPriorityNAI();stopCollect();passiveReset();cpCyberReset();Object.assign(C,{raf:0,isr:0,map:0,track:0,orders:0,errors:0,lastRaf:performance.now(),maxGap:0,fps:0,fpsFrames:0,fpsAt:performance.now()});dbg=[];rec('DEPLOY','diagnostic session started');T.forEach(t=>{t.el?.remove();t.ring?.remove();t.lkp?.g?.remove()});T=[];sel=null;next=1;score=0;integrity=100;decisionCorrect=0;decisionTotal=0;resolved=0;ints=0;phase=1;campaignStationarySpawned=0;stallLogged=false;Object.assign(A,{x:145,y:510,dest:null,mode:'IDLE',heading:0,lastMove:performance.now(),loiterCenter:null,loiterAngle:0,loiterDir:1,approachAngle:0,exitUntil:0,exitStarted:0,exitTurnDir:0,exitTurnCommitted:false,sensorPosture:1,controlSelected:false});if(/^04-0[1-5]$/.test(campaignMission||'')){verdantSmartActive=false;Object.assign(A,{x:450,y:610,dest:null,mode:'IDLE',heading:0,lastMove:performance.now()});mirageReset();updateSpotReport(null,false);}else if(/^03-0[1-5]$/.test(campaignMission||'')){const vc=VERDANT_DEPLOY[campaignMission];verdantSmartActive=true;verdantTrafficSel=null;Object.assign(A,{x:vc.isr.x,y:vc.isr.y,dest:null,mode:'IDLE',heading:0,lastMove:performance.now()});verdantMissionReset();verdantResetSmartRoutes();verdantTrafficReset();updateSpotReport(null,false);}else if(campaignMission==='TUTORIAL'){Object.assign(A,{x:450,y:560,dest:null,mode:'IDLE',heading:0,lastMove:performance.now()});verdantSmartActive=false;}else{verdantSmartActive=false;}cpTempestVesselInit();$('#phase').textContent=headerMissionTitle();if(/^03-0[1-5]$/.test(campaignMission||''))verdantMissionProgress();$('#log').textContent='';$('#enemyRings').textContent='';let lk=$('#lastKnownPositions');if(lk)lk.textContent='';let df=$('#decisionFeedback');if(df)df.textContent='';$('#end').classList.remove('show');initBlue();running=false;$('#clock').textContent=(campaignMission==='ARCADE'||campaignMission==='RETRO')?'00:00':campaignMission==='TUTORIAL'?'TRAIN':/^03-0[1-5]$/.test(campaignMission||'')?'':'03:00';if(/^03-0[1-5]$/.test(campaignMission||''))verdantUpdateHud();let n=campaignMission==='TUTORIAL'?1:5;banner(campaignMission==='TUTORIAL'?'TRAINING ENVIRONMENT':String(n),700);let timer=setInterval(()=>{n--;if(n>0)banner(String(n),700);else{clearInterval(timer);banner(campaignMission==='TUTORIAL'?'TRAINING // SYSTEMS ONLINE':campaignMission==='RETRO'?'SURVIVE':'PREPARE THE OPERATIONAL ENVIRONMENT',1600);setTimeout(()=>{running=true;A.mode='ON_STATION';start=performance.now();lastSpawn=start;A.lastMove=start;if(campaignMission==='01-02'){spawn(false);spawn(true);spawn(true)}else if(/^06-0[1-5]$/.test(campaignMission||'')){spawn();spawn();spawn()}
else if(campaignMission==='01-03'||campaignMission==='01-04'||campaignMission==='01-05'||campaignMission==='ARCADE'||/^02-/.test(campaignMission||'')||/^06-0[1-5]$/.test(campaignMission||'')){spawn();spawn();spawn()}
else if(/^05-0[1-5]$/.test(campaignMission||'')){cpTempestMissionStart()}
else if(campaignMission==='TUTORIAL'){/* Guided contacts are created by the tutorial steps. */}
else if(!/^04-0[1-5]$/.test(campaignMission||'')&&!/^03-0[1-5]$/.test(campaignMission||'')){spawn(false);spawn(false);spawn(true)}
log(campaignMission==='RETRO'?'MISSION START // CONTACT IMMINENT // RETRO':'MISSION START // CONTACT IMMINENT 0.11.6.144 // OA RUNTIME');if(/^04-0[1-5]$/.test(campaignMission||'')){const mm=mirageMissionConfig();cpNotice(campaignMission+' // '+mm.title,campaignMission==='04-03'?'ESTABLISH BASELINE // IDENTIFY DEVIATION':'ESTABLISH THE OPERATING PICTURE','intel')}else if(/^03-0[1-5]$/.test(campaignMission||'')){const vm=VERDANT_MISSIONS[campaignMission];cpNotice(campaignMission+' // '+vm.title,vm.notice,'intel')}},900)}},850);ui(true)}$('#copyDiag').addEventListener('click',copyDiag);$('#saveDiag').addEventListener('click',saveDiag);$('#again').addEventListener('click',deploy);document.addEventListener('dblclick',e=>e.preventDefault(),{passive:false});document.addEventListener('wheel',e=>{if(e.ctrlKey)e.preventDefault()},{passive:false});window.visualViewport?.addEventListener('resize',()=>rec('VIEWPORT',`${Math.round(innerWidth)}x${Math.round(innerHeight)} scale=${visualViewport.scale}`));initBlue();running=false;$('#clock').textContent=(campaignMission==='ARCADE'||campaignMission==='RETRO')?'00:00':campaignMission==='TUTORIAL'?'TRAIN':'03:00';$('#phase').textContent='MISSION STANDBY';ui(true);
$('#startMission').addEventListener('click',()=>{$('#startScreen').style.display='none';deploy()});
window.CP_PAUSED=false;window.CP_MENU=true;window.CP_PAUSE_AT=0;
function strategicPriorityNAIIdentifier(){const mission=String(campaignMission||''),match=mission.match(/^(\d{2}-\d{2})$/);if(match)return 'NAI-'+match[1];const series=({KESTREL:'01',VANTAGE:'02',VERDANT:'03',MIRAGE:'04',TEMPEST:'05',ARCTIC:'06'})[activeOA]||'00';return 'NAI-'+series+'-69'}
// Pick a point well inside the tactical polygon so the full NAI label is centered
// on the region, including uneven and concave 3-4 vertex shapes.
function strategicNAILabelInteriorCenter(pts){
 if(!Array.isArray(pts)||pts.length<3)return null;
 const p=pts.map(v=>({x:Number(v.x)*900,y:Number(v.y)*650}));
 if(p.some(v=>!Number.isFinite(v.x)||!Number.isFinite(v.y)))return null;
 const minX=Math.min(...p.map(v=>v.x)),maxX=Math.max(...p.map(v=>v.x));
 const minY=Math.min(...p.map(v=>v.y)),maxY=Math.max(...p.map(v=>v.y));
 let twiceArea=0,cx=0,cy=0;
 for(let i=0;i<p.length;i++){const a=p[i],b=p[(i+1)%p.length],cross=a.x*b.y-b.x*a.y;twiceArea+=cross;cx+=(a.x+b.x)*cross;cy+=(a.y+b.y)*cross}
 const target={x:(minX+maxX)/2,y:(minY+maxY)/2};
 const edgeDistance=(x,y)=>{let d=Infinity;for(let i=0;i<p.length;i++){const a=p[i],b=p[(i+1)%p.length],dx=b.x-a.x,dy=b.y-a.y,len=dx*dx+dy*dy,t=len?Math.max(0,Math.min(1,((x-a.x)*dx+(y-a.y)*dy)/len)):0;d=Math.min(d,Math.hypot(x-a.x-t*dx,y-a.y-t*dy))}return d};
 const inside=(x,y)=>{let hit=false;for(let i=0,j=p.length-1;i<p.length;j=i++){const a=p[i],b=p[j];if((a.y>y)!==(b.y>y)&&x<(b.x-a.x)*(y-a.y)/(b.y-a.y)+a.x)hit=!hit}return hit||edgeDistance(x,y)<.15};
 const halfW=63,halfH=12;
 let minCX=minX+halfW,maxCX=maxX-halfW,minCY=minY+halfH,maxCY=maxY-halfH;
 if(minCX>maxCX)minCX=maxCX=(minX+maxX)/2;
 if(minCY>maxCY)minCY=maxCY=(minY+maxY)/2;
 const boxSamples=(x,y)=>{const l=x-halfW,r=x+halfW,t=y-halfH,b=y+halfH,out=[{x,y}];for(let i=0;i<=8;i++){const q=i/8;out.push({x:l+(r-l)*q,y:t},{x:l+(r-l)*q,y:b},{x:l,y:t+(b-t)*q},{x:r,y:t+(b-t)*q})}return out};
 let bestFit=null,bestFitDist=Infinity,bestPartial=null,bestCoverage=-1,bestPartialDist=Infinity;
 const consider=(x,y)=>{if(x<minCX-1e-6||x>maxCX+1e-6||y<minCY-1e-6||y>maxCY+1e-6)return;const samples=boxSamples(x,y),covered=samples.reduce((n,q)=>n+(inside(q.x,q.y)?1:0),0),dist=(x-target.x)**2+(y-target.y)**2;if(!inside(x,y))return;if(covered===samples.length&&dist<bestFitDist){bestFit={x,y};bestFitDist=dist}if(covered>bestCoverage||(covered===bestCoverage&&dist<bestPartialDist)){bestPartial={x,y};bestCoverage=covered;bestPartialDist=dist}};
 const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
 consider(clamp(target.x,minCX,maxCX),clamp(target.y,minCY,maxCY));
 const nx=32,ny=32;for(let iy=0;iy<=ny;iy++)for(let ix=0;ix<=nx;ix++)consider(minCX+(maxCX-minCX)*ix/nx,minCY+(maxCY-minCY)*iy/ny);
 let anchor=bestFit||bestPartial,stepX=(maxCX-minCX)/32,stepY=(maxCY-minCY)/32;
 for(let pass=0;pass<5&&anchor;pass++){const base={...anchor};for(let iy=-4;iy<=4;iy++)for(let ix=-4;ix<=4;ix++)consider(clamp(base.x+ix*stepX,minCX,maxCX),clamp(base.y+iy*stepY,minCY,maxCY));anchor=bestFit||bestPartial;stepX/=4;stepY/=4}
 const result=bestFit||bestPartial;return result?{x:result.x/900,y:result.y/650}:null;
}function cpRenderStrategicPriorityNAI(){
 const poly=$('#strategicPriorityNAIPolygon'),label=$('#strategicPriorityNAILabel');if(!poly||!label)return;
 const saved=readGlobalNAIs()[activeOA],pts=saved?.committed&&Array.isArray(saved.points)?saved.points:[];
 if(pts.length<3){poly.setAttribute('points','');poly.classList.add('hidden');label.classList.add('hidden');return;}
 const tactical=pts.map(p=>({x:Math.max(0,Math.min(900,p.x*900)),y:Math.max(0,Math.min(650,p.y*650))}));
 poly.setAttribute('points',tactical.map(p=>p.x+','+p.y).join(' '));poly.classList.remove('hidden');
 const c=strategicNAILabelInteriorCenter(pts);if(!c){label.classList.add('hidden');return;}const lx=c.x*900-63,ly=c.y*650-12;
 label.setAttribute('transform','translate('+lx+' '+ly+')');const caption=label.querySelector('text');if(caption)caption.textContent=strategicPriorityNAIIdentifier();label.classList.remove('hidden');
}
const VERDANT_MISSIONS={
 '03-01':{title:'CORRIDORS',notice:'ESTABLISH THE TRANSPORTATION PICTURE',goals:[6,3,1]},
 '03-02':{title:'PATTERN',notice:'ESTABLISH BASELINE // IDENTIFY ANOMALY',goals:[3,2,4]},
 '03-03':{title:'TRANSFER',notice:'DEVELOP TRANSFER ASSOCIATIONS',goals:[4,3,5]},
 '03-04':{title:'SIGNATURE',notice:'CORROBORATE THE ILLICIT SIGNATURE',goals:[3,2,6]},
 '03-05':{title:'INTERDICTION',notice:'IDENTIFY ACTIONABLE ACTIVITY // PRESERVE LEGITIMATE TRAFFIC',goals:[2,3,7]}
};
var verdantSmartActive=false,verdantSmartLastState='';
const VERDANT_CELL={suspected:0.825,probable:2.2,confirmed:4.4};
// VERDANT 03-01 Pattern-of-Life runtime. Movers use the existing ~25px collection
// cells as a lightweight graph, so no dense route geometry is searched per frame.
var verdantTraffic=[],verdantTrafficObserved=new Set(),verdantTrafficSel=null;
var verdantMission={complete:false,routeMilestone:false,trafficMilestone:false,ending:false};
const VERDANT_CORRIDORS_GOAL={routes:6,classified:3,recurring:1};
const VERDANT_TRAFFIC_COLLECT_MS=7000;
function verdantClassifiedCount(){return verdantTraffic.filter(m=>m.type&&m.type!=='UNKNOWN').length}
function verdantTrafficTruth(n){return ['NEUTRAL','FRIENDLY','NEUTRAL','IRREGULAR','FRIENDLY','HOSTILE','IRREGULAR','HOSTILE'][n%8]}
function verdantTrafficColor(type){return type==='HOSTILE'?'#ff5b55':type==='IRREGULAR'?'#d8a83e':type==='FRIENDLY'?'#4da3ff':type==='NEUTRAL'?'#55d66b':'#dce5e8'}
function verdantFinish0301(){verdantFinishMission()}
function verdantFinishMission(){
 if(verdantMission.ending)return;verdantMission.ending=true;campaignFinished=true;running=false;stopCollect();window.CP_MENU=true;A.dest=null;A.mode='IDLE';
 $('#end').classList.remove('show');
 const m=VERDANT_MISSIONS[campaignMission]||VERDANT_MISSIONS['03-01'],v=verdantMissionValues();
 campaignProgressionWrite('ci-c03-'+campaignMission.slice(3)+'-complete','1');cpRefreshVerdant();
 $('#resultTitle').textContent=m.title+' // MISSION COMPLETE';
 $('#resultBody').innerHTML='OA VERDANT // '+campaignMission+' '+m.title+'<br>MISSION COMPLETE // '+m.title+' OBJECTIVES SATISFIED<br><br>OBJECTIVE 1 // '+v[0]+' / '+m.goals[0]+'<br>OBJECTIVE 2 // '+v[1]+' / '+m.goals[1]+'<br>OBJECTIVE 3 // '+v[2]+' / '+m.goals[2]+'<br>SCORE // '+Math.max(0,Math.round(score));
 $('#resultContinue').classList.remove('hidden');$('#resultRetry').classList.add('hidden');$('#campaignResult').classList.remove('hidden');outcomeFeedback(true);ui(true);
}
function verdantMissionStats(){
 const classified=verdantClassifiedCount(),recurring=verdantTraffic.filter(m=>(m.observations||0)>=3).length;
 const anomalous=verdantTraffic.filter(m=>m.observations>=2&&(m.profile==='irregular'||m.profile==='recurring')).length;
 const transfers=verdantTraffic.filter(m=>m.observations>=3&&m.profile!=='routine').length;
 const signatures=verdantTraffic.filter(m=>m.observations>=3&&(m.type==='IRREGULAR'||m.type==='HOSTILE')).length;
 const actionable=verdantTraffic.filter(m=>m.observations>=3&&(m.type==='IRREGULAR'||m.type==='HOSTILE')).length;
 const legitimate=verdantTraffic.filter(m=>m.observations>=2&&(m.type==='FRIENDLY'||m.type==='NEUTRAL')).length;
 return{classified,recurring,anomalous,transfers,signatures,actionable,legitimate};
}
function verdantMissionValues(id=campaignMission){
 const s=verdantMissionStats(),cfg=window.CP_VERDANT_MAP?.routeFoundation,confirmed=cfg?cfg.routes.filter(r=>verdantStateFor(r)==='confirmed').length:0;
 if(id==='03-01')return[confirmed,s.classified,s.recurring];
 if(id==='03-02')return[s.recurring,s.anomalous,s.classified];
 if(id==='03-03')return[s.recurring,s.transfers,s.classified];
 if(id==='03-04')return[s.anomalous,s.signatures,s.classified];
 return[s.actionable,s.legitimate,s.classified];
}
function verdantMissionComplete(id=campaignMission){const m=VERDANT_MISSIONS[id],v=verdantMissionValues(id);return !!m&&v.every((x,i)=>x>=m.goals[i]);}
function verdantMissionReset(){verdantMission={complete:false,routeMilestone:false,trafficMilestone:false,ending:false};}
function verdantMissionProgress(){
 if(!verdantSmartActive||activeOA!=='VERDANT'||!/^03-0[1-5]$/.test(campaignMission||''))return;
 const m=VERDANT_MISSIONS[campaignMission];if(!m)return;
 if(!verdantMission.complete&&verdantMissionComplete()){
   verdantMission.complete=true;log('VERDANT // '+campaignMission+' // '+m.title+' COMPLETE');setTimeout(verdantFinishMission,350);
 }
 ui(true);
}
const VERDANT_TRAFFIC_COUNT=8,VERDANT_TRAFFIC_LINK=46;
function verdantTrafficBuildGraph(r){
 verdantEnsureCells(r);if(r.trafficGraph)return r.trafficGraph;
 const cells=r.cells||[],adj=cells.map(()=>[]),bucket=new Map(),bs=VERDANT_TRAFFIC_LINK;
 cells.forEach((c,i)=>{const k=Math.floor(c.x/bs)+','+Math.floor(c.y/bs);if(!bucket.has(k))bucket.set(k,[]);bucket.get(k).push(i)});
 cells.forEach((c,i)=>{const gx=Math.floor(c.x/bs),gy=Math.floor(c.y/bs);for(let ox=-1;ox<=1;ox++)for(let oy=-1;oy<=1;oy++){for(const j of bucket.get((gx+ox)+','+(gy+oy))||[]){if(j===i)continue;const d=Math.hypot(cells[j].x-c.x,cells[j].y-c.y);if(d<=VERDANT_TRAFFIC_LINK)adj[i].push({j,d})}}adj[i].sort((a,b)=>a.d-b.d)});
 return r.trafficGraph={cells,adj};
}
function verdantTrafficReset(){const g=$('#verdantTraffic');if(g)g.textContent='';verdantTraffic=[];verdantTrafficObserved.clear();verdantTrafficSel=null;const cfg=window.CP_VERDANT_MAP?.routeFoundation;if(!cfg)return;const candidates=cfg.routes.filter(r=>{const gr=verdantTrafficBuildGraph(r);return gr.cells.length>2&&gr.adj.some(a=>a.length)});const picks=['P-004','B-010','P-006','P-003','B-005','P-007','B-008','P-005'],labels=document.createElementNS(NS,'g');labels.setAttribute('class','verdant-traffic-label-layer');for(let n=0;n<VERDANT_TRAFFIC_COUNT;n++){const r=candidates.find(x=>x.id===picks[n])||candidates[n%candidates.length];if(!r)continue;const gr=verdantTrafficBuildGraph(r),usable=gr.adj.map((a,i)=>a.length?i:-1).filter(i=>i>=0),idx=usable[(n*7)%usable.length],next=gr.adj[idx][n%gr.adj[idx].length]?.j??idx;const el=document.createElementNS(NS,'g');el.setAttribute('class','verdant-traffic-mover');el.innerHTML='<circle class="verdant-traffic-hit" r="15"></circle><g class="verdant-traffic-symbol"><circle r="8"></circle><line x1="0" y1="0" x2="14" y2="0"></line></g>';const label=document.createElementNS(NS,'text');label.setAttribute('class','verdant-traffic-label');label.textContent='MOV-'+String(n+1).padStart(2,'0');labels.appendChild(label);g?.appendChild(el);const profile=n<4?'routine':n<7?'recurring':'irregular',baseSpeed=profile==='routine'?10+(n%3)*2:profile==='recurring'?8.5+(n%2)*1.5:15.5;const m={id:'MOV-'+String(n+1).padStart(2,'0'),route:r,idx,next,t:0,speed:baseSpeed,profile,dir:n%2?1:-1,el,label,labelColor:'',labelSlot:n%8,observed:false,observations:0,inCoverage:false,type:'UNKNOWN',truth:verdantTrafficTruth(n),collectMs:0,collecting:false};el.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();verdantTrafficSel=m;sel=null;verdantTrafficSpot();ui(true)});verdantTraffic.push(m)}g?.appendChild(labels);verdantTrafficRender();verdantTrafficHud();}
function verdantTrafficChooseNext(m){const gr=m.route.trafficGraph,opts=(gr.adj[m.idx]||[]).filter(o=>o.j!==m.prev);if(!opts.length)return gr.adj[m.idx]?.[0]?.j??m.idx;return opts[(m.idx+m.id.charCodeAt(4))%Math.min(opts.length,3)].j}
function verdantTrafficTick(dt){if(!verdantSmartActive||activeOA!=='VERDANT'||!verdantTraffic.length)return;for(const m of verdantTraffic){const gr=m.route.trafficGraph,a=gr.cells[m.idx],b=gr.cells[m.next];if(!a||!b)continue;const d=Math.max(1,Math.hypot(b.x-a.x,b.y-a.y));m.t+=m.speed*dt/d;if(m.t>=1){m.prev=m.idx;m.idx=m.next;m.next=verdantTrafficChooseNext(m);m.t=0}const c=gr.cells[m.idx],q=gr.cells[m.next]||c;m.x=c.x+(q.x-c.x)*m.t;m.y=c.y+(q.y-c.y)*m.t;m.heading=H(q.x-c.x,q.y-c.y);const covered=Math.hypot(A.x-m.x,A.y-m.y)<=118;if(covered&&!m.inCoverage){m.observed=true;m.observations++;verdantTrafficObserved.add(m.id)}m.inCoverage=covered}verdantTrafficRender();verdantTrafficHud();if(verdantTrafficSel)verdantTrafficSpot();}
function verdantTrafficLayoutLabels(){const now=performance.now();if(now-verdantTrafficLayoutLabels.last<250)return;verdantTrafficLayoutLabels.last=now;const occupied=[],offsets=[[14,-8],[-44,-8],[14,18],[-44,18],[-18,-18],[-18,28],[14,4],[-44,4]],ordered=[...verdantTraffic].sort((a,b)=>(a===verdantTrafficSel?-1:0)-(b===verdantTrafficSel?-1:0)),positions=new Map(verdantTraffic.map(m=>[m,{x:m.x??m.route.trafficGraph.cells[m.idx].x,y:m.y??m.route.trafficGraph.cells[m.idx].y}])),markers=[...positions.entries()];for(const m of ordered){const label=m.label,p=positions.get(m);if(!label||!p)continue;const w=34,h=10,start=m.labelSlot??(Number(m.id.slice(-2))%offsets.length);let chosen=null;for(let step=0;step<offsets.length;step++){const slot=(start+step)%offsets.length,[dx,dy]=offsets[slot],box={x:p.x+dx,y:p.y+dy-8,w,h};box.x=Math.max(3,Math.min(897-w,box.x));box.y=Math.max(11,Math.min(639-h,box.y));const overlapsLabel=occupied.some(o=>!(box.x+w+3<=o.x||o.x+o.w+3<=box.x||box.y+h+2<=o.y||o.y+o.h+2<=box.y)),overlapsMover=markers.some(([other,q])=>other!==m&&box.x+w+2>q.x-12&&q.x+12+2>box.x&&box.y+h+2>q.y-12&&q.y+12+2>box.y);if(!overlapsLabel&&!overlapsMover){chosen={slot,box};break}}if(!chosen){const slot=start,[dx,dy]=offsets[slot];chosen={slot,box:{x:p.x+dx,y:p.y+dy-8,w,h}}}m.labelSlot=chosen.slot;label.setAttribute('x','0');label.setAttribute('y','0');label.setAttribute('transform',`translate(${chosen.box.x} ${chosen.box.y+8})`);label.classList.toggle('selected',m===verdantTrafficSel);occupied.push(chosen.box)}}
verdantTrafficLayoutLabels.last=-Infinity;
function verdantTrafficRender(){const k=cpVerdantSymbolAspect();verdantTrafficLayoutLabels();for(const m of verdantTraffic){if(!m.el)continue;const x=m.x??m.route.trafficGraph.cells[m.idx].x,y=m.y??m.route.trafficGraph.cells[m.idx].y;m.el.setAttribute('transform',`translate(${x} ${y})`);const symbol=m.el.querySelector('.verdant-traffic-symbol');if(symbol)symbol.setAttribute('transform',`scale(${k} 1) rotate(${m.heading||0}) scale(1.5)`);m.el.classList.toggle('observed',m.observed);for(const t of ['friendly','neutral','irregular','hostile'])m.el.classList.remove('classified-'+t);if(m.type&&m.type!=='UNKNOWN')m.el.classList.add('classified-'+m.type.toLowerCase());m.el.classList.toggle('selected',m===verdantTrafficSel);const c=verdantTrafficColor(m.type);m.el.style.color=c;if(m.label&&m.labelColor!==c){m.label.style.color=c;m.labelColor=c}}}
function verdantTrafficHud(){const el=$('#verdantTrafficStatus');if(!el)return;const seen=verdantTrafficObserved.size,total=verdantTraffic.length;el.textContent=`TRAFFIC // ${String(seen).padStart(2,'0')} / ${String(total).padStart(2,'0')} MOVERS OBSERVED // ROUTE USE ${seen>=5?'PATTERN EMERGING':seen>=2?'PARTIAL':'BASELINE'}`}
function verdantTrafficSpot(){const m=verdantTrafficSel,box=$('#spotReport');if(!box||!verdantSmartActive||activeOA!=='VERDANT'||!m)return;box.hidden=false;box.style.setProperty('--spot-color',verdantTrafficColor(m.type));$('#spotTitle').textContent='SPOT // '+m.id;$('#spotClass').textContent=m.type==='UNKNOWN'?'UNKNOWN':m.type;const obs=Math.max(0,m.observations||0),pattern=obs>=3?'RECURRING':obs>=1?'OBSERVED':'UNOBSERVED';let intel=pattern;if(campaignMission==='03-02'&&obs>=2)intel=(m.profile==='routine'?'BASELINE':'ANOMALOUS');if(campaignMission==='03-03'&&obs>=3&&m.profile!=='routine')intel='TRANSFER // ASSOCIATED';if(campaignMission==='03-04'&&obs>=3&&(m.type==='IRREGULAR'||m.type==='HOSTILE'))intel='SIGNATURE // CORROBORATED';if(campaignMission==='03-05'&&obs>=3&&(m.type==='IRREGULAR'||m.type==='HOSTILE'))intel='ACTIONABLE';else if(campaignMission==='03-05'&&obs>=2&&(m.type==='FRIENDLY'||m.type==='NEUTRAL'))intel='LEGITIMATE // PRESERVE';$('#spotContext').textContent=m.collecting?('COLLECT // '+(m.collectMs/1000).toFixed(1)+' / 7.0 SEC'):(m.route.id+' // OBS '+String(obs).padStart(2,'0')+' // '+intel);}

const VERDANT_DISCOVERY_W=450;
const VERDANT_DISCOVERY_H=325;
const VERDANT_DISCOVERY_SCALE=2;
const VERDANT_DISCOVERY_GRID=16;

let verdantDiscoveryCanvas=null;
let verdantDiscoveryContext=null;
let verdantDiscoveryVisited=null;
let verdantDiscoveryDirty=false;

function verdantDiscoveryReset(){
 verdantDiscoveryCanvas=document.createElement('canvas');
 verdantDiscoveryCanvas.width=VERDANT_DISCOVERY_W;
 verdantDiscoveryCanvas.height=VERDANT_DISCOVERY_H;

 verdantDiscoveryContext=verdantDiscoveryCanvas.getContext('2d',{alpha:true});
 verdantDiscoveryContext.clearRect(0,0,VERDANT_DISCOVERY_W,VERDANT_DISCOVERY_H);

 verdantDiscoveryVisited=new Set();
 verdantDiscoveryDirty=true;
 verdantDiscoveryLastFlush=0;

 const image=$('#verdantDiscoveryReveal');
 if(image)image.removeAttribute('href');
}

function verdantDiscoveryReveal(x,y,radius){
 if(!verdantDiscoveryContext||!verdantDiscoveryVisited)return false;

 const grid=VERDANT_DISCOVERY_GRID;
 const minX=Math.max(0,Math.floor((x-radius)/grid));
 const maxX=Math.min(Math.ceil(900/grid)-1,Math.floor((x+radius)/grid));
 const minY=Math.max(0,Math.floor((y-radius)/grid));
 const maxY=Math.min(Math.ceil(650/grid)-1,Math.floor((y+radius)/grid));

 let changed=false;
 const ctx=verdantDiscoveryContext;

 ctx.fillStyle='#ffffff';

 for(let gy=minY;gy<=maxY;gy++){
  for(let gx=minX;gx<=maxX;gx++){
   const cx=(gx+.5)*grid;
   const cy=(gy+.5)*grid;
   const dx=cx-x;
   const dy=cy-y;

   if(dx*dx+dy*dy>radius*radius)continue;

   const key=gx+','+gy;

   if(verdantDiscoveryVisited.has(key))continue;

   verdantDiscoveryVisited.add(key);

   ctx.fillRect(
    gx*grid/VERDANT_DISCOVERY_SCALE,
    gy*grid/VERDANT_DISCOVERY_SCALE,
    grid/VERDANT_DISCOVERY_SCALE,
    grid/VERDANT_DISCOVERY_SCALE
   );

   changed=true;
  }
 }

 if(changed)verdantDiscoveryDirty=true;
 return changed;
}
let verdantDiscoveryLastFlush=0;
const VERDANT_DISCOVERY_FLUSH_INTERVAL=200;

function verdantDiscoveryFlush(force=false){
 if(!verdantDiscoveryDirty||!verdantDiscoveryCanvas)return;

 const now=performance.now();

 if(!force && verdantDiscoveryLastFlush!==0 &&
    now-verdantDiscoveryLastFlush<VERDANT_DISCOVERY_FLUSH_INTERVAL){
  return;
 }

 const image=$('#verdantDiscoveryReveal');
 if(!image)return;

 image.setAttribute('href',verdantDiscoveryCanvas.toDataURL('image/png'));

 verdantDiscoveryLastFlush=now;
 verdantDiscoveryDirty=false;
}
function verdantEnsureCells(r){
 if(r.cells?.length)return;
 const seen=new Set();r.cells=[];
 // Collapse the dense route point cloud into ~20px spatial cells. These are collection cells,
 // not route segments: the route remains one object end-to-end.
 for(const p of (r.points||[])){const gx=Math.round(p[0]/25),gy=Math.round(p[1]/25),k=gx+','+gy;if(seen.has(k))continue;seen.add(k);r.cells.push({x:p[0],y:p[1],progress:0,state:'unassessed'})}
}
function verdantCellState(c){return c.progress>=VERDANT_CELL.confirmed?'confirmed':c.progress>=VERDANT_CELL.probable?'probable':c.progress>=VERDANT_CELL.suspected?'suspected':'unassessed'}
function verdantRouteMetrics(r){
 verdantEnsureCells(r);

 const n=Math.max(1,r.cells.length);
 const discovered=r.discoveryCount||0;
 const coverage=discovered/n;

 return{
  n,
  observed:discovered,
  discovered,
  coverage,
  suspected:coverage>=.15?discovered:0,
  probable:coverage>=.45?discovered:0,
  confirmed:coverage>=.72?discovered:0,
  probableCoverage:coverage,
  confirmedCoverage:coverage
 };
}

function verdantStateFor(r){
 if(r.discoveryState)return r.discoveryState;

 const coverage=verdantRouteMetrics(r).coverage;

 r.discoveryState=coverage>=.72?'confirmed':
                  coverage>=.45?'probable':
                  coverage>=.15?'suspected':
                  'unassessed';

 return r.discoveryState;
}

const verdantTacticalQueue=[];
let verdantTacticalTimer=null;
let verdantTacticalElement=null;

function verdantTacticalClear(){
 verdantTacticalQueue.length=0;
 if(verdantTacticalTimer!==null){
  clearTimeout(verdantTacticalTimer);
  verdantTacticalTimer=null;
 }
 if(verdantTacticalElement){
  verdantTacticalElement.remove();
  verdantTacticalElement=null;
 }
}

function verdantTacticalShowNext(){
 if(activeOA!=='VERDANT'||!verdantSmartActive||!running){
  verdantTacticalClear();
  return;
 }
 if(verdantTacticalTimer!==null)return;

 const message=verdantTacticalQueue.shift();
 if(!message)return;

 if(!verdantTacticalElement){
  const el=document.createElement('div');
  el.id='verdantTacticalAlert';
  el.style.cssText=
   'position:absolute;left:12px;bottom:12px;z-index:35;'+
   'pointer-events:none;padding:7px 11px;'+
   'border:1px solid rgba(80,220,170,.65);'+
   'background:rgba(5,22,22,.91);color:#9ef5d3;'+
   'font:600 11px/1.4 monospace;letter-spacing:.6px;'+
   'max-width:260px;box-shadow:0 0 10px rgba(30,160,130,.15)';
    const map=$('#map');
  const container=map?.parentElement;

  if(!container)return;

  if(getComputedStyle(container).position==='static'){
   container.style.position='relative';
  }

  container.appendChild(el);
  verdantTacticalElement=el;
 }

 verdantTacticalElement.textContent=message;
 verdantTacticalElement.style.display='block';

 verdantTacticalTimer=setTimeout(()=>{
  verdantTacticalTimer=null;
  if(verdantTacticalElement){
   verdantTacticalElement.style.display='none';
  }
  verdantTacticalShowNext();
 },1800);
}

function verdantTacticalEnqueue(message){
 if(activeOA!=='VERDANT'||!verdantSmartActive||!running)return;
 if(verdantTacticalQueue.length>=8)verdantTacticalQueue.shift();
 verdantTacticalQueue.push(message);
 verdantTacticalShowNext();
}

function verdantTacticalMilestones(r){
 const coverage=(r.discoveryCount||0)/Math.max(1,r.cells.length);
 const previous=r.tacticalMilestone||0;
 const milestones=[
  {threshold:.15,level:1,message:'ROUTE DETECTED // '+r.id},
  {threshold:.50,level:2,message:'ROUTE MAPPED // '+r.id+' // 50%'},
  {threshold:.72,level:3,message:'ROUTE CONFIRMED // '+r.id}
 ];

 for(const milestone of milestones){
  if(coverage>=milestone.threshold && previous<milestone.level){
   verdantTacticalEnqueue(milestone.message);
   r.tacticalMilestone=milestone.level;
  }
 }
}
function verdantDiscoveryUpdateRoutes(x,y,radius){
 const cfg=window.CP_VERDANT_MAP?.routeFoundation;
 if(!cfg)return false;

 const radiusSquared=radius*radius;
 let changed=false;

 for(const r of cfg.routes){
  verdantEnsureCells(r);

  if(r.discoveryCount===r.cells.length)continue;

  for(const c of r.cells){
   if(c.discovered)continue;

   const dx=c.x-x;
   const dy=c.y-y;

   if(dx*dx+dy*dy<=radiusSquared){
    c.discovered=true;
    r.discoveryCount=(r.discoveryCount||0)+1;
    r.discoveryState=null;
    changed=true;
   }
  }
  verdantTacticalMilestones(r);
 }

 return changed;
}
function cpRenderVerdantRoutes(){
 const g=$('#verdantRouteNetwork');
 if(!g)return;

 if(activeOA!=='VERDANT'){
  g.textContent='';
  g.removeAttribute('mask');
  delete g.dataset.discoveryReady;
  return;
 }

 const cfg=window.CP_VERDANT_MAP?.routeFoundation;
 if(!cfg)return;

 const ns='http://www.w3.org/2000/svg';

 if(
  g.dataset.discoveryReady==='1' &&
  g.querySelectorAll('image.verdant-smart-route').length===1
 ){
  return;
 }

 g.textContent='';
 g.setAttribute('mask','url(#verdantDiscoveryMask)');

 const im=document.createElementNS(ns,'image');

 im.setAttribute('href','assets/routes/verdant/verdant-road-network.png');
 im.setAttribute('x','0');
 im.setAttribute('y','0');
 im.setAttribute('width','900');
 im.setAttribute('height','650');
 im.setAttribute('preserveAspectRatio','none');
 im.setAttribute('class','verdant-smart-route state-confirmed');

 g.appendChild(im);

 g.dataset.discoveryReady='1';
}
function verdantResetSmartRoutes(){
 const cfg=window.CP_VERDANT_MAP?.routeFoundation;
 if(!cfg)return;

 cfg.routes.forEach(r=>{
  verdantEnsureCells(r);
  r.discoveryCount=0;
  r.discoveryState=null;
  r.tacticalMilestone=0;
  r.cells.forEach(c=>{
   c.progress=0;
   c.state='unassessed';
   c.discovered=false;
  });
  r.state='unassessed';
 });

 verdantTacticalClear();
 verdantSmartLastState='';

 verdantDiscoveryReset();

 const g=$('#verdantRouteNetwork');
 if(g){
  g.dataset.discoveryReady='0';
 }

 cpRenderVerdantRoutes();
 verdantDiscoveryFlush();
 verdantUpdateHud();
}
function verdantUpdateHud(){if(!verdantSmartActive)return;const cfg=window.CP_VERDANT_MAP?.routeFoundation;if(!cfg)return;const counts={unassessed:0,suspected:0,probable:0,confirmed:0};cfg.routes.forEach(r=>counts[verdantStateFor(r)]++);const el=$('#verdantRouteStatus');if(el)el.textContent=`UNASSESSED ${counts.unassessed} // SUSPECTED ${counts.suspected} // PROBABLE ${counts.probable} // CONFIRMED ${counts.confirmed}`;const label=$('#verdantRoadCounterLabel');if(label)label.textContent='ROADS IDENTIFIED';const clock=$('#clock');if(clock)clock.textContent=String(counts.confirmed).padStart(2,'0')+' / '+String(cfg.routes.length).padStart(2,'0');}
function verdantSmartTick(dt){
 if(!verdantSmartActive||activeOA!=='VERDANT')return;
 if($('#startScreen')?.style.display!=='none')return;

 if(!verdantDiscoveryCanvas)verdantDiscoveryReset();

 const radius=cpEffectiveISRRadius();
 const changed=verdantDiscoveryReveal(A.x,A.y,radius);

 if(changed){
  const routesChanged=verdantDiscoveryUpdateRoutes(A.x,A.y,radius);

  if(routesChanged){
   verdantUpdateHud();
  }
 }

 verdantDiscoveryFlush();

 const rl=$('#rangeLine');

 if(rl && rl.textContent!=='SENSOR // ROADWAY DISCOVERY ACTIVE'){
  rl.textContent='SENSOR // ROADWAY DISCOVERY ACTIVE';
 }

 verdantMissionProgress();
}
function cpVerdantRaster(){const im=$('#verdantRaster');if(!im)return;if(activeOA!=='VERDANT'){im.setAttribute('visibility','hidden');im.removeAttribute('href');return}im.setAttribute('href','assets/maps/oa-verdant-overscan.png');im.setAttribute('x','-37.5');im.setAttribute('y','0');im.setAttribute('width','975');im.setAttribute('height','650');im.setAttribute('preserveAspectRatio','none');im.setAttribute('visibility','visible')}
let cpVerdantAspectCache=null;
function cpVerdantSymbolAspect(){
 const map=$('#map');
 if(activeOA!=='VERDANT'||!map)return 1;
 if(cpVerdantAspectCache!==null)return cpVerdantAspectCache;
 const m=map.getScreenCTM?.();
 if(!m)return 1;
 const sx=Math.hypot(m.a,m.b),sy=Math.hypot(m.c,m.d);
 cpVerdantAspectCache=sx>0&&sy>0?sy/sx:1;
 return cpVerdantAspectCache;
}
function cpMapRadialDistance(a,b){const k=activeOA==='VERDANT'?cpVerdantSymbolAspect():1;return Math.hypot((a.x-b.x)*k,a.y-b.y)}
function cpInvalidateVerdantAspect(){
 cpVerdantAspectCache=null;
}
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
window.addEventListener('resize',()=>{cpInvalidateVerdantAspect();requestAnimationFrame(cpVerdantHexAspect)},{passive:true});
window.visualViewport?.addEventListener('resize',()=>{cpInvalidateVerdantAspect();requestAnimationFrame(cpVerdantHexAspect)},{passive:true});
const TEMPEST_MARITIME_ROUTES=[
  {name:'SOUTHERN APPROACH',color:'#52e5d3',points:[[230,640],[250,550],[270,480],[245,405]]},
  {name:'EASTERN TRANSIT',color:'#f5c46b',points:[[890,350],[850,325],[800,285],[735,245],[675,215]]},
  {name:'CENTRAL PASSAGE',color:'#82aaff',points:[[525,385],[555,340],[575,280],[600,225]]},
  {name:'SOUTHERN TRANSIT',color:'#d99aff',points:[[350,645],[430,635],[525,635],[610,625]]}
 ];
const TEMPEST_CAMPAIGN_OBJECTIVES={
 '05-01':{title:'SEA LANES',resolve:10,evidence:8,integrity:80},
 '05-02':{title:'DARK TRANSIT',resolve:8,evidence:6,corroborated:2,integrity:80},
 '05-03':{title:'SHADOW NETWORK',resolve:8,evidence:8,associations:2,integrity:80},
 '05-04':{title:'INTERDICTION WINDOW',resolve:8,evidence:6,prioritized:3,legitimate:3,integrity:80},
 '05-05':{title:'MARITIME FUSION',resolve:10,evidence:8,associations:2,prioritized:3,sustainedMs:45000,integrity:80}
};
function cpTempestObjectivesSatisfied(id,m={}){
 const g=TEMPEST_CAMPAIGN_OBJECTIVES[id];if(!g)return false;
 return (m.resolved||0)>=g.resolve&&(m.evidence||0)>=g.evidence&&(m.integrity??100)>=g.integrity&&
  (m.corroborated||0)>=(g.corroborated||0)&&(m.associations||0)>=(g.associations||0)&&
  (m.prioritized||0)>=(g.prioritized||0)&&(m.legitimate||0)>=(g.legitimate||0)&&
  (m.sustainedMs||0)>=(g.sustainedMs||0);
}
function cpTempestPrioritySupported(t){
 return !!(t?.maritime&&t.collectionEvidence&&(t.tempestObservationCount||0)>=2&&
  (t.routeDeviation||t.identityDiscrepancy));
}
function cpTempestWouldCreateCycle(a,b,edges){
 if(!a||!b||a===b)return true;
 const graph=new Map();
 for(const edge of edges||[]){const [x,y]=edge.split('|');if(!x||!y)continue;(graph.get(x)||graph.set(x,new Set()).get(x)).add(y);(graph.get(y)||graph.set(y,new Set()).get(y)).add(x)}
 const seen=new Set([a]),stack=[a];while(stack.length){const at=stack.pop();if(at===b)return true;for(const next of graph.get(at)||[])if(!seen.has(next)){seen.add(next);stack.push(next)}}return false;
}
let tempestVessels=[],tempestMissionContacts=[],tempestSpawned=0,tempestEvidence=0,tempestMissionStart=0,tempestLastFallback=0;
let tempestAssociationEdges=new Set(),tempestPrioritized=new Set(),tempestExpired=new Set(),tempestSustainedMs=0,tempestIntegrityPenalty=0,tempestFailureReason='',tempestBriefingMission='05-02';
const TEMPEST_BRIEFS={
 '05-01':{title:'SEA LANES',brief:'Establish the maritime operating picture. Four known shipping vessels continue along the original routes while additional contacts appear over time. Unknown tracks require ISR discovery and collection before disposition.',goals:['Resolve 10 maritime contacts','Collect 8 evidence reports','Maintain at least 80% intelligence integrity']},
 '05-02':{title:'DARK TRANSIT',brief:'Commercial AIS is intermittent and some identities or routes do not match observed movement. AIS loss by itself is not evidence of hostile intent. Corroborate behavior with collection and repeated ISR observations; benign anomalies remain in the traffic.',goals:['Resolve 8 maritime contacts','Collect 6 evidence reports','Corroborate 2 tracks with movement history and ISR','Maintain at least 80% intelligence integrity']},
 '05-03':{title:'SHADOW NETWORK',brief:'Develop maritime associations from observed rendezvous, coordinated movement, and shared ports. Collect both tracks in a relationship and use independent observations. Duplicate links and circular evidence do not count.',goals:['Resolve 8 maritime contacts','Collect 8 evidence reports','Establish 2 unique, evidence-supported associations','Maintain at least 80% intelligence integrity']},
 '05-04':{title:'INTERDICTION WINDOW',brief:'Legitimate shipping shares the operating area with a small number of higher-interest vessels. Collect and corroborate before prioritizing; unsupported guesses reduce intelligence integrity. Each vessel has a limited identification window.',goals:['Resolve 8 maritime contacts','Collect 6 evidence reports','Prioritize 3 supported high-interest vessels in time','Resolve 3 benign vessels correctly','Maintain at least 80% intelligence integrity']},
 '05-05':{title:'MARITIME FUSION',brief:'Integrate the maritime picture. Corroborate associations, identify high-interest vessels with supporting intelligence, and sustain priority coverage while preserving the legitimate shipping picture.',goals:['Resolve 10 maritime contacts','Collect 8 evidence reports','Establish 2 unique associations','Prioritize 3 supported high-interest vessels','Sustain priority coverage for 45 seconds','Maintain at least 80% intelligence integrity']}
};
let tempestMissionStats={corroborated:new Set(),benign:new Set()},tempestPrioritySince=0,tempestUiReady=false;

function cpTempestId(id=campaignMission){return /^05-0[1-5]$/.test(id||'')}
function cpTempestTrackSeed(t,index){
 const profiles=[
  {ais:false,identity:false,deviation:false,group:'PORT-A',interest:false},
  {ais:true,identity:false,deviation:true,group:'PORT-A',interest:false},
  {ais:false,identity:true,deviation:true,group:'PORT-B',interest:true},
  {ais:true,identity:false,deviation:false,group:'PORT-B',interest:true},
  {ais:false,identity:false,deviation:true,group:'PORT-C',interest:false},
  {ais:true,identity:false,deviation:false,group:'PORT-C',interest:false},
  {ais:false,identity:true,deviation:true,group:'PORT-B',interest:true},
  {ais:true,identity:true,deviation:true,group:'PORT-D',interest:true}
 ];
 const p=profiles[index%profiles.length];Object.assign(t,{tempestIndex:index,tempestSpawnAt:performance.now(),tempestObservationCount:0,tempestLastSample:0,tempestHistory:[],aisAvailable:p.ais,identityDiscrepancy:p.identity,routeDeviation:p.deviation,networkGroup:p.group,highInterest:p.interest,priorityWindowOpen:true,priorityWindowMs:180000,tempestArrivalIndex:index});
}
function cpTempestAllContacts(){return tempestMissionContacts.filter(t=>t&&!t.done)}
function cpTempestMetrics(){const active=cpTempestId()?tempestMissionContacts:[];return {resolved, evidence:tempestEvidence,integrity,corroborated:tempestMissionStats.corroborated.size,associations:tempestAssociationEdges.size,prioritized:tempestPrioritized.size,legitimate:tempestMissionStats.benign.size,sustainedMs:tempestSustainedMs,active:active.length,spawned:tempestSpawned}}
function cpTempestObjectiveExtra(){
 const host=$('#objectiveTracker');if(!host)return;host.classList.toggle('has-inline-extra',['05-04','05-05','06-04'].includes(campaignMission));let chip=$('#tempestObjectiveExtra');if(!chip){chip=document.createElement('span');chip.id='tempestObjectiveExtra';chip.className='objective-chip campaign-inline-objective';chip.innerHTML='<em></em><b></b>';host.appendChild(chip)}
 const show=['05-04','05-05'].includes(campaignMission);chip.hidden=!show;if(!show)return;const m=cpTempestMetrics(),label=chip.querySelector('em'),value=chip.querySelector('b');if(campaignMission==='05-04'){label.textContent='BENIGN';value.textContent=Math.min(m.legitimate,3)+' / 3';chip.title='Benign maritime resolutions'}else{label.textContent='PRIO / HOLD';value.textContent=Math.min(m.prioritized,3)+' / 3  '+Math.min(45,Math.floor(m.sustainedMs/1000))+' / 45s';chip.title='Supported priority vessels / sustained coverage'}
}function cpTempestCheck(){
 if(!cpTempestId()||campaignMission==='05-01'||campaignFinished)return;
 const m=cpTempestMetrics();if(m.integrity<80){tempestFailureReason='INTELLIGENCE INTEGRITY BELOW 80%';cpTempestFinish(false);return}
 if(cpTempestObjectivesSatisfied(campaignMission,m))cpTempestFinish(true);
}
function cpTempestFinish(pass){
 if(campaignFinished)return;campaignFinished=true;running=false;stopCollect();window.CP_MENU=true;A.dest=null;A.mode='IDLE';
 if(pass)campaignProgressionWrite('ci-c'+campaignMission.slice(0,2)+'-'+campaignMission.slice(3)+'-complete','1');
 const m=cpTempestMetrics(),cfg=TEMPEST_CAMPAIGN_OBJECTIVES[campaignMission],brief=TEMPEST_BRIEFS[campaignMission];
 const rk=$('#resultKicker');if(rk)rk.textContent='CAMPAIGN 05 // OA TEMPEST';
 $('#resultTitle').textContent=pass?brief.title+' // MISSION COMPLETE':brief.title+' // OBJECTIVES INCOMPLETE';
 $('#resultBody').innerHTML='OA TEMPEST // '+campaignMission+' '+brief.title+'<br><br>CONTACTS RESOLVED&nbsp;&nbsp;'+resolved+' / '+cfg.resolve+'<br>COLLECTION EVIDENCE&nbsp;&nbsp;'+tempestEvidence+' / '+cfg.evidence+(cfg.corroborated?'<br>CORROBORATED&nbsp;&nbsp;'+m.corroborated+' / '+cfg.corroborated:'')+(cfg.associations?'<br>ASSOCIATIONS&nbsp;&nbsp;'+m.associations+' / '+cfg.associations:'')+(cfg.prioritized?'<br>SUPPORTED PRIORITIES&nbsp;&nbsp;'+m.prioritized+' / '+cfg.prioritized:'')+(cfg.legitimate?'<br>BENIGN RESOLUTIONS&nbsp;&nbsp;'+m.legitimate+' / '+cfg.legitimate:'')+(cfg.sustainedMs?'<br>SUSTAINED PRIORITY&nbsp;&nbsp;'+Math.floor(m.sustainedMs/1000)+' / '+Math.floor(cfg.sustainedMs/1000)+' SEC':'')+'<br>INTELLIGENCE INTEGRITY&nbsp;&nbsp;'+Math.round(integrity)+'%'+(tempestFailureReason?'<br>'+tempestFailureReason:'');
 $('#resultContinue').classList.toggle('hidden',!pass);$('#resultRetry').classList.toggle('hidden',pass);$('#campaignResult').classList.remove('hidden');outcomeFeedback(pass);cpTempestRefresh();ui(true);
}
function cpTempestObserve(t,now){
 if(!t||t.done)return;const inside=cpMapRadialDistance(A,t)<=cpEffectiveISRRadius();
 if(inside&&now-(t.tempestLastSample||0)>=2000){t.tempestLastSample=now;t.tempestObservationCount=(t.tempestObservationCount||0)+1;t.tempestHistory.push({at:now,x:t.x,y:t.y,ais:t.aisAvailable});if(t.tempestHistory.length>12)t.tempestHistory.shift();
  if(t.collectionEvidence&&(t.routeDeviation||t.identityDiscrepancy)&&t.tempestObservationCount>=2)tempestMissionStats.corroborated.add(t.id);
 }
 const age=now-(t.tempestSpawnAt||now);t.aisAvailable=(Math.floor(age/9000)%3)!==1&&!t.aisGapForced;
 if(age>t.priorityWindowMs){t.priorityWindowOpen=false;tempestExpired.add(t.id)}
}
function cpTempestTryAssociation(a,b){
 if(!a||!b||a===b||!a.collectionEvidence||!b.collectionEvidence||a.tempestObservationCount<2||b.tempestObservationCount<2||a.networkGroup!==b.networkGroup)return false;
 const x=a.id<b.id?a.id:b.id,y=a.id<b.id?b.id:a.id,key=x+'|'+y;
 if(tempestAssociationEdges.has(key)||cpTempestWouldCreateCycle(x,y,tempestAssociationEdges))return false;
 tempestAssociationEdges.add(key);rec('TEMPEST_ASSOCIATION',key+' // shared port / coordinated movement');return true;
}
function cpTempestPrioritize(){
 const t=sel;if(!running||!cpTempestId()||!['05-04','05-05'].includes(campaignMission)||!t?.maritime)return;
 if(!cpTempestPrioritySupported(t)||!t.priorityWindowOpen){cpTempestPenalty('Priority request lacks current corroborating intelligence or missed the identification window.');return}
 if(tempestPrioritized.has(t.id)){cpNotice('ALREADY PRIORITIZED',t.id+' // EXISTING SUPPORTED PRIORITY','intel');return}
 if(!t.highInterest){cpTempestPenalty('Benign or routine traffic cannot be elevated without supporting intelligence.');return}
 tempestPrioritized.add(t.id);tempestPrioritySince=performance.now();score+=15;rec('TEMPEST_PRIORITY',t.id+' // supported high-interest vessel');cpNotice('VESSEL PRIORITIZED',t.id+' // ISR + MOVEMENT HISTORY','intel');cpTempestCheck();ui(true);
}
function cpTempestPenalty(message){integrity=Math.max(0,integrity-12);tempestIntegrityPenalty+=12;score-=20;log('UNSUPPORTED MARITIME CLASSIFICATION // INTEGRITY -12');cpNotice('UNSUPPORTED CLASSIFICATION',message,'intel');cpTempestCheck();ui(true)}
function cpTempestCampaignReset(){tempestAssociationEdges=new Set();tempestPrioritized=new Set();tempestExpired=new Set();tempestSustainedMs=0;tempestIntegrityPenalty=0;tempestFailureReason='';tempestMissionStats={corroborated:new Set(),benign:new Set()};tempestPrioritySince=0;}

function cpTempestVesselReset(){
 tempestVessels=[];tempestMissionContacts=[];tempestSpawned=0;tempestEvidence=0;
 const layer=document.getElementById('tempestTraffic');
 if(layer)layer.replaceChildren();
}

function cpTempestVesselInit(){
 cpTempestVesselReset();
 if(!cpTempestId()||activeOA!=='TEMPEST')return;

 const layer=document.getElementById('tempestTraffic');
 if(!layer)return;

 const profiles=[
  {kind:'COMMERCIAL',speed:13,truth:'FRIENDLY'},
  {kind:'FISHING',speed:8,truth:'NEUTRAL'},
  {kind:'UNIDENTIFIED',speed:11,truth:'IRREGULAR'},
  {kind:'COMMERCIAL',speed:15,truth:'FRIENDLY'}
 ];
 const ns='http://www.w3.org/2000/svg';

 TEMPEST_MARITIME_ROUTES.forEach((route,i)=>{
  if(route.points.length<2)return;
  const profile=profiles[i%profiles.length];
  const start=route.points[0];

  const el=document.createElementNS(ns,'g');
  el.setAttribute('class','tempest-vessel');
  el.innerHTML='<path class="hull" d="M 10 0 L 3 -4 L -9 -4 L -12 0 L -9 4 L 3 4 Z"></path><line class="heading" x1="10" y1="0" x2="16" y2="0"></line>';
  layer.appendChild(el);

  const vessel={
   id:'VES-'+String(i+1).padStart(2,'0'),
   kind:profile.kind,
   type:'UNKNOWN',
   route,
   x:start[0],
   y:start[1],
   next:1,
   direction:1,
   speed:profile.speed,
   heading:0,
   el
  };
  el.setAttribute('transform',`translate(${vessel.x} ${vessel.y})`);
  tempestVessels.push(vessel);
 });
}
function cpTempestTrackAt(x,y,truthValue,path,speed,idPrefix='UNK'){
  spawn(false);
  const t=T[T.length-1];
  if(!t)return null;
  t.id=idPrefix+'-'+String(t.id.match(/\d+$/)?.[0]||tempestMissionContacts.length+1).padStart(3,'0');
  t.x=x;t.y=y;t.vx=0;t.vy=0;t.stationary=false;t.truth=truthValue;t.type='UNKNOWN';
  t.maritime=true;t.discoveryRequired=true;t.discovered=false;t.collectionEvidence=null;
  t.maritimePath=path;t.maritimeNext=1;t.maritimeSpeed=speed;
  cpTempestTrackSeed(t,tempestMissionContacts.length);
  tempestMissionContacts.push(t);
  return t;
}
function cpTempestMissionStart(){
  if(!cpTempestId()||activeOA!=='TEMPEST')return;
  tempestMissionContacts=[];tempestSpawned=0;tempestEvidence=0;cpTempestCampaignReset();
  tempestMissionStart=start;tempestLastFallback=0;
  for(let i=0;i<tempestVessels.length;i++){
    const vessel=tempestVessels[i],profile=[
      {truth:'FRIENDLY',speed:13},{truth:'NEUTRAL',speed:8},
      {truth:'IRREGULAR',speed:11},{truth:'FRIENDLY',speed:15}
    ][i];
    vessel.track=cpTempestTrackAt(vessel.x,vessel.y,profile.truth,vessel.route.points,profile.speed,'SHIP');
    if(vessel.track){vessel.track.vesselRef=vessel;vessel.track.networkGroup=['PORT-A','PORT-A','PORT-B','PORT-B'][i];vessel.track.highInterest=i===2;vessel.track.routeDeviation=i===2;vessel.track.identityDiscrepancy=i===2;vessel.track.aisAvailable=i%2===0;}
  }
}
function cpTempestSpawnAdditional(index){
  const profiles=[
    ['FRIENDLY',9],['NEUTRAL',8],['IRREGULAR',12],['HOSTILE',10],
    ['FRIENDLY',11],['NEUTRAL',9],['IRREGULAR',13],['HOSTILE',10]
  ];
  const [truthValue,speed]=profiles[index%profiles.length];
  const route=TEMPEST_MARITIME_ROUTES[(index+1)%TEMPEST_MARITIME_ROUTES.length];
  const points=route.points.map(([x,y],i)=>[x+(i%2?0:((index%3)-1)*18),y+(i%2?((index%3)-1)*14:0)]);
  const path=index%2?points.slice().reverse():points;
  const first=path[0],track=cpTempestTrackAt(first[0],first[1],truthValue,path,speed,'UNK');
  if(track){tempestSpawned++;rec('TEMPEST_ARRIVAL',`${track.id} // ${truthValue==='IRREGULAR'||truthValue==='HOSTILE'?'ANOMALOUS':'ROUTINE'} behavior`);}
}
function cpTempestAdvanceTrack(t,dt){
  const points=t.maritimePath;if(!points||points.length<2)return;
  let remaining=t.maritimeSpeed*dt;
  while(remaining>0){
    const target=points[t.maritimeNext],dx=target[0]-t.x,dy=target[1]-t.y,d=Math.hypot(dx,dy);
    if(d<.001){t.maritimeNext=(t.maritimeNext+1)%points.length;continue;}
    const step=Math.min(remaining,d);t.x+=dx/d*step;t.y+=dy/d*step;t.vx=dx/d*t.maritimeSpeed;t.vy=dy/d*t.maritimeSpeed;remaining-=step;
    if(step>=d-.001)t.maritimeNext=(t.maritimeNext+1)%points.length;
  }
}
function cpTempestRecordEvidence(t,source='ISR COLLECTION'){
 if(!t?.maritime||t.collectionEvidence)return;
 t.collectionEvidence={source,observations:t.tempestObservationCount||t.intel?.observations||0,at:performance.now()};tempestEvidence++;rec('TEMPEST_EVIDENCE',`${t.id} // ${source} // observations=${t.collectionEvidence.observations}`);
 if(campaignMission==='05-02'&&(t.routeDeviation||t.identityDiscrepancy)&&(t.tempestObservationCount||0)>=2)tempestMissionStats.corroborated.add(t.id);
 for(const other of tempestMissionContacts)if(other!==t)cpTempestTryAssociation(t,other);
 cpTempestCheck();ui(true);
}
function cpTempestMissionTick(dt,now){
  if(!cpTempestId()||activeOA!=='TEMPEST'||!running)return;
  const elapsed=(now-tempestMissionStart)/1000;
  while(tempestSpawned<8&&elapsed>=(tempestSpawned+1)*10)cpTempestSpawnAdditional(tempestSpawned);
  for(const t of tempestMissionContacts){
    if(t.done)continue;
    if(t.vesselRef){t.x=t.vesselRef.x;t.y=t.vesselRef.y;t.vx=Math.cos(t.vesselRef.heading*Math.PI/180)*t.vesselRef.speed;t.vy=Math.sin(t.vesselRef.heading*Math.PI/180)*t.vesselRef.speed;}
    else cpTempestAdvanceTrack(t,dt);
    if(!t.discovered&&cpMapRadialDistance(A,t)<=cpEffectiveISRRadius()){t.discovered=true;rec('TEMPEST_DISCOVERY',`${t.id} // ISR contact established`);}
    cpTempestObserve(t,now);
    if(t.collectionEvidence)for(const other of tempestMissionContacts)if(other!==t)cpTempestTryAssociation(t,other);
  }
  if(campaignMission==='05-05'&&tempestPrioritized.size>=3&&tempestPrioritySince)tempestSustainedMs+=dt*1000;
  const exhausted=tempestMissionContacts.length>=12&&tempestMissionContacts.every(t=>t.done);
  if(tempestSpawned>=8&&exhausted&&now-tempestLastFallback>=12000){tempestLastFallback=now;cpTempestSpawnAdditional(tempestSpawned);}
  cpTempestCheck();
}
function cpTempestVesselTick(dt){
  if(!cpTempestId()||activeOA!=='TEMPEST')return;
  if(!Number.isFinite(dt)||dt<=0)return;

 for(const vessel of tempestVessels){
  const points=vessel.route.points;
  if(points.length<2)continue;

  let remaining=vessel.speed*dt;
  while(remaining>0){
   const target=points[vessel.next];
   const dx=target[0]-vessel.x;
   const dy=target[1]-vessel.y;
   const distance=Math.hypot(dx,dy);

   if(distance<=0.001){
    vessel.next+=vessel.direction;
   }else if(remaining<distance){
    vessel.x+=dx/distance*remaining;
    vessel.y+=dy/distance*remaining;
    vessel.heading=Math.atan2(dy,dx)*180/Math.PI;
    remaining=0;
   }else{
    vessel.x=target[0];
    vessel.y=target[1];
    vessel.heading=Math.atan2(dy,dx)*180/Math.PI;
    remaining-=distance;
    vessel.next+=vessel.direction;
   }

   if(vessel.next>=points.length||vessel.next<0){
    vessel.x=points[0][0];
    vessel.y=points[0][1];
    vessel.next=1;
    vessel.direction=1;
    vessel.heading=Math.atan2(
     points[1][1]-points[0][1],
     points[1][0]-points[0][0]
    )*180/Math.PI;
    remaining=0;
   }
  }

  if(vessel.track){vessel.track.vesselRef=vessel;}
  if(vessel.el){
   vessel.el.setAttribute('transform',
    `translate(${vessel.x} ${vessel.y}) rotate(${vessel.heading||0})`);
  }
 }
}
function cpTempestRoutePreview(){
 const layer=document.getElementById('tempestRouteOverlay');
 if(!layer)return;
 const visible=activeOA==='TEMPEST'&&devAccessActive();
 layer.setAttribute('visibility',visible?'visible':'hidden');
 if(!visible||layer.childElementCount)return;
 const routes=TEMPEST_MARITIME_ROUTES;
 const ns='http://www.w3.org/2000/svg';
 for(const route of routes){
  const path=document.createElementNS(ns,'polyline');
  path.setAttribute('points',route.points.map(p=>p.join(',')).join(' '));
  path.setAttribute('fill','none');
  path.setAttribute('stroke',route.color);
  path.setAttribute('stroke-width','3');
  path.setAttribute('stroke-dasharray','9 6');
  path.setAttribute('opacity','.9');
  layer.appendChild(path);
  route.points.forEach((p,i)=>{
   const marker=document.createElementNS(ns,'circle');
   marker.setAttribute('cx',p[0]);marker.setAttribute('cy',p[1]);
   marker.setAttribute('r','5');marker.setAttribute('fill',route.color);
   marker.setAttribute('stroke','#081219');marker.setAttribute('stroke-width','1.5');
   layer.appendChild(marker);
   const label=document.createElementNS(ns,'text');
   label.setAttribute('x',p[0]+8);label.setAttribute('y',p[1]-8);
   label.setAttribute('fill',route.color);label.setAttribute('font-size','11');
   label.setAttribute('font-weight','bold');
   label.textContent=route.name.split(' ').map(w=>w[0]).join('')+'-'+(i+1);
   layer.appendChild(label);
  });
 }
}
function cpTempestRaster(){const im=document.getElementById('tempestRaster');if(!im)return;if(activeOA!=='TEMPEST'){im.setAttribute('visibility','hidden');im.removeAttribute('href');return}im.removeAttribute('href');im.setAttribute('visibility','hidden')}
function cpSetOAVisual(oa){cpInvalidateVerdantAspect();const w=$('#mapWrap'),brand=document.querySelector('.brand-block small'),map=$('#map');if(!w)return;const retroDisplay=oa==='RETRO';activeOA=['VANTAGE','VERDANT','MIRAGE','TEMPEST','ARCTIC'].includes(oa)?oa:'KESTREL';['vantage','verdant','mirage','tempest','arctic'].forEach(k=>w.classList.toggle('oa-'+k,activeOA===k.toUpperCase()));if(map)map.setAttribute('preserveAspectRatio',activeOA==='VERDANT'?'none':'xMidYMid meet');if(brand)brand.textContent=retroDisplay?'v0.11.6.144 // OA RETRO // BLANK CANVAS // RETRO CONTACT IMMINENT':'v0.11.6.144 // OA '+(activeOA==='ARCTIC'?'POLARIS':activeOA)+' // GEOMETRIC GRID';initBlue();if(activeOA!=='MIRAGE'){if($('#mirageSites'))$('#mirageSites').textContent='';if($('#mirageTraffic'))$('#mirageTraffic').textContent='';if($('#miragePopulation'))$('#miragePopulation').textContent='';}cpVerdantRaster();cpTempestRaster();cpTempestRoutePreview();cpRenderStrategicPriorityNAI();cpRenderVerdantRoutes();requestAnimationFrame(()=>{window.ciPhysicalPhoneMapFit?.();cpVerdantHexAspect();requestAnimationFrame(()=>{window.ciPhysicalPhoneMapFit?.();cpVerdantHexAspect()})});}


function cpRefreshVerdant(){for(let n=1;n<=5;n++){const id='03-0'+n,b=$('#mission03'+String(n).padStart(2,'0')),st=$('#mission03'+String(n).padStart(2,'0')+'Status'),available=campaignMissionUnlocked(id),done=progressionComplete('ci-c03-0'+n+'-complete');if(b){b.disabled=!available;b.classList.toggle('available',available)}if(st)st.textContent=progressionStatusLabel('ci-c03-0'+n+'-complete',available,done)}}
function cpBrief0301(){if(!campaignMissionUnlocked('03-01'))return;$('#campaignMenu').classList.add('hidden');$('#briefing0301').classList.remove('hidden')}
function cpBrief0302(){if(!campaignMissionUnlocked('03-02'))return;$('#campaignMenu').classList.add('hidden');$('#briefing0302').classList.remove('hidden')}
function cpBrief0303(){if(!campaignMissionUnlocked('03-03'))return;$('#campaignMenu').classList.add('hidden');$('#briefing0303').classList.remove('hidden')}
function cpBrief0304(){if(!campaignMissionUnlocked('03-04'))return;$('#campaignMenu').classList.add('hidden');$('#briefing0304').classList.remove('hidden')}
function cpBrief0305(){if(!campaignMissionUnlocked('03-05'))return;$('#campaignMenu').classList.add('hidden');$('#briefing0305').classList.remove('hidden')}
const VERDANT_DEPLOY={
 '03-01':{oa:'VERDANT',isr:{x:450,y:610}},
 '03-02':{oa:'VERDANT',isr:{x:450,y:610}},
 '03-03':{oa:'VERDANT',isr:{x:450,y:610}},
 '03-04':{oa:'VERDANT',isr:{x:450,y:610}},
 '03-05':{oa:'VERDANT',isr:{x:450,y:610}}
};
function cpBegin0301(){if(!campaignMissionUnlocked('03-01'))return;missionTransition('03-01 // CORRIDORS','OA VERDANT // LOADING OPERATION',cpBegin0301Now)}
function cpBegin0302(){if(!campaignMissionUnlocked('03-02'))return;missionTransition('03-02 // PATTERN','OA VERDANT // LOADING OPERATION',cpBegin0302Now)}
function cpBegin0303(){if(!campaignMissionUnlocked('03-03'))return;missionTransition('03-03 // TRANSFER','OA VERDANT // LOADING OPERATION',cpBegin0303Now)}
function cpBegin0304(){if(!campaignMissionUnlocked('03-04'))return;missionTransition('03-04 // SIGNATURE','OA VERDANT // LOADING OPERATION',cpBegin0304Now)}
function cpBegin0305(){if(!campaignMissionUnlocked('03-05'))return;missionTransition('03-05 // INTERDICTION','OA VERDANT // LOADING OPERATION',cpBegin0305Now)}
function cpBeginVerdantNow(id){
  if(!campaignMissionUnlocked(id))return;
  const cfg=VERDANT_DEPLOY[id];if(!cfg)return;
 musicSetMode('mission');campaignMenuOA=cfg.oa;campaignMission=id;campaignFinished=false;campaignCompromise=0;cpSetOAVisual(cfg.oa);
 cpHideCampaignOverlays();window.CP_MENU=false;window.CP_PAUSED=false;$('#startScreen').style.display='none';
 deploy();last=performance.now();
}
function cpBegin0301Now(){cpBeginVerdantNow('03-01')}
function cpBegin0302Now(){cpBeginVerdantNow('03-02')}
function cpBegin0303Now(){cpBeginVerdantNow('03-03')}
function cpBegin0304Now(){cpBeginVerdantNow('03-04')}
function cpBegin0305Now(){cpBeginVerdantNow('03-05')}

const MIRAGE_MISSIONS={
 '04-01':{title:'INVENTORY',goals:[4,4,3],siteStart:'unassessed',trackStart:'unknown',anomalies:[]},
 '04-02':{title:'CAPACITY',goals:[3,5,2],siteStart:'characterized',trackStart:'unknown',anomalies:[]},
 '04-03':{title:'POSTURE',goals:[3,2,5],siteStart:'capability',trackStart:'resolved',anomalies:['UNK-006','UNK-008','UNK-009'],associations:{'UNK-006':'FAC-06','UNK-008':'FAC-07','UNK-009':'FAC-02'}},
 '04-04':{title:'INDICATIONS',goals:[3,2,6],siteStart:'capability',trackStart:'resolved',anomalies:['UNK-006','UNK-008','UNK-009'],associations:{'UNK-006':'FAC-06','UNK-008':'FAC-07','UNK-009':'FAC-02'},indicators:{'UNK-006':'LOGISTICS SURGE','UNK-008':'FORCE CONCENTRATION','UNK-009':'SUPPORT CONVERGENCE'}},
 '04-05':{title:'WARNING',goals:[3,2,6],siteStart:'capability',trackStart:'resolved',anomalies:['UNK-006','UNK-008','UNK-009'],associations:{'UNK-006':'FAC-06','UNK-008':'FAC-07','UNK-009':'FAC-02'},indicators:{'UNK-006':'LOGISTICS SURGE','UNK-008':'FORCE CONCENTRATION','UNK-009':'SUPPORT CONVERGENCE'}}
};
function mirageMissionConfig(){return MIRAGE_MISSIONS[campaignMission]||MIRAGE_MISSIONS['04-01']}
function mirageCorroborateObservedTrack(t){if(!t||!t.isAnomaly)return false;const m=mirageMissionConfig(),siteId=(m.associations||{})[t.id];if(!siteId)return false;const site=mirageSites.find(s=>s.id===siteId);if(!site||!site.capabilityAssessed)return false;if(campaignMission==='04-03'){t.corroborated=true;cpNotice('ANOMALY CORROBORATED',t.id+' ↔ '+siteId,'intel')}else if(/^04-0[45]$/.test(campaignMission||'')&&t.indicatorDeveloped){t.indicatorCorroborated=true;cpNotice('INDICATOR CORROBORATED',t.indicator+' // '+t.id+' ↔ '+siteId,'intel')}return true}
const MIRAGE_COLLECT_MS=4200;
var mirageSites=[],mirageTraffic=[],mirageSiteSel=null,mirageTrafficSel=null,mirageLinks=new Set(),mirageEnding=false,mirageAssessment=null,mirageSelectedJudgment=null;
const MIRAGE_TRACK_TRUTH=['FRIENDLY','NEUTRAL','NEUTRAL','NEUTRAL','NEUTRAL','IRREGULAR','IRREGULAR','HOSTILE','HOSTILE','UNKNOWN'];
const MIRAGE_TRACK_ROUTES=[['N03','N02','N03','N04'],['N07','N06','N05','N04','N10','N09','N08'],['N07','N06','N07'],['N10','N04','N10'],['N02','N03','N04','N03','N02'],['N04','N10','N04'],['N11','N04','N11'],['N05','N04','N05'],['N05','N10','N05'],['N05','N06','N05']];
function mirageColor(t){return verdantTrafficColor(t)}
function mirageNetworkCount(){let n=0;for(const t of mirageTraffic){const sites=new Set();for(const k of mirageLinks){const [tid,sid]=k.split('@');if(tid===t.id&&mirageSites.find(s=>s.id===sid&&s.capabilityAssessed))sites.add(sid)}if(sites.size>=2)n++}return n}
function mirageMissionValues(){if(/^04-0[45]$/.test(campaignMission||''))return[mirageTraffic.filter(t=>t.indicatorDeveloped).length,mirageTraffic.filter(t=>t.indicatorCorroborated).length,mirageTraffic.filter(t=>t.postureObserved).length];if(campaignMission==='04-03')return[mirageTraffic.filter(t=>t.postureObserved&&t.isAnomaly).length,mirageTraffic.filter(t=>t.corroborated).length,mirageTraffic.filter(t=>t.postureObserved).length];if(campaignMission==='04-02')return[mirageSites.filter(s=>s.capabilityAssessed).length,mirageLinks.size,mirageNetworkCount()];return[mirageSites.filter(s=>s.characterized).length,mirageTraffic.filter(t=>t.type!=='UNKNOWN').length,mirageLinks.size]}
function mirageReset(){mirageSiteSel=null;mirageTrafficSel=null;mirageLinks.clear();mirageEnding=false;mirageAssessment=null;mirageSelectedJudgment=null;const mo=$("#mirageAssessmentOverlay");if(mo)mo.classList.add("hidden");const reopen=$("#mirageReopenAssessment");if(reopen)reopen.hidden=true;const submit=$("#mirageSubmitJudgment");if(submit)submit.disabled=true;const label=$("#mirageSelectedJudgment");if(label)label.textContent="ASSESSMENT // NOT SELECTED";["assessRoutine","assessElevated","assessWarning"].forEach(id=>{const el=$("#"+id);if(el)el.setAttribute("aria-pressed","false")});const ma=$('#mirageAssessment');if(ma)ma.hidden=true;const mes=$('#mirageEvidenceSummary');if(mes)mes.hidden=true;const sg=$('#mirageSites'),tg=$('#mirageTraffic'),pg=$('#miragePopulation');if(sg)sg.textContent='';if(tg)tg.textContent='';if(pg)pg.textContent='';mirageSites=[];mirageTraffic=[];const cfg=window.CP_MIRAGE_MAP;if(!cfg)return;
 for(const z of cfg.population||[]){const g=document.createElementNS(NS,'g');g.classList.add('mirage-pop-zone');g.innerHTML=`<rect x="${z.x}" y="${z.y}" width="${z.w}" height="${z.h}" rx="8"></rect><text x="${z.x+5}" y="${z.y+13}">${z.id} // ${z.density}</text>`;pg?.appendChild(g)}
 for(const d of cfg.sites||[]){const mc=mirageMissionConfig(),site={...d,characterized:mc.siteStart!=='unassessed',capabilityAssessed:mc.siteStart==='capability',collectMs:0,collecting:false};const g=document.createElementNS(NS,'g');g.classList.add('mirage-site');g.setAttribute('transform',`translate(${site.x} ${site.y})`);g.innerHTML=`<circle class="mirage-site-hit" r="22"></circle><rect x="-9" y="-9" width="18" height="18"></rect><text x="15" y="4">${site.id}</text>`;sg?.appendChild(g);site.el=g;g.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();mirageSiteSel=site;mirageTrafficSel=null;sel=null;mirageSpot();ui(true)});mirageSites.push(site)}
 for(let i=0;i<10;i++){const route=MIRAGE_TRACK_ROUTES[i],a=cfg.nodes[route[0]],b=cfg.nodes[route[1]];const g=document.createElementNS(NS,'g');g.classList.add('mirage-mover');g.innerHTML='<circle class="mirage-mover-hit" r="16"></circle><g class="mirage-track-symbol"><circle r="8"></circle><line x1="0" y1="0" x2="14" y2="0"></line></g><text></text>';tg?.appendChild(g);const id='UNK-'+String(i+1).padStart(3,'0'),mc=mirageMissionConfig(),isAnomaly=mc.anomalies.includes(id),t={id,route,leg:0,t:((i*17)%70)/100,speed:(10+(i%4)*1.7)*(/^04-0[3-5]$/.test(campaignMission||'')&&isAnomaly?1.65:1),x:a[0],y:a[1],type:/^04-0[3-5]$/.test(campaignMission||'')?(MIRAGE_TRACK_TRUTH[i]==='UNKNOWN'?'NEUTRAL':MIRAGE_TRACK_TRUTH[i]):'UNKNOWN',truth:MIRAGE_TRACK_TRUTH[i],collectMs:0,collecting:false,el:g,lastSite:null,postureObserved:false,isAnomaly,corroborated:false,indicatorDeveloped:false,indicatorCorroborated:false,indicator:(mc.indicators||{})[id]||null,labelSlot:i%8};g.querySelector('text').textContent=t.id;g.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();const p=point(e);let chosen=mirageTraffic.reduce((best,candidate)=>Math.hypot(candidate.x-p.x,candidate.y-p.y)<Math.hypot(best.x-p.x,best.y-p.y)?candidate:best,t),site=mirageSites.reduce((best,candidate)=>!best||Math.hypot(candidate.x-p.x,candidate.y-p.y)<Math.hypot(best.x-p.x,best.y-p.y)?candidate:best,null);if(site&&Math.hypot(site.x-p.x,site.y-p.y)<Math.hypot(chosen.x-p.x,chosen.y-p.y)){mirageSiteSel=site;mirageTrafficSel=null}else{mirageTrafficSel=chosen;mirageSiteSel=null}sel=null;mirageSpot();ui(true)});mirageTraffic.push(t)}mirageRender();mirageProgress();}
function mirageLayoutTrackLabels(){
 const occupied=[];const add=(x,y,w,h)=>occupied.push({x,y,w,h});
 for(const s of mirageSites)add(s.x+13,s.y-7,34,10);
 for(const z of window.CP_MIRAGE_MAP?.population||[])add(z.x+5,z.y+4,Math.max(40,(z.id+' // '+z.density).length*4.6),10);
 const offsets=[[14,-8],[-44,-8],[14,18],[-44,18],[-18,-18],[-18,28],[14,4],[-44,4]];
 const ordered=[...mirageTraffic].sort((a,b)=>(a===mirageTrafficSel?-1:0)-(b===mirageTrafficSel?-1:0));
 for(const t of ordered){
  const label=t.el?.querySelector('text');if(!label)continue;
  const w=Math.max(31,t.id.length*4.8),h=10,start=t.labelSlot??(Number(t.id.slice(-3))%offsets.length);let chosen=null;
  for(let step=0;step<offsets.length;step++){
   const slot=(start+step)%offsets.length,[dx,dy]=offsets[slot],box={x:t.x+dx,y:t.y+dy-8,w,h};
   box.x=Math.max(3,Math.min(897-w,box.x));box.y=Math.max(11,Math.min(639-h,box.y));
   if(occupied.every(o=>box.x+w+3<=o.x||o.x+o.w+3<=box.x||box.y+h+2<=o.y||o.y+o.h+2<=box.y)){chosen={slot,box,dx:box.x-t.x,dy:box.y-t.y+8};break}
  }
  if(!chosen){const slot=start,[dx,dy]=offsets[slot];chosen={slot,dx,dy,box:{x:t.x+dx,y:t.y+dy-8,w,h}}}
  t.labelSlot=chosen.slot;label.setAttribute('x',chosen.dx);label.setAttribute('y',chosen.dy);label.classList.toggle('selected',t===mirageTrafficSel);occupied.push(chosen.box);
 }
}
function mirageRender(){mirageLayoutTrackLabels();for(const t of mirageTraffic){const hit=t.el?.querySelector('.mirage-mover-hit');if(hit)hit.setAttribute('r',String(cpTouchRadius()));const c=mirageColor(t.type);t.el?.setAttribute('transform',`translate(${t.x} ${t.y})`);const symbol=t.el?.querySelector('.mirage-track-symbol');if(symbol)symbol.setAttribute('transform',`rotate(${t.heading||0}) scale(1.5)`);if(t.el){t.el.style.color=c;t.el.classList.toggle('resolved',t.type!=='UNKNOWN');t.el.classList.toggle('observed',!!t.postureObserved&&t.type==='UNKNOWN');for(const type of ['friendly','neutral','irregular','hostile'])t.el.classList.toggle('classified-'+type,t.type===type.toUpperCase());t.el.classList.toggle('selected',t===mirageTrafficSel)}}for(const s of mirageSites){s.el?.classList.toggle('characterized',s.characterized);s.el?.classList.toggle('capability-assessed',s.capabilityAssessed)}}
function mirageTick(dt){if(!running||!/^04-0[1-5]$/.test(campaignMission||'')||activeOA!=='MIRAGE')return;const cfg=window.CP_MIRAGE_MAP;if(!cfg)return;for(const t of mirageTraffic){const a=cfg.nodes[t.route[t.leg]],b=cfg.nodes[t.route[(t.leg+1)%t.route.length]],d=Math.max(1,Math.hypot(b[0]-a[0],b[1]-a[1]));t.t+=t.speed*dt/d;if(t.t>=1){t.t=0;t.leg=(t.leg+1)%t.route.length}const p=cfg.nodes[t.route[t.leg]],q=cfg.nodes[t.route[(t.leg+1)%t.route.length]];t.x=p[0]+(q[0]-p[0])*t.t;t.y=p[1]+(q[1]-p[1])*t.t;t.heading=H(q[0]-p[0],q[1]-p[1]);let near=null,nd=1e9;for(const s of mirageSites){const dd=Math.hypot(t.x-s.x,t.y-s.y);if(dd<nd){nd=dd;near=s}}if(near&&nd<=42&&t.lastSite!==near.id){t.lastSite=near.id;if(near.characterized&&t.type!=='UNKNOWN'){const key=t.id+'@'+near.id;if(!mirageLinks.has(key)){mirageLinks.add(key);if(campaignMission==='04-03'&&t.postureObserved&&t.isAnomaly)t.corroborated=true;if(/^04-0[45]$/.test(campaignMission||'')&&t.indicatorDeveloped&&t.isAnomaly)t.indicatorCorroborated=true;cpNotice('LINK ESTABLISHED',t.id+' ↔ '+near.id,'intel');score+=20;mirageProgress()}}}else if(nd>65)t.lastSite=null}mirageRender();if(mirageSiteSel||mirageTrafficSel)mirageSpot()}
function mirageCollect(){const o=mirageSiteSel||mirageTrafficSel;if(!running||!o||o.collecting)return;const inside=Math.hypot(A.x-o.x,A.y-o.y)<=cpEffectiveISRRadius();if(!inside)return;const siteDone=mirageSiteSel&&(/^04-0[3-5]$/.test(campaignMission||'')?true:campaignMission==='04-02'?o.capabilityAssessed:o.characterized);const trackDone=mirageTrafficSel&&(/^04-0[3-5]$/.test(campaignMission||'')?o.postureObserved:o.type!=='UNKNOWN');if(siteDone||trackDone)return;stopCollect();col=o;o.collecting=true;const base=o.collectMs||0,st=performance.now();ci=setInterval(()=>{const covered=Math.hypot(A.x-o.x,A.y-o.y)<=cpEffectiveISRRadius();if(!covered){o.collectMs=Math.min(MIRAGE_COLLECT_MS,base+performance.now()-st);o.collecting=false;clearInterval(ci);ci=null;col=null;mirageSpot();ui(true);return}o.collectMs=Math.min(MIRAGE_COLLECT_MS,base+performance.now()-st);pct=Math.floor(o.collectMs/MIRAGE_COLLECT_MS*100);mirageSpot();ui(true);if(o.collectMs>=MIRAGE_COLLECT_MS){clearInterval(ci);ci=null;col=null;o.collecting=false;o.collectMs=0;if(mirageSiteSel){if(campaignMission==='04-02'){o.capabilityAssessed=true;cpNotice('CAPABILITY ASSESSED',o.id+' // '+(o.capability||'SUPPORT CAPACITY'),'intel')}else{o.characterized=true;cpNotice('SITE CHARACTERIZED',o.id+' // '+o.label,'intel')}}else{if(/^04-0[3-5]$/.test(campaignMission||'')){o.postureObserved=true;if(/^04-0[45]$/.test(campaignMission||'')&&o.indicator){o.indicatorDeveloped=true;cpNotice('INDICATOR DEVELOPED',o.indicator+' // '+o.id,'intel');mirageCorroborateObservedTrack(o)}else{cpNotice(o.isAnomaly?'BASELINE DEVIATION':'BASELINE CONSISTENT',o.id+' // OBSERVATION COMPLETE','intel');mirageCorroborateObservedTrack(o)}}else{o.type=o.truth==='UNKNOWN'?'NEUTRAL':o.truth;cpNotice('TRACK RESOLVED',o.id+' // '+o.type,'intel')}}score+=25;sound('classify');mirageRender();mirageProgress();mirageSpot();ui(true)}},80)}
function mirageSpot(){const o=mirageSiteSel||mirageTrafficSel,box=$('#spotReport');if(!box||!/^04-0[1-5]$/.test(campaignMission||'')||!o){if(box)box.hidden=true;return}box.hidden=false;const site=!!mirageSiteSel,done=site?(/^04-0[3-5]$/.test(campaignMission||'')?true:campaignMission==='04-02'?o.capabilityAssessed:o.characterized):(/^04-0[3-5]$/.test(campaignMission||'')?o.postureObserved:o.type!=='UNKNOWN'),inside=Math.hypot(A.x-o.x,A.y-o.y)<=cpEffectiveISRRadius();box.style.setProperty('--spot-color',site?'#d6b47c':mirageColor(o.type));$('#spotTitle').textContent='SPOT // '+o.id;if(!site&&/^04-0[3-5]$/.test(campaignMission||'')){$('#spotClass').textContent='CLASS // '+o.type;const label=campaignMission==='04-03'?'POSTURE':campaignMission==='04-04'?'INDICATION':'WARNING';$('#spotContext').textContent=o.collecting?(label+' COLLECTION // '+Math.floor(o.collectMs/MIRAGE_COLLECT_MS*100)+'%'):o.postureObserved?(o.indicatorDeveloped?('INDICATOR // '+o.indicator+(o.indicatorCorroborated?' // CORROBORATED':'')):(campaignMission==='04-03'?('POSTURE // '+(o.isAnomaly?(o.corroborated?'BASELINE DEVIATION // CORROBORATED':'BASELINE DEVIATION'):'BASELINE CONSISTENT')):(label+' // NO CORROBORATED INDICATOR'))):(inside?label+' // NOT OBSERVED // RE-OBSERVE AVAILABLE':label+' // NOT OBSERVED // NO COVERAGE')}else if(site&&campaignMission==='04-02'){$('#spotClass').textContent=o.label;$('#spotContext').textContent=o.collecting?('CAPABILITY COLLECTION // '+Math.floor(o.collectMs/MIRAGE_COLLECT_MS*100)+'%'):done?('CAPABILITY // '+(o.capability||'ASSESSED')):(inside?'ASSESS CAPABILITY // AVAILABLE':'ASSESS CAPABILITY // NO COVERAGE')}else{$('#spotClass').textContent=site?(done?o.label:'SITE // UNCHARACTERIZED'):(done?o.type:'UNKNOWN');$('#spotContext').textContent=o.collecting?('COLLECT // '+Math.floor(o.collectMs/MIRAGE_COLLECT_MS*100)+'%'):done?(site?'SITE // CHARACTERIZED':'TRACK // RESOLVED'):(inside?'COLLECT // AVAILABLE':'COLLECT // NO COVERAGE')}}
function mirageDetail(){const o=mirageSiteSel||mirageTrafficSel;if(!o){updateSpotReport(null,false);$('#none').hidden=false;$('#detail').hidden=true;return}$('#none').hidden=true;$('#detail').hidden=false;const site=!!mirageSiteSel,done=site?(/^04-0[3-5]$/.test(campaignMission||'')?true:campaignMission==='04-02'?o.capabilityAssessed:o.characterized):(/^04-0[3-5]$/.test(campaignMission||'')?o.postureObserved:o.type!=='UNKNOWN'),inside=Math.hypot(A.x-o.x,A.y-o.y)<=cpEffectiveISRRadius();$('#tid').textContent=o.id;$('#type').textContent=site?(/^04-0[3-5]$/.test(campaignMission||'')?(o.capability||o.label):campaignMission==='04-02'?(done?(o.capability||'CAPABILITY ASSESSED'):o.label):(done?o.label:'UNCHARACTERIZED')):(/^04-0[3-5]$/.test(campaignMission||'')?o.type:(done?o.type:'UNKNOWN'));$('#motion').textContent=site?'FIXED':'MOBILE';$('#collect').hidden=false;$('#collect').textContent=/^04-0[3-5]$/.test(campaignMission||'')&&!site?(o.postureObserved?(campaignMission==='04-03'?'POSTURE OBSERVED':o.indicatorDeveloped?'INDICATOR DEVELOPED':'OBSERVATION COMPLETE'):inside?(o.collectMs?'RESUME RE-OBSERVE':'RE-OBSERVE '+(campaignMission==='04-03'?'POSTURE':campaignMission==='04-04'?'INDICATION':'WARNING')):'RE-OBSERVE // NO COVERAGE'):(done?'COLLECTION COMPLETE':inside?(o.collectMs?'RESUME COLLECT':(site&&campaignMission==='04-02'?'ASSESS CAPABILITY':'COLLECT')):'COLLECT // NO COVERAGE');$('#collect').disabled=!running||done||!inside||o.collecting;$('#prog').hidden=!o.collecting;$('#pct').textContent=Math.floor((o.collectMs||0)/MIRAGE_COLLECT_MS*100)+'%';$('#bar').style.width=Math.floor((o.collectMs||0)/MIRAGE_COLLECT_MS*100)+'%';$('#dec').hidden=true;mirageSpot()}
function mirageProgress(){if(!/^04-0[1-5]$/.test(campaignMission||''))return;const v=mirageMissionValues(),m=mirageMissionConfig();if(!mirageEnding&&v.every((x,i)=>x>=m.goals[i])){mirageEnding=true;setTimeout(()=>campaignMission==='04-01'?mirageFinish0401():campaignMission==='04-02'?mirageFinish0402():campaignMission==='04-03'?mirageFinish0403():campaignMission==='04-04'?mirageFinish0404():mirageWarningReady(),350)}ui(true)}
function mirageFinish0401(){const rk=$('#resultKicker');if(rk)rk.textContent='CAMPAIGN 04 // OA MIRAGE';campaignFinished=true;running=false;stopCollect();window.CP_MENU=true;A.dest=null;A.mode='IDLE';campaignProgressionWrite('ci-c04-01-complete','1');cpRefreshMirage();const v=mirageMissionValues();$('#resultTitle').textContent='INVENTORY // MISSION COMPLETE';$('#resultBody').innerHTML='OA MIRAGE // 04-01 INVENTORY<br>OPERATING PICTURE ESTABLISHED<br><br>SITES // '+v[0]+' / 4<br>TRACKS // '+v[1]+' / 4<br>LINKS // '+v[2]+' / 3<br>SCORE // '+Math.max(0,Math.round(score));$('#resultContinue').classList.remove('hidden');$('#resultRetry').classList.add('hidden');$('#campaignResult').classList.remove('hidden');outcomeFeedback(true);ui(true)}
function mirageFinish0402(){const rk=$('#resultKicker');if(rk)rk.textContent='CAMPAIGN 04 // OA MIRAGE';campaignFinished=true;running=false;stopCollect();window.CP_MENU=true;A.dest=null;A.mode='IDLE';campaignProgressionWrite('ci-c04-02-complete','1');cpRefreshMirage();const v=mirageMissionValues();$('#resultTitle').textContent='CAPACITY // MISSION COMPLETE';$('#resultBody').innerHTML='OA MIRAGE // 04-02 CAPACITY<br>NETWORK-ENABLED CAPABILITY ESTABLISHED<br><br>CAPABILITIES // '+v[0]+' / 3<br>LINKS // '+v[1]+' / 5<br>NETWORKS // '+v[2]+' / 2<br>SCORE // '+Math.max(0,Math.round(score));$('#resultContinue').classList.remove('hidden');$('#resultRetry').classList.add('hidden');$('#campaignResult').classList.remove('hidden');outcomeFeedback(true);ui(true)}
function mirageFinish0403(){const rk=$('#resultKicker');if(rk)rk.textContent='CAMPAIGN 04 // OA MIRAGE';campaignFinished=true;running=false;stopCollect();window.CP_MENU=true;A.dest=null;A.mode='IDLE';campaignProgressionWrite('ci-c04-03-complete','1');cpRefreshMirage();const v=mirageMissionValues();$('#resultTitle').textContent='POSTURE // MISSION COMPLETE';$('#resultBody').innerHTML='OA MIRAGE // 04-03 POSTURE<br>BASELINE DEVIATIONS ESTABLISHED<br><br>ANOMALIES // '+v[0]+' / 3<br>CORROBORATED // '+v[1]+' / 2<br>TRACKS // '+v[2]+' / 5<br>SCORE // '+Math.max(0,Math.round(score));$('#resultContinue').classList.remove('hidden');$('#resultRetry').classList.add('hidden');$('#campaignResult').classList.remove('hidden');outcomeFeedback(true);ui(true)}
function mirageFinish0404(){const rk=$('#resultKicker');if(rk)rk.textContent='CAMPAIGN 04 // OA MIRAGE';campaignFinished=true;running=false;stopCollect();window.CP_MENU=true;A.dest=null;A.mode='IDLE';campaignProgressionWrite('ci-c04-04-complete','1');cpRefreshMirage();const v=mirageMissionValues();$('#resultTitle').textContent='INDICATIONS // MISSION COMPLETE';$('#resultBody').innerHTML='OA MIRAGE // 04-04 INDICATIONS<br>CORRELATED INDICATORS DEVELOPED<br><br>INDICATORS // '+v[0]+' / 3<br>CORROBORATED // '+v[1]+' / 2<br>TRACKS // '+v[2]+' / 6<br>SCORE // '+Math.max(0,Math.round(score));$('#resultContinue').classList.remove('hidden');$('#resultRetry').classList.add('hidden');$('#campaignResult').classList.remove('hidden');outcomeFeedback(true);ui(true)}
function mirageAssessmentReady(){if(campaignMission!=='04-05'||campaignFinished||mirageAssessment)return false;const v=mirageMissionValues(),m=mirageMissionConfig();return v.every((x,i)=>x>=m.goals[i])}
function mirageShowAssessment(){if(!mirageAssessmentReady())return;const a=$('#mirageAssessment');if(a)a.hidden=false;const summary=$('#mirageEvidenceSummary');if(summary)summary.hidden=false;const v=mirageMissionValues();const metrics=$('#mirageReportMetrics');if(metrics)metrics.textContent='INDICATORS // '+v[0]+' / 3\nCORROBORATED // '+v[1]+' / 2\nTRACKS OBSERVED // '+v[2]+' / 6';const evidence=mirageTraffic.filter(t=>t.indicatorDeveloped&&t.indicator).slice(0,3);['mirageEvidence1','mirageEvidence2','mirageEvidence3'].forEach((id,i)=>{const el=$('#'+id),t=evidence[i];if(el)el.textContent=t?(t.id+' // '+t.indicator+' // '+(t.indicatorCorroborated?'CORROBORATED':'OBSERVED')+(t.indicatorCorroborated?' // '+((mirageMissionConfig().associations||{})[t.id]||'ASSOCIATED SITE'):'')):'INDICATOR // PENDING'});const overlay=$('#mirageAssessmentOverlay');if(overlay)overlay.classList.remove('hidden');ui(true)}
function mirageWarningReady(){if(!mirageAssessmentReady())return;mirageEnding=true;const reopen=$('#mirageReopenAssessment');if(reopen)reopen.hidden=false;cpNotice('ASSESSMENT REQUIRED','MULTIPLE INDICATORS EXCEED BASELINE // ISSUE ANALYTIC JUDGMENT','intel');mirageShowAssessment()}
function mirageSelectJudgment(level){if(!mirageAssessmentReady()||!['ROUTINE','ELEVATED','WARNING'].includes(level))return;mirageSelectedJudgment=level;['ROUTINE','ELEVATED','WARNING'].forEach(x=>{const b=$('#assess'+x[0]+x.slice(1).toLowerCase());if(b)b.setAttribute('aria-pressed',String(x===level))});const label=$('#mirageSelectedJudgment');if(label)label.textContent='ASSESSMENT // '+level;const submit=$('#mirageSubmitJudgment');if(submit)submit.disabled=false}
function mirageCloseAssessment(){const overlay=$('#mirageAssessmentOverlay');if(overlay)overlay.classList.add('hidden')}
function mirageConfirmAssessment(){if(!mirageAssessmentReady()||!mirageSelectedJudgment)return;mirageSubmitAssessment(mirageSelectedJudgment)}
function mirageSubmitAssessment(level){if(!mirageAssessmentReady()||level!==mirageSelectedJudgment)return;mirageCloseAssessment();const reopen=$('#mirageReopenAssessment');if(reopen)reopen.hidden=true;mirageAssessment=level;const correct=level==='WARNING';score+=correct?100:-40;campaignFinished=true;running=false;stopCollect();window.CP_MENU=true;A.dest=null;A.mode='IDLE';if(correct){campaignProgressionWrite('ci-c04-05-complete','1');progressionCollectUnlocks();}cpRefreshMirage();const v=mirageMissionValues();$('#mirageAssessment').hidden=true;const es=$('#mirageEvidenceSummary');if(es)es.hidden=true;const rk=$('#resultKicker');if(rk)rk.textContent='CAMPAIGN 04 // OA MIRAGE';$('#resultTitle').textContent=correct?'WARNING // CAMPAIGN COMPLETE':'WARNING // REASSESS';const reasoning=correct?'MULTIPLE INDEPENDENT INDICATORS, CORROBORATED INFRASTRUCTURE ASSOCIATIONS, AND DEPARTURE FROM ESTABLISHED BASELINE SUPPORT WARNING OF HOSTILE PREPARATION.':'ASSESSMENT NOT SUPPORTED. THREE INDEPENDENT INDICATORS EXCEED THE ESTABLISHED BASELINE AND TWO ARE CORROBORATED THROUGH ASSESSED INFRASTRUCTURE RELATIONSHIPS. THIS CONVERGENCE SUPPORTS WARNING RATHER THAN '+level+'.';$('#resultBody').innerHTML='OA MIRAGE // 04-05 WARNING<br>ASSESSMENT // '+level+'<br>CONFIDENCE // '+(correct?'HIGH':'LOW')+'<br><br>INDICATORS // '+v[0]+' / 3<br>CORROBORATED // '+v[1]+' / 2<br>TRACKS // '+v[2]+' / 6<br><br>'+reasoning+'<br>SCORE // '+Math.max(0,Math.round(score));$('#resultContinue').classList.toggle('hidden',!correct);$('#resultRetry').classList.toggle('hidden',correct);$('#campaignResult').classList.remove('hidden');outcomeFeedback(correct);ui(true)}
function cpRefreshMirage(){for(let n=1;n<=5;n++){const id='04-0'+n,done=progressionComplete('ci-c04-0'+n+'-complete'),available=campaignMissionUnlocked(id),st=$('#mission04'+String(n).padStart(2,'0')+'Status'),b=$('#mission04'+String(n).padStart(2,'0'));if(st)st.textContent=progressionStatusLabel('ci-c04-0'+n+'-complete',available,done);if(b){b.disabled=!available;b.classList.toggle('available',available)}}}
function cpBrief0401(){if(!campaignMissionUnlocked('04-01'))return;$('#campaignMenu').classList.add('hidden');$('#briefing0401').classList.remove('hidden')}
function cpBrief0402(){if(!campaignMissionUnlocked('04-02'))return;$('#campaignMenu').classList.add('hidden');$('#briefing0402').classList.remove('hidden')}
function cpBrief0403(){if(!campaignMissionUnlocked('04-03'))return;$('#campaignMenu').classList.add('hidden');$('#briefing0403').classList.remove('hidden')}
function cpBrief0404(){if(!campaignMissionUnlocked('04-04'))return;$('#campaignMenu').classList.add('hidden');$('#briefing0404').classList.remove('hidden')}
function cpBrief0405(){if(!campaignMissionUnlocked('04-05'))return;$('#campaignMenu').classList.add('hidden');$('#briefing0405').classList.remove('hidden')}
function cpBegin0401(){if(!campaignMissionUnlocked('04-01'))return;missionTransition('04-01 // INVENTORY','OA MIRAGE // LOADING OPERATION',cpBegin0401Now)}
function cpBegin0402(){if(!campaignMissionUnlocked('04-02'))return;missionTransition('04-02 // CAPACITY','OA MIRAGE // LOADING OPERATION',cpBegin0402Now)}
function cpBegin0403(){if(!campaignMissionUnlocked('04-03'))return;missionTransition('04-03 // POSTURE','OA MIRAGE // LOADING OPERATION',cpBegin0403Now)}
function cpBegin0404(){if(!campaignMissionUnlocked('04-04'))return;missionTransition('04-04 // INDICATIONS','OA MIRAGE // LOADING OPERATION',cpBegin0404Now)}
function cpBegin0405(){if(!campaignMissionUnlocked('04-05'))return;missionTransition('04-05 // WARNING','OA MIRAGE // LOADING OPERATION',cpBegin0405Now)}
function cpBeginMirageNow(id){if(!campaignMissionUnlocked(id))return;musicSetMode('mission');campaignMenuOA='MIRAGE';campaignMission=id;campaignFinished=false;campaignCompromise=0;cpSetOAVisual('MIRAGE');cpHideCampaignOverlays();window.CP_MENU=false;window.CP_PAUSED=false;$('#startScreen').style.display='none';deploy();last=performance.now()}
function cpBegin0401Now(){cpBeginMirageNow('04-01')}
function cpBegin0402Now(){cpBeginMirageNow('04-02')}
function cpBegin0403Now(){cpBeginMirageNow('04-03')}
function cpBegin0404Now(){cpBeginMirageNow('04-04')}
function cpBegin0405Now(){cpBeginMirageNow('04-05')}





function cpTempestUnlocked(id){return campaignMissionUnlocked(id)}
function cpTempestRefresh(){
 const pane=$('#campaignPaneTempest');if(!pane)return;
 const first=$('#mission0501Dev');if(first){const done=progressionComplete('ci-c05-01-complete'),available=cpTempestUnlocked('05-01');first.hidden=false;first.disabled=!available;first.classList.toggle('available',available);const s=first.querySelector('span');if(s)s.textContent=progressionStatusLabel('ci-c05-01-complete',available,done)}
 let list=pane.querySelector('.tempest-mission-list');if(!list){list=document.createElement('div');list.className='campaign-list c05-list tempest-mission-list';pane.appendChild(list)}
 if(first&&first.parentElement!==list)list.insertBefore(first,list.firstChild);
 ['05-02','05-03','05-04','05-05'].forEach((id,i)=>{let b=document.getElementById('mission'+id.replace('-',''));if(!b){b=document.createElement('button');b.type='button';b.id='mission'+id.replace('-','');b.className='mission-row';b.innerHTML='<b>'+id+' // '+TEMPEST_BRIEFS[id].title+'</b><span></span>';b.addEventListener('click',()=>cpTempestBrief(id));list.appendChild(b)}const available=cpTempestUnlocked(id),done=progressionComplete('ci-c05-'+id.slice(-2)+'-complete'),sp=b.querySelector('span');b.disabled=!available;b.classList.toggle('available',available);if(sp)sp.textContent=progressionStatusLabel('ci-c05-'+id.slice(-2)+'-complete',available,done)});
}
function cpTempestBrief(id){if(!cpTempestUnlocked(id))return;tempestBriefingMission=id;let o=$('#briefingTempest');if(!o){o=document.createElement('div');o.id='briefingTempest';o.className='gameoverlay';o.innerHTML='<div class="menupanel briefingpanel briefingpanel-tempest"><div class="briefing-scroll"><div class="menu-kicker">CAMPAIGN 05 // OA TEMPEST</div><div class="menu-title small" id="tempestBriefTitle"></div><p class="brief-copy" id="tempestBriefCopy"></p><div class="objectives"><div>MISSION OBJECTIVES</div><div id="tempestBriefGoals"></div><div>EXECUTION GUIDANCE</div><p id="tempestBriefGuidance"></p></div></div><div class="briefing-actions"><button id="tempestBriefBegin" class="menu-primary">BEGIN OPERATION</button><button id="tempestBriefBack" class="menu-secondary active">BACK TO CAMPAIGN</button></div></div>';document.body.appendChild(o);$('#tempestBriefBegin').addEventListener('click',()=>cpBeginTempest(tempestBriefingMission));$('#tempestBriefBack').addEventListener('click',()=>{o.classList.add('hidden');$('#campaignMenu').classList.remove('hidden')})}
 const b=TEMPEST_BRIEFS[id];$('#tempestBriefTitle').textContent=id+' // '+b.title;$('#tempestBriefBegin').textContent=id==='05-05'?'BEGIN FINAL OPERATION':'BEGIN OPERATION';$('#tempestBriefCopy').textContent=b.brief;$('#tempestBriefGoals').innerHTML=b.goals.map(x=>'<p>'+x+'</p>').join('');$('#tempestBriefGuidance').textContent=id==='05-01'?'Use ISR to discover unknown maritime tracks, collect evidence reports, then clear confirmed benign traffic or intercept confirmed hostile contacts. Base every disposition on collected evidence to protect intelligence integrity.':id==='05-04'||id==='05-05'?'Select and collect maritime tracks inside ISR coverage, resolve contacts from evidence, then prioritize corroborated high-interest vessels before their 3-minute window closes.':id==='05-03'?'Collect both tracks and observe each repeatedly under ISR to establish a unique shared-port or coordinated-movement association.':'Collect contacts and observe them repeatedly inside ISR coverage; AIS gaps alone do not establish intent.';$('#campaignMenu').classList.add('hidden');o.classList.remove('hidden')
}function cpBeginTempest(id){if(!cpTempestUnlocked(id))return;missionTransition(id+' // '+TEMPEST_BRIEFS[id].title,'OA TEMPEST // LOADING OPERATION',()=>cpBeginTempestNow(id))}
function cpBeginTempestNow(id){if(!cpTempestUnlocked(id))return;musicSetMode('mission');campaignMenuOA='TEMPEST';campaignMission=id;campaignIds=0;campaignCorrect=0;campaignThreatResolved=0;campaignNonThreatResolved=0;campaignCollectionInterrupted=0;campaignFinished=false;campaignCompromise=0;tempestFailureReason='';cpSetOAVisual('TEMPEST');cpHideCampaignOverlays();$('#briefingTempest')?.classList.add('hidden');window.CP_MENU=false;window.CP_PAUSED=false;$('#startScreen').style.display='none';deploy();last=performance.now()}
/* CAMPAIGN 06 // POLARIS // FIVE-MISSION FIELDING */
const POLARIS_BRIEFS={
 '06-01':{title:'ICE WATCH',brief:'Initial reporting indicates unfamiliar movement across the POLARIS archipelago. Routine research, rescue, and supply activity remains active. Establish a clean baseline before elevating any contact.',goals:['Resolve 8 contacts correctly','Collect supporting ISR on 4 contacts','Maintain at least 80% intelligence integrity'],guide:'Task ISR over the active corridors. Collect each unknown before classifying; clear routine research, rescue, and supply tracks, and intercept only confirmed threats.'},
 '06-02':{title:'DRIFT SIGNATURE',brief:'The baseline shows recurrent movement around the island corridors. Determine which contacts follow established patterns and which depart from them.',goals:['Resolve 9 contacts correctly','Re-observe 4 contacts after they leave ISR coverage','Maintain at least 80% intelligence integrity'],guide:'Observe a contact, allow it to leave ISR coverage, then reacquire it. Repeated observations develop track history and distinguish routine drift from anomalous movement.'},
 '06-03':{title:'RELAY SILENCE',brief:'Several remote relay sites report intermittent traffic and unexplained signal loss. Correlate independently observed contacts with the sites before drawing conclusions.',goals:['Resolve 9 contacts correctly','Establish 3 evidence-supported relay associations','Maintain at least 80% intelligence integrity'],guide:'The blue infrastructure sites are the relay network. Re-observe a contact near the same site at least twice, collect it, then issue the supported disposition. Each unique contact/site link counts once.'},
 '06-04':{title:'POLAR WINDOW',brief:'Polar communications alternate between a clear satellite look window and a predictable signal shadow. Evidence gathered during a clear window is required to establish the northern route picture.',goals:['Resolve 10 contacts correctly','Collect evidence from 5 contacts during clear windows','Maintain at least 80% intelligence integrity'],guide:'The satellite look cycle is deterministic: CLEAR WINDOW for 40 seconds, then SIGNAL SHADOW for 20 seconds. The objective ribbon shows the current state. Collect distinct contacts during clear windows; use shadow periods to reposition ISR.'},
 '06-05':{title:'NORTH PASSAGE',brief:'Integrate the POLARIS picture across research, rescue, supply, and unidentified movement. Establish which contacts support the remote relay network while preserving legitimate activity.',goals:['Resolve 12 contacts correctly','Collect evidence from 8 distinct contacts','Establish 2 evidence-supported relay associations','Maintain at least 80% intelligence integrity'],guide:'Combine repeated observation near relay sites with evidence-based classification. A location alone does not establish hostile intent; preserve routine research, rescue, and supply traffic.'}
};
const POLARIS_OBJECTIVES={
 '06-01':{resolve:8,metric:'evidence',metricLabel:'EVIDENCE',metricTarget:4,third:'integrity',thirdLabel:'INTEGRITY'},
 '06-02':{resolve:9,metric:'reobserved',metricLabel:'REOBSERVE',metricTarget:4,third:'integrity',thirdLabel:'INTEGRITY'},
 '06-03':{resolve:9,metric:'relay',metricLabel:'RELAY LINK',metricTarget:3,third:'integrity',thirdLabel:'INTEGRITY',thirdTarget:80},
 '06-04':{resolve:10,metric:'clearEvidence',metricLabel:'CLEAR WINDOW',metricTarget:5,third:'integrity',thirdLabel:'INTEGRITY'},
 '06-05':{resolve:12,metric:'evidence',metricLabel:'EVIDENCE',metricTarget:8,third:'relay',thirdLabel:'RELAY LINK',thirdTarget:2}
};
let polarisEvidence=new Set(),polarisClearEvidence=new Set(),polarisRepeatTracks=new Set(),polarisRelayLinks=new Set(),polarisLastWindowState=null,polarisBriefingMission='';
function cpPolarisId(id=campaignMission){return /^06-0[1-5]$/.test(id||'')}
function cpPolarisUnlocked(id){return campaignMissionUnlocked(id)}
function cpPolarisReset(){polarisEvidence=new Set();polarisClearEvidence=new Set();polarisRepeatTracks=new Set();polarisRelayLinks=new Set();polarisLastWindowState=null}
function cpPolarisWindowOpen(now=performance.now()){const elapsed=Math.max(0,(now-start)/1000);return elapsed%60<40}
function cpPolarisMetricValue(id=campaignMission){if(id==='06-01')return polarisEvidence.size;if(id==='06-02')return polarisRepeatTracks.size;if(id==='06-03')return polarisRelayLinks.size;if(id==='06-04')return polarisClearEvidence.size;if(id==='06-05')return polarisEvidence.size;return 0}
function cpPolarisThirdValue(id=campaignMission){return id==='06-05'?polarisRelayLinks.size:integrity}
function cpPolarisCounts(){return {resolved:campaignCorrect,evidence:polarisEvidence.size,clearEvidence:polarisClearEvidence.size,reobserved:polarisRepeatTracks.size,relay:polarisRelayLinks.size,integrity}}
function cpPolarisObjectiveExtra(){const host=$('#objectiveTracker');if(!host)return;host.classList.toggle('has-inline-extra',['05-04','05-05','06-04'].includes(campaignMission));let chip=$('#polarisObjectiveExtra');if(!chip){chip=document.createElement('span');chip.id='polarisObjectiveExtra';chip.className='objective-chip campaign-inline-objective';chip.innerHTML='<em></em><b></b>';host.appendChild(chip)}const show=campaignMission==='06-04';chip.hidden=!show;if(!show)return;const elapsed=Math.max(0,(performance.now()-start)/1000),within=elapsed%60,open=within<40,remaining=Math.ceil(open?40-within:60-within),label=chip.querySelector('em'),value=chip.querySelector('b');label.textContent='WINDOW';value.textContent=(open?'CLEAR ':'SHADOW ')+String(Math.floor(remaining/60)).padStart(2,'0')+':'+String(remaining%60).padStart(2,'0');chip.title=open?'Polar satellite look window is clear':'Polar signal shadow: reposition ISR';chip.classList.toggle('window-shadow',!open)}function cpPolarisWindowTick(now){if(campaignMission!=='06-04'||!running)return;const open=cpPolarisWindowOpen(now);if(polarisLastWindowState===null){polarisLastWindowState=open;banner(open?'POLAR WINDOW // CLEAR':'POLAR SIGNAL SHADOW',1100);return}if(open!==polarisLastWindowState){polarisLastWindowState=open;const message=open?'POLAR WINDOW // CLEAR':'POLAR SIGNAL SHADOW // REPOSITION ISR';banner(message,1300);log(message);sound('level')}}
function cpPolarisRecordEvidence(t,source='ISR COLLECTION'){if(!cpPolarisId()||!t)return;const before=polarisEvidence.size;polarisEvidence.add(t.id);if(campaignMission==='06-04'&&cpPolarisWindowOpen())polarisClearEvidence.add(t.id);if(polarisEvidence.size!==before)rec('POLARIS_EVIDENCE',t.id+' // '+source+(campaignMission==='06-04'&&cpPolarisWindowOpen()?' // CLEAR WINDOW':''));cpPolarisCheck();ui(true)}
function cpPolarisRecordObservation(t){if(!cpPolarisId()||!t?.intel)return;if(['06-02','06-05'].includes(campaignMission)&&t.intel.observations>=2){const before=polarisRepeatTracks.size;polarisRepeatTracks.add(t.id);if(polarisRepeatTracks.size!==before){cpNotice('POLAR TRACK REACQUIRED',t.id+' // REPEATED ISR HISTORY','intel');cpPolarisCheck()}}}
function cpPolarisRecordResolution(t,correct){if(!cpPolarisId()||!t||!correct)return;if(['06-03','06-05'].includes(campaignMission)&&t.intel?.observations>=2){Object.entries(t.intel.siteObs||{}).forEach(([site,count])=>{if(count>=2)polarisRelayLinks.add(t.id+'@'+site)})}cpPolarisCheck()}
function cpPolarisComplete(){const id=campaignMission,cfg=POLARIS_OBJECTIVES[id],m=cpPolarisCounts();return !!cfg&&m.resolved>=cfg.resolve&&cpPolarisMetricValue(id)>=cfg.metricTarget&&m.integrity>=80&&(cfg.third!=='relay'||m.relay>=cfg.thirdTarget)}
function cpPolarisCheck(){if(!cpPolarisId()||campaignFinished)return;if(integrity<80){cpPolarisFinish(false,'INTELLIGENCE INTEGRITY BELOW 80%');return}if(cpPolarisComplete())cpPolarisFinish(true,'')}
function cpPolarisFinish(pass,reason=''){
 if(campaignFinished)return;const id=campaignMission,brief=POLARIS_BRIEFS[id],cfg=POLARIS_OBJECTIVES[id],m=cpPolarisCounts();
 campaignFinished=true;running=false;stopCollect();window.CP_MENU=true;A.dest=null;A.mode='IDLE';campaignMenuOA='ARCTIC';
 if(pass){campaignProgressionWrite('ci-c06-'+id.slice(-2)+'-complete','1');if(id==='06-05')progressionCollectUnlocks()}
 const rk=$('#resultKicker');if(rk)rk.textContent='CAMPAIGN 06 // OA POLARIS';
 $('#resultTitle').textContent=pass?brief.title+' // MISSION COMPLETE':brief.title+' // OBJECTIVES INCOMPLETE';
 const relayTarget=cfg.metric==='relay'?cfg.metricTarget:(cfg.third==='relay'?cfg.thirdTarget:0);
 $('#resultBody').innerHTML='OA POLARIS // '+id+' '+brief.title+'<br><br>CONTACTS RESOLVED&nbsp;&nbsp;'+m.resolved+' / '+cfg.resolve+'<br>UNIQUE EVIDENCE&nbsp;&nbsp;&nbsp;&nbsp;'+m.evidence+(cfg.metric==='evidence'?' / '+cfg.metricTarget:'')+(cfg.metric==='clearEvidence'?'<br>CLEAR-WINDOW EVIDENCE&nbsp;'+m.clearEvidence+' / '+cfg.metricTarget:'')+(cfg.metric==='reobserved'?'<br>REOBSERVED TRACKS&nbsp;&nbsp;&nbsp;'+m.reobserved+' / '+cfg.metricTarget:'')+(relayTarget?'<br>RELAY ASSOCIATIONS&nbsp;&nbsp;'+m.relay+' / '+relayTarget:'')+'<br>INTELLIGENCE INTEGRITY&nbsp;'+Math.round(m.integrity)+'%'+(reason?'<br>'+reason:'');
 $('#resultContinue').classList.toggle('hidden',!pass);$('#resultRetry').classList.toggle('hidden',pass);$('#campaignResult').classList.remove('hidden');outcomeFeedback(pass);cpPolarisRefresh();ui(true);
}
function cpPolarisRefresh(){const pane=$('#campaignPaneArctic');if(!pane)return;let list=pane.querySelector('.polaris-mission-list');if(!list){list=document.createElement('div');list.className='campaign-list c06-list polaris-mission-list';pane.appendChild(list)}Object.keys(POLARIS_BRIEFS).forEach(id=>{let b=document.getElementById('mission'+id.replace('-',''));if(!b){b=document.createElement('button');b.type='button';b.id='mission'+id.replace('-','');b.className='mission-row';b.innerHTML='<b>'+id+' // '+POLARIS_BRIEFS[id].title+'</b><span></span>';b.addEventListener('click',()=>cpPolarisBrief(id));list.appendChild(b)}const available=cpPolarisUnlocked(id),done=progressionComplete('ci-c06-'+id.slice(-2)+'-complete'),s=b.querySelector('span');b.disabled=!available;b.classList.toggle('available',available);if(s)s.textContent=progressionStatusLabel('ci-c06-'+id.slice(-2)+'-complete',available,done)})}
function cpPolarisBrief(id){if(!cpPolarisUnlocked(id))return;polarisBriefingMission=id;let o=$('#briefingPolaris');if(!o){o=document.createElement('div');o.id='briefingPolaris';o.className='gameoverlay hidden';o.innerHTML='<div class="menupanel briefingpanel briefingpanel-polaris"><div class="briefing-scroll"><div class="menu-kicker">CAMPAIGN 06 // OA POLARIS</div><div class="menu-title small" id="polarisBriefTitle"></div><p class="brief-copy" id="polarisBriefCopy"></p><div class="objectives"><div>MISSION OBJECTIVES</div><div id="polarisBriefGoals"></div><div>EXECUTION GUIDANCE</div><p id="polarisBriefGuidance"></p></div></div><div class="briefing-actions"><button id="polarisBriefBegin" class="menu-primary">BEGIN OPERATION</button><button id="polarisBriefBack" class="menu-secondary active">BACK TO CAMPAIGN</button></div></div>';document.body.appendChild(o);$('#polarisBriefBegin').addEventListener('click',()=>cpPolarisBegin(polarisBriefingMission));$('#polarisBriefBack').addEventListener('click',()=>{o.classList.add('hidden');$('#campaignMenu').classList.remove('hidden')})}const b=POLARIS_BRIEFS[id];$('#polarisBriefTitle').textContent=id+' // '+b.title;$('#polarisBriefBegin').textContent=id==='06-05'?'BEGIN FINAL OPERATION':'BEGIN OPERATION';$('#polarisBriefCopy').textContent=b.brief;$('#polarisBriefGoals').innerHTML=b.goals.map(x=>'<p>'+x+'</p>').join('');$('#polarisBriefGuidance').textContent=b.guide;$('#campaignMenu').classList.add('hidden');o.classList.remove('hidden')}
function cpPolarisBegin(id){if(!cpPolarisUnlocked(id))return;missionTransition(id+' // '+POLARIS_BRIEFS[id].title,'OA POLARIS // LOADING OPERATION',()=>cpPolarisBeginNow(id))}
function cpPolarisBeginNow(id){if(!cpPolarisUnlocked(id))return;musicSetMode('mission');campaignMenuOA='ARCTIC';campaignMission=id;campaignIds=0;campaignCorrect=0;campaignThreatResolved=0;campaignNonThreatResolved=0;campaignCollectionInterrupted=0;campaignFinished=false;campaignCompromise=0;cpPolarisReset();cpSetOAVisual('ARCTIC');cpHideCampaignOverlays();$('#briefingPolaris')?.classList.add('hidden');window.CP_MENU=false;window.CP_PAUSED=false;$('#startScreen').style.display='none';deploy();last=performance.now()}
$('#resultRetry')?.addEventListener('click',e=>{if(!cpPolarisId())return;e.preventDefault();e.stopImmediatePropagation();cpPolarisBegin(campaignMission)},true);
function cpHideCampaignOverlays(){['campaignMenu','briefing0101','briefing0102','briefing0103','briefing0104','briefing0105','briefing0301','briefing0302','briefing0303','briefing0304','briefing0305','briefing0401','briefing0402','briefing0403','briefing0404','briefing0405','briefingTempest','briefingPolaris','campaignResult'].forEach(id=>$('#'+id)?.classList.add('hidden'))}
let campaignMenuOA='KESTREL';function refreshCampaignOAClassification(now=performance.now()){
 const areas={
  KESTREL:{num:'01',name:'KESTREL',theme:'FOUNDATION',pane:'campaignPaneKestrel'},
  VANTAGE:{num:'02',name:'VANTAGE',theme:'NETWORK',pane:'campaignPaneVantage'},
  VERDANT:{num:'03',name:'VERDANT',theme:'PATTERN OF LIFE',pane:'campaignPaneVerdant'},
  MIRAGE:{num:'04',name:'MIRAGE',theme:'CAPABILITY',pane:'campaignPaneMirage'},
  TEMPEST:{num:'05',name:'TEMPEST',theme:'FOUNDATION',pane:'campaignPaneTempest'},
  ARCTIC:{num:'06',name:'POLARIS',theme:'NORTHERN APPROACHES',pane:'campaignPaneArctic'}
 };
 const keep=(el)=>{if(!el)return '';if(!el.dataset.ciIdentityText)el.dataset.ciIdentityText=el.textContent;return el.dataset.ciIdentityText;};
 Object.entries(areas).forEach(([oa,cfg])=>{
  const classified=!globalOAIdentityRevealed(oa),mask=classified?homeOAScrambledName(oa,now):'';
  const tab=document.querySelector('[data-campaign-oa="'+oa+'"]');
  const tabName=tab?.querySelector('b'),tabTheme=tab?.querySelector('span');
  if(tab){tab.classList.toggle('oa-classified',classified);tab.classList.toggle('oa-revealed',!classified);tab.classList.toggle('oa-scrambling',classified&&mask.includes('[')&&!mask.includes('[REDACTED]'));}
  if(tabName){const original=keep(tabName);tabName.textContent=classified?cfg.num+' // '+mask:original;}
  if(tabTheme){const original=keep(tabTheme);tabTheme.textContent=classified?mask:original;tabTheme.classList.toggle('oa-classified',classified);tabTheme.classList.toggle('oa-scrambling',classified&&mask.includes('[')&&!mask.includes('[REDACTED]'));}
  const pane=document.getElementById(cfg.pane);if(!pane)return;
  const heading=pane.querySelector('.campaign-section-title');
  if(heading){keep(heading);heading.textContent=classified?'CAMPAIGN '+cfg.num+' // OA '+mask+' // '+mask:heading.dataset.ciIdentityText;heading.classList.toggle('oa-classified',classified);heading.classList.toggle('oa-scrambling',classified&&mask.includes('[')&&!mask.includes('[REDACTED]'));}
  pane.querySelectorAll('.mission-row b').forEach(label=>{
   const original=keep(label),prefix=(original.match(/^\s*\d{2}-\d{2}\s*\/\/\s*/) || [''])[0];
   label.textContent=classified?prefix+mask:original;
   label.classList.toggle('oa-classified',classified);
   label.classList.toggle('oa-scrambling',classified&&mask.includes('[')&&!mask.includes('[REDACTED]'));
  });
 });
}
function selectCampaignOA(oa){campaignMenuOA=['VANTAGE','VERDANT','MIRAGE','TEMPEST','ARCTIC'].includes(oa)?oa:'KESTREL';document.querySelectorAll('[data-campaign-oa]').forEach(b=>b.classList.toggle('selected',b.dataset.campaignOa===campaignMenuOA));$('#campaignPaneKestrel')?.classList.toggle('hidden',campaignMenuOA!=='KESTREL');$('#campaignPaneVantage')?.classList.toggle('hidden',campaignMenuOA!=='VANTAGE');$('#campaignPaneVerdant')?.classList.toggle('hidden',campaignMenuOA!=='VERDANT');$('#campaignPaneMirage')?.classList.toggle('hidden',campaignMenuOA!=='MIRAGE');$('#campaignPaneTempest')?.classList.toggle('hidden',campaignMenuOA!=='TEMPEST');$('#campaignPaneArctic')?.classList.toggle('hidden',campaignMenuOA!=='ARCTIC');const activeCampaignPane=document.querySelector('#campaignMenu .campaign-pane:not(.hidden)');if(activeCampaignPane)activeCampaignPane.scrollTop=0;cpTempestRefresh();cpPolarisRefresh();refreshCampaignOAClassification()}
function cpCheck0501(){
 if(campaignMission!=='05-01'||campaignFinished)return;
 if(resolved>=10&&tempestEvidence>=8&&integrity>=80)cpFinish0501(true);
}
function cpFinish0501(pass){
 if(campaignFinished)return;
 campaignFinished=true;running=false;stopCollect();window.CP_MENU=true;
 const rk=$('#resultKicker');if(rk)rk.textContent='CAMPAIGN 05 // OA TEMPEST';
 if(pass){campaignProgressionWrite('ci-c05-01-complete','1');}
 $('#resultTitle').textContent=pass?'SEA LANES PICTURE ESTABLISHED':'SEA LANES OBJECTIVES INCOMPLETE';
 $('#resultBody').innerHTML='OA TEMPEST // 05-01 SEA LANES<br><br>CONTACTS RESOLVED&nbsp;&nbsp;'+resolved+' / 10<br>COLLECTION EVIDENCE&nbsp;&nbsp;'+tempestEvidence+' / 8<br>INTELLIGENCE INTEGRITY&nbsp;&nbsp;'+Math.round(integrity)+'%<br>BENIGN / ANOMALOUS&nbsp;&nbsp;'+campaignNonThreatResolved+' / '+campaignThreatResolved;
 $('#resultContinue').classList.toggle('hidden',!pass);$('#resultRetry').classList.toggle('hidden',pass);$('#campaignResult').classList.remove('hidden');outcomeFeedback(pass);
}
function cpBegin0501(){
 if(!cpTempestUnlocked('05-01'))return;
 missionTransition('05-01 // SEA LANES','OA TEMPEST // LOADING OPERATION',cpBegin0501Now);
}
function cpBegin0501Now(){
 if(!cpTempestUnlocked('05-01'))return;
 musicSetMode('mission');
 campaignMenuOA='TEMPEST';
 campaignMission='05-01';
 campaignIds=0;campaignCorrect=0;campaignThreatResolved=0;campaignNonThreatResolved=0;campaignCollectionInterrupted=0;campaignFinished=false;campaignCompromise=0;
 cpSetOAVisual('TEMPEST');
 cpHideCampaignOverlays();
 window.CP_MENU=false;
 window.CP_PAUSED=false;
 $('#startScreen').style.display='none';
 deploy();
 last=performance.now();
}
function cpCampaignMenu(){ciFirstVisitMark('campaign');progressionMarkRead('campaign');refreshProgressionBadges();['briefing0301','briefing0302','briefing0303','briefing0304','briefing0305','briefing0401','briefing0402','briefing0403','briefing0404','briefing0405','briefingPolaris'].forEach(id=>$('#'+id)?.classList.add('hidden'));cpSetOAVisual(campaignMenuOA);selectCampaignOA(campaignMenuOA);cpRefreshCampaign02();cpRefreshVerdant();cpRefreshMirage();cpTempestRefresh();cpPolarisRefresh();clearTutorialState();musicSetMode('menu');cpRefreshCampaign();window.CP_MENU=true;window.CP_PAUSED=false;running=false;stopCollect();$('#mainMenu').classList.add('hidden');$('#pauseMenu').classList.add('hidden');$('#briefing0101').classList.add('hidden');$('#briefing0102').classList.add('hidden');$('#briefing0103').classList.add('hidden');$('#briefing0104').classList.add('hidden');$('#briefing0105').classList.add('hidden');$('#campaignResult').classList.add('hidden');$('#campaignMenu').classList.remove('hidden')}
function cpBrief0101(){$('#campaignMenu').classList.add('hidden');$('#briefing0101').classList.remove('hidden')}
function cpUnlocked0102(){
  if(devProgressionBypassActive())return true;
  const key='ci-c01-0102-unlocked';
  if(!devProgressionSimulationActive()&&!devProgressionBypassActive()&&sessionStorage.getItem(key)==='1'){localStorage.setItem(key,'1');return true}
  return progressionComplete(key);
}
function cpRefreshCampaign(){
 const missions=[
  ['0101',true,
   progressionComplete('ci-c01-01-complete')||
   progressionComplete('ci-c01-0102-unlocked')],

  ['0102',cpUnlocked0102(),
   progressionComplete('ci-c01-02-complete')||
   progressionComplete('ci-c01-0103-unlocked')],

  ['0103',cpUnlocked0103(),
   progressionComplete('ci-c01-03-complete')||
   progressionComplete('ci-c01-0104-unlocked')],

  ['0104',cpUnlocked0104(),
   progressionComplete('ci-c01-04-complete')||
   progressionComplete('ci-c01-0105-unlocked')],

  ['0105',cpUnlocked0105(),
   progressionComplete('ci-c01-complete')]
 ];

 missions.forEach(([n,available,done])=>{
  const b=$('#mission'+n);
  if(!b)return;

  const st=b.querySelector('span');

  b.disabled=!available;
  b.classList.toggle('available',available);

  if(st)st.textContent=progressionStatusLabel('ci-c01-'+n.slice(2)+'-complete',available,done);
 });
}
function cpBrief0102(){if(!campaignMissionUnlocked('01-02'))return;if(!cpUnlocked0102())return;$('#campaignMenu').classList.add('hidden');$('#briefing0102').classList.remove('hidden')}
function cpUnlocked0103(){return devProgressionBypassActive()||progressionComplete('ci-c01-0103-unlocked')}
function cpBrief0103(){if(!campaignMissionUnlocked('01-03'))return;if(!cpUnlocked0103())return;$('#campaignMenu').classList.add('hidden');$('#briefing0103').classList.remove('hidden')}
function cpUnlocked0104(){return devProgressionBypassActive()||progressionComplete('ci-c01-0104-unlocked')}
function cpBrief0104(){if(!campaignMissionUnlocked('01-04'))return;if(!cpUnlocked0104())return;$('#campaignMenu').classList.add('hidden');$('#briefing0104').classList.remove('hidden')}
function cpUnlocked0105(){return devProgressionBypassActive()||progressionComplete('ci-c01-0105-unlocked')}
function cpBrief0105(){if(!campaignMissionUnlocked('01-05'))return;if(!cpUnlocked0105())return;$('#campaignMenu').classList.add('hidden');$('#briefing0105').classList.remove('hidden')}
const tutorialIntelSeen=new Set();
function tutorialClearHighlights(){document.querySelectorAll('.training-target-highlight').forEach(el=>el.classList.remove('training-target-highlight'));$('#mapWrap')?.classList.remove('training-map-focus')}
function tutorialSetHighlights(step){tutorialClearHighlights();const controls={1:['asset','isrTask'],3:['collect'],4:['clear'],6:['passiveDeploy'],7:['passiveDeploy'],8:['ewoSweep'],9:['supplyUse'],11:['tutorialNext'],12:['tutorialNext']}[step]||[];controls.forEach(id=>$('#'+id)?.classList.add('training-target-highlight'));if(step===3)T.filter(t=>!t.done&&t.type==='UNKNOWN').forEach(t=>t.el?.classList.add('training-target-highlight'));if(step===2||step===7)$('#mapWrap')?.classList.add('training-map-focus');if(step===5)[['MITIGATE','intelMitigate'],['EXPLOIT','intelExploit'],['SUPPLY','intelSupply']].forEach(([kind,id])=>{if(!tutorialIntelSeen.has(kind))$('#'+id)?.classList.add('training-target-highlight')});if(step===9||step===10)document.querySelectorAll('#blueSites .training-degraded').forEach(el=>el.classList.add('training-target-highlight'))}
function clearTutorialState(){if(campaignMission==='TUTORIAL')passiveReset();tutorialStep=0;tutorialIntelSeen.clear();$("#mapWrap")?.classList.remove("training-intel-report");tutorialClearHighlights();const g=$('#tutorialGuide');if(g){g.classList.add('hidden');delete g.dataset.trainingStep}const n=$('#tutorialNext');if(n){n.textContent='CONTINUE';n.classList.add('hidden')} }
function missionTransition(title,sub,fn){clearTutorialState();document.querySelectorAll('.gameoverlay').forEach(el=>el.classList.add('hidden'));const m=$('#missionLoad');$('#missionLoadTitle').textContent=title||'OA KESTREL';$('#missionLoadSub').textContent=sub||'ESTABLISHING TACTICAL PICTURE';m.classList.remove('hidden');m.classList.add('show');window.CP_MENU=true;setTimeout(()=>{m.classList.remove('show');m.classList.add('hidden');window.CP_MENU=false;fn()},3000)}
function trainingPrime(){passiveCredits=9999;ewoUses=0;supplyPackages=1;const d=B.slice(0,2);d.forEach(b=>{b.exposure=100;b.degraded=true;b.reconstituting=false;cpRenderBlueSite(b);b.el.classList.add('training-degraded')});campaignCompromise=cpCompromiseFloor();ui(true)}
function cpBegin0105(){if(!campaignMissionUnlocked('01-05'))return;missionTransition('01-05 // CONDITIONS SET','OA KESTREL // LOADING OPERATION',cpBegin0105Now)}
function cpBegin0105Now(){if(!campaignMissionUnlocked('01-05'))return;musicSetMode('mission');campaignMission='01-05';campaignIds=0;campaignCorrect=0;campaignThreatResolved=0;campaignNonThreatResolved=0;campaignStationaryAssessed=0;campaignStationarySpawned=0;campaignProximityAssessed=0;campaignCollectionInterrupted=0;campaignCompromise=0;campaignFinished=false;cpIntelDropReset();cpHideCampaignOverlays();let w=$('#hostileCollectionWarning');if(w)w.classList.add('hidden');window.CP_MENU=false;window.CP_PAUSED=false;$('#startScreen').style.display='none';deploy();last=performance.now()}
function cpBegin0104(){if(!campaignMissionUnlocked('01-04'))return;missionTransition('01-04 // CONTESTED','OA KESTREL // LOADING OPERATION',cpBegin0104Now)}
function cpBegin0104Now(){if(!campaignMissionUnlocked('01-04'))return;musicSetMode('mission');campaignMission='01-04';campaignIds=0;campaignCorrect=0;campaignThreatResolved=0;campaignNonThreatResolved=0;campaignStationaryAssessed=0;campaignStationarySpawned=0;campaignProximityAssessed=0;campaignCollectionInterrupted=0;campaignCompromise=0;campaignFinished=false;cpIntelDropReset();cpHideCampaignOverlays();let w=$('#hostileCollectionWarning');if(w)w.classList.add('hidden');window.CP_MENU=false;window.CP_PAUSED=false;$('#startScreen').style.display='none';deploy();last=performance.now()}

function cpBegin0103(){if(!campaignMissionUnlocked('01-03'))return;missionTransition('01-03 // INDICATORS','OA KESTREL // LOADING OPERATION',cpBegin0103Now)}
function cpBegin0103Now(){if(!campaignMissionUnlocked('01-03'))return;musicSetMode('mission');campaignMission='01-03';campaignIds=0;campaignCorrect=0;campaignThreatResolved=0;campaignNonThreatResolved=0;campaignStationaryAssessed=0;campaignStationarySpawned=0;campaignProximityAssessed=0;campaignFinished=false;cpHideCampaignOverlays();window.CP_MENU=false;window.CP_PAUSED=false;$('#startScreen').style.display='none';deploy();last=performance.now()}

function cpBegin0102(){if(!campaignMissionUnlocked('01-02'))return;missionTransition('01-02 // PATTERN','OA KESTREL // LOADING OPERATION',cpBegin0102Now)}
function cpBegin0102Now(){if(!campaignMissionUnlocked('01-02'))return;musicSetMode('mission');campaignMission='01-02';campaignIds=0;campaignCorrect=0;campaignThreatResolved=0;campaignNonThreatResolved=0;campaignStationaryAssessed=0;campaignStationarySpawned=0;campaignFinished=false;cpHideCampaignOverlays();window.CP_MENU=false;window.CP_PAUSED=false;$('#startScreen').style.display='none';deploy();last=performance.now()}

function cpBegin0101(){missionTransition('01-01 // ESTABLISH','OA KESTREL // LOADING OPERATION',cpBegin0101Now)}
function cpBegin0101Now(){musicSetMode('mission');campaignMission='01-01';campaignIds=0;campaignCorrect=0;campaignThreatResolved=0;campaignNonThreatResolved=0;campaignFinished=false;cpHideCampaignOverlays();window.CP_MENU=false;window.CP_PAUSED=false;$('#startScreen').style.display='none';deploy();last=performance.now()}
function outcomeFeedback(pass){const overlay=$('#campaignResult'),region=String(campaignMission||'').slice(0,2),oa={'01':'KESTREL','02':'VANTAGE','03':'VERDANT','04':'MIRAGE','05':'TEMPEST','06':'POLARIS'}[region],kicker=$('#resultKicker');if(kicker&&oa)kicker.textContent='CAMPAIGN '+region+' // OA '+oa;$('#resultReturnCommand')?.classList.toggle('hidden',pass);if(pass){playAsset(missionSuccessAudio,.9,'sfx');banner('MISSION COMPLETE // CONDITIONS SET',2200);overlay.classList.remove('loss-flash');overlay.classList.add('win-flash')}else{playAsset(missionFailAudio,.95,'sfx');banner('MISSION FAILURE // CONDITIONS NOT SET',2600);overlay.classList.remove('win-flash');overlay.classList.add('loss-flash')}}
function cpCheck0101(){if(campaignMission!=='01-01'||campaignFinished)return;if(campaignCorrect>=10){campaignFinished=true;running=false;stopCollect();window.CP_MENU=true;const pass=integrity>=80;if(pass){campaignProgressionWrite('ci-c01-01-complete','1');campaignProgressionWrite('ci-c01-0102-unlocked','1');campaignSessionProgressionWrite('ci-c01-0102-unlocked','1');cpRefreshCampaign()}$('#resultTitle').textContent=pass?'CONDITIONS HAVE BEEN SET':'CONDITIONS NOT SET';$('#resultBody').innerHTML='OA KESTREL<br>INITIAL OPERATIONAL PICTURE '+(pass?'ESTABLISHED':'INCOMPLETE')+'<br><br>CONTACTS IDENTIFIED&nbsp;&nbsp;&nbsp;&nbsp;'+campaignIds+'<br>CORRECT DISPOSITIONS&nbsp;&nbsp;'+campaignCorrect+'<br>HOSTILE / IRREGULAR&nbsp;&nbsp;&nbsp;'+campaignThreatResolved+'<br>FRIENDLY / NEUTRAL&nbsp;&nbsp;&nbsp;'+campaignNonThreatResolved+'<br>INTELLIGENCE INTEGRITY&nbsp;'+Math.round(integrity)+'%<br>SCORE&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+Math.max(0,Math.round(score));$('#resultContinue').classList.toggle('hidden',!pass);$('#resultRetry').classList.toggle('hidden',pass);$('#campaignResult').classList.remove('hidden');outcomeFeedback(pass)}}
function cpCheck0102(){
if(campaignMission!=='01-02'||campaignFinished)return;
if(campaignCorrect>=12&&campaignStationaryAssessed>=4){
  campaignFinished=true;running=false;stopCollect();window.CP_MENU=true;
  const pass=integrity>=80;if(pass){campaignProgressionWrite('ci-c01-02-complete','1');campaignProgressionWrite('ci-c01-0103-unlocked','1');cpRefreshCampaign()}
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
  const pass=integrity>=80;if(pass){campaignProgressionWrite('ci-c01-03-complete','1');campaignProgressionWrite('ci-c01-0104-unlocked','1');cpRefreshCampaign()}
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
   campaignProgressionWrite('ci-c01-04-complete','1');campaignProgressionWrite('ci-c01-0105-unlocked','1');cpRefreshCampaign();
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
 else if(pass){title='CONDITIONS HAVE BEEN SET';lead='CAMPAIGN 01 // OA KESTREL COMPLETE';campaignProgressionWrite('ci-c01-complete','1');progressionCollectUnlocks();cpRefreshCampaign();}
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
 '02-01':{title:'MEMORY',sub:'MAINTAIN CONTACT CONTINUITY',guide:'Maintain ISR coverage long enough to establish track memory. When a previously observed contact leaves coverage, reacquire it later to develop continuity.',need:'Reacquire 4 persistent contacts and resolve 8 correctly.',pass:s=>s.continuity>=4&&campaignCorrect>=8},
 '02-02':{title:'PATTERN',sub:'DEVELOP RECURRING LOCATION PATTERNS',guide:'Re-observe known contacts operating around VANTAGE activity areas. Repeated observations of the same track develop recurring location patterns.',need:'Develop patterns on 3 contacts and resolve 10 correctly.',pass:s=>s.patterns>=3&&campaignCorrect>=10},
 '02-03':{title:'ASSOCIATION',sub:'DEVELOP CONTACT RELATIONSHIPS',guide:'Maintain coverage around VANTAGE activity areas. Distinct affiliated contacts observed together develop supported relationships. Develop three distinct relationships while continuing to resolve contacts.',need:'Develop 3 supported relationships and resolve 10 contacts correctly.',pass:s=>s.associations>=3&&campaignCorrect>=10},
 '02-04':{title:'NETWORK',sub:'BUILD THE OBSERVED NETWORK',guide:'Develop distinct supported relationships between affiliated contacts. Three supported relationships establish the observed network; continue resolving contacts while controlling OE compromise.',need:'Develop 3 supported relationships and 1 established network, resolve 12 contacts correctly, and hold OE below 60%.',pass:s=>s.supported>=3&&s.established>=1&&campaignCorrect>=12&&campaignCompromise<60},
 '02-05':{title:'DISRUPTION',sub:'RESOLVE THE NETWORK UNDER PRESSURE',guide:'Maintain the established network picture while resolving contacts under pressure. Develop three supported relationships to establish the network, preserve Intelligence Integrity, and finish below the OE compromise limit.',need:'Develop 3 supported relationships and 1 established network, resolve 14 contacts, maintain 80% integrity, and finish OE below 50%.',pass:s=>s.supported>=3&&s.established>=1&&campaignCorrect>=14&&integrity>=80&&campaignCompromise<50}
};
function c02Unlocked(id){return campaignMissionUnlocked(id)}
function cpRefreshCampaign02(){Object.keys(C02).forEach(id=>{let b=$('#mission'+id.replace('-','')),s=$('#mission'+id.replace('-','')+'Status');if(!b)return;let u=c02Unlocked(id),done=progressionComplete('ci-c02-'+id.slice(-2)+'-complete');b.disabled=!u;b.classList.toggle('available',u);if(s)s.textContent=progressionStatusLabel('ci-c02-'+id.slice(-2)+'-complete',u,done)})}
function cpBrief02(id){if(!C02[id]||!c02Unlocked(id))return;let m=C02[id];$('#campaignMenu').classList.add('hidden');$('#briefing02').classList.remove('hidden');$('#briefing02Kicker').textContent='CAMPAIGN 02 // OA VANTAGE';$('#briefing02Title').textContent=id+' // '+m.title;$('#briefing02Copy').textContent=m.sub;$('#briefing02Need').textContent=m.need;$('#briefing02Guide').textContent=m.guide||'';$('#briefing02Begin').textContent=id==='02-05'?'BEGIN FINAL OPERATION':'BEGIN OPERATION';$('#briefing02Begin').dataset.mission=id}
function cpBegin02(id){if(!campaignMissionUnlocked(id))return;let m=C02[id];if(!m)return;missionTransition(id+' // '+m.title,'OA VANTAGE // LOADING OPERATION',()=>cpBegin02Now(id))}
function cpBegin02Now(id){if(!campaignMissionUnlocked(id))return;musicSetMode('mission');campaignMenuOA='VANTAGE';cpSetOAVisual('VANTAGE');campaignMission=id;campaignIds=0;campaignCorrect=0;campaignThreatResolved=0;campaignNonThreatResolved=0;campaignCollectionInterrupted=0;campaignCompromise=0;campaignFinished=false;networkAssociations.clear();networkLastPair.clear();campaign02AssocEvents=0;campaign02PatternTracks.clear();campaign02ContinuityTracks.clear();resetCampaignHints();cpIntelDropReset();cpHideCampaignOverlays();$('#briefing02').classList.add('hidden');window.CP_MENU=false;window.CP_PAUSED=false;$('#startScreen').style.display='none';deploy();last=performance.now()}
function resetCampaignHints(){campaignHintSig='';campaignHintAt=performance.now();campaignHintLevel=0}
function campaignHintTick(now){if(campaignMission!=='02-05'||!running||campaignFinished)return;const s=campaign02Stats(),sig=[campaignCorrect,s.established,campaignCollectionInterrupted,Math.round(campaignCompromise/5)].join(':');if(sig!==campaignHintSig){campaignHintSig=sig;campaignHintAt=now;campaignHintLevel=0;return}const idle=now-campaignHintAt;if(idle>65000&&campaignHintLevel<2){campaignHintLevel=2;cpNotice('ANALYST ASSIST // DISRUPTION','Develop 3 supported relationships to establish the observed network, then interrupt hostile collection while keeping OE below 50%.','intel')}else if(idle>35000&&campaignHintLevel<1){campaignHintLevel=1;cpNotice('ANALYST ASSIST','Maintain coverage around VANTAGE activity areas. Distinct affiliated contacts observed together develop supported relationships.','intel')}}
function cpCheckCampaign02(){if(!isCampaign02()||campaignFinished)return;if(usesThreatEnvironment()&&campaignCompromise>=60){cpFinishCampaign02(false);return}let m=C02[campaignMission],s=campaign02Stats();if(m&&m.pass(s))cpFinishCampaign02(true)}
function cpFinishCampaign02(pass){if(campaignFinished)return;campaignMenuOA='VANTAGE';const rk=$('#resultKicker');if(rk)rk.textContent='CAMPAIGN 02 // OA VANTAGE';campaignFinished=true;running=false;stopCollect();window.CP_MENU=true;let id=campaignMission,m=C02[id],s=campaign02Stats();if(pass){campaignProgressionWrite('ci-c02-'+id.slice(-2)+'-complete','1');if(id==='02-05'){campaignProgressionWrite('ci-c02-complete','1');progressionCollectUnlocks()}cpRefreshCampaign02()}$('#resultTitle').textContent=pass?'NETWORK PICTURE ADVANCED':'NETWORK PICTURE INCOMPLETE';$('#resultBody').innerHTML='OA VANTAGE // '+id+' '+m.title+'<br><br>CONTACTS RESOLVED&nbsp;&nbsp;'+campaignCorrect+'<br>CONTINUITY TRACKS&nbsp;&nbsp;&nbsp;'+s.continuity+'<br>PATTERN TRACKS&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+s.patterns+'<br>ASSOCIATION EVENTS&nbsp;&nbsp;&nbsp;'+s.associations+'<br>SUPPORTED LINKS&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+s.supported+'<br>ESTABLISHED LINKS&nbsp;&nbsp;&nbsp;&nbsp;'+s.established+'<br>INTEL INTEGRITY&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+Math.round(integrity)+'%';$('#resultContinue').classList.toggle('hidden',!pass);$('#resultRetry').classList.toggle('hidden',pass);$('#campaignResult').classList.remove('hidden');outcomeFeedback(pass)}
function tutorialGuide(step,title,text,button=false){tutorialStep=step;if(campaignMission==='TUTORIAL'&&(step===2||step===3||step===4)&&!T.some(t=>!t.done)){spawn(false);const q=T[T.length-1];if(q){q.truth='FRIENDLY';q.type='UNKNOWN';q.x=430;q.y=315;q.vx=.25;q.vy=.1}}const g=$('#tutorialGuide');const map=$('#mapWrap');if(map&&g.parentElement!==map)map.appendChild(g);map?.classList.toggle("training-intel-report",step===5);g.dataset.trainingStep=String(step);g.classList.remove('hidden');$('#tutorialTitle').textContent=title;$('#tutorialText').textContent=text;const kicker=g.querySelector('.tutorial-kicker');if(kicker)kicker.textContent=step>=12?'TRAINING // COMPLETE':'TRAINING // STEP '+step+' OF 12';const n=$('#tutorialNext');n.textContent=step>=12?'RETURN TO MENU':'CONTINUE';n.classList.toggle('hidden',!button);tutorialSetHighlights(step)}
function tutorialMenu(){window.CP_MENU=true;clearTutorialState();$('#mainMenu').classList.add('hidden');$('#tutorialBriefing').classList.remove('hidden')}
function tutorialBegin(){missionTransition('TRAINING // OA KESTREL','FULL SYSTEMS WALKTHROUGH',tutorialBeginNow)}
function tutorialBeginNow(){musicSetMode('mission');campaignMenuOA='KESTREL';cpSetOAVisual('KESTREL');campaignMission='TUTORIAL';campaignFinished=false;campaignCompromise=0;$('#phase').textContent='TRAINING // SYSTEMS';cpHideCampaignOverlays();$('#tutorialBriefing').classList.add('hidden');window.CP_MENU=false;window.CP_PAUSED=false;$('#startScreen').style.display='none';deploy();setTimeout(()=>{if(campaignMission!=='TUTORIAL')return;trainingPrime();tutorialGuide(1,'1 // ACQUIRE ISR-01','Tap ISR-01 to begin.')},2100)}
function tutorialAdvance(event){if(campaignMission!=='TUTORIAL')return;if(tutorialStep===1&&event==='acquire'){tutorialGuide(2,'2 // MOVE ISR-01','Order ISR-01 near the UNKNOWN. Move it inside the sensor ring.');spawn(true);const guided=T[T.length-1];if(guided){guided.x=315;guided.y=510;guided.vx=0;guided.vy=0;guided.stationary=true;guided.truth='FRIENDLY';}}else if(tutorialStep===2&&event==='order')tutorialGuide(3,'3 // COLLECT','Select the UNKNOWN, then tap COLLECT.');else if(tutorialStep===3&&event==='classified')tutorialGuide(4,'4 // DISPOSITION','FRIENDLY: CLEAR. HOSTILE: INTERCEPT.');else if(tutorialStep===4&&event==='decision'){intelDropActive=true;intelDropOffered=true;intelDropExpires=performance.now()+3600000;$('#intelDrop').classList.remove('hidden');tutorialGuide(5,'5 // INTEL REPORTING','Select MITIGATE, EXPLOIT and SUPPLY once each.');}else if(tutorialStep===5&&event==='intel'){if(tutorialIntelSeen.size<3){intelDropActive=true;intelDropExpires=performance.now()+3600000;$('#intelDrop').classList.remove('hidden');tutorialGuide(5,'5 // INTEL REPORTING',`Reports used ${tutorialIntelSeen.size}/3. Select each remaining option.`);}else{intelDropActive=false;$('#intelDrop').classList.add('hidden');passiveCredits=9999;tutorialGuide(6,'6 // PASSIVE ISR','Deploy a Passive ISR node, then place it on the map.');ui(true)}}else if(tutorialStep===6&&event==='passive'){tutorialGuide(7,'7 // BUILD AN NAI','Place two more nearby. Three nodes within four hexes form an NAI.');}else if(tutorialStep===7&&event==='nai'){for(const pos of [[760,500],[720,155],[190,520]]){spawn(false);const q=T[T.length-1];if(q){q.type='UNKNOWN';q.truth='HOSTILE';q.x=pos[0];q.y=pos[1];q.vx=0;q.vy=0;}}tutorialGuide(8,'8 // EWO SWEEP','Buy EWO. Select a map point to launch the sweep; three UNKNOWNs are ready.');ui(true);}else if(tutorialStep===8&&event==='ewo'){supplyPackages=1;trainingPrime();tutorialGuide(9,'9 // BLUFOR SUPPLY','Activate SUPPLY and select a red BLUFOR site.');ui(true)}else if(tutorialStep===9&&event==='supply-target'){tutorialGuide(10,'10 // RECONSTITUTION','Wait for exposure to fall and the site to return blue.');}else if(tutorialStep===10&&event==='repair-complete'){tutorialGuide(11,'11 // SUPPORT ECONOMY','Earn credits with correct decisions and interrupted collection. Buy EWO as needed.',true)} }
function tutorialSupportNext(){if(campaignMission!=='TUTORIAL')return;if(tutorialStep===11){tutorialGuide(12,'TRAINING COMPLETE','Core command, collection and support training complete.',true)}else if(tutorialStep>=12){clearTutorialState();cpShowMenu()}}
function arcadeHide(){const a=$('#arcadeBriefing'),r=$('#arcadeResult');if(a)a.classList.add('hidden');if(r)r.classList.add('hidden')}
function arcadeOAAllowed(){
    const requirements={
        KESTREL:'ci-c01-complete',
        VANTAGE:'ci-c02-complete',
        VERDANT:'ci-c03-05-complete',
        MIRAGE:'ci-c04-05-complete',
        TEMPEST:'ci-c05-05-complete',
        ARCTIC:'ci-c06-05-complete'
    };
    return Object.keys(requirements).filter(oa=>
        devProgressionBypassActive()||progressionComplete(requirements[oa])
    );
}
function setArcadeOA(oa){const allowed=arcadeOAAllowed();arcadeOA=allowed.includes(oa)?oa:(allowed[0]||'KESTREL');if(!devProgressionSimulationActive())localStorage.setItem(ARCADE_OA_KEY,arcadeOA);document.querySelectorAll('[data-arcade-oa]').forEach(b=>{const unlocked=allowed.includes(b.dataset.arcadeOa);b.hidden=!unlocked;b.disabled=!unlocked;b.classList.toggle('selected',b.dataset.arcadeOa===arcadeOA)});let l=$('#arcadeOALabel');if(l)l.textContent=(arcadeOA==='ARCTIC'?'POLARIS':arcadeOA);const k=$('#arcadeOAKicker');if(k)k.textContent='ARCADE // OA '+(arcadeOA==='ARCTIC'?'POLARIS':arcadeOA)}
function arcadeBegin(){if(!arcadeOAAllowed().includes(arcadeOA))return;missionTransition('ARCADE // OA '+(arcadeOA==='ARCTIC'?'POLARIS':arcadeOA),'ENDLESS OPERATION // LOADING',arcadeBeginNow)}
function arcadeBeginNow(){if(!arcadeOAAllowed().includes(arcadeOA))return;musicSetMode('mission');cpSetOAVisual(arcadeOA);campaignMission='ARCADE';campaignIds=0;campaignCorrect=0;campaignThreatResolved=0;campaignNonThreatResolved=0;campaignCollectionInterrupted=0;campaignCompromise=0;campaignFinished=false;arcadeStreak=0;arcadeBestStreak=0;arcadeCorrect=0;arcadeWrong=0;arcadeThreatLevel=1;cpIntelDropReset();arcadeHide();cpHideCampaignOverlays();window.CP_MENU=false;window.CP_PAUSED=false;$('#startScreen').style.display='none';deploy();arcadeStart=performance.now();last=performance.now()}
function arcadeFinish(reason){if(campaignMission!=='ARCADE'||campaignFinished)return;campaignFinished=true;playAsset(missionFailAudio,.95,'sfx');banner('ARCADE FAILURE // '+reason,2600);running=false;stopCollect();window.CP_MENU=true;const w=$('#hostileCollectionWarning');if(w)w.classList.add('hidden');const elapsed=Math.max(0,Math.floor((performance.now()-(arcadeStart||start))/1000)),acc=(arcadeCorrect+arcadeWrong)?Math.round(arcadeCorrect*100/(arcadeCorrect+arcadeWrong)):100;$('#arcadeResultTitle').textContent=reason;$('#arcadeResultBody').innerHTML='OA '+(activeOA==='ARCTIC'?'POLARIS':activeOA)+' // ARCADE AAR<br><br>SCORE&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+Math.max(0,Math.round(score))+'<br>SURVIVAL TIME&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+String(Math.floor(elapsed/60)).padStart(2,'0')+':'+String(elapsed%60).padStart(2,'0')+'<br>THREAT LEVEL&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+arcadeThreatLevel+'<br>CONTACTS RESOLVED&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+resolved+'<br>THREATS INTERCEPTED&nbsp;&nbsp;&nbsp;&nbsp;'+ints+'<br>COLLECTION INTERRUPTED&nbsp;&nbsp;'+campaignCollectionInterrupted+'<br>DECISION ACCURACY&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+acc+'%<br>LONGEST STREAK&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+arcadeBestStreak+'<br>SITES DEGRADED&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+cpDegradedCount()+' / 5<br>FINAL OE COMPROMISE&nbsp;&nbsp;&nbsp;&nbsp;'+Math.round(campaignCompromise)+'%';$('#arcadeResult').classList.remove('hidden');$('#arcadeResult').classList.add('loss-flash')}
function arcadeMenu(){ciFirstVisitMark('arcade');progressionMarkRead('arcade');clearTutorialState();musicSetMode('menu');setArcadeOA(arcadeOA);cpHideCampaignOverlays();$('#mainMenu').classList.add('hidden');$('#arcadeResult').classList.add('hidden');$('#arcadeBriefing').classList.remove('hidden');refreshArcadeIntelAssist();window.CP_MENU=true}
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
    window.CP_PAUSED=true;window.CP_PAUSE_AT=performance.now();applyAudioSettings();const pauseOALabel=$('#pauseOALabel');if(pauseOALabel)pauseOALabel.textContent='OA '+(activeOA==='ARCTIC'?'POLARIS':(activeOA||'KESTREL'))+' // COMMAND HOLD';
    $('#pauseMenu').classList.remove('hidden');
  }else{
    const now=performance.now(),d=now-window.CP_PAUSE_AT;
    start+=d;lastSpawn+=d;A.lastMove+=d;T.forEach(t=>{if(t.bornAt)t.bornAt+=d;if(t.proxSince)t.proxSince+=d;if(t.collectStarted)t.collectStarted+=d;if(t.stallAt)t.stallAt+=d});if(intelDropAt)intelDropAt+=d;if(intelDropExpires)intelDropExpires+=d;if(intelFusionUntil)intelFusionUntil+=d;
    window.CP_PAUSED=false;last=now;applyAudioSettings();
    $('#pauseMenu').classList.add('hidden');
  }
}

/* COMMAND PROGRESSION // persistent unread unlock tracking */
const PROGRESSION_NOTICE_KEY='ci-progression-notices-v2';
const PROGRESSION_NOTICE_LEGACY_KEY='ci-progression-notices-v1';
const PROGRESSION_MILESTONES=[
 ['ci-c01-complete','profile','WIDE AREA COLLECTION'],
 ['ci-c02-complete','profile','RAPID TASKING'],
 ['ci-c03-05-complete','profile','PERSISTENT ORBIT'],
 ['ci-c04-05-complete','profile','HARDENED LINK'],
 ['ci-c01-01-complete','campaign','01-02 // PATTERN AVAILABLE'],['ci-c01-02-complete','campaign','01-03 // INDICATORS AVAILABLE'],['ci-c01-03-complete','campaign','01-04 // CONTESTED AVAILABLE'],['ci-c01-04-complete','campaign','01-05 // CONDITIONS SET AVAILABLE'],
 ['ci-c02-01-complete','campaign','02-02 // PATTERN AVAILABLE'],['ci-c02-02-complete','campaign','02-03 // ASSOCIATION AVAILABLE'],['ci-c02-03-complete','campaign','02-04 // NETWORK AVAILABLE'],['ci-c02-04-complete','campaign','02-05 // DISRUPTION AVAILABLE'],
 ['ci-c03-01-complete','campaign','03-02 // PATTERN AVAILABLE'],['ci-c03-02-complete','campaign','03-03 // TRANSFER AVAILABLE'],['ci-c03-03-complete','campaign','03-04 // SIGNATURE AVAILABLE'],['ci-c03-04-complete','campaign','03-05 // INTERDICTION AVAILABLE'],
 ['ci-c04-01-complete','campaign','04-02 // CAPACITY AVAILABLE'],['ci-c04-02-complete','campaign','04-03 // POSTURE AVAILABLE'],['ci-c04-03-complete','campaign','04-04 // INDICATIONS AVAILABLE'],['ci-c04-04-complete','campaign','04-05 // WARNING AVAILABLE'],
 ['ci-c05-01-complete','campaign','05-02 // DARK TRANSIT AVAILABLE'],['ci-c05-02-complete','campaign','05-03 // SHADOW NETWORK AVAILABLE'],['ci-c05-03-complete','campaign','05-04 // INTERDICTION WINDOW AVAILABLE'],['ci-c05-04-complete','campaign','05-05 // MARITIME FUSION AVAILABLE'],
 ['ci-c06-01-complete','campaign','06-02 // DRIFT SIGNATURE AVAILABLE'],['ci-c06-02-complete','campaign','06-03 // RELAY SILENCE AVAILABLE'],['ci-c06-03-complete','campaign','06-04 // POLAR WINDOW AVAILABLE'],['ci-c06-04-complete','campaign','06-05 // NORTH PASSAGE AVAILABLE'],
 ['ci-c01-complete','global','OA:VANTAGE'],['ci-c02-complete','global','OA:VERDANT'],['ci-c03-05-complete','global','OA:MIRAGE'],['ci-c04-05-complete','global','OA:TEMPEST'],['ci-c05-05-complete','global','OA:ARCTIC'],
 ['ci-c01-01-complete','global','COLLECTION PLANNING: KESTREL'],['ci-c02-01-complete','global','COLLECTION PLANNING: VANTAGE'],['ci-c03-01-complete','global','COLLECTION PLANNING: VERDANT'],['ci-c04-01-complete','global','COLLECTION PLANNING: MIRAGE'],['ci-c05-01-complete','global','COLLECTION PLANNING: TEMPEST'],['ci-c06-01-complete','global','COLLECTION PLANNING: POLARIS'],
 ['ci-c01-complete','arcade','KESTREL'],['ci-c02-complete','arcade','VANTAGE'],['ci-c03-05-complete','arcade','VERDANT'],['ci-c04-05-complete','arcade','MIRAGE'],['ci-c05-05-complete','arcade','TEMPEST'],['ci-c06-05-complete','arcade','POLARIS']
];
function progressionSnapshot(){
    return PROGRESSION_MILESTONES
        .filter(m=>localStorage.getItem(m[0])==='1')
        .map(m=>m[1]+':'+m[2]);
}
function progressionNoticeState(){
 let state;
 try{state=JSON.parse(localStorage.getItem(PROGRESSION_NOTICE_KEY)||'null')}catch(e){}
 if(!state||!Array.isArray(state.seen)||!Array.isArray(state.unread)){
  let legacy;
  try{legacy=JSON.parse(localStorage.getItem(PROGRESSION_NOTICE_LEGACY_KEY)||'null')}catch(e){}
  const seen=Array.isArray(legacy?.seen)?legacy.seen:[];
  const unread=Array.isArray(legacy?.unread)?legacy.unread:[];
  state={seen:[...new Set([...seen,...progressionSnapshot()])],unread:[...new Set(unread)]};
  if(!devProgressionSimulationActive()&&!devProgressionBypassActive())localStorage.setItem(PROGRESSION_NOTICE_KEY,JSON.stringify(state));
 }
 return state;
}
/* CI persistent first-visit indicators v1 */
const CI_FIRST_VISITS_KEY='ci-first-visits-v1';
const CI_FIRST_VISIT_DESTINATIONS=[
    'global','campaign','arcade','profile',
    'oa:KESTREL','oa:VANTAGE','oa:VERDANT',
    'oa:MIRAGE','oa:TEMPEST','oa:ARCTIC'
];
const ciFirstVisitsMemory=new Set();

function ciFirstVisitsRead(){
    try{
        const saved=JSON.parse(localStorage.getItem(CI_FIRST_VISITS_KEY)||'[]');
        if(Array.isArray(saved)){
            return new Set(saved.filter(k=>CI_FIRST_VISIT_DESTINATIONS.includes(k)));
        }
    }catch(e){}
    return new Set(ciFirstVisitsMemory);
}

function ciFirstVisitSeen(destination){
    return ciFirstVisitsRead().has(destination);
}

function ciFirstVisitMark(destination){
    if(devProgressionSimulationActive()||devProgressionBypassActive())return;
    if(!CI_FIRST_VISIT_DESTINATIONS.includes(destination))return;
    const visited=ciFirstVisitsRead();
    if(visited.has(destination))return;
    visited.add(destination);
    ciFirstVisitsMemory.add(destination);
    try{
        localStorage.setItem(CI_FIRST_VISITS_KEY,JSON.stringify([...visited]));
    }catch(e){}
}
function refreshProgressionBadges(){
    const state=progressionNoticeState();
    const profile=$('#profileNewBadge'),arcade=$('#arcadeNewBadge');
    const global=$('#globalNewBadge'),campaign=$('#campaignNewBadge');

    if(profile){
        profile.hidden=ciFirstVisitSeen('profile')&&
            !state.unread.some(k=>k.startsWith('profile:'));
    }

    if(arcade){
        arcade.hidden=ciFirstVisitSeen('arcade')&&
            !state.unread.some(k=>k.startsWith('arcade:'));
    }

    if(campaign){
        campaign.hidden=ciFirstVisitSeen('campaign')&&!state.unread.some(k=>k.startsWith('campaign:'));
    }

    const areas=[
        'KESTREL','VANTAGE','VERDANT',
        'MIRAGE','TEMPEST','ARCTIC'
    ];

    if(global){
        global.hidden=!areas.some(oa=>
            globalOAIdentityRevealed(oa)&&
            !ciFirstVisitSeen('oa:'+oa)||state.unread.includes('global:OA:'+oa)
        )||state.unread.some(k=>k.startsWith('global:'));
    }

    document.querySelectorAll('.globe-oa-marker').forEach(marker=>{
        const oa=marker.dataset.oa;
        const badge=marker.querySelector('.globe-oa-new');
        if(!badge)return;

        badge.hidden=!areas.includes(oa)||
            !globalOAIdentityRevealed(oa)||
            ciFirstVisitSeen('oa:'+oa)&&!state.unread.includes('global:OA:'+oa);
    });
}
function progressionMarkRead(section){const state=progressionNoticeState();state.unread=state.unread.filter(k=>!k.startsWith(section+":"));if(!devProgressionSimulationActive()&&!devProgressionBypassActive())localStorage.setItem(PROGRESSION_NOTICE_KEY,JSON.stringify(state));refreshProgressionBadges();}
refreshProgressionBadges();
/* COMMAND PROGRESSION // sequential tactical unlock announcements */
const progressionAnnouncementQueue=[];
let progressionAnnouncementActive=false;

function progressionQueueAnnouncements(unlocks){
    if(!Array.isArray(unlocks)||!unlocks.length)return;

    progressionAnnouncementQueue.push(...unlocks);
    progressionShowNextAnnouncement();
}

function progressionShowNextAnnouncement(){
    if(progressionAnnouncementActive)return;

    const key=progressionAnnouncementQueue.shift();
    if(!key)return;

    const stack=$('#progressionNoticeStack');
    if(!stack)return;

    progressionAnnouncementActive=true;

    const parts=key.split(':');
    const section=parts[0];
    const reward=parts.slice(1).join(':');

    const notice=document.createElement('div');
    notice.className='progression-unlock-notice';

    const title=document.createElement('b');
    const detail=document.createElement('span');

    if(section==='profile'){
        title.textContent='NEW ISR CAPABILITY AVAILABLE';
        detail.textContent='COMMAND PROFILE // '+reward;
    }else if(section==='campaign'){
        title.textContent='CAMPAIGN MISSION AVAILABLE';
        detail.textContent=reward;
    }else if(section==='global'){
        title.textContent=reward.startsWith('OA:')?'NEW OPERATIONAL AREA AVAILABLE':'COLLECTION PLANNING AVAILABLE';
        detail.textContent='GLOBAL OPERATIONS // '+reward.replace(/^OA:/,'');
    }else{
        title.textContent='NEW ARCADE AREA AVAILABLE';
        detail.textContent='ARCADE // OA '+reward;
    }

    notice.appendChild(title);
    notice.appendChild(detail);
    stack.appendChild(notice);

    setTimeout(()=>{
        notice.classList.add('leaving');

        setTimeout(()=>{
            notice.remove();
            progressionAnnouncementActive=false;
            progressionShowNextAnnouncement();
        },350);
    },3000);
}
function progressionCollectUnlocks(){
    if(devProgressionSimulationActive()||devProgressionBypassActive())return [];
    const state=progressionNoticeState();
    const current=progressionSnapshot();
    const added=current.filter(k=>!state.seen.includes(k));
    if(!added.length)return [];
    state.seen.push(...added);
    state.unread.push(...added);
    if(!devProgressionSimulationActive()&&!devProgressionBypassActive())localStorage.setItem(PROGRESSION_NOTICE_KEY,JSON.stringify(state));
    refreshProgressionBadges();
    progressionQueueAnnouncements(added);
    return added;
}
const COMMAND_PROFILE_CAMPAIGNS=[
 {series:'01',oa:'KESTREL',complete:'ci-c01-complete'},
 {series:'02',oa:'VANTAGE',complete:'ci-c02-complete'},
 {series:'03',oa:'VERDANT',complete:'ci-c03-05-complete'},
 {series:'04',oa:'MIRAGE',complete:'ci-c04-05-complete'},
 {series:'05',oa:'TEMPEST',complete:'ci-c05-05-complete'},
 {series:'06',oa:'ARCTIC',complete:'ci-c06-05-complete'}
];
function refreshCommandProfile(){
  const done=COMMAND_PROFILE_CAMPAIGNS.filter(c=>localStorage.getItem(c.complete)==='1').length;
  const campaignCards=$('#profileCampaignCards'),tier=$('#profileTier'),bar=$('#profileProgress'),txt=$('#profileProgressText'),isr=$('#profileISR');
  if(campaignCards){campaignCards.replaceChildren();COMMAND_PROFILE_CAMPAIGNS.forEach(c=>{const tab=document.querySelector('[data-campaign-oa="'+c.oa+'"]'),oaName=tab?.querySelector('b')?.textContent.replace(/^\d+\s*\/\/\s*/,'')||c.oa,descriptor=tab?.querySelector('span')?.textContent||'',complete=progressionComplete(c.complete),simulated=devProgressionSimulationActive()&&localStorage.getItem(c.complete)!=='1'&&simulatedProgressionComplete(c.complete),status=complete?(simulated?'SIMULATED':'COMPLETE'):devProgressionBypassActive()?'DEV ACCESS':campaignMissionUnlocked(c.series+'-01')?'AVAILABLE':'LOCKED',card=document.createElement('div'),label=document.createElement('span'),state=document.createElement('b'),detail=document.createElement('small');card.className='profile-card';card.dataset.state=status.toLowerCase().replaceAll(' ','-');label.textContent='CAMPAIGN '+c.series;state.textContent=status;detail.textContent='OA '+oaName+' // '+descriptor;card.append(label,state,detail);campaignCards.appendChild(card)})}
  if(tier)tier.textContent=done>=2?'NETWORK QUALIFIED':done===1?'OPERATIONAL':'FOUNDATION';if(bar)bar.style.width=(done/COMMAND_PROFILE_CAMPAIGNS.length*100)+'%';if(txt)txt.textContent='OPERATIONAL EXPERIENCE // '+done+' / '+COMMAND_PROFILE_CAMPAIGNS.length+' CAMPAIGNS COMPLETE';
  if(isr){const names={'#dce5e8':'TACTICAL WHITE','#4da3ff':'ISR BLUE','#d8a83e':'COMMAND GOLD','#55d66b':'FIELD GREEN'};isr.textContent=visualSettings.isrSymbol+' // '+(names[visualSettings.isrColor]||'CUSTOM');}
  normalizeISRCapability();const cap=$('#profileCapability'),help=$('#profileCapabilityHelp');const capNames={STANDARD:'STANDARD SENSOR',WIDE:'WIDE AREA COLLECTION',RAPID:'RAPID TASKING',ORBIT:'PERSISTENT ORBIT',HARDENED:'HARDENED LINK'};if(cap)cap.textContent=capNames[isrCapability]||capNames.STANDARD;document.querySelectorAll('[data-isr-capability]').forEach(btn=>{const k=btn.dataset.isrCapability,u=isrCapabilityUnlocked(k);btn.disabled=!u;btn.classList.toggle('selected',k===isrCapability);});if(help){const locked=[];if(!isrCapabilityUnlocked('WIDE'))locked.push('WIDE AREA // C01');if(!isrCapabilityUnlocked('RAPID'))locked.push('RAPID TASKING // C02');if(!isrCapabilityUnlocked('ORBIT'))locked.push('PERSISTENT ORBIT // C03');if(!isrCapabilityUnlocked('HARDENED'))locked.push('HARDENED LINK // C04');help.textContent=locked.length?'UNLOCKS // '+locked.join(' // ')+' // ONE ACTIVE AT A TIME':'ALL PACKAGES EARNED // ONE ACTIVE AT A TIME';}
}
function setISRCapability(k){if(!isrCapabilityUnlocked(k))return;isrCapability=k;localStorage.setItem(ISR_CAPABILITY_KEY,k);refreshCommandProfile();sound('click')}
function rotateCommandBackground(){const maps=["url('assets/maps/oa-kestrel-overscan.png')","url('assets/maps/oa-vantage-overscan.png')","url('assets/maps/oa-verdant-overscan.png')","url('assets/maps/oa-mirage-overscan.png')","url('assets/maps/oa-tempest-overscan.png')"];const raw=sessionStorage.getItem('ci-command-bg-index');let last=raw===null?-1:Number(raw),next;if(last<0||!Number.isFinite(last))next=Math.floor(Math.random()*maps.length);else if(maps.length>1){const choices=maps.map((_,i)=>i).filter(i=>i!==last);next=choices[Math.floor(Math.random()*choices.length)]}else next=0;sessionStorage.setItem('ci-command-bg-index',String(next));const home=document.getElementById('mainMenu');if(home)home.style.setProperty('--ci-command-bg',maps[next]);document.documentElement.style.setProperty('--ci-command-bg',maps[next])}
function openCommandProfile(){ciFirstVisitMark('profile');progressionMarkRead('profile');refreshCommandProfile();$('#mainMenu').classList.add('hidden');$('#commandProfileMenu').classList.remove('hidden')}
function closeCommandProfile(){$('#commandProfileMenu').classList.add('hidden');$('#mainMenu').classList.remove('hidden')}


// v0.10.0 // GLOBAL FOUNDATION PROTOTYPE
let globalSelectedOA=null;
const GLOBAL_OA={KESTREL:'MOUNTAIN-COAST // FOUNDATION',VANTAGE:'URBAN-INDUSTRIAL // NETWORK',VERDANT:'TROPICAL RIVER-COAST // PREVIEW',MIRAGE:'ARID ROUTE-LOGISTICS // SUPPLY NODES',TEMPEST:'MARITIME ARCHIPELAGO // INTERDICTION',ARCTIC:'POLARIS // HIGH-NORTH ISLANDS',RETRO:'LEGACY SIMULATION // CONTACT IMMINENT // NO TERRAIN'};
/* GLOBAL OA IDENTITY CLASSIFICATION
   Display-only progression; existing activity unlocks remain unchanged. */
function globalOAIdentityRevealed(oa){
    if(oa==='KESTREL'||oa==='RETRO'||devProgressionBypassActive())return true;
    const prerequisites={
        VANTAGE:'ci-c01-complete',
        VERDANT:'ci-c02-complete',
        MIRAGE:'ci-c03-05-complete',
        TEMPEST:'ci-c04-05-complete',
        ARCTIC:'ci-c05-05-complete'
    };
    return !!prerequisites[oa]&&progressionComplete(prerequisites[oa]);
}
function globalOADisplayName(oa){
    return globalOAIdentityRevealed(oa)
        ?(oa==='ARCTIC'?'POLARIS':oa)
        :'[REDACTED]';
}
/* GLOBAL PICTURE // dynamic intelligence classification status */
/* COMMAND HOME // independent classified-signal interference */
const homeOAScrambleState={};
function homeOAScrambledName(oa,now){
    if(globalOAIdentityRevealed(oa)){
        delete homeOAScrambleState[oa];
        return globalOADisplayName(oa);
    }
    let s=homeOAScrambleState[oa];
    if(!s){
        s={next:now+4000+Math.random()*5000,end:0,frame:0};
        homeOAScrambleState[oa]=s;
    }
    if(now>=s.next){
        s.end=now+300+Math.random()*300;
        s.frame=Math.floor(Math.random()*GLOBAL_OA_SCRAMBLE_FRAMES.length);
        s.next=s.end+4000+Math.random()*5000;
    }
    if(now<s.end)return GLOBAL_OA_SCRAMBLE_FRAMES[s.frame];
    return '[REDACTED]';
}

/* COMMAND HOME // campaign-aware operational-area classification */
function refreshHomeOAClassification(now=performance.now()){
    const names={
        KESTREL:'KESTREL',
        VANTAGE:'VANTAGE',
        VERDANT:'VERDANT',
        MIRAGE:'MIRAGE',
        TEMPEST:'TEMPEST',
        ARCTIC:'POLARIS'
    };
    const numbers={
        KESTREL:'01',
        VANTAGE:'02',
        VERDANT:'03',
        MIRAGE:'04',
        TEMPEST:'05',
        ARCTIC:'06'
    };
    document.querySelectorAll('[data-home-oa]').forEach(el=>{
        const oa=el.getAttribute('data-home-oa');
        if(!Object.prototype.hasOwnProperty.call(names,oa))return;
        const classified=!globalOAIdentityRevealed(oa);
        const label=classified?homeOAScrambledName(oa,now):names[oa];
        const expected='OA '+numbers[oa]+' // '+label;
        if(el.textContent!==expected)el.textContent=expected;
        el.classList.toggle('oa-classified',classified);
        el.classList.toggle(
            'oa-scrambling',
            classified&&label.includes('[')&&!label.includes('[REDACTED]')
        );
    });
}
function refreshGlobalOAStatus(){
    const el=document.getElementById('globalOAStatus');
    if(!el)return;
    const areas=['KESTREL','VANTAGE','VERDANT','MIRAGE','TEMPEST','ARCTIC'];
    const confirmed=areas.filter(oa=>globalOAIdentityRevealed(oa)).length;
    const classified=areas.length-confirmed;
    el.textContent=String(confirmed).padStart(2,'0')+
        ' CONFIRMED / '+
        String(classified).padStart(2,'0')+
        ' CLASSIFIED';
}
function openGlobal(){ciFirstVisitMark('global');progressionMarkRead('global');refreshProgressionBadges();refreshGlobalOAStatus();window.CP_MENU=true;document.body.classList.remove('retro-mode');$('#objectiveTracker')?.classList.remove('retro-objectives-hidden');globalSelectedOA=null;$('#globalMenu').classList.remove('retro-global-selection');$('#mainMenu').classList.add('hidden');$('#globalMenu').classList.remove('hidden');document.querySelectorAll('[data-global-oa]').forEach(b=>b.classList.remove('selected'));$('#globalOAName').textContent='NO OA SELECTED';$('#globalOADetail').textContent='Select an operational-area marker on the globe to inspect the regional picture.';$('#globalCampaign').style.display='';$('#globalArcade').style.display='';$('#globalPlanNAI').style.display='';$('#globalCampaign').disabled=true;$('#globalArcade').disabled=true;$('#globalPlanNAI').disabled=true;}
function closeGlobal(){$('#globalMenu').classList.add('hidden');$('#mainMenu').classList.remove('hidden');rotateCommandBackground();}
function globalPlanningUnlocked(oa){if(!oa||oa==='RETRO')return false;if(devProgressionBypassActive())return true;const series=({KESTREL:'01',VANTAGE:'02',VERDANT:'03',MIRAGE:'04',TEMPEST:'05',ARCTIC:'06'})[oa];return !!series&&progressionComplete('ci-c'+series+'-01-complete')}
function selectGlobalOA(oa,playerVisit=false){if(playerVisit&&globalOAIdentityRevealed(oa)){ciFirstVisitMark('oa:'+oa);refreshProgressionBadges();}globalSelectedOA=oa;$('#globalMenu').classList.toggle('retro-global-selection',oa==='RETRO');document.querySelectorAll('[data-global-oa]').forEach(b=>b.classList.toggle('selected',b.dataset.globalOa===oa));const num=GLOBAL_OA_NUM[oa]||'--';$('#globalOAName').textContent=oa==='RETRO'?'R0 // RETRO STATION // CONTACT IMMINENT':'OA '+num+' // '+globalOADisplayName(oa);$('#globalOADetail').textContent=globalOAIdentityRevealed(oa)?'REGIONAL PICTURE AVAILABLE':'REGIONAL INTELLIGENCE // CLASSIFIED';const retro=oa==='RETRO',campaignReady=!retro&&globalOAIdentityRevealed(oa),arcadeReady=oa==='RETRO'||arcadeOAAllowed().includes(oa);$('#globalCampaign').style.display=retro?'none':'';$('#globalPlanNAI').style.display=retro?'none':'';$('#globalPlanNAI').classList.toggle('hidden',retro);$('#globalArcade').style.display='';$('#globalCampaign').disabled=!campaignReady;$('#globalArcade').disabled=!arcadeReady;const planUnlocked=globalPlanningUnlocked(oa);$('#globalPlanNAI').disabled=!planUnlocked;$('#globalPlanNAI').title=planUnlocked?'':'Complete the first campaign mission in this region to unlock collection planning.';$('#globalPlanNAI').setAttribute('aria-label',planUnlocked?'Collection planning':'Collection planning locked. Complete the first campaign mission in this region to unlock it.');refreshGlobalTaskingDetail(oa);}

let globalActivityContext=false;
function cpRetroGrid(){const g=$('#retroGrid');if(!g)return;g.textContent='';const ns='http://www.w3.org/2000/svg';for(let x=45;x<900;x+=45){let l=document.createElementNS(ns,'line');l.setAttribute('x1',x);l.setAttribute('y1','0');l.setAttribute('x2',x);l.setAttribute('y2','650');l.setAttribute('class',x%225===0?'retro-major':'retro-minor');g.appendChild(l)}for(let y=45;y<650;y+=45){let l=document.createElementNS(ns,'line');l.setAttribute('x1','0');l.setAttribute('y1',y);l.setAttribute('x2','900');l.setAttribute('y2',y);l.setAttribute('class',y%225===0?'retro-major':'retro-minor');g.appendChild(l)}}
function cpRetroExit(){running=false;stopCollect();A.dest=null;A.mode='IDLE';window.CP_PAUSED=false;window.CP_MENU=false;$('#pauseMenu')?.classList.add('hidden');$('#utilityMenu')?.classList.add('hidden');$('#settingsMenu')?.classList.add('hidden');campaignMission=null;document.body.classList.remove('retro-mode');cpSetOAVisual('KESTREL');openGlobal();}
function globalRetroActivity(){missionTransition('RETRO // ARCADE','BLANK CANVAS // LOADING OPERATION',globalRetroActivityNow)}function globalRetroActivityNow(){campaignMission='RETRO';globalActivityContext=false;document.body.classList.add('retro-mode');cpSetOAVisual('RETRO');cpRetroGrid();window.CP_MENU=false;window.CP_PAUSED=false;$('#startScreen').style.display='none';$('#objectiveTracker')?.classList.remove('retro-objectives-hidden');deploy();last=performance.now();}
function globalCampaignActivity(){
 if(!globalSelectedOA)return;
 if(globalSelectedOA==='RETRO'){globalRetroActivity();return;}
if(!globalOAIdentityRevealed(globalSelectedOA))return;
 globalActivityContext=true;
 campaignMenuOA=globalSelectedOA;
 closeGlobal();
 cpCampaignMenu();
 document.body.classList.add('global-context-campaign');
}
function globalArcadeActivity(){
 if(globalSelectedOA==='RETRO'){globalRetroActivity();return;}
 if(!globalSelectedOA||!arcadeOAAllowed().includes(globalSelectedOA))return;
 globalActivityContext=true;setArcadeOA(globalSelectedOA);closeGlobal();arcadeMenu();document.body.classList.add('global-context-arcade');
}
function globalTrainingActivity(){closeGlobal();tutorialMenu();}
function setGlobalRate(rate){document.documentElement.style.setProperty('--global-rate',rate);document.querySelectorAll('[data-global-rate]').forEach(b=>b.classList.toggle('selected',Number(b.dataset.globalRate)===rate));$('#globalRateLabel').textContent=rate+'X';const mult=rate;document.querySelectorAll('.orbit').forEach((el,i)=>{const base=[24,34,19][i]||24;el.style.animationDuration=(base/mult)+'s'});}
// v0.11.6.144 // LEAN LIVE GLOBAL GLOBE
const GLOBAL_OA_GEO={KESTREL:{lat:42,lon:-118},VANTAGE:{lat:35,lon:20},VERDANT:{lat:-4,lon:-70},MIRAGE:{lat:-21,lon:49},TEMPEST:{lat:-24,lon:143},ARCTIC:{lat:73,lon:28}};
const GLOBAL_OA_DISPLAY={KESTREL:'KESTREL',VANTAGE:'VANTAGE',VERDANT:'VERDANT',MIRAGE:'MIRAGE',TEMPEST:'TEMPEST',ARCTIC:'POLARIS',RETRO:'RETRO STATION'};
const GLOBAL_OA_NUM={KESTREL:'01',VANTAGE:'02',VERDANT:'03',MIRAGE:'04',TEMPEST:'05',ARCTIC:'06',RETRO:'R0'};
const GLOBAL_ORBITS=[{inc:52,raan:-28,phase:15,period:24},{inc:67,raan:66,phase:142,period:34},{inc:31,raan:154,phase:254,period:19}];const GLOBAL_RETRO_ORBIT={inc:43,raan:112,phase:205,period:42};
const GLOBAL_UNK_ORBIT={inc:58,raan:-74,phase:318,period:27};
/* GLOBAL ANOMALY // rare background UFO flyby */
let globalUfoWindow={
    elapsed:0,
    nextAt:60000+Math.random()*120000,
    active:false,
    startAt:0,
    duration:0,
    direction:1,
    elevation:0,
    slope:0
};

function globalUfoVisibility(dt){
    const s=globalUfoWindow;
    s.elapsed+=Math.max(0,dt)*1000;

    if(!s.active&&s.elapsed>=s.nextAt){
        s.active=true;
        s.startAt=s.elapsed;
        s.duration=2000+Math.random()*2000;
        s.direction=Math.random()<.5?1:-1;
        s.elevation=(Math.random()-.5)*.55;
        s.slope=(Math.random()-.5)*.35;
    }

    if(s.active&&s.elapsed-s.startAt>=s.duration){
        s.active=false;
        s.nextAt=s.elapsed+60000+Math.random()*120000;
    }

    return s.active;
}
let globalGlobe={yaw:118,pitch:0,zoom:1,drag:false,pointer:null,lastX:0,lastY:0,moved:false,lastT:performance.now(),orbitT:0};
function globeRad(d){return d*Math.PI/180} function globeVec(lat,lon){const a=globeRad(lat),o=globeRad(lon);return{x:Math.cos(a)*Math.sin(o),y:-Math.sin(a),z:Math.cos(a)*Math.cos(o)}} function globeRotate(v){let y=globeRad(globalGlobe.yaw),p=globeRad(globalGlobe.pitch),cy=Math.cos(y),sy=Math.sin(y),cp=Math.cos(p),sp=Math.sin(p),x=v.x*cy+v.z*sy,z=-v.x*sy+v.z*cy;return{x,y:v.y*cp-z*sp,z:v.y*sp+z*cp}} function globeProject(lat,lon,cx,cy,r){const q=globeRotate(globeVec(lat,lon));return{x:cx+q.x*r,y:cy+q.y*r,z:q.z}}
function initGlobalGlobe(){const c=$('#globalGlobeCanvas'),ov=$('#globalGlobeOverlay');if(!c||!ov||c.dataset.ready)return;c.dataset.ready='1';Object.keys(GLOBAL_OA_GEO).forEach(oa=>{const b=document.createElement('button');b.className='globe-oa-marker';b.dataset.oa=oa;b.innerHTML='<i class="oa-anchor"></i><svg class="oa-leader-svg" viewBox="0 0 96 28" preserveAspectRatio="none" aria-hidden="true"><polyline points="0,14 30,2 96,2"/></svg><span class="oa-callout-text">'+GLOBAL_OA_NUM[oa]+' '+globalOADisplayName(oa)+'</span><span class="globe-oa-new" hidden>NEW</span>';let markerGesture=null;
b.addEventListener('pointerdown',e=>{
    if(e.button!==0)return;
    markerGesture={id:e.pointerId,x:e.clientX,y:e.clientY,lastX:e.clientX,lastY:e.clientY,moved:false};
    globalGlobe.drag=true;
    globalGlobe.pointer=e.pointerId;
    globalGlobe.moved=false;
    b.setPointerCapture?.(e.pointerId);
});
b.addEventListener('pointermove',e=>{
    const g=markerGesture;
    if(!g||e.pointerId!==g.id)return;
    if(Math.hypot(e.clientX-g.x,e.clientY-g.y)>6)g.moved=true;
    if(g.moved){
        globalGlobe.moved=true;
        globalGlobe.yaw+=(e.clientX-g.lastX)*.34;
        globalGlobe.pitch=Math.max(-70,Math.min(70,globalGlobe.pitch-(e.clientY-g.lastY)*.28));
    }
    g.lastX=e.clientX;
    g.lastY=e.clientY;
});
let suppressMarkerClickUntil=0;
const endMarkerGesture=e=>{
    if(!markerGesture||e.pointerId!==markerGesture.id)return;
    const g=markerGesture;
    markerGesture=null;
    globalGlobe.drag=false;
    globalGlobe.pointer=null;
    suppressMarkerClickUntil=(g.moved||e.type==='pointercancel')?performance.now()+350:0;
    globalGlobe.moved=false;
};
b.addEventListener('pointerup',endMarkerGesture);
b.addEventListener('pointercancel',endMarkerGesture);
b.addEventListener('click',e=>{
    if(performance.now()<suppressMarkerClickUntil){
        e.preventDefault();
        return;
    }
    if(!globalGlobe.moved)selectGlobalOA(oa,true);
});
ov.appendChild(b)});GLOBAL_ORBITS.forEach((o,i)=>{const d=document.createElement('div');d.className='globe-sat globe-sat-'+i;d.textContent='SAT-'+String(i+1).padStart(2,'0');ov.appendChild(d)});const unk=document.createElement('div');unk.className='globe-unk-contact';unk.setAttribute('aria-hidden','true');unk.innerHTML='<i></i><span>UNK</span>';ov.appendChild(unk);const ufo=document.createElement('div');ufo.className='globe-ufo-contact';ufo.setAttribute('aria-hidden','true');ufo.innerHTML='<i></i>';ov.appendChild(ufo);const rs=document.createElement('button');rs.className='globe-retro-station';rs.type='button';rs.setAttribute('aria-label','RETRO legacy simulation station');rs.innerHTML='<i></i><span>R0 // RETRO</span>';rs.addEventListener('click',()=>{if(!globalGlobe.moved)selectGlobalOA('RETRO')});ov.appendChild(rs);c.addEventListener('wheel',e=>{e.preventDefault();const dir=Math.sign(e.deltaY);globalGlobe.zoom=Math.max(.78,Math.min(1.55,globalGlobe.zoom-dir*.055));},{passive:false});c.addEventListener('pointerdown',e=>{globalGlobe.drag=true;globalGlobe.pointer=e.pointerId;globalGlobe.lastX=e.clientX;globalGlobe.lastY=e.clientY;globalGlobe.moved=false;c.setPointerCapture?.(e.pointerId)});c.addEventListener('pointermove',e=>{if(!globalGlobe.drag||e.pointerId!==globalGlobe.pointer)return;let dx=e.clientX-globalGlobe.lastX,dy=e.clientY-globalGlobe.lastY;if(Math.abs(dx)+Math.abs(dy)>2)globalGlobe.moved=true;globalGlobe.yaw+=dx*.34;globalGlobe.pitch=Math.max(-70,Math.min(70,globalGlobe.pitch-dy*.28));globalGlobe.lastX=e.clientX;globalGlobe.lastY=e.clientY});const end=e=>{if(e.pointerId===globalGlobe.pointer){globalGlobe.drag=false;globalGlobe.pointer=null;setTimeout(()=>globalGlobe.moved=false,0)}};c.addEventListener('pointerup',end);c.addEventListener('pointercancel',end);refreshProgressionBadges()}
function globeOrbitLatLon(o,t){const u=globeRad((o.phase+t*360/o.period)%360),inc=globeRad(o.inc),raan=globeRad(o.raan);let x=Math.cos(u),y=Math.sin(u)*Math.sin(inc),z=Math.sin(u)*Math.cos(inc),cr=Math.cos(raan),sr=Math.sin(raan),X=x*cr+z*sr,Z=-x*sr+z*cr;return{lat:-Math.asin(Math.max(-1,Math.min(1,y)))*180/Math.PI,lon:Math.atan2(X,Z)*180/Math.PI}}
const GLOBAL_MOBILE=matchMedia('(pointer:coarse)').matches||/iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
const GLOBAL_RENDER_DPR=GLOBAL_MOBILE?Math.min(1.25,window.devicePixelRatio||1):Math.min(2,window.devicePixelRatio||1);
const GLOBAL_FRAME_MS=GLOBAL_MOBILE?1000/30:0;
let globalLastFrame=0;
function drawGlobalSpace(now){}
const GLOBAL_EARTH_TEXTURE_SRC='assets/maps/global-notional-earth-surface.jpg';
let globalSurfaceGL=null;
function initGlobalSurfaceGL(){if(globalSurfaceGL)return globalSurfaceGL;const c=$('#globalSurfaceCanvas');if(!c)return null;const gl=c.getContext('webgl',{alpha:true,antialias:true,premultipliedAlpha:false});if(!gl)return null;const vs=`attribute vec3 aPos;attribute vec2 aUV;uniform float uYaw;uniform float uPitch;uniform float uScale;varying vec2 vUV;varying float vZ;void main(){float cy=cos(uYaw),sy=sin(uYaw),cp=cos(uPitch),sp=sin(uPitch);vec3 q=vec3(aPos.x*cy+aPos.z*sy,aPos.y,-aPos.x*sy+aPos.z*cy);q=vec3(q.x,q.y*cp+q.z*sp,-q.y*sp+q.z*cp);vUV=aUV;vZ=q.z;gl_Position=vec4(q.x*uScale,q.y*uScale,-q.z*.5,1.0);}`;const fs=`precision mediump float;uniform sampler2D uTex;varying vec2 vUV;varying float vZ;void main(){if(vZ<-0.002)discard;vec4 c=texture2D(uTex,vUV);gl_FragColor=vec4(c.rgb,1.0);}`;function sh(type,src){const x=gl.createShader(type);gl.shaderSource(x,src);gl.compileShader(x);return x}const pr=gl.createProgram();gl.attachShader(pr,sh(gl.VERTEX_SHADER,vs));gl.attachShader(pr,sh(gl.FRAGMENT_SHADER,fs));gl.linkProgram(pr);const verts=[],idx=[],latN=64,lonN=128;for(let iy=0;iy<=latN;iy++){const lat=Math.PI/2-iy*Math.PI/latN,cl=Math.cos(lat),yy=-Math.sin(lat);for(let ix=0;ix<=lonN;ix++){const lon=-Math.PI+ix*Math.PI*2/lonN;verts.push(cl*Math.sin(lon),yy,cl*Math.cos(lon),ix/lonN,iy/latN)}}for(let iy=0;iy<latN;iy++)for(let ix=0;ix<lonN;ix++){let p=iy*(lonN+1)+ix,q=p+lonN+1;idx.push(p,q,p+1,p+1,q,q+1)}const vb=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,vb);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(verts),gl.STATIC_DRAW);const ib=gl.createBuffer();gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,ib);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(idx),gl.STATIC_DRAW);const tex=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,tex);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.REPEAT);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);const img=new Image();img.onload=()=>{gl.bindTexture(gl.TEXTURE_2D,tex);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,1);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGB,gl.RGB,gl.UNSIGNED_BYTE,img);globalSurfaceGL.ready=true};img.src=GLOBAL_EARTH_TEXTURE_SRC;globalSurfaceGL={c,gl,pr,vb,ib,tex,count:idx.length,ready:false};return globalSurfaceGL}
function drawGlobalSurfaceGL(W,H,r){const o=initGlobalSurfaceGL();if(!o)return;const {c,gl,pr,vb,ib,tex}=o;if(c.width!==W||c.height!==H){c.width=W;c.height=H}gl.viewport(0,0,W,H);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);if(!o.ready)return;gl.useProgram(pr);gl.bindBuffer(gl.ARRAY_BUFFER,vb);const ap=gl.getAttribLocation(pr,'aPos'),au=gl.getAttribLocation(pr,'aUV');gl.enableVertexAttribArray(ap);gl.vertexAttribPointer(ap,3,gl.FLOAT,false,20,0);gl.enableVertexAttribArray(au);gl.vertexAttribPointer(au,2,gl.FLOAT,false,20,12);gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,ib);gl.uniform1f(gl.getUniformLocation(pr,'uYaw'),globeRad(globalGlobe.yaw));gl.uniform1f(gl.getUniformLocation(pr,'uPitch'),globeRad(globalGlobe.pitch));gl.uniform1f(gl.getUniformLocation(pr,'uScale'),r/(Math.min(W,H)/2));gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,tex);gl.uniform1i(gl.getUniformLocation(pr,'uTex'),0);gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LEQUAL);gl.drawElements(gl.TRIANGLES,o.count,gl.UNSIGNED_SHORT,0)}
/* Classified OA label interference: visual-only, independent per OA. */
const globalOAScrambleState={};
const GLOBAL_OA_SCRAMBLE_FRAMES=[
    '[01011010]',
    '[R3D@CT3D]',
    '[????1101]',
    '[X0R-7F2A]',
    '[1010?011]'
];
function globalOAScrambledName(oa,now){
    if(globalOAIdentityRevealed(oa)){
        delete globalOAScrambleState[oa];
        return globalOADisplayName(oa);
    }
    let s=globalOAScrambleState[oa];
    if(!s){
        s={next:now+4000+Math.random()*5000,end:0,frame:0};
        globalOAScrambleState[oa]=s;
    }
    if(now>=s.next){
        s.end=now+300+Math.random()*300;
        s.frame=Math.floor(Math.random()*GLOBAL_OA_SCRAMBLE_FRAMES.length);
        s.next=s.end+4000+Math.random()*5000;
    }
    if(now<s.end)return GLOBAL_OA_SCRAMBLE_FRAMES[s.frame];
    return '[REDACTED]';
}
function drawGlobalGlobe(now){drawGlobalSpace(now);const c=$('#globalGlobeCanvas'),wrap=$('#globalEarthWrap'),ov=$('#globalGlobeOverlay');if(!c||!wrap||!ov)return;initGlobalGlobe();const rect=wrap.getBoundingClientRect(),dpr=GLOBAL_RENDER_DPR,logical=Math.max(2,Math.round(Math.min(rect.width,rect.height)*dpr)),pad=1.72,W=Math.round(logical*pad),H=Math.round(logical*pad);if(c.width!==W||c.height!==H){c.width=W;c.height=H}const ctx=c.getContext('2d'),cx=W/2,cy=H/2,r=logical*.40*globalGlobe.zoom;ctx.clearRect(0,0,W,H);drawGlobalSurfaceGL(W,H,r);
 // Lightweight atmosphere + terminator only. No city lights, cloud fields, storms, or aurora in this isolation build.
 ctx.save();ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.clip();const sunX=cx+r*.58,sunY=cy-r*.10,term=ctx.createRadialGradient(sunX,sunY,r*.10,sunX,sunY,r*1.30);term.addColorStop(0,'rgba(118,194,214,.035)');term.addColorStop(.48,'rgba(4,14,20,.025)');term.addColorStop(.64,'rgba(0,4,10,.30)');term.addColorStop(.82,'rgba(0,2,7,.62)');term.addColorStop(1,'rgba(0,1,5,.78)');ctx.fillStyle=term;ctx.fillRect(cx-r,cy-r,r*2,r*2);ctx.restore();let atm=ctx.createRadialGradient(cx,cy,r*.91,cx,cy,r*1.075);atm.addColorStop(0,'rgba(85,181,215,0)');atm.addColorStop(.72,'rgba(93,191,224,.075)');atm.addColorStop(.9,'rgba(116,211,238,.16)');atm.addColorStop(1,'rgba(116,211,238,0)');ctx.beginPath();ctx.arc(cx,cy,r*1.08,0,Math.PI*2);ctx.fillStyle=atm;ctx.fill();ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.strokeStyle='rgba(143,218,235,.42)';ctx.lineWidth=1.5*dpr;ctx.stroke();
 const dt=Math.min(.05,(now-globalGlobe.lastT)/1000);globalGlobe.lastT=now;if(!globalGlobe.drag)globalGlobe.yaw-=dt*2.0;globalGlobe.orbitT+=dt*1.5;const ovRect=ov.getBoundingClientRect(),sx=ovRect.width/W,sy=ovRect.height/H;Object.entries(GLOBAL_OA_GEO).forEach(([oa,ll])=>{let q=globeProject(ll.lat,ll.lon,cx,cy,r),el=ov.querySelector('[data-oa="'+oa+'"]');if(el){const label=el.querySelector('.oa-callout-text');if(label){const expected=GLOBAL_OA_NUM[oa]+' '+globalOAScrambledName(oa,now);if(label.textContent!==expected)label.textContent=expected;const classified=!globalOAIdentityRevealed(oa);el.classList.toggle('oa-classified',classified);el.classList.toggle('oa-scrambling',classified&&expected.includes('[')&&!expected.includes('[REDACTED]'));}el.style.left=(q.x*sx)+'px';el.style.top=(q.y*sy)+'px';el.classList.toggle('callout-left',q.x<cx);el.classList.toggle('callout-right',q.x>=cx);el.classList.toggle('backside',q.z<=0);el.classList.toggle('selected',globalSelectedOA===oa)}});GLOBAL_ORBITS.forEach((o,i)=>{let ll=globeOrbitLatLon(o,globalGlobe.orbitT),q=globeProject(ll.lat,ll.lon,cx,cy,r),el=ov.querySelector('.globe-sat-'+i);if(el){el.style.left=(q.x*sx)+'px';el.style.top=(q.y*sy)+'px';el.classList.toggle('backside',q.z<=0)}});{let ll=globeOrbitLatLon(GLOBAL_UNK_ORBIT,globalGlobe.orbitT),q=globeProject(ll.lat,ll.lon,cx,cy,r),el=ov.querySelector('.globe-unk-contact');if(el){el.style.left=(q.x*sx)+'px';el.style.top=(q.y*sy)+'px';el.classList.toggle('backside',q.z<=0)}}{const el=ov.querySelector('.globe-ufo-contact');if(el){
    const active=globalUfoVisibility(dt),s=globalUfoWindow;
    if(active){
        const progress=Math.min(1,(s.elapsed-s.startAt)/s.duration);
        const fade=Math.max(0,Math.min(1,(1-progress)/.30));
        el.style.setProperty('--ufo-fade',String(fade));
        const travel=(progress*2-1)*1.65*s.direction;
        const height=s.elevation+s.slope*(progress*2-1);
        const x=cx+travel*r,y=cy+height*r;
        const behind=(travel*travel+height*height)<1.015;
        el.style.left=(x*sx)+'px';
        el.style.top=(y*sy)+'px';
        el.classList.toggle('backside',behind);
    }
    el.classList.toggle('active',active);
}}{let ll=globeOrbitLatLon(GLOBAL_RETRO_ORBIT,globalGlobe.orbitT),q=globeProject(ll.lat,ll.lon,cx,cy,r),el=ov.querySelector('.globe-retro-station');if(el){el.style.left=(q.x*sx)+'px';el.style.top=(q.y*sy)+'px';el.classList.toggle('backside',q.z<=0);el.classList.toggle('selected',globalSelectedOA==='RETRO')}}}
let homeOALastFrame=0,campaignOALastFrame=0;
function globalGlobeFrame(now){
    const home=document.getElementById('mainMenu');
    if(home&&!home.classList.contains('hidden')&&now-homeOALastFrame>=100){
        homeOALastFrame=now;
        refreshHomeOAClassification(now);
    }
    const campaignMenu=document.getElementById('campaignMenu');
    if(campaignMenu&&!campaignMenu.classList.contains('hidden')&&now-campaignOALastFrame>=100){campaignOALastFrame=now;refreshCampaignOAClassification(now);}
    const visible=!$('#globalMenu')?.classList.contains('hidden');if(visible&&(!GLOBAL_FRAME_MS||now-globalLastFrame>=GLOBAL_FRAME_MS)){globalLastFrame=now;drawGlobalGlobe(now)}requestAnimationFrame(globalGlobeFrame)} requestAnimationFrame(globalGlobeFrame);
const GLOBAL_DESCENT_IMAGE={KESTREL:'assets/maps/oa-kestrel-overscan.png',VANTAGE:'assets/maps/oa-vantage-overscan.png',VERDANT:'assets/maps/oa-verdant-overscan.png',MIRAGE:'assets/maps/oa-mirage-overscan.png',TEMPEST:'assets/maps/oa-tempest-overscan.png',ARCTIC:'assets/maps/oa-arctic-basemap.png'};
const GLOBAL_MAP_IMAGE={KESTREL:'assets/maps/oa-kestrel-basemap.png',VANTAGE:'assets/maps/oa-vantage-basemap.png',VERDANT:'assets/maps/oa-verdant-basemap.png',MIRAGE:'assets/maps/oa-mirage-basemap.png',TEMPEST:'assets/maps/oa-tempest-basemap.png',ARCTIC:'assets/maps/oa-arctic-basemap.png'};
const GLOBAL_PLANNING_IMAGE={...GLOBAL_MAP_IMAGE,TEMPEST:'assets/maps/oa-tempest-approved.png'};
function resetGlobalOAEntryOverlays(){['#mainMenu','#globalMenu','#globalPlanning','#campaignMenu'].forEach(sel=>$(sel)?.classList.add('hidden'));}
function enterSelectedGlobalOA(oa){resetGlobalOAEntryOverlays();if(oa==='VERDANT'){campaignMenuOA='VERDANT';cpCampaignMenu();selectCampaignOA('VERDANT');return}if(oa==='MIRAGE'||oa==='TEMPEST'){campaignMenuOA=oa;cpCampaignMenu();selectCampaignOA(oa);return}campaignMenuOA=oa;cpCampaignMenu();}
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
function refreshGlobalTaskingDetail(oa){const p=readGlobalNAIs()[oa];if(!p)return;$('#globalOADetail').textContent=globalOAIdentityRevealed(oa)?'NAI TASKED // '+(p.points?.length||0)+' CONTROL POINTS':'REGIONAL INTELLIGENCE // CLASSIFIED';}
function openGlobalPlanning(){if(!globalSelectedOA)return;openGlobalPlanningDirect();}
function openGlobalPlanningDirect(){if(!globalSelectedOA)return;const oa=globalSelectedOA,saved=readGlobalNAIs()[oa];globalPlanningPoints=(saved?.points||[]).map(p=>({x:p.x,y:p.y}));globalPlanningCommitted=!!saved?.committed;globalPlanningDrag=-1;$('#planningOAName').textContent='OA '+({'KESTREL':'01','VANTAGE':'02','VERDANT':'03','MIRAGE':'04','TEMPEST':'05','ARCTIC':'06'}[oa])+' // '+(oa==='ARCTIC'?'POLARIS':oa);$('#planningMap').style.backgroundImage="linear-gradient(rgba(4,10,13,.08),rgba(4,10,13,.08)),url('"+GLOBAL_PLANNING_IMAGE[oa]+"')";$('#globalPlanning').classList.remove('hidden');renderGlobalPlanning();}
function closeGlobalPlanning(){$('#globalPlanning').classList.add('hidden');globalPlanningDrag=-1;}
function eventPlanningPoint(e){const r=$('#planningMap').getBoundingClientRect();return{x:Math.max(0,Math.min(1,(e.clientX-r.left)/r.width)),y:Math.max(0,Math.min(1,(e.clientY-r.top)/r.height))};}
function placeGlobalNAI(e){if(!globalSelectedOA||globalPlanningCommitted||globalPlanningDrag>=0||globalPlanningPoints.length>=4||e.target.closest?.('.planning-vertex'))return;globalPlanningPoints.push(eventPlanningPoint(e));renderGlobalPlanning();}
function startPlanningDrag(e,i){if(globalPlanningCommitted)return;e.preventDefault();e.stopPropagation();globalPlanningDrag=i;e.currentTarget.setPointerCapture?.(e.pointerId);}
function movePlanningDrag(e){if(globalPlanningDrag<0||globalPlanningCommitted)return;globalPlanningPoints[globalPlanningDrag]=eventPlanningPoint(e);renderGlobalPlanning();}
function endPlanningDrag(){globalPlanningDrag=-1;}
function renderGlobalPlanning(){const poly=$('#planningNAIPolygon'),vg=$('#planningNAIVertices'),pts=globalPlanningPoints,area=planningAreaFraction(),cross=planningSelfIntersects(),valid=planningValid(),over=pts.length>=3&&area>GLOBAL_NAI_MAX_AREA;poly.setAttribute('points',pts.map(p=>`${p.x*900},${p.y*650}`).join(' '));poly.classList.toggle('hidden',pts.length<2);poly.classList.toggle('invalid',over||cross);poly.classList.toggle('committed',globalPlanningCommitted);vg.innerHTML='';pts.forEach((p,i)=>{const ns='http://www.w3.org/2000/svg',g=document.createElementNS(ns,'g');g.setAttribute('class','planning-vertex'+(globalPlanningCommitted?' committed':''));g.setAttribute('transform',`translate(${p.x*900} ${p.y*650})`);g.innerHTML=`<circle r="18" class="planning-vertex-hit"></circle><circle r="7" class="planning-vertex-dot"></circle><text x="0" y="-13" text-anchor="middle">${i+1}</text>`;g.addEventListener('pointerdown',e=>startPlanningDrag(e,i));vg.appendChild(g);});const c=polygonCentroid(pts);$('#planningCoord').textContent=c?'CENTROID // '+String(Math.round(c.x*900)).padStart(3,'0')+' / '+String(Math.round(c.y*650)).padStart(3,'0'):'CENTROID // --- / ---';$('#planningVertexCount').textContent=pts.length+' / 4';$('#planningArea').textContent=(pts.length<3?'0':Math.round(area/GLOBAL_NAI_MAX_AREA*100))+'%';$('#planningArea').classList.toggle('planning-invalid',over||cross);$('#planningCommit').disabled=!valid||globalPlanningCommitted;$('#planningUndo').disabled=!pts.length||globalPlanningCommitted;$('#planningRevise').classList.toggle('hidden',!globalPlanningCommitted);if(globalPlanningCommitted){$('#planningStatus').textContent='COMMITTED';$('#planningPrompt').textContent='PRIORITY NAI // COLLECTION TASKED';}else if(cross){$('#planningStatus').textContent='INVALID GEOMETRY';$('#planningPrompt').textContent='INVALID GEOMETRY // EDGES MAY NOT CROSS';}else if(over){$('#planningStatus').textContent='AREA EXCEEDED';$('#planningPrompt').textContent='AUTHORIZED AREA EXCEEDED // REDUCE POLYGON';}else if(valid){$('#planningStatus').textContent='READY';$('#planningPrompt').textContent='COLLECTION AREA VALID // COMMIT WHEN READY';}else if(pts.length){const need=Math.max(0,3-pts.length);$('#planningStatus').textContent='DRAFT';$('#planningPrompt').textContent=need?'DEFINE AREA OF INTELLIGENCE INTEREST // '+need+' MORE POINT'+(need===1?'':'S')+' REQUIRED':'OPTIONAL FOURTH POINT // OR COMMIT';}else{$('#planningStatus').textContent='NOT TASKED';$('#planningPrompt').textContent='DEFINE AREA OF INTELLIGENCE INTEREST // 3-4 CONTROL POINTS';}}
function undoGlobalPlanningPoint(){if(globalPlanningCommitted||!globalPlanningPoints.length)return;globalPlanningPoints.pop();renderGlobalPlanning();}
function clearGlobalPlanning(){globalPlanningPoints=[];globalPlanningCommitted=false;if(globalSelectedOA){const all=readGlobalNAIs();delete all[globalSelectedOA];localStorage.setItem(GLOBAL_NAI_KEY,JSON.stringify(all));$('#globalOADetail').textContent='REGIONAL PICTURE AVAILABLE';if(activeOA===globalSelectedOA)cpRenderStrategicPriorityNAI();}renderGlobalPlanning();}
function reviseGlobalPlanning(){if(!globalSelectedOA)return;globalPlanningCommitted=false;renderGlobalPlanning();}
function commitGlobalPlanning(){if(!globalSelectedOA||!planningValid())return;globalPlanningCommitted=true;const all=readGlobalNAIs();all[globalSelectedOA]={points:globalPlanningPoints.map(p=>({x:p.x,y:p.y})),committed:true,updated:Date.now()};localStorage.setItem(GLOBAL_NAI_KEY,JSON.stringify(all));renderGlobalPlanning();refreshGlobalTaskingDetail(globalSelectedOA);if(activeOA===globalSelectedOA)cpRenderStrategicPriorityNAI();}
let planningSuppressClick=false;
const planningMapEl=$('#planningMap');if(planningMapEl){planningMapEl.addEventListener('pointermove',e=>{if(globalPlanningDrag>=0){planningSuppressClick=true;movePlanningDrag(e);}});planningMapEl.addEventListener('click',e=>{if(planningSuppressClick){planningSuppressClick=false;return;}if(e.target.closest?.('.planning-vertex'))return;placeGlobalNAI(e);});}window.addEventListener('pointerup',()=>{endPlanningDrag();setTimeout(()=>{planningSuppressClick=false},0)});window.addEventListener('pointercancel',()=>{endPlanningDrag();planningSuppressClick=false});


async function refreshPrivacyChoicesEntry(){
  const button=$('#privacyChoicesBtn');
  const status=$('#privacyChoicesStatus');
  if(!button)return;

  const plugin=window.Capacitor?.Plugins?.PrivacyChoices;
  if(!plugin){
    button.hidden=true;
    if(status)status.textContent='PRIVACY OPTIONS AVAILABLE IN ANDROID APP';
    return;
  }

  button.hidden=true;
  try{
    const result=await plugin.getStatus();
    if(!result?.initialized){
      if(status)status.textContent='PRIVACY OPTIONS INITIALIZING - TRY AGAIN SHORTLY';
      return;
    }

    button.hidden=!result.required;
    if(!result.required&&status)status.textContent='NO ADDITIONAL PRIVACY OPTIONS REQUIRED';
  }catch(e){
    console.error('Privacy Choices status error',e);
    button.hidden=true;
    if(status)status.textContent='PRIVACY OPTIONS UNAVAILABLE';
  }
}
async function openPrivacyChoices(){
  const status=$('#privacyChoicesStatus');

  try{
    const capacitor=window.Capacitor;
    const plugin=capacitor?.Plugins?.PrivacyChoices;

    if(!plugin){
      if(status)status.textContent='PRIVACY OPTIONS AVAILABLE IN ANDROID APP';
      return;
    }

    if(status)status.textContent='CHECKING PRIVACY OPTIONS...';

    const result=await plugin.getStatus();

    if(!result?.initialized){
      if(status)status.textContent='PRIVACY OPTIONS INITIALIZING - TRY AGAIN SHORTLY';
      return;
    }

    if(!result?.required){
      $('#privacyChoicesBtn').hidden=true;
      if(status)status.textContent='NO ADDITIONAL PRIVACY OPTIONS REQUIRED';
      return;
    }

    $('#privacyChoicesBtn').hidden=false;
    if(status)status.textContent='OPENING PRIVACY OPTIONS...';

    await plugin.show();

    if(status)status.textContent='PRIVACY CHOICES UPDATED';
  }catch(e){
    console.error('Privacy Choices error',e);
    if(status)status.textContent='PRIVACY OPTIONS UNAVAILABLE';
  }
}
let settingsReturn='main';function openSettings(from){settingsReturn=from||'main';$('#settingsMenu').classList.remove('hidden');if(settingsReturn==='pause')$('#pauseMenu').classList.add('hidden');else $('#mainMenu').classList.add('hidden');applyAudioSettings();refreshDevAccessUI();refreshPrivacyChoicesEntry()}function closeSettings(){$('#settingsMenu').classList.add('hidden');if(settingsReturn==='pause')$('#pauseMenu').classList.remove('hidden');else $('#mainMenu').classList.remove('hidden')}[['musicSlider','music'],['uiSlider','ui'],['sfxSlider','sfx']].forEach(([id,k])=>{const el=$('#'+id);if(el)el.addEventListener('input',e=>setAudioLevel(k,e.target.value))});[['gridOpacitySlider','gridOpacity'],['gridWeightSlider','gridWeight']].forEach(([id,k])=>$('#'+id)?.addEventListener('input',e=>saveVisualSetting(k,e.target.value)));$('#gridColorSelect')?.addEventListener('change',e=>saveVisualSetting('gridColor',e.target.value));$('#isrColorSelect')?.addEventListener('change',e=>saveVisualSetting('isrColor',e.target.value));$('#isrSymbolSelect')?.addEventListener('change',e=>saveVisualSetting('isrSymbol',e.target.value));$('#privacyChoicesBtn')?.addEventListener('click',openPrivacyChoices);$('#settingsBtn').addEventListener('click',()=>openSettings('main'));$('#commandProfileBtn')?.addEventListener('click',openCommandProfile);$('#commandProfileBack')?.addEventListener('click',closeCommandProfile);document.querySelectorAll('[data-isr-capability]').forEach(b=>b.addEventListener('click',()=>setISRCapability(b.dataset.isrCapability)));$('#pauseSettingsBtn').addEventListener('click',()=>openSettings('pause'));$('#settingsBack').addEventListener('click',closeSettings);
$('#devAccessUnlock')?.addEventListener('click',unlockDevAccess);
$('#devAccessCode')?.addEventListener('keydown',e=>{if(e.key==='Enter')unlockDevAccess()});
 $('#devCampaignResetButton')?.addEventListener('click',resetSelectedDevCampaign);
$('#devModeOn')?.addEventListener('click',()=>setDevMode(true));
$('#devModeOff')?.addEventListener('click',()=>setDevMode(false));applyAudioSettings();installMenuButtonAudio();
$( '#devProgressionSelect' )?.addEventListener('change',e=>setDevProgressionStage(e.target.value));
document.querySelectorAll('[data-campaign-oa]').forEach(b=>b.addEventListener('click',()=>selectCampaignOA(b.dataset.campaignOa)));document.querySelectorAll('[data-intel-assist]').forEach(b=>b.addEventListener('click',()=>setArcadeIntelAssist(b.dataset.intelAssist)));refreshArcadeIntelAssist();
$('#tutorialBtn').addEventListener('click',tutorialMenu);$('#tutorialBegin').addEventListener('click',tutorialBegin);$('#tutorialBack').addEventListener('click',()=>{$('#tutorialBriefing').classList.add('hidden');$('#mainMenu').classList.remove('hidden')});$('#tutorialNext').addEventListener('click',tutorialSupportNext);$('#campaignBtn').addEventListener('click',cpCampaignMenu);$('#mission0301').addEventListener('click',cpBrief0301);$('#mission0302').addEventListener('click',cpBrief0302);$('#mission0303').addEventListener('click',cpBrief0303);$('#mission0304').addEventListener('click',cpBrief0304);$('#mission0305').addEventListener('click',cpBrief0305);$('#briefBack0301').addEventListener('click',()=>{$('#briefing0301').classList.add('hidden');$('#campaignMenu').classList.remove('hidden')});$('#briefBack0302').addEventListener('click',()=>{$('#briefing0302').classList.add('hidden');$('#campaignMenu').classList.remove('hidden')});$('#briefBack0303').addEventListener('click',()=>{$('#briefing0303').classList.add('hidden');$('#campaignMenu').classList.remove('hidden')});$('#briefBack0304').addEventListener('click',()=>{$('#briefing0304').classList.add('hidden');$('#campaignMenu').classList.remove('hidden')});$('#briefBack0305').addEventListener('click',()=>{$('#briefing0305').classList.add('hidden');$('#campaignMenu').classList.remove('hidden')});$('#begin0301').addEventListener('click',cpBegin0301);$('#begin0302').addEventListener('click',cpBegin0302);$('#begin0303').addEventListener('click',cpBegin0303);$('#begin0304').addEventListener('click',cpBegin0304);$('#begin0305').addEventListener('click',cpBegin0305);$('#mission0401').addEventListener('click',cpBrief0401);$('#mission0402').addEventListener('click',cpBrief0402);$('#mission0403').addEventListener('click',cpBrief0403);$('#mission0404').addEventListener('click',cpBrief0404);$('#mission0405').addEventListener('click',cpBrief0405);$('#mission0501Dev').addEventListener('click',()=>cpTempestBrief('05-01'));$('#briefBack0401').addEventListener('click',()=>{$('#briefing0401').classList.add('hidden');$('#campaignMenu').classList.remove('hidden')});$('#begin0401').addEventListener('click',cpBegin0401);$('#briefBack0402').addEventListener('click',()=>{$('#briefing0402').classList.add('hidden');$('#campaignMenu').classList.remove('hidden')});$('#begin0402').addEventListener('click',cpBegin0402);$('#briefBack0403').addEventListener('click',()=>{$('#briefing0403').classList.add('hidden');$('#campaignMenu').classList.remove('hidden')});$('#begin0403').addEventListener('click',cpBegin0403);$('#briefBack0404').addEventListener('click',()=>{$('#briefing0404').classList.add('hidden');$('#campaignMenu').classList.remove('hidden')});$('#begin0404').addEventListener('click',cpBegin0404);$('#briefBack0405').addEventListener('click',()=>{$('#briefing0405').classList.add('hidden');$('#campaignMenu').classList.remove('hidden')});$('#begin0405').addEventListener('click',cpBegin0405);$('#arcadeBtn').addEventListener('click',arcadeMenu);$('#arcadeBegin').addEventListener('click',arcadeBegin);$('#arcadeBack').addEventListener('click',()=>{$('#arcadeBriefing').classList.add('hidden');if(globalActivityContext){document.body.classList.remove('global-context-arcade');globalActivityContext=false;openGlobal();if(globalSelectedOA)selectGlobalOA(globalSelectedOA);}else $('#mainMenu').classList.remove('hidden')});$('#arcadeRedeploy').addEventListener('click',arcadeBegin);$('#arcadeMenuBtn').addEventListener('click',()=>ciInterstitialThen(()=>{arcadeHide();cpShowMenu()}));$('#mission0101').addEventListener('click',cpBrief0101);$('#mission0102').addEventListener('click',cpBrief0102);$('#mission0103').addEventListener('click',cpBrief0103);$('#mission0104').addEventListener('click',cpBrief0104);$('#mission0105').addEventListener('click',cpBrief0105);$('#campaignBack').addEventListener('click',()=>{$('#campaignMenu').classList.add('hidden');if(globalActivityContext){document.body.classList.remove('global-context-campaign');globalActivityContext=false;openGlobal();if(globalSelectedOA)selectGlobalOA(globalSelectedOA);}else $('#mainMenu').classList.remove('hidden')});$('#briefBack').addEventListener('click',()=>{$('#briefing0101').classList.add('hidden');$('#campaignMenu').classList.remove('hidden')});$('#briefBack0102').addEventListener('click',()=>{$('#briefing0102').classList.add('hidden');$('#campaignMenu').classList.remove('hidden')});$('#briefBack0103').addEventListener('click',()=>{$('#briefing0103').classList.add('hidden');$('#campaignMenu').classList.remove('hidden')});$('#briefBack0104').addEventListener('click',()=>{$('#briefing0104').classList.add('hidden');$('#campaignMenu').classList.remove('hidden')});$('#briefBack0105').addEventListener('click',()=>{$('#briefing0105').classList.add('hidden');$('#campaignMenu').classList.remove('hidden')});$('#begin0101').addEventListener('click',cpBegin0101);$('#begin0102').addEventListener('click',cpBegin0102);$('#begin0103').addEventListener('click',cpBegin0103);$('#begin0104').addEventListener('click',cpBegin0104);$('#begin0105').addEventListener('click',cpBegin0105);$('#intelMitigate').addEventListener('click',()=>cpIntelDropChoose('MITIGATE'));$('#intelExploit').addEventListener('click',()=>cpIntelDropChoose('EXPLOIT'));$('#intelSupply').addEventListener('click',()=>cpIntelDropChoose('SUPPLY'));$('#resultRetry').addEventListener('click',()=>campaignMission==='04-05'?cpBegin0405():campaignMission==='04-04'?cpBegin0404():campaignMission==='04-03'?cpBegin0403():campaignMission==='04-02'?cpBegin0402():campaignMission==='04-01'?cpBegin0401():/^02-/.test(campaignMission||'')?cpBegin02(campaignMission):(/^05-0[1-5]$/.test(campaignMission||'')?cpBeginTempest(campaignMission):(campaignMission==='01-05'?cpBegin0105():(campaignMission==='01-04'?cpBegin0104():(campaignMission==='01-03'?cpBegin0103():(campaignMission==='01-02'?cpBegin0102():cpBegin0101()))))));$('#resultContinue').addEventListener('click',()=>ciInterstitialThen(cpCampaignMenu));$('#resultReturnCommand').addEventListener('click',()=>ciInterstitialThen(cpCampaignMenu));
$('#pauseBtn').addEventListener('click',()=>cpSetPause(!window.CP_PAUSED));$('#muteBtn').addEventListener('click',()=>{masterMuted=!masterMuted;localStorage.setItem('ci-audio-muted',masterMuted?'1':'0');localStorage.setItem('ci-audio-mute-explicit','1');applyAudioSettings();if(!masterMuted){audioUnlock();musicSetMode((running&&!window.CP_MENU)?'mission':'menu')}});
$('#resumeBtn').addEventListener('click',()=>cpSetPause(false));
$('#restartBtn').addEventListener('click',()=>{if(!confirm('Restart this mission? Current mission progress will be reset.'))return;window.CP_PAUSED=false;$('#pauseMenu').classList.add('hidden');if(campaignMission==='ARCADE')arcadeBegin();else{deploy();last=performance.now()}});$('#pauseUtilitiesBtn')?.addEventListener('click',()=>{$('#pauseMenu').classList.add('hidden');$('#utilityMenu').classList.remove('hidden')});$('#utilityBack')?.addEventListener('click',()=>{$('#utilityMenu').classList.add('hidden');$('#pauseMenu').classList.remove('hidden')});
$('#abortBtn').addEventListener('click',()=>{campaignMission==='RETRO'?cpRetroExit():(campaignMission==='ARCADE'?cpShowMenu():(campaignMission?cpCampaignMenu():cpShowMenu()))});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!window.CP_MENU&&running){e.preventDefault();cpSetPause(!window.CP_PAUSED)}});

document.querySelectorAll('[data-arcade-oa]').forEach(b=>b.addEventListener('click',()=>setArcadeOA(b.dataset.arcadeOa)));
['0201','0202','0203','0204','0205'].forEach(n=>{let b=$('#mission'+n);if(b)b.addEventListener('click',()=>cpBrief02('02-'+n.slice(-2)))});
$('#briefing02Back')?.addEventListener('click',()=>{$('#briefing02').classList.add('hidden');cpCampaignMenu()});
$('#briefing02Begin')?.addEventListener('click',e=>cpBegin02(e.currentTarget.dataset.mission));

const eventPanel=$('#eventPanel'),devPanel=$('#devPanel');if(eventPanel){eventPanel.open=true;$('#utilityEventHost')?.appendChild(eventPanel)}if(devPanel){devPanel.open=false;$('#utilityDevHost')?.appendChild(devPanel)}applyVisualSettings();applyAudioSettings();refreshDevAccessUI();cpRefreshCampaign();cpRefreshCampaign02();setArcadeOA(arcadeOA);cpShowMenu();window.CI_showStudioReveal=function(){
 const el=$('#studioReveal'),lockup=el?.querySelector('.studio-type-lockup'),copy=el?.querySelector('.studio-type-copy'),primary=$('#studioTypedPrimary'),secondary=$('#studioTypedSecondary'),primaryLine=el?.querySelector('.studio-type-primary'),secondaryLine=el?.querySelector('.studio-type-secondary'),caret=$('#studioDomCaret');if(!el)return;
 const first='INACTIVE',second='STUDIOS';let finished=false,timers=[],typeTimer=null,blinkTimer=null,caretTarget=primaryLine;
 const later=(fn,ms)=>{const t=setTimeout(fn,ms);timers.push(t);return t};
 const stopBlink=()=>{if(blinkTimer){clearInterval(blinkTimer);blinkTimer=null}};
 const setCaret=(on)=>{if(caret)caret.style.opacity=on?'1':'0'};
 const placeCaret=(line=caretTarget)=>{if(!caret||!copy||!line)return;caretTarget=line;requestAnimationFrame(()=>{const cr=copy.getBoundingClientRect(),lr=line.getBoundingClientRect();const textNode=line.querySelector('span');const tr=textNode?.getBoundingClientRect();const fs=parseFloat(getComputedStyle(line).fontSize)||32;const x=(tr&&tr.width>0?tr.right:lr.left+lr.width/2)-cr.left;const y=lr.top-cr.top+lr.height/2;caret.style.left=`${Math.min(cr.width-8,Math.max(8,x+Math.max(3,fs*.09)))}px`;caret.style.top=`${y}px`;caret.style.height=`${Math.max(14,Math.min(92,fs*.94))}px`;});};
 const startBlink=(line,ms=430)=>{stopBlink();placeCaret(line);let on=true;setCaret(true);blinkTimer=setInterval(()=>{on=!on;setCaret(on)},ms)};
 const cleanup=()=>{timers.forEach(clearTimeout);timers=[];if(typeTimer){clearInterval(typeTimer);typeTimer=null}stopBlink()};
 const revealTitle=()=>{document.body.classList.remove('studio-boot-pending');document.body.classList.add('studio-title-reveal')};
 const finish=()=>{if(finished)return;finished=true;if(typeTimer){clearInterval(typeTimer);typeTimer=null}el.classList.remove('hero');later(()=>{stopBlink();setCaret(false);revealTitle();later(()=>{el.classList.add('exit');later(()=>{el.classList.remove('show','exit');el.setAttribute('aria-hidden','true')},1450)},420)},1100)};
 const typeString=(node,line,text,ms,offset,done)=>{let i=0;node.textContent='';placeCaret(line);typeTimer=setInterval(()=>{node.textContent=text.slice(0,++i);studioTypeClack(offset+i,'key');placeCaret(line);if(i>=text.length){clearInterval(typeTimer);typeTimer=null;done?.()}},ms)};
 const typeLogo=()=>{if(!primary||!secondary)return;stopBlink();setCaret(true);primary.textContent='';secondary.textContent='';lockup?.classList.remove('typing-secondary','typing-complete');placeCaret(primaryLine);typeString(primary,primaryLine,first,165,0,()=>{later(()=>{studioTypeClack(first.length+1,'enter');lockup?.classList.add('typing-secondary');placeCaret(secondaryLine);setCaret(true);later(()=>typeString(secondary,secondaryLine,second,155,first.length+1,()=>{lockup?.classList.remove('typing-secondary');lockup?.classList.add('typing-complete');startBlink(secondaryLine,430);later(()=>{if(finished)return;finished=true;stopBlink();setCaret(false);studioFinalGlitch(lockup);sound('intel')},1650)}),120)},300)})};
 el.setAttribute('aria-hidden','false');el.classList.add('show');
 later(()=>{el.classList.add('hero');if(primary)primary.textContent='';if(secondary)secondary.textContent='';lockup?.classList.remove('typing-secondary','typing-complete');startBlink(primaryLine,430);later(()=>studioPreTypeGlitch(el,lockup),1750);later(()=>{stopBlink();setCaret(true);typeLogo()},2850)},2400);
 const skip=()=>{if(finished)return;cleanup();if(primary)primary.textContent=first;if(secondary)secondary.textContent=second;lockup?.classList.remove('typing-secondary');lockup?.classList.add('typing-complete');el.classList.add('hero');placeCaret(secondaryLine);startBlink(secondaryLine,430);later(finish,500)};
 el.addEventListener('pointerdown',skip,{once:true});document.addEventListener('keydown',skip,{once:true});
 const reposition=()=>placeCaret(caretTarget);window.addEventListener('resize',reposition,{passive:true,once:true});
};;;(function bootSequence(){const splash=$('#bootSplash'),bar=$('#bootLoadBar'),pct=$('#bootPct'),minBoot=1800,t0=performance.now();ciPrimeBootAudio();const bootUnlock=()=>{audioUnlock();splash?.classList.add('audio-armed');const hint=$('#bootAudioHint');if(hint)hint.textContent='AUDIO LINK // ACTIVE'};splash?.addEventListener('pointerdown',bootUnlock,{once:true,capture:true});document.addEventListener('keydown',bootUnlock,{once:true,capture:true});const critical=[GLOBAL_EARTH_TEXTURE_SRC,'assets/maps/global-deep-space.png'];let complete=0,total=critical.length+1;function paint(){const n=Math.min(99,Math.round(complete/total*100));if(bar){bar.style.width=n+'%';bar.style.backgroundColor=n<50?'#ff4b45':n<80?'#e0b23d':'#55d67a'}if(pct){pct.textContent=n+'%';pct.style.color=n<50?'#ff6b65':n<80?'#e0b23d':'#55d67a'}}function preload(src){return new Promise(resolve=>{const img=new Image();let done=false;const finish=()=>{if(done)return;done=true;complete++;paint();resolve()};img.onload=()=>{const d=img.decode?.();if(d&&d.then)d.then(finish).catch(finish);else finish()};img.onerror=finish;img.src=src;if(img.complete&&img.naturalWidth)img.onload()})}async function warm(){paint();await Promise.all(critical.map(preload));try{const gl=initGlobalSurfaceGL();const limit=performance.now()+2200;while(gl&&!gl.ready&&performance.now()<limit)await new Promise(r=>setTimeout(r,32));if(gl){drawGlobalSurfaceGL(8,8,3);try{gl.gl.finish()}catch(e){}}}catch(e){}complete++;paint();const wait=Math.max(0,minBoot-(performance.now()-t0));if(wait)await new Promise(r=>setTimeout(r,wait));if(bar){bar.style.width='100%';bar.style.backgroundColor='#55d67a'}if(pct){pct.textContent='100%';pct.style.color='#55d67a'}requestAnimationFrame(()=>requestAnimationFrame(()=>{splash?.classList.add('done');window.CI_showStudioReveal?.()}))}warm();setTimeout(()=>ciPreloadInterstitial(),5000)})();
requestAnimationFrame(loop)})();


/* CI campaign briefing layout: pinned headings/actions, internally scrolling details */
(function () {
  const selector = '.gameoverlay[id^="briefing"] > .briefingpanel:not(.briefingpanel-tempest):not(.briefingpanel-polaris)';
  function prepare(panel) {
    if (panel.querySelector(':scope > .ci-briefing-scroll')) return;
    const heading=document.createElement('div'),body=document.createElement('div'),actions=document.createElement('div');
    heading.className='ci-briefing-heading';body.className='ci-briefing-scroll';actions.className='ci-briefing-actions';
    [...panel.children].forEach(child=>{if(child.matches('.menu-kicker,.menu-title'))heading.appendChild(child);else if(child.matches('button'))actions.appendChild(child);else body.appendChild(child)});
    panel.append(heading,body,actions);
  }
  function fit(panel) {
    const overlay=panel.parentElement;if(!overlay||overlay.classList.contains('hidden'))return;prepare(panel);
    const bounds=overlay.getBoundingClientRect(),width=Math.max(1,bounds.width-24),height=Math.max(1,bounds.height-24);
    [['box-sizing','border-box'],['width',Math.min(760,width)+'px'],['max-width',width+'px'],['height','auto'],['max-height',height+'px'],['min-height','0'],['display','flex'],['flex-direction','column'],['overflow','hidden']].forEach(([k,v])=>panel.style.setProperty(k,v,'important'));
    const body=panel.querySelector(':scope > .ci-briefing-scroll');if(body)[['flex','1 1 auto'],['min-height','0'],['overflow-x','hidden'],['overflow-y','auto'],['overscroll-behavior','contain']].forEach(([k,v])=>body.style.setProperty(k,v,'important'));
    const actions=panel.querySelector(':scope > .ci-briefing-actions');if(actions)actions.style.setProperty('flex','0 0 auto','important');
  }
  function fitVisible(){document.querySelectorAll(selector).forEach(fit)}
  const observer=new MutationObserver(ms=>{if(ms.some(m=>m.type==='attributes'&&m.attributeName==='class'&&m.target.matches?.('.gameoverlay[id^="briefing"]')))requestAnimationFrame(fitVisible)});
  function initialize(){document.querySelectorAll('.gameoverlay[id^="briefing"]').forEach(overlay=>{const panel=overlay.querySelector(':scope > .briefingpanel');if(panel&&!panel.classList.contains('briefingpanel-tempest')&&!panel.classList.contains('briefingpanel-polaris'))prepare(panel);observer.observe(overlay,{attributes:true,attributeFilter:['class']})});window.addEventListener('resize',()=>requestAnimationFrame(fitVisible));window.visualViewport?.addEventListener('resize',()=>requestAnimationFrame(fitVisible));fitVisible()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initialize);else initialize();
})();
/* CI adaptive gameplay sidebar controller v1 */
(() => {
    function initializeAdaptiveSidebar() {
        const sidebar = document.querySelector('aside');

        if (!sidebar) return;

        let scheduled = false;

        function updateSidebar() {
            scheduled = false;

            if (!sidebar.isConnected) return;

            // Measure the natural layout before deciding whether
            // the compact layout is necessary.
            sidebar.classList.remove('ci-sidebar-compact');

            const available = sidebar.clientHeight;
            const required = sidebar.scrollHeight;

            sidebar.classList.toggle(
                'ci-sidebar-compact',
                required > available + 1
            );
        }

        function scheduleUpdate() {
            if (scheduled) return;

            scheduled = true;
            requestAnimationFrame(updateSidebar);
        }

        // Observe the sidebar's available dimensions.
        const observer = new ResizeObserver(scheduleUpdate);
        observer.observe(sidebar);

        window.addEventListener('resize', scheduleUpdate, {
            passive: true
        });

        window.visualViewport?.addEventListener(
            'resize',
            scheduleUpdate,
            { passive: true }
        );

        scheduleUpdate();
    }

    if (document.readyState === 'loading') {
        document.addEventListener(
            'DOMContentLoaded',
            initializeAdaptiveSidebar,
            { once: true }
        );
    } else {
        initializeAdaptiveSidebar();
    }
})();
function resetSelectedDevCampaign(){
 const state=$('#devCampaignResetState');
 const campaign=$('#devCampaignResetSelect')?.value;
 if(!devAccessActive()){
  if(state)state.textContent='DEV ACCESS REQUIRED';
  return;
 }
 if(!/^0[1-6]$/.test(campaign||'')){
  if(state)state.textContent='SELECT A VALID CAMPAIGN';
  return;
 }
 if(running||window.CP_PAUSED){
  if(state)state.textContent='RETURN TO THE COMMAND MENU BEFORE RESETTING';
  return;
 }
 const names={
  '01':'KESTREL','02':'VANTAGE','03':'VERDANT',
  '04':'MIRAGE','05':'TEMPEST','06':'POLARIS'
 };
 const name=names[campaign];
 if(!window.confirm('Reset saved progress for Campaign '+campaign+' // '+name+' on this device?'))return;
 const prefix='ci-c'+campaign+'-';
 let removed=0;
 for(const store of [localStorage,sessionStorage]){
  for(let i=store.length-1;i>=0;i--){
   const key=store.key(i);
   if(key&&key.startsWith(prefix)){
    store.removeItem(key);
    removed++;
   }
  }
 }
 devProgressionStage='NONE';
 normalizeISRCapability();
 localStorage.setItem(ISR_CAPABILITY_KEY,isrCapability);
 refreshDevProgressionUI();
 cpRefreshCampaign();
 cpRefreshCampaign02();
 cpRefreshVerdant();
 cpRefreshMirage();
 refreshCommandProfile();
 refreshGlobalOAStatus();
 refreshProgressionBadges();
 if(globalSelectedOA&&document.querySelector('#globalMenu:not(.hidden)'))selectGlobalOA(globalSelectedOA);
 if(state)state.textContent=name+' PROGRESS RESET // '+removed+' SAVED KEYS CLEARED';
}
