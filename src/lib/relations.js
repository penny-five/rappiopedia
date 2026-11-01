/**
 * Resolve a relation type from the selected node's point of view.
 * Symmetric types have one phrase; directional types have two.
 */
export function groupRelatedByType(related) {
  const groups = new Map();
  for (const edge of related) {
    // Group by the readable relation from this node's perspective.
    // Equivalent registry IDs can share the same displayed verb.
    const label = edge.relationVerb;
    const key = label.toLocaleLowerCase('fi');
    if (!groups.has(key)) groups.set(key, {label, edges: []});
    groups.get(key).edges.push(edge);
  }
  return [...groups.values()].sort((a, b) =>
    b.edges.length - a.edges.length || a.label.localeCompare(b.label, 'fi'));
}

export function relationVerb(edge, fromId, types) {
  const type = types[edge.type];
  if (!type) throw new Error('Unknown relation type: ' + edge.type);
  if (fromId !== edge.a && fromId !== edge.b) throw new Error('Node is not part of relation: ' + fromId);
  return type.symmetric ? type.verb : fromId === edge.a ? type.forward : type.reverse;
}
