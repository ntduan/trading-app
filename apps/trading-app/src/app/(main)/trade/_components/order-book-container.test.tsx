import { render, screen } from '@testing-library/react';
import { describe, it, vi, expect } from 'vitest';

import { OrderBookContainer } from './order-book-container';

// Mock child component
vi.mock('@/components/order-book/order-book', () => ({
  OrderBook: () => <div data-testid="order-book">Mocked Order Book</div>,
}));

describe('OrderBookContainer', () => {
  it('renders OrderBook tab and component by default', () => {
    render(<OrderBookContainer />);
    expect(screen.getByText('Order Book')).toBeInTheDocument();
    expect(screen.getByTestId('order-book')).toBeInTheDocument();
  });

  it('applies additional className to the Card container', () => {
    render(<OrderBookContainer className="custom-class" />);
    const card = screen.getByText('Order Book').closest("div[data-slot='card']"); // outer <Card>
    expect(card?.className).toContain('custom-class');
  });

  it('ensures OrderBook component is conditionally rendered only if loaded', () => {
    render(<OrderBookContainer />);
    const container = screen.getByTestId('order-book').parentElement;
    expect(container?.className).toContain('block');
  });
});
