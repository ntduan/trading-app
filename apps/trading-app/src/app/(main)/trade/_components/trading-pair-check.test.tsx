/* eslint-disable @typescript-eslint/no-explicit-any */
import { render } from '@testing-library/react';
import { describe, it, vi, beforeEach, expect } from 'vitest';

import { TradingPairCheck } from './trading-pair-check';

import { useAllTradingPairs } from '@/hooks/useAllTradingPairs';

// Mocks
const mockPush = vi.fn();
const mockSetActiveTradingPair = vi.fn();

vi.mock('next/navigation', async () => {
  const actual = await vi.importActual('next/navigation');
  return {
    ...actual,
    useRouter: () => ({ push: mockPush }),
    useParams: () => ({ symbol: 'BTCUSDT' }),
  };
});

vi.mock('jotai', async (importOriginal) => {
  const actual = await importOriginal<typeof import('jotai')>();
  return {
    ...actual,
    useSetAtom: () => mockSetActiveTradingPair,
  };
});

vi.mock('@/hooks/useAllTradingPairs', () => ({
  useAllTradingPairs: vi.fn(),
}));

// Helper to update mock return
// const useAllTradingPairsMock = require('@/hooks/useAllTradingPairs').useAllTradingPairs;

describe('TradingPairCheck', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('does nothing if loading', () => {
    vi.mocked(useAllTradingPairs).mockReturnValue({
      data: [],
      isLoading: true,
    } as any);

    render(<TradingPairCheck />);
    expect(mockPush).not.toHaveBeenCalled();
    expect(mockSetActiveTradingPair).not.toHaveBeenCalled();
  });

  it('redirects to /404 if symbol not found', () => {
    vi.mocked(useAllTradingPairs).mockReturnValue({
      data: [{ symbol: 'ETHUSDT' }],
      isLoading: false,
    } as any);

    render(<TradingPairCheck />);
    expect(mockPush).toHaveBeenCalledWith('/404');
    expect(mockSetActiveTradingPair).not.toHaveBeenCalled();
  });

  it('sets active trading pair if found', () => {
    vi.mocked(useAllTradingPairs).mockReturnValue({
      data: [{ symbol: 'BTCUSDT' }],
      isLoading: false,
    } as any);

    render(<TradingPairCheck />);
    expect(mockSetActiveTradingPair).toHaveBeenCalledWith('BTCUSDT');
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('returns null from render', () => {
    vi.mocked(useAllTradingPairs).mockReturnValue({
      data: [{ symbol: 'BTCUSDT' }],
      isLoading: false,
    } as any);

    const { container } = render(<TradingPairCheck />);
    expect(container).toBeEmptyDOMElement();
  });
});
