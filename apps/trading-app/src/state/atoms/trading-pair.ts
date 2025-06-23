import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { atomWithQuery } from 'jotai-tanstack-query';

import { QUERY_KEYS, STORAGE_KEYS } from '@/constants';
import { fetchTradingPairs } from '@/lib/api';

// ========================================
// Query Atoms
// ========================================

export const allTradingPairsAtom = atomWithQuery(() => ({
  queryKey: [QUERY_KEYS.TRADING_PAIR],
  queryFn: fetchTradingPairs,
  staleTime: Infinity,
  gcTime: Infinity,
  refetchOnWindowFocus: false,
  refetchOnMount: false,
  refetchOnReconnect: false,
}));

// ========================================
// Trading Pair Atoms
// ========================================

export const activeTradingPairSymbolAtom = atomWithStorage(STORAGE_KEYS.ACTIVE_TRADING_PAIR, 'BTCUSDT', undefined, {
  getOnInit: true,
});

// ========================================
// Derived Trading Pair Atoms
// ========================================

export const activeTradingPairInfoAtom = atom((get) => {
  const symbol = get(activeTradingPairSymbolAtom);
  const allPairs = get(allTradingPairsAtom);

  if (allPairs.status === 'success' && allPairs.data) {
    return allPairs.data.find((pair) => pair.symbol === symbol) || null;
  }

  return null;
});
