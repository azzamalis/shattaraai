import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, FileText, BookOpen, Brain, FileStack } from "lucide-react";
import AIChat from "@/components/recording/AIChat";
import QuizPreferences from '@/components/recording/QuizPreferences';
import Notes from '@/components/recording/Notes';
import { FlashcardInterface } from '@/components/flashcards/FlashcardInterface';
import { ContentData } from '@/pages/ContentPage';
import { cn } from '@/lib/utils';

interface ContentRightSidebarProps {
  contentData: ContentData;
}

export function ContentRightSidebar({ contentData }: ContentRightSidebarProps) {
  const [activeTab, setActiveTab] = useState("chat");
  const [isRecording, setIsRecording] = useState(false);

  return (
    <div className="h-full flex flex-col content-right-sidebar bg-dashboard-card dark:bg-dashboard-card">
      <Tabs 
        defaultValue="chat" 
        onValueChange={setActiveTab} 
        className="h-full flex flex-col"
      >
        <TabsList className={cn(
          "w-full justify-start gap-1 p-1 h-12 shrink-0 m-4 mb-0",
          "bg-dashboard-bg dark:bg-dashboard-bg transition-colors duration-200",
          "rounded-xl"
        )}>
          <TabsTrigger 
            value="chat" 
            className={cn(
              "flex-1 h-full rounded-md flex items-center justify-center gap-2",
              "text-sm font-medium",
              "text-dashboard-text-secondary/70 dark:text-dashboard-text-secondary/70",
              "hover:text-dashboard-text-secondary dark:hover:text-dashboard-text-secondary",
              "data-[state=active]:text-dashboard-text dark:data-[state=active]:text-dashboard-text",
              "data-[state=active]:bg-dashboard-card dark:data-[state=active]:bg-dashboard-card",
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
              "text-dashboard-text-secondary/70 dark:text-dashboard-text-secondary/70",
              "hover:text-dashboard-text-secondary dark:hover:text-dashboard-text-secondary",
              "data-[state=active]:text-dashboard-text dark:data-[state=active]:text-dashboard-text",
              "data-[state=active]:bg-dashboard-card dark:data-[state=active]:bg-dashboard-card",
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
              "text-dashboard-text-secondary/70 dark:text-dashboard-text-secondary/70",
              "hover:text-dashboard-text-secondary dark:hover:text-dashboard-text-secondary",
              "data-[state=active]:text-dashboard-text dark:data-[state=active]:text-dashboard-text",
              "data-[state=active]:bg-dashboard-card dark:data-[state=active]:bg-dashboard-card",
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
              "text-dashboard-text-secondary/70 dark:text-dashboard-text-secondary/70",
              "hover:text-dashboard-text-secondary dark:hover:text-dashboard-text-secondary",
              "data-[state=active]:text-dashboard-text dark:data-[state=active]:text-dashboard-text",
              "data-[state=active]:bg-dashboard-card dark:data-[state=active]:bg-dashboard-card",
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
              "text-dashboard-text-secondary/70 dark:text-dashboard-text-secondary/70",
              "hover:text-dashboard-text-secondary dark:hover:text-dashboard-text-secondary",
              "data-[state=active]:text-dashboard-text dark:data-[state=active]:text-dashboard-text",
              "data-[state=active]:bg-dashboard-card dark:data-[state=active]:bg-dashboard-card",
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
            "flex-1 overflow-hidden mx-4 mb-4",
            "content-page-tab-content"
          )}
        >
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
            <FlashcardInterface />
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
              <div className={cn(
                "flex flex-col items-center justify-center h-full min-h-[400px]",
                "text-dashboard-text/60 dark:text-dashboard-text-secondary space-y-4 p-8"
              )}>
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
    </div>
  );
}
