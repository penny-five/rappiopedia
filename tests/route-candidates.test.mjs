import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { routeCandidateEntries, resolveRouteTarget } from '../src/lib/route-candidates.js';

test('connection targets are alphabetized, identifiable and empty by default',()=>{
 const nodes=[
  {id:'z',name:'Zorro',cat:'person'},
  {id:'a',name:'Anna',cat:'person'},
  {id:'e',name:'Elokuva',cat:'film'}
 ];
 const entries=routeCandidateEntries(nodes);
 assert.deepEqual(entries.map(item=>item.displayName),['Anna','Elokuva','Zorro']);
 assert.deepEqual(entries.map(item=>item.id),['a','e','z']);
 assert.deepEqual(nodes.map(item=>item.name),['Zorro','Anna','Elokuva'],'source ordering is not mutated');
 const lookup=new Map(entries.map(({displayName,id})=>[displayName.toLocaleLowerCase('fi'),id]));
 assert.equal(resolveRouteTarget(' ANNA ',lookup),'a');
 assert.equal(resolveRouteTarget('elokuva',lookup),'e');
 assert.equal(resolveRouteTarget('',lookup),null);
 assert.equal(resolveRouteTarget('no result',lookup),null);
});

test('identical names are disambiguated using stable node IDs',()=>{
 const entries=routeCandidateEntries([
  {id:'one',name:'Sama nimi',cat:'person'},
  {id:'two',name:'Sama nimi',cat:'event'},
  {id:'three',name:'Toinen nimi',cat:'person'}
 ]);
 assert.deepEqual(entries.map(item=>item.displayName),['Sama nimi (one)','Sama nimi (two)','Toinen nimi']);
 const lookup=new Map(entries.map(({displayName,id})=>[displayName.toLocaleLowerCase('fi'),id]));
 assert.equal(resolveRouteTarget('Sama nimi (two)',lookup),'two');
 assert.equal(resolveRouteTarget('Sama nimi',lookup),null);
});

test('the sidebar preserves SKENET while removing technical jargon elsewhere',()=>{
 const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
 for(const text of ['SKENET','KARTALLA NÄYTETTÄVÄT','NIMIEN NÄYTTÄMINEN','YHTEYKSIEN VARMUUS','ETSI YHTEYS','Selaa lähteitä','Palaa yleisnäkymään']){
  if(text==='Palaa yleisnäkymään')continue; // The action is rendered by main.js.
  assert.ok(html.includes(text),text);
 }
 assert.doesNotMatch(html,/>SOLMUTYYPIT<|>SOLMUJEN NIMET<|>NÄYTÖN TASO<|>YHTEYSPOLKU</);
 assert.match(html,/<input id="from" type="search" role="combobox"[^>]*aria-controls="fromSuggestions"/);
 assert.match(html,/<input id="to" type="search" role="combobox"[^>]*aria-controls="toSuggestions"/);
 assert.match(html,/<div id="fromSuggestions" class="search-suggestions" role="listbox"/);
 assert.match(html,/<div id="toSuggestions" class="search-suggestions" role="listbox"/);
 assert.doesNotMatch(html,/<datalist|list="routeCandidates"/);
 assert.match(html,/<label class="route-label" for="from">Ensimmäinen kohde<\/label>/);
 assert.match(html,/<label class="route-label" for="to">Toinen kohde<\/label>/);
 assert.match(html,/id="pathbtn">Näytä yhteys<\/button>/);
 assert.match(html,/id="toggleCategories" class="category-toggle">Näytä kaikki<\/button>/);
 assert.match(html,/data-level="lead"[^>]*>Avoimet \/ kiistetyt<\/button>/);
 assert.doesNotMatch(html,/<div class="evidence">/);
});

test('sector selection pans camera without opening any arbitrary article',()=>{
 const main=readFileSync(new URL('../src/main.js',import.meta.url),'utf8');
 const sectorBlock=main.slice(main.indexOf('function renderSectors()'),main.indexOf('function renderNameDensity()'));
 assert.match(sectorBlock,/Palaa yleisnäkymään/);
 assert.match(sectorBlock,/clearSelection\(\)/);
 assert.doesNotMatch(sectorBlock,/showDetails\(/);
 assert.match(main,/function fillPathCandidates\(\)/);
 assert.match(main,/routeCandidateEntries\(N\)/);
 assert.match(main,/resolveRouteTarget\(document\.getElementById\(field\)\.value,routeTargets\)/);
 assert.doesNotMatch(main,/document\.getElementById\('from'\)\.value='iippa'/);
 assert.match(main,/document\.getElementById\('categoryCount'\)\.textContent=`\$\{chosenCount\} kohdetta valittu`/);
});


test('both connection searches reuse navbar results, photos, ranking and keyboard selection',()=>{
 const main=readFileSync(new URL('../src/main.js',import.meta.url),'utf8');
 const css=readFileSync(new URL('../src/styles.css',import.meta.url),'utf8');
 assert.match(main,/setupRouteSearch\('from'\);setupRouteSearch\('to'\)/);
 assert.match(main,/matches=searchNodes\(routeSearchNodes,value\)/);
 assert.match(main,/searchSuggestionMarkup\(n,i,i===0,formatNodeTypes\(by\[n.id\],ENTITY_TYPES\),optionPrefix\)/);
 assert.match(main,/choose\(matches\[activeIndex\]\.id\)/);
 assert.match(main,/menu\.addEventListener\('error'/);
 assert.match(main,/input\.setAttribute\('aria-activedescendant',optionPrefix\+'-0'\)/);
 assert.match(main,/const option=e\.target\.closest\('\[data-search-id\]'\)/);
 assert.match(css,/\.route-search\{position:relative;display:flex/);
 assert.match(css,/\.route-search \.search-suggestions\{max-height:/);
 assert.match(css,/\.search-suggestion\{display:grid;grid-template-columns:38px minmax\(0,1fr\)/);
 assert.match(css,/\.search-avatar-image\{[^}]*object-fit:cover/);
 assert.match(css,/grid-template-columns:276px minmax\(0,1fr\) minmax\(365px/);
 assert.match(css,/grid-template-columns:245px minmax\(0,1fr\) minmax\(330px/);
 assert.match(css,/\.app\.article-collapsed\{grid-template-columns:276px/);
 assert.match(css,/\.app\.article-collapsed\{grid-template-columns:245px/);
});
