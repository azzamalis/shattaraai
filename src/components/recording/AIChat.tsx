import React, { useState } from "react";
import { MessageSquare, Copy, RotateCcw } from "lucide-react";
import { ChatInput } from "@/components/chat/ChatInput";
import { RichMessage } from "@/components/chat/RichMessage";
import { 
  ChatContainerRoot, 
  ChatContainerContent, 
  ChatContainerScrollAnchor 
} from "@/components/prompt-kit/chat-container";
import { 
  Message, 
  MessageAvatar, 
  MessageContent,
  MessageActions,
  MessageAction
} from "@/components/prompt-kit/message";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
interface Message {
  id: number;
  content: string;
  sender: "user" | "ai";
  timestamp?: Date;
}
const AIChat = () => {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSendMessage = (content: string) => {
    if (content.trim() === "") return;
    const newMessage: Message = {
      id: Date.now(),
      content,
      sender: "user",
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
    setInputValue("");

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: Date.now() + 1,
        content: `I'm your AI tutor. I've received your message: "${content}"`,
        sender: "ai",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const handleCopy = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      toast.success("Message copied to clipboard");
    } catch (error) {
      toast.error("Failed to copy message");
    }
  };

  const handleRegenerate = (messageId: number) => {
    toast.info("Regenerating response...");
    // Add regenerate logic here
  };
  return (
    <div className="flex flex-col h-full relative bg-background">
      <div className="absolute inset-0 bottom-[140px]">
        <ChatContainerRoot className="h-full px-4">
          <ChatContainerContent>
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center min-h-[400px] text-center px-4">
                <div className="mb-6">
                  <MessageSquare className="h-12 w-12 text-dashboard-text-secondary/40 dark:text-dashboard-text-secondary/40 mx-auto" />
                </div>
                <h3 className="font-semibold text-dashboard-text dark:text-white mb-3 text-lg">
                  Learn with Shattara AI
                </h3>
                <p className="text-dashboard-text-secondary/80 dark:text-[#878787] text-sm max-w-md mb-8">
                  Your personal AI tutor ready to help you learn, understand, and excel in your studies
                </p>
              </div>
            ) : (
              <div className="space-y-6 py-4">
                {messages.map((msg) => (
                  <Message key={msg.id} className="group">
                    <MessageAvatar
                      src={msg.sender === "user" ? "" : "/lovable-uploads/shattara-logo.png"}
                      alt={msg.sender === "user" ? "User" : "Shattara AI"}
                      fallback={msg.sender === "user" ? "U" : "AI"}
                      className="mt-1"
                    />
                    <div className="flex-1 space-y-2">
                      {msg.sender === "ai" ? (
                        <RichMessage content={msg.content} />
                      ) : (
                        <MessageContent className="bg-[#00A3FF] text-white">
                          {msg.content}
                        </MessageContent>
                      )}
                      <div className="flex items-center gap-2 text-xs text-dashboard-text-secondary/60 dark:text-dashboard-text-secondary/60">
                        <span>
                          {msg.timestamp?.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                        {msg.sender === "ai" && (
                          <MessageActions className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <MessageAction tooltip="Copy message">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={() => handleCopy(msg.content)}
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </MessageAction>
                            <MessageAction tooltip="Regenerate response">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={() => handleRegenerate(msg.id)}
                              >
                                <RotateCcw className="h-3 w-3" />
                              </Button>
                            </MessageAction>
                          </MessageActions>
                        )}
                      </div>
                    </div>
                  </Message>
                ))}
              </div>
            )}
            <ChatContainerScrollAnchor />
          </ChatContainerContent>
        </ChatContainerRoot>
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-dashboard-card/80 dark:bg-dashboard-card">
        <div className="pt-4 bg-background">
          <ChatInput value={inputValue} onChange={setInputValue} onSend={handleSendMessage} />
        </div>
      </div>
    </div>
  );
};
export default AIChat;