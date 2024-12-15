import { MarketDataProvider, MarketData } from '../types';
import { MOCK_MARKET_DATA, AVAILABLE_SYMBOLS } from '../../../constants/market';
import { MockDataProvider } from './mockProvider';

export class YahooFinanceProvider implements MarketDataProvider {
  name = 'Yahoo Finance';
  private mockProvider = new MockDataProvider();
  private readonly API_BASE = '/api/yahoo/v8/finance';
  private readonly DEFAULT_PARAMS = 'interval=1d&range=2d';

  async isAvailable(): Promise<boolean> {
    try {
      const response = await fetch(`${this.API_BASE}/chart/AAPL?${this.DEFAULT_PARAMS}`);
      const data = await response.json();
      return !data.error;
    } catch {
      return false;
    }
  }

  private formatSymbol(symbol: string): string {
    if (symbol.includes('/')) {
      const [base, quote] = symbol.split('/');
      if (this.isCrypto(symbol)) {
        return `${base}-${quote}`; // Crypto pairs use dash format
      } else if (base === 'USD') {
        return `${quote}${base}=X`;
      } else {
        return `${base}${quote}=X`;
      }
    }
    return symbol;
  }

  private isCrypto(symbol: string): boolean {
    return AVAILABLE_SYMBOLS.CRYPTO.includes(symbol);
  }

  private async fetchWithRetry(symbol: string, retries = 2): Promise<Response> {
    const yahooSymbol = this.formatSymbol(symbol);
    const url = `${this.API_BASE}/chart/${yahooSymbol}?${this.DEFAULT_PARAMS}`;
    
    for (let i = 0; i <= retries; i++) {
      try {
        const response = await fetch(url);
        if (response.ok) return response;
        if (i < retries) {
          await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
        }
      } catch (error) {
        if (i === retries) throw error;
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
      }
    }
    throw new Error(`Failed to fetch data for ${symbol} after ${retries} retries`);
  }

  async fetchMarketData(symbol: string): Promise<MarketData> {
    try {
      const response = await this.fetchWithRetry(symbol);
      const data = await response.json();
      
      if (!data?.chart?.result?.[0]?.indicators?.quote?.[0]) {
        console.warn(`Invalid data structure for ${symbol}, falling back to mock data`);
        return this.mockProvider.fetchMarketData(symbol);
      }

      const quote = data.chart.result[0];
      const indicators = quote.indicators.quote[0];
      const latestIndex = quote.timestamp.length - 1;
      const previousIndex = latestIndex - 1;

      const currentPrice = indicators.close[latestIndex] || quote.meta.regularMarketPrice;
      const previousPrice = indicators.close[previousIndex] || currentPrice * 0.99;
      const change = ((currentPrice - previousPrice) / previousPrice) * 100;
      const volume = indicators.volume[latestIndex] || 0;
      const high = indicators.high[latestIndex] || currentPrice * 1.01;
      const low = indicators.low[latestIndex] || currentPrice * 0.99;
      const instrument = MOCK_MARKET_DATA[symbol] || { type: 'STOCKS' };

      return {
        symbol,
        type: instrument.type,
        currentPrice,
        previousPrice,
        change,
        volume,
        high24h: high,
        low24h: low,
        timestamp: new Date(quote.timestamp[latestIndex] * 1000).toISOString(),
      };
    } catch (error) {
      console.error(`Yahoo Finance API error for ${symbol}:`, error);
      return this.mockProvider.fetchMarketData(symbol);
    }
  }

  private async fetchBatchData(symbols: string[]): Promise<MarketData[]> {
    const batchSize = 5; // Reduced batch size to avoid rate limits
    const results: MarketData[] = [];
    const errors: string[] = [];
    
    for (let i = 0; i < symbols.length; i += batchSize) {
      const batch = symbols.slice(i, i + batchSize);
      const batchPromises = batch.map(async symbol => {
        try {
          const data = await this.fetchMarketData(symbol);
          return data;
        } catch (error) {
          errors.push(symbol);
          return this.mockProvider.fetchMarketData(symbol);
        }
      });

      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);
      
      // Add delay between batches
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    if (errors.length > 0) {
      console.warn(`Failed to fetch real data for symbols: ${errors.join(', ')}`);
    }
    
    return results;
  }

  async fetchAllMarketData(symbols: string[]): Promise<MarketData[]> {
    try {
      return await this.fetchBatchData(symbols);
    } catch (error) {
      console.error('Error fetching all market data:', error);
      return Promise.all(symbols.map(symbol => this.mockProvider.fetchMarketData(symbol)));
    }
  }
}