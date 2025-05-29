
import React, { useState, useEffect, useRef } from 'react';
import { Share2, MessageCircle, ChevronRight, RotateCcw, BarChart3, X, Send } from 'lucide-react';

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

interface ChatMessage {
  isUser: boolean;
  content: string;
}

interface ExamResults {
  questions: Question[];
  answers: { [key: number]: any };
  skippedQuestions: Set<number>;
  score: {
    correct: number;
    incorrect: number;
    skipped: number;
    total: number;
  };
}

const ExamResultsInterface: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [currentChatQuestion, setCurrentChatQuestion] = useState<number | null>(null);
  const chatMessagesRef = useRef<HTMLDivElement>(null);

  // Sample data structure for testing
  const examResults: ExamResults = {
    questions: [
      {
        id: 1,
        type: 'multiple-choice',
        question: 'How does the size of a black hole affect the experience of traveling inside it?',
        options: [
          'Supermassive black holes kill instantly upon crossing the event horizon.',
          'Larger black holes have stronger tidal forces that cause immediate death.',
          'Smaller black holes kill before the event horizon; supermassive ones allow longer survival.',
          'Smaller black holes allow for longer survival due to weaker gravity effects.'
        ],
        correctAnswer: 2,
        userAnswer: 0,
        explanation: 'This is correct because smaller black holes have stronger tidal forces near the event horizon that would be fatal quickly. In contrast, supermassive black holes have a less steep gravitational gradient, allowing longer survival inside before reaching the singularity.',
        referenceTime: '03:38:',
        referenceSource: 'Types and Sizes of Black H...'
      },
      {
        id: 2,
        type: 'multiple-choice',
        question: 'What defines the event horizon of a black hole?',
        options: [
          'The region where gravitational pull is weakest and light can escape',
          'The point at which the gravitational force is equal to the escape velocity of objects',
          'The boundary beyond which nothing can escape, not even light',
          'The area surrounding a black hole where matter is drawn in but not trapped'
        ],
        correctAnswer: 2,
        userAnswer: 2,
        explanation: 'Correct! The event horizon is the boundary around a black hole beyond which nothing, not even light, can escape due to the extreme gravitational pull.',
        referenceTime: '01:15:',
        referenceSource: 'Event Horizon Definition...'
      },
      {
        id: 3,
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
        explanation: 'Gravitational force is the primary force that causes gas and dust to collapse and form stars. While electromagnetic forces play a role, gravity is the dominant force in stellar formation.',
        referenceTime: '02:22:',
        referenceSource: 'Star Formation Process...'
      },
      {
        id: 4,
        type: 'free-text',
        question: 'Explain the difference between the event horizon and the singularity in a black hole.',
        userAnswer: 'The event horizon is the boundary around a black hole where nothing can escape, while the singularity is the center point where all matter is compressed.',
        feedback: 'Good explanation! You correctly identified that the event horizon is the boundary beyond which escape is impossible, and the singularity is the theoretical point of infinite density at the center. You could expand on how the event horizon is observable while the singularity remains hidden.',
        referenceTime: '01:45:',
        referenceSource: 'Black Hole Structure...'
      },
      {
        id: 5,
        type: 'free-text',
        question: 'Explain the two possible outcomes for a person after crossing the Event Horizon of a black hole.',
        userAnswer: '',
        feedback: 'After crossing the Event Horizon, one outcome is dying from tidal forces that stretch and destroy the body (spaghettification). The other hypothesized outcome is encountering a firewall, a theoretical boundary that would instantly destroy anything crossing it.',
        referenceTime: '02:40:',
        referenceSource: 'Effects of Falling into a Bla...',
        isSkipped: true
      },
      {
        id: 6,
        type: 'multiple-choice',
        question: 'Why is the singularity inside a black hole considered a theoretical challenge?',
        options: [
          'Because it is believed to be a portal to another universe or dimension',
          'Because it may be infinitely dense and its nature is unknown',
          'Because it is theorized to emit radiation that can be detected',
          'Because it is surrounded by an event horizon that prevents observation'
        ],
        correctAnswer: 1,
        userAnswer: 1,
        explanation: 'The singularity is thought to concentrate all the black hole\'s mass into a single point with no volume or surface, leading to infinite density.',
        referenceTime: '01:38:',
        referenceSource: 'Event Horizon and Singular..'
      }
    ],
    answers: { 1: 0, 2: 2, 3: 0, 4: 'The event horizon is the boundary around a black hole where nothing can escape, while the singularity is the center point where all matter is compressed.', 5: '', 6: 1 },
    skippedQuestions: new Set([5]),
    score: { correct: 3, incorrect: 2, skipped: 1, total: 6 }
  };

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [chatMessages]);

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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  const renderMultipleChoiceAnswer = (question: Question) => {
    return (
      <div className="space-y-3">
        {question.options?.map((option, index) => {
          let borderColor = 'border-gray-600';
          let bgColor = 'bg-gray-800';
          
          if (index === question.correctAnswer) {
            borderColor = 'border-green-500';
            bgColor = 'bg-green-900/10';
          } else if (index === question.userAnswer && index !== question.correctAnswer) {
            borderColor = 'border-red-500';
            bgColor = 'bg-red-900/10';
          }
          
          return (
            <div
              key={index}
              className={`rounded-lg border p-4 ${borderColor} ${bgColor}`}
            >
              <span className="mr-3 font-medium">{String.fromCharCode(65 + index)}.</span>
              {option}
            </div>
          );
        })}
        
        <div className={`mt-4 rounded-lg p-4 ${
          question.userAnswer === question.correctAnswer 
            ? 'bg-green-900/10 border border-green-500' 
            : 'bg-red-900/10 border border-red-500'
        }`}>
          <p className={`text-sm leading-relaxed ${
            question.userAnswer === question.correctAnswer ? 'text-green-400' : 'text-red-400'
          }`}>
            {question.explanation}
          </p>
          {question.referenceTime && question.referenceSource && (
            <p className="mt-2 text-xs text-gray-400">
              Reference: {question.referenceTime} {question.referenceSource}
            </p>
          )}
        </div>
      </div>
    );
  };

  const renderFreeTextAnswer = (question: Question) => {
    if (question.isSkipped) {
      return (
        <div className="space-y-4">
          <div className="rounded-lg border border-gray-600 bg-gray-800 p-4">
            <p className="text-gray-400 italic">Question was skipped</p>
          </div>
          
          <div className="rounded-lg border border-gray-600 bg-gray-800 p-4">
            <p className="text-sm text-gray-300 leading-relaxed">
              {question.feedback}
            </p>
            {question.referenceTime && question.referenceSource && (
              <p className="mt-2 text-xs text-gray-400">
                Reference: {question.referenceTime} {question.referenceSource}
              </p>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="rounded-lg border border-gray-600 bg-gray-700 p-4">
          <p className="text-white leading-relaxed">{question.userAnswer}</p>
        </div>
        
        <div className="rounded-lg border border-green-500 bg-green-900/10 p-4">
          <p className="text-sm text-green-400 leading-relaxed">
            {question.feedback}
          </p>
          {question.referenceTime && question.referenceSource && (
            <p className="mt-2 text-xs text-gray-400">
              Reference: {question.referenceTime} {question.referenceSource}
            </p>
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

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 border-b border-gray-700 bg-gray-800">
        <div className="flex items-center justify-between px-6 py-3">
          {/* Left: Share Button */}
          <button className="flex items-center gap-2 rounded-md bg-gray-700 px-3 py-2 text-sm hover:bg-gray-600">
            <Share2 className="h-4 w-4" />
            Share exam
          </button>
          
          {/* Center: Progress Bar (completed) */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">{examResults.score.total}</span>
            <div className="h-2 w-96 rounded-full bg-gray-700">
              <div className="h-full w-full rounded-full bg-blue-500"></div>
            </div>
            <span className="text-sm text-gray-400">{examResults.score.total}</span>
          </div>
          
          {/* Right: Space Chat Button */}
          <button 
            onClick={() => setIsChatOpen(true)}
            className="flex items-center gap-2 rounded-md bg-gray-700 px-3 py-2 text-sm hover:bg-gray-600"
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
            <div key={question.id} className="mb-8 rounded-lg bg-gray-800 p-6">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <div className="mb-2 text-lg font-medium">{question.id}.</div>
                  <h3 className="text-xl leading-relaxed">{question.question}</h3>
                </div>
                <button 
                  onClick={() => openChatForQuestion(question.id)}
                  className="flex items-center gap-1 text-sm text-gray-400 hover:text-white"
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
      <footer className="fixed bottom-0 left-0 right-0 border-t border-gray-700 bg-gray-800 px-6 py-4">
        <div className="mx-auto flex max-w-4xl gap-4">
          <button className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gray-700 py-3 font-medium hover:bg-gray-600">
            <RotateCcw className="h-5 w-5" />
            Try Again
          </button>
          <button className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-white py-3 font-medium text-black hover:bg-gray-100">
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
          <div className="w-96 bg-gray-800 shadow-xl flex flex-col">
            {/* Header with close button */}
            <div className="flex items-center justify-between border-b border-gray-700 px-6 py-4">
              <h3 className="text-lg font-semibold">Space Chat</h3>
              <button 
                onClick={() => setIsChatOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {/* Scrollable messages area */}
            <div 
              ref={chatMessagesRef}
              className="flex-1 overflow-y-auto p-6 space-y-4"
            >
              {chatMessages.map((message, index) => (
                <div 
                  key={index} 
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] rounded-lg px-4 py-3 ${
                      message.isUser 
                        ? 'bg-white text-black' 
                        : 'bg-transparent border border-gray-600 text-white'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.content}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Input area at bottom */}
            <div className="border-t border-gray-700 p-6">
              <div className="flex gap-3">
                <input 
                  value={chatInput} 
                  onChange={(e) => setChatInput(e.target.value)} 
                  onKeyDown={handleKeyDown} 
                  placeholder="Ask anything..." 
                  className="flex-1 rounded-lg border border-gray-600 bg-gray-700 px-4 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" 
                />
                <button 
                  onClick={sendMessage} 
                  disabled={!chatInput.trim()} 
                  className="rounded-lg bg-blue-500 p-2 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="h-5 w-5" />
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
