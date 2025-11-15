import React from 'react';
import { Page, User } from '../types';
import { CarIcon } from '../components/icons/CarIcon';
import { BusIcon } from '../components/icons/BusIcon';
import { CommunityIcon } from '../components/icons/CommunityIcon';
import { ArrowRightIcon } from '../components/icons/ArrowRightIcon';
import { CityscapeIllustration } from '../components/illustrations/CityscapeIllustration';

interface HomePageProps {
  setCurrentPage: (page: Page) => void;
  user: User;
}

const HomePage: React.FC<HomePageProps> = ({ setCurrentPage, user }) => {
  const menuItems = [
    {
      page: Page.OnDemand,
      title: 'On-Demand',
      description: 'Book a ride instantly, anytime.',
      icon: <CarIcon className="w-8 h-8 text-blue-500" />,
      iconBg: 'bg-blue-100 dark:bg-blue-900/50',
      hoverBorder: 'hover:border-blue-400 dark:hover:border-blue-600',
    },
    {
      page: Page.Buses,
      title: 'Buses',
      description: 'Track buses and view routes.',
      icon: <BusIcon className="w-8 h-8 text-green-500" />,
      iconBg: 'bg-green-100 dark:bg-green-900/50',
      hoverBorder: 'hover:border-green-400 dark:hover:border-green-600',
    },
    {
      page: Page.Community,
      title: 'Community',
      description: 'Join or create daily commute groups.',
      icon: <CommunityIcon className="w-8 h-8 text-purple-500" />,
      iconBg: 'bg-purple-100 dark:bg-purple-900/50',
      hoverBorder: 'hover:border-purple-400 dark:hover:border-purple-600',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FFFBEB] dark:bg-gray-900 p-4 flex flex-col">
      <header className="py-4 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome, {user.name.split(' ')[0]}!</h1>
          <p className="text-gray-600 dark:text-gray-400">Where are you heading today?</p>
        </div>
        <button
          onClick={() => setCurrentPage(Page.Profile)}
          className="p-2 rounded-full bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shadow-sm border border-gray-200 dark:border-gray-700"
          aria-label="View Profile"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </button>
      </header>
      
      <main className="flex-grow flex flex-col justify-center space-y-6 mt-4">
        {menuItems.map((item) => (
          <div
            key={item.title}
            onClick={() => setCurrentPage(item.page)}
            className={`bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md cursor-pointer transition-all transform hover:scale-105 border border-gray-200 dark:border-gray-700 ${item.hoverBorder}`}
          >
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <div className={`p-3 rounded-full ${item.iconBg}`}>
                        {item.icon}
                    </div>
                    <div className="ml-4">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{item.title}</h2>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">{item.description}</p>
                    </div>
                </div>
                <ArrowRightIcon className="w-6 h-6 text-gray-400 dark:text-gray-500" />
            </div>
          </div>
        ))}
      </main>
      <div className="mt-auto pt-4">
        <CityscapeIllustration className="text-gray-300 dark:text-gray-600" />
      </div>
    </div>
  );
};

export default HomePage;