import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Copy, Volume2, FileText, FileDown } from 'lucide-react';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface CheatSheetSummaryDisplayProps {
  summaryContent: string;
  onBack?: () => void;
  contentId?: string;
}

const CheatSheetSummaryDisplay: React.FC<CheatSheetSummaryDisplayProps> = ({
  summaryContent,
  onBack,
  contentId
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(summaryContent);
      toast.success('Summary copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy summary');
    }
  };

  const handleTextToSpeech = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(summaryContent);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  const handleExportPDF = () => {
    toast.info('PDF export coming soon');
  };

  const handleExportNotes = () => {
    toast.info('Notes export coming soon');
  };

  return (
    <div className="h-[calc(100vh-165px)] overflow-y-auto md:h-[calc(100vh-120px)]">
      <div className="mx-auto w-full max-w-3xl">
        <div className="flex h-full flex-col">
          {/* Sticky Header with Back Button */}
          <div className="sticky top-0 z-10 shrink-0 bg-background px-4 pb-2">
            <Button
              variant="ghost"
              onClick={onBack}
              className="justify-center whitespace-nowrap text-sm font-medium mt-0 flex h-fit w-fit items-center gap-2 bg-transparent p-0 text-muted-foreground hover:bg-transparent hover:text-accent-foreground"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="text-sm">Back</span>
            </Button>
          </div>

          {/* Content Area */}
          <div className="relative flex-1 overflow-y-auto">
            <div className="px-4">
              <div
                id={`print-content-cheatsheet-${contentId}`}
                className="flex w-full flex-col"
              >
                <div className="w-full">
                  <div className="flex w-full justify-start">
                    <div className="w-full" style={{ position: 'relative' }}>
                      <div className="relative rounded-3xl text-left leading-relaxed text-primary/95 mt-0 max-w-full border-none w-full group bg-transparent p-0 pt-1">
                        <div className="markdown-body prose prose-neutral dark:prose-invert max-w-none">
                          <div className="space-y-4">
                            <ReactMarkdown
                              remarkPlugins={[remarkGfm]}
                              components={{
                                // Horizontal rules for section dividers
                                hr: () => (
                                  <hr className="my-8 border-t border-border/50 dark:border-primary/10" />
                                ),
                                // Headers - bold section titles
                                h1: ({ children }) => (
                                  <p className="text-base leading-7 last:mb-0">
                                    <strong className="font-semibold text-lg">{children}</strong>
                                  </p>
                                ),
                                h2: ({ children }) => (
                                  <p className="text-base leading-7 last:mb-0 mt-4">
                                    <strong className="font-semibold">{children}</strong>
                                  </p>
                                ),
                                h3: ({ children }) => (
                                  <p className="text-base leading-7 last:mb-0 mt-3">
                                    <strong className="font-semibold">{children}</strong>
                                  </p>
                                ),
                                // Paragraphs
                                p: ({ children }) => (
                                  <p className="text-base leading-7 last:mb-0">{children}</p>
                                ),
                                // Bold text
                                strong: ({ children }) => (
                                  <strong className="font-semibold">{children}</strong>
                                ),
                                // Bullet lists - compact cheat sheet style
                                ul: ({ children }) => (
                                  <ul className="list-outside list-disc pl-5 space-y-1">{children}</ul>
                                ),
                                ol: ({ children }) => (
                                  <ol className="list-outside list-decimal pl-5 space-y-1">{children}</ol>
                                ),
                                li: ({ children }) => (
                                  <li className="leading-7">{children}</li>
                                ),
                                // Tables for cheat sheet comparisons
                                table: ({ children }) => (
                                  <div className="my-6 overflow-x-auto rounded-lg border border-border/50 dark:border-primary/10">
                                    <table className="min-w-full divide-y divide-border/50 dark:divide-border/30">
                                      {children}
                                    </table>
                                  </div>
                                ),
                                thead: ({ children }) => (
                                  <thead className="bg-muted/80">{children}</thead>
                                ),
                                tbody: ({ children }) => (
                                  <tbody className="divide-y divide-border bg-muted/40">{children}</tbody>
                                ),
                                tr: ({ children }) => (
                                  <tr className="border-border border-b">{children}</tr>
                                ),
                                th: ({ children }) => (
                                  <th className="border-b border-r border-border/50 bg-muted/50 px-4 py-3 text-left text-sm font-semibold last:border-r-0 dark:border-primary/10">
                                    {children}
                                  </th>
                                ),
                                td: ({ children }) => (
                                  <td className="border-b border-r border-border/50 px-4 py-3 text-sm last:border-r-0 dark:border-primary/10">
                                    {children}
                                  </td>
                                ),
                                // Blockquotes for key insights
                                blockquote: ({ children }) => (
                                  <blockquote className="my-4 rounded-r-md border-l-4 border-border/50 bg-muted/30 px-4 py-2 dark:border-primary/10">
                                    {children}
                                  </blockquote>
                                ),
                                // Code for inline emphasis
                                code: ({ children }) => (
                                  <code className="rounded bg-muted px-1.5 py-0.5 text-sm font-medium">
                                    {children}
                                  </code>
                                ),
                                // Links
                                a: ({ href, children }) => (
                                  <a
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary underline hover:text-primary/80"
                                  >
                                    {children}
                                  </a>
                                ),
                              }}
                            >
                              {summaryContent}
                            </ReactMarkdown>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="py-3">
                <div className="flex flex-row items-center justify-between space-x-1">
                  <div className="flex flex-row items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleCopy}
                      className="h-7 w-7 p-1.5 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleTextToSpeech}
                      className={`h-7 w-7 p-1.5 text-muted-foreground hover:bg-accent hover:text-accent-foreground ${
                        isSpeaking ? 'text-primary' : ''
                      }`}
                    >
                      <Volume2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleExportNotes}
                      className="h-7 w-7 p-1.5 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    >
                      <FileText className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleExportPDF}
                      className="h-7 w-7 p-1.5 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    >
                      <FileDown className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheatSheetSummaryDisplay;
