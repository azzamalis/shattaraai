import React, { useState } from 'react';
import { DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UpgradeModalProps {
  onClose: () => void;
}

export function UpgradeModal({ onClose }: UpgradeModalProps) {
  const [activePlan, setActivePlan] = useState<'annual' | 'monthly'>('annual');

  return (
    <DialogContent className="bg-card border border-border rounded-3xl p-6 pb-6 sm:pb-4 max-w-md sm:max-w-[500px] text-foreground overflow-hidden">
      {/* Close button */}
      <button 
        onClick={onClose} 
        className="absolute right-2 top-2 p-1 rounded-full hover:bg-accent text-muted-foreground hover:text-foreground z-10"
      >
        <svg 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
        <span className="sr-only">Close</span>
      </button>
      
      <div className="flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center mb-2">
          <header className="flex py-4 flex-initial border-b-0 mb-0 pb-0 px-0 sm:px-6 text-2xl font-medium">
            Keep Going with 7 Days Free
          </header>
        </div>

        {/* Social proof subtitle */}
        <div className="sm:ml-6 mt-1 text-xs text-muted-foreground flex items-center">
          <span className="text-base rounded-lg flex items-center">
            Join over{' '}
            <span className="font-medium text-lg bg-green-500/10 text-green-500 dark:text-[#7DFF97] px-1 rounded-sm mx-1.5 flex whitespace-nowrap">
              1.5 million
            </span>{' '}
            learning smarter
          </span>
        </div>
        
        {/* Features list */}
        <div className="flex flex-1 flex-col gap-3 p-0">
          <div className="mt-4 px-0 sm:px-6">
            <ul className="mb-6 space-y-2.5 text-sm">
              <li className="flex items-start">
                <Check className="w-5 h-5 mr-2 text-green-500 flex-shrink-0" />
                <div className="flex flex-wrap gap-1">
                  <span className="font-semibold">Unlimited</span>
                  <span>uploads,</span>
                  <span>pastes,</span>
                  <span>and</span>
                  <span>records</span>
                </div>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 mr-2 text-green-500 flex-shrink-0" />
                <div className="flex flex-wrap gap-1">
                  <span className="font-semibold">Unlimited</span>
                  <span>AI</span>
                  <span>chats</span>
                  <span className="font-semibold">(100</span>
                  <span>/</span>
                  <span>day</span>
                  <span>with</span>
                  <span>Learn+</span>
                  <span className="font-semibold">mode)</span>
                </div>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 mr-2 text-green-500 flex-shrink-0" />
                <div className="flex flex-wrap gap-1">
                  <span className="font-semibold">Unlimited</span>
                  <span>quiz</span>
                  <span>generation</span>
                </div>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 mr-2 text-green-500 flex-shrink-0" />
                <div className="flex flex-wrap gap-1">
                  <span className="font-semibold">Unlimited</span>
                  <span>practice</span>
                  <span>exams</span>
                </div>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 mr-2 text-green-500 flex-shrink-0" />
                <div className="flex flex-wrap gap-1">
                  <span>12</span>
                  <span className="font-semibold">podcasts</span>
                  <span>/</span>
                  <span>day</span>
                </div>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 mr-2 text-green-500 flex-shrink-0" />
                <div className="flex flex-wrap gap-1">
                  <span>Upload</span>
                  <span>files,</span>
                  <span>each</span>
                  <span>up</span>
                  <span>to</span>
                  <span className="font-semibold">2000</span>
                  <span>pages</span>
                  <span>/</span>
                  <span>300</span>
                  <span>MB</span>
                  <span>in</span>
                  <span>size</span>
                </div>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 mr-2 text-green-500 flex-shrink-0" />
                <div className="flex flex-wrap gap-1">
                  <span>Generate</span>
                  <span>up</span>
                  <span>to</span>
                  <span className="font-semibold">10</span>
                  <span>courses</span>
                  <span>/</span>
                  <span>month</span>
                </div>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 mr-2 text-green-500 flex-shrink-0" />
                <div className="flex flex-wrap gap-1">
                  <span>20</span>
                  <span>placement</span>
                  <span>tests</span>
                  <span>/</span>
                  <span>month</span>
                </div>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 mr-2 text-green-500 flex-shrink-0" />
                <div className="flex flex-wrap gap-1">
                  <span className="font-semibold">Unlimited</span>
                  <span>course</span>
                  <span>cards</span>
                </div>
              </li>
            </ul>

            {/* Pricing plans */}
            <div className="space-y-2.5">
              {/* Annual plan */}
              <button
                onClick={() => setActivePlan('annual')}
                className={cn(
                  "whitespace-nowrap font-medium ring-offset-background transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 h-10 text-sm w-full px-4 py-7 rounded-2xl flex justify-between items-center border-1.5",
                  activePlan === 'annual'
                    ? "border-green-500/60 bg-green-500/10 hover:bg-green-500/20 text-green-500 hover:text-green-500 dark:text-[#7DFF97]"
                    : "border-primary/20 bg-background hover:bg-accent text-foreground/60"
                )}
              >
                <span>
                  Annual{' '}
                  <span className="ml-1 text-green-500 dark:text-[#7DFF97] border-green-500/60 dark:border-green-500/60 border-1.5 px-2 py-1 rounded-full text-xs">
                    Save 40%
                  </span>
                </span>
                <div className="text-right">
                  <div className="space-y-0.5">
                    <div className={cn(
                      "font-medium transition-colors",
                      activePlan === 'annual' ? "text-green-500 dark:text-[#7DFF97]" : "text-foreground/60"
                    )}>
                      Free for 7 days
                    </div>
                    <div className={cn(
                      "text-xs font-medium transition-colors",
                      activePlan === 'annual' ? "text-green-500/80 dark:text-[#7DFF97]/80" : "text-muted-foreground"
                    )}>
                      then SR540 / year
                    </div>
                  </div>
                </div>
              </button>

              {/* Monthly plan */}
              <button
                onClick={() => setActivePlan('monthly')}
                className={cn(
                  "whitespace-nowrap font-medium ring-offset-background transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 h-10 text-sm w-full px-4 py-7 rounded-2xl flex justify-between items-center border-1.5",
                  activePlan === 'monthly'
                    ? "border-green-500/60 bg-green-500/10 hover:bg-green-500/20 text-green-500 hover:text-green-500 dark:text-[#7DFF97]"
                    : "border-primary/20 bg-background hover:bg-accent text-primary/60 hover:text-primary/60 hover:border-primary/20"
                )}
              >
                <span>Monthly</span>
                <div className="text-right">
                  <div className="space-y-0.5">
                    <div className={cn(
                      "font-medium transition-colors",
                      activePlan === 'monthly' ? "text-green-500 dark:text-[#7DFF97]" : "text-primary/60"
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
              <Button className="w-full p-6 rounded-2xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors">
                Start your 7 day free trial
              </Button>
            </div>

            {/* Footer */}
            <div className="mt-4 mb-4 text-center text-xs text-primary/80">
              <span>Need a team plan?</span>{' '}
              <span className="text-primary underline cursor-pointer hover:text-primary/90">
                Click here.
              </span>
            </div>
          </div>
        </div>
      </div>
    </DialogContent>
  );
}
