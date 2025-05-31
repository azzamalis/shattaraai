import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function NewFeaturePromo() {
  return (
    <div className="mb-4 sm:mb-6 md:mb-8 flex justify-center">
      <Link to="/reports">
        <Button className="
          bg-[#00A3FF]/10 hover:bg-[#00A3FF]/15 text-[#00A3FF] 
          px-3.5 py-1.5 rounded-full flex items-center gap-2 
          border border-[#00A3FF]/30 hover:border-[#00A3FF]/50
          transition-all duration-200 text-sm h-9
          shadow-md hover:shadow-[0_4px_12px_-2px_rgba(0,163,255,0.35)]
        ">
          <div className="flex items-center gap-2">
            <Badge className="
              bg-[#00A3FF]/15 text-[#00A3FF] font-semibold 
              text-[11px] px-2 py-0.5 pointer-events-none
              rounded-full border border-[#00A3FF]/25
              tracking-wide uppercase
            ">
              new
            </Badge>
            <span className="text-sm font-semibold tracking-wide">Reports</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </div>
        </Button>
      </Link>
    </div>
  );
}
