
import React from "react";
import { Globe } from "lucide-react";
import { motion } from "framer-motion";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface SearchToggleProps {
  deepSearchActive: boolean;
  onToggle: () => void;
}

export const SearchToggle: React.FC<SearchToggleProps> = ({
  deepSearchActive,
  onToggle
}) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <motion.button
          className={`flex items-center px-4 gap-2 py-1.5 rounded-full transition font-medium whitespace-nowrap overflow-hidden justify-start ${
            deepSearchActive
              ? "bg-[#00A3FF]/10 outline outline-1 outline-[#00A3FF]/40 text-[#00A3FF]"
              : "bg-accent text-muted-foreground hover:bg-accent"
          }`}
          title="Search"
          type="button"
          onClick={e => {
            e.stopPropagation();
            onToggle();
          }}
          initial={false}
          animate={{
            width: deepSearchActive ? 85 : 36,
            paddingLeft: deepSearchActive ? 8 : 9
          }}
        >
          <div className="flex items-center justify-center">
            <Globe
              size={16}
              className={deepSearchActive ? "text-[#00A3FF]" : "text-muted-foreground"}
            />
          </div>
          <motion.span
            className="text-xs"
            initial={false}
            animate={{
              opacity: deepSearchActive ? 1 : 0
            }}
          >
            Search
          </motion.span>
        </motion.button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Search the web</p>
      </TooltipContent>
    </Tooltip>
  );
};
