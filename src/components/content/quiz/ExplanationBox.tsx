import { CheckCircle2, AlertCircle, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ExplanationBoxProps {
  type: 'correct' | 'incorrect' | 'dont-know';
  explanation: string;
  reference?: string;
}

export const ExplanationBox = ({ type, explanation, reference }: ExplanationBoxProps) => {
  const config = {
    correct: {
      icon: CheckCircle2,
      bgColor: 'bg-green-50 dark:bg-green-950/20',
      borderColor: 'border-green-500',
      iconColor: 'text-green-500',
      badgeColor: 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300',
    },
    incorrect: {
      icon: XCircle,
      bgColor: 'bg-red-50 dark:bg-red-950/20',
      borderColor: 'border-red-500',
      iconColor: 'text-red-500',
      badgeColor: 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300',
    },
    'dont-know': {
      icon: AlertCircle,
      bgColor: 'bg-yellow-50 dark:bg-yellow-950/20',
      borderColor: 'border-yellow-500',
      iconColor: 'text-yellow-500',
      badgeColor: 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300',
    },
  };

  const { icon: Icon, bgColor, borderColor, iconColor, badgeColor } = config[type];

  return (
    <div className={`${bgColor} border-2 ${borderColor} rounded-2xl p-4 mt-3`}>
      <div className="flex gap-3">
        <Icon className={`w-5 h-5 ${iconColor} shrink-0 mt-0.5`} />
        <div className="flex-1">
          <p className="text-sm leading-relaxed">{explanation}</p>
          {reference && (
            <Badge className={`${badgeColor} mt-2 border-0`} variant="secondary">
              {reference}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};
