import React from 'react';
import { User, DollarSign, TrendingUp, Trophy } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { formatCurrency } from '../../utils/formatters';

export function UserProfile() {
  const { user, profile } = useAuth();

  if (!user) return null;

  return (
    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center mb-3">
        <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
          <User className="w-4 h-4 text-blue-600" />
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-gray-900 dark:text-white">{user.email}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Trader</p>
        </div>
      </div>
      
      {profile && (
        <div className="space-y-2">
          <div className="flex items-center text-sm">
            <DollarSign className="w-4 h-4 mr-2 text-green-600" />
            <span className="text-gray-500 dark:text-gray-400">Balance:</span>
            <span className="ml-auto font-medium text-gray-900 dark:text-white">
              {formatCurrency(profile.balance || 0)}
            </span>
          </div>
          <div className="flex items-center text-sm">
            <TrendingUp className="w-4 h-4 mr-2 text-blue-600" />
            <span className="text-gray-500 dark:text-gray-400">Total P&L:</span>
            <span className={`ml-auto font-medium ${
              (profile.totalPnL || 0) >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {formatCurrency(profile.totalPnL || 0)}
            </span>
          </div>
          <div className="flex items-center text-sm">
            <Trophy className="w-4 h-4 mr-2 text-purple-600" />
            <span className="text-gray-500 dark:text-gray-400">Win Rate:</span>
            <span className="ml-auto font-medium text-gray-900 dark:text-white">
              {((profile.winRate || 0).toFixed(1))}%
            </span>
          </div>
        </div>
      )}
    </div>
  );
}