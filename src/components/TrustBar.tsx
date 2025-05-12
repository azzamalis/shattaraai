
import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface TrustBarProps {
  className?: string;
}

const TrustBar: React.FC<TrustBarProps> = ({ className }) => {
  return (
    <section className={cn("pb-16 pt-16 md:pb-32", className)}>
      <div className="group relative m-auto max-w-5xl px-6">
        <div className="absolute inset-0 z-10 flex scale-95 items-center justify-center opacity-0 duration-500 group-hover:scale-100 group-hover:opacity-100">
          <Link
            to="#"
            className="block text-sm duration-150 hover:opacity-75 text-gray-300">
            <span>Loved by top universities across the Gulf</span>
            <ChevronRight className="ml-1 inline-block size-3" />
          </Link>
        </div>
        <div className="group-hover:blur-xs mx-auto mt-12 grid max-w-2xl grid-cols-2 sm:grid-cols-4 gap-x-12 gap-y-8 transition-all duration-500 group-hover:opacity-50 sm:gap-x-16 sm:gap-y-14">
          <div className="flex items-center justify-center">
            <img
              className="mx-auto h-10 w-auto opacity-70 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300"
              src="https://upload.wikimedia.org/wikipedia/en/e/ea/KFUPM_Logo.svg"
              alt="King Fahd University of Petroleum and Minerals"
              onError={(e) => {
                e.currentTarget.src = "/placeholder.svg";
                e.currentTarget.alt = "University Logo Placeholder";
              }}
            />
          </div>
          <div className="flex items-center justify-center">
            <img
              className="mx-auto h-10 w-auto opacity-70 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300"
              src="https://upload.wikimedia.org/wikipedia/en/f/f7/American_University_of_Sharjah_Logo.svg"
              alt="American University of Sharjah"
              onError={(e) => {
                e.currentTarget.src = "/placeholder.svg";
                e.currentTarget.alt = "University Logo Placeholder";
              }}
            />
          </div>
          <div className="flex items-center justify-center">
            <img
              className="mx-auto h-10 w-auto opacity-70 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300"
              src="https://upload.wikimedia.org/wikipedia/commons/0/08/QU_Logo.svg"
              alt="Qatar University"
              onError={(e) => {
                e.currentTarget.src = "/placeholder.svg";
                e.currentTarget.alt = "University Logo Placeholder";
              }}
            />
          </div>
          <div className="flex items-center justify-center">
            <img
              className="mx-auto h-10 w-auto opacity-70 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300"
              src="https://upload.wikimedia.org/wikipedia/commons/a/af/KSU_logo.svg"
              alt="King Saud University"
              onError={(e) => {
                e.currentTarget.src = "/placeholder.svg";
                e.currentTarget.alt = "University Logo Placeholder";
              }}
            />
          </div>
          <div className="flex items-center justify-center">
            <img
              className="mx-auto h-10 w-auto opacity-70 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300"
              src="https://upload.wikimedia.org/wikipedia/commons/2/2d/UAEU_Logo.svg"
              alt="United Arab Emirates University"
              onError={(e) => {
                e.currentTarget.src = "/placeholder.svg";
                e.currentTarget.alt = "University Logo Placeholder";
              }}
            />
          </div>
          <div className="flex items-center justify-center">
            <img
              className="mx-auto h-10 w-auto opacity-70 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300"
              src="https://www.ku.edu.kw/images/logo.svg"
              alt="Kuwait University"
              onError={(e) => {
                e.currentTarget.src = "/placeholder.svg";
                e.currentTarget.alt = "University Logo Placeholder";
              }}
            />
          </div>
          <div className="flex items-center justify-center">
            <img
              className="mx-auto h-10 w-auto opacity-70 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300"
              src="https://upload.wikimedia.org/wikipedia/en/e/e0/King_Abdullah_University_of_Science_and_Technology_logo.svg"
              alt="King Abdullah University of Science and Technology"
              onError={(e) => {
                e.currentTarget.src = "/placeholder.svg";
                e.currentTarget.alt = "University Logo Placeholder";
              }}
            />
          </div>
          <div className="flex items-center justify-center">
            <img
              className="mx-auto h-10 w-auto opacity-70 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300"
              src="https://upload.wikimedia.org/wikipedia/commons/5/59/New_SQU_Logo.svg"
              alt="Sultan Qaboos University"
              onError={(e) => {
                e.currentTarget.src = "/placeholder.svg";
                e.currentTarget.alt = "University Logo Placeholder";
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustBar;
