import { cn } from "@/lib/utils";
import { FileText, Book, FileSearch, MessageSquareCode, MessageSquare, FileAudio } from "lucide-react";
import React from "react";
export function FeaturesSectionWithHoverEffects() {
  const features = [{
    title: "AI-Generated Notes",
    description: "Turn any content into comprehensive study notes with our advanced AI technology.",
    icon: <FileText className="w-6 h-6" />
  }, {
    title: "Smart Flashcards",
    description: "Create effective flashcards that adapt to your learning progress for better retention.",
    icon: <Book className="w-6 h-6" />
  }, {
    title: "Open Source Quizzes",
    description: "Access a growing library of community-created quizzes or create your own to share.",
    icon: <FileSearch className="w-6 h-6" />
  }, {
    title: "Exam Preps",
    description: "Practice with realistic exam scenarios tailored to your specific curriculum and goals.",
    icon: <MessageSquareCode className="w-6 h-6" />
  }, {
    title: "Shattara AI Chat",
    description: "Get immediate answers and explanations from our specialized learning AI assistant.",
    icon: <MessageSquare className="w-6 h-6" />
  }, {
    title: "Audio & Video Transcripts",
    description: "Convert lectures and educational content into searchable, annotatable text.",
    icon: <FileAudio className="w-6 h-6" />
  }];
  return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 relative z-10 py-10 max-w-7xl mx-auto">
      {features.map((feature, index) => <Feature key={feature.title} {...feature} index={index} />)}
    </div>;
}
const Feature = ({
  title,
  description,
  icon,
  index
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}) => {
  return <div className={cn("flex flex-col lg:border-r py-10 relative group/feature dark:border-zinc-800", (index === 0 || index === 3) && "lg:border-l dark:border-zinc-800", index < 3 && "lg:border-b dark:border-zinc-800")}>
      {index < 3 && <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-dark-deeper/30 to-transparent pointer-events-none" />}
      {index >= 3 && <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-dark-deeper/30 to-transparent pointer-events-none" />}
      <div className="mb-4 relative z-10 px-10 text-white/70">
        {icon}
      </div>
      <div className="text-lg font-bold mb-2 relative z-10 px-10">
        <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-zinc-700 group-hover/feature:bg-primary transition-all duration-200 origin-center" />
        <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-foreground ">
          {title}
        </span>
      </div>
      <p className="text-sm text-muted-foreground max-w-xs relative z-10 px-10">
        {description}
      </p>
    </div>;
};