import { useState, useEffect } from 'react';
import { TradeHistory } from '../types';
import { getTradeHistory } from '../services/tradeService';

export function useTradeHistory() {
  const [trades, setTrades] = useState<TradeHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchTrades = async () => {
      try {
        setLoading(true);
        const data = await getTradeHistory();
        if (mounted) {
          setTrades(data);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err : new Error('Failed to fetch trade history'));
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchTrades();
    return () => {
      mounted = false;
    };
  }, []);

  return { trades, loading, error };
}