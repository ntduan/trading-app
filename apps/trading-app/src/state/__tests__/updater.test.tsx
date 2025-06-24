import { render } from '@testing-library/react';
import { Updater } from '../updater';
import { vi } from 'vitest';
import { describe, it, expect } from 'vitest';

vi.mock('@/hooks/useExchangeAdapter', () => ({
  useExchangeAdapter: () => ({ adapter: { setupTradingPairs: vi.fn() } }),
}));

describe('Updater', () => {
  it('calls adapter.setupTradingPairs when tradingPairs changes', () => {
    const { useExchangeAdapter } = require('@/hooks/useExchangeAdapter');
    const adapter = useExchangeAdapter().adapter;
    render(<Updater />);
    expect(adapter.setupTradingPairs).toHaveBeenCalledWith([{ symbol: 'BTC/USDT' }]);
  });
});
