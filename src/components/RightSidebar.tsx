
import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, FileText, BookOpen, Brain, FileStack } from "lucide-react";
import AIChat from "./recording/AIChat";

const RightSidebar = () => {
  const [activeTab, setActiveTab] = useState("chat");

  return (
    <div className="h-full flex flex-col">
      <Tabs defaultValue="chat" className="w-full h-full" onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start border-b rounded-none gap-0 p-0 h-11">
          <TabsTrigger
            value="chat"
            className={`data-[state=active]:bg-transparent flex-1 h-full rounded-none ${
              activeTab === "chat" ? "active-tab" : ""
            }`}
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Chat
          </TabsTrigger>
          <TabsTrigger
            value="flashcards"
            className={`data-[state=active]:bg-transparent flex-1 h-full rounded-none ${
              activeTab === "flashcards" ? "active-tab" : ""
            }`}
          >
            <FileStack className="h-4 w-4 mr-2" />
            Flashcards
          </TabsTrigger>
          <TabsTrigger
            value="quizzes"
            className={`data-[state=active]:bg-transparent flex-1 h-full rounded-none ${
              activeTab === "quizzes" ? "active-tab" : ""
            }`}
          >
            <Brain className="h-4 w-4 mr-2" />
            Quizzes
          </TabsTrigger>
          <TabsTrigger
            value="summary"
            className={`data-[state=active]:bg-transparent flex-1 h-full rounded-none ${
              activeTab === "summary" ? "active-tab" : ""
            }`}
          >
            <BookOpen className="h-4 w-4 mr-2" />
            Summary
          </TabsTrigger>
          <TabsTrigger
            value="notes"
            className={`data-[state=active]:bg-transparent flex-1 h-full rounded-none ${
              activeTab === "notes" ? "active-tab" : ""
            }`}
          >
            <FileText className="h-4 w-4 mr-2" />
            Notes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="p-0 m-0 h-full">
          <AIChat />
        </TabsContent>

        <TabsContent value="flashcards" className="p-0 m-0 h-full">
          <ScrollArea className="h-[calc(100vh-160px)]">
            <div className="p-4 flex items-center justify-center h-full text-sm text-muted-foreground">
              Start recording to generate flashcards
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="quizzes" className="p-0 m-0 h-full">
          <ScrollArea className="h-[calc(100vh-160px)]">
            <div className="p-4 flex items-center justify-center h-full text-sm text-muted-foreground">
              Start recording to generate quizzes
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="summary" className="p-0 m-0 h-full">
          <ScrollArea className="h-[calc(100vh-160px)]">
            <div className="p-4 flex items-center justify-center h-full text-sm text-muted-foreground">
              Start recording to generate summary
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="notes" className="p-0 m-0 h-full">
          <ScrollArea className="h-[calc(100vh-160px)]">
            <div className="p-4 flex items-center justify-center h-full text-sm text-muted-foreground">
              Start recording to take notes
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RightSidebar;
