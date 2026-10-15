const fs=require('node:fs');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
let now=Date.now();
class Clock extends Date {static now(){return now;}}
const events=[];
class Audio {
  constructor(){this.currentTime=0;this.state='suspended';this.destination={};}
  createGain(){return {gain:{setValueAtTime(){},exponentialRampToValueAtTime(){}},connect(){},disconnect(){}};}
  createOscillator(){const event={};return {frequency:{setValueAtTime(f){event.frequency=f;},exponentialRampToValueAtTime(){event.sonar=true;}},connect(){},disconnect(){},start(){events.push(event);},stop(){}};}
  resume(){this.state='running';return Promise.resolve();}
}
const element=()=>({innerHTML:'',textContent:'',outerHTML:'',open:false,handlers:{},classList:{add(){},remove(){},toggle(){}},addEventListener(n,f){this.handlers[n]=f;},scrollIntoView(){},close(){}});
const elements=new Map(['#app','#dialog','#dialog-content','#toast','#timer','#timer-value','.brand','[data-action="sound"]'].map(s=>[s,element()]));
const storage=new Map();
const ctx=vm.createContext({Date:Clock,console,Math,JSON,Number,String,Array,Object,Error,Promise,
 document:{hidden:false,querySelector:s=>elements.get(s)||null,querySelectorAll:()=>[],addEventListener(){}},
 window:{AudioContext:Audio,scrollTo(){},addEventListener(){}},
 localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},
 setInterval(){},setTimeout(){},fetch:async p=>({ok:true,json:async()=>JSON.parse(fs.readFileSync(path.join(root,p)))})});
vm.runInContext(fs.readFileSync(path.join(root,'app.js'),'utf8'),ctx);
const run=s=>vm.runInContext(s,ctx);
async function main(){
 await new Promise(r=>setImmediate(r));await run('start(21,true)');
 assert.equal(run('audioContext.state'),'running');
 run('updateTimer()');assert.equal(events.length,2);assert.equal(events.filter(e=>e.sonar).length,0);
 const started=now;
 now=started+179000;run('updateTimer()');assert.equal(events.filter(e=>e.sonar).length,0);
 now=started+180000;run('updateTimer()');assert.equal(events.filter(e=>e.sonar).length,2);assert.equal(run('state.lastSonarBlock'),1);
 run('updateTimer()');assert.equal(events.filter(e=>e.sonar).length,2);
 now=started+360000;run('updateTimer()');assert.equal(events.filter(e=>e.sonar).length,4);
 run('review()');now+=1000;const beforeReview=events.length;run('updateTimer()');assert.equal(events.length,beforeReview+2);
 run('toggleSound()');const muted=events.length;now+=180000;run('updateTimer()');assert.equal(events.length,muted);assert.equal(storage.get('directori-timer-sound-v1'),'off');
 run('toggleSound()');const enabled=events.length;run('updateTimer()');assert.equal(events.length,enabled+2);assert.equal(events.filter(e=>e.sonar).length,4,'No backlog sonar when re-enabled');
 run('home()');const home=events.length;now+=1000;run('updateTimer()');assert.equal(events.length,home);
 await run('start(21)');run('finish()');const finished=events.length;now+=180000;run('updateTimer()');assert.equal(events.length,finished);
 await run('start(22,true)');run('updateTimer()');assert.equal(run('state.lastSonarBlock'),0);
 now+=3600000;const expired=events.length;run('updateTimer()');assert.equal(run('state.finished'),true);assert.equal(events.length,expired);
 console.log('OK: tic-tic, sonar la 180/360 secunde fără dublare, sunet în grilă, mute/unmute persistent, fără semnale la listă, finalizare sau expirare.');
}
main().catch(e=>{console.error(e);process.exitCode=1;});
