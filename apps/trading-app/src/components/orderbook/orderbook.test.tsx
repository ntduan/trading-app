import { render, screen } from '@testing-library/react';
import * as jotai from 'jotai';
import React from 'react';
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';

import { Orderbook } from './orderbook';

import { type RawOrder } from '@/adapters/createExchangeAdapter';
import * as useActiveTradingPairInfoModule from '@/hooks/useActiveTradingPairInfo';
import * as useExchangeAdapterModule from '@/hooks/useExchangeAdapter';
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
vi.mock('@/hooks/usePriceDirection', () => ({
  usePriceDirection: vi.fn(),
}));
vi.mock('./orderbook-table', () => ({
  OrderbookTable: ({ side, data }: { side: string; data: unknown }) => (
    <div data-testid={`orderbook-table-${side}`}>{JSON.stringify(data)}</div>
  ),
}));
vi.mock('./orderbook-mid-price', () => ({
  OrderbookMidPrice: ({ price, direction }: { price: number; direction: string }) => (
    <div data-testid="orderbook-mid-price">
      {price}-{direction}
    </div>
  ),
}));

describe('Orderbook', () => {
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

  let subscribeOrderbook: (symbol: string, cb: (bids: RawOrder[], asks: RawOrder[]) => void) => () => void;
  let unsubscribeFn: () => void;

  beforeEach(() => {
    // @ts-ignore
    jotai.useAtomValue.mockReturnValue(mockTickSize);

    (useActiveTradingPairInfoModule.useActiveTradingPairInfo as Mock).mockReturnValue({
      data: mockTradingPair,
    });

    unsubscribeFn = vi.fn();
    subscribeOrderbook = vi.fn().mockReturnValue(unsubscribeFn);

    (useExchangeAdapterModule.useExchangeAdapter as Mock).mockReturnValue({
      adapter: {
        subscribeOrderbook,
      },
    });

    (usePriceDirectionModule.usePriceDirection as Mock).mockReturnValue(mockDirection);
  });

  it('renders empty state when tradingPair or result is missing', () => {
    (useActiveTradingPairInfoModule.useActiveTradingPairInfo as Mock).mockReturnValueOnce({ data: null });
    render(<Orderbook />);
    // Check for the correct empty indicator or fallback UI
    expect(screen.getByTestId('orderbook-empty')).toBeInTheDocument();
  });

  it('renders empty state when result is missing', () => {
    render(<Orderbook />);
    expect(screen.getByTestId('orderbook-empty')).toBeInTheDocument();
  });

  it('renders order book tables and mid price', () => {
    render(<Orderbook />);
    expect(screen.getByText(/Price \(USDT\)/)).toBeInTheDocument();
    expect(screen.getByText(/Amount \(BTC\)/)).toBeInTheDocument();
    expect(screen.getByText(/Total/)).toBeInTheDocument();

    expect(screen.getByTestId('orderbook-table-asks')).toHaveTextContent(JSON.stringify(mockResult.asks));
    expect(screen.getByTestId('orderbook-table-bids')).toHaveTextContent(JSON.stringify(mockResult.bids));
    expect(screen.getByTestId('orderbook-mid-price')).toHaveTextContent(`${mockResult.mid}-${mockDirection}`);
  });

  it('subscribes and unsubscribes to orderbook updates', () => {
    const { unmount } = render(<Orderbook />);
    expect(subscribeOrderbook).toHaveBeenCalledWith(mockTradingPair.symbol, expect.any(Function));
    // Unmount triggers unsubscribe
    unmount();
    expect(unsubscribeFn).toHaveBeenCalled();
  });

  it('updates orderbookRef and triggers update on orderbook callback', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let callback: any;
    (subscribeOrderbook as Mock).mockImplementationOnce((symbol, cb) => {
      callback = cb;
      return unsubscribeFn;
    });

    const triggerUpdate = vi.fn();

    render(<Orderbook />);
    // Simulate orderbook update
    const bids = [{ price: 10, amount: 1 }];
    const asks = [{ price: 20, amount: 2 }];
    callback(bids, asks);
    expect(triggerUpdate).toHaveBeenCalled();
  });
});
