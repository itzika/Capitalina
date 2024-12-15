export interface MarketDataProvider {
  name: string;
  fetchMarketData: (symbol: string) => Promise<MarketData>;
  fetchAllMarketData: (symbols: string[]) => Promise<MarketData[]>;
  isAvailable: () => Promise<boolean>;
}

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

export interface MarketDataConfig {
  provider: 'mock' | 'alphavantage' | 'yahoo';
  apiKey?: string;
  baseUrl?: string;
}