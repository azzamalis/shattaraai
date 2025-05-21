import React, { useState } from 'react';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { CheckSquare, FileText, Star } from "lucide-react";
const QuizPreferences = () => {
  const [questionFormat, setQuestionFormat] = useState<string>("multiple-choice");
  const [difficulty, setDifficulty] = useState<string>("medium");
  return <div className="w-[70%] max-w-md mx-auto py-8 px-6 flex flex-col items-center space-y-8">
      <h2 className="text-white text-xl font-semibold">Quiz Preferences</h2>
      
      {/* Question Format Options */}
      <div className="w-full rounded-xl p-4 space-y-3 bg-transparent">
        <ToggleGroup type="single" value={questionFormat} onValueChange={value => value && setQuestionFormat(value)} className="flex justify-center gap-2 w-full">
          <ToggleGroupItem 
            value="multiple-choice" 
            className="flex-1 bg-transparent data-[state=on]:bg-[#2A2A2A] border border-white/10 
                      hover:bg-white/5 transition-colors duration-200 p-3 rounded-lg" 
            aria-label="Multiple Choice"
          >
            <div className="flex items-center justify-center gap-2 text-white">
              <CheckSquare className="h-5 w-5" />
              <span>Multiple Choice</span>
            </div>
          </ToggleGroupItem>
          
          <ToggleGroupItem 
            value="free-response" 
            className="flex-1 bg-transparent data-[state=on]:bg-[#2A2A2A] border border-white/10 
                      hover:bg-white/5 transition-colors duration-200 p-3 rounded-lg" 
            aria-label="Free Response"
          >
            <div className="flex items-center justify-center gap-2 text-white">
              <FileText className="h-5 w-5" />
              <span>Free Response</span>
            </div>
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      
      {/* Difficulty Level Options */}
      <div className="w-full rounded-xl p-4 space-y-3 bg-transparent">
        <ToggleGroup type="single" value={difficulty} onValueChange={value => value && setDifficulty(value)} className="flex justify-center gap-2 w-full">
          <ToggleGroupItem 
            value="easy" 
            className="flex-1 bg-transparent data-[state=on]:bg-[#2A2A2A] border border-white/10 
                      hover:bg-white/5 transition-colors duration-200 p-3 rounded-lg" 
            aria-label="Easy"
          >
            <div className="flex items-center justify-center gap-2 text-white">
              <Star className="h-5 w-5" />
              <span>Easy</span>
            </div>
          </ToggleGroupItem>
          
          <ToggleGroupItem 
            value="medium" 
            className="flex-1 bg-transparent data-[state=on]:bg-[#2A2A2A] border border-white/10 
                      hover:bg-white/5 transition-colors duration-200 p-3 rounded-lg" 
            aria-label="Medium"
          >
            <div className="flex items-center justify-center gap-2 text-white">
              <div className="flex gap-1">
                <Star className="h-5 w-5" />
                <Star className="h-5 w-5" />
              </div>
              <span>Medium</span>
            </div>
          </ToggleGroupItem>
          
          <ToggleGroupItem 
            value="hard" 
            className="flex-1 bg-transparent data-[state=on]:bg-[#2A2A2A] border border-white/10 
                      hover:bg-white/5 transition-colors duration-200 p-3 rounded-lg" 
            aria-label="Hard"
          >
            <div className="flex items-center justify-center gap-2 text-white">
              <div className="flex gap-1">
                <Star className="h-5 w-5" />
                <Star className="h-5 w-5" />
                <Star className="h-5 w-5" />
              </div>
              <span>Hard</span>
            </div>
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      
      {/* Generate Button */}
      <button className="bg-white text-black py-3 px-8 font-medium rounded-lg w-full 
                        hover:bg-white/90 transition-colors duration-200">
        Generate
      </button>
    </div>;
};
export default QuizPreferences;