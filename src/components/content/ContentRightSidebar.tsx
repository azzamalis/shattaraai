import React, { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, StickyNote, ReceiptText, BookCheck, GalleryVerticalEnd, ListTodo } from "lucide-react";
import AIChat from "@/components/recording/AIChat";
import QuizPreferences from '@/components/recording/QuizPreferences';
import Notes from '@/components/recording/Notes';
import { FlashcardContainer } from './FlashcardContainer';
import { SummaryDisplay } from './SummaryDisplay';
import { ContentData } from '@/pages/ContentPage';
import { cn } from '@/lib/utils';
import { FlashcardData } from './Flashcard';
import RealtimeChaptersDisplay from './RealtimeChaptersDisplay';
import { GenerationPrompt } from './GenerationPrompt';
import { FlashcardConfigModal } from './FlashcardConfigModal';
import { QuizConfigModal } from './QuizConfigModal';
import { SummaryConfigModal } from './SummaryConfigModal';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ContentRightSidebarProps {
  contentData: ContentData;
}
export function ContentRightSidebar({
  contentData
}: ContentRightSidebarProps) {
  const [activeTab, setActiveTab] = useState("chat");
  const [isRecording, setIsRecording] = useState(false);

  // Generation states
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationType, setGenerationType] = useState<'flashcards' | 'quizzes' | 'summary' | null>(null);
  
  // Data states
  const [flashcards, setFlashcards] = useState<FlashcardData[]>([]);
  const [quizData, setQuizData] = useState<any>(null);
  const [summaryData, setSummaryData] = useState<{ summary: string; keyPoints: string[] } | null>(null);
  
  // Config modal states
  const [showFlashcardConfig, setShowFlashcardConfig] = useState(false);
  const [showQuizConfig, setShowQuizConfig] = useState(false);
  const [showSummaryConfig, setShowSummaryConfig] = useState(false);
  
  // Config states
  const [flashcardConfig, setFlashcardConfig] = useState({
    numberOfCards: 20,
    difficulty: 'medium' as 'easy' | 'medium' | 'hard',
    includeHints: true,
    includeExplanations: true,
    focusOnKeyConcepts: true
  });
  
  const [quizConfig, setQuizConfig] = useState({
    numberOfQuestions: 15,
    difficulty: 'medium' as 'easy' | 'medium' | 'hard',
    includeExplanations: true,
    questionTypes: {
      multipleChoice: true,
      trueFalse: true,
      shortAnswer: false
    }
  });
  
  const [summaryConfig, setSummaryConfig] = useState({
    length: 'standard' as 'brief' | 'standard' | 'detailed',
    focusAreas: {
      keyPoints: true,
      mainTopics: true,
      examples: false,
      definitions: false,
      all: false
    },
    format: 'bullets' as 'bullets' | 'paragraphs'
  });

  // Fetch existing data on mount
  useEffect(() => {
    if (contentData?.id) {
      fetchFlashcards();
      fetchQuizzes();
      checkSummary();
    }
  }, [contentData?.id]);

  const fetchFlashcards = async () => {
    try {
      const { data, error } = await supabase
        .from('flashcards')
        .select('*')
        .eq('content_id', contentData.id)
        .order('created_at', { ascending: true });

      if (error) throw error;

      if (data && data.length > 0) {
        const formattedCards: FlashcardData[] = data.map((card, index) => ({
          id: card.id,
          question: card.question,
          answer: card.answer,
          hint: card.hint || undefined,
          explanation: card.explanation || undefined,
          concept: card.concept,
          timeSpent: 0,
          correct: true,
          isStarred: false
        }));
        setFlashcards(formattedCards);
      }
    } catch (error) {
      console.error('Error fetching flashcards:', error);
    }
  };

  const fetchQuizzes = async () => {
    try {
      const { data, error } = await supabase
        .from('quizzes')
        .select('*')
        .eq('content_id', contentData.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      if (data) setQuizData(data);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    }
  };

  const checkSummary = async () => {
    if (contentData.ai_summary && contentData.summary_key_points) {
      setSummaryData({
        summary: contentData.ai_summary,
        keyPoints: contentData.summary_key_points as string[]
      });
    }
  };

  const handleGenerateFlashcards = async () => {
    setIsGenerating(true);
    setGenerationType('flashcards');
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-flashcards', {
        body: {
          contentId: contentData.id,
          config: flashcardConfig
        }
      });
      
      if (error) throw error;
      
      toast.success(`Generated ${data.count} flashcards!`);
      await fetchFlashcards();
    } catch (error) {
      console.error('Flashcard generation error:', error);
      toast.error('Failed to generate flashcards. Please try again.');
    } finally {
      setIsGenerating(false);
      setGenerationType(null);
    }
  };

  const handleGenerateQuiz = async () => {
    setIsGenerating(true);
    setGenerationType('quizzes');
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-quiz', {
        body: {
          contentId: contentData.id,
          config: quizConfig
        }
      });
      
      if (error) throw error;
      
      toast.success(`Generated quiz with ${data.questionCount} questions!`);
      await fetchQuizzes();
    } catch (error) {
      console.error('Quiz generation error:', error);
      toast.error('Failed to generate quiz. Please try again.');
    } finally {
      setIsGenerating(false);
      setGenerationType(null);
    }
  };

  const handleGenerateSummary = async () => {
    setIsGenerating(true);
    setGenerationType('summary');
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-summary', {
        body: {
          contentId: contentData.id,
          config: summaryConfig
        }
      });
      
      if (error) throw error;
      
      setSummaryData(data);
      toast.success('Summary generated successfully!');
    } catch (error) {
      console.error('Summary generation error:', error);
      toast.error('Failed to generate summary. Please try again.');
    } finally {
      setIsGenerating(false);
      setGenerationType(null);
    }
  };

  // Check if chapters should be shown for this content type
  const shouldShowChapters = contentData.type === 'text' && (contentData.chapters?.length > 0 || contentData.text_content);
  const handleChapterClick = (startTime: number) => {
    // For text content, we don't have time-based navigation
    // This could be extended to scroll to specific sections
    console.log('Chapter clicked at time:', startTime);
  };
  return <div className="h-full flex flex-col content-right-sidebar bg-dashboard-card dark:bg-dashboard-card">
      {/* Header with TabsList */}
      <div className="border-b border-border/10 bg-background py-0 px-0">
        <Tabs defaultValue="chat" onValueChange={setActiveTab} className="w-full">
          <TabsList className={cn("w-full justify-center gap-1 p-1 h-12 shrink-0", "bg-card dark:bg-card", "transition-colors duration-200", "rounded-xl")}>
            <TabsTrigger value="chat" className={cn("flex-1 h-full rounded-md flex items-center justify-center gap-2", "text-sm font-medium", "text-muted-foreground", "hover:text-foreground", "data-[state=active]:text-primary", "data-[state=active]:bg-primary/10", "data-[state=active]:hover:bg-primary/20", "transition-colors duration-200", "focus-visible:ring-0 focus-visible:ring-offset-0", "focus:ring-0 focus:ring-offset-0", "ring-0 ring-offset-0", "border-0 outline-none", "data-[state=active]:ring-0", "data-[state=active]:ring-offset-0", "data-[state=active]:border-0", "data-[state=active]:outline-none")}>
              <MessageCircle className="h-[14px] w-[14px]" />
              <span className="text-sm">Chat</span>
            </TabsTrigger>
            
            <TabsTrigger value="flashcards" className={cn("flex-1 h-full rounded-md flex items-center justify-center gap-2", "text-sm font-medium", "text-muted-foreground", "hover:text-foreground", "data-[state=active]:text-primary", "data-[state=active]:bg-primary/10", "data-[state=active]:hover:bg-primary/20", "transition-colors duration-200", "focus-visible:ring-0 focus-visible:ring-offset-0", "focus:ring-0 focus:ring-offset-0", "ring-0 ring-offset-0", "border-0 outline-none", "data-[state=active]:ring-0", "data-[state=active]:ring-offset-0", "data-[state=active]:border-0", "data-[state=active]:outline-none")}>
              <GalleryVerticalEnd className="h-[14px] w-[14px]" />
              <span className="text-sm">Flashcards</span>
            </TabsTrigger>
            
            <TabsTrigger value="exams" className={cn("flex-1 h-full rounded-md flex items-center justify-center gap-2", "text-sm font-medium", "text-muted-foreground", "hover:text-foreground", "data-[state=active]:text-primary", "data-[state=active]:bg-primary/10", "data-[state=active]:hover:bg-primary/20", "transition-colors duration-200", "focus-visible:ring-0 focus-visible:ring-offset-0", "focus:ring-0 focus:ring-offset-0", "ring-0 ring-offset-0", "border-0 outline-none", "data-[state=active]:ring-0", "data-[state=active]:ring-offset-0", "data-[state=active]:border-0", "data-[state=active]:outline-none")}>
              <BookCheck className="h-[14px] w-[14px]" />
              <span className="text-sm">Quizzes</span>
            </TabsTrigger>
            
          {shouldShowChapters && <TabsTrigger value="chapters" className={cn("flex-1 h-full rounded-md flex items-center justify-center gap-2", "text-sm font-medium", "text-muted-foreground", "hover:text-foreground", "data-[state=active]:text-primary", "data-[state=active]:bg-primary/10", "data-[state=active]:hover:bg-primary/20", "transition-colors duration-200", "focus-visible:ring-0 focus-visible:ring-offset-0", "focus:ring-0 focus:ring-offset-0", "ring-0 ring-offset-0", "border-0 outline-none", "data-[state=active]:ring-0", "data-[state=active]:ring-offset-0", "data-[state=active]:border-0", "data-[state=active]:outline-none")}>
                <ListTodo className="h-[14px] w-[14px]" />
                <span className="text-sm">Chapters</span>
              </TabsTrigger>}
            
            <TabsTrigger value="summary" className={cn("flex-1 h-full rounded-md flex items-center justify-center gap-2", "text-sm font-medium", "text-muted-foreground", "hover:text-foreground", "data-[state=active]:text-primary", "data-[state=active]:bg-primary/10", "data-[state=active]:hover:bg-primary/20", "transition-colors duration-200", "focus-visible:ring-0 focus-visible:ring-offset-0", "focus:ring-0 focus:ring-offset-0", "ring-0 ring-offset-0", "border-0 outline-none", "data-[state=active]:ring-0", "data-[state=active]:ring-offset-0", "data-[state=active]:border-0", "data-[state=active]:outline-none")}>
              <ReceiptText className="h-[14px] w-[14px]" />
              <span className="text-sm">Summary</span>
            </TabsTrigger>
            
            <TabsTrigger value="notes" className={cn("flex-1 h-full rounded-md flex items-center justify-center gap-2", "text-sm font-medium", "text-muted-foreground", "hover:text-foreground", "data-[state=active]:text-primary", "data-[state=active]:bg-primary/10", "data-[state=active]:hover:bg-primary/20", "transition-colors duration-200", "focus-visible:ring-0 focus-visible:ring-offset-0", "focus:ring-0 focus:ring-offset-0", "ring-0 ring-offset-0", "border-0 outline-none", "data-[state=active]:ring-0", "data-[state=active]:ring-offset-0", "data-[state=active]:border-0", "data-[state=active]:outline-none")}>
              <StickyNote className="h-[14px] w-[14px]" />
              <span className="text-sm">Notes</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col bg-background ">
          <TabsContent value="chat" className={cn("flex-1 overflow-hidden mx-4 mb-4", "content-page-tab-content")}>
            <div className="h-full bg-dashboard-bg dark:bg-dashboard-bg rounded-xl">
              <ScrollArea className="h-full">
                <div className="h-full min-h-[400px] pt-12">
                  <AIChat />
                </div>
              </ScrollArea>
            </div>
          </TabsContent>
          
          <TabsContent value="flashcards" className="flex-1 overflow-hidden mx-4 mb-4">
            <div className="h-full bg-dashboard-bg dark:bg-dashboard-bg rounded-xl">
          {flashcards.length === 0 ? (
            <div className="flex justify-end p-6 pt-8">
              <div className="w-full max-w-2xl">
                <GenerationPrompt
                  type="flashcards"
                  onGenerate={handleGenerateFlashcards}
                  onConfigure={() => setShowFlashcardConfig(true)}
                  contentData={contentData}
                  isLoading={isGenerating && generationType === 'flashcards'}
                />
              </div>
            </div>
          ) : (
                <FlashcardContainer initialCards={flashcards} />
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="exams" className="flex-1 overflow-hidden mx-4 mb-4">
            <div className="h-full bg-dashboard-bg dark:bg-dashboard-bg rounded-xl">
          {!quizData ? (
            <div className="flex justify-end p-6 pt-8">
              <div className="w-full max-w-2xl">
                <GenerationPrompt
                  type="quizzes"
                  onGenerate={handleGenerateQuiz}
                  onConfigure={() => setShowQuizConfig(true)}
                  contentData={contentData}
                  isLoading={isGenerating && generationType === 'quizzes'}
                />
              </div>
            </div>
          ) : (
                <ScrollArea className="h-full">
                  <div className="flex flex-col items-center justify-start pt-8 h-full min-h-[400px]">
                    <QuizPreferences />
                  </div>
                </ScrollArea>
              )}
            </div>
          </TabsContent>
          
          {shouldShowChapters && <TabsContent value="chapters" className="flex-1 overflow-hidden mx-4 mb-4">
              <div className="h-full bg-dashboard-bg dark:bg-dashboard-bg rounded-xl">
                <ScrollArea className="h-full">
                  <div className="p-6">
                    <RealtimeChaptersDisplay chapters={contentData.chapters ? contentData.chapters.map((chapter: any) => ({
                  title: chapter.title,
                  summary: chapter.summary || '',
                  startTime: chapter.startTime || 0,
                  endTime: chapter.endTime || 0
                })) : []} transcriptionStatus={contentData.text_content ? 'completed' : 'pending'} processingStatus={contentData.processing_status as 'pending' | 'processing' | 'completed' | 'failed'} contentType={contentData.type} onChapterClick={handleChapterClick} />
                  </div>
                </ScrollArea>
              </div>
            </TabsContent>}
          
          <TabsContent value="summary" className="flex-1 overflow-hidden mx-4 mb-4">
            <div className="h-full bg-dashboard-bg dark:bg-dashboard-bg rounded-xl">
              {!summaryData ? (
                <div className="flex justify-end p-6 pt-8">
                  <div className="w-full max-w-2xl">
                    <GenerationPrompt
                      type="summary"
                      onGenerate={handleGenerateSummary}
                      onConfigure={() => setShowSummaryConfig(true)}
                      contentData={contentData}
                      isLoading={isGenerating && generationType === 'summary'}
                    />
                  </div>
                </div>
              ) : (
                <ScrollArea className="h-full">
                  <SummaryDisplay contentData={{ ...contentData, ai_summary: summaryData.summary, summary_key_points: summaryData.keyPoints }} />
                </ScrollArea>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="notes" className="flex-1 overflow-hidden m-0 p-0 h-full">
            <div className="h-full w-full bg-dashboard-bg dark:bg-dashboard-bg rounded-xl overflow-hidden">
              <Notes isRecording={isRecording} />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Configuration Modals */}
      <FlashcardConfigModal
        open={showFlashcardConfig}
        onOpenChange={setShowFlashcardConfig}
        config={flashcardConfig}
        onSave={setFlashcardConfig}
      />
      
      <QuizConfigModal
        open={showQuizConfig}
        onOpenChange={setShowQuizConfig}
        config={quizConfig}
        onSave={setQuizConfig}
      />
      
      <SummaryConfigModal
        open={showSummaryConfig}
        onOpenChange={setShowSummaryConfig}
        config={summaryConfig}
        onSave={setSummaryConfig}
      />
    </div>;
}