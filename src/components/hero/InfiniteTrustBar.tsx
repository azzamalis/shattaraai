
import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { InfiniteSlider } from '@/components/ui/infinite-slider';

interface InfiniteTrustBarProps {
  className?: string;
}

const InfiniteTrustBar: React.FC<InfiniteTrustBarProps> = ({ className }) => {
  const universityLogos = [
    {
      name: "King Saud University",
      src: "/images/king_saud_university.png",
    },
    {
      name: "King Fahd University of Petroleum and Minerals",
      src: "/images/KFUPM.png",
    },
    {
      name: "King Abdulaziz University",
      src: "/images/king_abdulaziz_university.png",
    },
    {
      name: "Prince Mohammad Bin Fahd University",  
      src: "/images/prince_mohammad_bin_fahad-university.png",
    },
    {
      name: "King Abdullah University of Science and Technology",
      src: "/images/king_abdullah_university_of_science_and_technology.png",
    },
    {
      name: "Princess Nourah University",
      src: "/images/princess_nourah_university.png",
    },
    {
      name: "Imam Abdulrahman Bin Faisal University",
      src: "/images/Imam_Abdulrahman_Bin_Faisal_University.png",
    },
    {
      name: "Umm Al-Qura University",
      src: "/images/Umm_Al-Qura_University.png",
    },
  ];

  return (
    <section className={cn("pb-16 pt-16 md:pb-32 bg-background", className)}>
      <div className="group relative m-auto max-w-5xl px-6">
        <div className="absolute inset-0 z-10 flex scale-95 items-center justify-center opacity-0 duration-500 group-hover:scale-100 group-hover:opacity-100">
          <Link
            to="#"
            className="block text-sm duration-150 hover:opacity-75 text-muted-foreground">
            <span>Loved by top universities across Saudi Arabia</span>
            <ChevronRight className="ml-1 inline-block size-3" />
          </Link>
        </div>
        
        <div className="group-hover:blur-xs transition-all duration-500 group-hover:opacity-50">
          <InfiniteSlider
            gap={48}
            duration={30}
            durationOnHover={60}
            className="py-8"
          >
            {universityLogos.map((logo, index) => (
              <div key={index} className="flex items-center justify-center flex-shrink-0">
                <img
                  className="h-12 w-auto opacity-70 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                  src={logo.src}
                  alt={logo.name}
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg";
                    e.currentTarget.alt = "University Logo Placeholder";
                  }}
                />
              </div>
            ))}
          </InfiniteSlider>
        </div>
      </div>
    </section>
  );
};

export default InfiniteTrustBar;
