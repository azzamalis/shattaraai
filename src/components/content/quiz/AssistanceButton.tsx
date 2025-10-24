import { CornerDownRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AssistanceButtonProps {
  type: 'hint' | 'walkthrough' | 'simple';
  onClick: () => void;
}

const labels = {
  hint: 'Give me a hint',
  walkthrough: 'Walk me through it',
  simple: 'Keep it simple',
};

export const AssistanceButton = ({ type, onClick }: AssistanceButtonProps) => {
  return (
    <Button
      variant="outline"
      onClick={onClick}
      className="items-center cursor-pointer flex h-full border-2 border-border rounded-2xl p-2 justify-start"
    >
      <CornerDownRight className="w-6 h-6 ml-1 shrink-0" />
      <span className="ml-3 overflow-hidden text-ellipsis">{labels[type]}</span>
    </Button>
  );
};
