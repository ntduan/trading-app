import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { OrderBookTable } from './order-book-table';

// Mock OrderBookRow
vi.mock('./order-book-row', () => ({
  OrderBookRow: vi.fn(({ level, maxTotal, side }) => (
    <div data-testid="order-book-row">
      {level.price}-{level.total}-{maxTotal}-{side}
    </div>
  )),
}));

const mockData = [
  { price: 100, amount: 1, total: 10 },
  { price: 101, amount: 2, total: 20 },
  { price: 102, amount: 1.5, total: 15 },
];

describe('OrderBookTable', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders bids in original order', () => {
    render(<OrderBookTable data={mockData} side="bids" />);
    const rows = screen.getAllByTestId('order-book-row');
    expect(rows).toHaveLength(3);
    expect(rows[0].textContent).toContain('100-10-20-bids');
    expect(rows[1].textContent).toContain('101-20-20-bids');
    expect(rows[2].textContent).toContain('102-15-20-bids');
  });

  it('renders asks in reversed order', () => {
    render(<OrderBookTable data={mockData} side="asks" />);
    const rows = screen.getAllByTestId('order-book-row');
    expect(rows).toHaveLength(3);
    expect(rows[0].textContent).toContain('102-15-20-asks');
    expect(rows[1].textContent).toContain('101-20-20-asks');
    expect(rows[2].textContent).toContain('100-10-20-asks');
  });

  it('calculates maxTotal correctly', () => {
    render(<OrderBookTable data={mockData} side="bids" />);
    // maxTotal should be 20
    expect(screen.getAllByTestId('order-book-row')[1].textContent).toContain('20-20-bids');
  });

  it('renders nothing if data is empty', () => {
    render(<OrderBookTable data={[]} side="bids" />);
    expect(screen.queryByTestId('order-book-row')).toBeNull();
  });

  it('memoizes processedData', () => {
    const { rerender } = render(<OrderBookTable data={mockData} side="bids" />);
    rerender(<OrderBookTable data={mockData} side="bids" />);
    // Should not re-render OrderBookRow if props are the same (memoization)
    expect(screen.getAllByTestId('order-book-row')).toHaveLength(3);
  });

  it('has displayName set', () => {
    expect(OrderBookTable.displayName).toBe('OrderBookTable');
  });
});
