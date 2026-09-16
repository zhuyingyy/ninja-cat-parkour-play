(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.NekoAudio=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const RATE=22050,BPM=164,STEP=60/BPM/2;
// Original 32-bar battle loop: D / Eb / G / A / Bb, plucked strings and taiko.
// Four eight-bar sections: establish the pulse, answer, higher climax, turnaround.
const PHRASES=[
 [74,74,75,81,79,75,74,0],[74,79,81,82,81,79,75,74],
 [70,74,75,79,75,74,70,0],[69,74,75,74,69,0,69,72],
 [74,75,79,81,79,75,74,75],[79,81,82,81,79,75,79,0],
 [82,81,79,75,74,75,79,75],[74,0,69,74,75,74,69,0],
 [79,0,81,82,81,79,75,79],[81,82,86,82,81,79,81,0],
 [82,81,79,75,79,81,79,75],[74,75,79,75,74,70,69,0],
 [79,81,82,86,82,81,79,81],[82,86,87,86,82,81,79,75],
 [81,79,75,74,75,79,75,69],[74,0,75,74,69,0,74,0]
];
const ROOTS=[38,38,34,33,38,43,34,33];
const frequency=midi=>440*Math.pow(2,(midi-69)/12);
function compose(sampleRate=RATE){
 const bars=32,samples=new Float32Array(Math.round(bars*8*STEP*sampleRate));let seed=9173;
 const noise=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/2147483648-1;};
 function add(begin,i,value){samples[(begin+i)%samples.length]+=value;}
 function note(midi,start,duration,volume,voice){
  const begin=Math.round(start*sampleRate),length=Math.floor(duration*sampleRate),hz=frequency(midi);
  for(let i=0;i<length;i++){
   const t=i/sampleRate,p=2*Math.PI*hz*t,attack=Math.min(1,t/.003),release=Math.min(1,(duration-t)/.026);let wave,envelope;
   if(voice==='pluck'){
    // A bright, dry string attack with quickly fading upper harmonics.
    wave=(Math.sin(p)+.52*Math.sin(2*p)*Math.exp(-t*16)+.3*Math.sin(3*p)*Math.exp(-t*22)+.15*Math.sin(5*p)*Math.exp(-t*28))*.63;
    wave+=noise()*.1*Math.exp(-t*160);envelope=Math.exp(-t*13);
   }else if(voice==='flute'){
    const vibrato=.012*Math.sin(2*Math.PI*5.5*t)*Math.min(1,t/.07);
    wave=(Math.sin(p+vibrato)+.22*Math.sin(2*p)+.08*Math.sin(3*p))*.76;envelope=Math.exp(-t*2.5);
   }else if(voice==='chip'){
    wave=(Math.sin(p)+Math.sin(3*p)/3+Math.sin(5*p)/5)/1.54;envelope=Math.exp(-t*9);
   }else{wave=2/Math.PI*Math.asin(Math.sin(p));envelope=Math.exp(-t*5);}
   add(begin,i,wave*volume*attack*release*envelope);
  }
 }
 function drum(start,kind,volume=1){
  const duration=kind==='taiko'?.31:kind==='tom'?.17:kind==='rim'?.055:.04,begin=Math.round(start*sampleRate);
  for(let i=0;i<duration*sampleRate;i++){
   const t=i/sampleRate,attack=Math.min(1,t/.002),release=Math.min(1,(duration-t)/.025),n=noise();let wave;
   if(kind==='taiko'){
    const phase=2*Math.PI*(58*t+65*.026*(1-Math.exp(-t/.026)));
    wave=(Math.sin(phase)*.28+Math.sin(phase*1.61)*.095+Math.sin(phase*2.3)*.035)*Math.exp(-t*16)+n*.08*Math.exp(-t*110);
   }else if(kind==='tom')wave=(Math.sin(2*Math.PI*(115*t+45*.018*(1-Math.exp(-t/.018))))*.17+n*.04*Math.exp(-t*60))*Math.exp(-t*24);
   else if(kind==='rim')wave=(Math.sin(2*Math.PI*1350*t)*.055+Math.sin(2*Math.PI*1820*t)*.03+n*.018)*Math.exp(-t*95);
   else wave=n*.024*Math.exp(-t*105);
   add(begin,i,wave*volume*attack*release);
  }
 }
 for(let b=0;b<bars;b++){
  const section=Math.floor(b/8),phrase=PHRASES[(section===0||section===2?0:8)+b%8],root=ROOTS[b%8];
  for(let s=0;s<8;s++){
   const at=(b*8+s)*STEP,midi=phrase[s],accent=s%2===0?1:.82;
   if(midi){note(midi,at,STEP*1.12,.23*accent,'pluck');if(section>0)note(midi+(section===2?12:0),at,STEP*.84,section===2?.095:.06,'flute');}
   if(s%2===0)note(root+(s===4?7:0),at,STEP*1.5,.14,'bass');
   if(s===0||s===4||s===7)drum(at,'taiko',s===7?.7:1);
   if(s===2||s===6)drum(at,'tom',.9);
   if(s%2===1)drum(at,'rim',.8);
   drum(at,'tick',s%2===0?.75:.5);
   // Quiet offbeat picked ostinato gives the run a continuous forward pulse.
   note(root+24+[0,7,12,7][s%4],at+STEP*.5,STEP*.45,.075,'pluck');
   if(section===2&&s%2===1)note(midi||74,at+STEP*.5,STEP*.4,.035,'chip');
  }
  if(b%4===3){const at=(b*8+6)*STEP;drum(at+STEP*.5,'rim');drum(at+STEP*1.5,'tom',.85);}
 }
 let peak=0;for(const value of samples)peak=Math.max(peak,Math.abs(value));
 const gain=peak>.68?.68/peak:1;for(let i=0;i<samples.length;i++)samples[i]*=gain;
 // All decays wrap into the beginning, so the continuous loop has no cut-off tails.
 return {samples,sampleRate,duration:samples.length/sampleRate,bpm:BPM,bars};
}
class Player{
 constructor(options={}){this.enabled=true;this.paused=false;this.context=null;this.source=null;this.starts=0;this.options=options;}
 unlock(){
  if(!this.enabled)return;
  try{
   if(!this.context){
    const C=globalThis.AudioContext||globalThis.webkitAudioContext;if(!C)return;
    this.context=new C();const c=this.context;
    this.master=c.createGain();this.master.gain.value=0;
    this.music=c.createGain();this.music.gain.value=this.options.bgmVolume??.35;
    this.effects=c.createGain();this.effects.gain.value=this.options.sfxVolume??.8;
    this.music.connect(this.master);this.effects.connect(this.master);this.master.connect(c.destination);
    const song=compose(),buffer=c.createBuffer(1,song.samples.length,song.sampleRate);buffer.copyToChannel(song.samples,0);
    this.source=c.createBufferSource();this.source.buffer=buffer;this.source.loop=true;this.source.connect(this.music);this.source.start();this.starts++;
   }
   // Resume inside the pointer/keyboard gesture, including after an OS audio interruption.
   const resumed=this.context.resume();if(resumed?.catch)resumed.catch(()=>{});this.sync();
  }catch{/* Audio must never interrupt gameplay on unsupported devices. */}
 }
 sync(){if(!this.master)return;const gain=this.master.gain,now=this.context.currentTime;gain.cancelScheduledValues(now);gain.setTargetAtTime(this.enabled&&!this.paused?1:0,now,.008);}
 setEnabled(enabled){this.enabled=enabled;if(enabled)this.unlock();this.sync();}
 setPaused(paused){this.paused=paused;this.sync();}
 tone(hz,duration=.12){
  if(!this.enabled||this.paused||!this.context)return;
  const c=this.context,o=c.createOscillator(),g=c.createGain(),now=c.currentTime;
  o.type='triangle';o.frequency.setValueAtTime(hz,now);o.frequency.exponentialRampToValueAtTime(hz*.65,now+duration);
  g.gain.setValueAtTime(.04,now);g.gain.exponentialRampToValueAtTime(.001,now+duration);
  o.connect(g);g.connect(this.effects);o.onended=()=>{o.disconnect();g.disconnect();};o.start();o.stop(now+duration);
 }
 snapshot(){return {track:'samurai-run',bpm:BPM,enabled:this.enabled,paused:this.paused,unlocked:!!this.context,state:this.context?.state||'locked',starts:this.starts,loop:this.source?.loop||false,loopSeconds:this.source?.buffer.duration||0,outputGain:this.master?.gain.value||0};}
}
return {Player,compose};
});
