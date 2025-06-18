import { describe, it, expect, vi } from 'vitest';

import { binance } from './binance';

describe('Binance Adapter', () => {
  const pairs = ['BTC/USDT', 'ETH/USDT'];
  const emitter = vi.fn();

  const adapter = binance({ apiBaseUrl: 'ws://test' })({
    pairs,
    emitter,
  });

  it('should have correct id and name', () => {
    expect(adapter.id).toBe('binance');
    expect(adapter.name).toBe('Binance');
  });

  it('should return supported pairs', () => {
    expect(adapter.getSupportedPairs()).toEqual(pairs);
  });

  it('should accept mock order', async () => {
    const result = await adapter.placeOrder({
      pair: 'BTC/USDT',
      price: 100,
      size: 1,
      side: 'buy',
    });
    expect(result.status).toBe('accepted');
    expect(result.orderId).toBeTypeOf('string');
  });
});
