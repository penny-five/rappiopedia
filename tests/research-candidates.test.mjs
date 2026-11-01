import test from 'node:test';
import assert from 'node:assert/strict';
import { researchCandidates } from '../scripts/research-candidates.mjs';

const network = {
  nodes: [
    { id: 'p', name: 'Person One', cat: 'person', featured: true },
    { id: 'q', name: 'Person Two', cat: 'person' },
    { id: 'event', name: 'Shared Event', cat: 'event' },
    { id: 'other', name: 'Other', cat: 'person' }
  ],
  edges: [
    { a: 'p', b: 'event', src: ['P1'] },
    { a: 'q', b: 'event', src: ['P2'] },
    { a: 'p', b: 'q', src: ['P1', 'P3'] }
  ]
};
const backlog = { leads: [
  { id: 'done', title: 'Finished work', status: 'done', priority: 'high', nodeIds: ['p'], nextSteps: [] },
  { id: 'first', title: 'Investigation on Person One', status: 'open', priority: 'high', nodeIds: ['p'], nextSteps: ['Read source'] },
  { id: 'later', title: 'Unrelated lead', status: 'open', priority: 'medium', nodeIds: ['other'], nextSteps: [] }
] };

test('self-guided mode ranks unpublished nodes and leaves completed leads out', () => {
  const r = researchCandidates(network, backlog, ['event']);
  assert.equal(r.focus, '');
  assert.deepEqual(r.leads.map(l => l.id), ['first', 'later']);
  assert.equal(r.candidates[0].id, 'p');
  assert.ok(r.candidates.some(n => n.id === 'q'));
  assert.ok(!r.candidates.some(n => n.id === 'event'));
});

test('focused mode follows matching node to direct neighbours', () => {
  const r = researchCandidates(network, backlog, ['event'], { focus: 'Person One' });
  assert.deepEqual(r.matchingNodeIds, ['p']);
  assert.deepEqual(r.leads.map(l => l.id), ['first']);
  assert.ok(r.candidates.some(n => n.id === 'p'));
  assert.ok(r.candidates.some(n => n.id === 'q'));
  assert.ok(!r.candidates.some(n => n.id === 'other'));
});

test('an unfamiliar seed can be researched as a new subject', () => {
  const r = researchCandidates(network, backlog, ['event'], { focus: 'Someone New' });
  assert.deepEqual(r.matchingNodeIds, []);
  assert.deepEqual(r.candidates, []);
  assert.deepEqual(r.leads, []);
});

test('limits control candidate list length', () => {
  const r = researchCandidates(network, backlog, [], { limit: 1 });
  assert.equal(r.candidates.length, 1);
  assert.equal(r.leads.length, 1);
});
