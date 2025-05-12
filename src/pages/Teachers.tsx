import React from 'react';
import { HeroSection } from '@/components/hero/HeroSection';
import Footer from '@/components/Footer';
import { ArrowRight, BookOpen, Layers, BarChart3, Zap, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
const Teachers = () => {
  return <div className="min-h-screen bg-dark text-white">
      <HeroSection />
      
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Empower Your Teaching</h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Transform your classroom with AI-powered tools designed specifically for educators.
            Save time, personalize learning, and engage your students like never before.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-20">
          {/* Feature 1 */}
          <div className="bg-dark-deeper p-8 rounded-xl border border-primary/20">
            <div className="size-14 rounded-full bg-primary/10 mb-6 flex items-center justify-center">
              <BookOpen className="text-primary size-7" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Instant Study Materials</h3>
            <p className="text-gray-400">
              Generate customized worksheets, quizzes, and study guides in seconds. Tailor content 
              to your curriculum and student needs.
            </p>
          </div>
          
          {/* Feature 2 */}
          <div className="bg-dark-deeper p-8 rounded-xl border border-primary/20">
            <div className="size-14 rounded-full bg-primary/10 mb-6 flex items-center justify-center">
              <Layers className="text-primary size-7" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Adaptive Learning Paths</h3>
            <p className="text-gray-400">
              Create personalized learning journeys that adjust to each student's pace and 
              comprehension level, ensuring no student is left behind.
            </p>
          </div>
          
          {/* Feature 3 */}
          <div className="bg-dark-deeper p-8 rounded-xl border border-primary/20">
            <div className="size-14 rounded-full bg-primary/10 mb-6 flex items-center justify-center">
              <BarChart3 className="text-primary size-7" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Insightful Analytics</h3>
            <p className="text-gray-400">
              Track student progress with comprehensive analytics. Identify strengths, weaknesses, 
              and learning patterns to optimize your teaching approach.
            </p>
          </div>
          
          {/* Feature 4 */}
          <div className="bg-dark-deeper p-8 rounded-xl border border-primary/20">
            <div className="size-14 rounded-full bg-primary/10 mb-6 flex items-center justify-center">
              <Zap className="text-primary size-7" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Time-Saving Automation</h3>
            <p className="text-gray-400">
              Automate grading, feedback, and administrative tasks. Reclaim hours of your week 
              to focus on what matters most: teaching.
            </p>
          </div>
          
          {/* Feature 5 */}
          <div className="bg-dark-deeper p-8 rounded-xl border border-primary/20">
            <div className="size-14 rounded-full bg-primary/10 mb-6 flex items-center justify-center">
              <Award className="text-primary size-7" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Professional Development</h3>
            <p className="text-gray-400">
              Access a growing library of teaching resources, methodologies, and best practices to 
              continuously enhance your teaching skills.
            </p>
          </div>
          
          {/* CTA */}
          <div className="bg-primary/10 p-8 rounded-xl border border-primary/30">
            <h3 className="text-xl font-semibold mb-4">Ready to Transform Your Classroom?</h3>
            <p className="text-gray-400 mb-6">
              Join thousands of educators who are already using Shattara to revolutionize their teaching.
            </p>
            <Button className="w-full bg-primary hover:bg-primary/90">
              Request School Demo <ArrowRight className="ml-2 size-4" />
            </Button>
          </div>
        </div>
        
        {/* Testimonial */}
        <div className="bg-dark-deeper p-10 rounded-xl border border-primary/20 max-w-4xl mx-auto">
          <div className="flex flex-col items-center text-center">
            <div className="size-20 rounded-full bg-primary/10 mb-6 flex items-center justify-center">
              <svg className="text-primary size-10" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <blockquote className="text-xl italic mb-6">
              "Shattara has transformed how I teach mathematics. I can create personalized problem sets in minutes, 
              track student progress in real-time, and provide targeted support exactly when it's needed. My students' 
              engagement and test scores have never been higher."
            </blockquote>
            <cite className="not-italic">
              <div className="font-semibold">Professor Huda M. Barak</div>
              <div className="text-gray-400">Mathematics Department, Arab Open University</div>
            </cite>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>;
};
export default Teachers;