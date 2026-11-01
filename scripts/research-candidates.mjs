import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { applyNetworkCorrections } from '../src/lib/network-corrections.js';

const root = new URL('../', import.meta.url);
const readJson = path => JSON.parse(readFileSync(new URL(path, root), 'utf8'));
const normalized = value => String(value ?? '').toLocaleLowerCase('fi').trim();

/**
 * A deterministic SHORTLIST, not an assessment of truth or newsworthiness.
 * Missing authored pages and highly connected people tend to surface first.
 */
export function researchCandidates(network, backlog, authoredIds, options = {}) {
  const focus = normalized(options.focus);
  const limit = Math.max(1, Math.min(50, Number(options.limit) || 12));
  const authored = new Set(authoredIds);
  const nodes = network.nodes;
  const matched = focus ? nodes.filter(n =>
    normalized(n.id).includes(focus) || normalized(n.name).includes(focus)
  ) : [];
  const matchedIds = new Set(matched.map(n => n.id));
  const degrees = new Map(nodes.map(n => [n.id, 0]));
  const refs = new Map(nodes.map(n => [n.id, new Set()]));
  for (const edge of network.edges) {
    for (const id of [edge.a, edge.b]) {
      degrees.set(id, (degrees.get(id) || 0) + 1);
      for (const src of edge.src || []) refs.get(id)?.add(src);
    }
  }
  const candidates = nodes.filter(n => !authored.has(n.id))
    .filter(n => !focus || matchedIds.has(n.id) ||
      network.edges.some(e => (e.a === n.id && matchedIds.has(e.b)) ||
        (e.b === n.id && matchedIds.has(e.a))))
    .map(n => ({
      id: n.id, name: n.name, cat: n.cat,
      connections: degrees.get(n.id) || 0, sources: refs.get(n.id)?.size || 0,
      score: (n.cat === 'person' ? 15 : 0) + (n.featured ? 5 : 0) +
        Math.min(40, (degrees.get(n.id) || 0) * 2) +
        Math.min(10, (refs.get(n.id)?.size || 0)) +
        (focus && matchedIds.has(n.id) ? 25 : 0)
    })).sort((a, b) => b.score - a.score || a.name.localeCompare(b.name, 'fi'))
    .slice(0, limit);

  const priority = { high: 0, medium: 1, low: 2 };
  const leads = backlog.leads.filter(l => l.status !== 'done')
    .filter(l => !focus || normalized(l.title).includes(focus) ||
      l.nodeIds?.some(id => matchedIds.has(id)))
    .sort((a, b) => (priority[a.priority] ?? 3) - (priority[b.priority] ?? 3) ||
      (a.status === 'in-progress' ? -1 : 0) - (b.status === 'in-progress' ? -1 : 0) ||
      a.id.localeCompare(b.id))
    .slice(0, limit)
    .map(l => ({ id: l.id, title: l.title, priority: l.priority, status: l.status, nextStep: l.nextSteps?.[0] || '' }));

  return { focus, matchingNodeIds: [...matchedIds], leads, candidates };
}

function cli() {
  const args = process.argv.slice(2);
  const opt = key => { const at = args.indexOf(key); return at < 0 ? '' : args[at + 1] || ''; };
  const focus = opt('--focus');
  const limit = opt('--limit') || 12;
  const articles = readdirSync(new URL('src/articles/', root))
    .filter(f => f.endsWith('.md')).map(f => f.slice(0, -3));
  const result = researchCandidates(applyNetworkCorrections(readJson('src/data/network.json'), readJson('src/data/network-corrections.json')),
    readJson('research/leads.json'), articles, { focus, limit });

  if (focus && result.matchingNodeIds.length === 0) {
    console.log('No existing graph node matches "' + focus + '". Research it as a potential new subject.');
  } else if (focus) console.log('Matching nodes: ' + result.matchingNodeIds.join(', '));

  console.log('\nOPEN RESEARCH LEADS');
  for (const l of result.leads) console.log('- [' + l.priority + ', ' + l.status + '] ' + l.id +
    ' — ' + l.title + (l.nextStep ? '\n  Next: ' + l.nextStep : ''));
  if (!result.leads.length) console.log('(none matching)');

  console.log('\nNODES WITHOUT AUTHORED ARTICLES (heuristic shortlist)');
  for (const n of result.candidates) console.log('- ' + n.id + ' — ' + n.name +
    ' [' + n.cat + ', ' + n.connections + ' relations, ' + n.sources + ' sources]');
  if (!result.candidates.length) console.log('(none matching)');

  console.log('\nChoose an interesting subject, then investigate current external sources. Rankings are not proof of importance.');
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) cli();
