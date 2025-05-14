
import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface TrustBarProps {
  className?: string;
}

const TrustBar: React.FC<TrustBarProps> = ({ className }) => {
  // These logos are reliable and common Saudi universities
  const universityLogos = [
    {
      name: "King Saud University",
      src: "https://upload.wikimedia.org/wikipedia/en/3/3d/King_Saud_University_Logo.png",
    },
    {
      name: "King Fahd University of Petroleum and Minerals",
      src: "https://upload.wikimedia.org/wikipedia/en/thumb/e/ea/KFUPM_Logo.svg/1200px-KFUPM_Logo.svg.png",
    },
    {
      name: "King Abdulaziz University",
      src: "https://upload.wikimedia.org/wikipedia/en/thumb/c/c8/King_Abdulaziz_University_Logo.svg/1200px-King_Abdulaziz_University_Logo.svg.png",
    },
    {
      name: "Prince Mohammad Bin Fahd University",
      src: "https://upload.wikimedia.org/wikipedia/en/c/c8/Prince_Mohammad_bin_Fahd_University_logo.png",
    },
    {
      name: "King Abdullah University of Science and Technology",
      src: "https://upload.wikimedia.org/wikipedia/en/thumb/e/e0/King_Abdullah_University_of_Science_and_Technology_logo.svg/1200px-King_Abdullah_University_of_Science_and_Technology_logo.svg.png",
    },
    {
      name: "Princess Nourah University",
      src: "https://www.pnu.edu.sa/en/PublishingImages/logo.png",
    },
    {
      name: "Imam Abdulrahman Bin Faisal University",
      src: "https://upload.wikimedia.org/wikipedia/commons/6/60/Imam_Abdulrahman_bin_Faisal_University_logo.svg",
    },
    {
      name: "Umm Al-Qura University",
      src: "https://upload.wikimedia.org/wikipedia/en/a/a2/Umm_al-Qura_University_logo.png",
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
