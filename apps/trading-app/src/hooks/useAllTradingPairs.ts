import { useQuery } from '@tanstack/react-query';

import { type TradingPair } from '@/app/api/pairs/getTradingPairs';
import { QUERY_KEYS } from '@/constants';

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
    queryKey: [QUERY_KEYS.TRADING_PAIR],
    staleTime: Infinity,
    gcTime: Infinity,
    queryFn: fetchTradingPairs,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
};
