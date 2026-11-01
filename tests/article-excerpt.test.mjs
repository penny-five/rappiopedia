import test from 'node:test';
import assert from 'node:assert/strict';
import { markdownExcerpt } from '../src/lib/article-excerpt.js';

test('hover preview uses article lead and strips Markdown link markup and source tags', () => {
  const md = '## Yhteenveto\n**Upi** esiintyi [[kieksidoc|Ylen dokumentissa]]. [@P45] [@P46]\n\n## Tapahtumat\nMuu teksti.';
  assert.equal(markdownExcerpt(md), 'Upi esiintyi Ylen dokumentissa.');
});
test('hover preview handles lists, long text and empty articles', () => {
  assert.equal(markdownExcerpt('## Yhteydet\n- [[a|A]] esiintyi\n- B esiintyi'), 'A esiintyi');
  assert.equal(markdownExcerpt(''), '');
  assert.ok(markdownExcerpt('pitkä lause '.repeat(30), 100).length <= 100);
});
