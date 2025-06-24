import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { OrderbookContainer } from '../_components/orderbook-container';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

describe('OrderbookContainer', () => {
  it('renders without crashing', () => {
    const queryClient = new QueryClient();
    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <OrderbookContainer />
      </QueryClientProvider>
    );
    expect(container).toBeTruthy();
  });
});
