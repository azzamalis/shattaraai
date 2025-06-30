import React from 'react';
import TeamHero from '@/components/hero/page-specific/TeamHero';
import Footer from '@/components/Footer';

const Team = () => {
  return (
    <div className="min-h-screen bg-[#121212] text-[#FAFAFA]">
      <TeamHero />
      
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-16 text-[#FAFAFA]">Our Team</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {/* Team Member 1 */}
          <div className="bg-[#141414] p-6 rounded-xl border border-[#2E2E2E]">
            <div className="size-20 rounded-full bg-[#E3E3E3]/10 mx-auto mb-4 flex items-center justify-center">
              <svg className="text-[#E3E3E3] size-10" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-center mb-2 text-[#FAFAFA]">Azzam Sahili</h3>
            <p className="text-[#9A9A9A] text-center mb-4">Founder &amp; CEO</p>
            <p className="text-[#9A9A9A] text-center">Former senior leader with a passion for accessible education. Founded Shattara to transform learning in the Gulf region.</p>
          </div>
          
          {/* Team Member 2 */}
          <div className="bg-[#141414] p-6 rounded-xl border border-[#2E2E2E]">
            <div className="size-20 rounded-full bg-[#E3E3E3]/10 mx-auto mb-4 flex items-center justify-center">
              <svg className="text-[#E3E3E3] size-10" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-center mb-2 text-[#FAFAFA]">Xhiang Habib</h3>
            <p className="text-[#9A9A9A] text-center mb-4">Chief AI Lead</p>
            <p className="text-[#9A9A9A] text-center">PhD in Machine Learning from MIT with 10+ years of experience in educational AI systems and adaptive learning.</p>
          </div>
          
          {/* Team Member 3 */}
          <div className="bg-[#141414] p-6 rounded-xl border border-[#2E2E2E]">
            <div className="size-20 rounded-full bg-[#E3E3E3]/10 mx-auto mb-4 flex items-center justify-center">
              <svg className="text-[#E3E3E3] size-10" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-center mb-2 text-[#FAFAFA]">Noor Ali</h3>
            <p className="text-[#9A9A9A] text-center mb-4">Head of Education</p>
            <p className="text-[#9A9A9A] text-center">15+ years in curriculum development and educational psychology. Ensures our platform meets real learning needs.</p>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Team;
