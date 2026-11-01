import test from 'node:test';
import assert from 'node:assert/strict';
import { groupRelatedByType } from '../src/lib/relations.js';

test('article connections are grouped under readable types with counts and stable item order', () => {
 const related = [
  {type:'vieraili',relationVerb:'vieraili',relationHeading:'Ohjelmavierailut',level:'reported',other:{id:'guest'}},
  {type:'esiintyi-yhdessa',relationVerb:'esiintyi yhdessä',relationHeading:'Yhteiset esiintymiset',level:'verified',other:{id:'first'}},
  {type:'juonsi',relationVerb:'juonsi',relationHeading:'Juonnot',level:'verified',other:{id:'host'}},
  {type:'coappeared',relationVerb:'esiintyi yhdessä',relationHeading:'Yhteiset esiintymiset',level:'lead',other:{id:'second'}},
 ];
 const groups = groupRelatedByType(related);
 assert.deepEqual(groups.map(group => [group.label,group.edges.length]), [
  ['Yhteiset esiintymiset',2],
  ['Juonnot',1],
  ['Ohjelmavierailut',1],
 ]);
 assert.deepEqual(groups[0].edges.map(edge=>edge.other.id),['first','second']);
 assert.deepEqual(groups.flatMap(group=>group.edges).map(edge=>edge.other.id).sort(),
  related.map(edge=>edge.other.id).sort());
});

test('connections with no entries have no groups', () => {
 assert.deepEqual(groupRelatedByType([]),[]);
});
