/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { generateStaticParams } from './page';

import { getTradingPairs } from '@/app/api/pairs/getTradingPairs';

// Mock getTradingPairs
vi.mock('@/app/api/pairs/getTradingPairs', () => ({
  getTradingPairs: vi.fn(),
}));

describe('page', () => {
  const mockConsoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns static params when getTradingPairs succeeds', async () => {
    vi.mocked(getTradingPairs).mockResolvedValue([{ symbol: 'BTCUSDT' }, { symbol: 'ETHUSDT' }] as any);

    const result = await generateStaticParams();

    expect(getTradingPairs).toHaveBeenCalled();
    expect(result).toEqual([{ symbol: 'BTCUSDT' }, { symbol: 'ETHUSDT' }]);
  });

  it('returns empty array and logs error when getTradingPairs throws', async () => {
    const error = new Error('Failed to fetch');
    vi.mocked(getTradingPairs).mockRejectedValue(error);

    const result = await generateStaticParams();

    expect(result).toEqual([]);
    expect(mockConsoleError).toHaveBeenCalledWith('Error generating static params:', error);
  });
  it('should return null when TradePage is rendered', async () => {
    // Import the default export (TradePage)
    const { default: TradePage } = await import('./page');
    const result = await TradePage();
    expect(result).toBeNull();
  });
});
