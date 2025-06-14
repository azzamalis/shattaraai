
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
    default: cn(
      "h-12 bg-secondary text-foreground",
      "hover:bg-secondary/80",
      "border border-border",
      "shadow-sm hover:shadow-md",
      "text-sm font-medium"
    ),
    highlight: cn(
      "h-12 bg-primary text-primary-foreground",
      "hover:bg-primary/90",
      "shadow-[0_1px_15px_rgba(0,163,255,0.12)]",
      "hover:shadow-[0_1px_20px_rgba(0,163,255,0.18)]",
      "font-semibold text-base"
    )
  };
  const badgeStyles = cn(
    "px-4 py-1.5 text-sm font-medium",
    "bg-primary text-primary-foreground",
    "border-none shadow-lg"
  );
  return (
    <section
      className={cn(
        "relative bg-background text-foreground",
        "py-20 px-4 md:py-28",
        "overflow-hidden",
        className
      )}
    >
      <div className="w-full max-w-5xl mx-auto">
        <div className="flex flex-col items-center gap-4 mb-12">
          <h2 className="text-foreground text-3xl md:text-4xl font-bold">
            Simple, transparent pricing
          </h2>
          <div className="inline-flex items-center p-1.5 bg-card rounded-full border border-border shadow-sm">
            {["Monthly", "Yearly"].map(period => (
              <button
                key={period}
                onClick={() => setIsYearly(period === "Yearly")}
                className={cn(
                  "px-8 py-2.5 text-sm font-medium rounded-full transition-all duration-300",
                  period === "Yearly" === isYearly
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {period}
              </button>
            ))}
          </div>
          {isYearly && (
            <div className="mt-2 inline-flex items-center px-4 py-1.5 bg-primary/10 rounded-full">
              <span className="text-sm font-medium text-primary">
                Save 40% with annual billing
              </span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {tiers.map(tier => (
            <div
              key={tier.name}
              className={cn(
                "relative group backdrop-blur-sm",
                "rounded-3xl transition-all duration-300",
                "flex flex-col",
                "bg-card",
                "border border-border",
                tier.highlight
                  ? "shadow-xl"
                  : "shadow-md",
                "hover:translate-y-0 hover:shadow-lg"
              )}
            >
              {tier.badge && tier.highlight && (
                <div className="absolute -top-4 left-6">
                  <Badge className={badgeStyles}>{tier.badge}</Badge>
                </div>
              )}

              <div className="p-8 flex-1">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={cn(
                      "p-3 rounded-xl",
                      tier.highlight
                        ? "bg-primary/10 text-primary"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
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
                    <span className="text-sm text-muted-foreground">
                      /{isYearly ? "year" : "month"}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground ">
                    {tier.description}
                  </p>
                </div>

                <div className="space-y-4">
                  {tier.features.map(feature => (
                    <div key={feature.name} className="flex gap-4">
                      <div
                        className={cn(
                          "mt-1 p-0.5 rounded-full transition-colors duration-200",
                          feature.included
                            ? "text-primary"
                            : "text-muted-foreground"
                        )}
                      >
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
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-8 pt-0 mt-auto">
                <Link to="/signup">
                  <Button
                    className={cn(
                      "w-full relative transition-all duration-300",
                      tier.highlight
                        ? buttonStyles.highlight
                        : buttonStyles.default
                    )}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {tier.price.monthly === 0
                        ? "Get Started"
                        : "Upgrade Now"}
                    </span>
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
export { PricingSection };
