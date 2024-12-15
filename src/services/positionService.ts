import { Position } from '../types';
import { supabase } from '../lib/supabase';
import { fetchMarketData } from './marketService';
import { closePosition as closePositionImpl } from './position/closePosition';
import { mapSupabasePosition } from './position/queries';
import type { PositionUpdate } from './position/types';
import { EventEmitter } from '../utils/events';

const positionEvents = new EventEmitter();
export { positionEvents };

export { closePosition } from './position/closePosition';

export function subscribeToPositions(userId: string, callback: () => void) {
  const channel = supabase
    .channel(`positions:${userId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'positions',
        filter: `user_id=eq.${userId}`,
      }, callback
    )
    .subscribe();

  return () => {
    channel.unsubscribe();
  };
}

export async function getPositions(userId: string): Promise<Position[]> {
  const { data, error } = await supabase
    .from('positions')
    .select('*')
    .eq('user_id', userId);

  if (error) throw error;

  return data.map(mapSupabasePosition);
}

export async function updatePosition(params: PositionUpdate): Promise<void> {
  const { userId, symbol, instrumentType, side, quantity, price } = params;
  
  const { data: existingPosition } = await supabase
    .from('positions')
    .select('*')
    .eq('user_id', userId)
    .eq('instrument_id', symbol)
    .single();

  let result;

  if (side === 'BUY') {
    if (existingPosition) {
      const totalQuantity = existingPosition.quantity + quantity;
      const totalCost = existingPosition.entryPrice * existingPosition.quantity + price * quantity;
      
      result = await supabase
        .from('positions')
        .update({
          quantity: totalQuantity,
          entry_price: totalCost / totalQuantity,
          current_price: price,
          unrealized_pnl: (price - existingPosition.entry_price) * totalQuantity,
        })
        .eq('id', existingPosition.id)
        .select('*');

      if (result.error) throw result.error;
    } else {
      result = await supabase
        .from('positions')
        .insert({
          user_id: userId,
          instrument_id: symbol,
          instrument_type: instrumentType,
          quantity,
          entry_price: price,
          current_price: price,
          unrealized_pnl: 0,
        })
        .select('*');

      if (result.error) throw result.error;
    }
  } else {
    if (!existingPosition) {
      throw new Error('No position found for selling');
    }
    if (existingPosition.quantity < quantity) {
      throw new Error('Insufficient position quantity');
    }
    
    const remainingQuantity = existingPosition.quantity - quantity;
    if (remainingQuantity === 0) {
      result = await supabase
        .from('positions')
        .delete()
        .eq('id', existingPosition.id);

      if (error) throw error;
      positionEvents.emit('change', null);
    } else {
      result = await supabase
        .from('positions')
        .update({
          quantity: remainingQuantity,
          current_price: price,
          unrealized_pnl: (price - existingPosition.entry_price) * remainingQuantity,
        })
        .eq('id', existingPosition.id)
        .select('*');

      if (result.error) throw result.error;
    }
  }
  
  if (result.data) {
    positionEvents.emit('change', result.data[0]);
  }
}
export async function updatePositionPrices(positions: Position[]): Promise<void> {
  try {
    await Promise.all(
      positions.map(async (position) => {
        const { error } = await supabase
          .from('positions')
          .update({
            current_price: position.currentPrice,
            unrealized_pnl: position.unrealizedPnL
          })
          .eq('id', position.id);
        
        if (error) throw error;
      })
    );
  } catch (err) {
    console.error('Error updating position prices:', err);
  }
}