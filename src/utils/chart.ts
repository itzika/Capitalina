import { CandlestickData } from 'lightweight-charts';
import { ColorType } from 'lightweight-charts';

export function getChartOptions(isDark: boolean, width: number) {
  return {
    layout: {
      background: { 
        type: ColorType.Solid, 
        color: isDark ? '#1f2937' : 'white' 
      },
      textColor: isDark ? '#e5e7eb' : '#111827',
    },
    width,
    height: 500,
    grid: {
      vertLines: {
        color: isDark ? '#374151' : '#e5e7eb',
      },
      horzLines: {
        color: isDark ? '#374151' : '#e5e7eb',
      },
    },
    timeScale: {
      borderColor: isDark ? '#374151' : '#e5e7eb',
    },
    crosshair: {
      vertLine: {
        color: isDark ? '#4b5563' : '#d1d5db',
      },
      horzLine: {
        color: isDark ? '#4b5563' : '#d1d5db',
      },
    },
  };
}

export function generateMockCandlestickData(days: number): CandlestickData[] {
  const now = new Date();
  now.setHours(0, 0, 0, 0); // Normalize to start of day
  
  return Array.from({ length: days }, (_, i) => {
    const date = new Date(now);
    date.setDate(date.getDate() - (days - i - 1));
    
    const basePrice = 45000;
    const volatility = basePrice * 0.02;
    
    const open = basePrice + (Math.random() - 0.5) * volatility;
    const close = basePrice + (Math.random() - 0.5) * volatility;
    const high = Math.max(open, close) + Math.random() * volatility * 0.5;
    const low = Math.min(open, close) - Math.random() * volatility * 0.5;
    
    return {
      time: date.toISOString().split('T')[0],
      open,
      high,
      low,
      close,
    };
  }).sort((a, b) => a.time.localeCompare(b.time)); // Ensure proper ordering
}