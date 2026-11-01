import { bounds3D } from './scene.js';

/**
 * Visual hierarchy, not a claim of a common organization or commercial arrangement.
 * Every family encloses its listed groups. rootGroup, when provided, holds the
 * family's directly placed nodes without drawing a redundant inner volume.
 * Additional children can be added to groups without renderer changes.
 */
export const hierarchyGroups = [
  {
    id: 'pact-universe',
    title: 'PACT / OHJELMAPERHE',
    groups: ['core', 'season1', 'season2', 'season3', 'talks'],
    color: '#25899d',
    labelColor: '#226d7e',
    padding: 145,
    fillOpacity: 0.02
  },
  {
    id: 'rappio-universe',
    title: 'RAPPIOSTRIIMAUS',
    rootGroup: 'rappio',
    groups: ['rappio', 'pottu-streams'],
    color: '#b46b63',
    labelColor: '#935148',
    padding: 160,
    fillOpacity: 0.012
  }
];

export function hierarchyBounds(nodes, hierarchy) {
  return bounds3D(nodes.filter(node => hierarchy.groups.includes(node.group)), hierarchy.padding ?? 145);
}

/** A root group or a virtual parent selector filters all its child groups. */
export function sectorGroups(group) {
  return hierarchyGroups.find(family => family.rootGroup === group || family.id === group)?.groups ?? [group];
}

/** A root scene has a parent volume, rather than its own overlapping child box. */
export function isHierarchyRoot(group) {
  return hierarchyGroups.some(family => family.rootGroup === group);
}

/** Identify the sidebar parent of a child, whether the parent is a root scene or virtual. */
export function hierarchyRootForChild(group) {
  const family = hierarchyGroups.find(family => family.rootGroup !== group && family.groups.includes(group));
  return family ? (family.rootGroup ?? family.id) : null;
}

/** One selectable parent per family, followed by indented children in family order. */
export function hierarchyNavigationItems(skenes) {
  const items = [], seen = new Set();
  for (const [group, skene] of Object.entries(skenes)) {
    if (seen.has(group)) continue;
    const family = hierarchyGroups.find(family => family.groups.includes(group));
    if (!family) {
      items.push({id: group, label: skene.label, color: skene.color, child: false});
      seen.add(group);
      continue;
    }
    const parentId = family.rootGroup ?? family.id;
    items.push({id: parentId, label: family.title, color: family.color, child: false});
    for (const member of family.groups) {
      seen.add(member);
      if (member === family.rootGroup) continue;
      const child = skenes[member];
      if (child) items.push({id: member, label: child.label, color: child.color, child: true});
    }
  }
  return items;
}
