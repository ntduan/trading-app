import { render, screen } from '@testing-library/react';
import { describe, it, vi, expect } from 'vitest';

import { OrderbookContainer } from './orderbook-container';

// Mock child component
vi.mock('@/components/orderbook/orderbook', () => ({
  Orderbook: () => <div data-testid="orderbook">Mocked Order Book</div>,
}));

describe('OrderbookContainer', () => {
  it('renders Orderbook tab and component by default', () => {
    render(<OrderbookContainer />);
    expect(screen.getByText('Order Book')).toBeInTheDocument();
    expect(screen.getByTestId('orderbook')).toBeInTheDocument();
  });

  it('applies additional className to the Card container', () => {
    render(<OrderbookContainer className="custom-class" />);
    const card = screen.getByText('Order Book').closest("div[data-slot='card']"); // outer <Card>
    expect(card?.className).toContain('custom-class');
  });

  it('ensures Orderbook component is conditionally rendered only if loaded', () => {
    render(<OrderbookContainer />);
    const container = screen.getByTestId('orderbook').parentElement;
    expect(container?.className).toContain('block');
  });
});
