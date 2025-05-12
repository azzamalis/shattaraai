import React, { useRef } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
const UseCases = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: -250,
        behavior: 'smooth'
      });
    }
  };
  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: 250,
        behavior: 'smooth'
      });
    }
  };
  const useCases = [{
    image: '/placeholder.svg',
    title: 'University Students',
    subtitle: 'Ace your exams with AI-enhanced study tools'
  }, {
    image: '/placeholder.svg',
    title: 'High School Prep',
    subtitle: 'Build strong foundations for academic success'
  }, {
    image: '/placeholder.svg',
    title: 'Language Learning',
    subtitle: 'Master vocabulary and grammar effortlessly'
  }, {
    image: '/placeholder.svg',
    title: 'Professional Certifications',
    subtitle: 'Prepare for industry exams and advance your career'
  }, {
    image: '/placeholder.svg',
    title: 'Continuous Learning',
    subtitle: 'Stay sharp with lifelong educational support'
  }, {
    image: '/placeholder.svg',
    title: 'Research Support',
    subtitle: 'Organize and study complex research materials'
  }];
  return;
};
export default UseCases;