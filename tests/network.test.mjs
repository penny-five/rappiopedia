import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { shortestPath } from '../src/lib/graph.js';
import { hierarchyGroups } from '../src/lib/hierarchy.js';
import { relationVerb, relationHeading } from '../src/lib/relations.js';
const relationTypes=JSON.parse(readFileSync(new URL('../src/data/relation-types.json',import.meta.url),'utf8'));
const data=JSON.parse(readFileSync(new URL('../src/data/network.json',import.meta.url),'utf8'));
const nodes=new Map(data.nodes.map(n=>[n.id,n]));
const levels=new Set(['verified','reported','observed','lead']);
test('solmut yksilöllisiä ja 3D-koordinaatit olemassa',()=>{
 assert.equal(nodes.size,data.nodes.length);
 for(const n of data.nodes){assert.ok(n.id&&n.name&&n.group&&n.cat,n.id);assert.ok(Array.isArray(n.pos3)&&n.pos3.length===3&&n.pos3.every(Number.isFinite),n.id)}
});
test('kaikissa yhteyksissä validit solmut, tyypit ja lähteet',()=>{
 for(const e of data.edges){
 assert.ok(nodes.has(e.a),e.a);assert.ok(nodes.has(e.b),e.b);assert.notEqual(e.a,e.b);
 assert.ok(levels.has(e.level),e.level);assert.ok(e.label);
 assert.ok(typeof e.type==='string'&&relationTypes[e.type],`Unknown relation type: ${e.type}`);
 assert.ok(!('verb' in e),`Legacy inline verb: ${e.a}-${e.b}`);
 assert.ok(Array.isArray(e.src)&&e.src.length>0,`Missing source: ${e.a}-${e.b}`);
 for(const id of e.src)assert.ok(data.sources[id]?.url,`Missing source: ${id}`);
 }
});
test('yhteyksien lisätiedot ovat yksilöllisiä eivätkä tutkimusmuistiinpanoja tai yleisvaraumia',()=>{
 const details=new Map();
 const filler=[
  /tallenteiden otsikkojen metadataa/i,
  /ei (?:yksin |itsessään |automaattisesti )?(?:osoita|todista|tarkoita|merkitse)/i,
  /ei päätelmää/i,
  /(?:tarkennettava|tarkistettava|ei saatu .*avattua|ei käyty läpi|ei (?:ole )?tarkistettu)/i,
  /(?:tapahtumakuvaus riittää|väitteiden olemassaolon)/i,
  /(?:ei väitettä sopimuksista|ei todistus laajemmasta yhteistyöstä)/i,
 ];
 for(const e of data.edges){
  if(!('detail' in e))continue;
  const relation=e.a+'–'+e.b;
  assert.equal(typeof e.detail,'string',relation+' detail must be a string');
  const detail=e.detail.trim();
  assert.ok(detail.length>=15,relation+' has an empty or unhelpful detail');
  assert.notEqual(detail,e.label.trim(),relation+' detail repeats the label');
  assert.ok(!details.has(detail),relation+' repeats the detail of '+details.get(detail));
  details.set(detail,relation);
  for(const pattern of filler)assert.doesNotMatch(detail,pattern,relation+' contains editorial filler');
 }
});

test('ylätason ryhmä viittaa olemassa oleviin kausiin ja solmuihin',()=>{
 const groups=new Set(data.nodes.map(n=>n.group));
 for(const h of hierarchyGroups){
  assert.ok(Array.isArray(h.groups)&&h.groups.length>0,h.id+' must have member groups');
  assert.equal(new Set(h.groups).size,h.groups.length,h.id+' has duplicate groups');
  for(const g of h.groups)assert.ok(groups.has(g),g);
  // Hubs are optional: the visual family now encloses all member groups.
  for(const id of h.hubs ?? [])assert.ok(nodes.has(id),id);
 }
});
test('lyhimmän reitin algoritmi kunnioittaa näyttösuodattimia',()=>{
 const r=shortestPath('pact','jethro',data.edges,levels);
 assert.equal(r.ns[0],'pact');assert.equal(r.ns.at(-1),'jethro');assert.equal(r.es.length,r.ns.length-1);
 assert.equal(shortestPath('pact','missing',data.edges,levels),null);
 assert.equal(shortestPath('pact','jethro',data.edges,new Set()),null);
});

test('suhdetyypit toimivat molempiin suuntiin',()=>{
 for(const [id,type] of Object.entries(relationTypes)){
  if(type.symmetric){
   assert.ok(typeof type.verb==='string'&&type.verb.trim(),id);
   assert.equal(type.forward,undefined,id);
   assert.equal(type.reverse,undefined,id);
   assert.ok(typeof type.heading==='string'&&type.heading.trim(),id);
  }else{
   assert.ok(typeof type.forward==='string'&&type.forward.trim(),id);
   assert.ok(typeof type.reverse==='string'&&type.reverse.trim(),id);
   assert.ok(typeof type.headingForward==='string'&&type.headingForward.trim(),id);
   assert.ok(typeof type.headingReverse==='string'&&type.headingReverse.trim(),id);
  }
 }
 for(const e of data.edges){
  const type=relationTypes[e.type];
  assert.equal(relationVerb(e,e.a,relationTypes),type.symmetric?type.verb:type.forward);
  assert.equal(relationVerb(e,e.b,relationTypes),type.symmetric?type.verb:type.reverse);
  assert.equal(relationHeading(e,e.a,relationTypes),type.symmetric?type.heading:type.headingForward);
  assert.equal(relationHeading(e,e.b,relationTypes),type.symmetric?type.heading:type.headingReverse);
 }
 const father=data.edges.find(e=>e.a==='jethro'&&e.b==='joachim');
 assert.equal(relationVerb(father,'jethro',relationTypes),'on isä');
 assert.equal(relationVerb(father,'joachim',relationTypes),'on poika');
 const shared=data.edges.find(e=>e.type==='striimasi-yhdessa');
 assert.ok(shared);
 assert.equal(relationVerb(shared,shared.a,relationTypes),relationVerb(shared,shared.b,relationTypes));
});

test('TV reality show connections record independent programme participation', () => {
 const expected = {
  big_brother: ['julwill', 'heiskari', 'ella', 'amanda'],
  temptation_island: ['elmer', 'tuuli', 'amanda']
 };
 for (const [show, people] of Object.entries(expected)) {
  assert.equal(nodes.get(show)?.cat, 'show');
  for (const person of people) {
   const edge = data.edges.find(e => e.a === person && e.b === show);
   assert.ok(edge, person + ' missing documented participation in ' + show);
   assert.ok(edge.src.length && edge.src.every(id => data.sources[id]?.url), person + ' missing TV source');
  }
 }
});
