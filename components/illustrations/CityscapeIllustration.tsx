import React from 'react';

export const CityscapeIllustration: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 300 100" xmlns="http://www.w3.org/2000/svg" {...props}>
    <g opacity="0.5" fill="#cbd5e1">
      <path d="M0 100 V 50 L 20 50 V 100 Z" />
      <path d="M25 100 V 40 L 40 40 V 100 Z" />
      <path d="M45 100 V 60 L 75 60 V 100 Z" />
      <path d="M80 100 V 30 L 100 30 V 100 Z" />
      <path d="M105 100 V 70 L 120 70 V 100 Z" />
      <path d="M125 100 V 55 L 155 55 V 100 Z" />
      <path d="M160 100 V 45 L 180 45 V 100 Z" />
      <path d="M185 100 V 65 L 210 65 V 100 Z" />
      <path d="M215 100 V 35 L 240 35 V 100 Z" />
      <path d="M245 100 V 50 L 265 50 V 100 Z" />
      <path d="M270 100 V 60 L 300 60 V 100 Z" />
    </g>
  </svg>
);