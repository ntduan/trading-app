import { useAtomValue, useSetAtom, useStore } from 'jotai';
import { useCallback, useEffect, useRef, useState } from 'react';

import { useExchangeAdapter } from './useExchangeAdapter';

import { orderbookAtom, postToWorkerAtom, getWorkerAtom, activeTradingPairInfoAtom } from '@/state/atoms';
import { type OrderbookResult } from '@/workers/orderbook.worker';

// initializing the worker
export function useOrderbookWorker() {
  const getWorker = useSetAtom(getWorkerAtom);

  useEffect(() => {
    getWorker();
  }, [getWorker]);

  const post = useSetAtom(postToWorkerAtom);

  return {
    post: useCallback(
      (bids: [string, string][], asks: [string, string][], tickSize: number) => {
        post({ bids, asks, tickSize });
      },
      [post]
    ),
  };
}

// throttled orderbook updates using requestAnimationFrame
export function useOrderbook() {
  const store = useStore();
  const [throttledData, setThrottledData] = useState<OrderbookResult | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const unsubscribe = store.sub(orderbookAtom, () => {
      if (rafRef.current != null) return;

      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        const latestData = store.get(orderbookAtom);
        setThrottledData(latestData);
      });
    });

    return () => {
      unsubscribe();
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [store]);

  return throttledData;
}

// get the real-time orderbook snapshot
export function useOrderbookSnapshot() {
  const store = useStore();

  const getSnapshot = useCallback((): OrderbookResult | null => {
    return store.get(orderbookAtom);
  }, [store]);

  return getSnapshot;
}

// useOrderbookSubscription to subscribe to orderbook updates
export const useOrderbookSubscription = (tickSize: number = 0.01) => {
  const activePair = useAtomValue(activeTradingPairInfoAtom);
  const { adapter } = useExchangeAdapter();
  const { post } = useOrderbookWorker();

  useEffect(() => {
    if (!activePair) return;

    const unsubscribe = adapter.subscribeOrderbook(activePair.symbol, (bids, asks) => {
      post(bids, asks, tickSize);
    });

    return unsubscribe;
  }, [activePair, activePair?.symbol, adapter, post, tickSize]);

  return {
    isConnected: !!activePair,
    symbol: activePair?.symbol,
  };
};
