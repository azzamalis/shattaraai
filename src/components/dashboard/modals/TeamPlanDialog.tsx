import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Info, Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface TeamPlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const TeamPlanDialog: React.FC<TeamPlanDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const [seats, setSeats] = useState<number>(3);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  // Price calculation functions
  const calculateMonthlyPrice = (seats: number): number => {
    if (seats >= 1 && seats <= 9) return seats * 56.21;
    if (seats >= 10 && seats <= 49) return seats * 44.97;
    return seats * 33.72; // 50+
  };

  const calculateYearlyPrice = (seats: number): number => {
    if (seats >= 1 && seats <= 9) return seats * 34;
    if (seats >= 10 && seats <= 49) return seats * 26;
    return seats * 19; // 50+
  };

  const getPricePerUser = (seats: number, cycle: "monthly" | "yearly"): number => {
    if (cycle === "monthly") {
      if (seats >= 1 && seats <= 9) return 56.21;
      if (seats >= 10 && seats <= 49) return 44.97;
      return 33.72;
    } else {
      if (seats >= 1 && seats <= 9) return 34;
      if (seats >= 10 && seats <= 49) return 26;
      return 19;
    }
  };

  const getTotalPrice = (): number => {
    return billingCycle === "monthly"
      ? calculateMonthlyPrice(seats)
      : calculateYearlyPrice(seats);
  };

  const getOriginalPrice = (): number => {
    return seats * 56.21;
  };

  // Calculate tiered breakdown for summary display
  const calculateTieredBreakdown = (totalSeats: number, cycle: "monthly" | "yearly") => {
    const tiers: Array<{
      range: string;
      pricePerSeat: number;
      seats: number;
      subtotal: number;
      multiplier: number;
    }> = [];
    let remainingSeats = totalSeats;
    
    // Tier 1: Seats 1-9
    if (remainingSeats > 0) {
      const seatsInTier = Math.min(remainingSeats, 9);
      const pricePerSeat = cycle === "monthly" ? 56.21 : 34;
      const multiplier = cycle === "yearly" ? 12 : 1;
      tiers.push({
        range: totalSeats <= 9 ? `Seats 1-${totalSeats}` : "Seats 1-9",
        pricePerSeat,
        seats: seatsInTier,
        subtotal: pricePerSeat * seatsInTier * multiplier,
        multiplier
      });
      remainingSeats -= seatsInTier;
    }
    
    // Tier 2: Seats 10-49
    if (remainingSeats > 0) {
      const seatsInTier = Math.min(remainingSeats, 40);
      const pricePerSeat = cycle === "monthly" ? 44.97 : 26;
      const multiplier = cycle === "yearly" ? 12 : 1;
      const endRange = Math.min(49, totalSeats);
      tiers.push({
        range: `Seats 10-${endRange}`,
        pricePerSeat,
        seats: seatsInTier,
        subtotal: pricePerSeat * seatsInTier * multiplier,
        multiplier
      });
      remainingSeats -= seatsInTier;
    }
    
    // Tier 3: Seats 50+
    if (remainingSeats > 0) {
      const pricePerSeat = cycle === "monthly" ? 33.72 : 19;
      const multiplier = cycle === "yearly" ? 12 : 1;
      tiers.push({
        range: totalSeats === 50 ? "Seats 50" : `Seats 50-${totalSeats}`,
        pricePerSeat,
        seats: remainingSeats,
        subtotal: pricePerSeat * remainingSeats * multiplier,
        multiplier
      });
    }
    
    return tiers;
  };

  const handleSeatsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 3;
    setSeats(Math.max(3, value));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] sm:max-w-5xl w-full p-0 gap-0 bg-background border rounded-xl shadow-small overflow-hidden">
        {/* Custom Close Button */}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-default-100 active:bg-default-200 text-muted-foreground hover:text-foreground transition-colors z-10"
          aria-label="Close"
        >
          <svg
            width="1em"
            height="1em"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        {/* Header Section */}
        <DialogHeader className="px-4 pt-4 pb-4">
          <div className="space-y-3">
            <DialogTitle className="text-lg sm:text-xl font-medium">
              Select your team plan
            </DialogTitle>
            <DialogDescription className="flex items-start text-xs sm:text-sm text-muted-foreground font-normal leading-relaxed">
              <span>
                Save 55–75% with yearly billing: SR34/user (Seats 3–9), SR26/user (10–49), SR19/user (50+).
                Monthly plans start at SR56.21/user. Tap the info icon for the full discount breakdown.{" "}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="inline w-4 h-4 text-muted-foreground hover:text-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="max-w-xs p-3">
                      <div className="space-y-3 text-xs">
                        <div>
                          <div className="font-semibold mb-2">Yearly (best value – compared to Pro Monthly):</div>
                          <ul className="space-y-1 ml-2">
                            <li>• 1-9 seats: SR34/user/mo (55% off)</li>
                            <li>• 10-49 seats: SR26/user/mo (65% off)</li>
                            <li>• 50+ seats: SR19/user/mo (75% off)</li>
                          </ul>
                        </div>
                        <div>
                          <div className="font-semibold mb-2">Monthly (compared to Pro Monthly):</div>
                          <ul className="space-y-1 ml-2">
                            <li>• 1-9 seats: SR56.21/user/mo (25% off)</li>
                            <li>• 10-49 seats: SR44.97/user/mo (40% off)</li>
                            <li>• 50+ seats: SR33.72/user/mo (55% off)</li>
                          </ul>
                        </div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </span>
            </DialogDescription>
          </div>
        </DialogHeader>

        {/* Body Section - Two Column Layout */}
        <div className="flex flex-col lg:flex-row gap-8 px-4 pb-4 py-2">
          {/* LEFT COLUMN */}
          <div className="flex-1">
            {/* Users Input Section */}
            <Field className="mb-4">
              <FieldLabel className="text-sm sm:text-base font-medium mb-2 text-foreground">
                Users{" "}
                <span className="text-xs sm:text-sm text-muted-foreground font-normal">
                  (Minimum 3 seats required)
                </span>
              </FieldLabel>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={seats}
                  onChange={handleSeatsChange}
                  placeholder="3"
                  min={3}
                  className="w-full h-10 sm:h-12 px-3 sm:px-4 dark:bg-neutral-800/50 dark:border-neutral-800 text-left border border-input rounded-lg text-base sm:text-lg font-normal [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <Button
                  disabled={seats <= 3}
                  onClick={() => setSeats(Math.max(3, seats - 1))}
                  variant="outline"
                  className="w-12 sm:w-16 h-10 sm:h-12 dark:bg-neutral-800/50 dark:border-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Minus className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
                </Button>
                <Button
                  onClick={() => setSeats(seats + 1)}
                  variant="outline"
                  className="w-12 sm:w-16 h-10 sm:h-12 dark:bg-neutral-800/50 dark:border-neutral-800"
                >
                  <Plus className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
                </Button>
              </div>
            </Field>

            {/* Billing Cycle Selection Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Monthly Card */}
              <div
                onClick={() => setBillingCycle("monthly")}
                className={cn(
                  "p-4 sm:p-6 border-2 rounded-2xl cursor-pointer transition-all min-h-[200px] sm:min-h-[280px] flex flex-col",
                  billingCycle === "monthly"
                    ? "border-primary dark:bg-neutral-800/50 shadow-md border-2"
                    : "border-border dark:bg-neutral-800/50"
                )}
              >
                {/* Card Header */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base sm:text-lg font-medium">Monthly</h3>
                  <div
                    className={cn(
                      "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                      billingCycle === "monthly"
                        ? "border-primary bg-primary"
                        : "border-muted-foreground"
                    )}
                  >
                    {billingCycle === "monthly" && (
                      <svg
                        className="w-3 h-3 text-primary-foreground"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                </div>

                {/* Price Display */}
                <div className="mb-4">
                  <div className="flex items-baseline gap-1">
                    <span className="text-base sm:text-lg font-medium">
                      SR{getPricePerUser(seats, "monthly")}
                    </span>
                  </div>
                  <div className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
                    per user/month
                  </div>
                </div>

                {/* Feature List */}
                <ul className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 space-y-2">
                  <li className="flex items-center">
                    <span className="w-1 h-1 bg-neutral-400 dark:bg-neutral-400 rounded-full mr-2" />
                    Billed monthly
                  </li>
                  <li className="flex items-center">
                    <span className="w-1 h-1 bg-neutral-400 dark:bg-neutral-400 rounded-full mr-2" />
                    Minimum 3 users
                  </li>
                  <li className="flex items-center">
                    <span className="w-1 h-1 bg-neutral-400 dark:bg-neutral-400 rounded-full mr-2" />
                    Add or remove users as needed
                  </li>
                </ul>
              </div>

              {/* Yearly Card with Badge */}
              <div className="relative">
                <div className="absolute -top-2 left-3 z-10">
                  <span className="bg-green-50 dark:bg-green-950 text-green-500 dark:text-green-500 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full border-green-500/80 dark:border-green-400/80 border font-medium text-[10px] sm:text-xs">
                    Save 40%+
                  </span>
                </div>
                <div
                  onClick={() => setBillingCycle("yearly")}
                  className={cn(
                    "p-4 sm:p-6 border-2 rounded-2xl cursor-pointer transition-all min-h-[200px] sm:min-h-[280px] flex flex-col",
                    billingCycle === "yearly"
                      ? "border-primary dark:bg-neutral-800/50 shadow-md border-2"
                      : "border-border dark:bg-neutral-800/50"
                  )}
                >
                  {/* Card Header */}
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base sm:text-lg font-medium">Yearly</h3>
                    <div
                      className={cn(
                        "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                        billingCycle === "yearly"
                          ? "border-primary bg-primary"
                          : "border-muted-foreground"
                      )}
                    >
                      {billingCycle === "yearly" && (
                        <svg
                          className="w-3 h-3 text-primary-foreground"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                  </div>

                  {/* Price Display with Strikethrough */}
                  <div className="mb-4">
                    <div className="flex items-baseline gap-1">
                      <span className="text-base sm:text-lg font-medium">
                        SR{getPricePerUser(seats, "yearly")}
                      </span>
                      <span className="text-sm sm:text-base text-muted-foreground line-through ml-1">
                        SR{getPricePerUser(seats, "monthly")}
                      </span>
                    </div>
                    <div className="text-xs sm:text-sm text-muted-foreground">
                      per user/month
                    </div>
                  </div>

                  {/* Feature List */}
                  <ul className="text-xs sm:text-sm text-muted-foreground space-y-2 mt-0">
                    <li className="flex items-center">
                      <span className="w-1 h-1 bg-muted-foreground rounded-full mr-2" />
                      Billed annually
                    </li>
                    <li className="flex items-center">
                      <span className="w-1 h-1 bg-muted-foreground rounded-full mr-2" />
                      Minimum 3 users
                    </li>
                    <li className="flex items-center">
                      <span className="w-1 h-1 bg-muted-foreground rounded-full mr-2" />
                      Add and reassign users as needed
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - Summary Panel */}
          <div className="w-full lg:w-80">
            <div className="bg-neutral-50 border border-neutral-200 dark:bg-neutral-800/50 dark:border-neutral-800 p-3 sm:p-4 flex flex-col h-full rounded-2xl">
              <h3 className="text-base sm:text-lg font-medium mb-2 text-foreground">
                Summary
              </h3>

              {/* Plan Breakdown */}
              <div className="space-y-4 mb-6 flex-1">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <div className="text-sm sm:font-medium text-foreground">
                      Team Plan - {seats} Seats ({billingCycle === "monthly" ? "Monthly" : "Yearly"})
                    </div>
                    <div className="text-sm sm:font-medium text-foreground">
                      SR{getTotalPrice().toFixed(2)}
                    </div>
                  </div>
                  
                  {/* Tiered breakdown */}
                  {calculateTieredBreakdown(seats, billingCycle).map((tier, index) => (
                    <div key={index} className="flex justify-between text-xs text-muted-foreground ml-4">
                      <span>
                        {tier.range}: SR{tier.pricePerSeat}/
                        {billingCycle === "yearly" ? "seat * 12 mos" : "month"} × {tier.seats}
                      </span>
                      <span>SR{tier.subtotal.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Today's Total Section */}
              <div className="mt-auto">
                <div className="border-t border-border pt-4 mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-sm sm:font-medium text-foreground">Today's total</div>
                    <div className="text-sm sm:text-base font-medium text-foreground">
                      SR{getTotalPrice().toFixed(2)}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Billed {billingCycle === "monthly" ? "monthly" : "annually"} starting today
                  </div>
                </div>
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-2.5 sm:py-3 rounded-lg font-medium text-sm sm:text-base">
                  Continue to billing
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
