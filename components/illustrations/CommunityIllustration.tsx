import React from 'react';

export const CommunityIllustration: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" {...props}>
    <g opacity="0.8">
      {/* Person 1 */}
      <circle cx="70" cy="80" r="15" fill="#a78bfa" />
      <path d="M 55 130 C 55 100, 85 100, 85 130 Z" fill="#a78bfa" />

      {/* Person 2 Center */}
      <circle cx="100" cy="70" r="20" fill="#7c3aed" />
      <path d="M 80 150 C 80 110, 120 110, 120 150 Z" fill="#7c3aed" />

      {/* Person 3 */}
      <circle cx="130" cy="80" r="15" fill="#a78bfa" />
      <path d="M 115 130 C 115 100, 145 100, 145 130 Z" fill="#a78bfa" />

      {/* Background elements */}
      <circle cx="40" cy="60" r="10" fill="#c4b5fd" opacity="0.7" />
      <circle cx="160" cy="60" r="10" fill="#c4b5fd" opacity="0.7" />
      <rect x="20" y="150" width="160" height="5" rx="2.5" fill="#ddd6fe" />
    </g>
  </svg>
);