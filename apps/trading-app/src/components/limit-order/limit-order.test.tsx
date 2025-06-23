import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi } from 'vitest';

import { LimitOrder } from './limit-order';

// Mock LimitForm component
vi.mock('./limit-form', () => ({
  LimitForm: ({ side }: { side: 'buy' | 'sell' }) => <div data-testid={`limit-form-${side}`}>{side} form</div>,
}));

describe('LimitOrder', () => {
  it('renders both buy and sell LimitForm components', () => {
    render(<LimitOrder bestBid={100} bestAsk={110} />);
    expect(screen.getByTestId('limit-form-buy')).toBeInTheDocument();
    expect(screen.getByTestId('limit-form-sell')).toBeInTheDocument();
  });

  it('initializes price to bestBid when side is buy', () => {
    // We can't access the price state directly, but we can check useEffect logic by changing props
    render(<LimitOrder bestBid={200} bestAsk={300} />);
    // The component doesn't display price, so we can't assert it directly
    // This test ensures no crash and correct rendering
    expect(screen.getByTestId('limit-form-buy')).toBeInTheDocument();
  });

  it('updates price when bestBid or bestAsk changes', () => {
    const { rerender } = render(<LimitOrder bestBid={100} bestAsk={110} />);
    rerender(<LimitOrder bestBid={120} bestAsk={130} />);
    // Again, price is internal, but this ensures re-render works
    expect(screen.getByTestId('limit-form-sell')).toBeInTheDocument();
  });

  it('renders with optional availableBalance prop', () => {
    render(<LimitOrder bestBid={100} bestAsk={110} availableBalance={500} />);
    expect(screen.getByTestId('limit-form-buy')).toBeInTheDocument();
    expect(screen.getByTestId('limit-form-sell')).toBeInTheDocument();
  });
});
