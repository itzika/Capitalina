import { MarketData } from '../types';
import { MarketDataService } from './marketData/MarketDataService';

export async function fetchMarketData(symbol: string): Promise<MarketData> {
  const service = MarketDataService.getInstance();
  try {
    return await service.getMarketData(symbol);
  } catch (error) {
    console.error(`Error fetching market data for ${symbol}:`, error);
    throw error;
  }
}

export async function fetchAllMarketData(symbols: string[]): Promise<MarketData[]> {
  const service = MarketDataService.getInstance();
  try {
    return await service.getAllMarketData(symbols);
  } catch (error) {
    console.error('Error fetching all market data:', error);
    return [];
  }
}