type Transformer = (text: string) => string;

function pipe(...transformers: Transformer[]): Transformer {
  return (text: string) => transformers.reduce((acc, fn) => fn(acc), text);
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function renderCodeBlocks(text: string): string {
  return text
    .replace(/```([\s\S]*?)```/g, '<pre class="md-code-block"><code>$1</code></pre>')
    .replace(/`([^`]+)`/g, '<code class="md-inline-code">$1</code>');
}

function renderHeaders(text: string): string {
  return text
    .replace(/^### (.+)$/gm, '<h3 class="md-h3">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="md-h2">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="md-h1">$1</h1>');
}

function renderInlineStyles(text: string): string {
  return text
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/_(.+?)_/g, '<em>$1</em>')
    .replace(/~~(.+?)~~/g, '<del>$1</del>');
}

function renderBlockquotes(text: string): string {
  return text.replace(/^&gt; (.+)$/gm, '<blockquote class="md-blockquote">$1</blockquote>');
}

function renderHorizontalRule(text: string): string {
  return text.replace(/^---$/gm, '<hr class="md-hr">');
}

function renderLists(text: string): string {
  let result = text.replace(/^[\*\-] (.+)$/gm, '<li class="md-li">$1</li>');
  result = result.replace(/(<li class="md-li">[\s\S]*?<\/li>)/g, '<ul class="md-ul">$1</ul>');
  result = result.replace(/^\d+\. (.+)$/gm, '<li class="md-li md-ol-li">$1</li>');
  return result;
}

function renderCheckboxes(text: string): string {
  return text
    .replace(/\[x\] (.+)/gi, '<span class="md-checkbox md-checked">&#10003; $1</span>')
    .replace(/\[ \] (.+)/g, '<span class="md-checkbox">&#9744; $1</span>');
}

function renderLinks(text: string): string {
  return text.replace(/\[(.+?)\]\((.+?)\)/g,
    '<a href="$2" class="md-link" target="_blank" rel="noopener">$1</a>');
}

function wrapParagraphs(text: string): string {
  let result = text
    .replace(/\n{2,}/g, '</p><p class="md-p">')
    .replace(/\n/g, '<br>');

  result = '<p class="md-p">' + result + '</p>';
  result = result.replace(/<p class="md-p"><\/p>/g, '');
  return result;
}

export function renderMarkdown(text: string): string {
  if (!text) {
    return '<p class="md-empty">Sem conteúdo. Clique em "Editar" para adicionar notas.</p>';
  }

  const transform = pipe(
    escapeHtml,
    renderCodeBlocks,
    renderHeaders,
    renderInlineStyles,
    renderBlockquotes,
    renderHorizontalRule,
    renderLists,
    renderCheckboxes,
    renderLinks,
    wrapParagraphs,
  );

  return transform(text);
}
