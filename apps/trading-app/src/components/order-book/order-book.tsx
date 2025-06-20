'use client';

import { useAtomValue } from 'jotai';
import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import { FixedSizeList as List } from 'react-window';

import { Card } from '../ui/card';

import { tickSizeAtom } from './atoms';

import { type Order } from '@/adapters/createExchangeAdapter';
import { useActiveTradingPairInfo } from '@/hooks/useActiveTradingPairInfo';
import { useExchangeAdapter } from '@/hooks/useExchangeAdapter';
import { cn } from '@/lib/utils';

interface OrderBookProps {
  height?: number;
  rowHeight?: number;
  rowsToShow?: number;
}

const OrderRow = memo(
  ({
    data,
    index,
    style,
    isBid,
    maxTotal,
  }: {
    data: { orders: Order[]; isBid: boolean; maxTotal: number };
    index: number;
    style: React.CSSProperties;
    isBid: boolean;
    maxTotal: number;
  }) => {
    const [price, qty] = data.orders[index];
    const total = data.orders.slice(0, index + 1).reduce((acc, [, q]) => acc + q, 0);
    const percent = Math.min(total / maxTotal, 1);

    return (
      <div
        style={style}
        className={cn(
          'relative flex justify-between px-2 py-0.5 font-mono text-xs tabular-nums',
          isBid ? 'text-green-400' : 'text-red-400'
        )}
      >
        <div
          className="absolute left-0 top-0 h-full"
          style={{
            width: `${percent * 100}%`,
            backgroundColor: isBid ? 'rgba(0, 100, 0, 0.3)' : 'rgba(100, 0, 0, 0.3)',
          }}
        />
        <span className="z-10 w-1/3 text-left">{price.toLocaleString()}</span>
        <span className="z-10 w-1/3 text-right">{qty.toFixed(5)}</span>
        <span className="z-10 w-1/3 text-right">{total.toFixed(5)}</span>
      </div>
    );
  }
);
OrderRow.displayName = 'OrderRow';

export const OrderBook: React.FC<OrderBookProps> = ({ height = 432, rowHeight = 24, rowsToShow = 20 }) => {
  const tickSize = useAtomValue(tickSizeAtom);
  const { adapter } = useExchangeAdapter();
  const [bids, setBids] = useState<Order[]>([]);
  const [asks, setAsks] = useState<Order[]>([]);
  const wsRef = useRef<{ ws: WebSocket; worker: Worker } | null>(null);
  const buffer = useRef<{ bids: Order[]; asks: Order[] }>({
    bids: [],
    asks: [],
  });
  const lastUpdate = useRef(performance.now());
  const { data: tradingPair } = useActiveTradingPairInfo();

  useEffect(() => {
    if (!tradingPair) return;
    wsRef.current = adapter.subscribeOrderBook(tradingPair?.symbol, tickSize, (bids, asks) => {
      buffer.current.bids = bids;
      buffer.current.asks = asks;
    });

    const frame = () => {
      requestAnimationFrame(frame);
      const now = performance.now();
      if (now - lastUpdate.current >= 1000 / 5) {
        lastUpdate.current = now;
        setBids(buffer.current.bids.slice(0, rowsToShow));
        setAsks(buffer.current.asks.slice(0, rowsToShow));
      }
    };

    frame();
    return () => adapter.unsubscribeOrderBook(wsRef.current!);
  }, [tradingPair, tickSize, rowsToShow, adapter]);

  const maxBidTotal = useMemo(() => bids.reduce((acc, [, q]) => acc + q, 0), [bids]);
  const maxAskTotal = useMemo(() => asks.reduce((acc, [, q]) => acc + q, 0), [asks]);

  return (
    <div>
      <div className="flex justify-between px-2 pb-1 text-gray-400 font-semibold text-xs">
        <span className="w-1/3 text-left">Price</span>
        <span className="w-1/3 text-right">Size (BTC)</span>
        <span className="w-1/3 text-right">Total (BTC)</span>
      </div>

      <List
        height={height / 2}
        itemCount={asks.length}
        itemSize={rowHeight}
        width="100%"
        itemData={{
          orders: asks.slice().reverse(),
          isBid: false,
          maxTotal: maxAskTotal,
        }}
      >
        {({
          index,
          style,
          data,
        }: {
          index: number;
          style: React.CSSProperties;
          data: { orders: Order[]; isBid: boolean; maxTotal: number };
        }) => <OrderRow index={index} style={style} data={data} isBid={false} maxTotal={maxAskTotal} />}
      </List>

      <div className="text-center py-1 text-sm text-gray-400 border-y border-gray-700">
        Spread — {(bids[0]?.[0] - asks[0]?.[0]).toFixed(2)}
      </div>

      <List
        height={height / 2}
        itemCount={bids.length}
        itemSize={rowHeight}
        width="100%"
        itemData={{ orders: bids, isBid: true, maxTotal: maxBidTotal }}
      >
        {({
          index,
          style,
          data,
        }: {
          index: number;
          style: React.CSSProperties;
          data: { orders: Order[]; isBid: boolean; maxTotal: number };
        }) => <OrderRow index={index} style={style} data={data} isBid={true} maxTotal={maxBidTotal} />}
      </List>
    </div>
  );
};
