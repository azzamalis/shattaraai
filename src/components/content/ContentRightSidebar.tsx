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
    <div className="h-full flex flex-col content-right-sidebar">
      <Tabs 
        defaultValue="chat" 
        onValueChange={setActiveTab} 
        className="h-full flex flex-col"
      >
        <TabsList className={cn(
          "w-full justify-start gap-1 p-1 h-12 shrink-0",
          "bg-[#1D1D1D] transition-colors duration-200",
          "rounded-xl"
        )}>
          <TabsTrigger 
            value="chat" 
            className={cn(
              "flex-1 h-full rounded-md flex items-center justify-center gap-2",
              "text-sm font-medium",
              "text-dashboard-text-secondary/70",
              "hover:text-dashboard-text-secondary",
              "data-[state=active]:text-dashboard-text",
              "data-[state=active]:bg-[#121212]",
              "data-[state=active]:shadow-none",
              "transition-colors duration-200",
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
            <MessageCircle className="h-[14px] w-[14px]" />
            <span>Chat</span>
          </TabsTrigger>
          
          <TabsTrigger 
            value="flashcards"
            className={cn(
              "flex-1 h-full rounded-md flex items-center justify-center gap-2",
              "text-sm font-medium",
              "text-dashboard-text-secondary/70",
              "hover:text-dashboard-text-secondary",
              "data-[state=active]:text-dashboard-text",
              "data-[state=active]:bg-[#121212]",
              "data-[state=active]:shadow-none",
              "transition-colors duration-200",
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
            <FileStack className="h-[14px] w-[14px]" />
            <span>Flashcards</span>
          </TabsTrigger>
          
          <TabsTrigger 
            value="exams"
            className={cn(
              "flex-1 h-full rounded-md flex items-center justify-center gap-2",
              "text-sm font-medium",
              "text-dashboard-text-secondary/70",
              "hover:text-dashboard-text-secondary",
              "data-[state=active]:text-dashboard-text",
              "data-[state=active]:bg-[#121212]",
              "data-[state=active]:shadow-none",
              "transition-colors duration-200",
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
            <Brain className="h-[14px] w-[14px]" />
            <span>Exams</span>
          </TabsTrigger>
          
          <TabsTrigger 
            value="summary"
            className={cn(
              "flex-1 h-full rounded-md flex items-center justify-center gap-2",
              "text-sm font-medium",
              "text-dashboard-text-secondary/70",
              "hover:text-dashboard-text-secondary",
              "data-[state=active]:text-dashboard-text",
              "data-[state=active]:bg-[#121212]",
              "data-[state=active]:shadow-none",
              "transition-colors duration-200",
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
            <BookOpen className="h-[14px] w-[14px]" />
            <span>Summary</span>
          </TabsTrigger>
          
          <TabsTrigger 
            value="notes"
            className={cn(
              "flex-1 h-full rounded-md flex items-center justify-center gap-2",
              "text-sm font-medium",
              "text-dashboard-text-secondary/70",
              "hover:text-dashboard-text-secondary",
              "data-[state=active]:text-dashboard-text",
              "data-[state=active]:bg-[#121212]",
              "data-[state=active]:shadow-none",
              "transition-colors duration-200",
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
            <FileText className="h-[14px] w-[14px]" />
            <span>Notes</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent 
          value="chat" 
          className={cn(
            "flex-1 overflow-hidden mt-0",
            "content-page-tab-content"
          )}
        >
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
