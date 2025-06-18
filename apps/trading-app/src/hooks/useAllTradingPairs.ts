import { useQuery } from '@tanstack/react-query';

export interface TradingPair {
  symbol: string;
  baseAsset: string;
  quoteAsset: string;
}

const fetchTradingPairs = async (): Promise<TradingPair[]> => {
  const response = await fetch('/api/pairs');
  if (!response.ok) {
    throw new Error('Failed to fetch trading pairs');
  }
  return response.json();
};

export const useAllTradingPairs = () => {
  return useQuery({
    queryKey: ['trading-pairs'],
    queryFn: fetchTradingPairs,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
};
