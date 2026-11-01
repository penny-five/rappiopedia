import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {nodeFallbackMarkup} from '../src/lib/node-fallback.js';
import {searchSuggestionMarkup} from '../src/lib/search.js';

test('people keep initials in article and search placeholders',()=>{
 const person={cat:'person',name:'Julia Willman',id:'julia'};
 assert.equal(nodeFallbackMarkup(person,2),'JW');
 assert.equal(nodeFallbackMarkup(person,1),'J');
 assert.match(searchSuggestionMarkup(person,0,false,'Henkilö'),/search-avatar-fallback">J<\/span>/);
});

test('every non-person category uses its own inline SVG, not initials',()=>{
 const categories=["show","event","org","platform","channel","site","service","media","place","film","project","meme","concept"];
 const markup=categories.map(cat=>nodeFallbackMarkup({cat,name:'Esimerkki Tapahtuma'}));
 assert.equal(new Set(markup).size,categories.length);
 for(const icon of markup){
  assert.match(icon,/^<svg class="entity-fallback-icon"/);
  assert.match(icon,/viewBox="0 0 24 24"/);
  assert.match(icon,/aria-hidden="true"/);
  assert.doesNotMatch(icon,/Esimerkki|Tapahtuma/);
 }
 assert.match(nodeFallbackMarkup({cat:'unknown',name:'Uusi luokka'}),/^<svg/);
});

test('same SVG fallback appears in search with or without image, and in article infobox',()=>{
 const event={id:'event',cat:'event',name:'Pottukoiran subathon',image:'images/event.webp'};
 const html=searchSuggestionMarkup(event,0,true,'Tapahtuma');
 assert.match(html,/search-avatar-fallback"><svg class="entity-fallback-icon"/);
 assert.match(html,/class="search-avatar-image"/);
 assert.doesNotMatch(html,/search-avatar-fallback">P/);
 const wiki=readFileSync(new URL('../src/wiki.js',import.meta.url),'utf8');
 assert.match(wiki,/nodeFallbackMarkup\(node,2\)/);
 assert.match(wiki,/class="infobox-fallback/);
 assert.match(wiki,/img\.addEventListener\('error',\(\)=>img\.remove\(\)/);
 const css=readFileSync(new URL('../src/styles.css',import.meta.url),'utf8');
 assert.match(css,/\.infobox-fallback \.entity-fallback-icon/);
 assert.match(css,/\.search-avatar-fallback \.entity-fallback-icon/);
});
