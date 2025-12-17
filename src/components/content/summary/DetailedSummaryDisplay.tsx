import React, { useState } from 'react';
import { ChevronLeft, Copy, Volume2, FileText, FileDown, FlaskConical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { SAMPLE_MARKDOWN_CONTENT, SAMPLE_KEY_POINTS } from './sampleMarkdownContent';

interface DetailedSummaryDisplayProps {
  summary: string;
  keyPoints?: string[];
  onBack?: () => void;
  title?: string;
  testMode?: boolean;
}

export function DetailedSummaryDisplay({ 
  summary, 
  keyPoints = [], 
  onBack,
  title,
  testMode: initialTestMode = false
}: DetailedSummaryDisplayProps) {
  const [isTestMode, setIsTestMode] = useState(initialTestMode);
  const displaySummary = isTestMode ? SAMPLE_MARKDOWN_CONTENT : summary;
  const displayKeyPoints = isTestMode ? SAMPLE_KEY_POINTS : keyPoints;
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(displaySummary);
      setIsCopied(true);
      toast.success('Summary copied to clipboard');
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy summary');
    }
  };

  const handleTextToSpeech = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(displaySummary);
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
      toast.success('Reading summary aloud...');
    } else {
      toast.error('Text-to-speech not supported');
    }
  };

  const handleExportPDF = () => {
    toast.info('PDF export coming soon');
  };

  const handleAddToNotes = () => {
    toast.info('Add to notes coming soon');
  };

  const toggleTestMode = () => {
    setIsTestMode(!isTestMode);
    toast.success(isTestMode ? 'Test mode disabled' : 'Test mode enabled - showing sample markdown');
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
              <div className="flex w-full flex-col">
                <div className="w-full">
                  <div className="relative rounded-3xl text-left leading-relaxed text-primary/95 mt-0 max-w-full border-none w-full group bg-transparent p-0 pt-1">
                    {/* Markdown Content */}
                    <div className="markdown-body prose prose-neutral dark:prose-invert max-w-none">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          h1: ({ children }) => (
                            <h1 className="mb-4 mt-8 text-2xl font-bold first:mt-0 text-foreground">
                              {children}
                            </h1>
                          ),
                          h2: ({ children }) => (
                            <h2 className="mb-3 mt-6 text-xl font-semibold first:mt-0 text-foreground">
                              {children}
                            </h2>
                          ),
                          h3: ({ children }) => (
                            <h3 className="mb-2 mt-4 text-lg font-semibold text-foreground">
                              {children}
                            </h3>
                          ),
                          p: ({ children }) => (
                            <p className="text-base leading-7 last:mb-0 text-foreground/90 mb-4">
                              {children}
                            </p>
                          ),
                          strong: ({ children }) => (
                            <strong className="font-semibold text-foreground">
                              {children}
                            </strong>
                          ),
                          blockquote: ({ children }) => (
                            <blockquote className="my-6 rounded-r-md border-l-4 border-primary/30 bg-primary/5 px-6 py-3 dark:border-primary/20 dark:bg-primary/10">
                              {children}
                            </blockquote>
                          ),
                          ul: ({ children }) => (
                            <ul className="list-outside list-disc pl-5 my-4 space-y-2">
                              {children}
                            </ul>
                          ),
                          ol: ({ children }) => (
                            <ol className="list-outside list-decimal pl-5 my-4 space-y-2">
                              {children}
                            </ol>
                          ),
                          li: ({ children }) => (
                            <li className="leading-7 text-foreground/90">
                              {children}
                            </li>
                          ),
                          table: ({ children }) => (
                            <div className="my-6 overflow-x-auto rounded-lg border border-border/50 dark:border-primary/10">
                              <table className="min-w-full divide-y divide-border/50 dark:divide-border/30">
                                {children}
                              </table>
                            </div>
                          ),
                          thead: ({ children }) => (
                            <thead className="bg-muted/80">
                              {children}
                            </thead>
                          ),
                          tbody: ({ children }) => (
                            <tbody className="divide-y divide-border bg-muted/40">
                              {children}
                            </tbody>
                          ),
                          tr: ({ children }) => (
                            <tr className="border-border border-b">
                              {children}
                            </tr>
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
                          code: ({ children, className }) => {
                            const isInline = !className;
                            if (isInline) {
                              return (
                                <code className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono text-primary">
                                  {children}
                                </code>
                              );
                            }
                            return (
                              <code className="block rounded-lg bg-muted p-4 text-sm font-mono overflow-x-auto">
                                {children}
                              </code>
                            );
                          },
                          hr: () => (
                            <hr className="my-8 border-border/50" />
                          ),
                        }}
                      >
                        {displaySummary}
                      </ReactMarkdown>
                    </div>

                    {/* Key Points Section */}
                    {displayKeyPoints && displayKeyPoints.length > 0 && (
                      <div className="mt-8 p-4 rounded-xl bg-muted/30 border border-border/50">
                        <h3 className="text-lg font-semibold mb-3 text-foreground">
                          📌 Key Takeaways
                        </h3>
                        <ul className="space-y-2">
                          {displayKeyPoints.map((point, index) => (
                            <li 
                              key={index} 
                              className="flex items-start gap-2 text-foreground/90"
                            >
                              <span className="text-primary font-medium shrink-0">•</span>
                              <span className="text-base leading-relaxed">{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="py-3 sticky bottom-0 bg-background">
                <div className="flex flex-row items-center justify-between space-x-1">
                  <div className="flex flex-row items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 p-1.5 text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-lg"
                      onClick={handleCopy}
                    >
                      <Copy className={cn("h-4 w-4", isCopied && "text-green-500")} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 p-1.5 text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-lg"
                      onClick={handleTextToSpeech}
                    >
                      <Volume2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 p-1.5 text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-lg"
                      onClick={handleAddToNotes}
                    >
                      <FileText className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 p-1.5 text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-lg"
                      onClick={handleExportPDF}
                    >
                      <FileDown className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleTestMode}
                    className={`h-7 px-2 text-xs gap-1 ${isTestMode ? 'text-primary bg-primary/10' : 'text-muted-foreground'}`}
                  >
                    <FlaskConical className="h-3.5 w-3.5" />
                    Test
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
