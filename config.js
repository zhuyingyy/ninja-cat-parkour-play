/* 固定 780 × 1644；独立素材为 4× 透明 PNG，显示尺寸保持不变。 */
window.NEKO_CONFIG = {
 title:'忍猫夜游记', design:{width:780,height:1644},
 level:{length:10000,speed:210,gravity:1800,jumpVelocity:-660,maxHearts:3,bagOpenDelay:1.2},
 parallax:{tileWidth:1560,skySpeed:.055,farSpeed:.22,nearSpeed:.62},
 sakura:{enabled:true,count:28,speed:1.25},
 audio:{bgmVolume:.35,sfxVolume:.8},
 assets:{
  background:{src:'assets/backgrounds/background.png'},ground:{src:'assets/backgrounds/ground.png'},
  logo:{src:'assets/png/logo.png',version:'ja-logo-1'},subtitle:{src:'assets/png/subtitle.png'},portrait:{src:'assets/png/portrait.png'},
  shrine:{src:'assets/png/shrine.png'},points:{src:'assets/png/points.png'},
  idle:{src:'assets/png/cat-idle.png',sources:['assets/png/cat-idle.png','assets/png/cat-idle-blink.png'],frames:2,width:232,height:166},
  run:{src:'assets/motion/cat-run-sheet.png',sources:[
   'assets/motion/cat-run-01.png','assets/motion/cat-run-02.png','assets/motion/cat-run-03.png',
   'assets/motion/cat-run-04.png','assets/motion/cat-run-05.png','assets/motion/cat-run-06.png'
  ],frameWidth:464,frameHeight:332,frames:6,fps:10,width:232,height:166},
  sky:{src:'assets/motion/sky.png',version:'sky-refresh-3'},sceneryFar:{src:'assets/motion/scenery-far.png'},
  scenery:{src:'assets/motion/scenery.png'},groundLoop:{src:'assets/motion/ground-loop.png'},
  footerStatic:{src:'assets/motion/footer-static.png'},
  jump:{src:'assets/png/cat-jump.png',frames:1,fps:7,width:232,height:166},
  daruma:{src:'assets/png/daruma.png',version:'ground-obstacles-1',width:76,height:66},
  crate:{src:'assets/png/crate.png',width:82,height:60},
  stone:{src:'assets/png/stone.png',version:'ground-obstacles-1',width:80,height:60},coin:{src:'assets/png/coin.png',version:'p-float-3',width:62,height:70},
  bag:{src:'assets/png/bag.png',width:260,height:300},heart:{src:'assets/png/heart.png'},digits:{src:'assets/png/digits.png',version:'pixel-feedback-1'},resultWin:{src:'assets/png/result-win.png',version:'clear-result-2'},resultLose:{src:'assets/png/result-lose.png',version:'clear-result-2'},gainLabel:{src:'assets/png/coin-gain.png',width:100,height:65},warningLabel:{src:'assets/png/hurt-warning.png',width:235,height:65},
  pause:{src:'assets/png/pause.png'},soundOn:{src:'assets/png/sound-on.png'},soundOff:{src:'assets/png/sound-off.png'},
  jumpButton:{src:'assets/png/jump-button.png'},jumpButtonPressed:{src:'assets/png/jump-button-pressed.png'}
 }
};
