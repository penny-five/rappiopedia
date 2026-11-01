import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { bounds3D, boxesOverlap3D } from '../src/lib/scene.js';
import { hierarchyGroups, hierarchyBounds, sectorGroups, isHierarchyRoot, hierarchyRootForChild, hierarchyNavigationItems } from '../src/lib/hierarchy.js';

const { nodes } = JSON.parse(readFileSync(new URL('../src/data/network.json', import.meta.url), 'utf8'));
const skenes = JSON.parse(readFileSync(new URL('../src/data/skenes.json', import.meta.url), 'utf8'));
const groups = [...new Set(nodes.map(n => n.group))];
const groupNodes = group => nodes.filter(n => n.group === group);
const paddedBounds = group => bounds3D(groupNodes(group), skenes[group].padding ?? 100);
const familyBounds = Object.fromEntries(hierarchyGroups.map(family => [family.id, hierarchyBounds(nodes, family)]));
const skeneBoxes = Object.fromEntries(groups.map(group => [group, paddedBounds(group)]));

test('all authored nodes use registered skenes', () => {
 assert.deepEqual(groups.slice().sort(), Object.keys(skenes).sort());
 for (const [id, skene] of Object.entries(skenes)) {
  assert.ok(skene.label && /^#[0-9a-f]{6}$/i.test(skene.color), id + ' has valid metadata');
 }
});

test('hierarchy definitions are reusable and have disjoint group membership', () => {
 const used = new Set();
 for (const family of hierarchyGroups) {
  assert.ok(family.id && family.title && /^#[0-9a-f]{6}$/i.test(family.color));
  assert.ok(family.groups.length > 0);
  assert.ok(Number.isFinite(family.padding) && family.padding >= 100);
  if (family.rootGroup) {
   assert.ok(family.groups.includes(family.rootGroup), family.id + ' rootGroup missing');
   assert.deepEqual(sectorGroups(family.rootGroup), family.groups);
   assert.equal(isHierarchyRoot(family.rootGroup), true);
  }
  for (const group of family.groups) {
   assert.ok(groups.includes(group), family.id + ' has unknown group ' + group);
   assert.ok(!used.has(group), group + ' belongs to multiple parent volumes');
   used.add(group);
   if (family.rootGroup && group !== family.rootGroup) {
    assert.equal(hierarchyRootForChild(group), family.rootGroup);
   }
  }
 }
 assert.equal(isHierarchyRoot('pottu-streams'), false);
});

test('PACT and Rappiostriimaus share the same selectable nested sidebar hierarchy', () => {
 const items = hierarchyNavigationItems(skenes);
 const ids = items.map(item => item.id);
 const pactIndex = ids.indexOf('pact-universe');
 const rappioIndex = ids.indexOf('rappio');
 assert.deepEqual(ids.slice(pactIndex, pactIndex + 6), [
  'pact-universe', 'core', 'season1', 'season2', 'season3', 'talks'
 ]);
 assert.deepEqual(ids.slice(rappioIndex, rappioIndex + 2), ['rappio', 'pottu-streams']);
 assert.equal(items[pactIndex].label, 'PACT / OHJELMAPERHE');
 assert.equal(items[pactIndex].child, false);
 assert.equal(items[pactIndex + 1].label, 'PACT / ALUSTA');
 for (const item of items.slice(pactIndex + 1, pactIndex + 6)) {
  assert.equal(item.child, true, item.id + ' must be indented under PACT');
 }
 assert.equal(items[rappioIndex].child, false);
 assert.equal(items[rappioIndex + 1].child, true);
 assert.equal(ids.length, Object.keys(skenes).length + 1, 'one virtual parent only');
 assert.equal(new Set(ids).size, ids.length, 'no duplicated sidebar groups');

 const pact = hierarchyGroups.find(family => family.id === 'pact-universe');
 assert.deepEqual(sectorGroups('pact-universe'), pact.groups);
 assert.equal(sectorGroups('core').length, 1, 'core selector only focuses core');
 assert.equal(hierarchyRootForChild('core'), 'pact-universe');
 assert.equal(hierarchyRootForChild('season3'), 'pact-universe');
 assert.equal(hierarchyRootForChild('pottu-streams'), 'rappio');
 assert.equal(hierarchyRootForChild('rappio'), null);
 assert.equal(isHierarchyRoot('core'), false);
 assert.equal(isHierarchyRoot('rappio'), true);
 assert.equal(
  nodes.filter(node => sectorGroups('pact-universe').includes(node.group)).length,
  pact.groups.reduce((total, group) => total + groupNodes(group).length, 0),
  'the PACT parent must filter all five children'
 );
});

test('every hierarchy encloses its member nodes and complete padded child volumes', () => {
 for (const family of hierarchyGroups) {
  const bounds = familyBounds[family.id];
  assert.ok(bounds, family.id + ' has no members');
  for (const node of nodes.filter(n => family.groups.includes(n.group))) {
   node.pos3.forEach((value, axis) => {
    assert.ok(value > bounds.min[axis] && value < bounds.max[axis], node.id + ' outside ' + family.id);
   });
  }
  for (const group of family.groups.filter(g => !isHierarchyRoot(g))) {
   const child = skeneBoxes[group];
   for (let axis = 0; axis < 3; axis++) {
    assert.ok(child.min[axis] > bounds.min[axis], group + ' child volume extends beyond ' + family.id);
    assert.ok(child.max[axis] < bounds.max[axis], group + ' child volume extends beyond ' + family.id);
   }
  }
 }
 const pact = hierarchyGroups.find(family => family.id === 'pact-universe');
 assert.equal(pact.groups.length, 5);
});

test('no hierarchy parent intersects another parent or an unrelated sector', () => {
 for (let i = 0; i < hierarchyGroups.length; i++) {
  const parent = hierarchyGroups[i], bounds = familyBounds[parent.id];
  for (let j = i + 1; j < hierarchyGroups.length; j++) {
   const other = hierarchyGroups[j];
   assert.equal(boxesOverlap3D(bounds, familyBounds[other.id]), false, parent.id + ' intersects ' + other.id);
  }
  for (const group of groups.filter(group => !parent.groups.includes(group))) {
   assert.equal(boxesOverlap3D(bounds, skeneBoxes[group]), false, parent.id + ' intersects ' + group);
  }
 }
});

test('distinct child and standalone skene volumes do not intersect', () => {
 const visibleBoxes = groups.filter(group => !isHierarchyRoot(group));
 for (let i = 0; i < visibleBoxes.length; i++) {
  for (let j = i + 1; j < visibleBoxes.length; j++) {
   const a = visibleBoxes[i], b = visibleBoxes[j];
   assert.equal(boxesOverlap3D(skeneBoxes[a], skeneBoxes[b]), false, a + ' intersects ' + b);
  }
 }
});

test('nodes directly inside Rappiostriimaus do not sit inside its Pottukoira child', () => {
 const child = skeneBoxes['pottu-streams'];
 for (const node of groupNodes('rappio')) {
  const inside = node.pos3.every((value, axis) => value >= child.min[axis] && value <= child.max[axis]);
  assert.equal(inside, false, node.id + ' overlaps Pottukoira child volume');
 }
 const family = hierarchyGroups.find(h => h.id === 'rappio-universe');
 assert.deepEqual(family.groups, ['rappio', 'pottu-streams']);
 const normal = bounds3D(nodes.filter(n => family.groups.includes(n.group)), 100);
 const roomy = familyBounds[family.id];
 for (let axis = 0; axis < 3; axis++) {
  assert.equal(normal.min[axis] - roomy.min[axis], 60);
  assert.equal(roomy.max[axis] - normal.max[axis], 60);
 }
});

test('only Pottukoira-centered material moves to the new child', () => {
 const byId = Object.fromEntries(nodes.map(node => [node.id, node]));
 for (const id of ['pottu', 'spurgu', 'pottu_marketing', 'viro_pottu_2025', 'rauno77']) {
  assert.equal(byId[id]?.group, 'pottu-streams', id);
 }
 for (const id of ['upi', 'pirkkis', 'iippa', 'testotimo', 'testotimo_sub', 'taiga', 'iidasofya', 'megis']) {
  assert.equal(byId[id]?.group, 'rappio', id);
 }
 for (const id of ['s1', 's2', 's3', 'talks']) {
  assert.ok(hierarchyGroups.find(f => f.id === 'pact-universe').groups.includes(byId[id]?.group), id);
 }
});

test('Old School Tubetus separates classic video creators without dropping their relationships', () => {
 const byId = Object.fromEntries(nodes.map(node => [node.id, node]));
 assert.equal(skenes['old-school-tubetus'].label, 'OLD SCHOOL TUBETUS');
 for (const id of ['niilo22', 'iltapalamies', 'markoboy87', 'pasi']) {
  assert.equal(byId[id]?.group, 'old-school-tubetus', id + ' primary skene');
 }
 assert.equal(byId.megis?.group, 'rappio');
 const oldSchool = paddedBounds('old-school-tubetus');
 for (const group of groups.filter(g => g !== 'old-school-tubetus' && !isHierarchyRoot(g))) {
  assert.equal(boxesOverlap3D(oldSchool, skeneBoxes[group]), false, 'Old School Tubetus intersects ' + group);
 }
});

function boundingBoxGap(a, b) {
 return Math.hypot(...a.min.map((_, axis) =>
  Math.max(0, a.min[axis] - b.max[axis], b.min[axis] - a.max[axis])
 ));
}

test('related skenes remain close enough to read as connected districts', () => {
 const familyOrScene = key => {
  if (key === 'PACT') return familyBounds['pact-universe'];
  if (key === 'RAPPIO') return familyBounds['rappio-universe'];
  return skeneBoxes[key];
 };
 // These are broad adjacency constraints, not exact authored coordinates.
 // All volumes still have to pass the non-intersection tests above.
 for (const [left, right, maxGap] of [
  ['PACT', 'poker', 650],
  ['PACT', 'reality', 650],
  ['PACT', 'media', 550],
  ['RAPPIO', 'documents', 350],
  ['RAPPIO', 'kasinokurki', 850],
  ['documents', 'old-school-tubetus', 350],
  ['documents', 'events', 1000],
  ['rap', 'monarch', 700],
  ['rap', 'media', 1000],
  ['monarch', 'combat', 700]
 ]) {
  const gap = boundingBoxGap(familyOrScene(left), familyOrScene(right));
  assert.ok(gap <= maxGap, left + ' / ' + right + ' drifted apart: ' + Math.round(gap));
 }
});

test('bounding boxes include all coordinates even when an extra node is added', () => {
 const box = bounds3D([{ pos3: [0, 1, 2] }, { pos3: [500, -20, 800] }], 50);
 assert.deepEqual(box, { min: [-50, -70, -48], max: [550, 51, 850] });
 assert.equal(boxesOverlap3D({ min: [0, 0, 0], max: [1, 1, 1] }, { min: [1, 1, 1], max: [2, 2, 2] }), false);
});

test('approved scene placements reflect people’s own productions, not single appearances', () => {
 const byId = Object.fromEntries(nodes.map(n => [n.id, n]));
 for (const id of ['julwill', 'chiara', 'lassi', 'tegel']) assert.equal(byId[id].group, 'rappio', id);
 for (const id of ['jethro', 'joachim']) assert.equal(byId[id].group, 'talks', id);
 assert.equal(byId.sahamies.group, 'poker');
 for (const id of ['big_brother', 'temptation_island']) assert.equal(byId[id].group, 'television', id);
 assert.equal(skenes.television.label, 'TV-OHJELMAT / REALITY');
});

test('PACT and Rappiostriimaus parent volumes both use subtle tinted fills', () => {
 for(const id of ['pact-universe','rappio-universe']){
  const family=hierarchyGroups.find(item=>item.id===id);
  assert.ok(family,'missing family '+id);
  assert.ok(family.fillOpacity>0&&family.fillOpacity<.05,id+' should have a subtle fill');
 }
 const main=readFileSync(new URL('../src/main.js',import.meta.url),'utf8');
 assert.match(main,/if\(family\.fillOpacity\)drawTintedVolume\(c,bounds,family\.color,family\.fillOpacity\)/);
});
