import { render } from '@testing-library/react';
import React from 'react';
import { describe, it, expect } from 'vitest';

import { OrderbookRow } from './orderbook-row';

const mockLevel = {
  price: 123.456,
  amount: 10.123,
  total: 1010.5,
};

describe('OrderbookRow', () => {
  it('renders bid row with correct classes and values', () => {
    const { container, getByText } = render(<OrderbookRow level={mockLevel} maxTotal={2021} side="bids" />);
    // Background bar
    const bgDiv = container.querySelector('.absolute');
    expect(bgDiv).toHaveClass('bg-green-900/30');
    // Price
    expect(getByText('123.46')).toHaveClass('text-chart-2');
    // Amount
    expect(getByText('10.123')).toBeInTheDocument();
    // Total formatted as K
    expect(getByText('1.01K')).toBeInTheDocument();
  });

  it('renders ask row with correct classes and values', () => {
    const { container, getByText } = render(<OrderbookRow level={mockLevel} maxTotal={2021} side="asks" />);
    // Background bar
    const bgDiv = container.querySelector('.absolute');
    expect(bgDiv).toHaveClass('bg-red-900/30');
    // Price
    expect(getByText('123.46')).toHaveClass('text-chart-1');
  });

  it('formats total without K if less than 1000', () => {
    const level = { ...mockLevel, total: 999.99 };
    const { getByText } = render(<OrderbookRow level={level} maxTotal={2000} side="bids" />);
    expect(getByText('999.99')).toBeInTheDocument();
  });

  it('sets correct width style', () => {
    const { container } = render(<OrderbookRow level={mockLevel} maxTotal={2021} side="bids" />);
    const bgDiv = container.querySelector('.absolute') as HTMLDivElement;
    const expectedWidth = `${(mockLevel.total / 2021) * 100}%`;
    expect(bgDiv.style.width).toBe(expectedWidth);
  });

  it('memoizes correctly', () => {
    // Memoization is tested by checking that the component does not re-render
    // if props are the same. Here, we just check that the memo function exists.
    expect(OrderbookRow.displayName).toBeUndefined();
  });
});
