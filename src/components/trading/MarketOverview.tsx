import React from 'react';
import { useState } from 'react';
import { TrendingUp, TrendingDown, ChevronRight, Loader2 } from 'lucide-react';
import { MarketData } from '../../types';
import { formatCurrency, formatPercentage, formatVolume } from '../../utils/formatters';
import { AVAILABLE_SYMBOLS, MOCK_MARKET_DATA } from '../../constants/market';

interface MarketOverviewProps {
  markets: MarketData[];
  loading?: boolean;
  error?: Error | null;
  onSelect: (symbol: string) => void;
  selectedSymbol: string;
}

const CATEGORIES = {
  CRYPTO: '🔷 Crypto',
  FOREX: '💱 Forex',
  STOCKS: '📈 Stocks',
  COMMODITIES: '🏭 Commodities',
} as const;

export function MarketOverview({ markets, loading, error, onSelect, selectedSymbol }: MarketOverviewProps) {
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof AVAILABLE_SYMBOLS>('CRYPTO');
  const [showMarkets, setShowMarkets] = useState(true);

  const availableSymbols = AVAILABLE_SYMBOLS[selectedCategory];
  const marketList = availableSymbols.map(symbol => {
    const marketData = markets.find(m => m.symbol === symbol);
    const mockData = MOCK_MARKET_DATA[symbol];
    
    return {
      symbol,
      type: mockData.type,
      currentPrice: marketData?.currentPrice ?? mockData.basePrice,
      change: marketData?.change ?? 0,
      volume: marketData?.volume ?? 0,
    };
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Market Overview</h2>
      </div>

      {/* Category Selector */}
      <div className="p-2 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col space-y-1">
          {(Object.keys(CATEGORIES) as Array<keyof typeof CATEGORIES>).map((category) => (
            <button
              key={category}
              onClick={() => {
                setSelectedCategory(category);
                setShowMarkets(true);
              }}
              className={`px-3 py-2 text-sm font-medium rounded-md text-left transition-colors flex items-center justify-between ${
                selectedCategory === category
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <span>{CATEGORIES[category]}</span>
              {selectedCategory === category && <ChevronRight className="w-4 h-4" />}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="p-4 text-sm text-red-600 dark:text-red-400">
          Failed to load market data. Using simulated data.
        </div>
      )}

      {loading ? (
        <div className="p-8 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        </div>
      ) : showMarkets && (
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {marketList.map((item) => (
          <button
            key={item.symbol}
            onClick={() => onSelect(item.symbol)}
            className={`w-full p-4 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-between text-left ${
              selectedSymbol === item.symbol ? 'bg-blue-50 dark:bg-blue-900/20' : ''
            }`}
          >
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">{item.symbol}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">{item.type}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {formatCurrency(item.currentPrice)}
              </p>
              <div className="flex items-center space-x-1">
                {item.change >= 0 ? (
                  <TrendingUp className="w-3 h-3 text-green-600" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-red-600" />
                )}
                <span
                  className={`text-xs font-medium ${
                    item.change >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {formatPercentage(item.change)}
                </span>
                <span className="text-xs text-gray-500">
                  {formatVolume(item.volume)}
                </span>
              </div>
            </div>
          </button>
        ))}
        </div>
      )}
    </div>
  );
}