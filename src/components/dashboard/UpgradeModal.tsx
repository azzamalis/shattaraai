import React, { useState } from 'react';
import { DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
interface UpgradeModalProps {
  onClose: () => void;
}
export function UpgradeModal({
  onClose
}: UpgradeModalProps) {
  const [activePlan, setActivePlan] = useState<'annual' | 'monthly'>('annual');
  const copyPromoCode = () => {
    navigator.clipboard.writeText('FINALS25');
    toast({
      title: "Promo code copied!",
      description: "The promo code FINALS25 has been copied to your clipboard.",
      duration: 3000
    });
  };
  return <DialogContent className="bg-[#111] border border-zinc-800 p-0 max-w-[600px] text-white">
      {/* Close button */}
      <button onClick={onClose} className="absolute right-4 top-4 p-1 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white z-10">
        <span className="sr-only">Close</span>
      </button>
      
      {/* Promotional banner */}
      <div className="p-4 w-full rounded-t-lg bg-dark-DEFAULT">
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-white">20% OFF</span>
          <div className="flex items-center">
            <div className="bg-[#2d2d7a] text-white px-3 py-1 rounded text-sm font-mono">
              FINALS25
            </div>
            <button onClick={copyPromoCode} className="ml-2 text-blue-400 hover:text-blue-300">
              <Copy size={16} />
              <span className="sr-only">Copy promo code</span>
            </button>
          </div>
        </div>
        <p className="text-xs text-zinc-400 mt-2">Use code at checkout. Offer ends soon.</p>
      </div>
      
      {/* Modal content */}
      <div className="p-6 pt-5">
        {/* Title */}
        <h2 className="text-2xl font-bold">Upgrade Your Plan</h2>
        <p className="text-sm text-zinc-400 mt-1">Choose the plan that best fits your needs</p>
        
        {/* Features list */}
        <div className="mt-6 space-y-3">
          {['Unlimited uploads, pastes, and records', 'Unlimited AI chats (100 / month with Learn+ mode)', 'Unlimited quiz generation', 'Unlimited practice exams', 'Unlimited usage for voice mode', 'Upload files, each up to 2000 pages / 300 MB in size'].map((feature, index) => <div key={index} className="flex items-start">
              <div className="flex-shrink-0 text-primary mt-1">
                <Check size={16} />
              </div>
              <span className="ml-2 text-sm text-white">{feature}</span>
            </div>)}
        </div>
        
        {/* Pricing plans */}
        <div className="mt-8 space-y-3">
          {/* Annual plan */}
          <div className={cn("flex items-center justify-between p-4 rounded-lg border cursor-pointer", activePlan === 'annual' ? "border-primary bg-[#161630]" : "border-zinc-800 hover:border-zinc-700")} onClick={() => setActivePlan('annual')}>
            <div className="flex items-center">
              <div className={cn("w-5 h-5 rounded-full border flex items-center justify-center", activePlan === 'annual' ? "border-primary" : "border-zinc-600")}>
                {activePlan === 'annual' && <div className="w-3 h-3 rounded-full bg-primary"></div>}
              </div>
              <div className="ml-3">
                <div className="flex items-center">
                  <span className="font-medium">Annual Plan</span>
                  <span className="ml-2 text-xs bg-primary px-2 py-0.5 rounded text-white">Save 20%</span>
                </div>
                <span className="text-xs text-zinc-400">Billed annually</span>
              </div>
            </div>
            <div className="text-lg font-bold">$12<span className="text-sm font-normal text-zinc-400">/mo</span></div>
          </div>
          
          {/* Monthly plan */}
          <div className={cn("flex items-center justify-between p-4 rounded-lg border cursor-pointer", activePlan === 'monthly' ? "border-primary bg-[#161630]" : "border-zinc-800 hover:border-zinc-700")} onClick={() => setActivePlan('monthly')}>
            <div className="flex items-center">
              <div className={cn("w-5 h-5 rounded-full border flex items-center justify-center", activePlan === 'monthly' ? "border-primary" : "border-zinc-600")}>
                {activePlan === 'monthly' && <div className="w-3 h-3 rounded-full bg-primary"></div>}
              </div>
              <div className="ml-3">
                <span className="font-medium">Monthly Plan</span>
                <div className="text-xs text-zinc-400">Billed monthly</div>
              </div>
            </div>
            <div className="text-lg font-bold">$20<span className="text-sm font-normal text-zinc-400">/mo</span></div>
          </div>
        </div>
        
        {/* CTA button */}
        <Button className="mt-8 w-full h-12 bg-primary hover:bg-primary-light text-white font-medium text-base">
          Select Plan
        </Button>
        
        {/* Footer */}
        <div className="mt-8 flex items-center">
          <div className="flex -space-x-2">
            {['bg-blue-400', 'bg-green-400', 'bg-purple-400', 'bg-yellow-400'].map((color, i) => <div key={i} className={`${color} w-7 h-7 rounded-full border-2 border-[#111] flex items-center justify-center text-xs font-bold text-[#111]`}>
                {String.fromCharCode(65 + i)}
              </div>)}
          </div>
          <div className="ml-3">
            <div className="text-sm font-medium">Join 1M+ learners studying smarter with Shattara.</div>
            <div className="text-xs text-zinc-400 mt-1">
              Need a school plan? <a href="#" className="text-[WHITE] hover:underline">Contact Us</a>
            </div>
          </div>
        </div>
      </div>
    </DialogContent>;
}