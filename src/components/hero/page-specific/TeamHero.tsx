import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Users, Award, Globe } from 'lucide-react';
import SharedHeroHeader from '../shared/SharedHeroHeader';
const TeamHero = () => {
  return <div className="bg-background text-foreground">
      <SharedHeroHeader />
      <section className="pt-32 pb-20 px-6 bg-background">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground">
              Meet the Minds Behind{' '}
              <span className="text-primary">Shattara AI</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Our diverse team of educators, AI researchers, and technology experts is united by 
              one mission: making quality education accessible to all through innovative AI technology.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/careers">
              <Button size="lg">
                Join Our Mission
              </Button>
            </Link>
            <Link to="/signup">
              <Button variant="outline" size="lg">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="size-12 rounded-full bg-muted mx-auto mb-3 flex items-center justify-center">
                <Award className="size-6 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold text-foreground mb-1">25+</div>
              <div className="text-sm text-muted-foreground">Years Combined Experience</div>
            </div>
            
            <div className="text-center">
              <div className="size-12 rounded-full bg-muted mx-auto mb-3 flex items-center justify-center">
                <Globe className="size-6 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold text-foreground mb-1">5K+</div>
              <div className="text-sm text-muted-foreground">Students Helped</div>
            </div>
            
            <div className="text-center">
              <div className="size-12 rounded-full bg-muted mx-auto mb-3 flex items-center justify-center">
                <Users className="size-6 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold text-foreground mb-1">20+</div>
              <div className="text-sm text-muted-foreground">Partner Institutions</div>
            </div>
          </div>
        </div>
      </section>
    </div>;
};
export default TeamHero;