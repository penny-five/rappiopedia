/** Camera-independent scene helpers for the Rappioverse canvas renderer. */
/** World-space camera location for the existing target/distance representation. */
export function cameraPositionFromTarget(target, yaw, pitch, distance) {
  const cp = Math.cos(pitch);
  return {
    x: target.x + distance * Math.sin(yaw) * cp,
    y: target.y + distance * Math.sin(pitch),
    z: target.z + distance * Math.cos(yaw) * cp
  };
}

/** Rotate the view without orbiting: change the look-at target, not the camera position. */
export function cameraTargetFromPosition(position, yaw, pitch, distance) {
  const cp = Math.cos(pitch);
  return {
    x: position.x - distance * Math.sin(yaw) * cp,
    y: position.y - distance * Math.sin(pitch),
    z: position.z - distance * Math.cos(yaw) * cp
  };
}

/** Apply a mouse-look delta to the live camera state, keeping the eye fixed in world space. */
export function cameraLookDelta(target, yaw, pitch, distance, deltaX, deltaY) {
  const position = cameraPositionFromTarget(target, yaw, pitch, distance);
  const nextYaw = yaw - deltaX * .005;
  const nextPitch = Math.max(-1.35, Math.min(1.35, pitch + deltaY * .005));
  return {
    yaw: nextYaw,
    pitch: nextPitch,
    target: cameraTargetFromPosition(position, nextYaw, nextPitch, distance)
  };
}

/** Distances in the scene use world units, displayed as metres while flying. */
export const MIN_MOVEMENT_SPEED = 300;
export const MAX_MOVEMENT_SPEED = 6000;
export const DEFAULT_MOVEMENT_SPEED = 900;

/** Validate stored base speed before using it across sessions. */
export function storedMovementSpeed(value) {
  if (typeof value !== 'string' || !value.trim()) return DEFAULT_MOVEMENT_SPEED;
  const speed = Number(value);
  return Number.isFinite(speed) && speed >= MIN_MOVEMENT_SPEED && speed <= MAX_MOVEMENT_SPEED
    ? speed : DEFAULT_MOVEMENT_SPEED;
}

/** Wheel adjusts flight speed, with trackpad and line/page-wheel normalization. */
export function adjustMovementSpeed(speed, deltaY, deltaMode = 0) {
  const pixels = deltaY * (deltaMode === 1 ? 18 : deltaMode === 2 ? 360 : 1);
  const step = Math.max(-240, Math.min(240, pixels));
  return Math.max(MIN_MOVEMENT_SPEED, Math.min(MAX_MOVEMENT_SPEED, speed * Math.exp(-step * .0025)));
}

/** Logarithmic readout gives both slow and fast flying useful meter precision. */
export function movementSpeedFill(speed) {
  const top = MAX_MOVEMENT_SPEED * 2.5;
  const clamped = Math.max(MIN_MOVEMENT_SPEED, Math.min(top, speed));
  return 100 * Math.log(clamped / MIN_MOVEMENT_SPEED) / Math.log(top / MIN_MOVEMENT_SPEED);
}

/** Do not let focus/depth dimming linger when nothing is selected. */
export function nodeOpacity({
  selected = false, routeActive = false, focused = false, onPath = false,
  sectorDimmed = false, distanceFactor = 1
} = {}) {
  if (!selected && !routeActive && !sectorDimmed) return 1;
  let opacity = sectorDimmed && !focused && !onPath ? .2 : 1;
  if (selected && !focused && !onPath) opacity *= .24;
  if (routeActive && !onPath) opacity *= .21;
  return opacity * (focused ? 1 : Math.max(.3, Math.min(1, distanceFactor)));
}

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

/** Label density changes presentation, never which relationships exist. */
export function graphNodePresentation({
  nameDensity = 'auto', selected = false, hovered = false, focused = false,
  onPath = false, featured = false, inSelectedSector = false,
  isHub = false, wholeSpace = true
} = {}) {
  const emphasized = selected || hovered || focused || onPath || featured || inSelectedSector;
  return {
    dot: nameDensity !== 'all' && !emphasized && wholeSpace && !isHub,
    showLabel: nameDensity === 'all' || emphasized
  };
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
  const forward = Number(keys.has('w') || keys.has('arrowup')) - Number(keys.has('s') || keys.has('arrowdown'));
  const right = Number(keys.has('d') || keys.has('arrowright')) - Number(keys.has('a') || keys.has('arrowleft'));
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

/** Fit a canvas label to the available space without squeezing its font. */
export function truncateLabel(value, maxWidth, measure) {
  const chars = Array.from(String(value ?? ''));
  const text = chars.join('');
  if (maxWidth <= 0) return '';
  if (measure(text) <= maxWidth) return text;
  const suffix = '…';
  if (measure(suffix) > maxWidth) return '';
  let low = 0, high = chars.length;
  while (low < high) {
    const mid = Math.ceil((low + high) / 2);
    if (measure(chars.slice(0, mid).join('') + suffix) <= maxWidth) low = mid;
    else high = mid - 1;
  }
  return chars.slice(0, low).join('') + suffix;
}
/** Choose stable, collision-aware screen-space positions for visible node labels. */
export function placeNodeLabels(items, width, height, previousAnchors = new Map()) {
  const placements = new Map(), occupied = [];
  if (width <= 0 || height <= 0) return placements;
  const margin = 8;
  const points = items.map(item => ({
    id: item.n.id, x: item.p.x, y: item.p.y, r: Math.max(6, item.r) + 5
  }));
  const anchors = [
    ['right', 1, 0], ['left', -1, 0],
    ['above', 0, -1], ['below', 0, 1],
    ['upper-right', 1, -1], ['upper-left', -1, -1],
    ['lower-right', 1, 1], ['lower-left', -1, 1]
  ];
  const priority = item => item.isSel ? 0 : item.isHover ? 1
    : (item.hot || item.inPath) ? 2 : item.n.featured ? 3 : 4;
  const ordered = items.filter(item => item.label).sort((a, b) =>
    priority(a) - priority(b) || a.p.z - b.p.z || a.n.id.localeCompare(b.n.id));
  const overlapArea = (x, y, w, h, rect) =>
    Math.max(0, Math.min(x + w, rect.x + rect.w) - Math.max(x, rect.x)) *
    Math.max(0, Math.min(y + h, rect.y + rect.h) - Math.max(y, rect.y));

  for (const item of ordered) {
    const {n, p, r, label} = item;
    const {w, h} = label, gap = Math.max(13, r + 9);
    let openX = 0, openY = 0;
    for (const other of points) {
      if (other.id === n.id) continue;
      const dx = p.x - other.x, dy = p.y - other.y, distance = Math.hypot(dx, dy);
      if (distance >= 250) continue;
      const weight = (1 - distance / 250) / (distance + 35);
      openX += dx * weight;
      openY += dy * weight;
    }
    const remembered = previousAnchors.get(n.id);
    let best = null, bestScore = Infinity;
    for (const [anchor, dirX, dirY] of anchors) {
      const rawX = dirX > 0 ? p.x + gap : dirX < 0 ? p.x - gap - w : p.x - w / 2;
      const rawY = dirY > 0 ? p.y + gap : dirY < 0 ? p.y - gap - h : p.y - h / 2;
      const bx = Math.max(margin, Math.min(Math.max(margin, width - w - margin), rawX));
      const by = Math.max(margin, Math.min(Math.max(margin, height - h - margin), rawY));
      let score = (Math.abs(bx - rawX) + Math.abs(by - rawY)) * 1.35;
      // Prefer short side labels, but use clear vertical and diagonal positions when needed.
      score += dirX && dirY ? 9 : dirX === 0 ? 7 : 0;
      score += dirX ? 14 * (dirX > 0 ? p.x / width : 1 - p.x / width) : 4;
      score -= 12 * (openX * dirX + openY * dirY) / Math.hypot(dirX, dirY);
      // Prevent flicker during minor camera motions.
      if (remembered && remembered !== anchor) score += 16;
      for (const point of points) {
        const size = point.r * 2;
        const area = overlapArea(bx, by, w, h, {
          x: point.x - point.r, y: point.y - point.r, w: size, h: size
        });
        if (area) score += (point.id === n.id ? 360 : 140) * area / (size * size);
      }
      for (const box of occupied) {
        const area = overlapArea(bx, by, w, h, {
          x: box.x - 4, y: box.y - 4, w: box.w + 8, h: box.h + 8
        });
        if (area) score += 85 + 520 * area / Math.min(w * h, box.w * box.h);
      }
      if (score < bestScore) {
        bestScore = score;
        best = {bx, by, anchor};
      }
    }
    placements.set(n.id, best);
    previousAnchors.set(n.id, best.anchor);
    occupied.push({x: best.bx, y: best.by, w, h});
  }
  return placements;
}
