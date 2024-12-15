import { Position, InstrumentType } from '../../types';

export interface PositionUpdate {
  userId: string;
  symbol: string;
  instrumentType: InstrumentType;
  side: 'BUY' | 'SELL';
  quantity: number;
  price: number;
}

export interface ClosePositionResult {
  success: boolean;
  message?: string;
  error?: Error;
}