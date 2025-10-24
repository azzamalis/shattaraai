import React, { useState } from "react";
import { Check, ArrowRight } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { TeamPlanDialog } from "@/components/dashboard/modals/TeamPlanDialog";

const PricingPage: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly");
  const [teamPlanDialogOpen, setTeamPlanDialogOpen] = useState(false);

  const universityLogos = [
    { name: "King Saud University", src: "/images/king_saud_university.png" },
    { name: "King Abdulaziz University", src: "/images/king_abdulaziz_university.png" },
    { name: "KFUPM", src: "/images/KFUPM.png" },
    { name: "Imam Abdulrahman Bin Faisal University", src: "/images/Imam_Abdulrahman_Bin_Faisal_University.png" },
    { name: "Princess Nourah University", src: "/images/princess_nourah_university.png" },
    { name: "Umm Al-Qura University", src: "/images/Umm_Al-Qura_University.png" },
  ];

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full overflow-auto bg-white dark:bg-[#000] text-neutral-950 dark:text-white transition-colors duration-300">
        <div className="pb-6 h-full mt-2 md:mt-4">
          <div className="items-center flex-col flex gap-4">
            {/* Hero Section */}
            <div className="items-center justify-center text-center flex w-full mt-12 mb-6">
              <div className="flex-col w-full px-4">
                <h1 className="text-4xl my-3 text-foreground font-semibold">
                  Save hours, learn smarter.
                </h1>
                <h2 className="text-muted-foreground text-xl mt-6 max-w-3xl mx-auto font-normal">
                  Enjoy endless content uploads, chats, voice mode, recorded lectures, and more.
                </h2>
              </div>
            </div>

            <div className="items-center flex-col justify-center flex gap-12 w-full">
              {/* Billing Toggle */}
              <div className="text-neutral-500 bg-neutral-100 dark:bg-neutral-800 items-center justify-center inline-flex rounded-full p-1 text-sm font-medium">
                <button 
                  onClick={() => setBillingCycle("monthly")}
                  className={`items-center cursor-pointer justify-center py-2 px-3 text-center flex w-28 h-10 rounded-full transition-all ${
                    billingCycle === "monthly" ? "text-neutral-900 dark:text-white bg-white dark:bg-neutral-700" : ""
                  }`}
                >
                  Pay Monthly
                </button>
                <button 
                  onClick={() => setBillingCycle("yearly")}
                  className={`items-center cursor-pointer justify-between py-2 px-3 text-center flex w-40 h-10 rounded-full transition-all ${
                    billingCycle === "yearly" ? "text-neutral-900 dark:text-white bg-white dark:bg-neutral-700" : ""
                  }`}
                >
                  Pay Yearly
                  <span className="text-emerald-500 text-xs rounded-full p-1">Save 40%</span>
                </button>
              </div>

              {/* Pricing Cards */}
              <div className="justify-center flex w-full">
                <div className="items-center flex-col px-4 flex gap-8 lg:flex-row max-w-7xl">
                  {/* Free Plan */}
                  <div className="text-neutral-800 dark:text-neutral-200 bg-[linear-gradient(to_right_bottom,rgb(255,255,255),rgb(245,245,245))] dark:bg-[linear-gradient(to_right_bottom,rgb(75,75,75),rgb(64,64,64))] flex-col justify-between flex w-full max-w-xs border-2 border-neutral-200 dark:border-neutral-700 border-solid rounded-3xl overflow-hidden p-8">
                    <div className="mb-6">
                       <div className="items-center justify-between flex">
                        <div className="items-center flex">
                          <h1 className="text-4xl font-light my-3"><span className="font-medium">Free</span></h1>
                        </div>
                      </div>
                      <div className="mt-4">
                        <div className="items-end justify-start flex w-full">
                          <div>
                            <span className="text-5xl">
                              <span className="font-light">$</span>
                              <span className="ml-1.5">0</span>
                            </span>
                            <span className="text-lg font-light opacity-70"> / month</span>
                          </div>
                        </div>
                        <div className="text-base mt-4">Start your learning journey here.</div>
                        <div className="bg-neutral-600 dark:bg-neutral-500 w-full h-px my-4"></div>
                      </div>
                      <div className="flex-col flex min-h-[17.50rem] mt-4 gap-3">
                        <div className="items-start flex w-full">
                          <div className="mt-1">
                            <Check className="w-4 h-4 mt-1 mr-4 text-neutral-800 dark:text-neutral-200" strokeWidth={2} />
                          </div>
                          <div className="items-start flex-grow flex text-sm">
                            <span className="mb-2">3 uploads, pastes, and records / day</span>
                          </div>
                        </div>
                        <div className="items-start flex w-full">
                          <div className="mt-1">
                            <Check className="w-4 h-4 mt-1 mr-4 text-neutral-800 dark:text-neutral-200" strokeWidth={2} />
                          </div>
                          <div className="items-start flex-grow flex text-sm">
                            <span className="mb-2">5 AI chats / day (10 / month with <span className="underline decoration-dotted cursor-pointer">Learn+</span> mode)</span>
                          </div>
                        </div>
                        <div className="items-start flex w-full">
                          <div className="mt-1">
                            <Check className="w-4 h-4 mt-1 mr-4 text-neutral-800 dark:text-neutral-200" strokeWidth={2} />
                          </div>
                          <div className="items-start flex-grow flex text-sm">
                            <span className="mb-2">10 quiz answers / day</span>
                          </div>
                        </div>
                        <div className="items-start flex w-full">
                          <div className="mt-1">
                            <Check className="w-4 h-4 mt-1 mr-4 text-neutral-800 dark:text-neutral-200" strokeWidth={2} />
                          </div>
                          <div className="items-start flex-grow flex text-sm">
                            <span className="mb-2">2 practice exams / month</span>
                          </div>
                        </div>
                        <div className="items-start flex w-full">
                          <div className="mt-1">
                            <Check className="w-4 h-4 mt-1 mr-4 text-neutral-800 dark:text-neutral-200" strokeWidth={2} />
                          </div>
                          <div className="items-start flex-grow flex text-sm">
                            <span className="mb-2">1 podcast / day</span>
                          </div>
                        </div>
                        <div className="items-start flex w-full">
                          <div className="mt-1">
                            <Check className="w-4 h-4 mt-1 mr-4 text-neutral-800 dark:text-neutral-200" strokeWidth={2} />
                          </div>
                          <div className="items-start flex-grow flex text-sm">
                            <span className="mb-2">Upload files, each up to 100 pages / 10 MB in size</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <button className="text-white bg-neutral-900 dark:bg-white dark:text-black items-center cursor-pointer justify-center py-2 px-4 text-center flex w-full h-12 border-2 border-neutral-200 dark:border-neutral-700 border-solid rounded-full overflow-visible hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors">
                      <div className="items-center justify-center flex">Get Started</div>
                    </button>
                  </div>

                  {/* Pro Plan */}
                  <div className="text-white bg-[linear-gradient(to_right_bottom,rgb(23,23,23),rgb(38,38,38))] dark:bg-[linear-gradient(to_right_bottom,rgb(23,23,23),rgb(38,38,38))] flex-col justify-between flex w-full max-w-xs rounded-3xl overflow-hidden p-8">
                    <div className="mb-6">
                      <div className="items-center justify-between flex gap-2">
                        <div className="items-center flex gap-2">
                          <h1 className="text-4xl font-light my-3">
                            <span className="font-medium">Pro</span>
                          </h1>
                          <span className="text-xs opacity-70">
                            {billingCycle === "yearly" ? "Billed Annually" : "Billed Monthly"}
                          </span>
                        </div>
                        <div className="text-green-500 bg-green-500/20 items-center backdrop-blur-md py-1 px-2 flex w-auto h-auto border-2 border-green-500/40 border-solid rounded-full text-xs font-medium">
                          <span className="rounded-full">Popular</span>
                        </div>
                      </div>
                      <div className="mt-4">
                        <div className="items-end justify-start flex w-full">
                          <div>
                            <span className="text-5xl">
                              <span className="font-light">SR</span>
                              <span className="ml-1.5">{billingCycle === "yearly" ? "45" : "75"}</span>
                            </span>
                            <span className="text-lg font-light opacity-70"> / month</span>
                          </div>
                        </div>
                        <div className="text-base mt-4">Learn at the highest level.</div>
                        <div className="bg-neutral-600 w-full h-px my-4"></div>
                      </div>
                      <div className="flex-col flex min-h-[17.50rem] mt-4 gap-3">
                        <div className="items-start flex w-full">
                          <div className="mt-1">
                            <Check className="w-4 h-4 mt-1 mr-4 text-white" strokeWidth={2} />
                          </div>
                          <div className="items-start flex-grow flex text-sm">
                            <span className="mb-2"><span className="font-semibold">Unlimited</span> uploads, pastes, and records</span>
                          </div>
                        </div>
                        <div className="items-start flex w-full">
                          <div className="mt-1">
                            <Check className="w-4 h-4 mt-1 mr-4 text-white" strokeWidth={2} />
                          </div>
                          <div className="items-start flex-grow flex text-sm">
                            <span className="mb-2"><span className="font-semibold">Unlimited</span> AI chats <span className="font-semibold">(100</span> / day with <span className="underline decoration-dotted cursor-pointer">Learn+</span> <span className="font-semibold">mode)</span></span>
                          </div>
                        </div>
                        <div className="items-start flex w-full">
                          <div className="mt-1">
                            <Check className="w-4 h-4 mt-1 mr-4 text-white" strokeWidth={2} />
                          </div>
                          <div className="items-start flex-grow flex text-sm">
                            <span className="mb-2"><span className="font-semibold">Unlimited</span> quiz generation</span>
                          </div>
                        </div>
                        <div className="items-start flex w-full">
                          <div className="mt-1">
                            <Check className="w-4 h-4 mt-1 mr-4 text-white" strokeWidth={2} />
                          </div>
                          <div className="items-start flex-grow flex text-sm">
                            <span className="mb-2"><span className="font-semibold">Unlimited</span> practice exams</span>
                          </div>
                        </div>
                        <div className="items-start flex w-full">
                          <div className="mt-1">
                            <Check className="w-4 h-4 mt-1 mr-4 text-white" strokeWidth={2} />
                          </div>
                          <div className="items-start flex-grow flex text-sm">
                            <span className="mb-2"><span className="font-semibold">10</span> <span className="font-semibold">podcasts</span> / day</span>
                          </div>
                        </div>
                        <div className="items-start flex w-full">
                          <div className="mt-1">
                            <Check className="w-4 h-4 mt-1 mr-4 text-white" strokeWidth={2} />
                          </div>
                          <div className="items-start flex-grow flex text-sm">
                            <span className="mb-2">Upload files, each up to <span className="font-semibold">2000</span> pages / 300 MB <span className="font-semibold">in</span> size</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <button className="text-black bg-white items-center cursor-pointer justify-center py-2 px-4 text-center flex w-full h-12 rounded-full overflow-visible hover:bg-neutral-100 transition-colors">
                      <div className="items-center justify-center flex">
                        <span className="font-medium">Start your 7 day free trial</span>
                        <ArrowRight className="w-4 h-4 ml-2" strokeWidth={2} />
                      </div>
                    </button>
                  </div>

                  {/* Team Plan */}
                  <div className="text-white bg-[linear-gradient(to_right_bottom,rgb(23,23,23),rgb(38,38,38))] dark:bg-[linear-gradient(to_right_bottom,rgb(23,23,23),rgb(38,38,38))] flex-col justify-between flex w-full max-w-xs rounded-3xl overflow-hidden p-8">
                    <div className="mb-6">
                      <div className="items-center justify-between flex">
                        <div className="items-center flex gap-2">
                          <h1 className="text-4xl font-light my-3">
                            <span className="font-medium">Team</span>
                          </h1>
                          <span className="text-xs opacity-70">
                            {billingCycle === "yearly" ? "Billed Annually" : "Billed Monthly"}
                          </span>
                        </div>
                      </div>
                      <div className="mt-4">
                        <div className="items-end justify-start flex w-full">
                          <div>
                            <span className="text-5xl">
                              <span className="font-light">SR</span>
                              <span className="ml-1.5">{billingCycle === "yearly" ? "34" : "56"}</span>
                            </span>
                            <span className="text-lg font-light opacity-70"> / month / seat</span>
                            <div className="text-xs opacity-60 mt-1.5">Minimum 3 seats required</div>
                          </div>
                        </div>
                        <div className="text-base mt-4">For study groups and teams.</div>
                        <div className="bg-neutral-600 w-full h-px my-4"></div>
                      </div>
                      <div className="flex-col flex min-h-[17.50rem] mt-4 gap-3">
                        <div className="items-start flex w-full text-sm font-semibold">
                          <div className="items-start flex-grow flex">
                            <span className="mb-2">Everything in Pro +</span>
                          </div>
                        </div>
                        <div className="items-start flex w-full">
                          <div className="mt-1">
                            <Check className="w-4 h-4 mt-1 mr-4 text-white" strokeWidth={2} />
                          </div>
                          <div className="items-start flex-grow flex text-sm">
                            <span className="mb-2">Discounts scale with <span className="font-semibold">team</span> size</span>
                          </div>
                        </div>
                        <div className="items-start flex w-full">
                          <div className="mt-1">
                            <Check className="w-4 h-4 mt-1 mr-4 text-white" strokeWidth={2} />
                          </div>
                          <div className="items-start flex-grow flex text-sm font-semibold">
                            <span className="mb-2">Centralized team billing</span>
                          </div>
                        </div>
                        <div className="items-start flex w-full">
                          <div className="mt-1">
                            <Check className="w-4 h-4 mt-1 mr-4 text-white" strokeWidth={2} />
                          </div>
                          <div className="items-start flex-grow flex text-sm">
                            <span className="mb-2"><span className="font-semibold">Shared</span> spaces</span>
                          </div>
                        </div>
                        <div className="items-start flex w-full">
                          <div className="mt-1">
                            <Check className="w-4 h-4 mt-1 mr-4 text-white" strokeWidth={2} />
                          </div>
                          <div className="items-start flex-grow flex text-sm">
                            <span className="mb-2">Add, remove and set <span className="font-semibold">custom</span> permissions for <span className="font-semibold">team</span> members</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => setTeamPlanDialogOpen(true)}
                      className="text-black bg-white items-center cursor-pointer justify-center py-2 px-4 text-center flex w-full h-12 rounded-full overflow-visible hover:bg-neutral-100 transition-colors font-medium"
                    >
                      <div className="items-center justify-center flex">
                        Choose Team
                        <ArrowRight className="w-4 h-4 ml-2" strokeWidth={2} />
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* University Logos */}
          <div className="flex-col text-center hidden w-full mt-16 gap-6 lg:flex px-4">
            <h2 className="text-neutral-500 dark:text-neutral-400 text-sm">Trusted by over 1.5 million learners</h2>
            <div className="items-center flex-wrap justify-center flex gap-10">
              {universityLogos.map((logo, index) => (
                <img 
                  key={index}
                  src={logo.src} 
                  alt={logo.name}
                  className="w-24 h-auto max-w-[7.50rem] max-h-[4.38rem] object-contain opacity-70 hover:opacity-100 transition-opacity"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ))}
            </div>
          </div>

          {/* FAQ Section */}
          <div className="flex-col py-12 flex mt-16 px-4">
            <h1 className="text-2xl text-center hidden my-3 lg:block text-neutral-950 dark:text-white">
              Frequently Asked Questions
            </h1>
            <span className="text-neutral-500 dark:text-neutral-400 text-center mt-4 mb-10 lg:mb-12">
              Can't find the answer here? &nbsp;
              <a href="/contact" className="underline hover:text-neutral-700 dark:hover:text-neutral-300">
                Contact us
              </a>
            </span>
            <div className="w-full max-w-[56.25rem] m-auto text-lg min-[1400px]:max-w-[87.50rem]">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="pro-plan" className="border-b-2 border-neutral-200 dark:border-neutral-700">
                  <AccordionTrigger className="py-4 text-left text-lg font-medium text-neutral-950 dark:text-white hover:no-underline">
                    What do I get with the Pro plan?
                  </AccordionTrigger>
                  <AccordionContent className="text-neutral-600 dark:text-neutral-400 pb-4">
                    With the Pro plan, you get unlimited uploads, AI chats, quiz generation, practice exams, and more. You can upload files up to 2000 pages or 300MB in size, and access all premium features without any restrictions.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="team-plan" className="border-b-2 border-neutral-200 dark:border-neutral-700">
                  <AccordionTrigger className="py-4 text-left text-lg font-medium text-neutral-950 dark:text-white hover:no-underline">
                    What do I get with the Team plan?
                  </AccordionTrigger>
                  <AccordionContent className="text-neutral-600 dark:text-neutral-400 pb-4">
                    The Team plan includes everything in Pro plus centralized billing, shared spaces, custom permissions, and discounts that scale with team size. Perfect for study groups and collaborative learning environments.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="payment-methods" className="border-b-2 border-neutral-200 dark:border-neutral-700">
                  <AccordionTrigger className="py-4 text-left text-lg font-medium text-neutral-950 dark:text-white hover:no-underline">
                    What payment methods do you offer?
                  </AccordionTrigger>
                  <AccordionContent className="text-neutral-600 dark:text-neutral-400 pb-4">
                    We accept all major credit cards, debit cards, and various local payment methods. All payments are processed securely through our payment partners.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="cancel-plan" className="border-b-2 border-neutral-200 dark:border-neutral-700">
                  <AccordionTrigger className="py-4 text-left text-lg font-medium text-neutral-950 dark:text-white hover:no-underline">
                    Can I cancel my Shattara AI plan at any time?
                  </AccordionTrigger>
                  <AccordionContent className="text-neutral-600 dark:text-neutral-400 pb-4">
                    Yes, you can cancel your subscription at any time. If you cancel, you'll retain access to premium features until the end of your current billing period.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="student-discount" className="border-b-2 border-neutral-200 dark:border-neutral-700">
                  <AccordionTrigger className="py-4 text-left text-lg font-medium text-neutral-950 dark:text-white hover:no-underline">
                    Do you offer student discount?
                  </AccordionTrigger>
                  <AccordionContent className="text-neutral-600 dark:text-neutral-400 pb-4">
                    Yes! We offer special discounts for students. Please contact our support team with your student ID or academic email address to learn more about available discounts.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="refund-policy" className="border-b-2 border-neutral-200 dark:border-neutral-700">
                  <AccordionTrigger className="py-4 text-left text-lg font-medium text-neutral-950 dark:text-white hover:no-underline">
                    What is your refund policy?
                  </AccordionTrigger>
                  <AccordionContent className="text-neutral-600 dark:text-neutral-400 pb-4">
                    We offer a 7-day money-back guarantee for all new subscriptions. If you're not satisfied within the first 7 days, contact our support team for a full refund.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </div>
      </div>

      <TeamPlanDialog 
        open={teamPlanDialogOpen} 
        onOpenChange={setTeamPlanDialogOpen} 
      />
    </DashboardLayout>
  );
};

export default PricingPage;
