import React, { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Paperclip, AudioWaveform, GraduationCap, Search, MessageSquare } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface Message {
  id: number;
  content: string;
  sender: "user" | "ai";
}

const AIChat = () => {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<Message[]>([{
    id: 1,
    content: "Hi! I'd like to learn about quantum physics.",
    sender: "user"
  }, {
    id: 2,
    content: "I'd be happy to help you learn about quantum physics! Let's break it down into manageable concepts. What specific aspect would you like to explore first? We could start with:\n\n1. Basic principles of quantum mechanics\n2. Wave-particle duality\n3. Quantum superposition\n4. The uncertainty principle",
    sender: "ai"
  }, {
    id: 3,
    content: "Let's start with wave-particle duality. Can you explain it in simple terms?",
    sender: "user"
  }, {
    id: 4,
    content: "Wave-particle duality is one of the most fascinating concepts in quantum physics! Imagine this: everything in the universe - light, electrons, atoms - can behave both as a wave and as a particle, depending on how we observe it.\n\nThink of it like this:\n• When light hits a solar panel, it acts like particles (photons)\n• But when light passes through narrow slits, it creates interference patterns like waves\n\nWould you like me to generate some flashcards about this concept to help you remember it better?",
    sender: "ai"
  }, {
    id: 5,
    content: "Yes, please create some flashcards about wave-particle duality!",
    sender: "user"
  }, {
    id: 6,
    content: "I'll create a set of flashcards about wave-particle duality. Here's what I'm including:\n\n1. Basic definition\n2. Key experiments (double-slit experiment)\n3. Real-world applications\n4. Historical discoveries\n\nWould you like me to add any specific aspects to these flashcards?",
    sender: "ai"
  }, {
    id: 7,
    content: "Could you also include something about how this relates to everyday life?",
    sender: "user"
  }, {
    id: 8,
    content: "Absolutely! I'll add practical examples like:\n• How digital cameras work (light as particles)\n• LCD screens (wave properties of light)\n• Medical imaging (electron microscopes)\n• Solar panels (photoelectric effect)\n\nI'm generating comprehensive flashcards now that include these real-world applications. Would you like to review them?",
    sender: "ai"
  }, {
    id: 9,
    content: "Yes, I'd love to review the flashcards. Also, could you explain the double-slit experiment in more detail?",
    sender: "user"
  }, {
    id: 10,
    content: "Of course! The double-slit experiment is a perfect demonstration of wave-particle duality. Here's a detailed explanation:\n\n1. Setup:\n• A source emits particles/waves\n• They pass through two parallel slits\n• A detection screen records where they land\n\n2. The Strange Part:\n• If we send particles one by one, they still create a wave interference pattern\n• But if we observe which slit they go through, they behave like particles\n\n3. Key Insight:\n• This shows that the act of measurement affects quantum behavior\n• The particle exists in multiple states until observed\n\nWould you like me to include this explanation in your flashcards as well?",
    sender: "ai"
  }, {
    id: 11,
    content: "This is mind-bending! So the particle somehow knows it's being observed?",
    sender: "user"
  }, {
    id: 12,
    content: "That's one of the most puzzling aspects of quantum mechanics! It's not that the particle 'knows' it's being observed, but rather that the act of observation itself affects the quantum system. This leads us to another fascinating concept called 'quantum measurement problem.'\n\nAs the famous physicist Richard Feynman once said: 'If you think you understand quantum mechanics, you don't understand quantum mechanics.'\n\nWould you like to explore this measurement paradox further, or shall we review the flashcards I've prepared about wave-particle duality?",
    sender: "ai"
  }]);
  const [isRecording, setIsRecording] = useState(false);
  const [activeMode, setActiveMode] = useState<"learn" | "search" | null>(null);

  const handleSendMessage = () => {
    if (inputValue.trim() === "") return;
    const newMessage: Message = {
      id: Date.now(),
      content: inputValue,
      sender: "user"
    };
    setMessages(prev => [...prev, newMessage]);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: Date.now() + 1,
        content: `I'm your AI tutor. I've received your message: "${inputValue}"`,
        sender: "ai"
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
    setInputValue("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 min-h-0">
        <ScrollArea className="h-full">
          <div className="p-4 h-full bg-dashboard-bg dark:bg-dashboard-bg">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center min-h-[400px] text-center">
                <div className="h-16 w-16 mb-4 flex items-center justify-center text-dashboard-text-secondary">
                  <MessageSquare className="h-10 w-10" />
                </div>
                <h3 className="font-medium text-lg text-dashboard-text">
                  Chat with Shattara AI
                </h3>
                <p className="text-sm text-dashboard-text-secondary mt-2">
                  Ask Shattara AI to generate flashcards, notes, summaries and quizzes
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map(msg => (
                  <div 
                    key={msg.id} 
                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div 
                      className={cn(
                        "max-w-[80%] rounded-lg p-3 text-[#FAFAFA]",
                        msg.sender === "user" 
                          ? "bg-[#1D1D1D]"
                          : "bg-transparent"
                      )}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      <div className="flex flex-col gap-2 p-4 border-t border-dashboard-separator shrink-0 bg-dashboard-bg dark:bg-dashboard-bg">
        <div className="flex items-center gap-2">
          <Input 
            value={inputValue} 
            onChange={e => setInputValue(e.target.value)} 
            onKeyDown={handleKeyPress} 
            placeholder="Ask anything..." 
            className={cn(
              "flex-1 bg-dashboard-card dark:bg-dashboard-card",
              "text-dashboard-text border-dashboard-separator",
              "rounded-lg focus:border-dashboard-text/20",
              "focus:ring-0 focus:outline-none",
              "placeholder:text-dashboard-text-secondary h-10"
            )}
          />
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-10 w-10 text-dashboard-text-secondary hover:text-dashboard-text hover:bg-dashboard-card-hover rounded-lg"
          >
            <Paperclip className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className={cn(
              "h-10 w-10 hover:bg-dashboard-card-hover rounded-lg",
              isRecording ? "text-red-500" : "text-dashboard-text-secondary hover:text-dashboard-text"
            )}
            onClick={toggleRecording}
          >
            <AudioWaveform className="h-5 w-5" />
          </Button>
          <Button 
            onClick={handleSendMessage} 
            size="icon" 
            disabled={!inputValue.trim()} 
            className="h-10 w-10 text-dashboard-text hover:bg-dashboard-card-hover rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setActiveMode(activeMode === "learn" ? null : "learn")} 
            className={cn(
              "h-8 px-3 rounded-full flex items-center gap-1 font-normal transition-colors duration-200",
              activeMode === "learn" 
                ? "bg-dashboard-text text-dashboard-bg hover:bg-dashboard-text/90" 
                : "text-dashboard-text-secondary hover:text-dashboard-text hover:bg-dashboard-card-hover"
            )}
          >
            <GraduationCap className="h-4 w-4" />
            Learn+
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setActiveMode(activeMode === "search" ? null : "search")} 
            className={cn(
              "h-8 px-3 rounded-full flex items-center gap-1 font-normal transition-colors duration-200",
              activeMode === "search" 
                ? "bg-dashboard-text text-dashboard-bg hover:bg-dashboard-text/90" 
                : "text-dashboard-text-secondary hover:text-dashboard-text hover:bg-dashboard-card-hover"
            )}
          >
            <Search className="h-4 w-4" />
            Search
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AIChat;