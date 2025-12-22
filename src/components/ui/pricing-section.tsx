"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
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
  cta?: string;
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

  // Unified, theme-aware styles
  const buttonStyles = {
    default: cn("h-12 bg-secondary text-foreground", "hover:bg-secondary/80", "border border-border", "shadow-sm hover:shadow-md", "text-sm font-medium"),
    highlight: cn("h-12 bg-primary text-primary-foreground", "hover:bg-primary/90", "shadow-[0_1px_15px_rgba(0,163,255,0.12)]", "hover:shadow-[0_1px_20px_rgba(0,163,255,0.18)]", "font-semibold text-base")
  };
  const badgeStyles = cn("px-4 py-1.5 text-sm font-medium", "bg-primary text-primary-foreground", "border-none shadow-lg");
  return <section className={cn("relative bg-background text-foreground", "py-20 px-4 md:py-28", "overflow-hidden", className)}>
      <div className="w-full max-w-5xl mx-auto">
        <div className="flex flex-col items-center gap-4 mb-12">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tighter mt-5 text-foreground whitespace-nowrap">
            Simple, Transparent Pricing
          </h2>
          <div className="inline-flex items-center p-1.5 bg-card rounded-full border border-border shadow-sm">
            {[
              { label: "Monthly", value: false },
              { label: "Yearly", value: true, badge: "Save 40%" }
            ].map(period => (
              <button 
                key={period.label} 
                onClick={() => setIsYearly(period.value)} 
                className={cn(
                  "px-8 py-2.5 text-sm font-medium rounded-full transition-all duration-300 flex items-center gap-2",
                  period.value === isYearly ? "bg-primary text-primary-foreground shadow-lg" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {period.label}
                {period.badge && (
                  <span className={cn(
                    "text-xs px-2 py-0.5 rounded-full",
                    period.value === isYearly ? "bg-primary-foreground/20 text-primary-foreground" : "bg-primary/10 text-primary"
                  )}>
                    {period.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {tiers.map(tier => <div key={tier.name} className={cn("relative group backdrop-blur-sm", "rounded-3xl transition-all duration-300", "flex flex-col", "bg-card", "border border-border", tier.highlight ? "shadow-xl" : "shadow-md", "hover:translate-y-0 hover:shadow-lg")}>
              {tier.badge && tier.highlight && <div className="absolute -top-4 left-6">
                  <Badge className={badgeStyles}>{tier.badge}</Badge>
                </div>}

              <div className="p-8 flex-1">
                <div className="flex items-center justify-between mb-4">
                  <div className={cn("p-3 rounded-xl", tier.highlight ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground")}>
                    {tier.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-foreground ">
                    {tier.name}
                  </h3>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-foreground">
                      SAR {isYearly ? tier.price.yearly : tier.price.monthly}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      /{isYearly ? "year" : "month"}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {tier.description}
                  </p>
                </div>

                <div className="space-y-4">
                  {tier.features.map(feature => <div key={feature.name} className="flex gap-4">
                      <div className={cn("mt-1 p-0.5 rounded-full transition-colors duration-200", feature.included ? "text-primary" : "text-muted-foreground")}>
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
                      {tier.cta || (tier.price.monthly === 0 ? "Start Free" : "Upgrade to Pro")}
                    </span>
                  </Button>
                </Link>
              </div>
            </div>)}
        </div>

        {/* Micro-trust */}
        <div className="flex justify-center mt-8">
          <p className="text-sm text-muted-foreground">
            Cancel anytime • No hidden fees
          </p>
        </div>
      </div>
    </section>;
}
export { PricingSection };