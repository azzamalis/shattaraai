
import { cn } from "@/lib/utils";
import { NotebookPen, Layers, ListCheck, BookCheck, MessageSquareText, FileCode } from "lucide-react";
import React from "react";

export function FeaturesSectionWithHoverEffects() {
  const features = [{
    title: "AI-Generated Summaries",
    description: "Turn lectures, PDFs, and videos into clear, exam-ready notes.",
    icon: <NotebookPen className="w-6 h-6" />
  }, {
    title: "Smart Flashcards",
    description: "Automatically generate flashcards that adapt to what you forget.",
    icon: <Layers className="w-6 h-6" />
  }, {
    title: "Practice Exams & Quizzes",
    description: "Simulate real exams with instant grading and explanations.",
    icon: <ListCheck className="w-6 h-6" />
  }, {
    title: "AI Study Chat",
    description: "Ask questions about your content and get answers that make sense.",
    icon: <MessageSquareText className="w-6 h-6" />
  }, {
    title: "Audio & Video Transcripts",
    description: "Convert lectures into searchable, structured study material.",
    icon: <FileCode className="w-6 h-6" />
  }, {
    title: "Progress & Weakness Tracking",
    description: "See what you understand — and what needs work.",
    icon: <BookCheck className="w-6 h-6" />
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
  return <div className={cn("flex flex-col lg:border-r py-10 relative group/feature border-border", (index === 0 || index === 3) && "lg:border-l border-border", index < 3 && "lg:border-b border-border")}>
      {index < 3 && <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-muted/30 to-transparent pointer-events-none" />}
      {index >= 3 && <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-muted/30 to-transparent pointer-events-none" />}
      <div className="mb-4 relative z-10 px-10 text-muted-foreground">
        {icon}
      </div>
      <div className="text-lg font-bold mb-2 relative z-10 px-10">
        <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-border group-hover/feature:bg-primary transition-all duration-200 origin-center" />
        <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-foreground">
          {title}
        </span>
      </div>
      <p className="text-sm text-muted-foreground max-w-xs relative z-10 px-10">
        {description}
      </p>
    </div>;
};
