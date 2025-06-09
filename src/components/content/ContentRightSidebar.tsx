import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, FileText, BookOpen, Brain, FileStack } from "lucide-react";
import AIChat from "@/components/recording/AIChat";
import QuizPreferences from '@/components/recording/QuizPreferences';
import Notes from '@/components/recording/Notes';
import { Flashcard, FlashcardData } from './Flashcard';
import { ContentData } from '@/pages/ContentPage';
import { cn } from '@/lib/utils';

// Sample flashcards data - replace with actual data from your backend
const sampleFlashcards = [
  {
    id: "1",
    question: "What is the capital of France?",
    answer: "Paris",
    explanation: "Paris has been France's capital since 987 CE.",
    isStarred: false
  },
  {
    id: "2",
    question: "What is the largest planet in our solar system?",
    answer: "Jupiter",
    explanation: "Jupiter is the fifth planet from the Sun and the largest in the Solar System.",
    isStarred: true
  },
  {
    id: "3",
    question: "What is the chemical symbol for water?",
    answer: "H2O",
    explanation: "H2O is the chemical formula for water, meaning it has two hydrogen atoms and one oxygen atom.",
    isStarred: false
  },
  {
    id: "4",
    question: "Who painted the Mona Lisa?",
    answer: "Leonardo da Vinci",
    explanation: "Leonardo da Vinci was an Italian polymath of the High Renaissance who is widely considered one of the greatest painters of all time.",
    isStarred: false
  },
  {
    id: "5",
    question: "What is the capital of Japan?",
    answer: "Tokyo",
    explanation: "Tokyo is the capital and most populous prefecture of Japan.",
    isStarred: true
  },
  {
    id: "6",
    question: "What is the highest mountain in the world?",
    answer: "Mount Everest",
    explanation: "Mount Everest is Earth's highest mountain above sea level, located in the Mahalangur Himal sub-range of the Himalayas.",
    isStarred: false
  },
  {
    id: "7",
    question: "What is the main function of the heart?",
    answer: "Pump blood throughout the body",
    explanation: "The heart is a muscular organ that pumps blood through the circulatory system.",
    isStarred: false
  },
  {
    id: "8",
    question: "What is the square root of 64?",
    answer: "8",
    explanation: "The square root of a number is a value that, when multiplied by itself, gives the number.",
    isStarred: true
  },
  {
    id: "9",
    question: "What is the process by which plants make their own food?",
    answer: "Photosynthesis",
    explanation: "Photosynthesis is the process used by plants, algae, and certain bacteria to convert light energy into chemical energy.",
    isStarred: false
  },
  {
    id: "10",
    question: "Which gas do plants absorb from the atmosphere?",
    answer: "Carbon Dioxide",
    explanation: "Plants absorb carbon dioxide from the atmosphere for photosynthesis and release oxygen.",
    isStarred: false
  }
];

interface ContentRightSidebarProps {
  contentData: ContentData;
}

export function ContentRightSidebar({
  contentData
}: ContentRightSidebarProps) {
  const [activeTab, setActiveTab] = useState("chat");
  const [isRecording, setIsRecording] = useState(false);
  const [cards, setCards] = useState<FlashcardData[]>(sampleFlashcards);
  const [isShuffled, setIsShuffled] = useState(false);

  const handleStarCard = (index: number) => {
    // Implement star functionality
    console.log('Star card:', index);
  };

  const handleEditCard = (index: number, updatedCard: any) => {
    // Implement edit functionality
    console.log('Edit card:', index, updatedCard);
    // In a real application, you would update your state or call an API here
  };

  const handleManageCards = () => {
    // Implement manage cards functionality
    console.log('Manage cards');
  };

  const handleFilterCards = () => {
    // Implement filter functionality
    console.log('Filter cards');
  };

  const handleShuffleCards = () => {
    // Implement shuffle functionality
    console.log('Shuffle cards');
  };

  const handleShuffle = () => {
    if (isShuffled) {
      // Restore original order
      setCards(sampleFlashcards);
      setIsShuffled(false);
    } else {
      // Shuffle cards using Fisher-Yates algorithm
      const shuffled = [...sampleFlashcards];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      setCards(shuffled);
      setIsShuffled(true);
    }
  };

  return <div className="h-full flex flex-col content-right-sidebar bg-dashboard-card dark:bg-dashboard-card">
      <Tabs defaultValue="chat" onValueChange={setActiveTab} className="h-full flex flex-col">
        <TabsList className={cn("w-full justify-start gap-1 p-1 h-12 shrink-0 m-4 mb-0", "bg-dashboard-bg dark:bg-dashboard-bg transition-colors duration-200", "rounded-xl")}>
          <TabsTrigger value="chat" className={cn("flex-1 h-full rounded-md flex items-center justify-center gap-2", "text-sm font-medium", "text-dashboard-text-secondary/70 dark:text-dashboard-text-secondary/70", "hover:text-dashboard-text-secondary dark:hover:text-dashboard-text-secondary", "data-[state=active]:text-dashboard-text dark:data-[state=active]:text-dashboard-text", "data-[state=active]:bg-dashboard-card dark:data-[state=active]:bg-dashboard-card", "data-[state=active]:shadow-none", "transition-colors duration-200", "focus-visible:ring-0 focus-visible:ring-offset-0", "focus:ring-0 focus:ring-offset-0", "ring-0 ring-offset-0", "border-0 outline-none", "data-[state=active]:ring-0", "data-[state=active]:ring-offset-0", "data-[state=active]:border-0", "data-[state=active]:outline-none")}>
            <MessageCircle className="h-[14px] w-[14px]" />
            <span className="text-sm">Chat</span>
          </TabsTrigger>
          
          <TabsTrigger value="flashcards" className={cn("flex-1 h-full rounded-md flex items-center justify-center gap-2", "text-sm font-medium", "text-dashboard-text-secondary/70 dark:text-dashboard-text-secondary/70", "hover:text-dashboard-text-secondary dark:hover:text-dashboard-text-secondary", "data-[state=active]:text-dashboard-text dark:data-[state=active]:text-dashboard-text", "data-[state=active]:bg-dashboard-card dark:data-[state=active]:bg-dashboard-card", "data-[state=active]:shadow-none", "transition-colors duration-200", "focus-visible:ring-0 focus-visible:ring-offset-0", "focus:ring-0 focus:ring-offset-0", "ring-0 ring-offset-0", "border-0 outline-none", "data-[state=active]:ring-0", "data-[state=active]:ring-offset-0", "data-[state=active]:border-0", "data-[state=active]:outline-none")}>
            <FileStack className="h-[14px] w-[14px]" />
            <span className="text-sm">Flashcards</span>
          </TabsTrigger>
          
          <TabsTrigger value="exams" className={cn("flex-1 h-full rounded-md flex items-center justify-center gap-2", "text-sm font-medium", "text-dashboard-text-secondary/70 dark:text-dashboard-text-secondary/70", "hover:text-dashboard-text-secondary dark:hover:text-dashboard-text-secondary", "data-[state=active]:text-dashboard-text dark:data-[state=active]:text-dashboard-text", "data-[state=active]:bg-dashboard-card dark:data-[state=active]:bg-dashboard-card", "data-[state=active]:shadow-none", "transition-colors duration-200", "focus-visible:ring-0 focus-visible:ring-offset-0", "focus:ring-0 focus:ring-offset-0", "ring-0 ring-offset-0", "border-0 outline-none", "data-[state=active]:ring-0", "data-[state=active]:ring-offset-0", "data-[state=active]:border-0", "data-[state=active]:outline-none")}>
            <Brain className="h-[14px] w-[14px]" />
            <span className="text-sm">Exams</span>
          </TabsTrigger>
          
          <TabsTrigger value="summary" className={cn("flex-1 h-full rounded-md flex items-center justify-center gap-2", "text-sm font-medium", "text-dashboard-text-secondary/70 dark:text-dashboard-text-secondary/70", "hover:text-dashboard-text-secondary dark:hover:text-dashboard-text-secondary", "data-[state=active]:text-dashboard-text dark:data-[state=active]:text-dashboard-text", "data-[state=active]:bg-dashboard-card dark:data-[state=active]:bg-dashboard-card", "data-[state=active]:shadow-none", "transition-colors duration-200", "focus-visible:ring-0 focus-visible:ring-offset-0", "focus:ring-0 focus:ring-offset-0", "ring-0 ring-offset-0", "border-0 outline-none", "data-[state=active]:ring-0", "data-[state=active]:ring-offset-0", "data-[state=active]:border-0", "data-[state=active]:outline-none")}>
            <BookOpen className="h-[14px] w-[14px]" />
            <span className="text-sm">Summary</span>
          </TabsTrigger>
          
          <TabsTrigger value="notes" className={cn("flex-1 h-full rounded-md flex items-center justify-center gap-2", "text-sm font-medium", "text-dashboard-text-secondary/70 dark:text-dashboard-text-secondary/70", "hover:text-dashboard-text-secondary dark:hover:text-dashboard-text-secondary", "data-[state=active]:text-dashboard-text dark:data-[state=active]:text-dashboard-text", "data-[state=active]:bg-dashboard-card dark:data-[state=active]:bg-dashboard-card", "data-[state=active]:shadow-none", "transition-colors duration-200", "focus-visible:ring-0 focus-visible:ring-offset-0", "focus:ring-0 focus:ring-offset-0", "ring-0 ring-offset-0", "border-0 outline-none", "data-[state=active]:ring-0", "data-[state=active]:ring-offset-0", "data-[state=active]:border-0", "data-[state=active]:outline-none")}>
            <FileText className="h-[14px] w-[14px]" />
            <span className="text-sm">Notes</span>
          </TabsTrigger>
        </TabsList>

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
            <ScrollArea className="h-full">
              <Flashcard
                cards={cards}
                onStar={handleStarCard}
                onEdit={handleEditCard}
                onManage={handleManageCards}
                onFilter={handleFilterCards}
                onShuffle={handleShuffle}
              />
            </ScrollArea>
          </div>
        </TabsContent>
        
        <TabsContent value="exams" className="flex-1 overflow-hidden mx-4 mb-4">
          <div className="h-full bg-dashboard-bg dark:bg-dashboard-bg rounded-xl">
            <ScrollArea className="h-full">
              <div className="flex flex-col items-center justify-start pt-8 h-full min-h-[400px]">
                <QuizPreferences />
              </div>
            </ScrollArea>
          </div>
        </TabsContent>
        
        <TabsContent value="summary" className="flex-1 overflow-hidden mx-4 mb-4">
          <div className="h-full bg-dashboard-bg dark:bg-dashboard-bg rounded-xl">
            <ScrollArea className="h-full">
              <div className={cn("flex flex-col items-center justify-center h-full min-h-[400px]", "text-dashboard-text/60 dark:text-dashboard-text-secondary space-y-4 p-8")}>
                <BookOpen className="h-12 w-12 mb-2" />
                <p className="text-center max-w-md text-base">
                  Want the short version before diving deep? I've prepped a crisp summary to save you time and focus your attention.
                </p>
              </div>
            </ScrollArea>
          </div>
        </TabsContent>
        
        <TabsContent value="notes" className="flex-1 overflow-hidden mx-4 mb-4">
          <div className="h-full bg-dashboard-bg dark:bg-dashboard-bg rounded-xl">
            <Notes isRecording={isRecording} />
          </div>
        </TabsContent>
      </Tabs>
    </div>;
}