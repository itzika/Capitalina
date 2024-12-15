import { MarketDataProvider, MarketData, MarketDataConfig } from './types';
import { MockDataProvider } from './providers/mockProvider';
import { AlphaVantageProvider } from './providers/alphaVantageProvider';
import { YahooFinanceProvider } from './providers/yahooFinanceProvider';

export class MarketDataService {
  private static instance: MarketDataService;
  private provider: MarketDataProvider;
  private config: MarketDataConfig;
  private fallbackProvider: MockDataProvider;

  private constructor() {
    this.provider = new YahooFinanceProvider();
    this.fallbackProvider = new MockDataProvider();
    this.config = { provider: 'mock' };
  }

  static getInstance(): MarketDataService {
    if (!MarketDataService.instance) {
      MarketDataService.instance = new MarketDataService();
    }
    return MarketDataService.instance;
  }

  async configure(config: MarketDataConfig): Promise<void> {
    this.config = config;

    switch (config.provider) {
      case 'alphavantage':
        if (!config.apiKey) {
          throw new Error('API key required for Alpha Vantage');
        }
        this.provider = new AlphaVantageProvider(config.apiKey);
        break;
      case 'yahoo':
        this.provider = new YahooFinanceProvider();
        break;
      case 'mock':
      default:
        this.provider = new MockDataProvider();
    }

    // Verify the provider is working
    const isAvailable = await this.provider.isAvailable();
    if (!isAvailable) {
      console.warn(`${config.provider} is not available, falling back to mock data`);
      this.provider = new MockDataProvider();
    }
  }

  async getMarketData(symbol: string): Promise<MarketData> {
    try {
      return await this.provider.fetchMarketData(symbol);
    } catch (error) {
      console.warn(`Falling back to mock data for ${symbol}`);
      return this.fallbackProvider.fetchMarketData(symbol);
    }
  }

  async getAllMarketData(symbols: string[]): Promise<MarketData[]> {
    try {
      return await this.provider.fetchAllMarketData(symbols);
    } catch (error) {
      console.warn('Falling back to mock data for all symbols');
      return this.fallbackProvider.fetchAllMarketData(symbols);
    }
  }

  getProviderName(): string {
    return this.provider.name;
  }
}