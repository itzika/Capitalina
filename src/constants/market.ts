import { InstrumentType } from '../types';

export const AVAILABLE_SYMBOLS = {
  CRYPTO: [
    'BTC/USD', // BTCUSD=X
    'ETH/USD', // ETHUSD=X
    'BNB/USD', // BNBUSD=X
    'XRP/USD', // XRPUSD=X
    'SOL/USD', // SOLUSD=X
    'ADA/USD', // ADAUSD=X
    'DOGE/USD', // DOGEUSD=X
    'TRX/USD', // TRXUSD=X
    'DOT/USD', // DOTUSD=X
    'MATIC/USD', // MATICUSD=X
    'LTC/USD', // LTCUSD=X
    'LINK/USD', // LINKUSD=X
  ],
  FOREX: [
    'EUR/USD',
    'GBP/USD',
    'USD/JPY',
    'USD/CHF',
    'USD/CAD',
    'AUD/USD',
    'NZD/USD',
    'EUR/GBP',
    'EUR/JPY',
    'GBP/JPY',
    'AUD/JPY',
    'EUR/CHF',
  ],
  STOCKS: [
    'AAPL',
    'MSFT',
    'GOOGL',
    'AMZN',
    'GOOG',
    'NVDA',
    'TSLA',
    'AMD',
    'META',
    'NFLX',
    'INTC',
    'PYPL',
    'UBER',
    'COIN',
    'PLTR',
    'SNOW',
  ],
  COMMODITIES: [
    'GC=F',    // Gold Futures
    'SI=F',    // Silver Futures
    'CL=F',    // Crude Oil Futures
    'NG=F',    // Natural Gas Futures
    'HG=F',    // Copper Futures
    'PL=F',    // Platinum Futures
    'PA=F',    // Palladium Futures
    'ZW=F',    // Wheat Futures
    'ZC=F',    // Corn Futures
    'ZS=F',    // Soybean Futures
    'KC=F',    // Coffee Futures
    'CT=F',    // Cotton Futures
  ],
} as const;

export const MOCK_MARKET_DATA: Record<string, { basePrice: number; type: InstrumentType }> = {
  // Crypto
  'BTC/USD': { basePrice: 45000, type: 'FUTURES' },
  'ETH/USD': { basePrice: 3200, type: 'FUTURES' },
  'BNB/USD': { basePrice: 380, type: 'FUTURES' },
  'XRP/USD': { basePrice: 0.75, type: 'FUTURES' },
  'SOL/USD': { basePrice: 110, type: 'FUTURES' },
  'ADA/USD': { basePrice: 0.55, type: 'FUTURES' },
  'DOGE/USD': { basePrice: 0.12, type: 'FUTURES' },
  'TRX/USD': { basePrice: 0.08, type: 'FUTURES' },
  'DOT/USD': { basePrice: 15, type: 'FUTURES' },
  'MATIC/USD': { basePrice: 0.85, type: 'FUTURES' },
  'LTC/USD': { basePrice: 65, type: 'FUTURES' },
  'LINK/USD': { basePrice: 15, type: 'FUTURES' },
  
  // Forex
  'EUR/USD': { basePrice: 1.1234, type: 'FOREX' },
  'GBP/USD': { basePrice: 1.2750, type: 'FOREX' },
  'USD/JPY': { basePrice: 148.50, type: 'FOREX' },
  'USD/CHF': { basePrice: 0.8850, type: 'FOREX' },
  'USD/CAD': { basePrice: 1.3450, type: 'FOREX' },
  'AUD/USD': { basePrice: 0.6580, type: 'FOREX' },
  'NZD/USD': { basePrice: 0.6120, type: 'FOREX' },
  'EUR/GBP': { basePrice: 0.8580, type: 'FOREX' },
  'EUR/JPY': { basePrice: 162.80, type: 'FOREX' },
  'GBP/JPY': { basePrice: 185.50, type: 'FOREX' },
  'AUD/JPY': { basePrice: 98.20, type: 'FOREX' },
  'EUR/CHF': { basePrice: 0.9650, type: 'FOREX' },
  
  // Stocks
  'AAPL': { basePrice: 175.5, type: 'STOCKS' },
  'MSFT': { basePrice: 420, type: 'STOCKS' },
  'GOOGL': { basePrice: 2800, type: 'STOCKS' },
  'GOOG': { basePrice: 2810, type: 'STOCKS' },
  'AMZN': { basePrice: 180, type: 'STOCKS' },
  'NVDA': { basePrice: 880, type: 'STOCKS' },
  'TSLA': { basePrice: 175, type: 'STOCKS' },
  'AMD': { basePrice: 205, type: 'STOCKS' },
  'META': { basePrice: 510, type: 'STOCKS' },
  'NFLX': { basePrice: 625, type: 'STOCKS' },
  'INTC': { basePrice: 45, type: 'STOCKS' },
  'PYPL': { basePrice: 62, type: 'STOCKS' },
  'UBER': { basePrice: 78, type: 'STOCKS' },
  'COIN': { basePrice: 245, type: 'STOCKS' },
  'PLTR': { basePrice: 25, type: 'STOCKS' },
  'SNOW': { basePrice: 190, type: 'STOCKS' },
  
  // Commodities
  'GC=F': { basePrice: 2050, type: 'COMMODITIES' },
  'SI=F': { basePrice: 23.5, type: 'COMMODITIES' },
  'CL=F': { basePrice: 78.5, type: 'COMMODITIES' },
  'NG=F': { basePrice: 1.85, type: 'COMMODITIES' },
  'HG=F': { basePrice: 3.85, type: 'COMMODITIES' },
  'PL=F': { basePrice: 910, type: 'COMMODITIES' },
  'PA=F': { basePrice: 960, type: 'COMMODITIES' },
  'ZW=F': { basePrice: 580, type: 'COMMODITIES' },
  'ZC=F': { basePrice: 450, type: 'COMMODITIES' },
  'ZS=F': { basePrice: 1180, type: 'COMMODITIES' },
  'KC=F': { basePrice: 185, type: 'COMMODITIES' },
  'CT=F': { basePrice: 92, type: 'COMMODITIES' },
} as const;

export const MOCK_ORDER_BOOK = {
  bids: [
    { price: 44950, quantity: 1.5, total: 67425 },
    { price: 44900, quantity: 2.2, total: 98780 },
    { price: 44850, quantity: 3.0, total: 134550 },
  ],
  asks: [
    { price: 45050, quantity: 1.2, total: 54060 },
    { price: 45100, quantity: 1.8, total: 81180 },
    { price: 45150, quantity: 2.5, total: 112875 },
  ],
} as const;