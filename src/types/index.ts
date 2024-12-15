export type OrderType = 'MARKET' | 'LIMIT' | 'STOP' | 'STOP_LIMIT';
export type InstrumentType = 'FUTURES' | 'FOREX' | 'STOCKS' | 'COMMODITIES';

export interface MarketData {
  symbol: string;
  type: InstrumentType;
  currentPrice: number;
  previousPrice: number;
  change: number;
  volume: number;
  high24h: number;
  low24h: number;
  timestamp: string;
}

export interface Position {
  id: string;
  instrumentId: string;
  instrumentType: InstrumentType;
  quantity: number;
  entryPrice: number;
  currentPrice: number;
  unrealizedPnL: number;
  openTime: Date;
}

export interface Order {
  id: string;
  instrumentId: string;
  instrumentType: InstrumentType;
  type: OrderType;
  side: 'BUY' | 'SELL';
  quantity: number;
  price: number;
  status: 'PENDING' | 'FILLED' | 'CANCELLED';
  createdAt: Date;
}

export interface TradeHistory {
  id: string;
  instrumentId: string;
  instrumentType: InstrumentType;
  side: 'BUY' | 'SELL';
  quantity: number;
  price: number;
  pnl: number;
  timestamp: Date;
}

export interface User {
  id: string;
  email: string;
  name: string;
  balance: number;
  totalPnL: number;
  winRate: number;
  rank: number;
}