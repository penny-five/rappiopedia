import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { articleMarkdownFor, fallbackArticle } from '../src/lib/article-content.js';

test('missing articles show only the authored node summary, not a duplicate Yhteydet list', () => {
  const node = {id: 'sample', note: 'Striimaaja, joka teki yhteislähetyksiä.'};
  const related = [
    {other: {id: 'guest', name: 'Vieras'}, relationVerb: 'striimasi', label: 'yhteinen lähetys', src: ['P1']}
  ];
  assert.equal(fallbackArticle(node, related), node.note);
  assert.equal(articleMarkdownFor(node, {}, related), node.note);
  assert.doesNotMatch(articleMarkdownFor(node, {}, related), /Yhteydet|\[\[guest\|/);
});

test('authored article takes precedence over fallback, including graph relationships', () => {
  const node = {id: 'sample', note: 'Lyhyt kuvaus'};
  const authored = {'./articles/sample.md': '**Pidempi elämäkerta**, jossa on tietoa henkilön urasta.'};
  assert.equal(articleMarkdownFor(node, authored), authored['./articles/sample.md']);
});

test('missing note falls back to an empty article body instead of a relationship dump', () => {
  assert.equal(articleMarkdownFor({id: 'sample'}, {}), '');
});

test('article renderer uses the shared prose-only fallback and separate relations panel', () => {
  const source = readFileSync(new URL('../src/wiki.js', import.meta.url), 'utf8');
  assert.match(source, /return articleMarkdownFor\(node, authored\)/);
  assert.match(source, /document\.getElementById\('relations'\)\.innerHTML=/);
  assert.doesNotMatch(source, /function fallbackArticle\(/);
});
