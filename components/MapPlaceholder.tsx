import React from 'react';

/**
 * Renders a static, stylized map illustration as an SVG.
 * This is more reliable than an external image link and supports dark mode.
 */
const MapPlaceholder: React.FC = () => {
  return (
    <div className="relative h-64 w-full bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
      <svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* We need to define paths for the pin icon to reuse */}
        <defs>
          <path id="map-pin-icon" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z"/>
        </defs>

        {/* Background blocks to simulate a city map */}
        <rect x="0" y="0" width="200" height="150" className="fill-gray-50 dark:fill-gray-800" />
        <g className="fill-blue-100 dark:fill-blue-900/50">
            <rect x="50" y="0" width="50" height="50" />
            <rect x="100" y="50" width="50" height="50" />
            <rect x="150" y="100" width="50" height="50" />
        </g>
        <g className="fill-pink-100 dark:fill-pink-900/50">
            <rect x="150" y="0" width="50" height="50" />
            <rect x="0" y="50" width="50" height="50" />
            <rect x="50" y="100" width="50" height="50" />
        </g>
        
        {/* Road grid */}
        <path d="M50 0V150 M100 0V150 M150 0V150 M0 50H200 M0 100H200" className="stroke-white dark:stroke-gray-700" strokeWidth="8"/>
        
        {/* Route path */}
        <path d="M25 25 C 100 25, 100 125, 175 125" className="stroke-yellow-500" strokeWidth="4" fill="none" strokeDasharray="6"/>
        
        {/* Start and End Pins */}
        <g transform="translate(18, 18) scale(0.8)">
            <use href="#map-pin-icon" className="fill-red-500 stroke-white dark:stroke-gray-900" strokeWidth="1"/>
        </g>
        <g transform="translate(168, 118) scale(0.8)">
            <use href="#map-pin-icon" className="fill-red-500 stroke-white dark:stroke-gray-900" strokeWidth="1"/>
        </g>
      </svg>
    </div>
  );
};

export default MapPlaceholder;
