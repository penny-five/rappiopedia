/** The unselected, whole-network view used on initial load and reset. */
export const OVERVIEW_CAMERA = Object.freeze({
  yaw: -0.35,
  pitch: 0.22,
  dist: 8800,
  target: Object.freeze({ x: 800, y: 0, z: 350 })
});

/** Only an explicit, valid article deep link should select a node on load. */
export function nodeIdFromHash(hash, nodesById) {
  if (!hash.startsWith('#/node/')) return null;
  let id;
  try {
    id = decodeURIComponent(hash.slice('#/node/'.length));
  } catch {
    return null;
  }
  if (id === 'okkishow') id = 'joachim'; // Historical link.
  return Object.hasOwn(nodesById, id) ? id : null;
}
