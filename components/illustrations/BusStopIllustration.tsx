import React from 'react';

export const BusStopIllustration: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" {...props}>
    <g opacity="0.8">
      <rect x="10" y="150" width="180" height="10" rx="5" fill="#d1d5db" />
      <path d="M 60 150 L 70 50 L 130 50 L 140 150 Z" fill="#f3f4f6" />
      <rect x="70" y="50" width="60" height="100" fill="#4ade80" />
      <rect x="75" y="60" width="50" height="15" fill="#fff" />
      <rect x="75" y="85" width="50" height="15" fill="#fff" />
      <circle cx="80" cy="145" r="8" fill="#6b7280" />
      <circle cx="120" cy="145" r="8" fill="#6b7280" />
      <path d="M 150 130 H 160 V 90 H 150 Z" fill="#d1d5db" />
      <rect x="145" y="80" width="20" height="10" rx="3" fill="#3b82f6" />
      <text x="155" y="75" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#3b82f6">BUS</text>
    </g>
  </svg>
);