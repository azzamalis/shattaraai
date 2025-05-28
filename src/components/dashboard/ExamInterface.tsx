
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Share2, SkipForward, Undo2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

// Debounce utility function for auto-save only
function debounce(func: (...args: any[]) => void, wait: number) {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

interface Question {
  id: number;
  type: 'multiple-choice' | 'free-text';
  question: string;
  options?: string[];
  correctAnswer?: number;
}

interface ExamConfig {
  topics: string[];
  contentMethod: string;
  numQuestions: number;
  examType: string;
  duration: number; // in minutes
}

interface ExamInterfaceProps {
  examConfig: ExamConfig;
  onSubmitExam: (questions: Question[], answers: {[key: number]: any}, skippedQuestions: Set<number>) => void;
}

const ExamInterface: React.FC<ExamInterfaceProps> = ({ examConfig, onSubmitExam }) => {
  const [answers, setAnswers] = useState<{[key: number]: any}>({});
  const [skippedQuestions, setSkippedQuestions] = useState(new Set<number>());
  const [timeRemaining, setTimeRemaining] = useState(examConfig.duration * 60); // Convert minutes to seconds
  const [isSaving, setIsSaving] = useState(false);
  const [savingQuestionId, setSavingQuestionId] = useState<number | null>(null);

  // Memoize the question generation to prevent re-rendering
  const questions = useMemo(() => {
    const generateQuestions = (config: ExamConfig): Question[] => {
      const multipleChoiceQuestions = [
        {
          type: 'multiple-choice',
          question: 'How does the size of a black hole affect the experience of traveling inside it?',
          options: [
            'Supermassive black holes kill instantly upon crossing the event horizon.',
            'Larger black holes have stronger tidal forces that cause immediate death.',
            'Smaller black holes kill before the event horizon; supermassive ones allow longer survival.',
            'Smaller black holes allow for longer survival due to weaker gravity effects.'
          ],
          correctAnswer: 2
        },
        {
          type: 'multiple-choice',
          question: 'What defines the event horizon of a black hole?',
          options: [
            'The region where gravitational pull is weakest and light can escape',
            'The point at which the gravitational force is equal to the escape velocity of objects',
            'The boundary beyond which nothing can escape, not even light',
            'The area surrounding a black hole where matter is drawn in but not trapped'
          ],
          correctAnswer: 2
        },
        {
          type: 'multiple-choice',
          question: 'What is the primary force responsible for the formation of stars?',
          options: [
            'Electromagnetic force',
            'Gravitational force',
            'Nuclear force',
            'Centrifugal force'
          ],
          correctAnswer: 1
        },
        {
          type: 'multiple-choice',
          question: 'Which of the following best describes nuclear fusion in stars?',
          options: [
            'The splitting of heavy nuclei into lighter ones',
            'The combining of light nuclei to form heavier ones',
            'The decay of radioactive elements',
            'The absorption of cosmic radiation'
          ],
          correctAnswer: 1
        },
        {
          type: 'multiple-choice',
          question: 'What happens to a star when it runs out of nuclear fuel?',
          options: [
            'It immediately explodes as a supernova',
            'It continues burning indefinitely',
            'It begins to collapse under its own gravity',
            'It transforms into a planet'
          ],
          correctAnswer: 2
        }
      ];

      const freeTextQuestions = [
        {
          type: 'free-text',
          question: 'Explain why the evaporation of the largest known black holes takes an extremely long time and what happens at the final stage of their evaporation.'
        },
        {
          type: 'free-text',
          question: 'Explain the difference between the event horizon and the singularity in a black hole.'
        },
        {
          type: 'free-text',
          question: 'Describe the process of nuclear fusion in stars and its role in stellar evolution.'
        },
        {
          type: 'free-text',
          question: 'Discuss the relationship between a star\'s mass and its lifecycle, including the different possible endpoints.'
        },
        {
          type: 'free-text',
          question: 'Explain how scientists can detect and study black holes despite them not emitting light.'
        }
      ];

      let questionPool: any[] = [];
      
      if (config.examType === 'Multiple Choice') {
        questionPool = [...multipleChoiceQuestions];
        while (questionPool.length < config.numQuestions) {
          questionPool = [...questionPool, ...multipleChoiceQuestions];
        }
      } else if (config.examType === 'Free Writing') {
        questionPool = [...freeTextQuestions];
        while (questionPool.length < config.numQuestions) {
          questionPool = [...questionPool, ...freeTextQuestions];
        }
      } else {
        const halfQuestions = Math.floor(config.numQuestions / 2);
        const mcQuestions = multipleChoiceQuestions.slice(0, halfQuestions);
        const ftQuestions = freeTextQuestions.slice(0, config.numQuestions - halfQuestions);
        questionPool = [...mcQuestions, ...ftQuestions];
        questionPool = questionPool.sort(() => Math.random() - 0.5);
      }

      return questionPool.slice(0, config.numQuestions).map((q, index) => ({
        ...q,
        id: index + 1,
        type: q.type as 'multiple-choice' | 'free-text'
      }));
    };

    return generateQuestions(examConfig);
  }, [examConfig]);

  // Timer function
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Progress calculation - count both answered and skipped questions
  const totalCompletedQuestions = Object.keys(answers).length + skippedQuestions.size;
  const progressPercentage = (totalCompletedQuestions / questions.length) * 100;

  // Auto-save function with debounce (separate from state update)
  const debouncedAutoSave = useCallback(
    debounce((questionId: number, value: string) => {
      setIsSaving(true);
      setSavingQuestionId(questionId);
      console.log(`Auto-saving question ${questionId}:`, value);
      setTimeout(() => {
        setIsSaving(false);
        setSavingQuestionId(null);
      }, 500);
    }, 1000),
    []
  );

  // Immediate state update for free text (no debounce)
  const handleFreeTextChange = (questionId: number, value: string) => {
    setAnswers(prev => ({...prev, [questionId]: value}));
    debouncedAutoSave(questionId, value);
  };

  // Multiple choice handler
  const handleMultipleChoiceAnswer = (questionId: number, answerIndex: number) => {
    setAnswers(prev => ({...prev, [questionId]: answerIndex}));
  };

  // Skip/Undo skip handlers
  const handleSkip = (questionId: number) => {
    setSkippedQuestions(prev => new Set([...prev, questionId]));
  };

  const handleUndoSkip = (questionId: number) => {
    setSkippedQuestions(prev => {
      const newSet = new Set(prev);
      newSet.delete(questionId);
      return newSet;
    });
  };

  // Timer logic
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => prev > 0 ? prev - 1 : 0);
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  const handleSubmitExam = () => {
    onSubmitExam(questions, answers, skippedQuestions);
  };

  // Render individual question
  const renderQuestion = (question: Question) => {
    const isSkipped = skippedQuestions.has(question.id);
    const isAnswered = answers.hasOwnProperty(question.id);

    return (
      <div key={question.id} className="mb-8 rounded-lg bg-gray-800 p-6">
        {!isSkipped ? (
          <>
            <div className="mb-8 flex items-start justify-between">
              <div>
                <div className="mb-2 text-lg font-medium">{question.id}.</div>
                <h2 className="text-xl leading-relaxed">{question.question}</h2>
              </div>
              <button 
                onClick={() => handleSkip(question.id)}
                className="flex items-center gap-1 text-sm text-gray-400 hover:text-white"
              >
                <SkipForward className="h-4 w-4" />
                Skip
              </button>
            </div>

            {/* Question Content Based on Type */}
            {question.type === 'multiple-choice' && question.options && (
              <div className="space-y-3">
                {question.options.map((option: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => handleMultipleChoiceAnswer(question.id, index)}
                    className={`w-full rounded-lg border p-4 text-left transition-colors ${
                      answers[question.id] === index
                        ? 'border-blue-500 bg-blue-900/10'
                        : 'border-gray-600 bg-gray-700 hover:border-gray-500'
                    }`}
                  >
                    <span className="mr-3 font-medium">{String.fromCharCode(65 + index)}.</span>
                    {option}
                  </button>
                ))}
              </div>
            )}

            {question.type === 'free-text' && (
              <div className="relative">
                <textarea
                  value={answers[question.id] || ''}
                  onChange={(e) => handleFreeTextChange(question.id, e.target.value)}
                  placeholder="Type your answer here..."
                  className="min-h-32 w-full resize-none rounded-lg border border-gray-600 bg-gray-700 p-4 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                {isSaving && savingQuestionId === question.id && (
                  <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                    <span className="animate-pulse">Saving...</span>
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          // Skipped State
          <>
            <div className="mb-2 text-lg font-medium">{question.id}.</div>
            <h2 className="mb-8 text-xl leading-relaxed text-gray-500">{question.question}</h2>
            <div className="flex justify-center">
              <button 
                onClick={() => handleUndoSkip(question.id)}
                className="flex items-center gap-2 rounded-md bg-gray-700 px-4 py-2 hover:bg-gray-600"
              >
                <Undo2 className="h-4 w-4" />
                Undo Skip
              </button>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header - Sticky */}
      <header className="sticky top-0 z-10 border-b border-gray-700 bg-gray-800">
        <div className="flex items-center justify-between px-6 py-3">
          {/* Left: Share Button */}
          <button className="flex items-center gap-2 rounded-md bg-gray-700 px-3 py-2 text-sm hover:bg-gray-600">
            <Share2 className="h-4 w-4" />
            Share exam
          </button>
          
          {/* Center: Progress Bar */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">0</span>
            <div className="h-2 w-96 rounded-full bg-gray-700">
              <div 
                className="h-full rounded-full bg-blue-500 transition-all duration-300" 
                style={{width: `${progressPercentage}%`}}
              ></div>
            </div>
            <span className="text-sm text-gray-400">{questions.length}</span>
          </div>
          
          {/* Right: Timer */}
          <div className="font-mono text-lg">{formatTime(timeRemaining)}</div>
        </div>
      </header>

      {/* Main Content - Scrollable */}
      <main className="pb-24">
        <ScrollArea className="h-[calc(100vh-140px)]">
          <div className="px-6 py-8">
            <div className="mx-auto max-w-4xl">
              {questions.map(renderQuestion)}
            </div>
          </div>
        </ScrollArea>
      </main>

      {/* Submit Button - Sticky Footer */}
      <footer className="fixed bottom-0 left-0 right-0 border-t border-gray-700 bg-gray-800 px-6 py-4">
        <div className="mx-auto flex max-w-4xl justify-center">
          <button 
            onClick={handleSubmitExam}
            className="rounded-lg bg-white py-4 px-8 text-lg font-medium text-black transition-colors hover:bg-gray-100"
          >
            Submit Exam
          </button>
        </div>
      </footer>
    </div>
  );
};

export default ExamInterface;
