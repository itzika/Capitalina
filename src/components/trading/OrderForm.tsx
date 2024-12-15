import React, { useState } from 'react';
import { OrderType } from '../../types';
import { placeOrder } from '../../services/orderService';
import { useAuth } from '../../contexts/AuthContext';
import { formatCurrency } from '../../utils/formatters';
import { useMarketData } from '../../hooks/useMarketData';

interface OrderFormProps {
  symbol: string;
  onSubmit?: (order: {
    type: OrderType;
    side: 'BUY' | 'SELL';
    quantity: number;
    price?: number;
  }) => void;
}

export function OrderForm({ symbol }: OrderFormProps) {
  const { user, profile, refreshProfile } = useAuth();
  const { data } = useMarketData(symbol);
  const [orderType, setOrderType] = useState<OrderType>('MARKET');
  const [side, setSide] = useState<'BUY' | 'SELL'>('BUY');
  const [quantity, setQuantity] = useState<string>('');
  const [positionSizeType, setPositionSizeType] = useState<'fixed' | 'percentage' | 'risk'>('fixed');
  const [riskPercentage, setRiskPercentage] = useState<string>('1');
  const [stopLoss, setStopLoss] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!user) {
      setError('Please sign in to place orders');
      setLoading(false);
      return;
    }
    
    try {
      const order = await placeOrder({
        userId: user.id,
        symbol,
        type: orderType,
        side,
        quantity: calculateFinalQuantity(),
        ...(orderType !== 'MARKET' && { price: Number(price) }),
        stopLoss: stopLoss ? Number(stopLoss) : undefined,
      });
      
      // Reset form
      setQuantity('');
      setPrice('');
      
      // Refresh both profile and positions
      await refreshProfile();
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };
  
  const calculateFinalQuantity = () => {
    if (!profile) return Number(quantity);

    switch (positionSizeType) {
      case 'percentage':
        return (profile.balance * Number(quantity)) / 100;
      case 'risk':
        if (!stopLoss) return Number(quantity);
        const riskAmount = profile.balance * (Number(riskPercentage) / 100);
        const pricePerUnit = Math.abs(Number(price || data?.currentPrice) - Number(stopLoss));
        return riskAmount / pricePerUnit;
      default:
        return Number(quantity);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 relative">
      {loading && (
        <div className="absolute inset-0 bg-white dark:bg-gray-800 bg-opacity-75 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100"></div>
        </div>
      )}
      
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Place Order - {symbol}</h3>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md">
          {error}
        </div>
      )}
      
      {/* Order Type Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Order Type</label>
        <select
          value={orderType}
          onChange={(e) => setOrderType(e.target.value as OrderType)}
          className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="MARKET">Market</option>
          <option value="LIMIT">Limit</option>
          <option value="STOP">Stop</option>
          <option value="STOP_LIMIT">Stop Limit</option>
        </select>
      </div>

      {/* Position Size Type Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Position Size Type
        </label>
        <select
          value={positionSizeType}
          onChange={(e) => setPositionSizeType(e.target.value as typeof positionSizeType)}
          className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="fixed">Fixed Size</option>
          <option value="percentage">Account Percentage</option>
          <option value="risk">Risk-Based</option>
        </select>
      </div>

      {/* Buy/Sell Toggle */}
      <div className="mb-4">
        <div className="flex rounded-md shadow-sm">
          <button
            type="button"
            onClick={() => setSide('BUY')}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-l-md focus:outline-none ${
              side === 'BUY'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Buy
          </button>
          <button
            type="button"
            onClick={() => setSide('SELL')}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-r-md focus:outline-none ${
              side === 'SELL'
                ? 'bg-red-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Sell
          </button>
        </div>
      </div>

      {/* Quantity Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {positionSizeType === 'percentage' ? 'Account Percentage' : 'Quantity'}
          {positionSizeType === 'percentage' && (
            <span className="text-xs text-gray-500 ml-2">
              ({formatCurrency((profile?.balance || 0) * (Number(quantity) / 100))})
            </span>
          )}
        </label>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          min="0"
          step={positionSizeType === 'percentage' ? '0.1' : '1'}
          max={positionSizeType === 'percentage' ? '100' : undefined}
          required
        />
      </div>

      {/* Risk Percentage Input */}
      {positionSizeType === 'risk' && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Risk Percentage
            <span className="text-xs text-gray-500 ml-2">
              ({formatCurrency((profile?.balance || 0) * (Number(riskPercentage) / 100))})
            </span>
          </label>
          <input
            type="number"
            value={riskPercentage}
            onChange={(e) => setRiskPercentage(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="0.1"
            max="100"
            step="0.1"
            required
          />
        </div>
      )}

      {/* Stop Loss Input */}
      {(orderType !== 'MARKET' || positionSizeType === 'risk') && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Stop Loss
          </label>
          <input
            type="number"
            value={stopLoss}
            onChange={(e) => setStopLoss(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="0"
            step="0.01"
            required={positionSizeType === 'risk'}
          />
        </div>
      )}
      {/* Price Input (for non-market orders) */}
      {orderType !== 'MARKET' && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Price</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="0"
            step="0.01"
            required
          />
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className={`w-full py-2 px-4 rounded-md text-white font-medium ${
          side === 'BUY'
            ? 'bg-green-600 hover:bg-green-700'
            : 'bg-red-600 hover:bg-red-700'
        } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {side === 'BUY' ? 'Place Buy Order' : 'Place Sell Order'}
      </button>
    </form>
  );
}