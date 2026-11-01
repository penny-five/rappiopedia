import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
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
  assert.ok(body.trim().length>40,file+' is empty or incomplete');
  for(const match of body.matchAll(/\[\[([a-z0-9_-]+)\|([^\]]+)\]\]/g))
    assert.ok(nodeIds.has(match[1]),file+' unknown linked node '+match[1]);
  for(const match of body.matchAll(/\[@([A-Za-z0-9_-]+)\]/g))
    assert.ok(sourceIds.has(match[1]),file+' unknown cited source '+match[1]);
  assert.ok(!/<\/?script|onerror\s*=/i.test(body),file+' unsafe markup');
 }
});
test('optimized image paths refer to present or regenerable WebP assets',()=>{
 for(const n of data.nodes){
  if(!n.image) continue;
  assert.equal(n.image,'images/'+n.id+'.webp',n.id+' requires local image path');
  const path=new URL('../public/'+n.image,import.meta.url);
  if(existsSync(path)){
   assert.ok(readFileSync(path).length>0,n.id+' local image is empty');
  }else{
   // WebPs may be generated from imageSource during the deployment workflow.
   assert.match(n.imageSource||'',/^https?:\/\//,n.id+' missing a source image URL');
   assert.ok(process.env.CI!=='true',n.id+' local image missing after CI image preparation');
  }
 }
});

test('articles begin with the subject, not a template heading or research note',()=>{
 for(const file of articles){
  const body=readFileSync(new URL(file,dir),'utf8').trim();
  assert.ok(!/^##\s+(?:Yhteenveto|Dokumentoidut yhteydet|Lähteen rajaus)\b/m.test(body),file+' contains generic template sections');
  assert.ok(!/^(?:Tässä artikkelissa|Tässä tutkimuksessa|Verkostossa).*$/im.test(body),file+' contains editorial process prose');
  assert.ok(!/##\s+(?:Tulkinnan rajat|Näytön rajat|Tutkimuksen rajaus|Lähderajaus)\b/i.test(body),file+' contains boilerplate caution heading');
  const opening=body.split(/\n\n|\n##\s/)[0];
  assert.ok(opening.length>=45,file+' has an inadequate introduction');
  assert.ok(!opening.startsWith('## '),file+' starts with a heading instead of an introduction');
 }
});
