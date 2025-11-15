
import React from 'react';
import { Page } from '../types';

interface HeaderProps {
  title: string;
  onBack: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, onBack }) => {
  return (
    <header className="bg-white dark:bg-gray-800 p-4 flex items-center sticky top-0 z-10 shadow-md dark:shadow-black/20">
      <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-800 dark:text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <h1 className="text-xl font-bold ml-4 text-gray-800 dark:text-gray-200">{title}</h1>
    </header>
  );
};

export default Header;