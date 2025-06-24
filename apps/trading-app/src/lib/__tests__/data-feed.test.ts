import type { Bar, LibrarySymbolInfo, ResolutionString } from 'tv-charting-library';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { Datafeed } from '../data-feed';

const mockBars: Bar[] = [
  { time: 1000, close: 10, open: 9, high: 11, low: 8, volume: 100 },
  { time: 2000, close: 12, open: 10, high: 13, low: 9, volume: 150 },
];

const mockSymbol = 'BTC/USDT';
const mockResolution: ResolutionString = '1' as ResolutionString;

const mockAdapter = {
  id: 'binance',
  name: 'Binance',
  type: 'spot',
  getHistory: vi.fn(),
  subscribeKlines: vi.fn(),
  unsubscribeKlines: vi.fn(),
  getSupportedTradingPairs: vi.fn(),
  subscribeOrderbook: vi.fn(),
  placeOrder: vi.fn(),
  setupTradingPairs: vi.fn(),
};

let datafeed: Datafeed;

beforeEach(() => {
  datafeed = new Datafeed(mockAdapter);
  vi.clearAllMocks();
});

describe('Datafeed', () => {
  it('onReady calls the callback with config', () => {
    vi.useFakeTimers(); // control timers manually
    const cb = vi.fn();
    datafeed.onReady(cb);

    vi.runAllTimers(); // trigger setTimeout(0)
    expect(cb).toHaveBeenCalledWith(
      expect.objectContaining({
        supported_resolutions: expect.arrayContaining(['1', '5', '60', '240', '1D']),
        exchanges: [expect.objectContaining({ name: 'Binance' })],
      })
    );
    vi.useRealTimers(); // restore real timers for other tests
  });

  it('resolveSymbol calls the callback with correct symbol info', () => {
    vi.useFakeTimers();

    const cb = vi.fn();
    const errCb = vi.fn();
    datafeed.resolveSymbol(mockSymbol, cb, errCb);

    vi.runAllTimers(); // forces setTimeout(0) to execute immediately

    expect(cb).toHaveBeenCalledWith(
      expect.objectContaining({
        name: mockSymbol,
        ticker: mockSymbol,
        type: 'crypto',
        session: '24x7',
        timezone: 'Etc/UTC',
      })
    );
    expect(errCb).not.toHaveBeenCalled();

    vi.useRealTimers(); // restore for other tests
  });

  it('getBars calls adapter.getHistory and passes bars to callback', async () => {
    mockAdapter.getHistory.mockResolvedValueOnce(mockBars);
    const onHistory = vi.fn();
    const onError = vi.fn();

    await datafeed.getBars(
      { name: mockSymbol } as LibrarySymbolInfo,
      mockResolution,
      { from: 0, to: 9999 },
      onHistory,
      onError
    );

    expect(mockAdapter.getHistory).toHaveBeenCalledWith(mockSymbol, mockResolution, 0, 9999);
    expect(onHistory).toHaveBeenCalledWith(mockBars, { noData: false });
    expect(onError).not.toHaveBeenCalled();
  });

  it('getBars handles empty data response correctly', async () => {
    mockAdapter.getHistory.mockResolvedValueOnce([]);
    const onHistory = vi.fn();
    const onError = vi.fn();

    await datafeed.getBars(
      { name: mockSymbol } as LibrarySymbolInfo,
      mockResolution,
      { from: 0, to: 9999 },
      onHistory,
      onError
    );

    expect(onHistory).toHaveBeenCalledWith([], { noData: true });
  });

  it('getBars calls onError on exception', async () => {
    mockAdapter.getHistory.mockRejectedValueOnce(new Error('fail'));
    const onHistory = vi.fn();
    const onError = vi.fn();

    await datafeed.getBars(
      { name: mockSymbol } as LibrarySymbolInfo,
      mockResolution,
      { from: 0, to: 9999 },
      onHistory,
      onError
    );

    expect(onError).toHaveBeenCalledWith('fail');
    expect(onHistory).not.toHaveBeenCalled();
  });

  it('getBars handles non-Error exceptions', async () => {
    mockAdapter.getHistory.mockRejectedValueOnce('some string error');
    const onError = vi.fn();

    await datafeed.getBars(
      { name: mockSymbol } as LibrarySymbolInfo,
      mockResolution,
      { from: 0, to: 9999 },
      vi.fn(),
      onError
    );

    expect(onError).toHaveBeenCalledWith('some string error');
  });

  it('subscribeBars forwards to adapter', () => {
    const cb = vi.fn();
    datafeed.subscribeBars({ name: mockSymbol } as LibrarySymbolInfo, mockResolution, cb, 'guid123');
    expect(mockAdapter.subscribeKlines).toHaveBeenCalledWith(mockSymbol, mockResolution, cb, 'guid123');
  });

  it('unsubscribeBars forwards to adapter', () => {
    datafeed.unsubscribeBars('guid123');
    expect(mockAdapter.unsubscribeKlines).toHaveBeenCalledWith('guid123');
  });

  it('searchSymbols filters and formats results', () => {
    mockAdapter.getSupportedTradingPairs.mockReturnValue([{ symbol: 'BTC/USDT' }, { symbol: 'ETH/USDT' }]);
    const cb = vi.fn();

    datafeed.searchSymbols('btc', 'Binance', 'crypto', cb);
    expect(cb).toHaveBeenCalledWith([
      {
        symbol: 'BTC/USDT',
        name: 'BTC/USDT',
        full_name: 'BINANCE:BTC/USDT',
        exchange: 'BINANCE',
        type: 'crypto',
      },
    ]);
  });

  it('searchSymbols returns empty if no match', () => {
    mockAdapter.getSupportedTradingPairs.mockReturnValue([{ symbol: 'ETH/USDT' }]);
    const cb = vi.fn();

    datafeed.searchSymbols('btc', 'Binance', 'crypto', cb);
    expect(cb).toHaveBeenCalledWith([]);
  });
});
