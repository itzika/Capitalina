import { supabase } from '../../lib/supabase';
import { Position } from '../../types';
import { Database } from '../../types/supabase';

type SupabasePosition = Database['public']['Tables']['positions']['Row'];

export async function fetchPosition(positionId: string): Promise<SupabasePosition | null> {
  const { data, error } = await supabase
    .from('positions')
    .select('*')
    .eq('id', positionId)
    .single();

  if (error) throw error;
  return data;
}

export async function fetchUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) throw error;
  return data;
}

export async function updateUserProfile(userId: string, updates: {
  balance: number;
  total_pnl: number;
}) {
  const { error } = await supabase
    .from('user_profiles')
    .update(updates)
    .eq('user_id', userId);

  if (error) throw error;
}

export function mapSupabasePosition(position: SupabasePosition): Position {
  return {
    id: position.id,
    instrumentId: position.instrument_id,
    instrumentType: position.instrument_type as Position['instrumentType'],
    quantity: position.quantity,
    entryPrice: position.entry_price,
    currentPrice: position.current_price,
    unrealizedPnL: position.unrealized_pnl,
    openTime: new Date(position.open_time),
  };
}