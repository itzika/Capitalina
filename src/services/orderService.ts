import { Order, OrderType } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { fetchMarketData } from './marketService';
import { updatePosition, getPositions } from './positionService';
import { supabase } from '../lib/supabase';

async function getAccountBalance(userId: string): Promise<number> {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('balance')
    .eq('user_id', userId)
    .single();
  
  if (error) throw error;
  return data.balance;
}

export async function placeOrder(params: {
  userId: string;
  symbol: string;
  type: OrderType;
  side: 'BUY' | 'SELL';
  quantity: number;
  price?: number;
}): Promise<Order> {
  const { userId, symbol, type, side, quantity, price } = params;
  
  // Get current market price
  const marketData = await fetchMarketData(symbol);
  const executionPrice = type === 'MARKET' ? marketData.currentPrice : price!;
  
  // Calculate total cost
  const totalCost = executionPrice * quantity;
  
  // Check if user has enough balance for buy orders
  const balance = await getAccountBalance(userId);
  if (side === 'BUY' && totalCost > balance) {
    throw new Error('Insufficient funds');
  }
  
  // Create order record
  const order: Order = {
    id: uuidv4(),
    instrumentId: symbol,
    instrumentType: marketData.type,
    type,
    side,
    quantity,
    price: executionPrice,
    status: 'FILLED',
    createdAt: new Date(),
  };
  
  // Update account balance
  const { error: balanceError } = await supabase
    .from('user_profiles')
    .update({
      balance: side === 'BUY' ? balance - totalCost : balance + totalCost,
    })
    .eq('user_id', userId);

  if (balanceError) {
    throw balanceError;
  }
  
  // Update position
  await updatePosition({
    userId,
    symbol,
    instrumentType: marketData.type,
    side,
    quantity,
    price: executionPrice,
  });
  
  return order;
}