const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const code=fs.readFileSync(path.join(root,'print.js'),'utf8').replace(/initPaper\(\);\s*$/,'');
const env=vm.createContext({document:{},URLSearchParams,location:{search:''}});
vm.runInContext(code,env);
for(let id=1;id<=20;id++){
 const t=JSON.parse(fs.readFileSync(path.join(root,`tests/test-${String(id).padStart(2,'0')}.json`)));
 assert.equal(t.paperVersion.itemsPerPage.length,6);
 assert.equal(t.paperVersion.itemsPerPage.reduce((a,b)=>a+b,0),20);
 env.paperTest=t;
 const html=vm.runInContext('renderPaper(paperTest)',env);
 assert.equal((html.match(/class="paper-page"/g)||[]).length,7);
 assert.equal((html.match(/class="paper-item"/g)||[]).length,20);
 assert.equal((html.match(/class="square"/g)||[]).length,80);
 assert(html.lastIndexOf('GRILĂ DE RĂSPUNS')>html.lastIndexOf('data-item="20"'));
 assert(!/Răspuns corect|Cum rezolvăm|Concluzie: varianta/.test(html));
 const pages=html.split('<section class="paper-page"').slice(1);
 let offset=0;
 pages.slice(0,6).forEach((page,i)=>{
  assert.equal((page.match(/class="paper-item"/g)||[]).length,t.paperVersion.itemsPerPage[i]);
  t.questions.slice(offset,offset+t.paperVersion.itemsPerPage[i]).forEach(q=>{
   env.textToEscape=q.prompt;
   assert(page.includes(vm.runInContext('paperEsc(textToEscape)',env)));
   q.options.forEach(o=>{env.textToEscape=o;assert(page.includes(vm.runInContext('paperEsc(textToEscape)',env)));});
  });
  offset+=t.paperVersion.itemsPerPage[i];
 });
 assert.equal(offset,20);
}
console.log('OK: 20 variante pentru hârtie; 6 pagini de itemi + grila pe pagina 7; aceiași itemi și aceleași variante ca online; 80 de pătrățele goale; fără răspunsuri.');
