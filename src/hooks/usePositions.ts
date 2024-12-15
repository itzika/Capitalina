import { useState, useEffect, useCallback } from 'react';
import { Position } from '../types';
import { getPositions, updatePositionPrices, subscribeToPositions, positionEvents } from '../services/positionService';
import { useAuth } from '../contexts/AuthContext';
import { fetchMarketData } from '../services/marketService';

export function usePositions() {
  const { user } = useAuth();
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [version, setVersion] = useState(0);

  // Force refresh positions
  const refresh = useCallback(() => {
    setVersion(v => v + 1);
  }, []);

  // Subscribe to position events
  useEffect(() => {
    const handlePositionChange = () => {
      refresh();
    };

    positionEvents.on('change', handlePositionChange);
    return () => {
      positionEvents.off('change', handlePositionChange);
    };
  }, [refresh]);

  // Update position prices periodically
  useEffect(() => {
    if (!positions.length) return;
    
    let mounted = true;
    const updatePrices = async () => {
      try {
        const updates = await Promise.all(
          positions.map(async (position) => {
            const marketData = await fetchMarketData(position.instrumentId);
            return {
              ...position,
              currentPrice: marketData.currentPrice,
              unrealizedPnL: (marketData.currentPrice - position.entryPrice) * position.quantity
            };
          })
        );
        
        if (mounted) {
          setPositions(updates);
          await updatePositionPrices(updates);
        }
      } catch (err) {
        console.error('Error updating position prices:', err);
      }
    };
    
    updatePrices();
    const interval = setInterval(updatePrices, 1000);
    
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [positions.length]);

  // Fetch positions and handle real-time updates
  useEffect(() => {
    if (!user) {
      setPositions([]);
      setLoading(false);
      return;
    }

    let mounted = true;
    const loadPositions = async () => {
      try {
        setLoading(true);
        const userPositions = await getPositions(user.id);
        if (mounted) {
          setPositions(userPositions);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err : new Error('Failed to fetch positions'));
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadPositions();
    
    // Subscribe to real-time position updates
    const unsubscribe = subscribeToPositions(user.id, loadPositions);
    
    return () => {
      mounted = false;
      unsubscribe();
    };
  }, [user, version]);

  return { positions, loading, error, refresh };
}