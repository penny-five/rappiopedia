/** A short plain-text excerpt from the same Markdown that is shown in the article. */
export function markdownExcerpt(markdown, maxLength = 190) {
  const lines = String(markdown || '').split(/\r?\n/);
  const passage = [];
  for (const line of lines) {
    const text = line.trim();
    if (!text) {
      if (passage.length) break;
      continue;
    }
    if (/^#{1,6}\s/.test(text) || /^---+$/.test(text)) {
      if (passage.length) break;
      continue;
    }
    const bullet = /^([-*]|\d+\.)\s+/.test(text);
    if (bullet && passage.length) break;
    passage.push(text.replace(/^([-*]|\d+\.)\s+/, '').replace(/^>\s+/, ''));
    if (bullet) break;
  }
  const plain = passage.join(' ')
    .replace(/\[\[([a-z0-9_-]+)\|([^\]]+)\]\]/g, '$2')
    .replace(/\[@[A-Za-z0-9_-]+\]/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[*_]/g, '')
    .replace(new RegExp(String.fromCharCode(96), 'g'), '')
    .replace(/\s+/g, ' ')
    .trim();
  if (plain.length <= maxLength) return plain;
  const head = plain.slice(0, maxLength - 1);
  return head.replace(/\s+\S*$/, '').trimEnd() + '…';
}
