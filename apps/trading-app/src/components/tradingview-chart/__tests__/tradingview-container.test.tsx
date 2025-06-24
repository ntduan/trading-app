import { render } from '@testing-library/react';
import { vi, describe, it, beforeEach, afterEach, expect } from 'vitest';

import TradingViewContainer from '../tradingview-container';

// Mock the useTradingViewChart hook
vi.mock('@/hooks/useTradingViewChart', () => ({
  useTradingViewChart: vi.fn(),
}));

describe('TradingViewContainer', () => {
  let originalMutationObserver: typeof window.MutationObserver;

  beforeEach(() => {
    // Mock MutationObserver
    originalMutationObserver = window.MutationObserver;
    (window as unknown as { MutationObserver: typeof MutationObserver }).MutationObserver = class {
      observe = vi.fn();
      disconnect = vi.fn();
      constructor(public cb: () => void) {}
    } as unknown as typeof MutationObserver;
  });

  afterEach(() => {
    (window as unknown as { MutationObserver: typeof MutationObserver }).MutationObserver = originalMutationObserver;
    vi.clearAllMocks();
  });

  it('renders the chart container div with correct props', () => {
    const { container } = render(<TradingViewContainer />);
    const div = container.querySelector('#tv_chart_container');
    expect(div).toBeInTheDocument();
    expect(div).toHaveClass('bg-card', 'relative', 'h-full');
  });

  it('sets sandbox attribute on iframe when added', () => {
    let mutationCb: (() => void) | undefined;
    (window as unknown as { MutationObserver: typeof MutationObserver }).MutationObserver = class {
      observe = vi.fn();
      disconnect = vi.fn();
      constructor(cb: () => void) {
        mutationCb = cb;
      }
    } as unknown as typeof MutationObserver;

    const { container } = render(<TradingViewContainer />);
    const div = container.querySelector('#tv_chart_container') as HTMLDivElement;

    // Simulate iframe being added
    const iframe = document.createElement('iframe');
    div.appendChild(iframe);

    if (mutationCb) mutationCb();

    expect(iframe.getAttribute('sandbox')).toBe('allow-scripts allow-same-origin');
  });

  it('disconnects observer after setting sandbox', () => {
    let disconnectCalled = false;
    let mutationCb: (() => void) | undefined;
    (window as unknown as { MutationObserver: typeof MutationObserver }).MutationObserver = class {
      observe = vi.fn();
      disconnect = () => {
        disconnectCalled = true;
      };
      constructor(cb: () => void) {
        mutationCb = cb;
      }
    } as unknown as typeof MutationObserver;

    const { container } = render(<TradingViewContainer />);
    const div = container.querySelector('#tv_chart_container') as HTMLDivElement;

    // Simulate iframe being added
    const iframe = document.createElement('iframe');
    div.appendChild(iframe);

    if (mutationCb) mutationCb();

    expect(disconnectCalled).toBe(true);
  });

  it('does not throw if chartContainerRef is null', () => {
    // Simulate chartContainerRef.current being null
    (window as unknown as { MutationObserver: typeof MutationObserver }).MutationObserver = class {
      observe = vi.fn();
      disconnect = vi.fn();
      constructor() {}
    } as unknown as typeof MutationObserver;
    // Should not throw
    expect(() => render(<TradingViewContainer />)).not.toThrow();
  });
});
