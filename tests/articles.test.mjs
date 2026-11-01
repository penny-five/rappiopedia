import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
const data=JSON.parse(readFileSync(new URL('../src/data/network.json',import.meta.url),'utf8'));
const nodeIds=new Set(data.nodes.map(n=>n.id));
const sourceIds=new Set(Object.keys(data.sources));
const dir=new URL('../src/articles/',import.meta.url);
const articles=readdirSync(dir).filter(f=>f.endsWith('.md'));
test('every authored article matches an existing node ID',()=>{
 assert.ok(articles.length>=6,'at least six editorial articles');
 for(const file of articles)assert.ok(nodeIds.has(file.slice(0,-3)),file+' has no corresponding node');
});
test('markdown wikilinks and source IDs resolve',()=>{
 for(const file of articles){
  const body=readFileSync(new URL(file,dir),'utf8');
  assert.ok(body.includes('## Yhteenveto'),file+' missing summary');
  for(const match of body.matchAll(/\[\[([a-z0-9_-]+)\|([^\]]+)\]\]/g))
    assert.ok(nodeIds.has(match[1]),file+' unknown linked node '+match[1]);
  for(const match of body.matchAll(/\[@([A-Za-z0-9_-]+)\]/g))
    assert.ok(sourceIds.has(match[1]),file+' unknown cited source '+match[1]);
  assert.ok(!/<\/?script|onerror\s*=/i.test(body),file+' unsafe markup');
 }
});
test('image paths are valid local assets or legacy source URLs',()=>{
 for(const n of data.nodes){
  if(n.image) assert.ok(/^(https:\/\/|\/images\/)[^\s]+$/.test(n.image),n.id+' invalid image path');
 }
});
