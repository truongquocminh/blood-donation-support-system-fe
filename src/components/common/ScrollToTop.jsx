import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const { isDark } = useTheme();

  useEffect(() => {
    const toggleVisibility = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      
      setScrollProgress(scrollPercent);
      setIsVisible(scrollTop > 300);
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 group">
      <div className="relative">
        <svg
          className="w-12 h-12 transform -rotate-90"
          viewBox="0 0 36 36"
        >
          <path
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke={isDark ? 'rgb(55, 65, 81)' : 'rgb(229, 231, 235)'}
            strokeWidth="2"
          />
          <path
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="2"
            strokeDasharray={`${scrollProgress}, 100`}
            strokeLinecap="round"
            className="transition-all duration-300 ease-out"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="50%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#EC4899" />
            </linearGradient>
          </defs>
        </svg>
        
        <button
          onClick={scrollToTop}
          className={`
            absolute inset-0 w-12 h-12 rounded-full
            flex items-center justify-center
            shadow-lg transition-all duration-300 ease-out
            transform hover:scale-110 active:scale-95
            ${isDark 
              ? 'bg-gray-800 hover:bg-gray-700 text-white shadow-gray-900/30' 
              : 'bg-white hover:bg-gray-50 text-gray-700 shadow-gray-900/10'
            }
            group-hover:shadow-xl
          `}
          aria-label="Scroll to top"
        >
          <ChevronUp 
            size={20} 
            className="transition-transform duration-300 group-hover:-translate-y-0.5" 
          />
        </button>
      </div>
      
      <div className={`
        absolute right-full mr-3 top-1/2 -translate-y-1/2
        px-3 py-1 rounded-lg text-sm font-medium
        opacity-0 group-hover:opacity-100
        transition-all duration-300 ease-out
        transform translate-x-2 group-hover:translate-x-0
        pointer-events-none whitespace-nowrap
        ${isDark 
          ? 'bg-gray-700 text-white shadow-gray-900/30 border border-gray-600' 
          : 'bg-gray-900 text-white shadow-lg'
        }
      `}>
        Scroll to top
        <div className={`
          absolute left-full top-1/2 -translate-y-1/2
          w-0 h-0 border-l-4 border-y-4 border-y-transparent
          ${isDark ? 'border-l-gray-700' : 'border-l-gray-900'}
        `} />
      </div>
    </div>
  );
};

export default ScrollToTop;