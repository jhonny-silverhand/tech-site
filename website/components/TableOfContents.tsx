import { headingsOf } from '@/lib/utils';

export function TableOfContents({ content }: { content: string }) {
  const headings = headingsOf(content);
  if (headings.length < 2) return null;
  return (
    <aside aria-label="Table of contents" className="card p-4">
      <p className="t-meta text-muted">On this page</p>
      <ul className="mt-3 space-y-1 text-[13px] leading-relaxed">
        {headings.map((h) => (
          <li key={h.id} className={h.level === 3 ? 'pl-3.5' : ''}>
            <a
              href={`#${h.id}`}
              className="block truncate rounded-sm border-l-2 border-transparent py-0.5 pl-2.5 text-muted hover:border-accent hover:text-ink"
              title={h.text}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
      <p className="t-numeric mt-3 border-t border-line pt-3 font-mono text-[10px] text-faint">
        {headings.length} sections · ~{Math.max(1, Math.round(content.length / 5000))} min
      </p>
    </aside>
  );
}
