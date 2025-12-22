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
      description: "Perfect for trying it out",
      icon: (
        <div className="relative">
          <Zap className="w-7 h-7" />
        </div>
      ),
      features: [
        {
          name: "Limited uploads",
          description: "Upload and process your study materials",
          included: true,
        },
        {
          name: "AI chat access",
          description: "Get help from your AI study assistant",
          included: true,
        },
        {
          name: "Flashcards & quizzes",
          description: "Create and practice with study tools",
          included: true,
        },
      ],
      cta: "Start Free",
    },
    {
      name: "Pro",
      price: {
        monthly: 75,
        yearly: 540,
      },
      description: "Everything you need to excel",
      highlight: true,
      badge: "Most Popular",
      icon: (
        <div className="relative">
          <ArrowDownToDot className="w-7 h-7" />
        </div>
      ),
      features: [
        {
          name: "Unlimited uploads & content",
          description: "No limits on your study materials",
          included: true,
        },
        {
          name: "Advanced AI explanations",
          description: "Deep, detailed answers to your questions",
          included: true,
        },
        {
          name: "Unlimited quizzes & exams",
          description: "Practice as much as you need",
          included: true,
        },
        {
          name: "Priority processing",
          description: "Faster uploads and AI responses",
          included: true,
        },
      ],
      cta: "Upgrade to Pro",
    },
  ];

  // Use theme-aware bg and text colors at the container if needed in future expansions
  return <PricingSection tiers={pricingTiers} />;
};

export default Pricing;
