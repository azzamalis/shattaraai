
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, FileText, BookOpen, Brain, FileStack } from "lucide-react";
import AIChat from "./AIChat";
import QuizPreferences from './QuizPreferences';
import { NotesEditor } from '@/components/content/NotesEditor';

const RightSidebar = () => {
  const [activeTab, setActiveTab] = useState("chat");
  const [isRecording, setIsRecording] = useState(false);

  return (
    <div className="h-full flex flex-col bg-dashboard-bg border-l border-dashboard-separator">
      <Tabs defaultValue="chat" onValueChange={setActiveTab} className="flex-1 flex flex-col h-full">
        <div className="p-6 pb-4 bg-dashboard-bg">
          <TabsList className="w-full bg-dashboard-card border border-dashboard-separator rounded-lg p-1 h-12 grid grid-cols-5 gap-1">
            <TabsTrigger 
              value="chat" 
              className="h-10 rounded-md bg-transparent text-dashboard-text-secondary hover:text-dashboard-text data-[state=active]:bg-dashboard-bg data-[state=active]:text-dashboard-text data-[state=active]:shadow-sm transition-all duration-200 flex flex-col items-center justify-center gap-1 px-2"
            >
              <MessageCircle className="h-4 w-4" />
              <span className="text-xs font-medium">Chat</span>
            </TabsTrigger>
            <TabsTrigger 
              value="flashcards" 
              className="h-10 rounded-md bg-transparent text-dashboard-text-secondary hover:text-dashboard-text data-[state=active]:bg-dashboard-bg data-[state=active]:text-dashboard-text data-[state=active]:shadow-sm transition-all duration-200 flex flex-col items-center justify-center gap-1 px-2"
            >
              <FileStack className="h-4 w-4" />
              <span className="text-xs font-medium">Cards</span>
            </TabsTrigger>
            <TabsTrigger 
              value="exams" 
              className="h-10 rounded-md bg-transparent text-dashboard-text-secondary hover:text-dashboard-text data-[state=active]:bg-dashboard-bg data-[state=active]:text-dashboard-text data-[state=active]:shadow-sm transition-all duration-200 flex flex-col items-center justify-center gap-1 px-2"
            >
              <Brain className="h-4 w-4" />
              <span className="text-xs font-medium">Exams</span>
            </TabsTrigger>
            <TabsTrigger 
              value="summary" 
              className="h-10 rounded-md bg-transparent text-dashboard-text-secondary hover:text-dashboard-text data-[state=active]:bg-dashboard-bg data-[state=active]:text-dashboard-text data-[state=active]:shadow-sm transition-all duration-200 flex flex-col items-center justify-center gap-1 px-2"
            >
              <BookOpen className="h-4 w-4" />
              <span className="text-xs font-medium">Summary</span>
            </TabsTrigger>
            <TabsTrigger 
              value="notes" 
              className="h-10 rounded-md bg-transparent text-dashboard-text-secondary hover:text-dashboard-text data-[state=active]:bg-dashboard-bg data-[state=active]:text-dashboard-text data-[state=active]:shadow-sm transition-all duration-200 flex flex-col items-center justify-center gap-1 px-2"
            >
              <FileText className="h-4 w-4" />
              <span className="text-xs font-medium">Notes</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="chat" className="flex-1 overflow-hidden">
          <AIChat />
        </TabsContent>
        <TabsContent value="flashcards" className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-dashboard-text-secondary space-y-4 p-6">
              <FileStack className="h-12 w-12 mb-2" />
              <p className="text-center max-w-md text-base">Ready to review the key concepts? I've got flashcards lined up to make memorization quick and easy.</p>
            </div>
          </ScrollArea>
        </TabsContent>
        <TabsContent value="exams" className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] bg-dashboard-bg">
              <QuizPreferences />
            </div>
          </ScrollArea>
        </TabsContent>
        <TabsContent value="summary" className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-dashboard-text-secondary space-y-4 p-6">
              <BookOpen className="h-12 w-12 mb-2" />
              <p className="text-center max-w-md text-base">Want the short version before diving deep? I've prepped a crisp summary to save you time and focus your attention.</p>
            </div>
          </ScrollArea>
        </TabsContent>
        <TabsContent value="notes" className="flex-1 overflow-hidden">
          <NotesEditor isRecording={isRecording} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RightSidebar;
