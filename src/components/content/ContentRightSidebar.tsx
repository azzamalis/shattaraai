import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, FileText, BookOpen, Brain, FileStack } from "lucide-react";
import AIChat from "@/components/recording/AIChat";
import QuizPreferences from '@/components/recording/QuizPreferences';
import Notes from '@/components/recording/Notes';
import { ContentData } from '@/pages/ContentPage';
import { cn } from '@/lib/utils';

interface ContentRightSidebarProps {
  contentData: ContentData;
}

export function ContentRightSidebar({ contentData }: ContentRightSidebarProps) {
  const [activeTab, setActiveTab] = useState("chat");
  const [isRecording, setIsRecording] = useState(false);

  return (
    <div className="h-full flex flex-col">
      <Tabs 
        defaultValue="chat" 
        onValueChange={setActiveTab} 
        className="flex-1 flex flex-col h-full"
      >
        <TabsList className={cn(
          "w-full justify-start gap-1 p-1 h-12 shrink-0",
          "bg-[#1D1D1D] hover:bg-[#1D1D1D]/90 transition-colors duration-200",
          "rounded-xl"
        )}>
          <TabsTrigger 
            value="chat" 
            className={cn(
              "flex-1 h-full rounded-md flex items-center justify-center gap-2",
              "text-sm font-medium",
              "text-dashboard-text-secondary hover:text-dashboard-text transition-colors",
              "data-[state=active]:bg-[#121212]",
              "data-[state=active]:text-dashboard-text",
              "data-[state=active]:shadow-none",
              "focus-visible:ring-0 focus-visible:ring-offset-0",
              "focus:ring-0 focus:ring-offset-0",
              "ring-0 ring-offset-0",
              "border-0 outline-none",
              "data-[state=active]:ring-0",
              "data-[state=active]:ring-offset-0",
              "data-[state=active]:border-0",
              "data-[state=active]:outline-none"
            )}
          >
            <MessageCircle className="h-4 w-4" />
            Chat
          </TabsTrigger>
          
          <TabsTrigger 
            value="flashcards"
            className={cn(
              "flex-1 h-full rounded-md flex items-center justify-center gap-2",
              "text-sm font-medium",
              "text-dashboard-text-secondary hover:text-dashboard-text transition-colors",
              "data-[state=active]:bg-[#121212]",
              "data-[state=active]:text-dashboard-text",
              "data-[state=active]:shadow-none",
              "focus-visible:ring-0 focus-visible:ring-offset-0",
              "focus:ring-0 focus:ring-offset-0",
              "ring-0 ring-offset-0",
              "border-0 outline-none",
              "data-[state=active]:ring-0",
              "data-[state=active]:ring-offset-0",
              "data-[state=active]:border-0",
              "data-[state=active]:outline-none"
            )}
          >
            <FileStack className="h-4 w-4" />
            Flashcards
          </TabsTrigger>
          
          <TabsTrigger 
            value="exams"
            className={cn(
              "flex-1 h-full rounded-md flex items-center justify-center gap-2",
              "text-sm font-medium",
              "text-dashboard-text-secondary hover:text-dashboard-text transition-colors",
              "data-[state=active]:bg-[#121212]",
              "data-[state=active]:text-dashboard-text",
              "data-[state=active]:shadow-none",
              "focus-visible:ring-0 focus-visible:ring-offset-0",
              "focus:ring-0 focus:ring-offset-0",
              "ring-0 ring-offset-0",
              "border-0 outline-none",
              "data-[state=active]:ring-0",
              "data-[state=active]:ring-offset-0",
              "data-[state=active]:border-0",
              "data-[state=active]:outline-none"
            )}
          >
            <Brain className="h-4 w-4" />
            Exams
          </TabsTrigger>
          
          <TabsTrigger 
            value="summary"
            className={cn(
              "flex-1 h-full rounded-md flex items-center justify-center gap-2",
              "text-sm font-medium",
              "text-dashboard-text-secondary hover:text-dashboard-text transition-colors",
              "data-[state=active]:bg-[#121212]",
              "data-[state=active]:text-dashboard-text",
              "data-[state=active]:shadow-none",
              "focus-visible:ring-0 focus-visible:ring-offset-0",
              "focus:ring-0 focus:ring-offset-0",
              "ring-0 ring-offset-0",
              "border-0 outline-none",
              "data-[state=active]:ring-0",
              "data-[state=active]:ring-offset-0",
              "data-[state=active]:border-0",
              "data-[state=active]:outline-none"
            )}
          >
            <BookOpen className="h-4 w-4" />
            Summary
          </TabsTrigger>
          
          <TabsTrigger 
            value="notes"
            className={cn(
              "flex-1 h-full rounded-md flex items-center justify-center gap-2",
              "text-sm font-medium",
              "text-dashboard-text-secondary hover:text-dashboard-text transition-colors",
              "data-[state=active]:bg-[#121212]",
              "data-[state=active]:text-dashboard-text",
              "data-[state=active]:shadow-none",
              "focus-visible:ring-0 focus-visible:ring-offset-0",
              "focus:ring-0 focus:ring-offset-0",
              "ring-0 ring-offset-0",
              "border-0 outline-none",
              "data-[state=active]:ring-0",
              "data-[state=active]:ring-offset-0",
              "data-[state=active]:border-0",
              "data-[state=active]:outline-none"
            )}
          >
            <FileText className="h-4 w-4" />
            Notes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="flex-1 overflow-hidden">
          <AIChat />
        </TabsContent>
        
        <TabsContent value="flashcards" className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className={cn(
              "flex flex-col items-center justify-center h-full min-h-[screen]",
              "text-dashboard-text-secondary space-y-4 p-4"
            )}>
              <FileStack className="h-12 w-12 mb-2" />
              <p className="text-center max-w-md text-base">
                Ready to review the key concepts? I've got flashcards lined up to make memorization quick and easy.
              </p>
            </div>
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="exams" className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="flex flex-col items-center justify-center h-full min-h-[400px]">
              <QuizPreferences />
            </div>
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="summary" className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className={cn(
              "flex flex-col items-center justify-center h-full min-h-[400px]",
              "text-dashboard-text-secondary space-y-4 p-4"
            )}>
              <BookOpen className="h-12 w-12 mb-2" />
              <p className="text-center max-w-md text-base">
                Want the short version before diving deep? I've prepped a crisp summary to save you time and focus your attention.
              </p>
            </div>
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="notes" className="flex-1 overflow-hidden">
          <Notes isRecording={isRecording} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
