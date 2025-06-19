'use client';
import { useSetAtom } from 'jotai';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { useAllTradingPairs } from '@/hooks/useAllTradingPairs';
import { activeTradingPairAtom } from '@/state/atoms';

export function TradingPairCheck({ symbol }: { symbol: string }) {
  const { data: pairs, isLoading } = useAllTradingPairs();
  const router = useRouter();
  const setActiveTradingPair = useSetAtom(activeTradingPairAtom);

  useEffect(() => {
    if (isLoading) {
      return;
    }
    const pair = pairs?.find((p) => p.symbol === symbol);
    if (!pair) {
      // If the pair is not found, redirect to the 404 page
      router.push('/404');
    } else {
      setActiveTradingPair(pair.symbol);
    }
  }, [symbol, pairs, isLoading, router, setActiveTradingPair]);

  return null;
}
