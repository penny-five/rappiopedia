/**
 * Resolve a relation type from the selected node's point of view.
 * Symmetric types have one phrase; directional types have two.
 */
export function relationVerb(edge, fromId, types) {
  const type = types[edge.type];
  if (!type) throw new Error('Unknown relation type: ' + edge.type);
  if (fromId !== edge.a && fromId !== edge.b) throw new Error('Node is not part of relation: ' + fromId);
  return type.symmetric ? type.verb : fromId === edge.a ? type.forward : type.reverse;
}
