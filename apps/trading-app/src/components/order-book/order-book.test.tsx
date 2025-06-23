import { render, screen } from '@testing-library/react';
import * as jotai from 'jotai';
import React from 'react';
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';

import { OrderBook } from './order-book';

import { type RawOrder } from '@/adapters/createExchangeAdapter';
import * as useActiveTradingPairInfoModule from '@/hooks/useActiveTradingPairInfo';
import * as useExchangeAdapterModule from '@/hooks/useExchangeAdapter';
import * as useOrderbookRafUpdaterModule from '@/hooks/useOrderbookRafUpdater';
import * as usePriceDirectionModule from '@/hooks/usePriceDirection';

// Mocks
vi.mock('jotai', async () => {
  const actual = await vi.importActual<typeof jotai>('jotai');
  return {
    ...actual,
    useAtomValue: vi.fn(),
  };
});
vi.mock('@/hooks/useActiveTradingPairInfo', () => ({
  useActiveTradingPairInfo: vi.fn(),
}));
vi.mock('@/hooks/useExchangeAdapter', () => ({
  useExchangeAdapter: vi.fn(),
}));
vi.mock('@/hooks/useOrderbookRafUpdater', () => ({
  useOrderbookRafUpdater: vi.fn(),
}));
vi.mock('@/hooks/usePriceDirection', () => ({
  usePriceDirection: vi.fn(),
}));
vi.mock('./order-book-table', () => ({
  OrderBookTable: ({ side, data }: { side: string; data: unknown }) => (
    <div data-testid={`order-book-table-${side}`}>{JSON.stringify(data)}</div>
  ),
}));
vi.mock('./order-book-mid-price', () => ({
  OrderbookMidPrice: ({ price, direction }: { price: number; direction: string }) => (
    <div data-testid="order-book-mid-price">
      {price}-{direction}
    </div>
  ),
}));

describe('OrderBook', () => {
  const mockTickSize = 0.01;
  const mockTradingPair = {
    symbol: 'BTCUSDT',
    baseAsset: 'BTC',
    quoteAsset: 'USDT',
  };
  const mockResult = {
    bids: [{ price: 1, amount: 2 }],
    asks: [{ price: 3, amount: 4 }],
    mid: 2,
  };
  const mockDirection = 'up';

  let subscribeOrderBook: (symbol: string, cb: (bids: RawOrder[], asks: RawOrder[]) => void) => () => void;
  let unsubscribeFn: () => void;

  beforeEach(() => {
    // @ts-ignore
    jotai.useAtomValue.mockReturnValue(mockTickSize);

    (useActiveTradingPairInfoModule.useActiveTradingPairInfo as Mock).mockReturnValue({
      data: mockTradingPair,
    });

    unsubscribeFn = vi.fn();
    subscribeOrderBook = vi.fn().mockReturnValue(unsubscribeFn);

    (useExchangeAdapterModule.useExchangeAdapter as Mock).mockReturnValue({
      adapter: {
        subscribeOrderBook,
      },
    });

    (useOrderbookRafUpdaterModule.useOrderbookRafUpdater as Mock).mockImplementation((getRef, tickSize) => ({
      result: mockResult,
      triggerUpdate: vi.fn(),
    }));

    (usePriceDirectionModule.usePriceDirection as Mock).mockReturnValue(mockDirection);
  });

  it('renders empty state when tradingPair or result is missing', () => {
    (useActiveTradingPairInfoModule.useActiveTradingPairInfo as Mock).mockReturnValueOnce({ data: null });
    render(<OrderBook />);
    // Check for the correct empty indicator or fallback UI
    expect(screen.getByTestId('order-book-empty')).toBeInTheDocument();
  });

  it('renders empty state when result is missing', () => {
    (useOrderbookRafUpdaterModule.useOrderbookRafUpdater as Mock).mockReturnValueOnce({
      result: null,
      triggerUpdate: vi.fn(),
    });
    render(<OrderBook />);
    expect(screen.getByTestId('order-book-empty')).toBeInTheDocument();
  });

  it('renders order book tables and mid price', () => {
    render(<OrderBook />);
    expect(screen.getByText(/Price \(USDT\)/)).toBeInTheDocument();
    expect(screen.getByText(/Amount \(BTC\)/)).toBeInTheDocument();
    expect(screen.getByText(/Total/)).toBeInTheDocument();

    expect(screen.getByTestId('order-book-table-asks')).toHaveTextContent(JSON.stringify(mockResult.asks));
    expect(screen.getByTestId('order-book-table-bids')).toHaveTextContent(JSON.stringify(mockResult.bids));
    expect(screen.getByTestId('order-book-mid-price')).toHaveTextContent(`${mockResult.mid}-${mockDirection}`);
  });

  it('subscribes and unsubscribes to orderbook updates', () => {
    const { unmount } = render(<OrderBook />);
    expect(subscribeOrderBook).toHaveBeenCalledWith(mockTradingPair.symbol, expect.any(Function));
    // Unmount triggers unsubscribe
    unmount();
    expect(unsubscribeFn).toHaveBeenCalled();
  });

  it('updates orderbookRef and triggers update on orderbook callback', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let callback: any;
    (subscribeOrderBook as Mock).mockImplementationOnce((symbol, cb) => {
      callback = cb;
      return unsubscribeFn;
    });

    const triggerUpdate = vi.fn();
    (useOrderbookRafUpdaterModule.useOrderbookRafUpdater as Mock).mockImplementationOnce((getRef, tickSize) => ({
      result: mockResult,
      triggerUpdate,
    }));

    render(<OrderBook />);
    // Simulate orderbook update
    const bids = [{ price: 10, amount: 1 }];
    const asks = [{ price: 20, amount: 2 }];
    callback(bids, asks);
    expect(triggerUpdate).toHaveBeenCalled();
  });
});
