import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
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
  const [chatType, setChatType] = useState<'question' | 'space'>('question');
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
      examId: contentId,
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
    setChatType('question');
    setIsChatOpen(true);
  };

  const handleClose = () => {
    navigate('/dashboard');
  };

  if (!examResults) {
    return null;
  }

  return (
    <div className="flex h-screen flex-col bg-background text-foreground">
      <ExamResultsHeader 
        totalQuestions={examResults.score.total} 
        onOpenChat={() => {
          setCurrentChatQuestion(null);
          setChatType('space');
          setIsChatOpen(true);
        }}
        onClose={handleClose}
      />

      {/* Scrollable Content - Main Scrolling Div */}
      <div className="mx-auto mt-16 w-full flex-grow overflow-y-auto px-4 pb-24 lg:w-3/5 2xl:w-1/2">
        <div className="flex flex-col gap-24">
          {examResults.questions.map((question, index) => (
            <div key={question.id} className="h-full w-full overflow-y-auto rounded-lg" role="region" aria-roledescription="carousel">
              <div className="p-2">
                {/* Question Header */}
                <div className="mb-2 flex items-start justify-between gap-2">
                  <div className="text-md flex flex-1 space-x-2 font-normal leading-relaxed">
                    <span className="flex-shrink-0">{index + 1}.</span>
                    <div className="flex-1">
                      <div className="prose prose-neutral dark:prose-invert max-w-none">
                        <div className="space-y-4">
                          <p className="text-base leading-7 last:mb-0">
                            {question.question}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="items-end">
                    <button 
                      onClick={() => openChatForQuestion(question.id)}
                      className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-2xl px-3 gap-x-2"
                    >
                      <span>Ask chat</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Answer Section */}
                <AnswerBreakdown question={question} contentId={contentId} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <ExamResultsFooter 
        onTryAgain={() => {
          if (examMetadata.roomId) {
            navigate(`/room/${examMetadata.roomId}`);
          } else {
            navigate('/dashboard');
          }
        }} 
        onViewResults={() => navigate(`/exam-summary/${contentId}`)} 
      />

      <ChatDrawer 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
        currentQuestionId={currentChatQuestion}
        examId={examMetadata.examId}
        contentId={examMetadata.contentId}
        roomId={examMetadata.roomId}
        chatType={chatType}
      />
    </div>
  );
};

export default ExamResultsInterface;
