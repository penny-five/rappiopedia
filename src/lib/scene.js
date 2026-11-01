/** Camera-independent scene helpers for the Rappioverse canvas renderer. */
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
  return inFocus ? 1 : Math.max(.6, Math.min(1.55, perspectiveScale * 2.75));
}
