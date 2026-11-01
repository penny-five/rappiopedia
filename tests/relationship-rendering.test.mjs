import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { connectionStrokeWidth, placeRelationshipLabels } from '../src/lib/scene.js';

test('selected relations widen continuously toward the opposite endpoint regardless of edge direction', () => {
  const forward = {a: 'active', b: 'neighbor'};
  const reverse = {a: 'neighbor', b: 'active'};
  for (const edge of [forward, reverse]) {
    const at = distance => connectionStrokeWidth(edge, 'active', edge.a === 'active' ? distance : 1 - distance, true);
    assert.equal(at(0), 1.1);
    assert.equal(at(1), 2.8);
    assert.ok(at(.25) > at(0) && at(.25) < at(.5));
    assert.ok(at(.5) < at(.75) && at(.75) < at(1));
  }
  assert.equal(connectionStrokeWidth(forward, 'active', .5, false), 1);
  assert.equal(connectionStrokeWidth(forward, 'other', .5, true), 2.2);
});

test('relationship verbs remain placed when camera projection makes an edge almost zero length', () => {
  const links = [
    {p: {x: 140, y: 120}, q: {x: 141, y: 121}, w: 95, h: 24, text: 'osallistui'},
    {p: {x: 140, y: 120}, q: {x: 140, y: 120}, w: 95, h: 24, text: 'vieraili'},
    {p: {x: 140, y: 120}, q: {x: 141, y: 121}, w: 95, h: 24, text: 'esiintyi'}
  ];
  const labels = placeRelationshipLabels(links, [{x: 88, y: 92, w: 100, h: 56}], 360, 260);
  assert.deepEqual(labels.map(label => label.text), ['osallistui', 'vieraili', 'esiintyi']);
  for (const label of labels) {
    assert.ok(Number.isFinite(label.x) && Number.isFinite(label.y));
    assert.ok(label.x >= 8 && label.x + label.w <= 352);
    assert.ok(label.y >= 8 && label.y + label.h <= 252);
  }
  assert.notDeepEqual([labels[0].x,labels[0].y],[labels[1].x,labels[1].y]);
});

test('relationship labels are drawn above depth-sorted nodes rather than skipped or occluded', () => {
  const main = readFileSync(new URL('../src/main.js', import.meta.url), 'utf8');
  assert.ok(main.includes('placeRelationshipLabels(links,nodeBoxes,W,H)'));
  assert.ok(main.includes('for(const label of layoutRelationshipLabels(ps,nodes))drawRelationshipLabel(label)'));
  assert.ok(main.indexOf('for(const item of scene)item.draw()') <
    main.indexOf('for(const label of layoutRelationshipLabels(ps,nodes))drawRelationshipLabel(label)'));
  assert.ok(!main.includes('if(len<55||W<100)continue'));
});
