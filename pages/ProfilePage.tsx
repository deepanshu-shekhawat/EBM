import React from 'react';
import { Page, User } from '../types';
import Header from '../components/Header';
import { CityscapeIllustration } from '../components/illustrations/CityscapeIllustration';
import { Theme } from '../App';

interface ProfilePageProps {
  user: User;
  setCurrentPage: (page: Page) => void;
  onLogout: () => void;
  theme: Theme;
  toggleTheme: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user, setCurrentPage, onLogout, theme, toggleTheme }) => {
  return (
    <div className="flex flex-col min-h-screen bg-[#FFFBEB] dark:bg-gray-900">
      <Header title="My Profile" onBack={() => setCurrentPage(Page.Home)} />
      <main className="flex-grow p-6 flex flex-col">
        <div className="text-center mb-8">
          <div className="mx-auto bg-yellow-400 rounded-full h-24 w-24 flex items-center justify-center text-4xl font-bold text-white mb-4 shadow-lg">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{user.name}</h2>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg space-y-4 shadow-md border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400 font-medium">Phone Number</span>
            <span className="font-semibold text-gray-800 dark:text-gray-200">{user.phone}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400 font-medium">Date of Birth</span>
            <span className="font-semibold text-gray-800 dark:text-gray-200">{user.dob}</span>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg mt-6 shadow-md border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400 font-medium">Night Mode</span>
                <button
                    onClick={toggleTheme}
                    className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 focus:outline-none ${
                        theme === 'dark' ? 'bg-purple-600' : 'bg-gray-300'
                    }`}
                >
                    <span
                        className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ${
                            theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                        }`}
                    />
                </button>
            </div>
        </div>


        <div className="flex-grow"></div>

        <button
          onClick={onLogout}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 mt-8 shadow-md"
        >
          Logout
        </button>
      </main>
      <div className="px-6 pb-4">
        <CityscapeIllustration className="text-gray-300 dark:text-gray-600" />
      </div>
    </div>
  );
};

export default ProfilePage;