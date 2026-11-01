import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { bounds3D, boxesOverlap3D } from '../src/lib/scene.js';
import { hierarchyGroups } from '../src/lib/hierarchy.js';

const { nodes } = JSON.parse(readFileSync(new URL('../src/data/network.json', import.meta.url), 'utf8'));
const groups = [...new Set(nodes.map(n => n.group))];
const groupNodes = group => nodes.filter(n => n.group === group);
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
  assert.equal(boxesOverlap3D(family, bounds3D(groupNodes(group), 100)), false, group + ' intersects PACT');
 }
});

test('3D sector volumes do not overlap, including Events and Sliki/Ketola', () => {
 const boxes = Object.fromEntries(groups.map(g => [g, bounds3D(groupNodes(g), 100)]));
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
