import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = path => JSON.parse(readFileSync(new URL(path, import.meta.url), 'utf8'));
const register = read('../research/leads.json');
const network = read('../src/data/network.json');
const nodeIds = new Set(network.nodes.map(node => node.id));
const sourceIds = new Set(Object.keys(network.sources));

test('research leads use unique IDs and valid network references', () => {
  assert.equal(register.version, 1);
  assert.ok(Array.isArray(register.leads));
  const ids = new Set();
  for (const lead of register.leads) {
    assert.match(lead.id, /^[a-z0-9-]+$/);
    assert.ok(!ids.has(lead.id), `Duplicate lead: ${lead.id}`);
    ids.add(lead.id);
    assert.ok(lead.title);
    assert.ok(['open', 'in-progress', 'blocked', 'done'].includes(lead.status));
    assert.ok(['high', 'medium', 'low'].includes(lead.priority));
    assert.ok(lead.nodeIds.length > 0, lead.id);
    assert.ok(lead.sourceIds.length > 0, lead.id);
    for (const id of lead.nodeIds) assert.ok(nodeIds.has(id), `Unknown node: ${id}`);
    for (const id of lead.sourceIds) assert.ok(sourceIds.has(id), `Unknown source: ${id}`);
    for (const field of ['questions', 'queries', 'nextSteps']) {
      assert.ok(Array.isArray(lead[field]) && lead[field].length > 0, `${lead.id}: ${field}`);
      assert.ok(lead[field].every(value => typeof value === 'string' && value.trim()), `${lead.id}: ${field}`);
    }
  }
});
