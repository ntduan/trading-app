import { describe, it, expect, vi } from 'vitest';
import { fetchTradingPairs } from '../api';

global.fetch = vi.fn();

describe('fetchTradingPairs', () => {
  it('returns trading pairs on success', async () => {
    const mockPairs = [{ symbol: 'BTC/USDT' }, { symbol: 'ETH/USDT' }];
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ result: mockPairs }),
    });
    const result = await fetchTradingPairs();
    expect(result).toEqual(mockPairs);
  });

  it('throws error on non-ok response', async () => {
    (fetch as any).mockResolvedValueOnce({ ok: false });
    await expect(fetchTradingPairs()).rejects.toThrow('Failed to fetch trading pairs');
  });
});
