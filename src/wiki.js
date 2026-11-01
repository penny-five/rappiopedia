/**
 * Rappiopedia's safe, intentionally small Markdown dialect.
 * HTML from authored text is escaped. Node links and citations come
 * only from the validated network registries.
 */
import { articleBreadcrumbParts } from './lib/article-breadcrumb.js';
import { groupRelatedByType } from './lib/relations.js';
import { articleMarkdownFor } from './lib/article-content.js';
const authored = import.meta.glob('./articles/*.md', {query:'?raw',import:'default',eager:true});
export function escapeHtml(value){
  return String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
export function extractReferences(text) {
  return {
    nodes:[...String(text).matchAll(/\[\[([a-z0-9_-]+)\|([^\]]+)\]\]/g)].map(m=>m[1]),
    sources:[...String(text).matchAll(/\[@([A-Za-z0-9_-]+)\]/g)].map(m=>m[1])
  };
}
export function markdownToHtml(text,nodes,sources){
  function inline(line){
    let s=escapeHtml(line);
    s=s.replace(/\[\[([a-z0-9_-]+)\|([^\]]+)\]\]/g,(all,id,label)=>nodes[id]?
      '<button class="wiki-link" type="button" data-focus="'+escapeHtml(id)+'">'+label+'</button>':label);
    s=s.replace(/\[@([A-Za-z0-9_-]+)\]/g,(all,id)=>{
      const src=sources[id];
      return src&&/^https?:\/\//.test(src.url)?'<a class="footnote" target="_blank" rel="noopener noreferrer" title="'+escapeHtml(src.label)+'" href="'+escapeHtml(src.url)+'">['+escapeHtml(id)+']</a>':'['+escapeHtml(id)+']';
    });
    return s.replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>').replace(/\*([^*]+)\*/g,'<em>$1</em>');
  }
  const lines=String(text).replace(/\r\n/g,'\n').split('\n');
  let output='',list='',paragraph=[];
  function flush(){if(paragraph.length){output+='<p>'+inline(paragraph.join(' '))+'</p>';paragraph=[]}}
  function close(){if(list){output+='</'+list+'>';list=''}}
  for(const raw of lines){
    const line=raw.trim();
    if(!line){flush();close();continue}
    const heading=line.match(/^(#{2,3})\s+(.+)$/);
    if(heading){flush();close();const h=heading[1].length;output+='<h'+h+'>'+inline(heading[2])+'</h'+h+'>';continue}
    const bullet=line.match(/^(-|\d+\.)\s+(.+)$/);
    if(bullet){flush();const type=bullet[1]==='-'?'ul':'ol';if(list!==type){close();output+='<'+type+'>';list=type}output+='<li>'+inline(bullet[2])+'</li>';continue}
    if(line.startsWith('> ')){flush();close();output+='<blockquote>'+inline(line.slice(2))+'</blockquote>';continue}
    close();paragraph.push(line);
  }
  flush();close();return output;
}
/** The single article source used by both the article panel and graph tooltips. */
export function articleMarkdown(node){
  return articleMarkdownFor(node, authored);
}
export function renderNodeArticle({node,related,nodes,sources,levels,group,category}){
  const text=articleMarkdown(node);
  const sourceIds=[...new Set(related.flatMap(e=>e.src))].filter(id=>sources[id]);
  const name=escapeHtml(node.name);
  const breadcrumb=articleBreadcrumbParts(node,group).map(escapeHtml).join(' <span>›</span> ');
  document.getElementById('dochead').innerHTML='<div class="breadcrumbs">'+breadcrumb+'</div><h2>'+name+'</h2>';
  const initials=node.name.replace(/[^\p{L}\p{N} ]/gu,' ').trim().split(/\s+/).slice(0,2).map(x=>x[0]).join('');
  const picture=node.image?'<img loading="lazy" referrerpolicy="no-referrer" alt="'+name+'" src="'+escapeHtml(node.image)+'">':'';
  const box='<div class="infobox"><div class="infobox-head">'+name+'</div><div class="infobox-media"><span>'+escapeHtml(initials)+'</span>'+picture+'</div><dl>'+
    '<div><dt>'+(node.types?.length>1?'Tyypit':'Tyyppi')+'</dt><dd>'+escapeHtml(category)+'</dd></div><div><dt>Skene</dt><dd>'+escapeHtml(group)+'</dd></div>'+
    '<div><dt>Yhteyksiä</dt><dd>'+related.length+'</dd></div><div><dt>Lähteitä</dt><dd>'+sourceIds.length+'</dd></div></dl></div>';
  document.getElementById('articleBody').innerHTML=box+markdownToHtml(text,nodes,sources);
  const img=document.querySelector('#articleBody .infobox-media img');
  if(img){img.addEventListener('error',()=>img.remove(),{once:true})}
  document.getElementById('relhead').textContent='Yhteydet ('+related.length+')';
  document.getElementById('relations').innerHTML=groupRelatedByType(related).map(({label,edges})=>
    '<section class="relation-group"><h4 class="relation-group-title">'+escapeHtml(label.charAt(0).toLocaleUpperCase('fi')+label.slice(1))+' <span>('+edges.length+')</span></h4>'+
    edges.map(e=>'<div class="rel"><div class="rel-top">'+
    '<button type="button" data-focus="'+escapeHtml(e.other.id)+'">'+escapeHtml(e.other.name)+'</button>'+
    '<label>'+escapeHtml(levels[e.level]?.label||e.level)+'</label></div><div class="lbl">'+escapeHtml(e.label)+(e.date?' · '+escapeHtml(e.date):'')+'</div>'+
    (e.detail?'<div class="meta">'+escapeHtml(e.detail)+'</div>':'')+
    '<div>'+e.src.filter(id=>sources[id]).map(id=>'<a href="'+escapeHtml(sources[id].url)+'" target="_blank" rel="noopener noreferrer">['+escapeHtml(id)+']</a>').join(' ')+'</div></div>').join('')+'</section>').join('')||'<p class="empty">Ei suoria yhteysmerkintöjä.</p>';
  document.getElementById('srcHead').textContent='Lähteet ('+sourceIds.length+')';
  document.getElementById('sources').innerHTML=sourceIds.map(id=>'<a target="_blank" rel="noopener noreferrer" href="'+escapeHtml(sources[id].url)+'">['+escapeHtml(id)+'] '+escapeHtml(sources[id].label)+'<small>'+escapeHtml(sources[id].note||'')+'</small></a>').join('')||'<p class="empty">Ei lähteitä.</p>';
}
export function renderSourceArchive(sources){
  document.getElementById('dochead').innerHTML='<div class="breadcrumbs">Arkisto</div><h2>Lähteet</h2><div class="article-kicker">Verkoston julkisten lähteiden arkisto</div>';
  document.getElementById('articleBody').innerHTML='<p>Rappiopedian artikkeleissa ja verkostokartassa käytetyt lähteet.</p>';
  document.getElementById('relhead').textContent='';
  document.getElementById('relations').innerHTML='';
  document.getElementById('srcHead').textContent='Kaikki lähteet ('+Object.keys(sources).length+')';
  document.getElementById('sources').innerHTML=Object.entries(sources).map(([id,s])=>'<a target="_blank" rel="noopener noreferrer" href="'+escapeHtml(s.url)+'">['+escapeHtml(id)+'] '+escapeHtml(s.label)+'<small>'+escapeHtml(s.note||'')+'</small></a>').join('');
}
