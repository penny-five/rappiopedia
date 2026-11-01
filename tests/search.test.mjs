import test from 'node:test';
import assert from 'node:assert/strict';
import { searchNodes } from '../src/lib/search.js';

const nodes = [
  { id: '1', name: 'PactTalks vieras' },
  { id: '2', name: 'The PACT House' },
  { id: '3', name: 'PACT' },
  { id: '4', name: 'PactHouse 01' },
  { id: '5', name: 'Muu tapahtuma' }
];

test('search suggestions rank exact and name-prefix results before contained matches', () => {
  assert.deepEqual(searchNodes(nodes, 'pact').map(n => n.id), ['3', '4', '1', '2']);
});

test('search suggestions are case-insensitive, trimmed and support Finnish names', () => {
  assert.deepEqual(searchNodes([{ id: 'x', name: 'Väinö' }], ' VÄI ').map(n => n.id), ['x']);
});

test('search suggestions are empty for blank or unmatched text and respect result limit', () => {
  assert.deepEqual(searchNodes(nodes, '   '), []);
  assert.deepEqual(searchNodes(nodes, 'xyz'), []);
  assert.equal(searchNodes(nodes, 'pact', 2).length, 2);
});
