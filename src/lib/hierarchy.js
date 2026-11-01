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
    padding: 145
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

/** Selecting a root scene includes all of its child groups. */
export function sectorGroups(group) {
  return hierarchyGroups.find(family => family.rootGroup === group)?.groups ?? [group];
}

/** A root scene has a parent volume, rather than its own overlapping child box. */
export function isHierarchyRoot(group) {
  return hierarchyGroups.some(family => family.rootGroup === group);
}

/** Children can be indented in the scene selector without ad-hoc IDs in the UI. */
export function hierarchyRootForChild(group) {
  return hierarchyGroups.find(family => family.rootGroup && family.rootGroup !== group && family.groups.includes(group))?.rootGroup ?? null;
}
