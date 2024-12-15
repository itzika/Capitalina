import React, { useState } from 'react';
import { TradingChart } from '../components/trading/TradingChart';
import { OrderForm } from '../components/trading/OrderForm';
import { MarketOverview } from '../components/trading/MarketOverview';
import { OrderBook } from '../components/trading/OrderBook';
import { useMarketData, useAllMarketData } from '../hooks/useMarketData';
import { usePositions } from '../hooks/usePositions';
import { useTradeHistory } from '../hooks/useTradeHistory';
import { PositionsList } from '../components/trading/PositionsList';
import { TradeHistory } from '../components/trading/TradeHistory';
import { AVAILABLE_SYMBOLS, MOCK_ORDER_BOOK } from '../constants/market';
import { useAuth } from '../contexts/AuthContext';
import { closePosition } from '../services/position/closePosition';

const DEFAULT_SYMBOL = 'BTC/USD';

export function TradingPage() {
  const [selectedSymbol, setSelectedSymbol] = useState(DEFAULT_SYMBOL);
  const { refreshProfile } = useAuth();
  const { positions, loading: positionsLoading, refresh: refreshPositions } = usePositions();
  const { trades, loading: tradesLoading } = useTradeHistory();
  const { data: markets, loading: marketsLoading } = useAllMarketData(Object.values(AVAILABLE_SYMBOLS).flat());
  const { data: selectedMarketData, loading, error } = useMarketData(selectedSymbol);

  const handleMarketSelect = (symbol: string) => {
    setSelectedSymbol(symbol);
  };

  const handleClosePosition = async (positionId: string) => {
    try {
      const result = await closePosition(positionId);
      if (!result.success) {
        throw new Error(result.message || 'Failed to close position');
      }
      
      // Refresh both positions and profile
      refreshPositions();
      await refreshProfile();
    } catch (error) {
      console.error('Failed to close position:', error);
      throw error;
    }
  };

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-2">
        <MarketOverview
          markets={markets}
          onSelect={handleMarketSelect}
          selectedSymbol={selectedSymbol}
        />
      </div>

      <div className="col-span-7 space-y-6">
        <TradingChart
          symbol={selectedSymbol}
          data={selectedMarketData}
          loading={loading}
          error={error}
          interval="1h"
        />
        <OrderForm symbol={selectedSymbol} />
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Open Positions
            </h2>
          </div>
          <PositionsList
            positions={positions}
            onClosePosition={handleClosePosition}
          />
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Trade History
            </h2>
          </div>
          <TradeHistory trades={trades} />
        </div>
      </div>

      <div className="col-span-3">
        <OrderBook
          bids={MOCK_ORDER_BOOK.bids}
          asks={MOCK_ORDER_BOOK.asks}
        />
      </div>
    </div>
  );
}