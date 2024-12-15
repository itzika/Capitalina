import React from 'react';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { PortfolioSummary } from './components/dashboard/PortfolioSummary';
import { TradingPage } from './pages/TradingPage';
import { SettingsPage } from './pages/SettingsPage';
import { useAuth } from './contexts/AuthContext';
import { useState } from 'react';

function App() {
  const { profile } = useAuth();
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'settings'>('dashboard');
  
  const portfolioData = profile ? {
    balance: profile.balance,
    dailyPnL: profile.daily_pnl || 0,
    totalPnL: profile.total_pnl,
    winRate: profile.win_rate,
  } : null;

  return (
    <DashboardLayout onNavigate={setCurrentPage}>
      <div className="space-y-6 text-gray-900 dark:text-gray-100">
        {currentPage === 'dashboard' ? (
          <>
            <div>
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Welcome back! Here's an overview of your trading performance.
              </p>
            </div>
            
            {portfolioData && <PortfolioSummary {...portfolioData} />}
            <TradingPage />
          </>
        ) : (
          <SettingsPage />
        )}
      </div>
    </DashboardLayout>
  );
}

export default App;
