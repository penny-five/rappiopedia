/** Shared, category-based image placeholders; SVG strokes match the navigation icons. */
const CATEGORY_ICONS=Object.freeze({
 show:'<rect x="3" y="4" width="18" height="15" rx="2"/><path d="m10 8 5 3.5-5 3.5zM8 22h8m-4-3v3"/>',
 event:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 10h18m5 4h3m2 0h3m-8 3h3"/>',
 org:'<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M9 21v-4h6v4M8 8h2m4 0h2M8 12h2m4 0h2"/>',
 platform:'<path d="m12 3 9 5-9 5-9-5 9-5Zm-9 9 9 5 9-5M3 16l9 5 9-5"/>',
 channel:'<circle cx="12" cy="12" r="2"/><path d="M7.8 7.8a6 6 0 0 0 0 8.4m8.4-8.4a6 6 0 0 1 0 8.4M4.5 4.5a10.5 10.5 0 0 0 0 15m15-15a10.5 10.5 0 0 1 0 15"/>',
 site:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c-3 3-4.5 6-4.5 9s1.5 6 4.5 9M12 3c3 3 4.5 6 4.5 9s-1.5 6-4.5 9"/>',
 service:'<path d="M7 19h11a4 4 0 0 0 .5-8A7 7 0 0 0 5 13a3.2 3.2 0 0 0 2 6Z"/>',
 media:'<path d="M6 3h8l5 5v13H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm8 0v5h5M8 13h8M8 17h8"/>',
 place:'<path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
 film:'<rect x="3" y="9" width="18" height="12" rx="2"/><path d="M3 9V5l17-3 1 5-18 3Zm3-5 4 5m3-6 4 5"/>',
 project:'<path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v10H3V7Z"/><path d="M8 12h8m-8 3h5"/>',
 meme:'<circle cx="12" cy="12" r="9"/><path d="M8 14c1 2 3 3 4 3s3-1 4-3M8 9h.01M16 9h.01"/>',
 concept:'<path d="M9 18h6m-6 3h6M8 14c-1.4-1.2-2-2.7-2-4.5a6 6 0 1 1 12 0c0 1.8-.6 3.3-2 4.5l-1 2H9l-1-2Z"/>',
});

function escapeHtml(value){
 return String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

/** Name initials for people, descriptive SVG icons for every other category. */
export function nodeFallbackMarkup(node,initialCount=2){
 if(node?.cat && node.cat!=='person'){
  const paths=CATEGORY_ICONS[node.cat]??CATEGORY_ICONS.concept;
  return `<svg class="entity-fallback-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${paths}</svg>`;
 }
 const initials=String(node?.name??'').replace(/[^\p{L}\p{N} ]/gu,' ').trim().split(/\s+/).filter(Boolean).slice(0,initialCount).map(word=>word[0]).join('').toLocaleUpperCase('fi');
 return escapeHtml(initials||'?');
}
