import React from 'react';
import TeamHero from '@/components/hero/page-specific/TeamHero';
import Footer from '@/components/Footer';
const Team = () => {
  return <div className="min-h-screen bg-background text-foreground">
      <TeamHero />
      
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-16 text-foreground">Our Team</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {/* Team Member 1 */}
          <div className="bg-card p-6 rounded-xl border border-border">
            
            <h3 className="text-xl font-semibold text-center mb-2 text-card-foreground">Azzam AlSahili</h3>
            <p className="text-muted-foreground text-center mb-4">Co-founder &amp; CEO</p>
            <p className="text-muted-foreground text-center">Former senior leader with a passion for accessible education. Founded Shattara AI to transform e-learning in the MENA region.</p>
          </div>
          
          {/* Team Member 2 */}
          <div className="bg-card p-6 rounded-xl border border-border">
            
            <h3 className="text-xl font-semibold text-center mb-2 text-card-foreground">Mohammad AlKabbani</h3>
            <p className="text-muted-foreground text-center mb-4">Co-founder &amp; CTO</p>
            <p className="text-muted-foreground text-center">CS Professional with 8+ years of experience in product, growth and AI systems learning.</p>
          </div>
          
          {/* Team Member 3 */}
          <div className="bg-card p-6 rounded-xl border border-border">
            
            <h3 className="text-xl font-semibold text-center mb-2 text-card-foreground">Noor Dally</h3>
            <p className="text-muted-foreground text-center mb-4">Chief Education Officer</p>
            <p className="text-muted-foreground text-center">10+ years in curriculum development and educational psychology. Ensures our platform meets real learning needs.</p>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>;
};
export default Team;