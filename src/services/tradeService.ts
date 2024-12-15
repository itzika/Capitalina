import { TradeHistory, InstrumentType } from '../types';

// Mock trade history for development
const mockTrades: TradeHistory[] = [
  {
    id: '1',
    instrumentId: 'BTC/USD',
    instrumentType: 'FUTURES',
    side: 'BUY',
    quantity: 0.5,
    price: 44000,
    pnl: 500,
    timestamp: new Date('2024-03-10T15:30:00Z'),
  },
  {
    id: '2',
    instrumentId: 'ETH/USD',
    instrumentType: 'FUTURES',
    side: 'SELL',
    quantity: 1.5,
    price: 3100,
    pnl: -75,
    timestamp: new Date('2024-03-11T09:15:00Z'),
  },
  {
    id: '3',
    instrumentId: 'AAPL',
    instrumentType: 'STOCKS',
    side: 'BUY',
    quantity: 10,
    price: 174.5,
    pnl: 250,
    timestamp: new Date('2024-03-11T14:45:00Z'),
  },
];

export async function getTradeHistory(): Promise<TradeHistory[]> {
  await new Promise(resolve => setTimeout(resolve, 100));
  return mockTrades;
}