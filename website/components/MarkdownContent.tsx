import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeHighlight from 'rehype-highlight';

export function MarkdownContent({ source, id }: { source: string; id?: string }) {
  return (
    <div id={id} className="prose-tech">
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSlug, rehypeHighlight]}>
        {source}
      </ReactMarkdown>
    </div>
  );
}
