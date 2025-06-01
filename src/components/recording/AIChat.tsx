import React, { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare } from "lucide-react";
import { ChatInput } from "@/components/chat/ChatInput";
import { cn } from "@/lib/utils";

interface Message {
  id: number;
  content: string;
  sender: "user" | "ai";
}

const AIChat = () => {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSendMessage = (content: string) => {
    if (content.trim() === "") return;
    
    const newMessage: Message = {
      id: Date.now(),
      content,
      sender: "user"
    };
    setMessages(prev => [...prev, newMessage]);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: Date.now() + 1,
        content: `I'm your AI tutor. I've received your message: "${content}"`,
        sender: "ai"
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-full relative bg-transparent">
      <div className="absolute inset-0 bottom-[140px] overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-4 bg-transparent">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center min-h-[400px] text-center px-4">
                <div className="mb-6">
                  <MessageSquare className="h-12 w-12 text-dashboard-text-secondary/50 dark:text-[#878787]" />
                </div>
                <h3 className="text-xl font-semibold text-dashboard-text dark:text-white mb-3">
                  Learn with Shattara AI
                </h3>
                <p className="text-dashboard-text-secondary/80 dark:text-[#878787] text-sm max-w-md mb-8">
                  Your personal AI tutor ready to help you learn, understand, and excel in your studies
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={cn(
                      "max-w-[80%] rounded-lg p-3",
                      msg.sender === "user" 
                        ? "bg-dashboard-card dark:bg-dashboard-card text-dashboard-text dark:text-dashboard-text" 
                        : "bg-transparent text-dashboard-text dark:text-dashboard-text"
                    )}>
                      {msg.content}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-dashboard-card/80 dark:bg-dashboard-card border-t border-dashboard-separator dark:border-dashboard-separator">
        <div className="pt-4">
          <ChatInput 
            value={inputValue}
            onChange={setInputValue}
            onSend={handleSendMessage}
          />
        </div>
      </div>
    </div>
  );
};

export default AIChat;
