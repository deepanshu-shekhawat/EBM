import React from 'react';

export const OnDemandIllustration: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 250 150" xmlns="http://www.w3.org/2000/svg" {...props}>
    <g>
      {/* Car */}
      <path d="M 20 100 L 40 70 H 130 L 150 100 V 120 H 140 A 10 10 0 0 0 120 120 H 50 A 10 10 0 0 0 30 120 H 20 Z" fill="#facc15" />
      <path d="M 45 70 L 65 50 H 105 L 125 70 Z" fill="#60a5fa" />
      <circle cx="40" cy="120" r="10" fill="#4b5563" />
      <circle cx="130" cy="120" r="10" fill="#4b5563" />
      
      {/* Person */}
      <circle cx="180" cy="75" r="15" fill="#60a5fa" />
      <rect x="170" y="90" width="20" height="40" rx="10" fill="#60a5fa" />
      
      {/* Background path */}
      <path d="M 10 130 Q 125 -20 240 130" stroke="#d1d5db" strokeWidth="4" fill="none" strokeDasharray="8 8" />
    </g>
  </svg>
);