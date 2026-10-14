'use strict';
const PAPER_LETTERS=['a','b','c','d'];
const paperEsc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const PAPER_GROUPS=[3,3,4,3,4,3];
function paperHeader(t,page){return `<header class="paper-header"><div><strong>CONCURS DIRECTORI · PROBA a II-a</strong>Simulare de antrenament · Management și legislație școlară</div><div>Testul ${String(t.id).padStart(2,'0')}<br>Pagina ${page} din 7</div></header>`;}
function paperFooter(t,page){return `<footer class="paper-footer"><span>Prof. dr. Maria-Magdalena Dorcioman</span><span>Testul ${String(t.id).padStart(2,'0')} · ${page} / 7</span></footer>`;}
function paperItem(q,index){return `<article class="paper-item" data-item="${index+1}"><p class="item-prompt"><strong>${index+1}.</strong> ${paperEsc(q.prompt)}</p><ol class="paper-options">${q.options.map((o,i)=>`<li><b>${PAPER_LETTERS[i]}.</b><span>${paperEsc(o)}</span></li>`).join('')}</ol><p class="paper-source">Reper: ${paperEsc(q.source)}</p></article>`;}
function answerGrid(first,last){return `<table class="answer-grid"><thead><tr><th>Item</th>${PAPER_LETTERS.map(l=>`<th>${l}</th>`).join('')}</tr></thead><tbody>${Array.from({length:last-first+1},(_,i)=>`<tr><td>${first+i}</td>${PAPER_LETTERS.map(l=>`<td><span class="square" aria-label="Itemul ${first+i}, varianta ${l}"></span></td>`).join('')}</tr>`).join('')}</tbody></table>`;}
function renderPaper(t){
 let offset=0;
 const pages=(t.paperVersion?.itemsPerPage || PAPER_GROUPS).map((count,i)=>{
  const items=t.questions.slice(offset,offset+count).map((q,j)=>paperItem(q,offset+j)).join('');offset+=count;
  return `<section class="paper-page" aria-label="Pagina ${i+1}">${paperHeader(t,i+1)}${i===0?`<h1 class="test-title">TESTUL ${String(t.id).padStart(2,'0')} · ${paperEsc(t.title)}</h1><div class="instructions"><p><strong>Timp de lucru: 60 de minute. 20 de itemi. Un singur răspuns corect la fiecare item.</strong></p><p>Fiecare răspuns corect: 0,5 puncte. Nota maximă: 10. Prag de promovare în simulare: 7.</p><p>Rezolvați itemii de pe paginile 1–6 și colorați complet cu pixul pătrățelul corespunzător din grila de la pagina 7.</p></div>`:''}<div class="paper-items">${items}</div>${paperFooter(t,i+1)}</section>`;
 });
 pages.push(`<section class="paper-page" aria-label="Pagina 7: grila de răspuns">${paperHeader(t,7)}<h1 class="test-title">GRILĂ DE RĂSPUNS · TESTUL ${String(t.id).padStart(2,'0')}</h1><div class="identity">Nume și prenume: ....................................................................................<br>Cod candidat: ................................... Data: .............................................<br>Ora începerii: .................................... Ora finalizării: ................................</div><p class="grid-instructions">Pentru fiecare item, <strong>colorați integral cu pixul un singur pătrățel</strong>, corespunzător variantei a, b, c sau d. Pătrățelele rămase se lasă goale. Nu folosiți bifă, cerc sau „X”.</p><div class="grid-columns">${answerGrid(1,10)}${answerGrid(11,20)}</div><div class="grid-example"><span class="filled-square" aria-hidden="true"></span><span>Model de marcare: pătrățel colorat integral.</span></div><div class="paper-notes"><p>Verificați că numărul testului de pe această grilă corespunde testului rezolvat.</p><p>Itemii fără răspuns sau cu mai multe variante marcate primesc 0 puncte în această simulare.</p><p>Răspunsurile și explicațiile se consultă online după finalizarea testului.</p></div>${paperFooter(t,7)}</section>`);
 return pages.join('');
}
async function initPaper(){
 const id=Number(new URLSearchParams(location.search).get('test'));
 const paper=document.querySelector('#paper');
 if(!Number.isInteger(id)||id<1||id>20){paper.innerHTML='<p>Selectați un test din <a href="index.html">lista celor 20 de teste</a>.</p>';return;}
 try{
  const response=await fetch(`tests/test-${String(id).padStart(2,'0')}.json`);
  if(!response.ok)throw new Error('fetch');
  const t=await response.json();if(t.questions.length!==20)throw new Error('items');
  document.title=`Testul ${String(id).padStart(2,'0')} · 6 pagini + grilă · Proba a II-a`;
  paper.innerHTML=renderPaper(t);
  const button=document.querySelector('#print-button');button.disabled=false;button.onclick=()=>window.print();
 }catch{paper.innerHTML='<p role="alert">Testul nu a putut fi pregătit. Reîncărcați pagina sau reveniți la <a href="index.html">lista testelor</a>.</p>';}
}
initPaper();
