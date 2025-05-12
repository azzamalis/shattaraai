import React from 'react';
import { HeroSection } from '@/components/hero/HeroSection';
import Footer from '@/components/Footer';
const Team = () => {
  return <div className="min-h-screen bg-dark text-white">
      <HeroSection />
      
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-16">Our Team</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {/* Team Member 1 */}
          <div className="bg-dark-deeper p-6 rounded-xl border border-primary/20">
            <div className="size-20 rounded-full bg-primary/10 mx-auto mb-4 flex items-center justify-center">
              <svg className="text-primary size-10" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-center mb-2">Azzam Sahili</h3>
            <p className="text-gray-400 text-center mb-4">Founder &amp; CEO</p>
            <p className="text-gray-500 text-center">Former senior leader with a passion for accessible education. Founded Shattara to transform learning in the Gulf region.</p>
          </div>
          
          {/* Team Member 2 */}
          <div className="bg-dark-deeper p-6 rounded-xl border border-primary/20">
            <div className="size-20 rounded-full bg-primary/10 mx-auto mb-4 flex items-center justify-center">
              <svg className="text-primary size-10" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-center mb-2">Xhiang Habib</h3>
            <p className="text-gray-400 text-center mb-4">Chief AI Lead</p>
            <p className="text-gray-500 text-center">PhD in Machine Learning from MIT with 10+ years of experience in educational AI systems and adaptive learning.</p>
          </div>
          
          {/* Team Member 3 */}
          <div className="bg-dark-deeper p-6 rounded-xl border border-primary/20">
            <div className="size-20 rounded-full bg-primary/10 mx-auto mb-4 flex items-center justify-center">
              <svg className="text-primary size-10" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-center mb-2">Noor Ali</h3>
            <p className="text-gray-400 text-center mb-4">Head of Education</p>
            <p className="text-gray-500 text-center">15+ years in curriculum development and educational psychology. Ensures our platform meets real learning needs.</p>
          </div>
          
          {/* Team Member 4 */}
          
          
          {/* Team Member 5 */}
          
          
          {/* Team Member 6 */}
          
        </div>
      </section>
      
      <Footer />
    </div>;
};
export default Team;