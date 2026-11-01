import test from 'node:test';
import assert from 'node:assert/strict';
import { OVERVIEW_CAMERA, nodeIdFromHash } from '../src/lib/navigation.js';

const nodes = { pact: { id: 'pact' }, joachim: { id: 'joachim' }, 'iippa': { id: 'iippa' } };

test('opening the app without an article link leaves the network unselected', () => {
  for (const hash of ['', '#/', '#', '#/unknown', '#/node/missing', '#/node/%ZZ']) {
    assert.equal(nodeIdFromHash(hash, nodes), null, hash);
  }
});

test('only valid article deep links select a node, including the legacy alias', () => {
  assert.equal(nodeIdFromHash('#/node/pact', nodes), 'pact');
  assert.equal(nodeIdFromHash('#/node/iippa', nodes), 'iippa');
  assert.equal(nodeIdFromHash('#/node/okkishow', nodes), 'joachim');
});

test('default camera is the full-network overview, not the PACT focus', () => {
  assert.deepEqual(OVERVIEW_CAMERA.target, { x: 800, y: 0, z: 350 });
  assert.equal(OVERVIEW_CAMERA.dist, 8800);
  assert.equal(OVERVIEW_CAMERA.yaw, -0.35);
  assert.equal(OVERVIEW_CAMERA.pitch, 0.22);
});
