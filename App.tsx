import React, { useState, useCallback, useEffect } from 'react';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import OnDemandPage from './pages/OnDemandPage';
import BusesPage from './pages/BusesPage';
import CommunityPage from './pages/CommunityPage';
import RideGiverPage from './pages/RideGiverPage';
import RideTakerPage from './pages/RideTakerPage';
import ProfilePage from './pages/ProfilePage';
import { Page, User } from './types';

export type Theme = 'light' | 'dark';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const isLoggedIn = !!user;
  const [currentPage, setCurrentPage] = useState<Page>(Page.Login);
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  }, []);

  const handleLogin = useCallback((userDetails: User) => {
    setUser(userDetails);
    setCurrentPage(Page.Home);
  }, []);

  const handleLogout = useCallback(() => {
    setUser(null);
    setCurrentPage(Page.Login);
  }, []);

  const renderPage = () => {
    if (!isLoggedIn || !user) {
      return <LoginPage onLogin={handleLogin} />;
    }

    const pageProps = {
      setCurrentPage,
      theme,
    };

    switch (currentPage) {
      case Page.Home:
        return <HomePage {...pageProps} user={user} />;
      case Page.OnDemand:
        return <OnDemandPage {...pageProps} />;
      case Page.Buses:
        return <BusesPage {...pageProps} />;
      case Page.Community:
        return <CommunityPage {...pageProps} />;
      case Page.RideGiver:
        return <RideGiverPage {...pageProps} />;
      case Page.RideTaker:
        return <RideTakerPage {...pageProps} />;
      case Page.Profile:
        return <ProfilePage {...pageProps} user={user} onLogout={handleLogout} toggleTheme={toggleTheme} />;
      default:
        return <HomePage {...pageProps} user={user} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFBEB] text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <div className="container mx-auto max-w-lg p-0">
        {renderPage()}
      </div>
    </div>
  );
};

export default App;