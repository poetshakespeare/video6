import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ScrollableSectionProps {
  children: React.ReactNode;
  id?: string;
}

export function ScrollableSection({ children, id }: ScrollableSectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);

  const checkScrollButtons = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    checkScrollButtons();
    window.addEventListener('resize', checkScrollButtons);
    return () => window.removeEventListener('resize', checkScrollButtons);
  }, [children]);

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (!container || isScrolling) return;

    setIsScrolling(true);
    const scrollAmount = container.clientWidth * 0.8;
    const targetScroll = direction === 'left'
      ? container.scrollLeft - scrollAmount
      : container.scrollLeft + scrollAmount;

    container.scrollTo({
      left: targetScroll,
      behavior: 'smooth'
    });

    setTimeout(() => {
      setIsScrolling(false);
      checkScrollButtons();
    }, 500);
  };

  return (
    <div id={id} className="relative group">
      {showLeftArrow && (
        <button
          onClick={() => scroll('left')}
          disabled={isScrolling}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white/95 backdrop-blur-sm hover:bg-white shadow-2xl text-gray-800 p-3 rounded-full transition-all duration-300 hover:scale-110 z-30 opacity-0 group-hover:opacity-100 disabled:opacity-50"
          style={{ marginLeft: '-20px' }}
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
      )}

      <div
        ref={scrollContainerRef}
        onScroll={checkScrollButtons}
        className="overflow-x-auto scrollbar-hide scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <div className="flex space-x-6 pb-4">
          {children}
        </div>
      </div>

      {showRightArrow && (
        <button
          onClick={() => scroll('right')}
          disabled={isScrolling}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white/95 backdrop-blur-sm hover:bg-white shadow-2xl text-gray-800 p-3 rounded-full transition-all duration-300 hover:scale-110 z-30 opacity-0 group-hover:opacity-100 disabled:opacity-50"
          style={{ marginRight: '-20px' }}
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      )}

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
