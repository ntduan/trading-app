import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, vi, beforeEach, expect } from 'vitest';

import { HistoryContainer } from './history-container';

// Mock child components
vi.mock('@/components/orders/orders', () => ({
  Orders: () => <div data-testid="orders-component">Orders Component</div>,
}));
vi.mock('@/components/positions/positions', () => ({
  Positions: () => <div data-testid="positions-component">Positions Component</div>,
}));

describe('HistoryContainer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders SnackbarProvider and default "Orders" tab', () => {
    render(<HistoryContainer />);
    expect(screen.getByText('Orders')).toBeInTheDocument();
    expect(screen.getByText('Positions')).toBeInTheDocument();
    expect(screen.getByTestId('orders-component')).toBeInTheDocument();
    expect(screen.queryByTestId('positions-component')).not.toBeInTheDocument();
  });

  it('switches to "Positions" tab and renders it', async () => {
    render(<HistoryContainer />);
    const user = userEvent.setup();

    // Click "Positions"
    await user.click(screen.getByText('Positions'));

    expect((await screen.findByTestId('positions-component')).parentElement).toHaveClass('block');
    expect(screen.queryByTestId('orders-component')?.parentElement).toHaveClass('hidden'); // still in DOM but hidden
  });

  it('reverts to "Orders" tab after switching', async () => {
    render(<HistoryContainer />);
    const user = userEvent.setup();

    // Switch to Positions then back
    await user.click(screen.getByText('Positions'));
    expect((await screen.findByTestId('positions-component')).parentElement).toHaveClass('block');

    await user.click(screen.getByText('Orders'));
    expect(screen.queryByTestId('orders-component')?.parentElement).toHaveClass('block');
  });

  it('ensures lazy loading: Positions component not rendered until visited', () => {
    render(<HistoryContainer />);
    expect(screen.queryByTestId('positions-component')).not.toBeInTheDocument();
  });
});
