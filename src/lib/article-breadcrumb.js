/** Breadcrumb hierarchy: encyclopedia, skene, registered entity type, article. */
export function articleBreadcrumbParts(node, skene, category) {
  return ['Rappiopedia', skene, category, node.name].filter(Boolean);
}
