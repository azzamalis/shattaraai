import React, { memo, useMemo } from 'react';
import ReactMarkdown, { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import { marked } from 'marked';
import { cn } from '@/lib/utils';
import { CodeBlock, CodeBlockCode } from '@/components/prompt-kit/code-block';

interface RichMessageProps {
  content: string;
  className?: string;
}

// Parse markdown into blocks for better performance
function parseMarkdownIntoBlocks(markdown: string): string[] {
  const tokens = marked.lexer(markdown);
  return tokens.map((token) => token.raw);
}

// Extract language from className
function extractLanguage(className?: string): string {
  if (!className) return "plaintext";
  const match = className.match(/language-(\w+)/);
  return match ? match[1] : "plaintext";
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

  // Add single blank line before headings for Markdown
  t = t.replace(/\n(##?\#?\s)/g, '\n$1');

  // Collapse excessive blank lines to single line
  t = t.replace(/\n{2,}/g, '\n');

  return t.trim();
}

// Enhanced markdown components with code highlighting
const markdownComponents: Partial<Components> = {
  code: function CodeComponent({ className, children, ...props }) {
    const isInline =
      !props.node?.position?.start.line ||
      props.node?.position?.start.line === props.node?.position?.end.line;

    if (isInline) {
      return (
        <code
          className={cn(
            'rounded bg-muted px-1 py-0.5 text-xs text-foreground',
            className
          )}
          {...props}
        >
          {children}
        </code>
      );
    }

    const language = extractLanguage(className);

    return (
      <CodeBlock className={className}>
        <CodeBlockCode code={children as string} language={language} />
      </CodeBlock>
    );
  },
  pre: function PreComponent({ children }) {
    return <>{children}</>;
  },
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
    <p className="text-sm leading-relaxed text-foreground mb-1" {...props} />
  ),
  ul: ({ node, ...props }) => (
    <ul className="list-disc pl-5 mb-1 text-foreground/90" {...props} />
  ),
  ol: ({ node, ...props }) => (
    <ol className="list-decimal pl-5 mb-1 text-foreground/90" {...props} />
  ),
  li: ({ node, ...props }) => <li className="text-sm mb-1" {...props} />,
  blockquote: ({ node, ...props }) => (
    <blockquote className="border-l-2 border-border pl-3 italic text-muted-foreground mb-2" {...props} />
  ),
  a: ({ node, ...props }) => (
    <a className="text-primary underline underline-offset-2" target="_blank" rel="noreferrer" {...props} />
  ),
  hr: (props) => <hr className="my-3 border-border" {...props} />
};

// Memoized markdown block for better performance
const MemoizedMarkdownBlock = memo(
  function MarkdownBlock({ content }: { content: string }) {
    return (
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        components={markdownComponents}
      >
        {content}
      </ReactMarkdown>
    );
  },
  function propsAreEqual(prevProps, nextProps) {
    return prevProps.content === nextProps.content;
  }
);

MemoizedMarkdownBlock.displayName = "MemoizedMarkdownBlock";

function RichMessageComponent({ content, className }: RichMessageProps) {
  const normalizedContent = useMemo(() => normalizeContent(content), [content]);
  const blocks = useMemo(() => parseMarkdownIntoBlocks(normalizedContent), [normalizedContent]);

  return (
    <div className={cn("prose prose-sm dark:prose-invert max-w-none", className)}>
      {blocks.map((block, index) => (
        <MemoizedMarkdownBlock
          key={`block-${index}`}
          content={block}
        />
      ))}
    </div>
  );
}

export const RichMessage = memo(RichMessageComponent);
RichMessage.displayName = "RichMessage";

export default RichMessage;
