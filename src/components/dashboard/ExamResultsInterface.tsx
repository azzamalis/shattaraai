
import React, { useState, useEffect, useRef } from 'react';
import { Share2, MessageCircle, ChevronRight, RotateCcw, BarChart3, X, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

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
  answers: {[key: number]: any};
  skippedQuestions: Set<number>;
  score: {
    correct: number;
    incorrect: number;
    skipped: number;
    total: number;
  };
}

interface ChatMessage {
  isUser: boolean;
  content: string;
}

const DUMMY_EXAM_DATA = {
  questions: [
    {
      id: 1,
      type: 'multiple-choice',
      question: 'What is the primary force responsible for the formation of stars?',
      options: [
        'Electromagnetic force',
        'Gravitational force',
        'Nuclear force',
        'Centrifugal force'
      ],
      correctAnswer: 1,
      userAnswer: 0,
      explanation: 'Gravitational force is the primary force responsible for star formation. It causes clouds of gas and dust in space to collapse, leading to the formation of protostars and eventually stars. The intense pressure and temperature at the core, also a result of gravitational compression, enables nuclear fusion to begin.',
      referenceTime: '2:15',
      referenceSource: 'Stellar Formation Basics'
    },
    {
      id: 2,
      type: 'free-text',
      question: 'Explain how scientists can detect and study black holes despite them not emitting light.',
      userAnswer: 'asdfasasdf',
      feedback: 'While your answer needs more detail, here\'s a comprehensive explanation: Scientists detect black holes through indirect methods such as: 1) Observing the gravitational effects on nearby stars and gas, 2) Detecting X-ray emissions from heated material falling into the black hole, 3) Gravitational lensing effects, and 4) Recently, through gravitational wave detection when black holes merge.',
      referenceTime: '5:30',
      referenceSource: 'Black Hole Detection Methods'
    },
    {
      id: 3,
      type: 'multiple-choice',
      question: 'How does the size of a black hole affect the experience of traveling inside it?',
      options: [
        'Supermassive black holes kill instantly upon crossing the event horizon.',
        'Larger black holes have stronger tidal forces that cause immediate death.',
        'Smaller black holes kill before the event horizon; supermassive ones allow longer survival.',
        'Smaller black holes allow for longer survival due to weaker gravity effects.'
      ],
      correctAnswer: 2,
      userAnswer: 2,
      explanation: 'Correct! In smaller black holes, tidal forces are much stronger near the event horizon, leading to "spaghettification" before reaching it. In supermassive black holes, these forces are relatively weaker at the event horizon, theoretically allowing for longer survival past this point, though eventual destruction is still certain.',
      referenceTime: '8:45',
      referenceSource: 'Black Hole Physics'
    },
    {
      id: 4,
      type: 'free-text',
      question: 'Describe the process of nuclear fusion in stars and its role in stellar evolution.',
      isSkipped: true,
      feedback: 'Nuclear fusion in stars primarily involves the fusion of hydrogen nuclei into helium through the proton-proton chain reaction or CNO cycle. This process releases enormous energy, providing the outward pressure that balances the star\'s gravitational collapse. As stars age, they can fuse heavier elements, leading to different evolutionary stages. The type of fusion occurring in a star\'s core determines its position on the main sequence and its eventual fate.',
      referenceTime: '12:20',
      referenceSource: 'Stellar Evolution'
    },
    {
      id: 5,
      type: 'multiple-choice',
      question: 'Which of the following best describes the relationship between a star\'s mass and its lifespan?',
      options: [
        'More massive stars live longer than less massive stars',
        'A star\'s mass has no effect on its lifespan',
        'Less massive stars live longer than more massive stars',
        'All stars have approximately the same lifespan'
      ],
      correctAnswer: 2,
      userAnswer: 1,
      explanation: 'Incorrect. Less massive stars actually live longer than more massive stars. This is because massive stars burn through their nuclear fuel much more quickly due to the intense gravitational pressure and higher core temperatures. A low-mass red dwarf might live for trillions of years, while a very massive star might only live for a few million years.',
      referenceTime: '15:10',
      referenceSource: 'Stellar Lifespans'
    }
  ],
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
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [currentChatQuestion, setCurrentChatQuestion] = useState<number | null>(null);
  const chatMessagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Add dummy data when component mounts
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
        skippedQuestions: new Set(parsed.skippedQuestions), // Convert array back to Set
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
    // If no results found, redirect to exam page
    navigate('/exam');
    return null;
  })();

  const openChatForQuestion = (questionId: number) => {
    setCurrentChatQuestion(questionId);
    setIsChatOpen(true);
    setChatMessages([
      {
        isUser: false,
        content: `I'm here to help you understand question ${questionId}. What would you like to know?`
      }
    ]);
  };

  const sendMessage = () => {
    if (!chatInput.trim()) return;
    
    setChatMessages(prev => [...prev, { isUser: true, content: chatInput }]);
    
    setTimeout(() => {
      setChatMessages(prev => [...prev, { 
        isUser: false, 
        content: 'This is a simulated AI tutor response. In a real implementation, this would connect to your AI service.' 
      }]);
    }, 1000);
    
    setChatInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMessage();
    }
  };

  const renderMultipleChoiceAnswer = (question: Question) => {
    return (
      <div className="space-y-3">
        {question.options?.map((option, index) => {
          let borderColor = 'border-border';
          let bgColor = 'bg-card';
          
          if (index === question.correctAnswer) {
            borderColor = 'border-green-500';
            bgColor = 'bg-green-500/10';
          } else if (index === question.userAnswer && index !== question.correctAnswer) {
            borderColor = 'border-red-500';
            bgColor = 'bg-red-500/10';
          }

          return (
            <div
              key={index}
              className={`w-full rounded-lg border p-4 ${borderColor} ${bgColor}`}
            >
              <span className="mr-3 font-medium">{String.fromCharCode(65 + index)}.</span>
              {option}
            </div>
          );
        })}
        
        <div className={`mt-4 rounded-lg border p-4 ${
          question.userAnswer === question.correctAnswer 
            ? 'border-green-500 bg-green-500/10' 
            : 'border-red-500 bg-red-500/10'
        }`}>
          <div className={`mb-2 font-medium ${
            question.userAnswer === question.correctAnswer ? 'text-green-400' : 'text-red-400'
          }`}>
            {question.userAnswer === question.correctAnswer ? 'Correct' : 'Incorrect'}
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {question.explanation || 'Explanation not available for this question.'}
          </p>
          {question.referenceTime && question.referenceSource && (
            <div className="mt-2 text-xs text-muted-foreground">
              Reference: {question.referenceTime} {question.referenceSource}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderFreeTextAnswer = (question: Question) => {
    if (question.isSkipped) {
      return (
        <div>
          <div className="mb-4 rounded-lg border border-border bg-card p-4">
            <div className="text-muted-foreground italic">Question was skipped</div>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="mb-2 font-medium text-muted-foreground">Suggested Answer</div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {question.feedback || 'Sample answer not available for this question.'}
            </p>
            {question.referenceTime && question.referenceSource && (
              <div className="mt-2 text-xs text-muted-foreground">
                Reference: {question.referenceTime} {question.referenceSource}
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div>
        <div className="mb-4 rounded-lg border border-border bg-card p-4">
          <div className="mb-2 text-sm text-muted-foreground">Your Answer:</div>
          <div className="text-foreground">{question.userAnswer || 'No answer provided'}</div>
        </div>
        <div className="rounded-lg border border-green-500 bg-green-500/10 p-4">
          <div className="mb-2 font-medium text-green-400">AI Feedback</div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {question.feedback || 'Good effort! This type of question requires detailed explanation of the concepts involved.'}
          </p>
          {question.referenceTime && question.referenceSource && (
            <div className="mt-2 text-xs text-muted-foreground">
              Reference: {question.referenceTime} {question.referenceSource}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderAnswerBreakdown = (question: Question) => {
    if (question.type === 'multiple-choice') {
      return renderMultipleChoiceAnswer(question);
    } else {
      return renderFreeTextAnswer(question);
    }
  };

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  if (!examResults) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-card">
        <div className="flex items-center justify-between px-6 py-3">
          {/* Left: Share Button */}
          <button className="flex items-center gap-2 rounded-md bg-accent px-3 py-2 text-sm hover:bg-accent/80">
            <Share2 className="h-4 w-4" />
            Share exam
          </button>
          
          {/* Center: Progress Bar (completed) */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{examResults.score.total}</span>
            <div className="h-2 w-96 rounded-full bg-border">
              <div className="h-full w-full rounded-full bg-primary"></div>
            </div>
            <span className="text-sm text-muted-foreground">{examResults.score.total}</span>
          </div>
          
          {/* Right: Space Chat Button */}
          <button 
            onClick={() => setIsChatOpen(true)}
            className="flex items-center gap-2 rounded-md bg-accent px-3 py-2 text-sm hover:bg-accent/80"
          >
            <MessageCircle className="h-4 w-4" />
            Space Chat
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="pb-24 pt-8">
        <div className="mx-auto max-w-4xl px-6">
          <h1 className="mb-8 text-center text-2xl font-semibold">Answer Breakdown</h1>
          
          {examResults.questions.map((question) => (
            <div key={question.id} className="mb-8 rounded-lg bg-card p-6">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <div className="mb-2 text-lg font-medium">{question.id}.</div>
                  <h3 className="text-xl leading-relaxed">{question.question}</h3>
                </div>
                <button 
                  onClick={() => openChatForQuestion(question.id)}
                  className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                >
                  Ask chat <ChevronRight className="h-4 w-4" />
                </button>
              </div>
              
              {renderAnswerBreakdown(question)}
            </div>
          ))}
        </div>
      </main>

      {/* Sticky Footer */}
      <footer className="fixed bottom-0 left-0 right-0 border-t border-border bg-card px-6 py-4">
        <div className="mx-auto flex max-w-4xl gap-4">
          <button className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-accent py-3 font-medium hover:bg-accent/80">
            <RotateCcw className="h-5 w-5" />
            Try Again
          </button>
          <button 
            onClick={() => navigate('/exam/results')}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary py-3 font-medium text-primary-foreground hover:bg-primary/90"
          >
            <BarChart3 className="h-5 w-5" />
            View Results
          </button>
        </div>
      </footer>

      {/* Sliding Chat Drawer */}
      {isChatOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div 
            className="flex-1 bg-black/50" 
            onClick={() => setIsChatOpen(false)}
          />
          <div className="w-96 bg-card shadow-xl flex flex-col">
            {/* Header with close button */}
            <div className="flex items-center justify-between border-b border-border p-4">
              <h2 className="text-lg font-semibold">Space Chat</h2>
              <button 
                onClick={() => setIsChatOpen(false)}
                className="rounded-md p-1 hover:bg-accent"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            
            {/* Scrollable messages area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatMessages.map((message, index) => (
                <div key={index} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-lg p-3 ${
                    message.isUser 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-accent text-foreground'
                  }`}>
                    {message.content}
                  </div>
                </div>
              ))}
              <div ref={chatMessagesEndRef} />
            </div>
            
            {/* Input area at bottom */}
            <div className="border-t border-border p-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask a question..."
                  className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none"
                />
                <button 
                  onClick={sendMessage}
                  className="rounded-lg bg-primary px-3 py-2 hover:bg-primary/90"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamResultsInterface;
