import { fetchPosition, fetchUserProfile, updateUserProfile } from './queries';
import { fetchMarketData } from '../marketService';
import { supabase } from '../../lib/supabase';
import { ClosePositionResult } from './types';

export async function closePosition(positionId: string): Promise<ClosePositionResult> {
  try {
    // Fetch the position
    const position = await fetchPosition(positionId);
    if (!position) {
      return {
        success: false,
        message: 'Position not found',
      };
    }

    // Get current market price
    const marketData = await fetchMarketData(position.instrument_id);
    const closePrice = marketData.currentPrice;

    // Calculate realized PnL and position value
    const realizedPnL = Number((closePrice - position.entry_price) * position.quantity);
    const positionValue = Number(position.quantity * closePrice);

    // Start a transaction using RPC
    const { error: rpcError } = await supabase.rpc('close_position', {
      p_position_id: positionId,
      p_realized_pnl: realizedPnL,
      p_position_value: positionValue,
    });

    if (rpcError) {
      return {
        success: false,
        message: 'Failed to close position',
        error: rpcError,
        error: rpcError,
      };
    }

    return {
      success: true,
      message: 'Position closed successfully',
    };
  } catch (error) {
    return {
      success: false,
      message: 'An unexpected error occurred',
      error: error instanceof Error ? error : new Error(String(error)),
    };
  }
}