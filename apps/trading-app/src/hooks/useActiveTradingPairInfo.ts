import { useAtom } from 'jotai';
import { useMemo } from 'react';

import { useAllTradingPairs } from './useAllTradingPairs';

import { activeTradingPairSymbolAtom } from '@/state/atoms';

export const useActiveTradingPairInfo = () => {
  const [activeTradingPairSymbol] = useAtom(activeTradingPairSymbolAtom);
  const { data: allPairs, isLoading, error } = useAllTradingPairs();

  const activeTradingPair = useMemo(() => {
    if (!allPairs || !activeTradingPairSymbol) return null;
    return allPairs.find((pair) => pair.symbol === activeTradingPairSymbol) || null;
  }, [allPairs, activeTradingPairSymbol]);

  return {
    data: activeTradingPair,
    isLoading,
    error,
  };
};
