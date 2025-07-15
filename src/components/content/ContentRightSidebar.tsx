import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, FileText, BookOpen, Brain, FileStack } from "lucide-react";
import AIChat from "@/components/recording/AIChat";
import QuizPreferences from '@/components/recording/QuizPreferences';
import Notes from '@/components/recording/Notes';
import { FlashcardContainer } from './FlashcardContainer';
import { SummaryDisplay } from './SummaryDisplay';
import { ContentData } from '@/pages/ContentPage';
import { cn } from '@/lib/utils';
import { FlashcardData } from './Flashcard';

// Enhanced sample flashcards data with new fields
const sampleFlashcards: FlashcardData[] = [{
  id: "1",
  question: "What is the capital of France?",
  answer: "Paris",
  hint: "It's known as the City of Light",
  explanation: "Paris has been France's capital since 987 CE and is located in the north-central part of the country.",
  source: "Geography Textbook",
  page: 142,
  concept: "European Capitals",
  timeSpent: 30,
  correct: true,
  isStarred: false
}, {
  id: "2",
  question: "What is the largest planet in our solar system?",
  answer: "Jupiter",
  hint: "It's a gas giant with distinctive bands",
  explanation: "Jupiter is the fifth planet from the Sun and the largest in the Solar System, with a mass more than twice that of all other planets combined.",
  source: "Astronomy Course",
  page: 89,
  concept: "Solar System",
  timeSpent: 45,
  correct: true,
  isStarred: true
}, {
  id: "3",
  question: "What is the chemical symbol for water?",
  answer: "H2O",
  hint: "It contains hydrogen and oxygen",
  explanation: "H2O represents two hydrogen atoms bonded to one oxygen atom, forming the most essential compound for life.",
  source: "Chemistry Fundamentals",
  page: 23,
  concept: "Chemical Formulas",
  timeSpent: 20,
  correct: false,
  isStarred: false
}, {
  id: "4",
  question: "Who painted the Mona Lisa?",
  answer: "Leonardo da Vinci",
  hint: "He was also an inventor and scientist",
  explanation: "Leonardo da Vinci painted the Mona Lisa between 1503-1519. It's housed in the Louvre Museum in Paris.",
  source: "Art History",
  page: 156,
  concept: "Renaissance Art",
  timeSpent: 35,
  correct: true,
  isStarred: false
}, {
  id: "5",
  question: "What is the capital of Japan?",
  answer: "Tokyo",
  hint: "It's one of the world's most populous metropolitan areas",
  explanation: "Tokyo became Japan's capital in 1868, replacing Kyoto. It's the political and economic center of Japan.",
  source: "World Geography",
  page: 203,
  concept: "Asian Capitals",
  timeSpent: 25,
  correct: true,
  isStarred: true
}, {
  id: "6",
  question: "What is the highest mountain in the world?",
  answer: "Mount Everest",
  hint: "It's located in the Himalayas",
  explanation: "Mount Everest stands at 8,848.86 meters (29,031.7 feet) above sea level and is located on the border between Nepal and Tibet.",
  source: "Physical Geography",
  page: 78,
  concept: "Mountain Ranges",
  timeSpent: 40,
  correct: true,
  isStarred: false
}, {
  id: "7",
  question: "What is the main function of the heart?",
  answer: "Pump blood throughout the body",
  hint: "It's the central organ of the circulatory system",
  explanation: "The heart is a muscular organ that pumps blood through blood vessels to supply oxygen and nutrients to tissues throughout the body.",
  source: "Human Biology",
  page: 112,
  concept: "Circulatory System",
  timeSpent: 50,
  correct: true,
  isStarred: false
}, {
  id: "8",
  question: "What is the square root of 64?",
  answer: "8",
  hint: "Think about what number times itself equals 64",
  explanation: "The square root of 64 is 8 because 8 × 8 = 64. Square roots ask what number, when multiplied by itself, gives the original number.",
  source: "Mathematics Basics",
  page: 45,
  concept: "Square Roots",
  timeSpent: 15,
  correct: true,
  isStarred: true
}, {
  id: "9",
  question: "What is the process by which plants make their own food?",
  answer: "Photosynthesis",
  hint: "It requires sunlight and involves converting CO2",
  explanation: "Photosynthesis is the process where plants use sunlight, water, and carbon dioxide to produce glucose and oxygen.",
  source: "Plant Biology",
  page: 67,
  concept: "Plant Processes",
  timeSpent: 55,
  correct: false,
  isStarred: false
}, {
  id: "10",
  question: "Which gas do plants absorb from the atmosphere?",
  answer: "Carbon Dioxide",
  hint: "It's what humans exhale",
  explanation: "Plants absorb carbon dioxide (CO2) from the atmosphere through their stomata and use it in photosynthesis to produce glucose.",
  source: "Environmental Science",
  page: 134,
  concept: "Plant Processes",
  timeSpent: 30,
  correct: true,
  isStarred: false
}];
interface ContentRightSidebarProps {
  contentData: ContentData;
}
export function ContentRightSidebar({
  contentData
}: ContentRightSidebarProps) {
  const [activeTab, setActiveTab] = useState("chat");
  const [isRecording, setIsRecording] = useState(false);
  return <div className="h-full flex flex-col content-right-sidebar bg-dashboard-card dark:bg-dashboard-card">
      {/* Header with TabsList */}
      <div className="border-b border-border/10 bg-background px-[8px] py-[8px]">
        <Tabs defaultValue="chat" onValueChange={setActiveTab} className="w-full">
          <TabsList className={cn("w-full justify-center gap-1 p-1 h-12 shrink-0", "bg-card dark:bg-card", "transition-colors duration-200", "rounded-xl")}>
            <TabsTrigger value="chat" className={cn("flex-1 h-full rounded-md flex items-center justify-center gap-2", "text-sm font-medium", "text-muted-foreground", "hover:text-foreground", "data-[state=active]:text-primary", "data-[state=active]:bg-primary/10", "data-[state=active]:hover:bg-primary/20", "transition-colors duration-200", "focus-visible:ring-0 focus-visible:ring-offset-0", "focus:ring-0 focus:ring-offset-0", "ring-0 ring-offset-0", "border-0 outline-none", "data-[state=active]:ring-0", "data-[state=active]:ring-offset-0", "data-[state=active]:border-0", "data-[state=active]:outline-none")}>
              <MessageCircle className="h-[14px] w-[14px]" />
              <span className="text-sm">Chat</span>
            </TabsTrigger>
            
            <TabsTrigger value="flashcards" className={cn("flex-1 h-full rounded-md flex items-center justify-center gap-2", "text-sm font-medium", "text-muted-foreground", "hover:text-foreground", "data-[state=active]:text-primary", "data-[state=active]:bg-primary/10", "data-[state=active]:hover:bg-primary/20", "transition-colors duration-200", "focus-visible:ring-0 focus-visible:ring-offset-0", "focus:ring-0 focus:ring-offset-0", "ring-0 ring-offset-0", "border-0 outline-none", "data-[state=active]:ring-0", "data-[state=active]:ring-offset-0", "data-[state=active]:border-0", "data-[state=active]:outline-none")}>
              <FileStack className="h-[14px] w-[14px]" />
              <span className="text-sm">Flashcards</span>
            </TabsTrigger>
            
            <TabsTrigger value="exams" className={cn("flex-1 h-full rounded-md flex items-center justify-center gap-2", "text-sm font-medium", "text-muted-foreground", "hover:text-foreground", "data-[state=active]:text-primary", "data-[state=active]:bg-primary/10", "data-[state=active]:hover:bg-primary/20", "transition-colors duration-200", "focus-visible:ring-0 focus-visible:ring-offset-0", "focus:ring-0 focus:ring-offset-0", "ring-0 ring-offset-0", "border-0 outline-none", "data-[state=active]:ring-0", "data-[state=active]:ring-offset-0", "data-[state=active]:border-0", "data-[state=active]:outline-none")}>
              <Brain className="h-[14px] w-[14px]" />
              <span className="text-sm">Exams</span>
            </TabsTrigger>
            
            <TabsTrigger value="summary" className={cn("flex-1 h-full rounded-md flex items-center justify-center gap-2", "text-sm font-medium", "text-muted-foreground", "hover:text-foreground", "data-[state=active]:text-primary", "data-[state=active]:bg-primary/10", "data-[state=active]:hover:bg-primary/20", "transition-colors duration-200", "focus-visible:ring-0 focus-visible:ring-offset-0", "focus:ring-0 focus:ring-offset-0", "ring-0 ring-offset-0", "border-0 outline-none", "data-[state=active]:ring-0", "data-[state=active]:ring-offset-0", "data-[state=active]:border-0", "data-[state=active]:outline-none")}>
              <BookOpen className="h-[14px] w-[14px]" />
              <span className="text-sm">Summary</span>
            </TabsTrigger>
            
            <TabsTrigger value="notes" className={cn("flex-1 h-full rounded-md flex items-center justify-center gap-2", "text-sm font-medium", "text-muted-foreground", "hover:text-foreground", "data-[state=active]:text-primary", "data-[state=active]:bg-primary/10", "data-[state=active]:hover:bg-primary/20", "transition-colors duration-200", "focus-visible:ring-0 focus-visible:ring-offset-0", "focus:ring-0 focus:ring-offset-0", "ring-0 ring-offset-0", "border-0 outline-none", "data-[state=active]:ring-0", "data-[state=active]:ring-offset-0", "data-[state=active]:border-0", "data-[state=active]:outline-none")}>
              <FileText className="h-[14px] w-[14px]" />
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
              <FlashcardContainer initialCards={sampleFlashcards} />
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
                <SummaryDisplay contentData={contentData} />
              </ScrollArea>
            </div>
          </TabsContent>
          
          <TabsContent value="notes" className="flex-1 overflow-hidden m-0 p-0 h-full">
            <div className="h-full w-full bg-dashboard-bg dark:bg-dashboard-bg rounded-xl overflow-hidden">
              <Notes isRecording={isRecording} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>;
}