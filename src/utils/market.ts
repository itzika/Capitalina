export function generateMockPrice(basePrice: number): number {
  const variation = basePrice * 0.002 * (Math.random() - 0.5);
  return basePrice + variation;
}

export function calculatePriceChange(currentPrice: number, previousPrice: number): number {
  return ((currentPrice - previousPrice) / previousPrice) * 100;
}

export function generateMockVolume(): number {
  return Math.floor(Math.random() * 1000000);
}

export function calculate24HRange(currentPrice: number): { high: number; low: number } {
  return {
    high: currentPrice * 1.02,
    low: currentPrice * 0.98,
  };
}