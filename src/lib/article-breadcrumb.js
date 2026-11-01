import { hierarchyGroups } from './hierarchy.js';

/** Breadcrumbs show the skene hierarchy and article, not the site name or entity types. */
export function articleBreadcrumbParts(node, skene) {
  const parent = hierarchyGroups.find(family =>
    family.rootGroup !== node.group && family.groups.includes(node.group)
  )?.title;
  return [parent, skene, node.name].filter(Boolean);
}
