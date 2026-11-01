import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { nodeTypeLabels, formatNodeTypes } from '../src/lib/entity-types.js';

const registry = JSON.parse(readFileSync(new URL('../src/data/entity-types.json', import.meta.url), 'utf8'));
const network = JSON.parse(readFileSync(new URL('../src/data/network.json', import.meta.url), 'utf8'));
const byId = Object.fromEntries(network.nodes.map(n => [n.id, n]));

test('every node has registered, category-consistent types without duplicates', () => {
  for (const [category, entry] of Object.entries(registry.categories)) {
    assert.ok(category && entry.label?.trim(), category);
  }
  for (const [id, type] of Object.entries(registry.types)) {
    assert.ok(id && type.label?.trim(), id);
    assert.ok(registry.categories[type.category], id + ' has unknown category');
  }
  for (const node of network.nodes) {
    assert.ok(registry.categories[node.cat], node.id + ' has unregistered category');
    assert.ok(Array.isArray(node.types) && node.types.length > 0, node.id + ' has no types');
    assert.equal(new Set(node.types).size, node.types.length, node.id + ' duplicate types');
    for (const typeId of node.types) {
      assert.ok(registry.types[typeId], node.id + ' unknown type ' + typeId);
      assert.equal(registry.types[typeId].category, node.cat, node.id + ' mismatched type ' + typeId);
    }
  }
});

test('multiple person roles display together in article and graph descriptions', () => {
  assert.deepEqual(nodeTypeLabels(byId.jethro, registry), ['Juontaja','Tosi-tv-osallistuja']);
  assert.equal(formatNodeTypes(byId.sami, registry), 'Dokumentaristi · Yrittäjä');
  assert.equal(formatNodeTypes(byId.iippa, registry), 'Rappiostriimaaja');
});

test('sites, publications, channels, events and other entities have distinct real types', () => {
  assert.equal(byId.gekkonen.cat, 'site');
  assert.equal(formatNodeTypes(byId.gekkonen, registry), 'Uutissivusto');
  assert.equal(byId.seiska.cat, 'media');
  assert.equal(byId.pactchannel.cat, 'channel');
  assert.equal(byId.kasinok.cat, 'service');
  assert.equal(formatNodeTypes(byId.kasinok, registry), 'Kasinovertailupalvelu');
  assert.equal(byId.bailu.cat, 'event');
  assert.equal(formatNodeTypes(byId.bailu, registry), 'Risteily');
  assert.equal(byId.hard_to_break.cat, 'film');
  assert.ok(registry.categories.place && registry.types.paikka && registry.types.kaupunki);
});

test('unknown roles fall back to category rather than becoming graph labels', () => {
  assert.equal(formatNodeTypes({ cat: 'place', types: [] }, registry), 'Paikka');
  const main = readFileSync(new URL('../src/main.js', import.meta.url), 'utf8');
  assert.ok(!main.includes('KESKUSSOLMU'));
  assert.ok(main.includes('formatNodeTypes(n,ENTITY_TYPES).toUpperCase()'));
});
