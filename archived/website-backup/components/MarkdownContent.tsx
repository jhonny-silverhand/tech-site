import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import type { CSSProperties } from 'react';

interface MarkdownContentProps {
  content: string;
  /** Niche color for this article — tints blockquote borders and table
   * header accents via the --niche-accent custom property (see
   * .prose-tech blockquote / .prose-tech th in globals.css). Code blocks
   * deliberately stay a consistent neutral blue regardless of niche —
   * code needs to read the same everywhere, so that one isn't tinted. */
  accentColor?: string;

  //fixing type error
  /** Enables finance-specific figure highlighting */
  highlightFigures?: boolean;

  /** Enables AI Tools-specific citation styling */
  citationStyle?: boolean;
}

export function MarkdownContent({ content, accentColor }: MarkdownContentProps) {
  const style = accentColor ? ({ '--niche-accent': accentColor } as CSSProperties) : undefined;
  return (
    <div className="prose-tech" style={style}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSlug, rehypeHighlight]}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
