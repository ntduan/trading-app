import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, it, vi, beforeEach, type Mock, expect } from 'vitest';
import '@testing-library/jest-dom';

import { AccountInfo } from './account-info';

import { useActiveTradingPairInfo } from '@/hooks/useActiveTradingPairInfo';
import { useUserBalance } from '@/hooks/useUserBalance';

// Mock hooks
vi.mock('@/hooks/useActiveTradingPairInfo');
vi.mock('@/hooks/useUserBalance');

describe('AccountInfo', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders "--" when pair is undefined', () => {
    (useActiveTradingPairInfo as Mock).mockReturnValue({ data: undefined });
    (useUserBalance as Mock).mockReturnValue({ data: undefined });

    render(<AccountInfo side="buy" />);
    expect(screen.getAllByText('--')).toHaveLength(2);
  });

  it('renders "--" when pair.baseAsset is undefined', () => {
    (useActiveTradingPairInfo as Mock).mockReturnValue({ data: { baseAsset: undefined, quoteAsset: undefined } });
    (useUserBalance as Mock).mockReturnValue({ data: {} });

    render(<AccountInfo side="buy" />);
    expect(screen.getAllByText('--')).toHaveLength(2);
  });

  it('shows quoteAsset balance and symbol for buy side', () => {
    (useActiveTradingPairInfo as Mock).mockReturnValue({ data: { baseAsset: 'BTC', quoteAsset: 'USDT' } });
    (useUserBalance as Mock).mockReturnValue({ data: { BTC: 1.23, USDT: 456.78 } });

    render(<AccountInfo side="buy" />);
    expect(screen.getByText('456.78')).toBeInTheDocument();
    expect(screen.getByText('USDT')).toBeInTheDocument();
    expect(screen.getAllByText('BTC')).toHaveLength(1); // Current Position asset
    expect(screen.getByText('1.23')).toBeInTheDocument(); // Current Position balance
  });

  it('shows baseAsset balance and symbol for sell side', () => {
    (useActiveTradingPairInfo as Mock).mockReturnValue({ data: { baseAsset: 'ETH', quoteAsset: 'USD' } });
    (useUserBalance as Mock).mockReturnValue({ data: { ETH: 2.5, USD: 1000 } });

    render(<AccountInfo side="sell" />);
    expect(screen.getAllByText('2.5')).toHaveLength(2); // Available and Current Position balance
    expect(screen.getAllByText('ETH')).toHaveLength(2); // Available and Current Position asset
  });

  it('handles missing balances gracefully', () => {
    (useActiveTradingPairInfo as Mock).mockReturnValue({ data: { baseAsset: 'BTC', quoteAsset: 'USDT' } });
    (useUserBalance as Mock).mockReturnValue({ data: {} });

    render(<AccountInfo side="buy" />);
    // undefined balances render as empty string
    expect(screen.getByText('USDT')).toBeInTheDocument();
    expect(screen.getAllByText('BTC')).toHaveLength(1);
  });

  it('handles missing quoteAsset or baseAsset in balance', () => {
    (useActiveTradingPairInfo as Mock).mockReturnValue({ data: { baseAsset: 'BTC', quoteAsset: 'USDT' } });
    (useUserBalance as Mock).mockReturnValue({ data: { BTC: 0 } });

    render(<AccountInfo side="buy" />);
    expect(screen.getByText('USDT')).toBeInTheDocument();
    expect(screen.getByText('BTC')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
  });
});
