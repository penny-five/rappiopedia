/**
 * Turn the network's stable node IDs into searchable, human-readable values
 * for the native datalist in the connection finder.
 */
export function routeCandidateEntries(nodes) {
  const counts=new Map();
  for(const node of nodes){
    const name=node.name.trim().toLocaleLowerCase('fi');
    counts.set(name,(counts.get(name)??0)+1);
  }
  return nodes.slice().sort((a,b)=>a.name.localeCompare(b.name,'fi')).map(node=>{
    const ambiguous=counts.get(node.name.trim().toLocaleLowerCase('fi'))>1;
    return {id:node.id,displayName:ambiguous?`${node.name} (${node.id})`:node.name,category:node.cat};
  });
}

export function resolveRouteTarget(value,lookup) {
  return lookup.get(String(value??'').trim().toLocaleLowerCase('fi'))??null;
}
