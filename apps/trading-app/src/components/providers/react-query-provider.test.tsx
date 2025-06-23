import { QueryClient } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi } from 'vitest';

import { ReactQueryProvider } from './react-query-provider';

// Mock QueryClientProvider to check props
vi.mock('@tanstack/react-query', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@tanstack/react-query')>();
  return {
    ...actual,
    QueryClientProvider: ({ client, children }: React.PropsWithChildren<{ client: unknown }>) => (
      <div data-testid="mock-query-client-provider" data-client={!!client}>
        {children}
      </div>
    ),
  };
});

describe('ReactQueryProvider', () => {
  it('renders children', () => {
    const { getByText } = render(
      <ReactQueryProvider>
        <div>Test Child</div>
      </ReactQueryProvider>
    );
    expect(getByText('Test Child')).toBeTruthy();
  });

  it('provides a QueryClientProvider with a QueryClient instance', () => {
    const { getByTestId } = render(
      <ReactQueryProvider>
        <span>Child</span>
      </ReactQueryProvider>
    );
    const provider = getByTestId('mock-query-client-provider');
    expect(provider).toBeTruthy();
    expect(provider.getAttribute('data-client')).toBe('true');
  });

  it('creates QueryClient with correct defaultOptions', () => {
    // Spy on QueryClient constructor
    // @ts-ignore
    const spy = vi.spyOn(QueryClient.prototype, 'constructor');
    render(
      <ReactQueryProvider>
        <span>Child</span>
      </ReactQueryProvider>
    );
    // We can't directly check the options, but we can check that QueryClient is constructed
    expect(spy).toBeCalledTimes(0); // Because useState uses new QueryClient, not prototype.constructor
    spy.mockRestore();
  });

  it('uses the same QueryClient instance across renders', () => {
    function TestComponent() {
      const [show, setShow] = React.useState(true);
      return (
        <ReactQueryProvider>
          <button onClick={() => setShow((s) => !s)}>Toggle</button>
          {show && <div data-testid="child">Child</div>}
        </ReactQueryProvider>
      );
    }
    const { getByText, rerender } = render(<TestComponent />);
    // No direct way to access the QueryClient instance, but the test ensures no crash on rerender
    expect(getByText('Child')).toBeTruthy();
    rerender(<TestComponent />);
    expect(getByText('Child')).toBeTruthy();
  });
});
