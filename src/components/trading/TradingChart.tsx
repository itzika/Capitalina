import React, { useEffect, useRef } from 'react';
import { Settings2 } from 'lucide-react';
import { createChart, ColorType, IChartApi } from 'lightweight-charts';
import { MarketData } from '../../types';
import { useTheme } from '../../contexts/ThemeContext';
import { generateMockCandlestickData, getChartOptions } from '../../utils/chart';

interface TradingChartProps {
  symbol: string;
  data: MarketData | null;
  loading: boolean;
  error: Error | null;
  interval?: string;
}

export function TradingChart({ symbol, data, loading, error, interval = '1h' }: TradingChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candlestickSeriesRef = useRef<any>(null);
  const { isDark } = useTheme();
  const chartOptionsRef = useRef(getChartOptions(isDark, 800));

  // Create chart only once
  useEffect(() => {
    if (!chartContainerRef.current) return;

    if (!chartRef.current) {
      chartOptionsRef.current = getChartOptions(isDark, chartContainerRef.current.clientWidth);
      chartRef.current = createChart(chartContainerRef.current, chartOptionsRef.current);

      candlestickSeriesRef.current = chartRef.current.addCandlestickSeries({
        upColor: '#26a69a',
        downColor: '#ef5350',
        borderVisible: false,
        wickUpColor: '#26a69a',
        wickDownColor: '#ef5350',
      });

      // Generate 100 days of mock data
      const mockData = generateMockCandlestickData(100);
      candlestickSeriesRef.current.setData(mockData);

      const handleResize = () => {
        if (chartContainerRef.current && chartRef.current) {
          chartRef.current.applyOptions({
            width: chartContainerRef.current.clientWidth,
          });
        }
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        if (chartRef.current) {
          chartRef.current.remove();
          chartRef.current = null;
          candlestickSeriesRef.current = null;
        }
      };
    }
  }, [symbol]); // Only recreate chart when symbol changes

  // Update chart theme without recreating it
  const updateChartTheme = React.useCallback(() => {
    if (!chartRef.current) return;
    chartOptionsRef.current = getChartOptions(isDark, chartContainerRef.current?.clientWidth || 800);
    chartRef.current.applyOptions(chartOptionsRef.current);
  }, [isDark]);

  useEffect(() => {
    updateChartTheme();
  }, [isDark]); // Only update theme-related options when theme changes

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-colors duration-200">
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{symbol}</h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">{interval}</span>
        </div>
        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors duration-200">
          <Settings2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
      </div>
      <div ref={chartContainerRef} className="p-4 relative bg-white dark:bg-gray-800 transition-colors duration-200">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white dark:bg-gray-800 bg-opacity-75 dark:bg-opacity-75">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        )}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-white dark:bg-gray-800 bg-opacity-75 dark:bg-opacity-75">
            <p className="text-red-500">Failed to load chart data</p>
          </div>
        )}
      </div>
    </div>
  );
}