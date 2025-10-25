import React, { useState } from 'react';
import { Navigation } from './components/Navigation';
import { LandingPage } from './components/LandingPage';
import { ExploreMonasteries } from './components/ExploreMonasteries';
import { MonasteryDetail } from './components/MonasteryDetail';
import { FestivalsEvents } from './components/FestivalsEvents';
import { CoLiving } from './components/CoLiving';
import { PreservationVault } from './components/PreservationVault';
import { LocalEconomy } from './components/LocalEconomy';
import { LoginSignup } from './components/LoginSignup';
import { AdminDashboard } from './components/AdminDashboard';
import { ChatBot } from './components/ChatBot';

export type Page = 'home' | 'explore' | 'monastery' | 'festivals' | 'community' | 'vault' | 'economy' | 'auth' | 'admin';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedMonastery, setSelectedMonastery] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string; role: 'user' | 'admin' } | null>(null);

  const navigateTo = (page: Page, monasteryId?: string) => {
    setCurrentPage(page);
    if (monasteryId) {
      setSelectedMonastery(monasteryId);
    }
  };

  const handleLogin = (userData: { name: string; email: string; role: 'user' | 'admin' }) => {
    setIsAuthenticated(true);
    setUser(userData);
    setCurrentPage('home');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setCurrentPage('home');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <LandingPage onNavigate={navigateTo} />;
      case 'explore':
        return <ExploreMonasteries onNavigate={navigateTo} />;
      case 'monastery':
        return <MonasteryDetail monasteryId={selectedMonastery} onNavigate={navigateTo} />;
      case 'festivals':
        return <FestivalsEvents onNavigate={navigateTo} />;
      case 'community':
        return <CoLiving onNavigate={navigateTo} />;
      case 'vault':
        return <PreservationVault onNavigate={navigateTo} />;
      case 'economy':
        return <LocalEconomy onNavigate={navigateTo} />;
      case 'auth':
        return <LoginSignup onNavigate={navigateTo} onLogin={handleLogin} />;
      case 'admin':
        return user?.role === 'admin' ? <AdminDashboard onNavigate={navigateTo} /> : <LandingPage onNavigate={navigateTo} />;
      default:
        return <LandingPage onNavigate={navigateTo} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation 
        currentPage={currentPage} 
        onNavigate={navigateTo} 
        isAuthenticated={isAuthenticated}
        user={user}
        onLogout={handleLogout}
      />
      {renderPage()}
      <ChatBot />
    </div>
  );
}