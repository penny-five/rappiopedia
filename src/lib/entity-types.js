/** Canonical, display-ready labels for the registered types of an entity. */
export function nodeTypeLabels(node, registry) {
  return (node.types || []).map(id => registry.types[id]?.label).filter(Boolean);
}

/** An entity may have several roles, but its visual prominence is never a type. */
export function formatNodeTypes(node, registry, separator = ' · ') {
  const labels = nodeTypeLabels(node, registry);
  return labels.length ? labels.join(separator) : (registry.categories[node.cat]?.label || '');
}
