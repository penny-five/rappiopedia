import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { searchNodes, searchSuggestionMarkup } from '../src/lib/search.js';

const nodes = [
  { id: '1', name: 'PactTalks vieras' },
  { id: '2', name: 'The PACT House' },
  { id: '3', name: 'PACT' },
  { id: '4', name: 'PactHouse 01' },
  { id: '5', name: 'Muu tapahtuma' }
];

test('search suggestions rank exact and name-prefix results before contained matches', () => {
  assert.deepEqual(searchNodes(nodes, 'pact').map(n => n.id), ['3', '4', '1', '2']);
});

test('search suggestions are case-insensitive, trimmed and support Finnish names', () => {
  assert.deepEqual(searchNodes([{ id: 'x', name: 'Väinö' }], ' VÄI ').map(n => n.id), ['x']);
});

test('search matches small spelling mistakes without outranking literal name matches', () => {
 const people=[
  {id:'julia',name:'Julia Willman'},
  {id:'juulia',name:'Juulia'},
  {id:'megis',name:'Megarokkistara / Juulia Valikainen'},
  {id:'pasi',name:'Pasi Viheraho'}
 ];
 assert.deepEqual(searchNodes(people,'juulia').map(n=>n.id),['juulia','megis','julia']);
 assert.deepEqual(searchNodes(people,'julia').map(n=>n.id),['julia','juulia','megis']);
 assert.deepEqual(searchNodes(people,'juulia',2).map(n=>n.id),['juulia','megis']);
 assert.deepEqual(searchNodes(people,'juila').map(n=>n.id),['julia','juulia']);
 assert.deepEqual(searchNodes(people,'julia wilman').map(n=>n.id),['julia']);
});

test('fuzzy search avoids short-query noise and unrelated names', () => {
 const names=[{id:'talo',name:'Talo'},{id:'jalo',name:'Jalo'},{id:'julia',name:'Julia Willman'}];
 assert.deepEqual(searchNodes(names,'tal').map(n=>n.id),['talo']);
 assert.deepEqual(searchNodes(names,'xyz').map(n=>n.id),[]);
 assert.deepEqual(searchNodes(names,'juulia').map(n=>n.id),['julia']);
});

test('search suggestions are empty for blank or unmatched text and respect result limit', () => {
  assert.deepEqual(searchNodes(nodes, '   '), []);
  assert.deepEqual(searchNodes(nodes, 'xyz'), []);
  assert.equal(searchNodes(nodes, 'pact', 2).length, 2);
});

test('search results show images with complete names above long metadata', () => {
 const html=searchSuggestionMarkup({id:'julwill',name:'Julia Willman',image:'images/julwill.webp'},0,true,'Rappiostriimaaja · Somevaikuttaja · Tosi-tv-osallistuja');
 assert.match(html,/src="images\/julwill\.webp"/);
 assert.match(html,/<span class="search-copy"><span class="search-name">Julia Willman<\/span><span class="search-category">Rappiostriimaaja/);
 assert.match(html,/aria-selected="true"/);
 const css=readFileSync(new URL('../src/styles.css',import.meta.url),'utf8');
 assert.match(css,/\.search-suggestion\{display:grid;grid-template-columns:38px minmax\(0,1fr\)/);
 assert.match(css,/\.search-copy\{display:flex;flex-direction:column/);
 assert.match(css,/\.search-name\{[^}]*white-space:normal/);
 assert.match(css,/\.search-category\{[^}]*-webkit-line-clamp:2/);
 assert.match(css,/\.search-avatar-image\{[^}]*object-fit:cover/);
});
test('search thumbnails fall back to initials and search markup is safely escaped', () => {
 const noPic=searchSuggestionMarkup({id:'missing',name:'Nimetön'},1,false,'');
 assert.match(noPic,/search-avatar-fallback">N/);
 assert.ok(!noPic.includes('<img'));
 const unsafe=searchSuggestionMarkup({id:'id" danger',name:'<b> & "quote"',image:'images/a" onerror="bad'},2,false,'<type>');
 assert.match(unsafe,/&lt;b&gt; &amp; &quot;quote&quot;/);
 assert.match(unsafe,/images\/a&quot; onerror=&quot;bad/);
 assert.match(unsafe,/&lt;type&gt;/);
 const main=readFileSync(new URL('../src/main.js',import.meta.url),'utf8');
 assert.match(main,/searchSuggestionMarkup\(n,i,i===0,formatNodeTypes\(n,ENTITY_TYPES\)\)/);
 assert.match(main,/searchMenu\.addEventListener\('error'/);
});
