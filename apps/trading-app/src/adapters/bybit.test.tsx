import { describe, it, expect, vi } from 'vitest';

import { bybit } from './bybit';

describe('Bybit Adapter', () => {
  const pairs = ['BTC/USDT', 'ETH/USDT'];
  const emitter = vi.fn();

  const adapter = bybit({ apiBaseUrl: 'ws://test' })({
    pairs,
    emitter,
  });

  it('should have correct id and name', () => {
    expect(adapter.id).toBe('bybit');
    expect(adapter.name).toBe('Bybit');
  });

  it('should return supported pairs', () => {
    expect(adapter.getSupportedPairs()).toEqual(pairs);
  });

  it('should reject mock order', async () => {
    const result = await adapter.placeOrder({
      pair: 'BTC/USDT',
      price: 100,
      size: 1,
      side: 'buy',
    });
    expect(result.status).toBe('rejected');
    expect(result.message).toBe('Stub only');
  });
});
