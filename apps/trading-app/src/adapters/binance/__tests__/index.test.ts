import { describe, it, expect, vi } from 'vitest';
import { binance } from '../index';

// Mock dependencies
vi.mock('../../socket-manager', () => {
  return {
    SocketManager: vi.fn().mockImplementation(() => {
      return {
        addSocket: vi.fn(),
        removeSocket: vi.fn(),
        getAllConnections: vi.fn(() => []),
      };
    }),
  };
});
vi.mock('../klines', () => ({
  subscribeKlines: vi.fn(() => ({ ws: { dummy: true } })),
  getHistory: vi.fn(() => Promise.resolve(['history']))
}));
vi.mock('../orderbook', () => ({ subscribeOrderbook: vi.fn() }));

const mockTradingPairs = [{ symbol: 'BTCUSDT', baseAsset: 'BTC', quoteAsset: 'USDT', logoUrl: '', description: '' }];

describe('binance adapter logic', () => {
  it('should have correct id and name', () => {
    const adapter = binance();
    expect(adapter.id).toBe('binance');
    expect(adapter.name).toBe('Binance');
  });

  it('should set and get supported trading pairs', () => {
    const adapter = binance();
    adapter.setupTradingPairs(mockTradingPairs);
    expect(adapter.getSupportedTradingPairs()).toEqual(mockTradingPairs);
  });

  it('should call getHistory', async () => {
    const adapter = binance();
    const result = await adapter.getHistory('BTCUSDT', '1', 0, 1);
    expect(result).toEqual(['history']);
  });
});
