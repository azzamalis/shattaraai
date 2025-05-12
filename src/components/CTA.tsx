
import React from 'react';
import Button from './Button';
import { Link } from 'react-router-dom';

const CTA = () => {
  return (
    <section className="py-24 bg-dark text-white">
      <div className="container mx-auto px-4 md:px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Don't Study The Old Way.
          </h2>
          <p className="text-lg text-gray-300 mb-8">
            Join over one million learners who've transformed their study habits with our AI-powered learning platform.
          </p>
          <Link to="/signup">
            <Button 
              className="text-lg px-8 py-4 bg-primary hover:bg-primary-light"
              size="lg"
            >
              Try It Now
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTA;
