import React, { useState, useEffect } from 'react';
import { ChevronDown, Flame, Radio, CheckCircle2, Clapperboard, Monitor, Sparkles } from 'lucide-react';

interface Section {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
}

export function SectionNavigator() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const sections: Section[] = [
    { id: 'trending', label: 'En Tendencia', icon: <Flame className="h-4 w-4" />, color: 'from-red-500 to-pink-500' },
    { id: 'novelas-live', label: 'Novelas en Transmisión', icon: <Radio className="h-4 w-4" />, color: 'from-red-500 to-pink-500' },
    { id: 'novelas-finished', label: 'Novelas Finalizadas', icon: <CheckCircle2 className="h-4 w-4" />, color: 'from-green-500 to-emerald-500' },
    { id: 'movies', label: 'Películas Destacadas', icon: <Clapperboard className="h-4 w-4" />, color: 'from-blue-500 to-cyan-500' },
    { id: 'tv-shows', label: 'Series Destacadas', icon: <Monitor className="h-4 w-4" />, color: 'from-purple-500 to-indigo-500' },
    { id: 'anime', label: 'Anime Destacado', icon: <Sparkles className="h-4 w-4" />, color: 'from-pink-500 to-rose-500' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsVisible(scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setIsOpen(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
      <div className={`transition-all duration-300 ${isOpen ? 'mb-4' : ''}`}>
        {isOpen && (
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-3 mb-4 animate-fadeIn">
            <div className="grid grid-cols-2 gap-2 max-w-md">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-xl bg-gradient-to-r ${section.color} text-white hover:shadow-lg transition-all duration-300 transform hover:scale-105 text-sm font-medium`}
                >
                  {section.icon}
                  <span className="truncate">{section.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 flex items-center space-x-2 font-semibold ${
          isOpen ? 'rotate-180' : ''
        }`}
      >
        <span className="text-sm">Ir a Sección</span>
        <ChevronDown className={`h-5 w-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
    </div>
  );
}
