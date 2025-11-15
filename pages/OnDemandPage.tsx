import React from 'react';
import { Page } from '../types';
import Header from '../components/Header';
import { ArrowRightIcon } from '../components/icons/ArrowRightIcon';
import { OnDemandIllustration } from '../components/illustrations/OnDemandIllustration';

interface OnDemandPageProps {
  setCurrentPage: (page: Page) => void;
}

const OnDemandPage: React.FC<OnDemandPageProps> = ({ setCurrentPage }) => {
  return (
    <div className="flex flex-col min-h-screen bg-[#FFFBEB] dark:bg-gray-900">
      <Header title="On-Demand Ride" onBack={() => setCurrentPage(Page.Home)} />
      <main className="flex-grow p-6 flex flex-col justify-center items-center space-y-8">
        <OnDemandIllustration className="w-full max-w-xs h-auto" />
        <h2 className="text-2xl font-semibold text-center text-gray-800 dark:text-gray-200">What would you like to do?</h2>
        
        <div
          onClick={() => setCurrentPage(Page.RideGiver)}
          className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg cursor-pointer transition-all transform hover:scale-105 hover:bg-gray-50 dark:hover:bg-gray-700/50 border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500"
        >
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400">Become a Ride Giver</h3>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Offer a ride and earn.</p>
            </div>
            <ArrowRightIcon className="w-8 h-8 text-gray-400 dark:text-gray-500" />
          </div>
        </div>

        <div
          onClick={() => setCurrentPage(Page.RideTaker)}
          className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg cursor-pointer transition-all transform hover:scale-105 hover:bg-gray-50 dark:hover:bg-gray-700/50 border border-gray-200 dark:border-gray-700 hover:border-green-500 dark:hover:border-green-500"
        >
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-2xl font-bold text-green-600 dark:text-green-400">Become a Ride Taker</h3>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Find a ride to your destination.</p>
            </div>
            <ArrowRightIcon className="w-8 h-8 text-gray-400 dark:text-gray-500" />
          </div>
        </div>
      </main>
    </div>
  );
};

export default OnDemandPage;