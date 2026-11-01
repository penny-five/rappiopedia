import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { NODE_CATEGORY_FILTERS, categoryFilterId, categoryEnabled, categoryCounts, edgeMatchesCategories } from '../src/lib/category-filter.js';
import { routeVisibility } from '../src/lib/scene.js';
const nodes=[{id:'p',cat:'person'},{id:'e',cat:'event'},{id:'s',cat:'show'},{id:'o',cat:'site'},{id:'new',cat:'unknown'}];
const by=Object.fromEntries(nodes.map(n=>[n.id,n]));

test('primary categories and miscellaneous category group all registered and future types',()=>{
 assert.deepEqual(NODE_CATEGORY_FILTERS.map(({id})=>id),['person','event','show','other']);
 assert.deepEqual(nodes.map(n=>categoryFilterId(n.cat)),['person','event','show','other','other']);
 assert.deepEqual(categoryCounts(nodes),{person:1,event:1,show:1,other:2});
});
test('category toggles combine independently and hiding all hides ordinary nodes',()=>{
 const enabled=new Set(['person','event']);
 assert.equal(categoryEnabled(by.p,enabled),true);
 assert.equal(categoryEnabled(by.e,enabled),true);
 assert.equal(categoryEnabled(by.s,enabled),false);
 assert.equal(categoryEnabled(by.o,enabled),false);
 assert.equal(categoryEnabled(by.new,new Set(['other'])),true);
 assert.ok(nodes.every(n=>!categoryEnabled(n,new Set())));
});
test('both relation endpoints must be enabled',()=>{
 const enabled=new Set(['person','event']);
 assert.equal(edgeMatchesCategories({a:'p',b:'e'},by,enabled),true);
 assert.equal(edgeMatchesCategories({a:'p',b:'s'},by,enabled),false);
 assert.equal(edgeMatchesCategories({a:'p',b:'missing'},by,enabled),false);
});
test('route view keeps path nodes and edges even when their category is disabled',()=>{
 const enabled=new Set(['person']),path=routeVisibility(['p','e'],[0]),normal=routeVisibility([],[]);
 const nodeShown=(view,node)=>view.showsNode(node.id)&&(view.active||categoryEnabled(node,enabled));
 const edgeShown=(view,edge,i)=>view.showsEdge(i)&&(view.active||edgeMatchesCategories(edge,by,enabled));
 assert.equal(nodeShown(normal,by.e),false);
 assert.equal(edgeShown(normal,{a:'p',b:'e'},0),false);
 assert.equal(nodeShown(path,by.e),true);
 assert.equal(nodeShown(path,by.s),false);
 assert.equal(edgeShown(path,{a:'p',b:'e'},0),true);
 assert.equal(edgeShown(path,{a:'p',b:'s'},1),false);
});
test('3D nodes, edges, relationship labels and search follow the category filter',()=>{
 const main=readFileSync(new URL('../src/main.js',import.meta.url),'utf8');
 const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
 const css=readFileSync(new URL('../src/styles.css',import.meta.url),'utf8');
 assert.match(main,/routeView\.showsNode\(n\.id\)&&\(routeView\.active\|\|categoryEnabled\(n,enabledCategories\)\)/);
 assert.match(main,/!routeView\.active&&!edgeMatchesCategories\(e,by,enabledCategories\)/);
 assert.match(main,/!pathNodes\.length&&!edgeMatchesCategories\(e,by,enabledCategories\)/);
 assert.match(main,/visiblePoints=nodes\.map\(nodeHitbox\)/);
 assert.match(main,/enabledCategories\.add\(categoryFilterId\(n\.cat\)\)/);
 assert.match(html,/id="categories"[^>]*role="group"/);
 assert.match(html,/id="toggleCategories"/);
 assert.match(html,/id="categoryCount"/);
 assert.match(css,/\.category-option input\{/);
});
test('actual category counts reflect the network',()=>{
 const data=JSON.parse(readFileSync(new URL('../src/data/network.json',import.meta.url),'utf8'));
 const totals=categoryCounts(data.nodes);
 assert.equal(Object.values(totals).reduce((sum,n)=>sum+n,0),data.nodes.length);
 for(const cat of ['person','event','show'])assert.equal(totals[cat],data.nodes.filter(n=>n.cat===cat).length);
});
