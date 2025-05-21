import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Check } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
const PricingPage: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  return <DashboardLayout>
      <div className="flex flex-col min-h-screen text-white bg-[#222222]">
        <div className="flex-1 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-bold text-center mb-4">Unlock smarter learning in less time.</h1>
          <p className="text-lg text-gray-400 text-center mb-12 max-w-3xl">Upload unlimited content, chat instantly, use voice mode, revisit recorded lectures, and more — all designed to boost your productivity.</p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center justify-center rounded-full p-1 mb-12 bg-[#1a1a1a]">
            <ToggleGroup type="single" value={billingCycle} onValueChange={value => {
            if (value) setBillingCycle(value as "monthly" | "yearly");
          }} className="relative bg-[#000a00]/0">
              <ToggleGroupItem value="monthly" className={`px-4 py-2 rounded-full text-sm transition-all ${billingCycle === "monthly" ? "bg-gray-900 text-white" : "text-gray-400"}`}>
                Pay Monthly
              </ToggleGroupItem>
              <ToggleGroupItem value="yearly" className={`px-4 py-2 rounded-full text-sm flex items-center transition-all ${billingCycle === "yearly" ? "bg-gray-900 text-white" : "text-gray-400"}`}>
                Pay Yearly
                <span className="ml-2 text-xs bg-[#00A3FF] text-white px-2 py-0.5 rounded-full">
                  Save 40%
                </span>
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3 w-full max-w-6xl">
            {/* Free Plan */}
            <Card className="border-0 rounded-lg overflow-hidden bg-[#1a1a1a]">
              <CardContent className="p-8">
                <h3 className="text-xl font-medium mb-2 text-white">Free</h3>
                <div className="flex items-baseline">
                  <span className="text-5xl font-bold text-white">$0</span>
                  <span className="ml-1 text-white">/ month</span>
                </div>
                <p className="text-sm mt-4 mb-6 pb-4 border-b border-gray-800 text-white">Kickstart your learning journey today.
                </p>
                <ul className="space-y-4 mt-6">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-white">3 uploads, pastes, and records / day</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-white">5 AI chats / day (10 / month with Learn+ mode)</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-white">10 quiz answers / day</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-white">2 practice exams / month</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-white">Upload files, each up to 100 pages / 10 MB in size</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter className="px-8 pb-8 pt-0">
                <Button className="w-full bg-white hover:bg-gray-200 text-black font-medium" variant="outline">
                  Get Started
                </Button>
              </CardFooter>
            </Card>

            {/* Pro Plan */}
            <Card className="bg-white text-black border-0 rounded-lg overflow-hidden relative">
              <div className="absolute -top-3 inset-x-0 flex justify-center">
                <span className="bg-[#00A3FF] text-white px-3 rounded-full py-[10px] my-[5px] text-xs">
                  {billingCycle === "yearly" ? "Billed annually" : "Most popular"}
                </span>
              </div>
              <CardContent className="p-8">
                <h3 className="text-xl font-medium mb-2">
                  Pro {billingCycle === "yearly" && "(billed annually)"}
                </h3>
                <div className="flex items-baseline">
                  <span className="text-5xl font-bold">${billingCycle === "yearly" ? "12" : "20"}</span>
                  <span className="ml-1 text-gray-600">/ month</span>
                </div>
                <p className="text-sm text-gray-600 mt-4 mb-6 pb-4 border-b border-gray-200">Master complex topics faster with expert tools.</p>
                <ul className="space-y-4 mt-6">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span><strong>Unlimited</strong> uploads, pastes, and records</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span><strong>Unlimited</strong> AI chats (100 / month with Learn+ mode)</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span><strong>Unlimited</strong> quiz generation</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span><strong>Unlimited</strong> practice exams</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span><strong>Unlimited</strong> limits on voice mode</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Upload files, each up to <strong>2000</strong> pages / 300 MB in size</span>
                  </li>
                  
                </ul>
              </CardContent>
              <CardFooter className="px-8 pb-8 pt-0">
                <Button className="w-full bg-black hover:bg-gray-800 text-white font-medium">
                  Select Plan <span className="ml-1">→</span>
                </Button>
              </CardFooter>
            </Card>

            {/* Team Plan */}
            <Card className="border-0 rounded-lg overflow-hidden bg-[#1a1a1a]">
              <CardContent className="p-8">
                <h3 className="text-xl font-medium mb-2 text-white">Team</h3>
                <div className="flex items-baseline">
                  <span className="text-5xl font-bold text-white">Custom</span>
                </div>
                <p className="text-sm mt-4 mb-6 pb-4 border-b border-gray-800 text-white">For teams to learn, grow, and share knowledge.</p>
                <div className="text-sm mb-4 mt-6 bg-transparent text-white">Everything in Pro +</div>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-white">Centralized team billing</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-white">Add team members</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-white">Custom options available in select cases</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-white">Collaborative spaces and features</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-white"><strong>Priority</strong> customer support</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter className="px-8 pb-8 pt-0">
                <Button variant="outline" className="w-full bg-transparent hover:bg-#1a1a1a text-white font-medium border-white">
                  Contact Us
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>;
};
export default PricingPage;