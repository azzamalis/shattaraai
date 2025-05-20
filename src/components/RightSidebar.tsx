
import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, FileText, BookOpen, Brain, FileStack } from "lucide-react";
import AIChat from "./recording/AIChat";

const RightSidebar = () => {
  const [activeTab, setActiveTab] = useState("chat");

  return (
    <div className="h-full flex flex-col bg-[#0F0F0F]">
      <Tabs defaultValue="chat" className="w-full h-full" onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start border-b border-white/10 rounded-none gap-1 p-1 h-12 bg-[#111111]">
          <TabsTrigger
            value="chat"
            className="flex-1 h-full rounded-md data-[state=active]:bg-[#1A1A1A] data-[state=active]:text-white data-[state=active]:border data-[state=active]:border-white/10 flex items-center justify-center gap-2 text-sm font-medium text-white/70 hover:text-white transition-colors duration-100"
          >
            <MessageCircle className="h-4 w-4" />
            <span>Chat</span>
          </TabsTrigger>
          <TabsTrigger
            value="flashcards"
            className="flex-1 h-full rounded-md data-[state=active]:bg-[#1A1A1A] data-[state=active]:text-white data-[state=active]:border data-[state=active]:border-white/10 flex items-center justify-center gap-2 text-sm font-medium text-white/70 hover:text-white transition-colors duration-100"
          >
            <FileStack className="h-4 w-4" />
            <span>Flashcards</span>
          </TabsTrigger>
          <TabsTrigger
            value="quizzes"
            className="flex-1 h-full rounded-md data-[state=active]:bg-[#1A1A1A] data-[state=active]:text-white data-[state=active]:border data-[state=active]:border-white/10 flex items-center justify-center gap-2 text-sm font-medium text-white/70 hover:text-white transition-colors duration-100"
          >
            <Brain className="h-4 w-4" />
            <span>Quizzes</span>
          </TabsTrigger>
          <TabsTrigger
            value="summary"
            className="flex-1 h-full rounded-md data-[state=active]:bg-[#1A1A1A] data-[state=active]:text-white data-[state=active]:border data-[state=active]:border-white/10 flex items-center justify-center gap-2 text-sm font-medium text-white/70 hover:text-white transition-colors duration-100"
          >
            <BookOpen className="h-4 w-4" />
            <span>Summary</span>
          </TabsTrigger>
          <TabsTrigger
            value="notes"
            className="flex-1 h-full rounded-md data-[state=active]:bg-[#1A1A1A] data-[state=active]:text-white data-[state=active]:border data-[state=active]:border-white/10 flex items-center justify-center gap-2 text-sm font-medium text-white/70 hover:text-white transition-colors duration-100"
          >
            <FileText className="h-4 w-4" />
            <span>Notes</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="p-0 m-0 h-full">
          <AIChat />
        </TabsContent>

        <TabsContent value="flashcards" className="p-0 m-0 h-full">
          <ScrollArea className="h-[calc(100vh-160px)]">
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-white/40 space-y-4 p-4">
              <FileStack className="h-12 w-12" />
              <p className="text-lg">Learn with the AI Tutor</p>
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="quizzes" className="p-0 m-0 h-full">
          <ScrollArea className="h-[calc(100vh-160px)]">
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-white/40 space-y-4 p-4">
              <Brain className="h-12 w-12" />
              <p className="text-lg">Learn with the AI Tutor</p>
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="summary" className="p-0 m-0 h-full">
          <ScrollArea className="h-[calc(100vh-160px)]">
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-white/40 space-y-4 p-4">
              <BookOpen className="h-12 w-12" />
              <p className="text-lg">Learn with the AI Tutor</p>
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="notes" className="p-0 m-0 h-full">
          <ScrollArea className="h-[calc(100vh-160px)]">
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-white/40 space-y-4 p-4">
              <FileText className="h-12 w-12" />
              <p className="text-lg">Learn with the AI Tutor</p>
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RightSidebar;
