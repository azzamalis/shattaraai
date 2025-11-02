import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UpgradeModal({ open, onOpenChange }: UpgradeModalProps) {
  const [activePlan, setActivePlan] = useState<'annual' | 'monthly'>('annual');

  const features = [
    { 
      words: ['Unlimited', 'uploads,', 'pastes,', 'and', 'records'], 
      boldIndices: [0] 
    },
    { 
      words: ['Unlimited', 'AI', 'chats', '(100', '/', 'day', 'with', 'Learn+', 'mode)'], 
      boldIndices: [0, 3, 7] 
    },
    { 
      words: ['Unlimited', 'quiz', 'generation'], 
      boldIndices: [0] 
    },
    { 
      words: ['Unlimited', 'practice', 'exams'], 
      boldIndices: [0] 
    },
    { 
      words: ['12', 'podcasts', '/', 'day'], 
      boldIndices: [0, 1] 
    },
    { 
      words: ['Upload', 'files,', 'each', 'up', 'to', '2000', 'pages', '/', '300', 'MB', 'in', 'size'], 
      boldIndices: [5] 
    },
    { 
      words: ['Generate', 'up', 'to', '10', 'courses', '/', 'month'], 
      boldIndices: [3] 
    },
    { 
      words: ['20', 'placement', 'tests', '/', 'month'], 
      boldIndices: [] 
    },
    { 
      words: ['Unlimited', 'course', 'cards'], 
      boldIndices: [0] 
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-background dark:bg-neutral-950 border-border p-6 pb-6 sm:pb-4 max-w-[500px] sm:max-w-[500px] rounded-3xl overflow-hidden">
        <div className="flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <header className="flex py-4 flex-initial border-b-0 mb-0 pb-0 px-0 sm:px-6 text-2xl font-medium">
              Keep Going with 7 Days Free
            </header>
          </div>
          
          <div className="sm:ml-6 mt-1 dark:text-neutral-400 text-xs text-neutral-600 flex items-center">
            <span className="text-base rounded-lg flex items-center">
              Join over{' '}
              <span className="font-medium text-lg bg-green-500/10 text-green-500 dark:text-[#7DFF97] px-1 rounded-sm mx-1.5 flex whitespace-nowrap">
                1.5 million
              </span>{' '}
              learning smarter
            </span>
          </div>

          <div className="mt-2 p-0 sm:px-6">
            {/* Features list */}
            <ul className="mb-6 space-y-2.5 text-sm">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <Check className="w-5 h-5 mr-2 text-green-500 flex-shrink-0" />
                  <div className="flex flex-wrap gap-1">
                    {feature.words.map((word, wordIndex) => (
                      <span 
                        key={wordIndex} 
                        className={feature.boldIndices.includes(wordIndex) ? 'font-semibold' : ''}
                      >
                        {word}
                      </span>
                    ))}
                  </div>
                </li>
              ))}
            </ul>

            {/* Pricing plans */}
            <div className="space-y-2.5">
              {/* Annual plan */}
              <button
                className={cn(
                  "whitespace-nowrap font-medium ring-offset-background transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 h-auto text-sm w-full px-4 py-7 rounded-2xl flex justify-between items-center",
                  activePlan === 'annual'
                    ? "border-[1.5px] border-green-500/60 bg-green-500/10 hover:bg-green-500/20 text-green-500 hover:text-green-500 dark:text-[#7DFF97]"
                    : "border-[1.5px] border-border bg-background hover:bg-accent text-muted-foreground"
                )}
                onClick={() => setActivePlan('annual')}
              >
                <span className="flex items-center gap-2">
                  Annual
                  <span className="text-green-500 dark:text-[#7DFF97] border-green-500/60 dark:border-green-500/60 border-[1.5px] px-2 py-1 rounded-full text-xs">
                    Save 40%
                  </span>
                </span>
                <div className="text-right">
                  <div className="space-y-0.5">
                    <div className={cn(
                      "font-medium transition-colors",
                      activePlan === 'annual' 
                        ? "text-green-500 dark:text-[#7DFF97]"
                        : "text-muted-foreground"
                    )}>
                      Free for 7 days
                    </div>
                    <div className={cn(
                      "text-xs font-medium transition-colors",
                      activePlan === 'annual'
                        ? "text-green-500/80 dark:text-[#7DFF97]/80"
                        : "text-muted-foreground/70"
                    )}>
                      then SR540 / year
                    </div>
                  </div>
                </div>
              </button>
              
              {/* Monthly plan */}
              <button
                className={cn(
                  "whitespace-nowrap font-medium ring-offset-background transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 h-auto text-sm w-full px-4 py-7 rounded-2xl flex justify-between items-center",
                  activePlan === 'monthly'
                    ? "border-[1.5px] border-green-500/60 bg-green-500/10 hover:bg-green-500/20 text-green-500 dark:text-[#7DFF97]"
                    : "border-[1.5px] border-border bg-background hover:bg-accent text-muted-foreground"
                )}
                onClick={() => setActivePlan('monthly')}
              >
                <span>Monthly</span>
                <div className="text-right">
                  <div className="space-y-0.5">
                    <div className={cn(
                      "font-medium transition-colors",
                      activePlan === 'monthly'
                        ? "text-green-500 dark:text-[#7DFF97]"
                        : "text-primary/60"
                    )}>
                      Free for 7 days
                    </div>
                    <div className="text-xs font-medium transition-colors text-muted-foreground">
                      then SR75 / month
                    </div>
                  </div>
                </div>
              </button>

              {/* CTA button */}
              <button className="inline-flex items-center justify-center whitespace-nowrap ring-offset-background focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 h-auto text-sm w-full p-6 rounded-2xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors">
                Start your 7 day free trial
              </button>
            </div>

            {/* Footer */}
            <div className="mt-4 mb-4 text-center text-xs text-primary/80">
              <span>Need a team plan?</span>{' '}
              <button 
                onClick={() => {/* Handle team plan navigation */}}
                className="text-primary underline cursor-pointer hover:text-primary/90"
              >
                Click here.
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
