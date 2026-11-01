/** The article body contains prose only. The separate relationship panel owns graph edges. */
export function fallbackArticle(node) {
  return String(node?.note || '').trim();
}

/** Prefer authored Markdown; otherwise use only the node's standalone description. */
export function articleMarkdownFor(node, authoredArticles) {
  return authoredArticles['./articles/' + node.id + '.md'] || fallbackArticle(node);
}
