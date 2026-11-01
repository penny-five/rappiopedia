/** Group the canonical node.cat classes into four practical map filters. */
export const NODE_CATEGORY_FILTERS = Object.freeze([
  { id: 'person', label: 'Henkilöt' },
  { id: 'event', label: 'Tapahtumat' },
  { id: 'show', label: 'Ohjelmat' },
  { id: 'other', label: 'Muut kohteet' }
]);
const PRIMARY_CATEGORIES=new Set(['person','event','show']);

export function categoryFilterId(category) {
  return PRIMARY_CATEGORIES.has(category)?category:'other';
}
export function categoryEnabled(node,enabledCategories) {
  return Boolean(node)&&enabledCategories.has(categoryFilterId(node.cat));
}
export function edgeMatchesCategories(edge,byId,enabledCategories) {
  return categoryEnabled(byId[edge.a],enabledCategories)&&categoryEnabled(byId[edge.b],enabledCategories);
}
export function categoryCounts(nodes) {
  const counts=Object.fromEntries(NODE_CATEGORY_FILTERS.map(({id})=>[id,0]));
  for(const node of nodes)counts[categoryFilterId(node.cat)]++;
  return counts;
}
