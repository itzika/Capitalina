import React, { useState } from 'react';
import { Position } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { Clock, ArrowUpRight, ArrowDownRight, Loader2 } from 'lucide-react';

interface PositionsListProps {
  positions: Position[];
  onClosePosition: (positionId: string) => void;
}

export function PositionsList({ positions, onClosePosition }: PositionsListProps) {
  const [closingPositions, setClosingPositions] = useState<Set<string>>(new Set());

  const handleClose = async (positionId: string) => {
    if (closingPositions.has(positionId)) return;
    
    setClosingPositions(prev => new Set([...prev, positionId]));
    try {
      await onClosePosition(positionId);
    } finally {
      setClosingPositions(prev => {
        const next = new Set(prev);
        next.delete(positionId);
        return next;
      });
    }
  };

  if (positions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        No open positions
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      {positions.map((position) => (
        <div key={position.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                {position.instrumentId}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">{position.instrumentType}</p>
            </div>
            <button
              onClick={() => handleClose(position.id)}
              disabled={closingPositions.has(position.id)}
              className={`px-3 py-1 text-sm font-medium rounded-md flex items-center ${
                closingPositions.has(position.id)
                  ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
                  : 'text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20'
              }`}
            >
              {closingPositions.has(position.id) ? (
                <>
                  <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                  Closing...
                </>
              ) : (
                'Close'
              )}
            </button>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-500 dark:text-gray-400">Quantity</p>
              <p className="font-medium text-gray-900 dark:text-white">{position.quantity}</p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400">Entry Price</p>
              <p className="font-medium text-gray-900 dark:text-white">{formatCurrency(position.entryPrice)}</p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400">Current Price</p>
              <p className="font-medium text-gray-900 dark:text-white">{formatCurrency(position.currentPrice)}</p>
            </div>
          </div>

          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
              <Clock className="w-4 h-4 mr-1" />
              {new Date(position.openTime).toLocaleString()}
            </div>
            <div className={`flex items-center text-sm font-medium ${
              position.unrealizedPnL >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {position.unrealizedPnL >= 0 ? (
                <ArrowUpRight className="w-4 h-4 mr-1" />
              ) : (
                <ArrowDownRight className="w-4 h-4 mr-1" />
              )}
              {formatCurrency(position.unrealizedPnL)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}