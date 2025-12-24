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
      setScale((prev) => (prev === 1 ? 1.2 : 1));
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <motion.div
        animate={{ scale }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="relative"
      >
        <div className="text-6xl font-bold text-primary">
          <Brain className="w-16 h-16" />
        </div>
        <motion.div
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute -top-2 -right-2 w-4 h-4 bg-primary rounded-full"
        />
      </motion.div>
    </div>
  );
}

// Smart Summaries Animation - Content restructuring
function SummariesAnimation() {
  const layouts = [
    [
      { w: "100%", h: "20%" },
      { w: "100%", h: "35%" },
      { w: "100%", h: "35%" },
    ],
    [
      { w: "48%", h: "45%" },
      { w: "48%", h: "45%" },
      { w: "100%", h: "45%" },
    ],
    [
      { w: "100%", h: "30%" },
      { w: "65%", h: "30%" },
      { w: "30%", h: "30%" },
    ],
  ];

  const [currentLayout, setCurrentLayout] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLayout((prev) => (prev + 1) % layouts.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-4 flex flex-wrap gap-2 content-start">
      {layouts[currentLayout].map((item, i) => (
        <motion.div
          key={i}
          layout
          initial={false}
          animate={{ width: item.w, height: item.h }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="bg-primary/20 rounded-lg border border-primary/30"
        />
      ))}
    </div>
  );
}

// Global Network Animation - Bilingual reach
function GlobalNetworkAnimation() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="relative">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute inset-0 bg-primary/20 rounded-full blur-xl"
          style={{ width: 120, height: 120, margin: -20 }}
        />
        <Globe className="w-20 h-20 text-primary" />
        
        {/* Orbiting dots representing languages */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0"
          style={{ width: 120, height: 120, margin: -20 }}
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-primary rounded-full" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-accent rounded-full" />
        </motion.div>
      </div>
    </div>
  );
}

// Speed Animation - Instant understanding
function SpeedAnimation() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(0);
      const animate = () => {
        setProgress((prev) => {
          if (prev >= 100) return 100;
          return prev + 5;
        });
      };
      const animInterval = setInterval(animate, 30);
      setTimeout(() => clearInterval(animInterval), 700);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-4 flex flex-col items-center justify-center gap-3">
      <Zap className="w-10 h-10 text-primary" />
      <div className="w-full max-w-[120px] h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-primary rounded-full"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>
      <span className="text-xs text-muted-foreground font-mono">
        {progress < 100 ? "Processing..." : "Done!"}
      </span>
    </div>
  );
}

// Security Animation - Private study space
function SecurityAnimation() {
  const [isLocked, setIsLocked] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsLocked((prev) => !prev);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <motion.div
        animate={{ scale: isLocked ? 1 : 1.1 }}
        transition={{ duration: 0.3 }}
        className="relative"
      >
        <Lock className="w-12 h-12 text-primary" />
        <AnimatePresence>
          {isLocked && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center"
            >
              <span className="text-[8px] text-white">✓</span>
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
    <div className="absolute inset-0 flex items-center justify-center gap-4">
      <motion.div
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 2, repeat: Infinity, delay: 0 }}
      >
        <div className="w-8 h-12 bg-card border-2 border-primary/50 rounded-lg flex items-center justify-center">
          <Smartphone className="w-4 h-4 text-primary" />
        </div>
      </motion.div>
      <motion.div
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
      >
        <div className="w-12 h-10 bg-card border-2 border-primary/50 rounded-lg flex items-center justify-center">
          <BookOpen className="w-5 h-5 text-primary" />
        </div>
      </motion.div>
      <motion.div
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
      >
        <div className="w-16 h-10 bg-card border-2 border-primary/50 rounded-lg flex items-center justify-center">
          <span className="text-xs text-primary font-medium">Desktop</span>
        </div>
      </motion.div>
    </div>
  );
}

// Bento Card Component
interface BentoCardProps {
  title: string;
  description: string;
  className?: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

function BentoCard({ title, description, className = "", children, icon }: BentoCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className={`relative overflow-hidden rounded-2xl bg-card border border-border hover:border-primary/50 transition-colors ${className}`}
    >
      <div className="absolute inset-0 opacity-50">
        {children}
      </div>
      <div className="relative z-10 p-6 h-full flex flex-col justify-end">
        <h3 className="font-jakarta text-xl text-foreground font-semibold flex items-center gap-2">
          {icon}
          {title}
        </h3>
        <p className="text-muted-foreground text-sm mt-2">
          {description}
        </p>
      </div>
    </motion.div>
  );
}

export function BentoFeatures() {
  return (
    <section className="py-20 md:py-24 lg:py-32 bg-background relative">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 max-w-6xl mx-auto">
          {/* AI Tutor - Tall card spanning 2 columns and 2 rows */}
          <BentoCard
            title="AI Tutor"
            description="Chat with an AI tutor that understands your material and explains it your way."
            className="md:col-span-1 lg:col-span-2 lg:row-span-2 min-h-[280px] lg:min-h-[400px]"
            icon={<Brain className="w-5 h-5 text-primary" />}
          >
            <AITutorAnimation />
          </BentoCard>

          {/* Smart Summaries - Standard card */}
          <BentoCard
            title="Smart Summaries"
            description="Turn PDFs, videos, and notes into clear, structured summaries instantly."
            className="md:col-span-1 lg:col-span-2 min-h-[180px]"
          >
            <SummariesAnimation />
          </BentoCard>

          {/* Arabic & English - Tall card */}
          <BentoCard
            title="Arabic & English"
            description="Built for Saudi students, fully bilingual and culturally aware."
            className="md:col-span-1 lg:col-span-2 lg:row-span-2 min-h-[280px] lg:min-h-[400px]"
            icon={<Globe className="w-5 h-5 text-primary" />}
          >
            <GlobalNetworkAnimation />
          </BentoCard>

          {/* Instant Understanding - Standard card */}
          <BentoCard
            title="Instant Understanding"
            description="Get explanations, flashcards, and quizzes in seconds."
            className="md:col-span-1 lg:col-span-2 min-h-[180px]"
          >
            <SpeedAnimation />
          </BentoCard>

          {/* Private Study Space - Wide card */}
          <BentoCard
            title="Private Study Space"
            description="Your files, recordings, and progress stay private and secure."
            className="md:col-span-2 lg:col-span-3 min-h-[160px]"
            icon={<Lock className="w-5 h-5 text-primary" />}
          >
            <SecurityAnimation />
          </BentoCard>

          {/* Study Anywhere - Wide card */}
          <BentoCard
            title="Study Anywhere"
            description="Learn on desktop, tablet, or phone — anytime you need."
            className="md:col-span-2 lg:col-span-3 min-h-[160px]"
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
