import React, { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Paperclip, AudioWaveform, GraduationCap, Search, MessageSquare, Sparkles, Brain, FileText, BookOpen, Brain as ExamIcon, FileText as NotesIcon, BookOpen as SummaryIcon, Search as SearchIcon, GraduationCap as LearnIcon, FileStack as FlashcardsIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
interface Message {
  id: number;
  content: string;
  sender: "user" | "ai";
}
type QuickSelectionOption = 'search' | 'exams' | 'notes' | 'learn' | 'summary' | 'flashcards' | null;
const AIChat = () => {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedOption, setSelectedOption] = useState<QuickSelectionOption>(null);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isLearnActive, setIsLearnActive] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
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
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };
  const handleSearchToggle = () => {
    if (isSearchActive) {
      setIsSearchActive(false);
      setSelectedOption(null);
    } else {
      setIsSearchActive(true);
      setSelectedOption('search');
    }
  };
  const handleLearnToggle = () => {
    if (isLearnActive) {
      setIsLearnActive(false);
      setSelectedOption(null);
    } else {
      setIsLearnActive(true);
      setSelectedOption('learn');
    }
  };
  const handleOptionToggle = (option: QuickSelectionOption) => {
    if (selectedOption === option) {
      setSelectedOption(null);
    } else {
      setSelectedOption(option);
    }
  };
  const handleExamsClick = () => {
    if (selectedOption === 'exams') {
      setSelectedOption(null);
      setInputValue("");
    } else {
      setSelectedOption('exams');
      setInputValue("Create a @Exams on ");
      const inputElement = document.querySelector('input[type="text"]') as HTMLInputElement;
      if (inputElement) {
        inputElement.focus();
        inputElement.setSelectionRange(inputElement.value.length, inputElement.value.length);
      }
    }
  };
  const getButtonStyles = (option: QuickSelectionOption) => {
    const baseStyles = "flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-sm transition-all duration-200";
    const defaultStyles = "bg-transparent border border-[#F5F5E8]/20 text-[#F5F5E8]";
    const activeStyles = {
      search: "bg-[#00A3FF]/5 border-2 border-[#00A3FF]/50 text-[#00A3FF]",
      exams: "bg-[#FF8A00]/10 border-2 border-[#FF8A00] text-[#FF8A00]",
      notes: "bg-[#FFD600]/5 border-2 border-[#FFD600]/50 text-[#FFD600]",
      learn: "bg-[#00FF85]/5 border-2 border-[#00FF85]/50 text-[#00FF85]",
      summary: "bg-[#A855F7]/5 border-2 border-[#A855F7]/50 text-[#A855F7]",
      flashcards: "bg-[#FF3B3B]/5 border-2 border-[#FF3B3B]/50 text-[#FF3B3B]"
    };
    if (option === 'exams' && selectedOption === 'exams') {
      return cn(baseStyles, activeStyles.exams);
    }
    if (option === 'search') {
      return cn(baseStyles, isSearchActive ? activeStyles.search : defaultStyles);
    }
    if (option === 'learn') {
      return cn(baseStyles, isLearnActive ? activeStyles.learn : defaultStyles);
    }
    return cn(baseStyles, selectedOption === option ? activeStyles[option] : defaultStyles);
  };
  return <div className="flex flex-col h-full relative">
      <div className="absolute inset-0 bottom-[140px] overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-4 bg-transparent">
            {messages.length === 0 ? <div className="h-full flex flex-col items-center justify-center min-h-[400px] text-center px-4">
                <div className="mb-6">
                  <MessageSquare className="h-12 w-12 text-[#878787]" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Learn with Shattara AI
                </h3>
                <p className="text-[#878787] text-sm max-w-md mb-8">
                  Your personal AI tutor ready to help you learn, understand, and excel in your studies
                </p>

                {/* Quick Selection Options with spacing between rows */}
                <div className="grid grid-cols-3 w-full max-w-md gap-y-4 gap-x-2">
                  {/* Top row */}
                  <button onClick={handleSearchToggle} className={getButtonStyles('search')}>
                    <SearchIcon className="h-4 w-4" />
                    <span>Search</span>
                  </button>

                  <button onClick={handleExamsClick} className={getButtonStyles('exams')}>
                    <ExamIcon className="h-4 w-4" />
                    <span>Exams</span>
                  </button>

                  <button onClick={() => handleOptionToggle('notes')} className={getButtonStyles('notes')}>
                    <NotesIcon className="h-4 w-4" />
                    <span>Notes</span>
                  </button>

                  {/* Bottom row */}
                  <button onClick={handleLearnToggle} className={getButtonStyles('learn')}>
                    <LearnIcon className="h-4 w-4" />
                    <span>Learn+</span>
                  </button>

                  <button onClick={() => handleOptionToggle('summary')} className={getButtonStyles('summary')}>
                    <SummaryIcon className="h-4 w-4" />
                    <span>Summary</span>
                  </button>

                  <button onClick={() => handleOptionToggle('flashcards')} className={getButtonStyles('flashcards')}>
                    <FlashcardsIcon className="h-4 w-4" />
                    <span>Flashcards</span>
                  </button>
                </div>
              </div> : <div className="space-y-4">
                {messages.map(msg => <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={cn("max-w-[80%] rounded-lg p-3 text-[#FAFAFA]", msg.sender === "user" ? "bg-[#1D1D1D]" : "bg-transparent")}>
                      {msg.content}
                    </div>
                  </div>)}
              </div>}
          </div>
        </ScrollArea>
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-[#121212] border-t border-[#1D1D1D]">
        <div className="flex flex-col px-6 py-4">
          {/* Message Input Row */}
          <div className="flex items-center gap-3 mb-2">
            <input type="text" value={inputValue} onChange={handleInputChange} onKeyDown={handleKeyPress} placeholder="Ask anything..." className="flex-1 h-12 px-4 py-2 text-[#FAFAFA] bg-transparent border border-[#333333] rounded-lg focus:border-[#404040] focus:ring-0 focus:outline-none hover:border-[#404040] placeholder:text-[#666666]" />
            
            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className={cn("h-12 w-12", "text-[#666666]", "hover:text-[#FAFAFA]", "hover:bg-[#1A1A1A]", "rounded-lg", "transition-colors duration-200")}>
                <Paperclip className="h-5 w-5" />
              </Button>
              
              <Button onClick={handleSendMessage} size="icon" disabled={!inputValue.trim()} className={cn("h-12 w-12", "text-[#FAFAFA]", "bg-[#1A1A1A]", "hover:bg-[#242424]", "rounded-lg", "transition-colors duration-200", "disabled:opacity-50 disabled:cursor-not-allowed")}>
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Toggle Buttons Row */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleLearnToggle} className={cn("h-8 px-3 rounded-full", "flex items-center gap-1.5", "text-sm font-normal", "transition-all duration-200", isLearnActive ? "bg-[#00FF85]/5 border-2 border-[#00FF85]/50 text-[#00FF85]" : "text-[#666666] hover:text-[#FAFAFA] hover:bg-[#1A1A1A] border border-[#F5F5E8]/20")}>
              <GraduationCap className="h-4 w-4" />
              Learn+
            </Button>

            <Button variant="ghost" size="sm" onClick={handleSearchToggle} className={cn("h-8 px-3 rounded-full", "flex items-center gap-1.5", "text-sm font-normal", "transition-all duration-200", isSearchActive ? "bg-[#00A3FF]/5 border-2 border-[#00A3FF]/50 text-[#00A3FF]" : "text-[#666666] hover:text-[#FAFAFA] hover:bg-[#1A1A1A] border border-[#F5F5E8]/20")}>
              <Search className="h-4 w-4" />
              Search
            </Button>
          </div>
        </div>
      </div>
    </div>;
};
export default AIChat;