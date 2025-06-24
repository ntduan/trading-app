import { useAtomValue, useSetAtom, useStore } from 'jotai';
import { useCallback, useEffect, useRef, useState } from 'react';

import { useExchangeAdapter } from './useExchangeAdapter';

import {
  activeTradingPairInfoAtom,
  activeTradingPairSymbolAtom,
  getWorkerAtom,
  orderbookAtom,
  postToWorkerAtom,
} from '@/state/atoms';
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
      (symbol: string, bids: [string, string][], asks: [string, string][], tickSize: number) => {
        post({ symbol, bids, asks, tickSize });
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
export function useOrderbookSnapshot(symbol: string) {
  const store = useStore();
  const [orderbook, setOrderbook] = useState<OrderbookResult | null>(null);

  useEffect(() => {
    if (!orderbook || orderbook.symbol !== symbol) {
      const unsubscribe = store.sub(orderbookAtom, () => {
        const result = store.get(orderbookAtom);
        if (result && result.symbol === symbol) {
          setOrderbook(store.get(orderbookAtom));
          unsubscribe();
        }
      });
    }
  }, [orderbook, store, symbol]);

  return orderbook;
}

// useOrderbookSubscription to subscribe to orderbook updates
export const useOrderbookSubscription = (tickSize: number = 0.01) => {
  const activePair = useAtomValue(activeTradingPairInfoAtom);
  const { adapter } = useExchangeAdapter();
  const { post } = useOrderbookWorker();

  useEffect(() => {
    if (!activePair) return;

    const unsubscribe = adapter.subscribeOrderbook(activePair.symbol, (bids, asks) => {
      post(activePair.symbol, bids, asks, tickSize);
    });

    return unsubscribe;
  }, [activePair, activePair?.symbol, adapter, post, tickSize]);

  return {
    isConnected: !!activePair,
    symbol: activePair?.symbol,
  };
};
