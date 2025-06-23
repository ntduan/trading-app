import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { OrderbookMidPrice } from './order-book-mid-price';

describe('OrderbookMidPrice', () => {
  it('renders price with no direction', () => {
    render(<OrderbookMidPrice price={123.45} direction={null} />);
    expect(screen.getByText('123.45')).toBeInTheDocument();
    expect(screen.getByText('($123.45)')).toBeInTheDocument();
    // No arrow should be present
    expect(screen.queryByText('↑')).not.toBeInTheDocument();
    expect(screen.queryByText('↓')).not.toBeInTheDocument();
  });

  it('renders price with up direction', () => {
    render(<OrderbookMidPrice price={99.99} direction="up" />);
    expect(screen.getByText('99.99')).toBeInTheDocument();
    expect(screen.getByText('($99.99)')).toBeInTheDocument();
    expect(screen.getByText('↑')).toBeInTheDocument();
  });

  it('renders price with down direction', () => {
    render(<OrderbookMidPrice price={88.88} direction="down" />);
    expect(screen.getByText('88.88')).toBeInTheDocument();
    expect(screen.getByText('($88.88)')).toBeInTheDocument();
    expect(screen.getByText('↓')).toBeInTheDocument();
  });

  it('applies correct color class for up direction', () => {
    render(<OrderbookMidPrice price={1} direction="up" />);
    const priceDiv = screen.getByText('1.00');
    expect(priceDiv?.className).toContain('text-chart-2');
  });

  it('applies correct color class for down direction', () => {
    render(<OrderbookMidPrice price={2} direction="down" />);
    const priceDiv = screen.getByText('2.00');
    expect(priceDiv?.className).toContain('text-chart-1');
  });

  it('applies correct color class for null direction', () => {
    render(<OrderbookMidPrice price={3} direction={null} />);
    const priceDiv = screen.getByText('3.00');
    expect(priceDiv?.className).toContain('text-foreground');
  });

  it('formats price to two decimal places', () => {
    render(<OrderbookMidPrice price={12.3456} direction={null} />);
    expect(screen.getByText('12.35')).toBeInTheDocument();
    expect(screen.getByText('($12.35)')).toBeInTheDocument();
  });
});
