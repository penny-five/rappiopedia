import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { shortestPath } from '../src/lib/graph.js';
import { hierarchyGroups } from '../src/lib/hierarchy.js';
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
 assert.ok(typeof e.verb==='string'&&e.verb.trim(),`Missing verb: ${e.a} → ${e.b}`);
 assert.ok(Array.isArray(e.src)&&e.src.length>0,`Missing source: ${e.a}-${e.b}`);
 for(const id of e.src)assert.ok(data.sources[id]?.url,`Missing source: ${id}`);
 }
});
test('ylätason ryhmä viittaa olemassa oleviin kausiin ja solmuihin',()=>{
 const groups=new Set(data.nodes.map(n=>n.group));
 for(const h of hierarchyGroups){for(const g of h.groups)assert.ok(groups.has(g),g);for(const id of h.hubs)assert.ok(nodes.has(id),id)}
});
test('lyhimmän reitin algoritmi kunnioittaa näyttösuodattimia',()=>{
 const r=shortestPath('pact','jethro',data.edges,levels);
 assert.equal(r.ns[0],'pact');assert.equal(r.ns.at(-1),'jethro');assert.equal(r.es.length,r.ns.length-1);
 assert.equal(shortestPath('pact','missing',data.edges,levels),null);
 assert.equal(shortestPath('pact','jethro',data.edges,new Set()),null);
});

test('suunnatut suhdeverbit ovat datassa',()=>{
 assert.equal(data.edges.find(e=>e.a==='jethro'&&e.b==='talks')?.verb,'juontaa');
 assert.equal(data.edges.find(e=>e.a==='saini'&&e.b==='pact')?.verb,'perusti');
});
