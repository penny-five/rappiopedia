/** Breadth-first shortest path across displayed evidence levels. */
export function shortestPath(from,to,edges,levels=new Set(['verified','reported','observed','lead'])){
  if(!from||!to)return null;
  const queue=[from],seen=new Set([from]),previous=new Map();
  for(let head=0;head<queue.length;head++){
    const current=queue[head];if(current===to)break;
    for(const [index,edge] of edges.entries()){
      if(!levels.has(edge.level))continue;
      const next=edge.a===current?edge.b:edge.b===current?edge.a:null;
      if(next&&!seen.has(next)){seen.add(next);previous.set(next,{previous:current,index});queue.push(next)}
    }
  }
  if(!seen.has(to))return null;
  const ns=[to],es=[];
  while(ns[0]!==from){const e=previous.get(ns[0]);es.unshift(e.index);ns.unshift(e.previous)}
  return {ns,es};
}
