import React, { useState, useRef, useEffect, useCallback } from "react";
import { Upload, Link2, ArrowLeft, ArrowRight, X, Loader2, FileText, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PasteContentModal } from "../PasteContentModal";
import { toast } from "sonner";
import { useExamResourceUpload, ProcessedExamResource } from "@/hooks/useExamResourceUpload";

interface ExamPrepStepTwoProps {
  currentStep?: number;
  totalSteps?: number;
  onBack: () => void;
  onNext: () => void;
  onSkip: () => void;
  onAdditionalResourcesChange?: (resources: ProcessedExamResource[]) => void;
}

// Re-export the type for backward compatibility
export type ContentItem = ProcessedExamResource;

// Shared progress bar component
function ExamProgressBar({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) {
  return (
    <div className="mb-6 flex justify-center">
      <div className="flex w-1/4 max-w-md gap-2">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div key={index} className="h-1.5 flex-1 rounded-full bg-muted">
            <div
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index < currentStep ? "bg-green-500" : "bg-neutral-200 dark:bg-neutral-800"
              }`}
              style={{ width: "100%" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ExamPrepStepTwo({
  currentStep = 2,
  totalSteps = 3,
  onBack,
  onNext,
  onSkip,
  onAdditionalResourcesChange,
}: ExamPrepStepTwoProps) {
  const [isPasteModalOpen, setIsPasteModalOpen] = useState(false);
  const [contentItems, setContentItems] = useState<ProcessedExamResource[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadAndExtractFile, extractWebsiteContent, isUploading } = useExamResourceUpload();

  // Notify parent component when content items change
  useEffect(() => {
    onAdditionalResourcesChange?.(contentItems);
  }, [contentItems, onAdditionalResourcesChange]);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const resourceId = Math.random().toString(36).substr(2, 9);
    
    // Add item immediately with processing state
    const newItem: ProcessedExamResource = {
      id: resourceId,
      title: file.name,
      type: "file",
      file,
      isProcessing: true,
    };
    
    setContentItems((prev) => [...prev, newItem]);
    toast.info(`Processing "${file.name}"...`);

    // Upload and extract text
    const result = await uploadAndExtractFile(file, resourceId);
    
    if (result) {
      // Update item with extracted content
      setContentItems((prev) => 
        prev.map(item => 
          item.id === resourceId 
            ? { 
                ...item, 
                storageUrl: result.storageUrl, 
                extractedContent: result.extractedContent,
                isProcessing: false 
              }
            : item
        )
      );
      toast.success(`"${file.name}" processed successfully`);
    } else {
      // Mark as failed but keep the item
      setContentItems((prev) => 
        prev.map(item => 
          item.id === resourceId 
            ? { 
                ...item, 
                isProcessing: false,
                processingError: 'Failed to process file'
              }
            : item
        )
      );
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [uploadAndExtractFile]);

  const handlePasteSubmit = useCallback(async (data: { url?: string; text?: string }) => {
    if (data.url) {
      const resourceId = Math.random().toString(36).substr(2, 9);
      
      // Check if it's a YouTube URL
      const isYouTube = data.url.includes('youtube.com') || data.url.includes('youtu.be');
      
      // Add item with processing state
      const newItem: ProcessedExamResource = {
        id: resourceId,
        title: data.url,
        type: "url",
        url: data.url,
        isProcessing: !isYouTube, // Only process non-YouTube URLs
      };
      
      setContentItems((prev) => [...prev, newItem]);
      setIsPasteModalOpen(false);

      if (isYouTube) {
        // For YouTube, we'd need special handling - just store the URL for now
        setContentItems((prev) => 
          prev.map(item => 
            item.id === resourceId 
              ? { 
                  ...item, 
                  extractedContent: `[YouTube video: ${data.url} - transcript extraction available through content page]`,
                  isProcessing: false 
                }
              : item
          )
        );
        toast.success("YouTube URL added");
      } else {
        // Extract website content
        toast.info("Extracting content from website...");
        const extractedContent = await extractWebsiteContent(data.url);
        
        setContentItems((prev) => 
          prev.map(item => 
            item.id === resourceId 
              ? { 
                  ...item, 
                  extractedContent: extractedContent || `[Website: ${data.url} - content extraction failed]`,
                  isProcessing: false,
                  processingError: extractedContent ? undefined : 'Failed to extract content'
                }
              : item
          )
        );
        
        if (extractedContent) {
          toast.success("Website content extracted successfully");
        } else {
          toast.warning("Could not extract website content - URL will still be used as reference");
        }
      }
    } else if (data.text) {
      const newItem: ProcessedExamResource = {
        id: Math.random().toString(36).substr(2, 9),
        title: "Text Content",
        type: "text",
        text: data.text,
        extractedContent: data.text, // Text is already the content
        isProcessing: false,
      };
      setContentItems((prev) => [...prev, newItem]);
      setIsPasteModalOpen(false);
      toast.success("Text content added successfully");
    }
  }, [extractWebsiteContent]);

  const handleRemoveItem = (id: string) => {
    setContentItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Check if any items are still processing
  const hasProcessingItems = contentItems.some(item => item.isProcessing);

  // Get icon based on item type and state
  const getItemIcon = (item: ProcessedExamResource) => {
    if (item.isProcessing) {
      return <Loader2 className="h-4 w-4 text-primary animate-spin" />;
    }
    if (item.type === "file") {
      return <FileText className="h-4 w-4 text-muted-foreground" />;
    }
    if (item.type === "url") {
      return <Globe className="h-4 w-4 text-muted-foreground" />;
    }
    return <FileText className="h-4 w-4 text-muted-foreground" />;
  };

  // Get status text for item
  const getItemStatus = (item: ProcessedExamResource) => {
    if (item.isProcessing) {
      return <span className="text-xs text-primary">Processing...</span>;
    }
    if (item.processingError) {
      return <span className="text-xs text-destructive">{item.processingError}</span>;
    }
    if (item.extractedContent) {
      const charCount = item.extractedContent.length;
      return <span className="text-xs text-muted-foreground">{charCount > 1000 ? `${Math.round(charCount / 1000)}k chars` : `${charCount} chars`}</span>;
    }
    return null;
  };

  const actionCards = [
    {
      icon: Upload,
      title: "Upload",
      subtitle: "File, Audio, Video",
      onClick: handleUploadClick,
    },
    {
      icon: Link2,
      title: "Paste",
      subtitle: "YouTube, Website, Text",
      onClick: () => setIsPasteModalOpen(true),
    },
  ];

  return (
    <div className="flex min-h-[460px] w-full flex-col items-center gap-6 rounded-3xl border-2 border-secondary bg-white px-10 pt-6 shadow-md duration-300 animate-in zoom-in-95 dark:bg-neutral-900/80 dark:shadow-[0_0_8px_rgba(255,255,255,0.1)] sm:min-h-[420px] sm:gap-6 lg:px-24">
      <div className="flex w-full items-center justify-center">
        <div className="w-full max-w-3xl">
          {/* Progress Bar */}
          <ExamProgressBar currentStep={currentStep} totalSteps={totalSteps} />

          <div className="flex flex-col gap-4">
            {/* Title */}
            <h2 className="mt-4 text-center text-xl font-normal leading-relaxed sm:mt-6 sm:text-2xl 2xl:text-3xl text-foreground">
              Have a practice exam or cheatsheet for reference?
            </h2>
            
            {/* Subtitle */}
            <p className="mb-4 text-center text-base text-muted-foreground sm:text-base 2xl:text-lg">
              We will use this to make the exam as accurate as possible
            </p>

            {/* Action Cards */}
            <div className="flex w-full flex-col items-center justify-center">
              <div className="z-30 flex flex-col text-center w-full md:max-w-[640px] xl:max-w-[672px]">
                <div className="grid w-full grid-cols-2 gap-3 sm:flex sm:items-center sm:justify-center">
                  {actionCards.map((card) => (
                    <div key={card.title + card.subtitle} className="w-full min-w-0 sm:flex-1">
                      <div
                        onClick={card.onClick}
                        className="text-card-foreground group relative cursor-pointer rounded-3xl border border-neutral-200 bg-white shadow-[0_4px_10px_rgba(0,0,0,0.04)] transition-colors duration-200 focus-within:border hover:border-neutral-300/50 hover:bg-neutral-200/40 dark:border-neutral-800 dark:bg-neutral-800/50 dark:shadow-[0_4px_10px_rgba(0,0,0,0.06)] dark:hover:border-neutral-700/20 dark:hover:bg-neutral-700/50"
                      >
                        <div className="flex flex-col items-start justify-center gap-y-2 p-4 sm:h-[108px] sm:flex-col">
                          <div className="flex flex-row items-center gap-2.5 sm:block sm:space-y-2">
                            <card.icon className="h-5 w-5 flex-shrink-0 text-primary/70 transition-colors group-hover:text-primary dark:text-primary/80 sm:mb-2 sm:h-6 sm:w-6" />
                            <div className="flex flex-col justify-center gap-0.5 sm:gap-0">
                              <h3 className="text-left text-sm font-medium text-primary/70 transition-colors group-hover:text-primary dark:text-primary/80 sm:text-base">
                                {card.title}
                              </h3>
                              <p className="line-clamp-1 text-left text-xs text-primary/50 transition-colors group-hover:text-primary/80 dark:text-primary/60 sm:text-sm">
                                {card.subtitle}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Content Items List */}
            {contentItems.length > 0 && (
              <div className="w-full max-w-2xl mx-auto mt-4">
                <div className="space-y-2">
                  {contentItems.map((item) => (
                    <div
                      key={item.id}
                      className={`flex items-center justify-between p-3 border rounded-xl transition-colors ${
                        item.isProcessing 
                          ? 'bg-primary/5 border-primary/20 dark:bg-primary/10' 
                          : item.processingError
                            ? 'bg-destructive/5 border-destructive/20'
                            : 'bg-neutral-50 dark:bg-neutral-800/50 border-neutral-200 dark:border-neutral-700'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        {getItemIcon(item)}
                        <div className="flex flex-col min-w-0">
                          <span className="text-sm text-foreground truncate">{item.title}</span>
                          {getItemStatus(item)}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveItem(item.id)}
                        disabled={item.isProcessing}
                        className="h-8 w-8 p-0 hover:bg-accent shrink-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="mb-6 mt-4 flex flex-row justify-center gap-3">
              <Button onClick={onBack} variant="outline" size="icon" className="h-10 w-10 rounded-lg">
                <ArrowLeft className="h-4 w-4" strokeWidth={2.5} />
              </Button>
              <Button onClick={onSkip} variant="ghost" className="gap-1 rounded-lg">
                Skip
              </Button>
              <Button 
                onClick={onNext} 
                className="gap-1 rounded-lg"
                disabled={hasProcessingItems}
              >
                {hasProcessingItems && <Loader2 className="h-4 w-4 animate-spin" />}
                <span>Continue</span>
                {!hasProcessingItems && <ArrowRight className="h-4 w-4" strokeWidth={2.5} />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.ppt,.pptx,.doc,.docx,.txt,audio/*,video/*"
        onChange={handleFileSelect}
        style={{ display: "none" }}
      />

      <PasteContentModal
        isOpen={isPasteModalOpen}
        onClose={() => setIsPasteModalOpen(false)}
        onSubmit={handlePasteSubmit}
      />
    </div>
  );
}
