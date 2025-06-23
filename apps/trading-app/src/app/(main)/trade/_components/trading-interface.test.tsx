import { render, screen } from '@testing-library/react';
import { describe, it, vi, expect } from 'vitest';

import { TradingInterface } from './trading-interface';

// Mock all child components
vi.mock('./trading-pair-check', () => ({
  TradingPairCheck: () => <div data-testid="trading-pair-check">TradingPairCheck</div>,
}));
vi.mock('./coin-info', () => ({
  CoinInfo: () => <div data-testid="coin-info">CoinInfo</div>,
}));
vi.mock('./orderbook-container', () => ({
  OrderbookContainer: ({ className }: { className?: string }) => (
    <div data-testid="orderbook" className={className}>
      OrderbookContainer
    </div>
  ),
}));
vi.mock('./chart-container', () => ({
  ChartContainer: () => <div data-testid="chart-container">ChartContainer</div>,
}));
vi.mock('./order-container', () => ({
  OrderContainer: () => <div data-testid="order-container">OrderContainer</div>,
}));
vi.mock('./history-container', () => ({
  HistoryContainer: () => <div data-testid="history-container">HistoryContainer</div>,
}));

describe('TradingInterface', () => {
  it('renders all major components', () => {
    render(<TradingInterface />);

    expect(screen.getByTestId('trading-pair-check')).toBeInTheDocument();
    expect(screen.getByTestId('coin-info')).toBeInTheDocument();
    expect(screen.getByTestId('orderbook')).toBeInTheDocument();
    expect(screen.getByTestId('chart-container')).toBeInTheDocument();
    expect(screen.getByTestId('order-container')).toBeInTheDocument();
    expect(screen.getByTestId('history-container')).toBeInTheDocument();
  });

  it('passes className prop to OrderbookContainer', () => {
    render(<TradingInterface />);
    const orderbook = screen.getByTestId('orderbook');
    expect(orderbook.className).toContain('row-span-2');
  });
});
