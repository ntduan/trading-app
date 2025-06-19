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
  const result = await response.json();

  return result.result;
};

export const useAllTradingPairs = () => {
  return useQuery({
    queryKey: ['trading-pairs'],
    staleTime: Infinity,
    gcTime: Infinity,
    queryFn: fetchTradingPairs,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
};
