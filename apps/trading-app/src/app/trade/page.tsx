'use client';

import { useAtom } from 'jotai';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';

import { useAllTradingPairs } from '@/hooks/useAllTradingPairs';
import { activeTradingPairAtom } from '@/state/atoms';

export default function TradePage() {
  const params = useParams();
  const router = useRouter();
  const [activeTradingPair, setActiveTradingPair] = useAtom(activeTradingPairAtom);
  const { data: tradingPairs, isLoading, error } = useAllTradingPairs();

  const tradingPairParam = useMemo(() => {
    if (!params?.symbol) return null;
    const paramArray = Array.isArray(params.symbol) ? params.symbol : [params.symbol];
    return paramArray[0] || null;
  }, [params]);

  useEffect(() => {
    if (!tradingPairParam || isLoading) {
      return;
    }

    const symbol = tradingPairParam.replace('_', '');
    const isValidPair = tradingPairs?.some((pair) => pair.symbol === symbol);

    if (!isValidPair) {
      router.push('/404');
      return;
    }

    setActiveTradingPair(symbol);
  }, [tradingPairParam, tradingPairs, isLoading, error, router, setActiveTradingPair]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div>Loading trading pairs...</div>
      </div>
    );
  }

  const currentSymbol = tradingPairParam ? tradingPairParam.replace('_', '') : activeTradingPair;

  return (
    <div>
      <h1>Trade Page</h1>
      <p>Current Trading Pair: {currentSymbol || 'None selected'}</p>
      <p>Route Param: {tradingPairParam || 'None'}</p>
      <p>Active Trading Pair from State: {activeTradingPair || 'None'}</p>
    </div>
  );
}
