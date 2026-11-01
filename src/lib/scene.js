/** Camera-independent scene helpers for the Rappioverse canvas renderer. */
/** In route mode, only the chosen path's nodes and edges are visible and interactive. */
export function routeVisibility(pathNodes, pathEdges) {
  const active = pathNodes.length > 0;
  const nodes = new Set(pathNodes);
  const edges = new Set(pathEdges);
  return {
    active,
    showsNode: id => !active || nodes.has(id),
    showsEdge: index => !active || edges.has(index)
  };
}

/** Route labels belong to each traversed edge, using the direction of travel. */
export function relationshipLabelEdges(edges, selected, pathNodes, pathEdges) {
  if (pathNodes.length) {
    return pathEdges.map((index, step) => ({ edge: edges[index], from: pathNodes[step] }));
  }
  if (!selected) return [];
  return edges.filter(edge => edge.a === selected || edge.b === selected)
    .map(edge => ({ edge, from: selected }));
}

export function focusedNodeIds(selected, edges, enabledLevels) {
  const ids = new Set();
  if (!selected) return ids;
  ids.add(selected);
  for (const edge of edges) {
    if (!enabledLevels.has(edge.level)) continue;
    if (edge.a === selected) ids.add(edge.b);
    if (edge.b === selected) ids.add(edge.a);
  }
  return ids;
}

/** Interpolate perspective-correct screen position along a projected 3D edge. */
export function projectedEdgePoint(a, b, t) {
  const inverseDepth = (1 - t) / a.z + t / b.z;
  const z = 1 / inverseDepth;
  return {
    x: ((1 - t) * a.x / a.z + t * b.x / b.z) * z,
    y: ((1 - t) * a.y / a.z + t * b.y / b.z) * z,
    z
  };
}

/** Keep the focused neighborhood readable while other labels reflect zoom/depth. */
export function graphLabelScale(perspectiveScale, inFocus) {
  return inFocus ? 1 : Math.max(.6, Math.min(1, perspectiveScale * 2.75));
}

/** Camera-relative keyboard travel. Normalize combined motion for consistent speed. */
export function cameraTravelDirection(keys, camera) {
  const forward = Number(keys.has('w')) - Number(keys.has('s'));
  const right = Number(keys.has('d')) - Number(keys.has('a'));
  const vertical = Number(keys.has('e')) - Number(keys.has('q'));
  const x = camera.forward.x * forward + camera.right.x * right;
  const y = camera.forward.y * forward + camera.right.y * right + vertical;
  const z = camera.forward.z * forward + camera.right.z * right;
  const length = Math.hypot(x, y, z);
  return length ? { x: x / length || 0, y: y / length || 0, z: z / length || 0 } : { x: 0, y: 0, z: 0 };
}

/** Axis-aligned 3D volume enclosing every member, with room for its labels. */
export function bounds3D(nodes, padding = 0) {
  if (!nodes.length) return null;
  return {
    min: [0, 1, 2].map(i => Math.min(...nodes.map(n => n.pos3[i])) - padding),
    max: [0, 1, 2].map(i => Math.max(...nodes.map(n => n.pos3[i])) + padding)
  };
}

/** Intersection of volumes, not merely their overlapping 2D projections. */
export function boxesOverlap3D(a, b) {
  return [0, 1, 2].every(i => a.min[i] < b.max[i] && b.min[i] < a.max[i]);
}
