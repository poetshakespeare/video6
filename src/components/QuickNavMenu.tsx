import React, { useState, useEffect } from 'react';
import { Menu, X, Home, Clapperboard, Monitor, Sparkles, Library, Radio, CheckCircle2, Flame } from 'lucide-react';

interface Section {
  id: string;
  name: string;
  icon: React.ReactNode;
}

export function QuickNavMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);

  const sections: Section[] = [
    { id: 'hero', name: 'Inicio', icon: <Home className="h-4 w-4" /> },
    { id: 'trending', name: 'Tendencias', icon: <Flame className="h-4 w-4" /> },
    { id: 'novelas-live', name: 'Novelas en Vivo', icon: <Radio className="h-4 w-4" /> },
    { id: 'novelas-finished', name: 'Novelas Finalizadas', icon: <CheckCircle2 className="h-4 w-4" /> },
    { id: 'movies', name: 'Películas', icon: <Clapperboard className="h-4 w-4" /> },
    { id: 'tv-shows', name: 'Series', icon: <Monitor className="h-4 w-4" /> },
    { id: 'anime', name: 'Anime', icon: <Sparkles className="h-4 w-4" /> },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;

      let currentIndex = 0;
      sections.forEach((section, index) => {
        const element = document.getElementById(section.id);
        if (element && scrollPosition >= element.offsetTop) {
          currentIndex = index;
        }
      });
      setCurrentSectionIndex(currentIndex);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setIsOpen(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsOpen(false);
  };

  return (
    <>
      {/* Toggle Button - Responsive positioning */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed left-4 top-24 z-50 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 md:p-4"
        aria-label="Toggle navigation menu"
      >
        {isOpen ? <X className="h-5 w-5 md:h-6 md:w-6" /> : <Menu className="h-5 w-5 md:h-6 md:w-6" />}
      </button>

      {/* Navigation Menu */}
      {isOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/30 z-40 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu Panel - Responsive */}
          <div className="fixed left-4 top-40 z-50 bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-left duration-300 w-[calc(100vw-2rem)] max-w-xs sm:w-80 md:max-w-sm">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 md:p-5">
              <h3 className="text-white font-bold text-base md:text-lg flex items-center">
                <Library className="h-5 w-5 md:h-6 md:w-6 mr-2" />
                Navegación Rápida
              </h3>
              <p className="text-white/80 text-xs md:text-sm mt-1">Salta a cualquier sección</p>
            </div>

            <div className="max-h-[60vh] md:max-h-96 overflow-y-auto">
              {sections.map((section, index) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`w-full px-4 md:px-5 py-3 md:py-4 flex items-center space-x-3 md:space-x-4 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-colors border-b border-gray-100 last:border-b-0 text-left group ${
                    currentSectionIndex === index ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 md:p-2.5 rounded-lg text-white group-hover:scale-110 transition-transform flex-shrink-0">
                    {section.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="font-medium text-sm md:text-base text-gray-700 group-hover:text-blue-600 transition-colors block truncate">
                      {section.name}
                    </span>
                    {currentSectionIndex === index && (
                      <span className="text-xs text-blue-500 font-medium">Actual</span>
                    )}
                  </div>
                </button>
              ))}
            </div>

            <div className="p-3 md:p-4 bg-gray-50 border-t border-gray-200">
              <button
                onClick={scrollToTop}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-2.5 md:py-3 px-4 rounded-lg font-medium text-sm md:text-base transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
              >
                <Home className="h-4 w-4 md:h-5 md:w-5 mr-2" />
                Ir al Inicio
              </button>
            </div>
          </div>
        </>
      )}

    </>
  );
}
