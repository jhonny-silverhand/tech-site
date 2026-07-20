import { slugify } from '@/lib/utils';

function extractHeadings(markdown: string): { id: string; text: string }[] {
  const headings: { id: string; text: string }[] = [];
  for (const line of markdown.split('\n')) {
    const match = line.match(/^##\s+(.+)$/);
    if (match) {
      const text = match[1].trim();
      headings.push({ id: slugify(text), text });
    }
  }
  return headings;
}

export function TableOfContents({ content }: { content: string }) {
  const headings = extractHeadings(content);
  if (headings.length < 2) return null;
  return (
    <nav className="rounded-folder border border-line bg-paper p-4 mb-8">
      <p className="font-mono text-[11px] uppercase tracking-wide text-muted mb-2">On this page</p>
      <ul className="space-y-1.5">
        {headings.map((h) => (
          <li key={h.id}>
            <a href={`#${h.id}`} className="text-[13.5px] text-ink/80 hover:text-accent transition-colors">
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
