import { type TradingPair } from '@/app/api/pairs/getTradingPairs';

export const fetchTradingPairs = async (): Promise<TradingPair[]> => {
  const response = await fetch('/api/pairs');
  if (!response.ok) {
    throw new Error('Failed to fetch trading pairs');
  }
  const result = await response.json();
  return result.result;
};
