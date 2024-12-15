import React from 'react';

interface OrderBookEntry {
  price: number;
  quantity: number;
  total: number;
}

interface OrderBookProps {
  bids: OrderBookEntry[];
  asks: OrderBookEntry[];
}

export function OrderBook({ bids, asks }: OrderBookProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Order Book</h2>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-3 gap-4 text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
          <div>Price</div>
          <div className="text-right">Amount</div>
          <div className="text-right">Total</div>
        </div>
        
        {/* Asks (Sell Orders) */}
        <div className="space-y-1 mb-4">
          {asks.map((ask, index) => (
            <div key={index} className="grid grid-cols-3 gap-4 text-sm">
              <div className="text-red-600">${ask.price.toFixed(2)}</div>
              <div className="text-right">{ask.quantity.toFixed(4)}</div>
              <div className="text-right">{ask.total.toFixed(2)}</div>
            </div>
          ))}
        </div>

        {/* Spread */}
        <div className="text-center text-sm text-gray-500 dark:text-gray-400 my-2">
          Spread: ${((asks[0]?.price || 0) - (bids[0]?.price || 0)).toFixed(2)}
        </div>

        {/* Bids (Buy Orders) */}
        <div className="space-y-1">
          {bids.map((bid, index) => (
            <div key={index} className="grid grid-cols-3 gap-4 text-sm">
              <div className="text-green-600">${bid.price.toFixed(2)}</div>
              <div className="text-right">{bid.quantity.toFixed(4)}</div>
              <div className="text-right">{bid.total.toFixed(2)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}