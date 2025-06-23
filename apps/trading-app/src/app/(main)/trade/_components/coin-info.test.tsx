/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/navigation';

import { vi, describe, beforeEach, afterEach, it, expect } from 'vitest';

import { CoinInfo } from './coin-info';

import { useActiveTradingPairInfo } from '@/hooks/useActiveTradingPairInfo';
import { useAllTradingPairs } from '@/hooks/useAllTradingPairs';

// Mock hooks and router
vi.mock('@/hooks/useActiveTradingPairInfo');
vi.mock('@/hooks/useAllTradingPairs');
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

describe('CoinInfo', () => {
  const mockPush = vi.fn();

  beforeEach(() => {
    vi.mocked(useRouter).mockReturnValue({ push: mockPush } as any);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders nothing when activeTradingPair is null', () => {
    vi.mocked(useActiveTradingPairInfo).mockReturnValue({ data: null, isLoading: false, error: null });
    vi.mocked(useAllTradingPairs).mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
      isSuccess: true,
      isError: false,
      isFetching: false,
      refetch: vi.fn(),
      status: 'success',
    } as any);

    render(<CoinInfo />);
    expect(screen.queryByText(/-/)).not.toBeInTheDocument();
  });

  it('renders active trading pair with logo', () => {
    vi.mocked(useActiveTradingPairInfo).mockReturnValue({
      data: {
        baseAsset: 'BTC',
        quoteAsset: 'USDT',
        symbol: 'BTCUSDT',
        logoUrl: '/btc-logo.png',
        description: 'Bitcoin / Tether',
      },
      isLoading: false,
      error: null,
    });

    vi.mocked(useAllTradingPairs).mockReturnValue({
      data: [],
    } as any);

    render(<CoinInfo />);
    // There are multiple "BTC-USDT" elements, so check that at least one exists
    expect(screen.getAllByText('BTC-USDT').length).toBeGreaterThan(0);
    expect(screen.getByAltText('')?.getAttribute('src')).toContain('btc-logo.png');
  });

  it('opens dropdown and shows all trading pairs', async () => {
    vi.mocked(useActiveTradingPairInfo).mockReturnValue({
      data: {
        baseAsset: 'BTC',
        quoteAsset: 'USDT',
        symbol: 'BTCUSDT',
        logoUrl: '/btc-logo.png',
        description: 'Bitcoin / Tether',
      },
      isLoading: false,
      error: null,
    });

    vi.mocked(useAllTradingPairs).mockReturnValue({
      data: [
        {
          baseAsset: 'BTC',
          quoteAsset: 'USDT',
          symbol: 'BTCUSDT',
          logoUrl: '/btc-logo.png',
          description: 'Bitcoin / Tether',
        },
        {
          baseAsset: 'ETH',
          quoteAsset: 'USDT',
          symbol: 'ETHUSDT',
          logoUrl: '/eth-logo.png',
          description: 'Ethereum / Tether',
        },
      ],
    } as any);

    render(<CoinInfo />);
    const trigger = screen.getByText('BTC-USDT');
    await userEvent.click(trigger);

    expect(await screen.findByText('All Coins')).toBeInTheDocument();
    expect(screen.getAllByText('BTC-USDT').length).toBeGreaterThan(0);
    expect(screen.getByText('ETH-USDT')).toBeInTheDocument();
  });
});
