(()=>{'use strict';
const $=id=>document.getElementById(id),cfg=NEKO_CONFIG,canvas=$('game'),ctx=canvas.getContext('2d'),images={},errors=[],particles=[],labels=[];
const scale=1.5,playerX=160,groundY=659;let time=0,last=0,runTime=0,paused=false,sound=true,shake=0,resultAt=0,resultShown=false,best=0,toastRemaining=0;
const audio=new NekoAudio.Player(cfg.audio);
const dust=[];let lastDustStep=-1;
const coinFlights=[],coinFlightCtx=$('coinFlights').getContext('2d'),scoreCoin=document.querySelector('.score-coin');let coinImpact=0;
const sceneBuffer=document.createElement('canvas');sceneBuffer.width=780;sceneBuffer.height=799;const sceneCtx=sceneBuffer.getContext('2d');let renderedFrame=0,renderedPose='idle',layerOffsets={sky:0,far:0,near:0,ground:0};
const skyCtx=$('sky').getContext('2d'),sakuraCanvas=$('sakura'),sakuraCtx=sakuraCanvas.getContext('2d'),groundCtx=$('ground').getContext('2d');
try{best=Number(localStorage.getItem('ninja-neko-dodge-best'))||0;}catch{}$('footerBest').textContent=best;
function fit(){const frameWidth=856,frameHeight=1696,s=Math.min(innerWidth/frameWidth,innerHeight/frameHeight,1),phone=$('phone');phone.style.left=12*s+'px';phone.style.transform=`scale(${s})`;$('viewport').style.width=frameWidth*s+'px';$('viewport').style.height=frameHeight*s+'px';}fit();addEventListener('resize',fit);window.visualViewport?.addEventListener('resize',fit);
ctx.imageSmoothingEnabled=false;
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
const assetUrl=(src,a)=>!a.version||src.startsWith('data:')?src:src+(src.includes('?')?'&':'?')+'v='+encodeURIComponent(a.version);
for(const [key,a]of Object.entries(cfg.assets)){
 const sources=a.sources||[a.src],frames=new Array(sources.length);let loaded=0;
 sources.forEach((src,index)=>{const i=new Image();i.onload=()=>{frames[index]=i;if(++loaded===sources.length)images[key]={...a,img:frames[0],frameImages:a.sources?frames:null};};i.onerror=()=>{errors.push(src);toast('画像を読み込めません：'+src);};i.src=assetUrl(src,a);});
}
for(const el of document.querySelectorAll('[data-asset]')){const a=cfg.assets[el.dataset.asset];if(a)el.src=assetUrl(a.src,a);}
function tone(f,d=.12){audio.tone(f,d);}
function toast(s){$('toast').textContent=s;$('toast').classList.add('show');toastRemaining=2;}
function burst(x,y,n=15){for(let i=0;i<n;i++)particles.push({x,y,vx:(Math.random()-.5)*330,vy:-70-Math.random()*270,life:.5+Math.random()*.5,c:['#ffc65e','#ee583c','#54c9f7','#fff3d9'][i%4]});}
function float(x,y,text,asset=null){labels.push({x,y,text,asset,life:1.2});}
const sx=x=>(x-game.distance)*scale+playerX,sy=y=>groundY+(y-460)*scale;
const game=new NekoEngine({...cfg.level,obstacleFloat:!reducedMotion},(event,e)=>{
 if(event==='start'){coinFlights.length=0;coinImpact=0;}
 if(event==='jump'){tone(e.double?750:500);burst(playerX,sy(e.y),8);}
 if(event==='coin'){collectCoin(e);burst(sx(e.x),sy(e.y)-30,8);float(sx(e.x),sy(e.y)-85,'+'+e.value,'gainLabel');tone(1150,.08);}
 if(event==='hurt'){shake=9;tone(130,.2);float(playerX,sy(game.y)-170,'気をつけて！','warningLabel');}
 if(event==='finish'){showNotice('特大福袋が登場！','福袋を開いています…','');burst(560,500,24);tone(900,.3);}
 if(event==='win'){burst(560,500,90);float(560,370,'福袋 +'+e.bonus);hideNotice();resultAt=time+1.1;}
 if(event==='lose'){resultAt=time+.6;}
});
function showNotice(title,body,sub){$('noticeTitle').textContent=title;$('noticeText').textContent=body;$('noticeSub').textContent=sub;$('notice').classList.remove('hidden');}function hideNotice(){$('notice').classList.add('hidden');}
function start(){if(Object.keys(images).length!==Object.keys(cfg.assets).length){toast(errors.length?'画像の読み込みに失敗しました。再読み込みしてください':'画像を読み込んでいます…');return;}game.start();$('device').classList.remove('ready');runTime=0;dust.length=0;lastDustStep=-1;paused=false;audio.setPaused(document.hidden);resultShown=false;resultAt=0;shake=0;particles.length=0;labels.length=0;hideNotice();$('result').classList.add('hidden');$('jump').setAttribute('aria-label','JUMP、ジャンプ・二段ジャンプ');$('pause').setAttribute('aria-label','一時停止');$('tip').textContent='タップでジャンプ、もう一度タップで二段ジャンプ';hud();}
function pause(force){if(!['running','bag'].includes(game.mode))return;paused=force??!paused;audio.setPaused(paused||document.hidden);if(paused){showNotice('ひとやすみ','JUMP で冒険を続けよう','');$('jump').setAttribute('aria-label','JUMP、ゲームを再開');}else{if(game.mode==='bag')showNotice('特大福袋が登場！','福袋を開いています…','');else hideNotice();$('jump').setAttribute('aria-label','JUMP、ジャンプ・二段ジャンプ');}$('pause').setAttribute('aria-label',paused?'ゲームを再開':'一時停止');}
function jump(){audio.unlock();if(paused){pause(false);return;}if(game.mode==='ready'||resultShown){start();return;}if(game.mode==='running')game.jump();}
// Keep flights in the fixed device coordinate system, independent of world scrolling
// and viewport scaling. Scores settle on arrival; the engine awards each coin once.
function collectCoin(e){
 if(reducedMotion){coinImpact=.3;return;}
 const a=cfg.assets.coin,bob=Math.sin(time*Math.PI*2/1.8)*5;
 coinFlights.push({x:sx(e.x),y:document.querySelector('.scene').offsetTop+sy(e.y)-a.height/2+bob,age:0,value:e.value});
}
function flightPoint(f,t,target){
 const u=1-t;
 return{x:u*u*u*f.x+3*u*u*t*(f.x+65)+3*u*t*t*(target.x-85)+t*t*t*target.x,
 y:u*u*u*f.y+3*u*u*t*(f.y-135)+3*u*t*t*(target.y+160)+t*t*t*target.y};
}
function drawCoinFlights(dt){
 const c=coinFlightCtx;c.clearRect(0,0,780,1644);c.imageSmoothingEnabled=false;
 const target={x:scoreCoin.offsetLeft+scoreCoin.offsetWidth/2,y:scoreCoin.offsetTop+scoreCoin.offsetHeight/2};
 if(!paused){
  coinImpact=Math.max(0,coinImpact-dt);
  for(let i=coinFlights.length-1;i>=0;i--){const f=coinFlights[i];f.age+=dt;if(f.age>=.72){coinFlights.splice(i,1);coinImpact=.3;}}
 }
 for(const f of coinFlights){
  const progress=Math.max(0,Math.min(1,(f.age-.08)/.64)),t=progress*progress,p=flightPoint(f,t,target);
  for(let j=4;j>=1;j--){const tail=flightPoint(f,Math.max(0,t-j*.035),target);c.globalAlpha=(1-j/5)*.55*progress;c.fillStyle=j%2?'#ffcc57':'#fff5d6';c.fillRect(Math.round(tail.x-3),Math.round(tail.y-3),6,6);}
  c.globalAlpha=1;const pop=1+.14*Math.sin(Math.min(1,f.age/.16)*Math.PI),w=62*pop*(1-.42*t),h=70*pop*(1-.42*t);
  if(images.coin)c.drawImage(images.coin.img,Math.round(p.x-w/2),Math.round(p.y-h/2),Math.round(w),Math.round(h));
 }
 const pulse=coinImpact?Math.sin((1-coinImpact/.3)*Math.PI):0;
 scoreCoin.style.transform=`scale(${1+pulse*(reducedMotion?.07:.22)})`;
 $('scoreLive').style.transform=`scale(${1+pulse*.06})`;
 if(coinImpact&&!reducedMotion){
  c.globalAlpha=coinImpact/.3;c.fillStyle='#fff2ac';const radius=28+(1-coinImpact/.3)*22;
  for(let i=0;i<6;i++){const angle=i*Math.PI/3,x=Math.round(target.x+Math.cos(angle)*radius),y=Math.round(target.y+Math.sin(angle)*radius);c.fillRect(x-5,y-2,10,4);c.fillRect(x-2,y-5,4,10);}
 }
 c.globalAlpha=1;
}
function drawResultTotal(value){
 const text=String(value),target=$('totalDigits'),a=images.digits;
 target.width=text.length*160;target.height=208;
 const width=Math.min(text.length*72,400);target.style.width=width+'px';target.style.height=(width/text.length*1.3)+'px';
 const c=target.getContext('2d');c.imageSmoothingEnabled=false;if(!a)return;
 const cell=a.img.naturalWidth/10;
 [...text].forEach((digit,i)=>c.drawImage(a.img,Number(digit)*cell,0,cell,a.img.naturalHeight,i*160,0,160,208));
}
function displayResult(){resultShown=true;const won=game.mode==='won',total=game.coins+game.bonus;best=Math.max(best,total);try{localStorage.setItem('ninja-neko-dodge-best',String(best));}catch{}hideNotice();$('result').classList.remove('hidden');$('resultTitleText').textContent=won?'福がいっぱい！':'もう一度挑戦！';const titleAsset=cfg.assets[won?'resultWin':'resultLose'];$('resultTitleArt').src=assetUrl(titleAsset.src,titleAsset);$('resultTag').textContent=won?'福袋オープン！':'小さな忍者の大冒険';$('total').textContent=total;drawResultTotal(total);$('runCoins').textContent=game.coins;$('bonus').textContent=game.bonus;$('dodged').textContent=game.dodged;$('footerBest').textContent=best;$('resultTip').textContent='JUMP でもう一度！';$('tip').textContent=won?'福袋に幸運がいっぱい！もう一度冒険しよう！':'障害物を飛び越えて、もっと遠くへ！';$('jump').setAttribute('aria-label','JUMP、もう一度プレイ');}
$('jump').addEventListener('pointerdown',e=>{if(e.button!==0)return;e.preventDefault();$('jump').querySelector('img').src=cfg.assets.jumpButtonPressed.src;jump();});
const release=()=>{$('jump').querySelector('img').src=cfg.assets.jumpButton.src;};addEventListener('pointerup',release);addEventListener('pointercancel',release);$('jump').addEventListener('click',e=>{if(e.detail===0)jump();});
$('pause').onclick=()=>{audio.unlock();pause();};$('sound').onclick=()=>{sound=!sound;audio.setEnabled(sound);$('sound').querySelector('img').src=cfg.assets[sound?'soundOn':'soundOff'].src;$('sound').setAttribute('aria-pressed',String(sound));$('sound').setAttribute('aria-label',sound?'音楽と効果音をオフ':'音楽と効果音をオン');tone(750);};
addEventListener('keydown',e=>{if(['Space','ArrowUp','KeyW'].includes(e.code)){e.preventDefault();if(!e.repeat)jump();}else if(['KeyP','Escape'].includes(e.code)){e.preventDefault();if(!e.repeat)pause();}});
addEventListener('blur',()=>pause(true));document.addEventListener('visibilitychange',()=>{if(document.hidden)pause(true);audio.setPaused(paused||document.hidden);});
function hud(){
 const score=String(game.coins-coinFlights.reduce((total,f)=>total+f.value,0)).padStart(4,'0');$('coins').textContent=score;const scoreCtx=$('scoreDigits').getContext('2d');scoreCtx.imageSmoothingEnabled=false;scoreCtx.clearRect(0,0,640,208);if(images.digits){const strip=images.digits.img,cell=strip.naturalWidth/10;for(let i=0;i<4;i++)scoreCtx.drawImage(strip,Number(score[i])*cell,0,cell,strip.naturalHeight,i*160,0,160,208);}
 $('health').setAttribute('aria-label','ライフ '+game.hearts);
 $('health').querySelectorAll('.hearts img').forEach((el,i)=>{el.style.filter=i<game.hearts?'none':'brightness(.2) saturate(.4)';});
 $('distance').textContent=Math.floor(game.distance/10)+' / '+cfg.level.length/10+' m';
 $('progress').style.width=game.distance/cfg.level.length*100+'%';
}
function img(key,x,y,w,h){const a=images[key];if(a)ctx.drawImage(a.img,Math.round(x),Math.round(y),w,h);}
function sprite(key,x,y,w,h,frame=0){const a=images[key]||images.run;if(!a)return;const source=a.frameImages?a.frameImages[frame]:a.img;const fw=a.frameImages?source.width:a.frameWidth||source.width,fh=a.frameImages?source.height:a.frameHeight||source.height;ctx.drawImage(source,a.frameImages?0:frame*fw,0,fw,fh,Math.round(x-w/2),Math.round(y-h),w,h);}
function floatingCoin(x,y,seed=0){
 const a=images.coin;if(!a)return;
 const bob=reducedMotion?0:Math.sin(time*Math.PI*2/1.8+seed*.4)*5;
 ctx.drawImage(a.img,Math.round(x-a.width/2),Math.round(y-a.height+bob),a.width,a.height);
}
function standingCat(x,y,w,h,frame){
 const a=images.idle;if(!a)return;const source=a.frameImages[frame];
 const breath=reducedMotion?0:Math.sin(time*2.1)*1.2;
 ctx.save();ctx.translate(Math.round(x-w/2),y-h-breath);ctx.scale(w/source.width,(h+breath)/source.height);
 // Animate only the free headband tips, keeping the knot and planted feet anchored.
 if(!reducedMotion){
  ctx.save();ctx.beginPath();ctx.rect(0,0,source.width,source.height);ctx.rect(0,110,285,220);ctx.clip('evenodd');ctx.drawImage(source,0,0);ctx.restore();
  for(let left=0;left<285;left+=5){const width=Math.min(5,285-left),sway=Math.round(Math.sin(time*2.4+left/100)*8*(1-left/285));ctx.drawImage(source,left,110,width,220,left,110+sway,width,220);}
 }else ctx.drawImage(source,0,0);
 ctx.restore();
}
function updateDust(dt){
 if(reducedMotion){dust.length=0;lastDustStep=-1;return;}
 if(paused)return;
 for(let i=dust.length-1;i>=0;i--){const p=dust[i];p.age+=dt;p.x-=p.speed*dt;p.y-=18*dt;if(p.age>=p.life)dust.splice(i,1);}
 if(game.mode!=='running'||game.jumps!==0){lastDustStep=-1;return;}
 const step=Math.floor(runTime/.15);
 if(step===lastDustStep)return;
 lastDustStep=step;
 dust.push({x:playerX-68,y:sy(game.y)+2,age:0,life:.8+(step%2)*.08,speed:game.speedAt()*scale*.32,variant:step%2});
}
const dustPixels=['001110000','012221110','123332221','123333321','012222210','001111100'];
function drawDust(){
 ctx.save();
 for(const p of dust){
  const progress=p.age/p.life,size=4+Math.floor(progress*2),x=Math.round(p.x-size*4.5),y=Math.round(p.y-size*6);
  ctx.globalAlpha=.95*(1-progress);
  const colors=['','#a6b7ce','#e6edf3','#fff6e7'];
  for(let row=0;row<6;row++)for(let col=0;col<9;col++){
   const ink=dustPixels[row][p.variant?8-col:col];if(ink==='0')continue;
   ctx.fillStyle=colors[ink];ctx.fillRect(x+col*size,y+row*size,size,size);
  }
  if(progress>.25){ctx.fillStyle='#d6dce3';ctx.fillRect(x-8,y+size*4,3,3);ctx.fillRect(x-3,y+size,4,4);}
 }
 ctx.restore();
}
function draw(dt){if(!paused){time+=dt;game.update(dt);if(game.mode==='running'&&game.jumps===0&&!reducedMotion)runTime+=dt;for(let i=particles.length-1;i>=0;i--){const p=particles[i];p.life-=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=430*dt;if(p.life<=0)particles.splice(i,1);}for(let i=labels.length-1;i>=0;i--){labels[i].life-=dt;labels[i].y-=dt*60;if(labels[i].life<=0)labels.splice(i,1);}shake=Math.max(0,shake-dt*35);if(toastRemaining>0){toastRemaining-=dt;if(toastRemaining<=0)$('toast').classList.remove('show');}}
 updateDust(dt);
 ctx.clearRect(0,0,780,799);
 ctx.save();ctx.translate(reducedMotion?0:(Math.random()-.5)*shake,reducedMotion?0:(Math.random()-.5)*shake);
 const d=game.distance;
 const sceneDistance=reducedMotion?0:d*scale;
 NekoMotion.drawSky(skyCtx,images,sceneDistance,cfg.parallax);
 NekoMotion.drawSakura(sakuraCtx,time,cfg.sakura,reducedMotion);
 NekoMotion.drawGround(groundCtx,images,sceneDistance,cfg.parallax);
 layerOffsets=NekoMotion.drawScene(sceneCtx,images,sceneDistance,cfg.parallax);ctx.drawImage(sceneBuffer,0,0);
 const final=['bag','won'].includes(game.mode),cx=final?310:playerX,cy=sy(game.y);
 if(game.mode==='ready'){floatingCoin(280,635);floatingCoin(408,635);}
 else for(const e of game.entities){if(e.hit||sx(e.x)<-120||sx(e.x)>900)continue;const a=cfg.assets[e.type];if(e.type==='coin')floatingCoin(sx(e.x),sy(e.y));else if(e.type==='daruma'){ctx.save();ctx.translate(Math.round(sx(e.x)),Math.round(sy(game.entityY(e))));ctx.rotate(reducedMotion?0:Math.sin(time*4+e.id)*.035);sprite(e.type,0,0,a.width,a.height);ctx.restore();}else sprite(e.type,sx(e.x),sy(game.entityY(e)),a.width,a.height);}
 // The header displays the upper petals; composite the rest directly below the cat.
 ctx.drawImage(sakuraCanvas,0,455,780,639,0,0,780,639);
 drawDust();
 ctx.save();if(game.invulnerable>0&&Math.floor(time*14)%2===0)ctx.globalAlpha=.35;
 const key=game.jumps?'jump':game.mode==='running'?'run':'idle',a=cfg.assets[key];
 renderedPose=key;renderedFrame=key==='run'?NekoMotion.frameAt(runTime,a.fps,a.frames):key==='idle'&&game.mode==='ready'&&!reducedMotion&&time%4.8>4.55?1:0;
 if(key==='idle'&&game.mode==='ready')standingCat(cx,cy,a.width,a.height,renderedFrame);
 else sprite(key,cx,cy,a.width,a.height,renderedFrame);ctx.restore();
 if(final&&game.mode!=='won')sprite('bag',565+(reducedMotion?0:Math.sin(time*6)*3),653,260,300);
 for(const p of particles){ctx.globalAlpha=Math.min(1,p.life*2);ctx.fillStyle=p.c;ctx.fillRect(p.x,p.y,7,7);}ctx.globalAlpha=1;
 for(const l of labels){
  ctx.globalAlpha=Math.min(1,l.life*3);
  const a=l.asset&&images[l.asset];
  if(a){const age=1.2-l.life,pop=reducedMotion?1:1+.12*Math.sin(Math.min(1,age/.18)*Math.PI),w=Math.round(a.width*pop),h=Math.round(a.height*pop);ctx.drawImage(a.img,Math.round(Math.max(8,Math.min(772-w,l.x-w/2))),Math.round(l.y-h/2),w,h);}
  else{ctx.font='900 34px monospace';ctx.textAlign='center';ctx.lineJoin='miter';ctx.strokeStyle='#ffffff';ctx.lineWidth=12;ctx.strokeText(l.text,l.x,l.y);ctx.strokeStyle='#15212c';ctx.lineWidth=8;ctx.strokeText(l.text,l.x,l.y);ctx.fillStyle='#fffdf2';ctx.fillText(l.text,l.x,l.y);}
 }ctx.globalAlpha=1;ctx.restore();if(resultAt&&time>=resultAt){resultAt=0;coinFlights.length=0;coinImpact=0;displayResult();}drawCoinFlights(dt);hud();}
function frame(now){const dt=last?Math.min(.0334,(now-last)/1000):.016;last=now;draw(dt);requestAnimationFrame(frame);}requestAnimationFrame(frame);
window.nekoSnapshot=()=>({mode:game.mode,distance:game.distance,speed:game.speedAt(),coins:game.coins,hearts:game.hearts,jumps:game.jumps,y:game.y,paused,bonus:game.bonus,dodged:game.dodged,resultShown,design:{...cfg.design},assetErrors:[...errors],loadedAssets:Object.keys(images).length,audio:audio.snapshot(),motion:{dust:dust.map(p=>({x:p.x,y:p.y,age:p.age})),pose:renderedPose,frame:renderedFrame,runTime,layerOffsets:{...layerOffsets}}});
})();
