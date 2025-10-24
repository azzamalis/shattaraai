interface QuizProgressBarProps {
  current: number;
  total: number;
}

export const QuizProgressBar = ({ current, total }: QuizProgressBarProps) => {
  const progress = (current / total) * 100;

  return (
    <div className="flex items-center gap-3 p-2">
      <span className="text-muted text-sm font-medium">{current}</span>
      <div className="bg-muted w-full h-2 rounded-full overflow-hidden">
        <div
          className="bg-[#0E8345] flex-grow opacity-80 w-full h-full rounded-full transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
      <span className="text-muted text-sm font-medium">{total}</span>
    </div>
  );
};
