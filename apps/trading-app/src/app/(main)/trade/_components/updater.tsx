'use client';
import { useAtomValue, useSetAtom } from 'jotai';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { useAllTradingPairs } from '@/hooks/useAllTradingPairs';
import { useOrderbookSubscription } from '@/hooks/useOrderbook';
import { activeTradingPairSymbolAtom, baseActiveTradingPairSymbolAtom, tickSizeAtom } from '@/state/atoms';

export function TradeUpdater() {
  const { data: pairs, isLoading } = useAllTradingPairs();
  const router = useRouter();
  const { symbol } = useParams();
  const setActiveTradingPair = useSetAtom(activeTradingPairSymbolAtom);
  const setBaseActiveTradingPair = useSetAtom(baseActiveTradingPairSymbolAtom);
  const tickSize = useAtomValue(tickSizeAtom);

  useEffect(() => {
    if (isLoading || !symbol) {
      return;
    }
    const pair = pairs?.find((p) => p.symbol === symbol);
    if (!pair) {
      // If the pair is not found, redirect to the 404 page
      router.push('/404');
    } else {
      setActiveTradingPair(pair.symbol);
      setBaseActiveTradingPair(pair.symbol);
    }
  }, [symbol, pairs, isLoading, router, setActiveTradingPair, setBaseActiveTradingPair]);

  useOrderbookSubscription(tickSize);

  return null;
}
