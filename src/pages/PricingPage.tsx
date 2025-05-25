
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Check } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const PricingPage: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [isCopied, setIsCopied] = useState(false);

  const copyPromoCode = () => {
    navigator.clipboard.writeText("SUMMER25");
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full overflow-auto bg-dashboard-bg transition-colors duration-300">
        {/* Promo Banner */}
        <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-7xl mx-auto">
            <div className="rounded-xl bg-[#0A1A2A] border border-[#00A3FF]/30 shadow-[0_0_30px_-5px_rgba(0,163,255,0.5)] backdrop-blur-sm">
              <div className="py-8 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-white text-2xl">🎉</span>
                    <span className="text-white text-2xl font-semibold">25% OFF</span>
                  </div>
                  
                  <div className="text-white/90">Early Summer Sale</div>

                  <div className="flex items-center space-x-2">
                    <code className="bg-[#00A3FF]/10 px-4 py-2 rounded-md border border-[#00A3FF]/30 text-white font-mono">SUMMER25</code>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={copyPromoCode}
                      className="h-9 px-4 bg-[#00A3FF]/10 border border-[#00A3FF]/30 text-white hover:bg-[#00A3FF]/20 hover:border-[#00A3FF]/50 transition-colors rounded-md"
                    >
                      {isCopied ? "Copied!" : "Copy"}
                    </Button>
                  </div>

                  <div className="text-sm text-white/80">
                    25% off your purchase. Use code at checkout. Offer ends May 31.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Heading Section */}
            <div className="text-center mb-12">
              <h1 className="text-4xl sm:text-5xl font-bold text-dashboard-text mb-4">
                Unlock smarter learning in less time.
              </h1>
              <p className="text-lg text-dashboard-text-secondary max-w-3xl mx-auto">
                Upload unlimited content, chat instantly, use voice mode, revisit recorded lectures, and more — all designed to boost your productivity.
              </p>
            </div>

            {/* Billing Toggle */}
            <div className="flex justify-center mb-12">
              <ToggleGroup 
                type="single" 
                value={billingCycle} 
                onValueChange={value => {
                  if (value) setBillingCycle(value as "monthly" | "yearly");
                }} 
                className="relative bg-dashboard-card rounded-lg p-1"
              >
                <ToggleGroupItem 
                  value="monthly" 
                  className={`px-4 py-2 rounded-md text-sm transition-all ${
                    billingCycle === "monthly" ? "bg-dashboard-card-hover text-dashboard-text" : "text-dashboard-text-secondary"
                  }`}
                >
                  Pay Monthly
                </ToggleGroupItem>
                <ToggleGroupItem 
                  value="yearly" 
                  className={`px-4 py-2 rounded-md text-sm flex items-center transition-all ${
                    billingCycle === "yearly" ? "bg-dashboard-card-hover text-dashboard-text" : "text-dashboard-text-secondary"
                  }`}
                >
                  Pay Yearly
                  <span className="ml-2 text-xs bg-[#00A3FF] text-white px-2 py-0.5 rounded-full">
                    Save 40%
                  </span>
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            {/* Pricing Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Free Plan */}
              <Card className="border-dashboard-separator rounded-lg overflow-hidden bg-dashboard-card">
                <CardContent className="p-8">
                  <h3 className="text-xl font-medium mb-2 text-dashboard-text">Free</h3>
                  <div className="flex items-baseline">
                    <span className="text-5xl font-bold text-dashboard-text">$0</span>
                    <span className="ml-1 text-dashboard-text">/ month</span>
                  </div>
                  <p className="text-sm mt-4 mb-6 pb-4 border-b border-dashboard-separator text-dashboard-text">Kickstart your learning journey today.
                  </p>
                  <ul className="space-y-4 mt-6">
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-dashboard-text">3 uploads, pastes, and records / day</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-dashboard-text">5 AI chats / day (10 / month with Learn+ mode)</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-dashboard-text">10 quiz answers / day</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-dashboard-text">2 practice exams / month</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-dashboard-text">Upload files, each up to 100 pages / 10 MB in size</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter className="px-8 pb-8 pt-0">
                  <Button className="w-full bg-dashboard-button text-dashboard-button-text hover:bg-dashboard-card-hover font-medium" variant="outline">
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
              <Card className="border-dashboard-separator rounded-lg overflow-hidden bg-dashboard-card">
                <CardContent className="p-8">
                  <h3 className="text-xl font-medium mb-2 text-dashboard-text">Team</h3>
                  <div className="flex items-baseline">
                    <span className="text-5xl font-bold text-dashboard-text">Custom</span>
                  </div>
                  <p className="text-sm mt-4 mb-6 pb-4 border-b border-dashboard-separator text-dashboard-text">For teams to learn, grow, and share knowledge.</p>
                  <div className="text-sm mb-4 mt-6 bg-transparent text-dashboard-text">Everything in Pro +</div>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-dashboard-text">Centralized team billing</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-dashboard-text">Add team members</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-dashboard-text">Custom options available in select cases</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-dashboard-text">Collaborative spaces and features</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-dashboard-text"><strong>Priority</strong> customer support</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter className="px-8 pb-8 pt-0">
                  <Button 
                    className="
                      w-full 
                      bg-transparent hover:bg-dashboard-card-hover
                      text-dashboard-text hover:text-dashboard-text
                      border border-dashboard-separator hover:border-dashboard-separator
                      transition-all duration-200
                    "
                  >
                    Contact Us
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="w-full bg-dashboard-card py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl font-medium text-dashboard-text mb-3">Frequently Asked Questions</h2>
              <p className="text-sm text-dashboard-text-secondary">
                Can't find the answer here?{" "}
                <a href="#" className="text-[#00A3FF] hover:underline">
                  Contact us
                </a>
              </p>
            </div>

            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="pro-plan" className="border-dashboard-separator bg-dashboard-card rounded-lg px-6">
                <AccordionTrigger className="text-dashboard-text hover:no-underline text-sm font-medium [&[data-state=open]>svg]:rotate-180">
                  What do I get with the Pro plan?
                </AccordionTrigger>
                <AccordionContent className="text-dashboard-text-secondary text-sm">
                  With the Pro plan, you get unlimited uploads, AI chats, quiz generation, practice exams, and voice mode. You can upload files up to 2000 pages or 300MB in size, and access all premium features without any restrictions.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="payment-methods" className="border-dashboard-separator bg-dashboard-card rounded-lg px-6">
                <AccordionTrigger className="text-dashboard-text hover:no-underline text-sm font-medium [&[data-state=open]>svg]:rotate-180">
                  What payment methods do you offer?
                </AccordionTrigger>
                <AccordionContent className="text-dashboard-text-secondary text-sm">
                  We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and various local payment methods. For team plans, we also offer invoice-based payments.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="cancel-plan" className="border-dashboard-separator bg-dashboard-card rounded-lg px-6">
                <AccordionTrigger className="text-dashboard-text hover:no-underline text-sm font-medium [&[data-state=open]>svg]:rotate-180">
                  Can I cancel my Shattara AI plan at any time?
                </AccordionTrigger>
                <AccordionContent className="text-dashboard-text-secondary text-sm">
                  Yes, you can cancel your subscription at any time. If you cancel, you'll retain access to premium features until the end of your current billing period. We don't offer refunds for partial months.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="student-discount" className="border-dashboard-separator bg-dashboard-card rounded-lg px-6">
                <AccordionTrigger className="text-dashboard-text hover:no-underline text-sm font-medium [&[data-state=open]>svg]:rotate-180">
                  Do you offer student discount?
                </AccordionTrigger>
                <AccordionContent className="text-dashboard-text-secondary text-sm">
                  Yes! We offer a 50% discount for verified students. To get the discount, please verify your student status using your academic email address or student ID through our verification partner.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="refund-policy" className="border-dashboard-separator bg-dashboard-card rounded-lg px-6">
                <AccordionTrigger className="text-dashboard-text hover:no-underline text-sm font-medium [&[data-state=open]>svg]:rotate-180">
                  What is your refund policy?
                </AccordionTrigger>
                <AccordionContent className="text-dashboard-text-secondary text-sm">
                  We offer a 14-day money-back guarantee for all new subscriptions. If you're not satisfied with Shattara AI within the first 14 days, contact our support team for a full refund, no questions asked.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PricingPage;
