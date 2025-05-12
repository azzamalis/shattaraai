
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HeroActionLinkProps {
  to: string;
  text: string;
}

const HeroActionLink: React.FC<HeroActionLinkProps> = ({ to, text }) => {
  return (
    <Link
      to={to}
      className="hover:bg-background/5 group mx-auto flex w-fit items-center gap-4 rounded-full border border-primary/20 p-1 pl-4 shadow-md shadow-primary/5 transition-all duration-300 bg-dark/30 backdrop-blur-sm">
      <span className="text-sm text-gray-300">{text}</span>
      <span className="block h-4 w-0.5 border-l bg-primary/50"></span>

      <div className="bg-primary/10 group-hover:bg-primary/20 size-6 overflow-hidden rounded-full duration-500">
        <div className="flex w-12 -translate-x-1/2 duration-500 ease-in-out group-hover:translate-x-0">
          <span className="flex size-6">
            <ArrowRight className="m-auto size-3 text-primary" />
          </span>
          <span className="flex size-6">
            <ArrowRight className="m-auto size-3 text-primary" />
          </span>
        </div>
      </div>
    </Link>
  );
};

export default HeroActionLink;
