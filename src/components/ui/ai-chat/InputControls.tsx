
import React from "react";
import { Atom, Mic, Globe, Paperclip, Send } from "lucide-react";
import { motion } from "framer-motion";

interface InputControlsProps {
  handleSubmit: () => void;
}

export const InputControls = ({ handleSubmit }: InputControlsProps) => {
  return (
    <>
      <button
        className="p-2 rounded-full hover:bg-white/5 transition"
        title="Attach file"
        type="button"
        tabIndex={-1}
      >
        <Paperclip size={18} className="text-white/70" />
      </button>
      
      <button
        className="p-2 rounded-full hover:bg-white/5 transition"
        title="Voice input"
        type="button"
        tabIndex={-1}
      >
        <Mic size={18} className="text-white/70" />
      </button>
      
      <button
        className="flex items-center gap-1 bg-primary hover:bg-primary-light text-white p-2 rounded-full font-medium justify-center"
        title="Send"
        type="submit"
        onClick={handleSubmit}
        tabIndex={-1}
      >
        <Send size={16} />
      </button>
    </>
  );
};

interface ExpandedControlsProps {
  aiThinkingActive: boolean;
  setAiThinkingActive: (value: boolean) => void;
  deepSearchActive: boolean;
  setDeepSearchActive: (value: boolean) => void;
}

const ExpandedControls = ({
  aiThinkingActive,
  setAiThinkingActive,
  deepSearchActive,
  setDeepSearchActive
}: ExpandedControlsProps) => {
  return (
    <div className="flex gap-3 items-center">
      {/* Think Toggle */}
      <button
        className={`flex items-center gap-1 px-4 py-1.5 rounded-full transition-all font-medium group ${
          aiThinkingActive
            ? "bg-primary/10 outline outline-primary/60 text-white"
            : "bg-white/5 text-white/70 hover:bg-white/10"
        }`}
        title="AI Thinking"
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setAiThinkingActive(!aiThinkingActive);
        }}
      >
        <Atom
          className={`transition-all ${aiThinkingActive ? "text-primary" : ""}`}
          size={16}
        />
        <span className="text-xs">AI Thinking</span>
      </button>

      {/* Deep Search Toggle */}
      <motion.button
        className={`flex items-center px-4 gap-1 py-1.5 rounded-full transition font-medium whitespace-nowrap overflow-hidden justify-start ${
          deepSearchActive
            ? "bg-primary/10 outline outline-primary/60 text-white"
            : "bg-white/5 text-white/70 hover:bg-white/10"
        }`}
        title="Deep Search"
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setDeepSearchActive(!deepSearchActive);
        }}
        initial={false}
        animate={{
          width: deepSearchActive ? 125 : 36,
          paddingLeft: deepSearchActive ? 8 : 9,
        }}
      >
        <div className="flex-1">
          <Globe size={16} className={deepSearchActive ? "text-primary" : ""} />
        </div>
        <motion.span
          className="pb-[2px] text-xs"
          initial={false}
          animate={{
            opacity: deepSearchActive ? 1 : 0,
          }}
        >
          Deep Search
        </motion.span>
      </motion.button>
    </div>
  );
};

InputControls.ExpandedControls = ExpandedControls;
