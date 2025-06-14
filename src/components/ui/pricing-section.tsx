"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, ArrowDownToDot, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
interface Feature {
  name: string;
  description: string;
  included: boolean;
}
interface PricingTier {
  name: string;
  price: {
    monthly: number;
    yearly: number;
  };
  description: string;
  features: Feature[];
  highlight?: boolean;
  badge?: string;
  icon: React.ReactNode;
}
interface PricingSectionProps {
  tiers: PricingTier[];
  className?: string;
}
function PricingSection({
  tiers,
  className
}: PricingSectionProps) {
  const [isYearly, setIsYearly] = useState(false);
  const buttonStyles = {
    default: cn("h-12 bg-dark text-white", "hover:bg-dark-deeper", "border border-zinc-700", "hover:border-zinc-600", "shadow-sm hover:shadow-md", "text-sm font-medium"),
    highlight: cn("h-12 bg-primary", "hover:bg-primary-light", "text-white", "shadow-[0_1px_15px_rgba(35,35,255,0.3)]", "hover:shadow-[0_1px_20px_rgba(35,35,255,0.4)]", "font-semibold text-base")
  };
  const badgeStyles = cn("px-4 py-1.5 text-sm font-medium", "bg-primary", "text-white", "border-none shadow-lg");
  return <section className={cn("relative bg-dark-deeper text-white", "py-20 px-4 md:py-28", "overflow-hidden", className)}>
      <div className="w-full max-w-5xl mx-auto">
        <div className="flex flex-col items-center gap-4 mb-12">
          <h2 className="text-foreground 3xl font-bold">
            Simple, transparent pricing
          </h2>
          <div className="inline-flex items-center p-1.5 bg-dark-deeper rounded-full border border-zinc-700 shadow-sm">
            {["Monthly", "Yearly"].map(period => <button key={period} onClick={() => setIsYearly(period === "Yearly")} className={cn("px-8 py-2.5 text-sm font-medium rounded-full transition-all duration-300", period === "Yearly" === isYearly ? "bg-primary text-white shadow-lg" : "text-zinc-400 hover:text-zinc-100")}>
                {period}
              </button>)}
          </div>
          {isYearly && <div className="mt-2 inline-flex items-center px-4 py-1.5 bg-primary/20 rounded-full">
              <span className="text-sm font-medium text-white">Save 40% with annual billing</span>
            </div>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {tiers.map(tier => <div key={tier.name} className={cn("relative group backdrop-blur-sm", "rounded-3xl transition-all duration-300", "flex flex-col", tier.highlight ? "bg-gradient-to-b from-dark-deeper to-dark/90" : "bg-dark-deeper", "border", tier.highlight ? "border-zinc-700 shadow-xl" : "border-zinc-800 shadow-md", "hover:translate-y-0 hover:shadow-lg")}>
              {tier.badge && tier.highlight && <div className="absolute -top-4 left-6">
                  <Badge className={badgeStyles}>{tier.badge}</Badge>
                </div>}

              <div className="p-8 flex-1">
                <div className="flex items-center justify-between mb-4">
                  <div className={cn("p-3 rounded-xl", tier.highlight ? "bg-primary/10 text-primary" : "bg-zinc-800 text-zinc-400")}>
                    {tier.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-foreground ">
                    {tier.name}
                  </h3>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-foreground ">
                      ${isYearly ? tier.price.yearly : tier.price.monthly}
                    </span>
                    <span className="text-sm text-zinc-400">
                      /{isYearly ? "year" : "month"}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-zinc-400">
                    {tier.description}
                  </p>
                </div>

                <div className="space-y-4">
                  {tier.features.map(feature => <div key={feature.name} className="flex gap-4">
                      <div className={cn("mt-1 p-0.5 rounded-full transition-colors duration-200", feature.included ? "text-primary" : "text-zinc-600")}>
                        <Check className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-foreground/70">
                          {feature.name}
                        </div>
                        <div className="text-sm text-muted-foreground ">
                          {feature.description}
                        </div>
                      </div>
                    </div>)}
                </div>
              </div>

              <div className="p-8 pt-0 mt-auto">
                <Link to="/signup">
                  <Button className={cn("w-full relative transition-all duration-300", tier.highlight ? buttonStyles.highlight : buttonStyles.default)}>
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {tier.price.monthly === 0 ? "Get Started" : "Upgrade Now"}
                    </span>
                  </Button>
                </Link>
              </div>
            </div>)}
        </div>
      </div>
    </section>;
}
export { PricingSection };