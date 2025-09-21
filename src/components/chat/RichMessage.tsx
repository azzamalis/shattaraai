import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';

interface RichMessageProps {
  content: string;
  className?: string;
}

// Normalize raw AI text into clean Markdown so it renders clearly
function normalizeContent(text: string): string {
  if (!text) return '';
  let t = text;

  // Convert Unicode bullets to markdown bullets and ensure line breaks
  t = t.replace(/[\t ]*•[\t ]*/g, '\n- ');

  // Ensure numbered lists break onto new lines
  t = t.replace(/(\d+\.\s)/g, '\n$1');

  // Promote common section labels to headings
  const h2Labels = [
    'Key ideas',
    'Simple step-by-step process',
    'Why it matters',
    'Overview',
    'Summary'
  ];
  const h3Labels = ['Quick example', 'Example', 'Practice'];

  for (const label of h2Labels) {
    const re = new RegExp(`(^|\\n)${label}:?`, 'gi');
    t = t.replace(re, (m, p1) => `${p1}\n## ${label}`);
  }
  for (const label of h3Labels) {
    const re = new RegExp(`(^|\\n)${label}:?`, 'gi');
    t = t.replace(re, (m, p1) => `${p1}\n### ${label}`);
  }

  // Add blank line before headings for Markdown
  t = t.replace(/\n(##?\#?\s)/g, '\n\n$1');

  // Collapse excessive blank lines
  t = t.replace(/\n{3,}/g, '\n\n');

  return t.trim();
}

export function RichMessage({ content, className }: RichMessageProps) {
  const md = normalizeContent(content);

  return (
    <div className={cn(className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ node, ...props }) => (
            <h1 className="text-base font-bold text-foreground mb-2" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="text-base font-semibold text-foreground mb-2" {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 className="text-sm font-semibold text-foreground mb-1" {...props} />
          ),
          p: ({ node, ...props }) => (
            <p className="text-sm leading-relaxed text-foreground mb-2" {...props} />
          ),
          ul: ({ node, ...props }) => (
            <ul className="list-disc pl-5 mb-2 text-foreground/90" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="list-decimal pl-5 mb-2 text-foreground/90" {...props} />
          ),
          li: ({ node, ...props }) => <li className="text-sm mb-1" {...props} />,
          blockquote: ({ node, ...props }) => (
            <blockquote className="border-l-2 border-border pl-3 italic text-muted-foreground mb-2" {...props} />
          ),
          a: ({ node, ...props }) => (
            <a className="text-primary underline underline-offset-2" target="_blank" rel="noreferrer" {...props} />
          ),
          code: ({ className, children, ...props }) => (
            <code
              className={cn(
                'rounded bg-muted px-1 py-0.5 text-xs text-foreground',
                className
              )}
              {...props}
            >
              {children}
            </code>
          ),
          pre: ({ node, ...props }) => (
            <pre className="bg-muted text-foreground p-3 rounded-md overflow-x-auto text-xs" {...props} />
          ),
          hr: (props) => <hr className="my-3 border-border" {...props} />
        }}
      >
        {md}
      </ReactMarkdown>
    </div>
  );
}

export default RichMessage;
