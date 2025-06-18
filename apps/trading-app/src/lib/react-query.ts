import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
      retry: 2,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
    },
  },
});

// Query keys for better organization
export const queryKeys = {
  tradingData: (symbol: string) => ['trading-data', symbol] as const,
  marketData: () => ['market-data'] as const,
  watchlist: (symbols: string[]) => ['watchlist', symbols] as const,
  orders: () => ['orders'] as const,
  userProfile: () => ['user-profile'] as const,
} as const;
