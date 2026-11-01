import test from 'node:test';
import assert from 'node:assert/strict';
import { articleBreadcrumbParts } from '../src/lib/article-breadcrumb.js';

test('articles identify their skene before the entity type', () => {
  const parts = articleBreadcrumbParts({name:'PactTalks'}, 'PACT TALKS', 'Keskusteluohjelma');
  assert.deepEqual(parts, ['Rappiopedia', 'PACT TALKS', 'Keskusteluohjelma', 'PactTalks']);
});

test('breadcrumb omits unavailable optional labels without extra separators', () => {
  assert.deepEqual(articleBreadcrumbParts({name:'Kasinokurki'}, '', 'Kasinovertailupalvelu'),
    ['Rappiopedia', 'Kasinovertailupalvelu', 'Kasinokurki']);
});
