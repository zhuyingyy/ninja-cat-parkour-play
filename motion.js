(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.NekoMotion=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
function frameAt(seconds,fps=10,count=6){return Math.floor(Math.max(0,seconds)*fps)%count;}
function offset(distance,speed,width){return ((distance*speed)%width+width)%width;}
function tiles(distance,speed,width,viewport=780){const out=[];for(let x=-offset(distance,speed,width);x<viewport;x+=width)out.push(x);return out;}
function phases(distance,cfg){return {sky:offset(distance,cfg.skySpeed,cfg.tileWidth),far:offset(distance,cfg.farSpeed,cfg.tileWidth),near:offset(distance,cfg.nearSpeed,cfg.tileWidth),ground:offset(distance,1,cfg.tileWidth)};}
function drawSky(ctx,assets,distance,cfg){
 ctx.clearRect(0,0,780,1094);ctx.save();ctx.imageSmoothingEnabled=false;
 if(assets.sky)for(const x of tiles(distance,cfg.skySpeed,cfg.tileWidth))ctx.drawImage(assets.sky.img,Math.round(x),0,cfg.tileWidth,1094);
 ctx.restore();
}
// Pixel petals use one repeatable wind cycle across the header and gameplay layers.
const petalPixels=['011010','122210','122310','012310','001100'];
const petalColors=['','#d77b9f','#f6abc5','#ffe0eb'];
function drawSakura(ctx,seconds,cfg,reducedMotion=false){
 ctx.clearRect(0,0,780,1094);
 if(!cfg?.enabled||reducedMotion)return;
 ctx.save();ctx.imageSmoothingEnabled=false;
 const count=Math.min(80,Math.max(0,Math.floor(cfg.count??28))),t=seconds*(cfg.speed??1.25);
 for(let i=0;i<count;i++){
  const seed=i*2.39996,fall=18+(i*7%19),wind=12+(i*11%17);
  const x=offset(i*137.51-t*wind+Math.sin(t*.7+seed)*23,1,860)-40;
  const y=offset(i*81.73+t*fall,1,1174)-40;
  const size=i%3===0?4:3,flip=Math.sin(t*1.6+seed),thin=Math.abs(flip)<.3;
  ctx.globalAlpha=(.75+(i%4)*.07)*Math.min(1,Math.max(0,(1094-y)/60));
  for(let row=0;row<petalPixels.length;row++)for(let col=0;col<6;col++){
   const color=petalPixels[row][col];if(color==='0')continue;
   const px=flip<0?5-col:col;
   ctx.fillStyle=petalColors[color];
   ctx.fillRect(Math.round(x+px*(thin?2:size)+(row-2)*flip),Math.round(y)+row*size,thin?2:size,size);
  }
 }
 ctx.restore();
}
function drawGround(ctx,assets,distance,cfg){
 ctx.clearRect(0,0,780,466);ctx.save();ctx.imageSmoothingEnabled=false;
 if(assets.groundLoop)for(const x of tiles(distance,1,cfg.tileWidth))ctx.drawImage(assets.groundLoop.img,Math.round(x),0,cfg.tileWidth,466);
 ctx.restore();
}
function drawScene(ctx,assets,distance,cfg){
 ctx.clearRect(0,0,780,799);ctx.save();ctx.imageSmoothingEnabled=false;
 function strip(key,speed,y,h){const a=assets[key];if(!a)return;for(const x of tiles(distance,speed,cfg.tileWidth))ctx.drawImage(a.img,Math.round(x),y,cfg.tileWidth,h);}
 strip('sceneryFar',cfg.farSpeed,0,639);
 strip('scenery',cfg.nearSpeed,0,639);
 if(assets.shrine)for(const x of tiles(distance,cfg.nearSpeed,cfg.tileWidth))ctx.drawImage(assets.shrine.img,Math.round(x+350),217,430,428);
 ctx.restore();
 return phases(distance,cfg);
}
return {frameAt,offset,tiles,phases,drawSky,drawSakura,drawGround,drawScene};
});
