#!/usr/bin/env node
/** Report Rappiopedia person nodes missing a photo source or awaiting local WebP processing. */
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const data = JSON.parse(readFileSync(resolve(root, 'src/data/network.json'), 'utf8'));
const argv = process.argv.slice(2);
const has = flag => argv.includes(flag);
const option = (flag, otherwise) => {
  const i = argv.indexOf(flag);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : otherwise;
};
const limit = has('--all') ? Infinity : Number(option('--limit', 35));
if (!(limit > 0)) throw new Error('--limit must be greater than 0');
const focus = option('--focus', '');
const degrees = new Map();
for (const edge of data.edges) {
  degrees.set(edge.a, (degrees.get(edge.a) || 0) + 1);
  degrees.set(edge.b, (degrees.get(edge.b) || 0) + 1);
}
const persons = data.nodes.filter(n => n.cat === 'person');
const info = persons.map(n => {
  const source = n.imageSource || (/^https?:\/\//.test(n.image || '') ? n.image : '');
  const photo = n.image || '';
  const localFile = photo.startsWith('images/') ? resolve(root, 'public', photo) : null;
  const localExists = Boolean(localFile && existsSync(localFile));
  const status = !source ? 'missing-source' : !localExists ? 'needs-webp' : 'ready';
  return { id:n.id, name:n.name, status, featured:!!n.featured, connections:degrees.get(n.id) || 0, source:source || null };
});
const unresolved = info.filter(n => n.status !== 'ready' && (!focus || n.id.includes(focus) || n.name.toLowerCase().includes(focus.toLowerCase())))
  .sort((a, b) => Number(b.featured) - Number(a.featured) || b.connections - a.connections || a.name.localeCompare(b.name, 'fi'));
const counts = Object.fromEntries(['ready','needs-webp','missing-source'].map(status => [status, info.filter(n => n.status === status).length]));
if (has('--json')) {
  console.log(JSON.stringify({total:persons.length, counts, candidates:unresolved.slice(0, limit)}, null, 2));
} else {
  console.log(`People: ${persons.length}; ready: ${counts.ready}; sourced but WebP missing locally: ${counts['needs-webp']}; missing image source: ${counts['missing-source']}`);
  for (const n of unresolved.slice(0, limit)) {
    console.log(`${n.status.padEnd(14)} ${n.id.padEnd(16)} [${String(n.connections).padStart(2)} edges] ${n.name}`);
  }
  if (unresolved.length > limit) console.log(`... ${unresolved.length - limit} more (use --all)`);
}
