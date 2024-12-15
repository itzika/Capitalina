import { MarketDataProvider, MarketData } from '../types';
import { MOCK_MARKET_DATA } from '../../../constants/market';
import { generateMockPrice, calculatePriceChange, generateMockVolume, calculate24HRange } from '../../../utils/market';

export class MockDataProvider implements MarketDataProvider {
  name = 'Mock Data';

  async isAvailable(): Promise<boolean> {
    return true;
  }

  async fetchMarketData(symbol: string): Promise<MarketData> {
    await new Promise(resolve => setTimeout(resolve, 100)); // Simulate network delay

    const instrument = MOCK_MARKET_DATA[symbol];
    if (!instrument) {
      throw new Error(`Invalid symbol: ${symbol}`);
    }

    const currentPrice = generateMockPrice(instrument.basePrice);
    const previousPrice = generateMockPrice(instrument.basePrice);
    const change = calculatePriceChange(currentPrice, previousPrice);
    const { high, low } = calculate24HRange(currentPrice);

    return {
      symbol,
      type: instrument.type,
      currentPrice,
      previousPrice,
      change,
      volume: generateMockVolume(),
      high24h: high,
      low24h: low,
      timestamp: new Date().toISOString(),
    };
  }

  async fetchAllMarketData(symbols: string[]): Promise<MarketData[]> {
    try {
      const results = await Promise.all(
        symbols.map(async (symbol) => {
          try {
            return await this.fetchMarketData(symbol);
          } catch (error) {
            console.error(`Error fetching mock data for ${symbol}:`, error);
            // Return null for failed symbols
            return null;
          }
        })
      );
      
      // Filter out null results
      return results.filter((data): data is MarketData => data !== null);
    } catch (error) {
      console.error('Error fetching all mock market data:', error);
      return [];
    }
  }
}