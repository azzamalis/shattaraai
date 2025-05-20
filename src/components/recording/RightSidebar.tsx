
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, FileText, BookOpen, Brain, FileStack } from "lucide-react";
import AIChat from "./AIChat";

const RightSidebar = () => {
  const [activeTab, setActiveTab] = useState("chat");

  return (
    <div className="h-full flex flex-col bg-[#0F0F0F]">
      <Tabs defaultValue="chat" className="flex-1 flex flex-col h-full" onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start border-b border-[#2A2A2A] rounded-none gap-1 p-1 h-12 bg-[#111111] shrink-0">
          <TabsTrigger
            value="chat"
            className="flex-1 h-full rounded-md data-[state=active]:bg-[#1A1A1A] data-[state=active]:text-white data-[state=active]:border data-[state=active]:border-white/10 flex items-center justify-center gap-2 text-sm font-medium text-white/70 hover:text-white transition-[background-color,border-color] duration-100"
          >
            <MessageCircle className="h-4 w-4" />
            Chat
          </TabsTrigger>
          <TabsTrigger
            value="flashcards"
            className="flex-1 h-full rounded-md data-[state=active]:bg-[#1A1A1A] data-[state=active]:text-white data-[state=active]:border data-[state=active]:border-white/10 flex items-center justify-center gap-2 text-sm font-medium text-white/70 hover:text-white transition-[background-color,border-color] duration-100"
          >
            <FileStack className="h-4 w-4" />
            Flashcards
          </TabsTrigger>
          <TabsTrigger
            value="quizzes"
            className="flex-1 h-full rounded-md data-[state=active]:bg-[#1A1A1A] data-[state=active]:text-white data-[state=active]:border data-[state=active]:border-white/10 flex items-center justify-center gap-2 text-sm font-medium text-white/70 hover:text-white transition-[background-color,border-color] duration-100"
          >
            <Brain className="h-4 w-4" />
            Quizzes
          </TabsTrigger>
          <TabsTrigger
            value="summary"
            className="flex-1 h-full rounded-md data-[state=active]:bg-[#1A1A1A] data-[state=active]:text-white data-[state=active]:border data-[state=active]:border-white/10 flex items-center justify-center gap-2 text-sm font-medium text-white/70 hover:text-white transition-[background-color,border-color] duration-100"
          >
            <BookOpen className="h-4 w-4" />
            Summary
          </TabsTrigger>
          <TabsTrigger
            value="notes"
            className="flex-1 h-full rounded-md data-[state=active]:bg-[#1A1A1A] data-[state=active]:text-white data-[state=active]:border data-[state=active]:border-white/10 flex items-center justify-center gap-2 text-sm font-medium text-white/70 hover:text-white transition-[background-color,border-color] duration-100"
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
            <div className="flex flex-col items-center justify-center h-full min-h-[screen] text-white/60 space-y-4 p-4">
              <FileStack className="h-12 w-12 mb-2" />
              <p className="text-lg text-center max-w-md">Ready to review the key concepts? I've got flashcards lined up to make memorization quick and easy.</p>
            </div>
          </ScrollArea>
        </TabsContent>
        <TabsContent value="quizzes" className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-white/60 space-y-4 p-4">
              <Brain className="h-12 w-12 mb-2" />
              <p className="text-lg text-center max-w-md">Think you've got it down? A quick practice exam is ready to help you find out.</p>
            </div>
          </ScrollArea>
        </TabsContent>
        <TabsContent value="summary" className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-white/60 space-y-4 p-4">
              <BookOpen className="h-12 w-12 mb-2" />
              <p className="text-lg text-center max-w-md">Want the short version before diving deep? I've prepped a crisp summary to save you time and focus your attention.</p>
            </div>
          </ScrollArea>
        </TabsContent>
        <TabsContent value="notes" className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-white/60 space-y-4 p-4">
              <FileText className="h-12 w-12 mb-2" />
              <p className="text-lg text-center max-w-md">Need a refresher on what you've covered? Your smart notes are already organized and waiting.</p>
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RightSidebar;
