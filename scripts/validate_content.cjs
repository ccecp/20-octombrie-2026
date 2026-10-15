const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const expected = {lege:5, rofuip:5, bush:4, hattie:2, profil:2, curriculum:2};
const manifest = JSON.parse(fs.readFileSync(path.join(root,'tests/manifest.json')));
assert.equal(manifest.length,40);
const prompts = new Set();
for (const m of manifest) {
 const t = JSON.parse(fs.readFileSync(path.join(root,m.file)));
 assert.equal(t.questions.length,20); assert.equal(t.durationSeconds,3600);
 const counts={};
 for (const q of t.questions) {
  assert(!prompts.has(q.prompt),'Item repetat: '+q.id); prompts.add(q.prompt);
  counts[q.category]=(counts[q.category]||0)+1;
  assert.equal(q.options.length,4); assert.equal(new Set(q.options).size,4);
  assert(q.correct>=0&&q.correct<4);
  assert.deepEqual(q.options,[...q.options].sort((a,b)=>a.localeCompare(b,'ro',{sensitivity:'base'})),q.id);
  assert(q.options.every(o=>o.endsWith('.')&&!/^[a-dA-D][.)]/.test(o)),q.id);
  assert(q.source&&q.solution.steps.length>=3&&q.feedback.length===4,q.id);
  if(['lege','rofuip'].includes(q.category))assert(q.article&&q.source.includes('art. '+q.article)&&q.legalText,q.id);
 }
 assert.deepEqual(counts,expected);
}
assert.equal(prompts.size,800);
console.log('OK: 40 teste × 20 de itemi unici; distribuție 5+5+4+2+2+2; variante alfabetice în română; punctuație și surse prezente.');
