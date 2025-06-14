import React from 'react';
import { PricingSection } from '@/components/ui/pricing-section';
import { Zap, ArrowDownToDot } from 'lucide-react';

const Pricing = () => {
  const pricingTiers = [
    {
      name: "Free",
      price: {
        monthly: 0,
        yearly: 0,
      },
      description: "Perfect for students just getting started",
      icon: (
        <div className="relative">
          <Zap className="w-7 h-7" />
        </div>
      ),
      features: [
        {
          name: "Up to 3 courses",
          description: "Create and study with up to 3 active courses",
          included: true,
        },
        {
          name: "Basic Flashcards",
          description: "Create up to 100 flashcards per course",
          included: true,
        },
        {
          name: "Limited Quiz Generator",
          description: "Generate up to 5 quizzes per month",
          included: true,
        },
        {
          name: "Standard Support",
          description: "Email support with 48hr response time",
          included: true,
        },
      ],
    },
    {
      name: "Pro",
      price: {
        monthly: 20,
        yearly: 144, // $12/month when paid yearly
      },
      description: "Unlimited access to all features",
      highlight: true,
      badge: "Most Popular",
      icon: (
        <div className="relative">
          <ArrowDownToDot className="w-7 h-7" />
        </div>
      ),
      features: [
        {
          name: "Unlimited Courses",
          description: "Create and manage an unlimited number of courses",
          included: true,
        },
        {
          name: "Advanced Flashcards",
          description: "Unlimited flashcards with spaced repetition",
          included: true,
        },
        {
          name: "AI Quiz & Exam Simulator",
          description: "Generate unlimited quizzes and practice exams",
          included: true,
        },
        {
          name: "Priority Support",
          description: "24/7 priority email and chat support",
          included: true,
        },
        {
          name: "Advanced Analytics",
          description: "Track your progress and identify weak areas",
          included: true,
        },
      ],
    },
  ];

  // Use theme-aware bg and text colors at the container if needed in future expansions
  return <PricingSection tiers={pricingTiers} />;
};

export default Pricing;
