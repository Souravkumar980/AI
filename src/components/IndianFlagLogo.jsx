import React from 'react';

/**
 * IndianFlagLogo Component
 * Supports multiple authentic flag dimensions and assets:
 * - flag-of-india-330.png for crisp lightweight icons, badges & headers
 * - flag-of-india.png (HD 1920px) for hero banners & large modals
 */
export default function IndianFlagLogo({
  size = 'md',
  className = '',
  animated = false,
  flutter = false,
  alt = 'National Flag of India (Tiranga)'
}) {
  const sizeMap = {
    xs: { class: 'w-5 h-3.5', src: '/flag-of-india-330.png' },
    sm: { class: 'w-7 h-5', src: '/flag-of-india-330.png' },
    md: { class: 'w-10 h-7', src: '/flag-of-india-330.png' },
    lg: { class: 'w-16 h-11', src: '/flag-of-india.png' },
    xl: { class: 'w-24 h-16', src: '/flag-of-india.png' },
    hero: { class: 'w-32 h-20 sm:w-40 sm:h-26', src: '/flag-of-india.png' }
  };

  const config = sizeMap[size] || sizeMap.md;
  const dimensionClass = className || config.class;

  return (
    <div
      className={`relative inline-flex items-center justify-center overflow-hidden border-2 border-black rounded shadow-[2px_2px_0px_#000] shrink-0 bg-white ${dimensionClass} ${
        animated ? 'hover:scale-105 transition-transform duration-200' : ''
      } ${flutter ? 'hover:rotate-1' : ''}`}
      title="Tiranga - National Flag of India"
    >
      <img
        src={config.src}
        alt={alt}
        className="w-full h-full object-cover select-none pointer-events-none"
        loading="eager"
      />
    </div>
  );
}
