import { describe, it, expect } from 'vitest';

import { getTradingPairs, type TradingPair } from '../getTradingPairs';

describe('getTradingPairs', () => {
  it('should return an array of trading pairs', async () => {
    const result = await getTradingPairs();
    expect(Array.isArray(result)).toBe(true);
  });

  it('should return all predefined trading pairs', async () => {
    const result = await getTradingPairs();
    expect(result.length).toBe(3);
  });

  it('should return trading pairs with correct properties', async () => {
    const result = await getTradingPairs();
    result.forEach((pair) => {
      expect(typeof pair.symbol).toBe('string');
      expect(typeof pair.baseAsset).toBe('string');
      expect(typeof pair.quoteAsset).toBe('string');
      expect(typeof pair.logoUrl).toBe('string');
      expect(typeof pair.description).toBe('string');
    });
  });

  it('should return the correct trading pairs data', async () => {
    const expected: TradingPair[] = [
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
      {
        symbol: 'SOLUSDT',
        baseAsset: 'SOL',
        quoteAsset: 'USDT',
        logoUrl: 'https://cdn.jsdelivr.net/npm/cryptocurrency-icons@0.18.1/128/color/sol.png',
        description: 'Solana / Tether',
      },
    ];
    const result = await getTradingPairs();
    expect(result).toEqual(expected);
  });
});
