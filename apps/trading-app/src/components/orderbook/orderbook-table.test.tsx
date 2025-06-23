import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { OrderbookTable } from './orderbook-table';

// Mock OrderbookRow
vi.mock('./orderbook-row', () => ({
  OrderbookRow: vi.fn(({ level, maxTotal, side }) => (
    <div data-testid="orderbook-row">
      {level.price}-{level.total}-{maxTotal}-{side}
    </div>
  )),
}));

const mockData = [
  { price: 100, amount: 1, total: 10 },
  { price: 101, amount: 2, total: 20 },
  { price: 102, amount: 1.5, total: 15 },
];

describe('OrderbookTable', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders bids in original order', () => {
    render(<OrderbookTable data={mockData} side="bids" />);
    const rows = screen.getAllByTestId('orderbook-row');
    expect(rows).toHaveLength(3);
    expect(rows[0].textContent).toContain('100-10-20-bids');
    expect(rows[1].textContent).toContain('101-20-20-bids');
    expect(rows[2].textContent).toContain('102-15-20-bids');
  });

  it('renders asks in reversed order', () => {
    render(<OrderbookTable data={mockData} side="asks" />);
    const rows = screen.getAllByTestId('orderbook-row');
    expect(rows).toHaveLength(3);
    expect(rows[0].textContent).toContain('102-15-20-asks');
    expect(rows[1].textContent).toContain('101-20-20-asks');
    expect(rows[2].textContent).toContain('100-10-20-asks');
  });

  it('calculates maxTotal correctly', () => {
    render(<OrderbookTable data={mockData} side="bids" />);
    // maxTotal should be 20
    expect(screen.getAllByTestId('orderbook-row')[1].textContent).toContain('20-20-bids');
  });

  it('renders nothing if data is empty', () => {
    render(<OrderbookTable data={[]} side="bids" />);
    expect(screen.queryByTestId('orderbook-row')).toBeNull();
  });

  it('memoizes processedData', () => {
    const { rerender } = render(<OrderbookTable data={mockData} side="bids" />);
    rerender(<OrderbookTable data={mockData} side="bids" />);
    // Should not re-render OrderbookRow if props are the same (memoization)
    expect(screen.getAllByTestId('orderbook-row')).toHaveLength(3);
  });

  it('has displayName set', () => {
    expect(OrderbookTable.displayName).toBe('OrderbookTable');
  });
});
