import { render, screen } from '@testing-library/react';
import { describe, it, vi, expect } from 'vitest';

import { OrderContainer } from './order-container';

// Mock LimitOrder
vi.mock('@/components/limit-order/limit-order', () => ({
  LimitOrder: ({ bestAsk, bestBid }: { bestAsk: number; bestBid: number }) => (
    <div data-testid="limit-order">
      LimitOrder - Ask: {bestAsk}, Bid: {bestBid}
    </div>
  ),
}));

describe('OrderContainer', () => {
  it('renders SnackbarProvider and Spot tab', () => {
    render(<OrderContainer />);
    expect(screen.getByText('Spot')).toBeInTheDocument();
    expect(screen.getByTestId('limit-order')).toBeInTheDocument();
    expect(screen.getByText('LimitOrder - Ask: 100, Bid: 90')).toBeInTheDocument();
  });

  it('renders LimitOrder only when Spot is active and loaded', () => {
    render(<OrderContainer />);
    const container = screen.getByTestId('limit-order').parentElement;
    expect(container?.className).toContain('block');
  });
});
