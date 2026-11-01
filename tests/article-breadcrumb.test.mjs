import test from 'node:test';
import assert from 'node:assert/strict';
import { articleBreadcrumbParts } from '../src/lib/article-breadcrumb.js';

test('article breadcrumb shows only the skene and article, not the site or entity types', () => {
  assert.deepEqual(
    articleBreadcrumbParts({name:'Pinja ”Ruusutossu” Rajakari', group:'reality'}, 'SOME / MATKAREALITY'),
    ['SOME / MATKAREALITY', 'Pinja ”Ruusutossu” Rajakari']
  );
});

test('nested skenes show their parent scene before the article', () => {
  assert.deepEqual(
    articleBreadcrumbParts({name:'PactTalks', group:'talks'}, 'PACT TALKS'),
    ['PACT / OHJELMAPERHE', 'PACT TALKS', 'PactTalks']
  );
  assert.deepEqual(
    articleBreadcrumbParts({name:'Pottukoira', group:'pottu-streams'}, 'POTTUKOIRA'),
    ['RAPPIOSTRIIMAUS', 'POTTUKOIRA', 'Pottukoira']
  );
});

test('root skene is not duplicated as its own parent', () => {
  assert.deepEqual(
    articleBreadcrumbParts({name:'Iippa', group:'rappio'}, 'RAPPIOSTRIIMAUS'),
    ['RAPPIOSTRIIMAUS', 'Iippa']
  );
});

test('breadcrumb omits unavailable optional scene labels without extra separators', () => {
  assert.deepEqual(articleBreadcrumbParts({name:'Kasinokurki'}, ''), ['Kasinokurki']);
});
