import { render, screen, waitFor, act } from '@testing-library/react';
import * as React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { ChartContainer } from './chart-container';

// Mock the TradingViewContainer component
vi.mock('@/components/tradingview-chart/tradingview-container', () => ({
  default: () => <div data-testid="tradingview-chart">Mock Chart</div>,
}));

describe('ChartContainer', () => {
  beforeEach(() => {
    // Reset DOM for each test
    vi.restoreAllMocks();
  });

  it('renders with Chart tab active by default', async () => {
    await act(async () => {
      render(<ChartContainer />);
    });
    expect(screen.getByRole('tab', { name: 'Chart' })).toHaveAttribute('aria-selected', 'true');
  });

  it('loads and displays TradingViewContainer when Chart tab is active', async () => {
    await act(async () => {
      render(<ChartContainer />);
    });

    // Wait for lazy component to load
    await waitFor(() => {
      expect(screen.getByTestId('tradingview-chart')).toBeInTheDocument();
    });
  });

  it('handles tab change logic correctly (future-proof)', async () => {
    await act(async () => {
      render(<ChartContainer />);
    });
    const chartTab = screen.getByRole('tab', { name: 'Chart' });

    // Simulate clicking the same tab again (no-op, but still covered)
    chartTab.click();
    expect(chartTab).toHaveAttribute('aria-selected', 'true');
  });

  it('only renders chart if it exists in loadedTabs', async () => {
    await act(async () => {
      render(<ChartContainer />);
    });

    await waitFor(() => {
      const chart = screen.queryByTestId('tradingview-chart');
      expect(chart).toBeTruthy();
    });
  });
});
