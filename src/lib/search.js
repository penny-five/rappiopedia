import { nodeFallbackMarkup } from './node-fallback.js';
/** Render a safe, two-line search result with its saved image when available. */
function searchEscape(value){
 return String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
}
export function searchSuggestionMarkup(node,index,active,description,optionPrefix='search-option'){
 const name=String(node.name??'');
 const fallback=nodeFallbackMarkup(node,1);
 const picture=node.image?`<img class="search-avatar-image" src="${searchEscape(node.image)}" alt="" loading="lazy" decoding="async">`:'';
 return `<button type="button" id="${searchEscape(optionPrefix)}-${index}" role="option" aria-selected="${active}" class="search-suggestion${active?' active':''}" data-search-id="${searchEscape(node.id)}"><span class="search-avatar" aria-hidden="true"><span class="search-avatar-fallback">${fallback}</span>${picture}</span><span class="search-copy"><span class="search-name">${searchEscape(name)}</span><span class="search-category">${searchEscape(description)}</span></span></button>`;
}

/** Return a bounded Damerau-Levenshtein distance (including adjacent typos). */
function typoDistance(a, b, maxDistance) {
  const left = [...a], right = [...b];
  if (Math.abs(left.length - right.length) > maxDistance) return maxDistance + 1;
  let previous = Array.from({ length: right.length + 1 }, (_, i) => i);
  let beforePrevious = null;
  for (let i = 1; i <= left.length; i++) {
    const row = [i];
    for (let j = 1; j <= right.length; j++) {
      let distance = Math.min(
        previous[j] + 1,
        row[j - 1] + 1,
        previous[j - 1] + (left[i - 1] === right[j - 1] ? 0 : 1)
      );
      if (beforePrevious && i > 1 && j > 1 &&
          left[i - 1] === right[j - 2] && left[i - 2] === right[j - 1]) {
        distance = Math.min(distance, beforePrevious[j - 2] + 1);
      }
      row[j] = distance;
    }
    beforePrevious = previous;
    previous = row;
  }
  return Math.min(previous[right.length], maxDistance + 1);
}

function normalizedName(value) {
  return String(value ?? '').normalize('NFKC').toLocaleLowerCase('fi').trim().replace(/\s+/g, ' ');
}

/** Prioritize exact names, prefixes and substrings; fall back to conservative typo matching. */
export function searchNodes(nodes, query, limit = 8) {
  const term = normalizedName(query);
  if (!term || limit <= 0) return [];
  // Short inputs would create too many accidental typo matches.
  const maxDistance = [...term].length >= 9 ? 2 : [...term].length >= 4 ? 1 : 0;
  // Handle a transposed pair plus one other typo, but only for a leading name.
  // Applying this to every word would flood results with unrelated alias matches.
  const letters = [...term], adjacentSwaps = [];
  if (maxDistance && letters.length >= 5 && !term.includes(' ')) {
    for (let i = 0; i < letters.length - 1; i++) {
      if (letters[i] === letters[i + 1]) continue;
      const swapped = letters.slice();
      [swapped[i], swapped[i + 1]] = [swapped[i + 1], swapped[i]];
      adjacentSwaps.push(swapped.join(''));
    }
  }
  return nodes
    .map((node, index) => {
      const name = normalizedName(node.name);
      const at = name.indexOf(term);
      if (at >= 0) {
        const rank = name === term ? 0 : at === 0 ? 1 : /[^\p{L}\p{N}]/u.test(name[at - 1]) ? 2 : 3;
        return { node, name, rank, distance: 0, index };
      }
      if (!maxDistance) return null;
      // Compare the whole name for misspelled multi-word queries and individual
      // words so "juulia" also finds "Julia Willman".
      const words = name.match(/[\p{L}\p{N}]+/gu) ?? [];
      const distance = Math.min(
        typoDistance(term, name, maxDistance),
        ...words.map(word => typoDistance(term, word, maxDistance))
      );
      if (distance <= maxDistance) return { node, name, rank: 4, distance, index };
      if (adjacentSwaps.length && words[0] &&
          adjacentSwaps.some(swapped => typoDistance(swapped, words[0], 1) === 1)) {
        return { node, name, rank: 4, distance: 2, index };
      }
      return null;
    })
    .filter(Boolean)
    .sort((a, b) => a.rank - b.rank || a.distance - b.distance || a.name.localeCompare(b.name, 'fi') || a.index - b.index)
    .slice(0, limit)
    .map(match => match.node);
}
