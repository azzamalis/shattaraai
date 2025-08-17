import React, { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { ExamResultsHeader } from './exam-results-interface/ExamResultsHeader';
import { ExamResultsFooter } from './exam-results-interface/ExamResultsFooter';
import { ChatDrawer } from './exam-results-interface/ChatDrawer';
import { AnswerBreakdown } from './exam-results-interface/AnswerBreakdown';
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
}
const DUMMY_EXAM_DATA = {
  questions: [{
    id: 1,
    type: 'multiple-choice',
    question: 'What is the primary force responsible for the formation of stars?',
    options: ['Electromagnetic force', 'Gravitational force', 'Nuclear force', 'Centrifugal force'],
    correctAnswer: 1,
    userAnswer: 0,
    explanation: 'Gravitational force is the primary force responsible for star formation. It causes clouds of gas and dust in space to collapse, leading to the formation of protostars and eventually stars. The intense pressure and temperature at the core, also a result of gravitational compression, enables nuclear fusion to begin.',
    referenceTime: '2:15',
    referenceSource: 'Stellar Formation Basics'
  }, {
    id: 2,
    type: 'free-text',
    question: 'Explain how scientists can detect and study black holes despite them not emitting light.',
    userAnswer: 'asdfasasdf',
    feedback: 'While your answer needs more detail, here\'s a comprehensive explanation: Scientists detect black holes through indirect methods such as: 1) Observing the gravitational effects on nearby stars and gas, 2) Detecting X-ray emissions from heated material falling into the black hole, 3) Gravitational lensing effects, and 4) Recently, through gravitational wave detection when black holes merge.',
    referenceTime: '5:30',
    referenceSource: 'Black Hole Detection Methods'
  }, {
    id: 3,
    type: 'multiple-choice',
    question: 'How does the size of a black hole affect the experience of traveling inside it?',
    options: ['Supermassive black holes kill instantly upon crossing the event horizon.', 'Larger black holes have stronger tidal forces that cause immediate death.', 'Smaller black holes kill before the event horizon; supermassive ones allow longer survival.', 'Smaller black holes allow for longer survival due to weaker gravity effects.'],
    correctAnswer: 2,
    userAnswer: 2,
    explanation: 'Correct! In smaller black holes, tidal forces are much stronger near the event horizon, leading to "spaghettification" before reaching it. In supermassive black holes, these forces are relatively weaker at the event horizon, theoretically allowing for longer survival past this point, though eventual destruction is still certain.',
    referenceTime: '8:45',
    referenceSource: 'Black Hole Physics'
  }, {
    id: 4,
    type: 'free-text',
    question: 'Describe the process of nuclear fusion in stars and its role in stellar evolution.',
    isSkipped: true,
    feedback: 'Nuclear fusion in stars primarily involves the fusion of hydrogen nuclei into helium through the proton-proton chain reaction or CNO cycle. This process releases enormous energy, providing the outward pressure that balances the star\'s gravitational collapse. As stars age, they can fuse heavier elements, leading to different evolutionary stages. The type of fusion occurring in a star\'s core determines its position on the main sequence and its eventual fate.',
    referenceTime: '12:20',
    referenceSource: 'Stellar Evolution'
  }, {
    id: 5,
    type: 'multiple-choice',
    question: 'Which of the following best describes the relationship between a star\'s mass and its lifespan?',
    options: ['More massive stars live longer than less massive stars', 'A star\'s mass has no effect on its lifespan', 'Less massive stars live longer than more massive stars', 'All stars have approximately the same lifespan'],
    correctAnswer: 2,
    userAnswer: 1,
    explanation: 'Incorrect. Less massive stars actually live longer than more massive stars. This is because massive stars burn through their nuclear fuel much more quickly due to the intense gravitational pressure and higher core temperatures. A low-mass red dwarf might live for trillions of years, while a very massive star might only live for a few million years.',
    referenceTime: '15:10',
    referenceSource: 'Stellar Lifespans'
  }],
  answers: {
    1: 0,
    2: 'asdfasasdf',
    3: 2,
    5: 1
  },
  skippedQuestions: [4],
  score: {
    correct: 1,
    incorrect: 2,
    skipped: 1,
    total: 5
  }
};
const ExamResultsInterface: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [currentChatQuestion, setCurrentChatQuestion] = useState<number | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationError, setEvaluationError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { contentId } = useParams<{ contentId: string }>();

  // Get exam data from localStorage to get correct examId and roomId
  const examMetadata = (() => {
    const generatedExam = localStorage.getItem('generatedExam');
    if (generatedExam) {
      try {
        const parsed = JSON.parse(generatedExam);
        return {
          examId: parsed.examId,
          roomId: parsed.roomId,
          contentId: parsed.contentId || contentId
        };
      } catch (error) {
        console.warn('Failed to parse generatedExam from localStorage:', error);
      }
    }
    return {
      examId: contentId, // fallback to contentId if no generatedExam
      roomId: null,
      contentId: contentId
    };
  })();

  // Add dummy data when component mounts if no exam results exist
  useEffect(() => {
    if (!localStorage.getItem('examResults')) {
      localStorage.setItem('examResults', JSON.stringify(DUMMY_EXAM_DATA));
    }
  }, []);

  // Run AI evaluation on the actual exam results
  useEffect(() => {
    const evaluateExamResults = async () => {
      const savedResults = localStorage.getItem('examResults');
      if (!savedResults) return;

      const examData = JSON.parse(savedResults);
      
      // Skip if already evaluated or if it's dummy data
      if (examData.evaluated || examData === DUMMY_EXAM_DATA) return;

      setIsEvaluating(true);
      setEvaluationError(null);

      try {
        const { supabase } = await import('@/integrations/supabase/client');
        
        const { data, error } = await supabase.functions.invoke('openai-evaluate-exam', {
          body: {
            questions: examData.questions,
            answers: examData.answers,
            originalContent: examData.originalContent
          }
        });

        if (error) {
          console.error('Error evaluating exam:', error);
          setEvaluationError('Failed to get AI evaluation');
          return;
        }

        if (data?.success && data?.evaluatedQuestions) {
          // Update localStorage with AI-evaluated questions
          const updatedResults = {
            ...examData,
            questions: data.evaluatedQuestions,
            evaluated: true
          };
          localStorage.setItem('examResults', JSON.stringify(updatedResults));
          // Force re-render to show updated results
          window.location.reload();
        }

      } catch (error) {
        console.error('Error in AI evaluation:', error);
        setEvaluationError('Failed to connect to AI evaluation service');
      } finally {
        setIsEvaluating(false);
      }
    };

    evaluateExamResults();
  }, []);

  // Get exam results from localStorage
  const examResults = (() => {
    const savedResults = localStorage.getItem('examResults');
    if (savedResults) {
      const parsed = JSON.parse(savedResults);
      return {
        ...parsed,
        skippedQuestions: new Set(parsed.skippedQuestions),
        score: {
          ...parsed.score,
          correct: Object.entries(parsed.answers).filter(([id, answer]) => {
            const question = parsed.questions.find(q => q.id === parseInt(id));
            return question?.type === 'multiple-choice' && answer === question.correctAnswer;
          }).length,
          incorrect: Object.entries(parsed.answers).filter(([id, answer]) => {
            const question = parsed.questions.find(q => q.id === parseInt(id));
            return question?.type === 'multiple-choice' && answer !== question.correctAnswer;
          }).length,
          skipped: parsed.skippedQuestions.length,
          total: parsed.questions.length
        }
      };
    }
    navigate('/exam');
    return null;
  })();
  const openChatForQuestion = (questionId: number) => {
    setCurrentChatQuestion(questionId);
    setIsChatOpen(true);
  };
  if (!examResults) {
    return null;
  }
  return <div className="h-full bg-background text-foreground">
      <ExamResultsHeader totalQuestions={examResults.score.total} onOpenChat={() => setIsChatOpen(true)} />

      {/* Main Content Area */}
      <main className="pb-24 pt-8">
        <div className="mx-auto max-w-4xl px-6">
          <h1 className="mb-8 text-center text-2xl font-semibold">Answer Breakdown</h1>
          
          {isEvaluating && (
            <div className="mb-6 rounded-lg border border-blue-500 bg-blue-500/10 p-4">
              <div className="flex items-center gap-3">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
                <span className="text-blue-400 font-medium">AI is evaluating your answers...</span>
              </div>
            </div>
          )}
          
          {evaluationError && (
            <div className="mb-6 rounded-lg border border-yellow-500 bg-yellow-500/10 p-4">
              <div className="text-yellow-400 font-medium">⚠️ {evaluationError}</div>
              <div className="text-sm text-muted-foreground mt-1">
                Basic results are shown. Refresh the page to retry AI evaluation.
              </div>
            </div>
          )}
          
          {examResults.questions.map(question => <div key={question.id} className="mb-8 rounded-lg bg-card p-6">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <div className="mb-2 text-lg font-medium">{question.id}.</div>
                  <h3 className="leading-relaxed text-lg">{question.question}</h3>
                </div>
                <button onClick={() => openChatForQuestion(question.id)} className="flex items-center whitespace-nowrap gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200">
                  <span>Ask chat</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
              
              <AnswerBreakdown question={question} />
            </div>)}
        </div>
      </main>

      <ExamResultsFooter 
        onTryAgain={() => navigate(`/exam/${contentId}`)} 
        onViewResults={() => navigate(`/exam-summary/${contentId}`)} 
      />

      <ChatDrawer 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
        currentQuestionId={currentChatQuestion}
        examId={examMetadata.examId}
        contentId={examMetadata.contentId}
        roomId={examMetadata.roomId}
      />
    </div>;
};
export default ExamResultsInterface;