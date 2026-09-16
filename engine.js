/* 与绘制独立的纯躲避玩法：所有非金币实体都是不可破坏的障碍。 */
(function(root){
'use strict';
class NekoEngine {
 constructor(config={},emit=()=>{}){this.cfg={length:10000,speed:210,gravity:1800,jumpVelocity:-660,maxHearts:3,bagOpenDelay:1.2,obstacleFloat:true,...config};this.emit=emit;this.reset();}
 reset(){this.mode='ready';this.distance=0;this.time=0;this.y=460;this.vy=0;this.jumps=0;this.hearts=this.cfg.maxHearts;this.coins=0;this.dodged=0;this.invulnerable=0;this.bagTime=0;this.bonus=0;this.entities=[];this.buildLevel();}
 buildLevel(){let seed=43;const rnd=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};let id=0;
 for(let x=530;x<this.cfg.length-400;){
  const progress=this.progressAt(x),index=id;
  const type=index===0?'daruma':index%3===2?'stone':rnd()<.25+.3*progress?'daruma':'crate';
  const heights=progress<.3?[438]:progress<.7?[438,432]:[438,432,426];
  this.entities.push({id:id++,type,x,y:type==='daruma'?heights[index%heights.length]:460,hit:false});
  // Gradually shorten the reaction window; preserve enough distance to land between jumps.
  x+=480-230*progress+rnd()*30;
 }
 const obstacles=[...this.entities];
 // Merge smooth arches into one continuous track, then sample by arc length.
 // This avoids separate low rows colliding with obstacle arches or each other.
 const routeY=x=>{
  let remaining=1;
  for(const obstacle of obstacles){const d=Math.abs(x-obstacle.x);if(d<176)remaining*=1-(1+Math.cos(Math.PI*d/176))/2;}
  return 425-104*(1-remaining);
 };
 // Short groups recur at roughly the original frequency, with real empty stretches.
 // Each group follows the same safe curve, but no continuous chain fills the level.
 let group=0;
 for(let start=600;start<this.cfg.length-600;start+=540){
  const count=[3,5,5][group%3];let previousX=start,previousY=routeY(start),carried=0,emitted=1;
  this.entities.push({id:id++,type:'coin',group,x:previousX,y:previousY,hit:false});
  for(let x=start+2;emitted<count&&x<this.cfg.length-260;x+=2){
   const y=routeY(x),segment=Math.hypot(x-previousX,y-previousY);
   if(carried+segment>=72){const t=(72-carried)/segment;this.entities.push({id:id++,type:'coin',group,x:previousX+(x-previousX)*t,y:previousY+(y-previousY)*t,hit:false});carried+=segment-72;emitted++;}
   else carried+=segment;
   previousX=x;previousY=y;
  }
  group++;
 }
 this.entities.sort((a,b)=>a.x-b.x);
 }
 progressAt(distance=this.distance){const t=Math.max(0,Math.min(1,distance/this.cfg.length));return t*t*(3-2*t);}
 speedAt(distance=this.distance){return this.cfg.speed*(1+.2*this.progressAt(distance));}
 entityY(e){return e.y+(e.type==='daruma'&&this.cfg.obstacleFloat?Math.sin(this.time*2.4+e.id*.9)*3:0);}
 start(){this.reset();this.mode='running';this.emit('start');}
 jump(){if(this.mode!=='running'||this.jumps>=2)return false;this.vy=this.cfg.jumpVelocity*(this.jumps===1?.88:1);this.jumps++;this.emit('jump',{y:this.y,double:this.jumps===2});return true;}
 damage(e){if(this.invulnerable>0)return;this.hearts--;this.invulnerable=1.5;this.emit('hurt',e);if(this.hearts<=0){this.mode='lost';this.emit('lose');}}
 update(dt){if(!['running','bag'].includes(this.mode))return;dt=Math.min(dt,.0334);this.time+=dt;this.invulnerable=Math.max(0,this.invulnerable-dt);
 if(this.mode==='bag'){this.bagTime+=dt;if(this.bagTime>=this.cfg.bagOpenDelay){this.bonus=150+Math.floor(this.coins*.5);this.mode='won';this.emit('win',{bonus:this.bonus});}return;}
 this.distance+=this.speedAt()*dt;this.vy+=this.cfg.gravity*dt;this.y+=this.vy*dt;if(this.y>=460){this.y=460;this.vy=0;this.jumps=0;}
 for(const e of this.entities){if(e.hit)continue;const dx=e.x-this.distance;if(dx>300)break;
 if(dx< -70){if(e.type!=='coin'&&!e.passed){e.passed=true;if(!e.collided)this.dodged++;}continue;}
 if(e.type==='coin'){if(Math.abs(dx)<31&&e.y>this.y-70&&e.y<this.y+15){e.hit=true;this.coins+=5;this.emit('coin',{...e,value:5});}continue;}
 // Hitboxes are inset from the 66 / 60 px sprites (world-to-screen scale: 1.5).
 const height=e.type==='daruma'?40:36,y=this.entityY(e);
 if(Math.abs(dx)<31&&this.y>y-height+7&&this.y-54<y-3){e.collided=true;this.damage(e);if(this.mode==='lost')return;}
 }
 if(this.distance>=this.cfg.length){this.distance=this.cfg.length;this.mode='bag';this.y=460;this.vy=0;this.bagTime=0;this.emit('finish');}
 }
}
root.NekoEngine=NekoEngine;if(typeof module!=='undefined')module.exports=NekoEngine;
})(typeof window!=='undefined'?window:globalThis);
