
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Brain, Send } from 'lucide-react';
import AnimatedTextCycle from './ui/animated-text-cycle';

const AnimatedChatPreview = () => {
  const [showTyping, setShowTyping] = useState(false);

  const tasks = [
    "Help me prepare for my exam",
    "Explain this concept to me", 
    "Create flashcards from my notes",
    "Generate a study plan",
    "Summarize this content",
    "Quiz me on this topic",
    "Translate this text",
    "Help with my research"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setShowTyping(true);
      setTimeout(() => setShowTyping(false), 1000);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative max-w-md mx-auto">
      {/* Chat Container */}
      <div className="bg-zinc-900/50 backdrop-blur-sm rounded-2xl p-6 border border-zinc-800/50 shadow-2xl">
        {/* Chat Header */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-zinc-800/50">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-500 rounded-full flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-zinc-900"></div>
          </div>
          <div>
            <h3 className="text-white font-semibold">Shattara AI</h3>
            <p className="text-zinc-400 text-sm">Online</p>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="space-y-4">
          {/* AI Welcome Message */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <div className="bg-zinc-800/50 rounded-2xl rounded-tl-md px-4 py-3">
                <p className="text-white text-sm">
                  Hi! I'm Shattara AI, your intelligent learning companion. How can I help you today?
                </p>
              </div>
              <p className="text-zinc-500 text-xs mt-1">Just now</p>
            </div>
          </div>

          {/* User Input Simulation */}
          <div className="flex items-end gap-3 justify-end">
            <div className="flex-1 text-right">
              <div className="bg-primary rounded-2xl rounded-tr-md px-4 py-3 inline-block max-w-xs">
                <p className="text-white text-sm">
                  Ask Shattara AI:{' '}
                  <AnimatedTextCycle 
                    words={tasks}
                    interval={4000}
                    className="font-medium"
                  />
                </p>
              </div>
              <p className="text-zinc-500 text-xs mt-1">Now</p>
            </div>
            <div className="w-8 h-8 bg-zinc-700 rounded-full flex items-center justify-center flex-shrink-0">
              <MessageCircle className="w-4 h-4 text-zinc-300" />
            </div>
          </div>

          {/* Typing Indicator */}
          <AnimatePresence>
            {showTyping && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-start gap-3"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Brain className="w-4 h-4 text-white" />
                </div>
                <div className="bg-zinc-800/50 rounded-2xl rounded-tl-md px-4 py-3">
                  <div className="flex gap-1">
                    <motion.div 
                      className="w-2 h-2 bg-zinc-400 rounded-full"
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
                    />
                    <motion.div 
                      className="w-2 h-2 bg-zinc-400 rounded-full"
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                    />
                    <motion.div 
                      className="w-2 h-2 bg-zinc-400 rounded-full"
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Chat Input */}
        <div className="mt-6 pt-4 border-t border-zinc-800/50">
          <div className="flex items-center gap-2 bg-zinc-800/30 rounded-xl px-3 py-2">
            <input 
              type="text" 
              placeholder="Type your message..."
              className="flex-1 bg-transparent text-white placeholder-zinc-400 text-sm focus:outline-none"
              disabled
            />
            <button className="p-2 text-zinc-400 hover:text-primary transition-colors">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Subtle Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-blue-500/10 rounded-2xl blur-xl -z-10 scale-105"></div>
    </div>
  );
};

export default AnimatedChatPreview;
