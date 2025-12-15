import React, { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, StickyNote, ReceiptText, BookCheck, GalleryVerticalEnd, ListTodo } from "lucide-react";
import AIChat from "@/components/recording/AIChat";
import Notes from '@/components/recording/Notes';
import { FlashcardContainer } from './FlashcardContainer';
import { FlashcardListDisplay } from './FlashcardListDisplay';
import { SummaryDisplay } from './SummaryDisplay';
import { SummaryTabPanel } from './summary/SummaryTabPanel';
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
import { QuizDisplay } from './QuizDisplay';
import { QuizTakingComponent } from './QuizTakingComponent';

interface ContentRightSidebarProps {
  contentData: ContentData;
}
export function ContentRightSidebar({
  contentData
}: ContentRightSidebarProps) {
  const [activeTab, setActiveTab] = useState("chat");
  const [isRecording, setIsRecording] = useState(false);

  // Extract topics from content metadata
  const extractTopics = (): string[] => {
    const topics: string[] = [];
    
    // Extract from chapters
    if (contentData?.chapters && Array.isArray(contentData.chapters)) {
      contentData.chapters.forEach((chapter: any) => {
        if (chapter.title) {
          topics.push(chapter.title);
        }
      });
    }
    
    // Extract from metadata
    if (contentData?.metadata) {
      if (contentData.metadata.keyTopics && Array.isArray(contentData.metadata.keyTopics)) {
        topics.push(...contentData.metadata.keyTopics);
      }
      if (contentData.metadata.keywords && Array.isArray(contentData.metadata.keywords)) {
        // Add top 5 keywords as topics
        topics.push(...contentData.metadata.keywords.slice(0, 5));
      }
    }
    
    // Remove duplicates and return
    return [...new Set(topics)].filter(Boolean);
  };

  const availableTopics = extractTopics();

  // Generation states
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationType, setGenerationType] = useState<'flashcards' | 'quizzes' | 'summary' | null>(null);
  
  // Data states
  const [flashcards, setFlashcards] = useState<FlashcardData[]>([]);
  const [quizData, setQuizData] = useState<any>(null);
  const [summaryData, setSummaryData] = useState<{ summary: string; keyPoints: string[] } | null>(null);
  const [summariesList, setSummariesList] = useState<Array<{
    id: string;
    title: string;
    type: 'brief' | 'standard' | 'detailed';
    summary: string;
    keyPoints: string[];
    createdAt: Date;
  }>>([]);
  const [viewingSummary, setViewingSummary] = useState<{
    id: string;
    title: string;
    type: 'brief' | 'standard' | 'detailed';
    summary: string;
    keyPoints: string[];
  } | null>(null);
  const [autoGenerateSummary, setAutoGenerateSummary] = useState(false);
  
  // Config modal states
  const [showFlashcardConfig, setShowFlashcardConfig] = useState(false);
  const [showQuizConfig, setShowQuizConfig] = useState(false);
  const [showSummaryConfig, setShowSummaryConfig] = useState(false);
  
  // Quiz taking state
  const [showQuizTaking, setShowQuizTaking] = useState(false);
  
  // Flashcard viewing state
  const [showFlashcardStudy, setShowFlashcardStudy] = useState(false);
  
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

  // Helper function to normalize question types from database format to component format
  const normalizeQuestionType = (type: string): 'multiple-choice' | 'true-false' | 'short-answer' => {
    const typeMap: Record<string, 'multiple-choice' | 'true-false' | 'short-answer'> = {
      'multiple_choice': 'multiple-choice',
      'true_false': 'true-false',
      'short_answer': 'short-answer',
      'multiple-choice': 'multiple-choice',
      'true-false': 'true-false',
      'short-answer': 'short-answer'
    };
    return typeMap[type] || 'multiple-choice';
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
      
      if (data) {
        // Normalize question types from database format (underscore) to component format (hyphen)
        const questions = Array.isArray(data.questions) ? data.questions : [];
        const normalizedData = {
          ...data,
          questions: questions.map((q: any) => ({
            ...q,
            type: normalizeQuestionType(q.type)
          }))
        };
        setQuizData(normalizedData);
      }
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    }
  };

  const checkSummary = async () => {
    try {
      // Fetch summaries from the database
      const { data: summaries, error } = await supabase
        .from('summaries')
        .select('*')
        .eq('content_id', contentData.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (summaries && summaries.length > 0) {
        const formattedSummaries = summaries.map(s => ({
          id: s.id,
          title: s.title,
          type: s.type as 'brief' | 'standard' | 'detailed',
          summary: s.summary,
          keyPoints: (s.key_points as string[]) || [],
          createdAt: new Date(s.created_at),
        }));
        setSummariesList(formattedSummaries);
      } else if (contentData.ai_summary && contentData.summary_key_points) {
        // Legacy: check if there's a summary in the content table
        const existingSummary = {
          id: `summary-existing-${contentData.id}`,
          title: 'Detailed Summary',
          type: 'detailed' as const,
          summary: contentData.ai_summary,
          keyPoints: contentData.summary_key_points as string[],
          createdAt: new Date(contentData.summary_generated_at || Date.now()),
        };
        setSummariesList([existingSummary]);
      }
    } catch (error) {
      console.error('Error fetching summaries:', error);
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

  const handleGenerateSummary = async (type?: 'brief' | 'standard' | 'detailed') => {
    const summaryType = type || summaryConfig.length;
    setIsGenerating(true);
    setGenerationType('summary');
    
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase.functions.invoke('generate-summary', {
        body: {
          contentId: contentData.id,
          config: { ...summaryConfig, length: summaryType }
        }
      });
      
      if (error) throw error;
      
      // Add to summaries list
      const typeLabels = {
        brief: 'Short Summary',
        standard: 'Cheat Sheet',
        detailed: 'Detailed Summary',
      };
      
      // Save to database
      const { data: savedSummary, error: saveError } = await supabase
        .from('summaries')
        .insert({
          content_id: contentData.id,
          user_id: userData.user.id,
          title: typeLabels[summaryType],
          type: summaryType,
          summary: data.summary,
          key_points: data.keyPoints || [],
        })
        .select()
        .single();

      if (saveError) throw saveError;
      
      const newSummary = {
        id: savedSummary.id,
        title: savedSummary.title,
        type: savedSummary.type as 'brief' | 'standard' | 'detailed',
        summary: savedSummary.summary,
        keyPoints: (savedSummary.key_points as string[]) || [],
        createdAt: new Date(savedSummary.created_at),
      };
      
      setSummariesList(prev => [newSummary, ...prev]);
      setSummaryData({ summary: data.summary, keyPoints: data.keyPoints || [] });
      
      // Show the newly generated summary
      setViewingSummary(newSummary);
      setSummaryConfig(prev => ({ ...prev, length: summaryType }));
      
      toast.success('Summary generated successfully!');
    } catch (error) {
      console.error('Summary generation error:', error);
      toast.error('Failed to generate summary. Please try again.');
    } finally {
      setIsGenerating(false);
      setGenerationType(null);
    }
  };

  const handleDeleteSummary = async (summaryId: string) => {
    try {
      // Check if it's a legacy summary (not in DB)
      if (summaryId.startsWith('summary-existing-')) {
        setSummariesList(prev => prev.filter(s => s.id !== summaryId));
        toast.success('Summary removed');
        return;
      }

      const { error } = await supabase
        .from('summaries')
        .delete()
        .eq('id', summaryId);

      if (error) throw error;

      setSummariesList(prev => prev.filter(s => s.id !== summaryId));
      toast.success('Summary deleted');
    } catch (error) {
      console.error('Error deleting summary:', error);
      toast.error('Failed to delete summary');
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
      <div className="bg-background py-3 px-4 md:px-6">
        <Tabs defaultValue="chat" onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-fit mx-auto flex items-center gap-2 p-1.5 h-auto rounded-2xl border border-primary/10 bg-white dark:bg-neutral-800/50 dark:border-primary/5 overflow-x-auto">
            <TabsTrigger value="chat" className="px-4 py-2 rounded-lg text-sm font-normal text-primary/80 hover:bg-primary/5 hover:text-primary data-[state=active]:text-primary data-[state=active]:bg-primary/5 dark:data-[state=active]:bg-primary/10 transition-all">
              <div className="flex items-center gap-2">
                {activeTab === "chat" ? (
                  <div className="h-2 w-2 flex-shrink-0 rounded-full bg-success" />
                ) : (
                  <MessageCircle className="h-4 w-4" />
                )}
                Chat
              </div>
            </TabsTrigger>
            
            <TabsTrigger value="flashcards" className="px-4 py-2 rounded-lg text-sm font-normal text-primary/80 hover:bg-primary/5 hover:text-primary data-[state=active]:text-primary data-[state=active]:bg-primary/5 dark:data-[state=active]:bg-primary/10 transition-all">
              <div className="flex items-center gap-2">
                {activeTab === "flashcards" ? (
                  <div className="h-2 w-2 flex-shrink-0 rounded-full bg-success" />
                ) : (
                  <GalleryVerticalEnd className="h-4 w-4" />
                )}
                Flashcards
              </div>
            </TabsTrigger>
            
            <TabsTrigger value="exams" className="px-4 py-2 rounded-lg text-sm font-normal text-primary/80 hover:bg-primary/5 hover:text-primary data-[state=active]:text-primary data-[state=active]:bg-primary/5 dark:data-[state=active]:bg-primary/10 transition-all">
              <div className="flex items-center gap-2">
                {activeTab === "exams" ? (
                  <div className="h-2 w-2 flex-shrink-0 rounded-full bg-success" />
                ) : (
                  <BookCheck className="h-4 w-4" />
                )}
                Quizzes
              </div>
            </TabsTrigger>
            
            {shouldShowChapters && (
              <TabsTrigger value="chapters" className="px-4 py-2 rounded-lg text-sm font-normal text-primary/80 hover:bg-primary/5 hover:text-primary data-[state=active]:text-primary data-[state=active]:bg-primary/5 dark:data-[state=active]:bg-primary/10 transition-all">
                <div className="flex items-center gap-2">
                  {activeTab === "chapters" ? (
                    <div className="h-2 w-2 flex-shrink-0 rounded-full bg-success" />
                  ) : (
                    <ListTodo className="h-4 w-4" />
                  )}
                  Chapters
                </div>
              </TabsTrigger>
            )}
            
            <TabsTrigger value="summary" className="px-4 py-2 rounded-lg text-sm font-normal text-primary/80 hover:bg-primary/5 hover:text-primary data-[state=active]:text-primary data-[state=active]:bg-primary/5 dark:data-[state=active]:bg-primary/10 transition-all">
              <div className="flex items-center gap-2">
                {activeTab === "summary" ? (
                  <div className="h-2 w-2 flex-shrink-0 rounded-full bg-success" />
                ) : (
                  <ReceiptText className="h-4 w-4" />
                )}
                Summary
              </div>
            </TabsTrigger>
            
            <TabsTrigger value="notes" className="px-4 py-2 rounded-lg text-sm font-normal text-primary/80 hover:bg-primary/5 hover:text-primary data-[state=active]:text-primary data-[state=active]:bg-primary/5 dark:data-[state=active]:bg-primary/10 transition-all">
              <div className="flex items-center gap-2">
                {activeTab === "notes" ? (
                  <div className="h-2 w-2 flex-shrink-0 rounded-full bg-success" />
                ) : (
                  <StickyNote className="h-4 w-4" />
                )}
                Notes
              </div>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col bg-background ">
          <TabsContent value="chat" className={cn("flex-1 overflow-hidden mx-4 mb-4", "content-page-tab-content")}>
            <div className="h-full bg-dashboard-bg dark:bg-dashboard-bg rounded-xl overflow-hidden pt-12">
              <AIChat contentData={contentData} />
            </div>
          </TabsContent>
          
          <TabsContent value="flashcards" className="flex-1 overflow-hidden mx-4 mb-4">
            {showFlashcardStudy && flashcards.length > 0 ? (
              <div className="h-full">
                <FlashcardContainer 
                  initialCards={flashcards} 
                  onBack={() => setShowFlashcardStudy(false)}
                />
              </div>
            ) : (
              <div className="h-full bg-dashboard-bg dark:bg-dashboard-bg rounded-xl">
                {flashcards.length === 0 ? (
                  <div className="p-6">
                    <GenerationPrompt
                      type="flashcards"
                      onGenerate={handleGenerateFlashcards}
                      onConfigure={() => setShowFlashcardConfig(true)}
                      contentData={contentData}
                      isLoading={isGenerating && generationType === 'flashcards'}
                    />
                  </div>
                ) : (
                  <ScrollArea className="h-full">
                    <div className="flex flex-col space-y-6">
                      <div className="px-6 pt-6">
                        <FlashcardListDisplay
                          flashcards={flashcards}
                          onStartFlashcards={() => setShowFlashcardStudy(true)}
                          onEditFlashcards={() => {
                            setShowFlashcardConfig(true);
                            toast.info('Edit flashcard configuration and regenerate');
                          }}
                          onDeleteFlashcards={async () => {
                            try {
                              const { error } = await supabase
                                .from('flashcards')
                                .delete()
                                .eq('content_id', contentData.id);
                              
                              if (error) throw error;
                              
                              setFlashcards([]);
                              toast.success('Flashcards deleted successfully');
                            } catch (error) {
                              console.error('Error deleting flashcards:', error);
                              toast.error('Failed to delete flashcards');
                            }
                          }}
                        />
                      </div>
                      <div className="px-6 pb-6">
                        <GenerationPrompt
                          type="flashcards"
                          onGenerate={handleGenerateFlashcards}
                          onConfigure={() => setShowFlashcardConfig(true)}
                          contentData={contentData}
                          isLoading={isGenerating && generationType === 'flashcards'}
                        />
                      </div>
                    </div>
                  </ScrollArea>
                )}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="exams" className="flex-1 overflow-hidden mx-4 mb-4">
            {showQuizTaking && quizData ? (
              <div className="h-full">
                <QuizTakingComponent
                  quizId={quizData.id}
                  quizData={{
                    ...quizData,
                    questions: Array.isArray(quizData.questions) ? quizData.questions : []
                  }}
                  onBack={() => setShowQuizTaking(false)}
                  onComplete={(results) => {
                    setShowQuizTaking(false);
                    toast.success(`Quiz completed! Score: ${results.correctAnswers}/${results.totalQuestions}`);
                  }}
                />
              </div>
            ) : (
              <div className="h-full bg-dashboard-bg dark:bg-dashboard-bg rounded-xl">
                {!quizData ? (
                  <div className="p-6">
                    <GenerationPrompt
                      type="quizzes"
                      onGenerate={handleGenerateQuiz}
                      onConfigure={() => setShowQuizConfig(true)}
                      contentData={contentData}
                      isLoading={isGenerating && generationType === 'quizzes'}
                    />
                  </div>
                ) : (
                  <ScrollArea className="h-full">
                    <div className="flex flex-col space-y-6">
                      <div className="px-6 pt-6">
                        <QuizDisplay
                          quiz={quizData}
                          onStartQuiz={(quizId) => setShowQuizTaking(true)}
                          onEditQuiz={(quizId) => {
                            setShowQuizConfig(true);
                            toast.info('Edit quiz configuration and regenerate');
                          }}
                          onRestartQuiz={(quizId) => {
                            toast.info('Quiz restarted! Good luck!');
                            setShowQuizTaking(true);
                          }}
                          onDeleteQuiz={async (quizId) => {
                            try {
                              const { error } = await supabase
                                .from('quizzes')
                                .delete()
                                .eq('id', quizId);
                              
                              if (error) throw error;
                              
                              setQuizData(null);
                              toast.success('Quiz deleted successfully');
                            } catch (error) {
                              console.error('Error deleting quiz:', error);
                              toast.error('Failed to delete quiz');
                            }
                          }}
                        />
                      </div>
                      
                      <div className="p-6">
                        <GenerationPrompt
                          type="quizzes"
                          onGenerate={handleGenerateQuiz}
                          onConfigure={() => setShowQuizConfig(true)}
                          contentData={contentData}
                          isLoading={isGenerating && generationType === 'quizzes'}
                        />
                      </div>
                    </div>
                  </ScrollArea>
                )}
              </div>
            )}
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
              {viewingSummary ? (
                <ScrollArea className="h-full">
                  <SummaryDisplay 
                    contentData={contentData} 
                    summaryData={{
                      summary: viewingSummary.summary,
                      keyPoints: viewingSummary.keyPoints
                    }}
                    summaryTemplate={viewingSummary.type}
                    onBack={() => setViewingSummary(null)}
                  />
                </ScrollArea>
              ) : (
                <SummaryTabPanel
                  summaries={summariesList.map(s => ({
                    id: s.id,
                    title: s.title,
                    type: s.type,
                    createdAt: s.createdAt,
                  }))}
                  onCreateSummary={handleGenerateSummary}
                  onViewSummary={(summary) => {
                    const fullSummary = summariesList.find(s => s.id === summary.id);
                    if (fullSummary) {
                      setViewingSummary(fullSummary);
                    }
                  }}
                  onDeleteSummary={handleDeleteSummary}
                  onConfigure={() => setShowSummaryConfig(true)}
                  isLoading={isGenerating && generationType === 'summary'}
                  autoGenerate={autoGenerateSummary}
                  onAutoGenerateChange={setAutoGenerateSummary}
                />
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
        onGenerate={handleGenerateFlashcards}
        topics={availableTopics}
        isLoading={isGenerating && generationType === 'flashcards'}
      />
      
      <QuizConfigModal
        open={showQuizConfig}
        onOpenChange={setShowQuizConfig}
        config={quizConfig}
        onSave={setQuizConfig}
        onGenerate={handleGenerateQuiz}
        topics={availableTopics}
        isLoading={isGenerating && generationType === 'quizzes'}
      />
      
      <SummaryConfigModal
        open={showSummaryConfig}
        onOpenChange={setShowSummaryConfig}
        config={summaryConfig}
        onSave={setSummaryConfig}
      />
    </div>;
}