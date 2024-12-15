import { useState, useEffect } from 'react';
import { MarketData } from '../types';
import { fetchMarketData, fetchAllMarketData } from '../services/marketService';

export function useMarketData(symbol: string) {
  const [data, setData] = useState<MarketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        const marketData = await fetchMarketData(symbol);
        if (mounted) {
          setData(marketData);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err : new Error('Failed to fetch market data'));
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 1000); // Update every second for more real-time feel

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [symbol]);

  return { data, loading, error };
}

export function useAllMarketData(symbols?: string[]) {
  const [data, setData] = useState<MarketData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const allSymbols = symbols || Object.values(AVAILABLE_SYMBOLS).flat();

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        const marketData = await fetchAllMarketData(allSymbols);
        if (mounted) {
          setData(marketData);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err : new Error('Failed to fetch market data'));
          // Set empty array to prevent undefined errors in components
          setData([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000); // Update every 5 seconds

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return { data, loading, error };
}