
import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface TrustBarProps {
  className?: string;
}

const TrustBar: React.FC<TrustBarProps> = ({ className }) => {
  // These logos are reliable and common Saudi universities with local image paths
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
      // Using placeholder for this one as it may not be in the images folder
      src: "public/images/prince_mohammad_bin_fahad-university.png",
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
    <section className={cn("pb-16 pt-16 md:pb-32", className)}>
      <div className="group relative m-auto max-w-5xl px-6">
        <div className="absolute inset-0 z-10 flex scale-95 items-center justify-center opacity-0 duration-500 group-hover:scale-100 group-hover:opacity-100">
          <Link
            to="#"
            className="block text-sm duration-150 hover:opacity-75 text-gray-300">
            <span>Loved by top universities across Saudi Arabia</span>
            <ChevronRight className="ml-1 inline-block size-3" />
          </Link>
        </div>
        <div className="group-hover:blur-xs mx-auto mt-12 grid max-w-2xl grid-cols-2 sm:grid-cols-4 gap-x-12 gap-y-8 transition-all duration-500 group-hover:opacity-50 sm:gap-x-16 sm:gap-y-14">
          {universityLogos.map((logo, index) => (
            <div key={index} className="flex items-center justify-center">
              <img
                className="mx-auto h-10 w-auto opacity-70 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                src={logo.src}
                alt={logo.name}
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.svg";
                  e.currentTarget.alt = "University Logo Placeholder";
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBar;
