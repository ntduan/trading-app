import { NextResponse } from 'next/server';
import { describe, it, expect, vi } from 'vitest';

import * as getTradingPairsModule from './getTradingPairs';
import { GET } from './route';

describe('GET', () => {
  it('should return trading pairs in the response', async () => {
    const mockPairs = [
      {
        symbol: 'BTCUSDT',
        baseAsset: 'BTC',
        quoteAsset: 'USDT',
        logoUrl: 'https://cdn.jsdelivr.net/npm/cryptocurrency-icons@0.18.1/128/color/btc.png',
        description: 'Bitcoin / Tether',
      },
      {
        symbol: 'ETHUSDT',
        baseAsset: 'ETH',
        quoteAsset: 'USDT',
        logoUrl: 'https://cdn.jsdelivr.net/npm/cryptocurrency-icons@0.18.1/128/color/eth.png',
        description: 'Ethereum / Tether',
      },
    ];
    const getTradingPairsSpy = vi.spyOn(getTradingPairsModule, 'getTradingPairs').mockResolvedValue(mockPairs);

    const jsonSpy = vi.spyOn(NextResponse, 'json');

    await GET();

    expect(getTradingPairsSpy).toHaveBeenCalled();
    expect(jsonSpy).toHaveBeenCalledWith({ result: mockPairs });

    getTradingPairsSpy.mockRestore();
    jsonSpy.mockRestore();
  });

  it('should handle empty trading pairs', async () => {
    const getTradingPairsSpy = vi.spyOn(getTradingPairsModule, 'getTradingPairs').mockResolvedValue([]);

    const jsonSpy = vi.spyOn(NextResponse, 'json');

    await GET();

    expect(jsonSpy).toHaveBeenCalledWith({ result: [] });

    getTradingPairsSpy.mockRestore();
    jsonSpy.mockRestore();
  });

  it('should propagate errors from getTradingPairs', async () => {
    const error = new Error('Failed to fetch');
    vi.spyOn(getTradingPairsModule, 'getTradingPairs').mockRejectedValue(error);

    // Since GET does not handle errors, it should throw
    await expect(GET()).rejects.toThrow('Failed to fetch');
  });
});
