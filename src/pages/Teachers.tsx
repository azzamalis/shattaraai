import React from 'react';
import TeachersHero from '@/components/hero/page-specific/TeachersHero';
import Footer from '@/components/Footer';
import { ArrowRight, BookOpen, Layers, BarChart3, Zap, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ZcalModal from '@/components/ZcalModal';

const Teachers = () => {
  return (
    <div className="min-h-screen bg-[#121212] text-[#FAFAFA]">
      <TeachersHero />
      
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[#FAFAFA]">Empower Your Teaching</h1>
          <p className="text-xl text-[#9A9A9A] max-w-3xl mx-auto">
            Transform your classroom with AI-powered tools designed specifically for educators.
            Save time, personalize learning, and engage your students like never before.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-20">
          {/* Feature 1 */}
          <div className="bg-[#141414] p-8 rounded-xl border border-[#2E2E2E]">
            <div className="size-14 rounded-full bg-[#E3E3E3]/10 mb-6 flex items-center justify-center">
              <BookOpen className="text-[#E3E3E3] size-7" />
            </div>
            <h3 className="text-xl font-semibold mb-4 text-[#FAFAFA]">Instant Study Materials</h3>
            <p className="text-[#9A9A9A]">
              Generate customized worksheets, quizzes, and study guides in seconds. Tailor content 
              to your curriculum and student needs.
            </p>
          </div>
          
          {/* Feature 2 */}
          <div className="bg-[#141414] p-8 rounded-xl border border-[#2E2E2E]">
            <div className="size-14 rounded-full bg-[#E3E3E3]/10 mb-6 flex items-center justify-center">
              <Layers className="text-[#E3E3E3] size-7" />
            </div>
            <h3 className="text-xl font-semibold mb-4 text-[#FAFAFA]">Adaptive Learning Paths</h3>
            <p className="text-[#9A9A9A]">
              Create personalized learning journeys that adjust to each student's pace and 
              comprehension level, ensuring no student is left behind.
            </p>
          </div>
          
          {/* Feature 3 */}
          <div className="bg-[#141414] p-8 rounded-xl border border-[#2E2E2E]">
            <div className="size-14 rounded-full bg-[#E3E3E3]/10 mb-6 flex items-center justify-center">
              <BarChart3 className="text-[#E3E3E3] size-7" />
            </div>
            <h3 className="text-xl font-semibold mb-4 text-[#FAFAFA]">Insightful Analytics</h3>
            <p className="text-[#9A9A9A]">
              Track student progress with comprehensive analytics. Identify strengths, weaknesses, 
              and learning patterns to optimize your teaching approach.
            </p>
          </div>
          
          {/* Feature 4 */}
          <div className="bg-[#141414] p-8 rounded-xl border border-[#2E2E2E]">
            <div className="size-14 rounded-full bg-[#E3E3E3]/10 mb-6 flex items-center justify-center">
              <Zap className="text-[#E3E3E3] size-7" />
            </div>
            <h3 className="text-xl font-semibold mb-4 text-[#FAFAFA]">Time-Saving Automation</h3>
            <p className="text-[#9A9A9A]">
              Automate grading, feedback, and administrative tasks. Reclaim hours of your week 
              to focus on what matters most: teaching.
            </p>
          </div>
          
          {/* Feature 5 */}
          <div className="bg-[#141414] p-8 rounded-xl border border-[#2E2E2E]">
            <div className="size-14 rounded-full bg-[#E3E3E3]/10 mb-6 flex items-center justify-center">
              <Award className="text-[#E3E3E3] size-7" />
            </div>
            <h3 className="text-xl font-semibold mb-4 text-[#FAFAFA]">Professional Development</h3>
            <p className="text-[#9A9A9A]">
              Access a growing library of teaching resources, methodologies, and best practices to 
              continuously enhance your teaching skills.
            </p>
          </div>
          
          {/* CTA with ZcalModal */}
          <div className="bg-[#E3E3E3]/10 p-8 rounded-xl border border-[#E3E3E3]/30">
            <h3 className="text-xl font-semibold mb-4 text-[#FAFAFA]">Ready to Transform Your Classroom?</h3>
            <p className="text-[#9A9A9A] mb-6">
              Join thousands of educators who are already using Shattara to revolutionize their teaching.
            </p>
            <ZcalModal 
              bookingUrl="https://zcal.co/i/4vqAOC__?embed=1&embedType=iframe" 
              title="Schedule a School Demo"
              embedHeight={966}
              embedWidth={1096}
              modalName="teacher_demo"
            >
              <Button className="w-full bg-[#E3E3E3] text-[#171717] hover:bg-[#E3E3E3]/90">
                Request School Demo <ArrowRight className="ml-2 size-4" />
              </Button>
            </ZcalModal>
          </div>
        </div>
        
        {/* Testimonial */}
        <div className="bg-[#141414] p-10 rounded-xl border border-[#2E2E2E] max-w-4xl mx-auto">
          <div className="flex flex-col items-center text-center">
            <div className="size-20 rounded-full bg-[#E3E3E3]/10 mb-6 flex items-center justify-center">
              <svg className="text-[#E3E3E3] size-10" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <blockquote className="text-xl italic mb-6 text-[#FAFAFA]">
              "Shattara has transformed how I teach mathematics. I can create personalized problem sets in minutes, 
              track student progress in real-time, and provide targeted support exactly when it's needed. My students' 
              engagement and test scores have never been higher."
            </blockquote>
            <cite className="not-italic">
              <div className="font-semibold text-[#FAFAFA]">Professor Huda M. Barak</div>
              <div className="text-[#9A9A9A]">Mathematics Department, Arab Open University</div>
            </cite>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Teachers;
