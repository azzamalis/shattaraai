import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ExamResultsHeader } from './exam-results-interface/ExamResultsHeader';
import { ExamResultsFooter } from './exam-results-interface/ExamResultsFooter';
import { ChatDrawer } from './exam-results-interface/ChatDrawer';
import { AnswerBreakdown } from './exam-results-interface/AnswerBreakdown';
import { supabase } from '@/integrations/supabase/client';

interface Question {
  id: number;
  type: 'multiple-choice' | 'free-text';
  question: string;
  options?: string[];
  correctAnswer?: number;
  userAnswer?: number | string;
  explanation?: string;
  feedback?: string;
  referenceTime?: string;
  referenceSource?: string;
  isSkipped?: boolean;
}

interface ExamResults {
  questions: Question[];
  answers: {
    [key: number]: any;
  };
  skippedQuestions: Set<number>;
  score: {
    correct: number;
    incorrect: number;
    skipped: number;
    total: number;
  };
  examId?: string;
  attemptId?: string;
}

interface ExamMetadata {
  examId: string | null;
  attemptId: string | null;
  roomId: string | null;
  contentId: string | null;
}

const ExamResultsInterface: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [currentChatQuestion, setCurrentChatQuestion] = useState<number | null>(null);
  const [currentQuestionText, setCurrentQuestionText] = useState<string | null>(null);
  const [chatType, setChatType] = useState<'question' | 'room'>('question');
  const [examResults, setExamResults] = useState<ExamResults | null>(null);
  const [examMetadata, setExamMetadata] = useState<ExamMetadata>({
    examId: null,
    attemptId: null,
    roomId: null,
    contentId: null
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { contentId } = useParams<{ contentId: string }>();

  useEffect(() => {
    const loadExamResults = async () => {
      setLoading(true);
      
      // First check localStorage for recent results (from just-completed exam)
      const savedResults = localStorage.getItem('examResults');
      const savedAttemptId = localStorage.getItem('currentExamAttemptId');
      const generatedExam = localStorage.getItem('generatedExam');
      
      let metadata: ExamMetadata = {
        examId: null,
        attemptId: contentId || savedAttemptId,
        roomId: null,
        contentId: null
      };
      
      // Parse generatedExam for metadata
      if (generatedExam) {
        try {
          const parsed = JSON.parse(generatedExam);
          metadata.examId = parsed.examId || metadata.examId;
          metadata.roomId = parsed.roomId || metadata.roomId;
          metadata.contentId = parsed.contentId || metadata.contentId;
        } catch (e) {
          console.warn('Failed to parse generatedExam:', e);
        }
      }
      
      // If we have localStorage results, use them (freshest data from just-completed exam)
      if (savedResults) {
        try {
          const parsed = JSON.parse(savedResults);
          const results: ExamResults = {
            ...parsed,
            skippedQuestions: new Set(parsed.skippedQuestions || []),
            score: {
              correct: 0,
              incorrect: 0,
              skipped: parsed.skippedQuestions?.length || 0,
              total: parsed.questions?.length || 0
            }
          };
          
          // Calculate scores properly
          if (parsed.questions && parsed.answers) {
            results.score.correct = Object.entries(parsed.answers).filter(([id, answer]) => {
              const question = parsed.questions.find((q: Question) => q.id === parseInt(id));
              return question?.type === 'multiple-choice' && answer === question.correctAnswer;
            }).length;
            
            results.score.incorrect = Object.entries(parsed.answers).filter(([id, answer]) => {
              const question = parsed.questions.find((q: Question) => q.id === parseInt(id));
              return question?.type === 'multiple-choice' && answer !== question.correctAnswer;
            }).length;
          }
          
          // Update metadata from parsed results
          if (parsed.examId) metadata.examId = parsed.examId;
          if (parsed.attemptId) metadata.attemptId = parsed.attemptId;
          
          setExamResults(results);
          setExamMetadata(metadata);
          setLoading(false);
          return;
        } catch (e) {
          console.error('Failed to parse localStorage results:', e);
        }
      }
      
      // If no localStorage data, try to fetch from database
      const idToFetch = contentId || savedAttemptId;
      if (idToFetch) {
        try {
          // Try to fetch as exam_attempt first
          const { data: attemptData, error: attemptError } = await supabase
            .from('exam_attempts')
            .select(`
              *,
              exams (
                id,
                title,
                room_id,
                content_metadata
              )
            `)
            .eq('id', idToFetch)
            .maybeSingle();
          
          if (attemptData) {
            metadata.attemptId = attemptData.id;
            metadata.examId = attemptData.exam_id;
            metadata.roomId = (attemptData.exams as any)?.room_id || null;
            
            // Fetch questions and answers for this attempt
            if (attemptData.exam_id) {
              const { data: questions } = await supabase
                .from('exam_questions')
                .select('*')
                .eq('exam_id', attemptData.exam_id)
                .order('order_index');
              
              const { data: answers } = await supabase
                .from('exam_answers')
                .select('*')
                .eq('exam_attempt_id', attemptData.id);
              
              if (questions) {
                const formattedQuestions: Question[] = questions.map((q, idx) => {
                  const answer = answers?.find(a => a.question_id === q.id);
                  return {
                    id: idx + 1,
                    type: q.question_type === 'multiple_choice' ? 'multiple-choice' : 'free-text',
                    question: q.question_text,
                    options: Array.isArray(q.options) ? q.options.map((opt: any) => opt.text || opt) : undefined,
                    correctAnswer: q.question_type === 'multiple_choice' 
                      ? parseInt(q.correct_answer) 
                      : undefined,
                    userAnswer: answer?.user_answer ? 
                      (q.question_type === 'multiple_choice' ? parseInt(answer.user_answer) : answer.user_answer) 
                      : undefined,
                    explanation: q.explanation,
                    feedback: q.feedback,
                    referenceTime: q.reference_time,
                    referenceSource: q.reference_source,
                    isSkipped: answer === undefined || answer.user_answer === null
                  };
                });
                
                const answersMap: { [key: number]: any } = {};
                const skippedSet = new Set<number>();
                
                formattedQuestions.forEach(q => {
                  if (q.userAnswer !== undefined) {
                    answersMap[q.id] = q.userAnswer;
                  }
                  if (q.isSkipped) {
                    skippedSet.add(q.id);
                  }
                });
                
                setExamResults({
                  questions: formattedQuestions,
                  answers: answersMap,
                  skippedQuestions: skippedSet,
                  score: {
                    correct: attemptData.total_score || 0,
                    incorrect: (attemptData.max_score || 0) - (attemptData.total_score || 0) - (attemptData.skipped_questions || 0),
                    skipped: attemptData.skipped_questions || 0,
                    total: attemptData.max_score || questions.length
                  },
                  examId: attemptData.exam_id,
                  attemptId: attemptData.id
                });
                
                setExamMetadata(metadata);
                setLoading(false);
                return;
              }
            }
          }
        } catch (e) {
          console.error('Failed to fetch from database:', e);
        }
      }
      
      // No data available
      setLoading(false);
      navigate('/dashboard');
    };
    
    loadExamResults();
  }, [contentId, navigate]);

  const openChatForQuestion = (questionId: number) => {
    const question = examResults?.questions.find(q => q.id === questionId);
    setCurrentChatQuestion(questionId);
    setCurrentQuestionText(question?.question || null);
    setChatType('question');
    setIsChatOpen(true);
  };

  if (loading) {
    return (
      <div className="h-full bg-background text-foreground flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading exam results...</div>
      </div>
    );
  }

  if (!examResults) {
    return null;
  }
  return (
    <div className="h-full bg-background text-foreground">
      <ExamResultsHeader 
        totalQuestions={examResults.score.total} 
        onOpenChat={() => {
          setCurrentChatQuestion(null);
          setChatType('room');
          setIsChatOpen(true);
        }} 
      />

      {/* Main Content Area */}
      <main className="pb-24 pt-8">
        <div className="mx-auto mt-16 w-full flex-grow overflow-y-auto px-4 pb-24 lg:w-3/5 2xl:w-1/2">
          <div className="flex flex-col gap-24">
            {examResults.questions.map(question => (
              <AnswerBreakdown 
                key={question.id} 
                question={question} 
                contentId={examMetadata.contentId}
                onAskChat={openChatForQuestion}
              />
            ))}
          </div>
        </div>
      </main>

      <ExamResultsFooter 
        onTryAgain={() => navigate(`/exam/${examMetadata.attemptId || contentId}`)} 
        onViewResults={() => navigate(`/exam-summary/${examMetadata.attemptId || contentId}`)}
        roomId={examMetadata.roomId}
      />

      <ChatDrawer 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
        currentQuestionId={currentChatQuestion}
        currentQuestionText={currentQuestionText}
        onClearQuestionReference={() => setCurrentQuestionText(null)}
        examId={examMetadata.examId}
        contentId={examMetadata.contentId}
        roomId={examMetadata.roomId}
        chatType={chatType}
      />
    </div>
  );
};

export default ExamResultsInterface;