import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Percent } from 'lucide-react';

interface PortfolioSummaryProps {
  balance: number;
  dailyPnL: number;
  totalPnL: number;
  winRate: number;
}

export function PortfolioSummary({ balance, dailyPnL, totalPnL, winRate }: PortfolioSummaryProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* Account Balance */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <div className="p-2 bg-blue-50 rounded-full">
            <DollarSign className="w-6 h-6 text-blue-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Account Balance</p>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              ${balance.toLocaleString()}
            </h3>
          </div>
        </div>
      </div>

      {/* Daily P&L */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <div className={`p-2 rounded-full ${dailyPnL >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
            {dailyPnL >= 0 ? (
              <TrendingUp className="w-6 h-6 text-green-600" />
            ) : (
              <TrendingDown className="w-6 h-6 text-red-600" />
            )}
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Daily P&L</p>
            <h3 className={`text-xl font-semibold ${
              dailyPnL >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {dailyPnL >= 0 ? '+' : ''}{dailyPnL.toLocaleString()}
            </h3>
          </div>
        </div>
      </div>

      {/* Total P&L */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <div className={`p-2 rounded-full ${totalPnL >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
            {totalPnL >= 0 ? (
              <TrendingUp className="w-6 h-6 text-green-600" />
            ) : (
              <TrendingDown className="w-6 h-6 text-red-600" />
            )}
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total P&L</p>
            <h3 className={`text-xl font-semibold ${
              totalPnL >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {totalPnL >= 0 ? '+' : ''}{totalPnL.toLocaleString()}
            </h3>
          </div>
        </div>
      </div>

      {/* Win Rate */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <div className="p-2 bg-purple-50 rounded-full">
            <Percent className="w-6 h-6 text-purple-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Win Rate</p>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {winRate.toFixed(1)}%
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}