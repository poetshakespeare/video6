import React, { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

export function ContentArrows() {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [showArrows, setShowArrows] = useState(false);

  const sections = [
    'hero',
    'trending',
    'novelas-live',
    'novelas-finished',
    'movies',
    'tv-shows',
    'anime'
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      setShowArrows(window.scrollY > 300);

      let currentIndex = 0;
      sections.forEach((sectionId, index) => {
        const element = document.getElementById(sectionId);
        if (element && scrollPosition >= element.offsetTop) {
          currentIndex = index;
        }
      });
      setCurrentSectionIndex(currentIndex);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigateToSection = (direction: 'up' | 'down') => {
    const newIndex = direction === 'up'
      ? Math.max(0, currentSectionIndex - 1)
      : Math.min(sections.length - 1, currentSectionIndex + 1);

    const sectionId = sections[newIndex];
    const element = document.getElementById(sectionId);

    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  if (!showArrows) return null;

  return (
    <div className="fixed right-4 bottom-20 z-40 flex flex-col space-y-2">
      {/* Up Arrow */}
      <button
        onClick={() => navigateToSection('up')}
        disabled={currentSectionIndex === 0}
        className={`p-3 rounded-full shadow-lg transition-all duration-300 ${
          currentSectionIndex === 0
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-xl hover:scale-110'
        }`}
        aria-label="Sección anterior"
      >
        <ChevronUp className="h-5 w-5" />
      </button>

      {/* Section indicator */}
      <div className="bg-white rounded-full px-3 py-2 shadow-lg text-xs font-bold text-gray-700 text-center">
        {currentSectionIndex + 1}/{sections.length}
      </div>

      {/* Down Arrow */}
      <button
        onClick={() => navigateToSection('down')}
        disabled={currentSectionIndex === sections.length - 1}
        className={`p-3 rounded-full shadow-lg transition-all duration-300 ${
          currentSectionIndex === sections.length - 1
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-xl hover:scale-110'
        }`}
        aria-label="Siguiente sección"
      >
        <ChevronDown className="h-5 w-5" />
      </button>
    </div>
  );
}
