'use client';

import { useAtomValue } from 'jotai';

import { tickSizeAtom } from './atoms';

import { OrderbookMidPrice } from './orderbook-mid-price';
import { OrderbookTable } from './orderbook-table';

import { useOrderbook } from '@/hooks/useOrderbook';
import { usePriceDirection } from '@/hooks/usePriceDirection';
import { activeTradingPairInfoAtom } from '@/state/atoms';

export const Orderbook = () => {
  const tickSize = useAtomValue(tickSizeAtom);
  const activePair = useAtomValue(activeTradingPairInfoAtom);
  const orderbook = useOrderbook();

  const direction = usePriceDirection(orderbook?.mid);

  if (!activePair || !orderbook) return <div data-testid="orderbook-empty" className="h-[800px]" />;

  return (
    <div className="p-1">
      <div className="flex justify-between px-2 pb-1 text-muted-foreground text-xs">
        <span className="w-1/3 text-left">Price ({activePair?.quoteAsset})</span>
        <span className="w-1/3 text-right">Amount ({activePair?.baseAsset})</span>
        <span className="w-1/3 text-right">Total</span>
      </div>

      <OrderbookTable side="asks" data={orderbook.asks} />
      <OrderbookMidPrice price={orderbook?.mid} direction={direction} />
      <OrderbookTable side="bids" data={orderbook.bids} />
    </div>
  );
};
