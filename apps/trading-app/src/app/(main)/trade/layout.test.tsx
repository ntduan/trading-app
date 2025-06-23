import { render } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('./_components/trading-interface', () => ({
  TradingInterface: () => <div data-testid="trading-interface" />,
}));

import TradeLayout from './layout';

describe('TradeLayout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders TradingInterface and children', async () => {
    const ChildComponent = <div data-testid="child-content">Hello Child</div>;

    // TradeLayout is async so we need to await rendering
    const { findByTestId } = render(await TradeLayout({ children: ChildComponent }));

    expect(await findByTestId('trading-interface')).toBeInTheDocument();
    expect(await findByTestId('child-content')).toHaveTextContent('Hello Child');
  });
});
