'use client';

import { useAtomValue } from 'jotai';
import { useEffect, useRef } from 'react';

import { tickSizeAtom } from './atoms';

import { OrderbookMidPrice } from './order-book-mid-price';
import { OrderBookTable } from './order-book-table';

import { type RawOrder } from '@/adapters/createExchangeAdapter';
import { useActiveTradingPairInfo } from '@/hooks/useActiveTradingPairInfo';
import { useExchangeAdapter } from '@/hooks/useExchangeAdapter';
import { useOrderbookRafUpdater } from '@/hooks/useOrderbookRafUpdater';
import { usePriceDirection } from '@/hooks/usePriceDirection';

export const OrderBook = () => {
  const tickSize = useAtomValue(tickSizeAtom);
  const { data: tradingPair } = useActiveTradingPairInfo();
  const orderbookRef = useRef<{ bids: RawOrder[]; asks: RawOrder[] }>({
    bids: [],
    asks: [],
  });

  const { result, triggerUpdate } = useOrderbookRafUpdater(() => orderbookRef.current, tickSize);
  console.log('Orderbook result:', result);
  const triggerUpdateRef = useRef(triggerUpdate);

  useEffect(() => {
    triggerUpdateRef.current = triggerUpdate;
  }, [triggerUpdate]);

  const { adapter } = useExchangeAdapter();
  const direction = usePriceDirection(result?.mid);

  useEffect(() => {
    if (!tradingPair) return;

    const unsub = adapter.subscribeOrderBook(tradingPair?.symbol, (bids, asks) => {
      orderbookRef.current = { bids, asks };
      triggerUpdateRef.current();
    });

    return () => {
      unsub();
    };
  }, [tradingPair, tickSize, adapter]);

  if (!tradingPair || !result) return <div className="h-[800px]" />;

  console.log('Orderbook data:', result);
  return (
    <div className="p-1">
      <div className="flex justify-between px-2 pb-1 text-muted-foreground text-xs">
        <span className="w-1/3 text-left">Price ({tradingPair?.quoteAsset})</span>
        <span className="w-1/3 text-right">Amount ({tradingPair?.baseAsset})</span>
        <span className="w-1/3 text-right">Total</span>
      </div>

      <OrderBookTable side="asks" data={result.asks} />
      <OrderbookMidPrice price={result?.mid} direction={direction} />
      <OrderBookTable side="bids" data={result.bids} />
    </div>
  );
};
