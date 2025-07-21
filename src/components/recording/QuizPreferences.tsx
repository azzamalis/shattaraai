import React, { useState } from 'react';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { CheckSquare, FileText, Star } from "lucide-react";
import { cn } from "@/lib/utils";
const QuizPreferences = () => {
  const [questionFormat, setQuestionFormat] = useState<string>("multiple-choice");
  const [difficulty, setDifficulty] = useState<string>("medium");
  return <div className="w-[70%] max-w-md mx-auto px-6 flex flex-col items-center space-y-4 py-0 border-border ">
      <h2 className="text-foreground text-xl font-semibold">Quiz Preferences</h2>
      
      {/* Question Format Options */}
      <div className="w-full rounded-xl p-3 bg-transparent py-0">
        <ToggleGroup type="single" value={questionFormat} onValueChange={value => value && setQuestionFormat(value)} className="flex justify-center gap-2 w-full">
          <ToggleGroupItem value="multiple-choice" className="flex-1 bg-card data-[state=on]:bg-accent border border-border 
                      hover:bg-accent transition-colors duration-200 p-3 rounded-lg" aria-label="Multiple Choice">
            <div className="flex items-center justify-center gap-2 text-foreground">
              <CheckSquare className="h-5 w-5" />
              <span>Multiple Choice</span>
            </div>
          </ToggleGroupItem>
          
          <ToggleGroupItem value="free-response" className="flex-1 bg-card data-[state=on]:bg-accent border border-border 
                      hover:bg-accent transition-colors duration-200 p-3 rounded-lg" aria-label="Free Response">
            <div className="flex items-center justify-center gap-2 text-foreground">
              <FileText className="h-5 w-5" />
              <span>Free Response</span>
            </div>
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      
      {/* Difficulty Level Options */}
      <div className="w-full rounded-xl p-3 bg-transparent">
        <ToggleGroup type="single" value={difficulty} onValueChange={value => value && setDifficulty(value)} className="flex justify-center gap-2 w-full">
          <ToggleGroupItem value="easy" className={cn("flex-1 bg-card border border-border", "hover:bg-green-500/10 hover:border-green-500/30", "transition-colors duration-200 p-3 rounded-lg", "data-[state=on]:bg-green-500/20", "data-[state=on]:border-green-500/50")} aria-label="Easy">
            <div className="flex items-center justify-center gap-2">
              <Star className={cn("h-5 w-5", "text-muted-foreground", "data-[state=on]:text-green-500", difficulty === "easy" && "text-green-500")} />
              <span className={cn("text-foreground", "data-[state=on]:text-green-500", difficulty === "easy" && "text-green-500")}>Easy</span>
            </div>
          </ToggleGroupItem>
          
          <ToggleGroupItem value="medium" className={cn("flex-1 bg-card border border-border", "hover:bg-yellow-500/10 hover:border-yellow-500/30", "transition-colors duration-200 p-3 rounded-lg", "data-[state=on]:bg-yellow-500/20", "data-[state=on]:border-yellow-500/50")} aria-label="Medium">
            <div className="flex items-center justify-center gap-2">
              <div className="flex gap-1">
                <Star className={cn("h-5 w-5", "text-muted-foreground", "data-[state=on]:text-yellow-500", difficulty === "medium" && "text-yellow-500")} />
                <Star className={cn("h-5 w-5", "text-muted-foreground", "data-[state=on]:text-yellow-500", difficulty === "medium" && "text-yellow-500")} />
              </div>
              <span className={cn("text-foreground", "data-[state=on]:text-yellow-500", difficulty === "medium" && "text-yellow-500")}>Medium</span>
            </div>
          </ToggleGroupItem>
          
          <ToggleGroupItem value="hard" className={cn("flex-1 bg-card border border-border", "hover:bg-red-500/10 hover:border-red-500/30", "transition-colors duration-200 p-3 rounded-lg", "data-[state=on]:bg-red-500/20", "data-[state=on]:border-red-500/50")} aria-label="Hard">
            <div className="flex items-center justify-center gap-2">
              <div className="flex gap-1">
                <Star className={cn("h-5 w-5", "text-muted-foreground", "data-[state=on]:text-red-500", difficulty === "hard" && "text-red-500")} />
                <Star className={cn("h-5 w-5", "text-muted-foreground", "data-[state=on]:text-red-500", difficulty === "hard" && "text-red-500")} />
                <Star className={cn("h-5 w-5", "text-muted-foreground", "data-[state=on]:text-red-500", difficulty === "hard" && "text-red-500")} />
              </div>
              <span className={cn("text-foreground", "data-[state=on]:text-red-500", difficulty === "hard" && "text-red-500")}>Hard</span>
            </div>
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      
      {/* Generate Button */}
      <button className="bg-primary text-primary-foreground px-8 font-medium rounded-lg w-full hover:bg-primary/90 transition-colors duration-200 mt-2 py-[10px]">
        Generate
      </button>
    </div>;
};
export default QuizPreferences;