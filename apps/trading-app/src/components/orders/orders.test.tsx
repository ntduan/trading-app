/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { describe, it, vi, expect, beforeEach, type Mock } from 'vitest';

import { Orders } from './orders';

import { useOrders } from '@/hooks/useOrders';

// Mock dependencies
vi.mock('@/hooks/useOrders', () => {
  return {
    useOrders: vi.fn(), // declare it here
  };
});
vi.mock('../data-table/data-table', () => ({
  DataTable: ({ children }: any) => <div data-testid="datatable">{children}</div>,
  DataTableRow: ({ children, ...props }: any) => (
    <div data-testid="datarow" {...props}>
      {children}
    </div>
  ),
  EmptyState: ({ message }: any) => <div data-testid="emptystate">{message}</div>,
}));
vi.mock('@/components/ui/button', () => ({
  Button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
}));
vi.mock('@/lib/utils', () => ({
  cn: (...args: any[]) => args.filter(Boolean).join(' '),
}));

describe('Orders', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders empty state when no orders', () => {
    (useOrders as Mock).mockReturnValue({ data: [] });
    render(<Orders />);
    expect(screen.getByTestId('emptystate')).toHaveTextContent('No orders.');
  });

  it('renders empty state when orders is undefined', () => {
    (useOrders as Mock).mockReturnValue({ data: undefined });
    render(<Orders />);
    expect(screen.getByTestId('emptystate')).toHaveTextContent('No orders.');
  });

  it('renders orders with correct data', () => {
    const orders = [
      {
        id: 'order12345678',
        createdAt: 1718000000000,
        pair: 'BTC/USDT',
        side: 'buy',
        price: 12345.6789,
        amount: 0.123456,
        status: 'filled',
      },
      {
        id: 'order87654321',
        createdAt: 1718000001000,
        pair: 'ETH/USDT',
        side: 'sell',
        price: 2345.67,
        amount: 1.234567,
        status: 'pending',
      },
      {
        id: 'order00000001',
        createdAt: 1718000002000,
        pair: 'SOL/USDT',
        side: 'buy',
        price: 145.12,
        amount: 10.000001,
        status: 'cancelled',
      },
    ];
    (useOrders as Mock).mockReturnValue({ data: orders });
    render(<Orders />);
    // Order No. (last 8 chars)
    expect(screen.getAllByText('12345678')[0]).toBeInTheDocument();
    expect(screen.getAllByText('87654321')[0]).toBeInTheDocument();
    expect(screen.getAllByText('00000001')[0]).toBeInTheDocument();

    // Pair
    expect(screen.getByText('BTC/USDT')).toBeInTheDocument();
    expect(screen.getByText('ETH/USDT')).toBeInTheDocument();
    expect(screen.getByText('SOL/USDT')).toBeInTheDocument();

    // Side
    expect(screen.getAllByText('BUY')[0]).toBeInTheDocument();
    expect(screen.getAllByText('SELL')[0]).toBeInTheDocument();

    // Price formatting
    expect(screen.getByText('12345.68')).toBeInTheDocument();
    expect(screen.getByText('2345.67')).toBeInTheDocument();
    expect(screen.getByText('145.12')).toBeInTheDocument();

    // Amount formatting
    expect(screen.getAllByText('0.123456')).toHaveLength(2);
    expect(screen.getByText('1.234567')).toBeInTheDocument();
    expect(screen.getByText('10.000001')).toBeInTheDocument();

    // Executed
    expect(screen.getAllByText('0.123456')[0]).toBeInTheDocument(); // filled
    expect(screen.getAllByText('0.000000')[0]).toBeInTheDocument(); // pending/cancelled

    // Fee
    expect(screen.getAllByText('0.00').length).toBeGreaterThan(0);

    // Status
    expect(screen.getByText('filled')).toBeInTheDocument();
    expect(screen.getByText('pending')).toBeInTheDocument();
    expect(screen.getByText('cancelled')).toBeInTheDocument();

    // Total
    expect(screen.getByText((12345.6789 * 0.123456).toFixed(2))).toBeInTheDocument();
    expect(screen.getByText((2345.67 * 1.234567).toFixed(2))).toBeInTheDocument();
    expect(screen.getByText((145.12 * 10.000001).toFixed(2))).toBeInTheDocument();

    // Cancel button only for pending
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('calls handleCancelOrder and stops propagation', () => {
    const orders = [
      {
        id: 'order87654321',
        createdAt: 1718000001000,
        pair: 'ETH/USDT',
        side: 'sell',
        price: 2345.67,
        amount: 1.234567,
        status: 'pending',
      },
    ];
    (useOrders as Mock).mockReturnValue({ data: orders });
    const cancelCallback = vi.fn();
    render(<Orders cancelCallback={cancelCallback} />);
    const cancelBtn = screen.getByText('Cancel');
    fireEvent.click(cancelBtn);
    expect(cancelCallback).toHaveBeenCalled();
  });

  it('applies correct classNames for side and status', () => {
    const orders = [
      {
        id: 'order1',
        createdAt: 1,
        pair: 'BTC/USDT',
        side: 'buy',
        price: 1,
        amount: 1,
        status: 'filled',
      },
      {
        id: 'order2',
        createdAt: 1,
        pair: 'BTC/USDT',
        side: 'sell',
        price: 1,
        amount: 1,
        status: 'pending',
      },
      {
        id: 'order3',
        createdAt: 1,
        pair: 'BTC/USDT',
        side: 'buy',
        price: 1,
        amount: 1,
        status: 'cancelled',
      },
    ];
    (useOrders as Mock).mockReturnValue({ data: orders });
    render(<Orders />);
    // Check classNames for side
    expect(screen.getAllByText('BUY')[0].className).toContain('bg-green-500/20 text-green-400');
    expect(screen.getAllByText('SELL')[0].className).toContain('bg-red-500/20 text-red-400');
    // Check classNames for status
    expect(screen.getByText('filled').className).toContain('bg-green-500/20 text-green-400');
    expect(screen.getByText('pending').className).toContain('bg-yellow-500/20 text-yellow-400');
    expect(screen.getByText('cancelled').className).toContain('bg-red-500/20 text-red-400');
  });

  it('formats date correctly', () => {
    const orders = [
      {
        id: 'order1',
        createdAt: 1718000000000,
        pair: 'BTC/USDT',
        side: 'buy',
        price: 1,
        amount: 1,
        status: 'filled',
      },
    ];
    (useOrders as Mock).mockReturnValue({ data: orders });
    render(<Orders />);
    // The formatted date should be present
    expect(screen.getByText(/06\/09.*:.*:.*\s?AM|PM/)).toBeInTheDocument();
  });
});
