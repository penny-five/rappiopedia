import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { bounds3D, boxesOverlap3D } from '../src/lib/scene.js';
import { hierarchyGroups } from '../src/lib/hierarchy.js';

const { nodes } = JSON.parse(readFileSync(new URL('../src/data/network.json', import.meta.url), 'utf8'));
const skenes = JSON.parse(readFileSync(new URL('../src/data/skenes.json', import.meta.url), 'utf8'));
const groups = [...new Set(nodes.map(n => n.group))];
const groupNodes = group => nodes.filter(n => n.group === group);
const paddedBounds = group => bounds3D(groupNodes(group), skenes[group].padding ?? 100);
const pactGroups = hierarchyGroups.find(g => g.id === 'pact-universe').groups;
const family = bounds3D(nodes.filter(n => pactGroups.includes(n.group)), 145);

test('PACT parent volume contains all members, not merely the hubs', () => {
 for (const node of nodes.filter(n => pactGroups.includes(n.group))) {
  node.pos3.forEach((value, i) => {
   assert.ok(value > family.min[i] && value < family.max[i], node.id + ' outside family axis ' + i);
  });
 }
 assert.equal(pactGroups.length, 5);
});

test('no unrelated sector crosses the PACT parent volume', () => {
 for (const group of groups.filter(g => !pactGroups.includes(g))) {
  assert.equal(boxesOverlap3D(family, paddedBounds(group)), false, group + ' intersects PACT');
 }
});

test('3D sector volumes do not overlap, including expanded Rappiostriimaus', () => {
 const boxes = Object.fromEntries(groups.map(g => [g, paddedBounds(g)]));
 for (let i = 0; i < groups.length; i++) {
  for (let j = i + 1; j < groups.length; j++) {
   const a = groups[i], b = groups[j];
   assert.equal(boxesOverlap3D(boxes[a], boxes[b]), false, a + ' intersects ' + b);
  }
 }
});

test('bounding boxes include all coordinates even when an extra node is added', () => {
 const box = bounds3D([{ pos3: [0, 1, 2] }, { pos3: [500, -20, 800] }], 50);
 assert.deepEqual(box, { min: [-50, -70, -48], max: [550, 51, 850] });
 assert.equal(boxesOverlap3D({ min: [0, 0, 0], max: [1, 1, 1] }, { min: [1, 1, 1], max: [2, 2, 2] }), false);
});


test('every node uses a registered skene', () => {
 assert.deepEqual([...groups].sort(), Object.keys(skenes).sort());
 for (const [id, skene] of Object.entries(skenes)) {
  assert.ok(skene.label && /^#[0-9a-f]{6}$/i.test(skene.color), id + ' has valid metadata');
 }
});

test('Rappiostriimaus volume is roomier than the standard skene', () => {
 assert.equal(skenes.rappio.padding, 160);
 const normal = bounds3D(groupNodes('rappio'), 100);
 const roomy = paddedBounds('rappio');
 for (let axis = 0; axis < 3; axis++) {
  assert.equal(normal.min[axis] - roomy.min[axis], 60);
  assert.equal(roomy.max[axis] - normal.max[axis], 60);
 }
});

test('key subjects belong to their primary skenes', () => {
 const byId = Object.fromEntries(nodes.map(node => [node.id, node]));
 for (const [id, group] of Object.entries({
  pottu: 'rappio', iippa: 'rappio', testotimo: 'rappio',
  kasinok: 'kasinokurki', pullis: 'kasinokurki', sampe: 'kasinokurki', kp: 'kasinokurki',
  sami: 'documents', kieksidoc: 'documents', ruusu: 'reality', bamat: 'reality',
  aleksi: 'combat', ice: 'combat', ossi: 'monarch', duel: 'monarch'
 })) assert.equal(byId[id]?.group, group, id + ' skene');
});
