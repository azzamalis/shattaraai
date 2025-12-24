"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Lock, Smartphone, BookOpen, Brain, Zap } from "lucide-react";
import SmartCTA from "@/components/SmartCTA";

// AI Tutor Animation - Thinking/Adapting responses
function AITutorAnimation() {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setScale((prev) => (prev === 1 ? 1.15 : 1));
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-center h-full">
      <motion.div
        animate={{ scale }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="relative"
      >
        <div className="text-primary/80">
          <Brain className="w-20 h-20 lg:w-24 lg:h-24" strokeWidth={1.5} />
        </div>
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full"
        />
      </motion.div>
    </div>
  );
}

// Smart Summaries Animation - Content restructuring
function SummariesAnimation() {
  const layouts = [
    [
      { w: "100%", h: "28%" },
      { w: "100%", h: "28%" },
      { w: "100%", h: "28%" },
    ],
    [
      { w: "48%", h: "45%" },
      { w: "48%", h: "45%" },
      { w: "100%", h: "45%" },
    ],
  ];

  const [currentLayout, setCurrentLayout] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLayout((prev) => (prev + 1) % layouts.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-wrap gap-2 content-start h-full p-1">
      {layouts[currentLayout].map((item, i) => (
        <motion.div
          key={i}
          layout
          initial={false}
          animate={{ width: item.w, height: item.h }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="bg-primary/20 rounded-md border border-primary/30"
        />
      ))}
    </div>
  );
}

// Global Network Animation - Bilingual reach
function GlobalNetworkAnimation() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="relative">
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute inset-0 bg-primary/20 rounded-full blur-xl"
          style={{ width: 100, height: 100, margin: -10 }}
        />
        <Globe className="w-20 h-20 lg:w-24 lg:h-24 text-primary/80" strokeWidth={1.5} />
        
        {/* Orbiting dots representing languages */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0"
          style={{ width: 100, height: 100, margin: -10 }}
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-primary rounded-full" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-primary/60 rounded-full" />
        </motion.div>
      </div>
    </div>
  );
}

// Speed Animation - Instant understanding
function SpeedAnimation() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const runAnimation = () => {
      setProgress(0);
      let current = 0;
      const animInterval = setInterval(() => {
        current += 8;
        if (current >= 100) {
          setProgress(100);
          clearInterval(animInterval);
        } else {
          setProgress(current);
        }
      }, 40);
    };

    runAnimation();
    const interval = setInterval(runAnimation, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full gap-3">
      <Zap className="w-10 h-10 text-primary/80" strokeWidth={1.5} />
      <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-primary rounded-full"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.08 }}
        />
      </div>
    </div>
  );
}

// Security Animation - Private study space
function SecurityAnimation() {
  const [isLocked, setIsLocked] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsLocked((prev) => !prev);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-center h-full">
      <motion.div
        animate={{ scale: isLocked ? 1 : 1.08 }}
        transition={{ duration: 0.3 }}
        className="relative"
      >
        <Lock className="w-12 h-12 text-primary/80" strokeWidth={1.5} />
        <AnimatePresence>
          {isLocked && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full flex items-center justify-center"
            >
              <span className="text-[8px] text-white font-bold">✓</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

// Mobile Animation - Study anywhere
function MobileAnimation() {
  return (
    <div className="flex items-center justify-center h-full gap-3">
      <motion.div
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 2, repeat: Infinity, delay: 0 }}
      >
        <div className="w-7 h-11 bg-background border-2 border-primary/40 rounded-lg flex items-center justify-center">
          <Smartphone className="w-3.5 h-3.5 text-primary/70" />
        </div>
      </motion.div>
      <motion.div
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 2, repeat: Infinity, delay: 0.25 }}
      >
        <div className="w-10 h-8 bg-background border-2 border-primary/40 rounded-lg flex items-center justify-center">
          <BookOpen className="w-4 h-4 text-primary/70" />
        </div>
      </motion.div>
      <motion.div
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
      >
        <div className="w-14 h-9 bg-background border-2 border-primary/40 rounded-lg flex items-center justify-center">
          <span className="text-[10px] text-primary/70 font-medium">Desktop</span>
        </div>
      </motion.div>
    </div>
  );
}

// Bento Card Component - Clean separation between animation and text
interface BentoCardProps {
  title: string;
  description: string;
  className?: string;
  animationHeight?: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

function BentoCard({ 
  title, 
  description, 
  className = "", 
  animationHeight = "h-32",
  children, 
  icon 
}: BentoCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ duration: 0.2 }}
      className={`relative overflow-hidden rounded-2xl bg-card border border-border hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all ${className}`}
    >
      <div className="h-full flex flex-col">
        {/* Animation Area - Fixed height, centered content */}
        <div className={`${animationHeight} flex-shrink-0 p-4`}>
          {children}
        </div>
        
        {/* Text Content Area - Bottom aligned */}
        <div className="p-5 pt-2 mt-auto">
          <h3 className="font-jakarta text-lg text-foreground font-semibold flex items-center gap-2">
            {icon}
            {title}
          </h3>
          <p className="text-muted-foreground text-sm mt-1.5 leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export function BentoFeatures() {
  return (
    <section id="features" className="py-20 md:py-24 lg:py-32 bg-background relative">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tighter text-foreground">
            How Shattara Helps You Learn Smarter
          </h2>
          <p className="text-muted-foreground mt-5">
            Designed for how you actually study — not how textbooks think you do.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {/* Row 1: AI Tutor, Smart Summaries + Instant Understanding, Arabic & English */}
          
          {/* AI Tutor - Tall card */}
          <BentoCard
            title="AI Tutor"
            description="Chat with an AI tutor that understands your material and explains it your way."
            className="lg:row-span-2"
            animationHeight="h-40 lg:h-64"
            icon={<Brain className="w-5 h-5 text-primary" />}
          >
            <AITutorAnimation />
          </BentoCard>

          {/* Middle column - stacked */}
          <div className="flex flex-col gap-4">
            {/* Smart Summaries */}
            <BentoCard
              title="Smart Summaries"
              description="Turn PDFs, videos, and notes into clear, structured summaries instantly."
              animationHeight="h-24"
            >
              <SummariesAnimation />
            </BentoCard>

            {/* Instant Understanding */}
            <BentoCard
              title="Instant Understanding"
              description="Get explanations, flashcards, and quizzes in seconds."
              animationHeight="h-20"
              icon={<Zap className="w-5 h-5 text-primary" />}
            >
              <SpeedAnimation />
            </BentoCard>
          </div>

          {/* Arabic & English - Tall card */}
          <BentoCard
            title="Arabic & English"
            description="Built for Saudi students, fully bilingual and culturally aware."
            className="lg:row-span-2"
            animationHeight="h-40 lg:h-64"
            icon={<Globe className="w-5 h-5 text-primary" />}
          >
            <GlobalNetworkAnimation />
          </BentoCard>

          {/* Row 2: Private Study Space, Study Anywhere (spans middle) */}
          
          {/* Private Study Space */}
          <BentoCard
            title="Private Study Space"
            description="Your files, recordings, and progress stay private and secure."
            animationHeight="h-20"
            icon={<Lock className="w-5 h-5 text-primary" />}
          >
            <SecurityAnimation />
          </BentoCard>

          {/* Study Anywhere */}
          <BentoCard
            title="Study Anywhere"
            description="Learn on desktop, tablet, or phone — anytime you need."
            animationHeight="h-20"
            icon={<Smartphone className="w-5 h-5 text-primary" />}
          >
            <MobileAnimation />
          </BentoCard>
        </div>

        {/* CTA Button */}
        <div className="mt-16 text-center">
          <SmartCTA type="get-started" size="lg" className="px-8 py-4">
            Try Shattara AI Free
          </SmartCTA>
        </div>
      </div>
    </section>
  );
}

export default BentoFeatures;
