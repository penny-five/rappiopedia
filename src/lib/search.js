/** Rank search suggestions: name prefixes first, then word prefixes, then other matches. */
export function searchNodes(nodes, query, limit = 8) {
  const term = String(query ?? '').trim().toLocaleLowerCase('fi');
  if (!term || limit <= 0) return [];
  return nodes
    .map((node, index) => {
      const name = node.name.toLocaleLowerCase('fi');
      const at = name.indexOf(term);
      if (at < 0) return null;
      const rank = at === 0 ? 0 : /[^\p{L}\p{N}]/u.test(name[at - 1]) ? 1 : 2;
      return { node, name, rank, index };
    })
    .filter(Boolean)
    .sort((a, b) => a.rank - b.rank || a.name.localeCompare(b.name, 'fi') || a.index - b.index)
    .slice(0, limit)
    .map(match => match.node);
}
