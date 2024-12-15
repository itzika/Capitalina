import { MarketDataProvider, MarketData } from '../types';
import { MOCK_MARKET_DATA } from '../../../constants/market';

export class AlphaVantageProvider implements MarketDataProvider {
  name = 'Alpha Vantage';
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async isAvailable(): Promise<boolean> {
    try {
      const response = await fetch(
        `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=IBM&interval=5min&apikey=${this.apiKey}`
      );
      const data = await response.json();
      return !data['Error Message'];
    } catch {
      return false;
    }
  }

  async fetchMarketData(symbol: string): Promise<MarketData> {
    const instrument = MOCK_MARKET_DATA[symbol];
    if (!instrument) {
      throw new Error(`Invalid symbol: ${symbol}`);
    }

    try {
      const response = await fetch(
        `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${this.apiKey}`
      );
      const data = await response.json();
      
      if (data['Error Message']) {
        throw new Error(data['Error Message']);
      }

      const quote = data['Global Quote'];
      if (!quote) {
        throw new Error('No data available');
      }

      return {
        symbol,
        type: instrument.type,
        currentPrice: parseFloat(quote['05. price']),
        previousPrice: parseFloat(quote['08. previous close']),
        change: parseFloat(quote['09. change']),
        volume: parseInt(quote['06. volume']),
        high24h: parseFloat(quote['03. high']),
        low24h: parseFloat(quote['04. low']),
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error(`Alpha Vantage API error for ${symbol}:`, error);
      throw error;
    }
  }

  async fetchAllMarketData(symbols: string[]): Promise<MarketData[]> {
    // Alpha Vantage has rate limits, so we need to fetch sequentially
    const results: MarketData[] = [];
    for (const symbol of symbols) {
      try {
        const data = await this.fetchMarketData(symbol);
        results.push(data);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Respect rate limits
      } catch (error) {
        console.error(`Failed to fetch data for ${symbol}:`, error);
      }
    }
    return results;
  }
}