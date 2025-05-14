
import React from 'react';
import { HeroSection } from '@/components/hero/HeroSection';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowRight, Building, Heart, Users, Globe, Zap } from 'lucide-react';

const Careers = () => {
  // Sample job listings
  const jobListings = [
    {
      title: "AI Research Scientist",
      department: "Research & Development",
      location: "Jeddah, Saudi Arabia",
      type: "Full-time"
    },
    {
      title: "Educational Content Developer",
      department: "Curriculum",
      location: "Remote",
      type: "Full-time"
    },
    {
      title: "Frontend Engineer",
      department: "Engineering",
      location: "Jeddah, Saudi Arabia",
      type: "Full-time"
    },
    {
      title: "UI/UX Designer",
      department: "Design",
      location: "Jeddah, Saudi Arabia",
      type: "Full-time"
    },
    {
      title: "Marketing Specialist",
      department: "Marketing",
      location: "Remote",
      type: "Full-time"
    }
  ];

  // Function to handle redirecting to the Tally form
  const handleApplyRedirect = () => {
    window.open('https://tally.so/r/w4q5AA', '_blank');
  };

  return (
    <div className="min-h-screen bg-dark text-white">
      <HeroSection />
      
      {/* Hero Section */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Join Our Mission</h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Help us transform education through AI. We're looking for passionate individuals 
            who believe in making quality education accessible to all.
          </p>
        </div>
        
        {/* Company Values */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-24">
          <div className="bg-dark-deeper p-8 rounded-xl border border-primary/20">
            <h2 className="text-2xl font-semibold mb-6">Our Culture</h2>
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center mr-4 flex-shrink-0">
                  <Heart className="text-primary size-6" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Passion for Education</h3>
                  <p className="text-gray-400">We believe in the transformative power of education and are committed to making it accessible to all.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center mr-4 flex-shrink-0">
                  <Users className="text-primary size-6" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Collaborative Environment</h3>
                  <p className="text-gray-400">We foster an inclusive workplace where diverse perspectives are valued and everyone's voice is heard.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center mr-4 flex-shrink-0">
                  <Globe className="text-primary size-6" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Global Impact</h3>
                  <p className="text-gray-400">Our work extends beyond borders, creating positive change in educational systems worldwide.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-dark-deeper p-8 rounded-xl border border-primary/20">
            <h2 className="text-2xl font-semibold mb-6">Benefits & Perks</h2>
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center mr-4 flex-shrink-0">
                  <Building className="text-primary size-6" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Work Environment</h3>
                  <p className="text-gray-400">Modern offices, flexible remote options, and a culture that prioritizes work-life balance.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center mr-4 flex-shrink-0">
                  <Zap className="text-primary size-6" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Growth Opportunities</h3>
                  <p className="text-gray-400">Continuous learning, professional development funds, and clear career advancement paths.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center mr-4 flex-shrink-0">
                  <Heart className="text-primary size-6" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Comprehensive Benefits</h3>
                  <p className="text-gray-400">Competitive salary, health insurance, paid time off, and employee wellness programs.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Open Positions */}
        <div className="mb-24">
          <h2 className="text-3xl font-bold text-center mb-12">Open Positions</h2>
          
          <div className="bg-dark-deeper rounded-xl border border-primary/20 overflow-hidden">
            {jobListings.map((job, index) => (
              <div key={index} className={`p-6 flex flex-col md:flex-row md:items-center md:justify-between ${index !== jobListings.length - 1 ? 'border-b border-primary/10' : ''}`}>
                <div className="mb-4 md:mb-0">
                  <h3 className="text-xl font-semibold mb-1">{job.title}</h3>
                  <p className="text-gray-400">{job.department} · {job.location} · {job.type}</p>
                </div>
                <Button 
                  className="self-start md:self-center"
                  onClick={handleApplyRedirect}
                >
                  Apply Now <ArrowRight className="ml-2 size-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
        
        {/* Application CTA */}
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Don't See a Fit?</h2>
          <p className="text-xl text-gray-400 mb-8">
            We're always looking for talented individuals. Send us your resume, and we'll 
            keep you in mind for future opportunities.
          </p>
          <Button 
            size="lg" 
            className="bg-primary hover:bg-primary/90"
            onClick={handleApplyRedirect}
          >
            Send General Application
          </Button>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Careers;
