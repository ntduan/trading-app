import { render } from '@testing-library/react';
import { vi, describe, it, beforeEach, expect, type Mock } from 'vitest';

import { Updater } from './updater';

vi.mock('@/hooks/useAllTradingPairs', () => ({
  useAllTradingPairs: vi.fn(),
}));

vi.mock('@/hooks/useExchangeAdapter', () => ({
  useExchangeAdapter: vi.fn(),
}));

import { useAllTradingPairs } from '@/hooks/useAllTradingPairs';
import { useExchangeAdapter } from '@/hooks/useExchangeAdapter';

describe('<Updater />', () => {
  const mockSetupTradingPairs = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call adapter.setupTradingPairs when tradingPairs is defined', () => {
    (useAllTradingPairs as Mock).mockReturnValue({ data: ['BTCUSDT', 'ETHUSDT'] });
    (useExchangeAdapter as Mock).mockReturnValue({
      adapter: { setupTradingPairs: mockSetupTradingPairs },
    });

    render(<Updater />);
    expect(mockSetupTradingPairs).toHaveBeenCalledWith(['BTCUSDT', 'ETHUSDT']);
  });

  it('should NOT call adapter.setupTradingPairs when tradingPairs is undefined', () => {
    (useAllTradingPairs as Mock).mockReturnValue({ data: undefined });
    (useExchangeAdapter as Mock).mockReturnValue({
      adapter: { setupTradingPairs: mockSetupTradingPairs },
    });

    render(<Updater />);
    expect(mockSetupTradingPairs).not.toHaveBeenCalled();
  });
});
