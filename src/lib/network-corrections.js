/** Apply small, reviewable edge corrections without changing node positions or sources.
 * Every correction identifies exactly one original edge; stale patches fail loudly.
 */
export function applyNetworkCorrections(network, corrections) {
  const edges = network.edges.map(edge => ({...edge}));
  function findUnique(match) {
    const matches = [];
    for (let i = 0; i < edges.length; i++) {
      if (Object.entries(match).every(([key,value]) => edges[i][key] === value)) matches.push(i);
    }
    if (matches.length !== 1) {
      throw new Error('Expected exactly one edge for correction: '+JSON.stringify(match)+'; found '+matches.length);
    }
    return matches[0];
  }
  // Removals first; no update can accidentally match a newly changed edge.
  for (const correction of corrections.remove || []) edges.splice(findUnique(correction.match), 1);
  for (const correction of corrections.edits || []) {
    const index = findUnique(correction.match);
    edges[index] = {...edges[index], ...correction.set};
  }
  return {...network,edges};
}
