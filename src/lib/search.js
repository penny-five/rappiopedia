/** Render a safe, two-line search result with its saved image when available. */
function searchEscape(value){
 return String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
}
export function searchSuggestionMarkup(node,index,active,description){
 const name=String(node.name??'');
 const initial=[...name.trim()][0]?.toLocaleUpperCase('fi')||'?';
 const picture=node.image?`<img class="search-avatar-image" src="${searchEscape(node.image)}" alt="" loading="lazy" decoding="async">`:'';
 return `<button type="button" id="search-option-${index}" role="option" aria-selected="${active}" class="search-suggestion${active?' active':''}" data-search-id="${searchEscape(node.id)}"><span class="search-avatar" aria-hidden="true"><span class="search-avatar-fallback">${searchEscape(initial)}</span>${picture}</span><span class="search-copy"><span class="search-name">${searchEscape(name)}</span><span class="search-category">${searchEscape(description)}</span></span></button>`;
}

/** Rank search suggestions: name prefixes first, then word prefixes, then other matches. */
export function searchNodes(nodes, query, limit = 8) {
  const term = String(query ?? '').trim().toLocaleLowerCase('fi');
  if (!term || limit <= 0) return [];
  return nodes
    .map((node, index) => {
      const name = node.name.toLocaleLowerCase('fi');
      const at = name.indexOf(term);
      if (at < 0) return null;
      const rank = at === 0 ? 0 : /[^\p{L}\p{N}]/u.test(name[at - 1]) ? 1 : 2;
      return { node, name, rank, index };
    })
    .filter(Boolean)
    .sort((a, b) => a.rank - b.rank || a.name.localeCompare(b.name, 'fi') || a.index - b.index)
    .slice(0, limit)
    .map(match => match.node);
}
