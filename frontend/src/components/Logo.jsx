import React from 'react';

const Logo = ({ size = 'md', showText = true, className = '', inverted = false }) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  return (
    <div className={`flex items-center gap-2.5 group select-none ${className}`}>
      {/* Brand Icon SVG */}
      <div className={`relative ${iconSizes[size] || iconSizes.md} rounded-xl p-1.5 bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 text-white shadow-md shadow-blue-500/20 group-hover:shadow-blue-500/40 group-hover:scale-105 transition-all duration-300 flex items-center justify-center shrink-0`}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full text-white"
        >
          {/* Dynamic Geometric Nexus Shape */}
          <path
            d="M12 2L19.5 6.5V15.5L12 20L4.5 15.5V6.5L12 2Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="opacity-40"
          />
          <path
            d="M12 6L16.5 8.8V13.8L12 16.5L7.5 13.8V8.8L12 6Z"
            fill="currentColor"
            className="opacity-90"
          />
          <path
            d="M12 9L14 10.3V12.7L12 14L10 12.7V10.3L12 9Z"
            fill="#ffffff"
          />
          <circle cx="12" cy="3" r="1.5" fill="#38bdf8" />
          <circle cx="19.5" cy="15.5" r="1.5" fill="#818cf8" />
        </svg>
      </div>

      {/* Brand Wordmark */}
      {showText && (
        <div className="flex items-center font-extrabold tracking-tight">
          <span className={`${inverted ? 'text-white' : 'text-slate-900'} ${textSizes[size] || textSizes.md}`}>
            Quick
          </span>
          <span className={`bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent ${textSizes[size] || textSizes.md}`}>
            blog
          </span>
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-500 ml-0.5 mb-1 group-hover:scale-150 transition-transform"></span>
        </div>
      )}
    </div>
  );
};

export default Logo;

