import { renderHook } from '@testing-library/react';
import * as jotai from 'jotai';
import { vi, describe, beforeEach, it, expect, type Mock } from 'vitest';

import { useActiveTradingPairInfo } from './useActiveTradingPairInfo';
import { useAllTradingPairs } from './useAllTradingPairs';

// Mock dependencies
vi.mock('jotai', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@tanstack/react-query')>();
  return {
    ...actual,
    useAtom: vi.fn(),
  };
});

vi.mock('./useAllTradingPairs', () => ({
  useAllTradingPairs: vi.fn(),
}));

describe('useActiveTradingPairInfo', () => {
  const mockUseAllTradingPairs = useAllTradingPairs as unknown as Mock;

  const tradingPairs = [
    { symbol: 'BTCUSDT', name: 'Bitcoin/USDT' },
    { symbol: 'ETHUSDT', name: 'Ethereum/USDT' },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns active trading pair info when found', () => {
    (jotai.useAtom as Mock).mockReturnValue(['BTCUSDT']);
    mockUseAllTradingPairs.mockReturnValue({
      data: tradingPairs,
      isLoading: false,
      error: null,
    });

    const { result } = renderHook(() => useActiveTradingPairInfo());
    expect(result.current.data).toEqual(tradingPairs[0]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('returns null if activeTradingPairSymbol is falsy', () => {
    (jotai.useAtom as Mock).mockReturnValue([null]);
    mockUseAllTradingPairs.mockReturnValue({
      data: tradingPairs,
      isLoading: false,
      error: null,
    });

    const { result } = renderHook(() => useActiveTradingPairInfo());
    expect(result.current.data).toBeNull();
  });

  it('returns null if allPairs is falsy', () => {
    (jotai.useAtom as Mock).mockReturnValue(['BTCUSDT']);
    mockUseAllTradingPairs.mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
    });

    const { result } = renderHook(() => useActiveTradingPairInfo());
    expect(result.current.data).toBeNull();
    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it('returns null if no matching pair is found', () => {
    (jotai.useAtom as Mock).mockReturnValue(['DOGEUSDT']);
    mockUseAllTradingPairs.mockReturnValue({
      data: tradingPairs,
      isLoading: false,
      error: null,
    });

    const { result } = renderHook(() => useActiveTradingPairInfo());
    expect(result.current.data).toBeNull();
  });

  it('returns error if useAllTradingPairs returns error', () => {
    (jotai.useAtom as Mock).mockReturnValue(['BTCUSDT']);
    mockUseAllTradingPairs.mockReturnValue({
      data: null,
      isLoading: false,
      error: new Error('Failed to fetch'),
    });

    const { result } = renderHook(() => useActiveTradingPairInfo());
    expect(result.current.data).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe('Failed to fetch');
  });
});
