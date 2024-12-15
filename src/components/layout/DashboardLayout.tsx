import React from 'react';
import { LayoutDashboard, LineChart, BookOpen, Trophy, UserCircle, Settings } from 'lucide-react';
import { LoginButton } from '../auth/LoginButton';
import { UserProfile } from '../auth/UserProfile';
import { ThemeToggle } from '../theme/ThemeToggle';
import { useAuth } from '../../contexts/AuthContext';

interface NavItem {
  icon: React.ReactNode;
  label: string;
  path: string;
}

const navigation: NavItem[] = [
  { icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard', path: '/' },
  { icon: <LineChart className="w-5 h-5" />, label: 'Trading', path: '/trading' },
  { icon: <BookOpen className="w-5 h-5" />, label: 'Learn', path: '/learn' },
  { icon: <Trophy className="w-5 h-5" />, label: 'Leaderboard', path: '/leaderboard' },
  { icon: <UserCircle className="w-5 h-5" />, label: 'Profile', path: '/profile' },
  { icon: <Settings className="w-5 h-5" />, label: 'Settings', path: '/settings' },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
  onNavigate: (page: 'dashboard' | 'settings') => void;
}

export function DashboardLayout({ children, onNavigate }: DashboardLayoutProps) {
  const { user } = useAuth();

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">TradeSimPro</h1>
          <div className="flex items-center space-x-2">
            <ThemeToggle />
          </div>
        </div>
        <UserProfile />
        <nav className="p-4 space-y-1 flex-1">
          {navigation.map((item) => (
            <a
              key={item.path}
              onClick={() => onNavigate(item.path === '/settings' ? 'settings' : 'dashboard')}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-colors"
              style={{ cursor: 'pointer' }}
            >
              {item.icon}
              <span className="ml-3">{item.label}</span>
            </a>
          ))}
          <div className="pt-4 mt-auto border-t border-gray-200 dark:border-gray-700">
            <LoginButton />
          </div>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {!user && (
          <div className="p-4 m-6 text-sm text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-md">
            Please log in to start trading and view your portfolio.
          </div>
        )}
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}