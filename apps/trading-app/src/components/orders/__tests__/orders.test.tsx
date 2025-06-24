import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect } from 'vitest';
import { Orders } from '../orders';

// Basic test for Orders component

describe('Orders', () => {
  it('renders the orders table', () => {
    const queryClient = new QueryClient();
    const { getByTestId } = render(
      <QueryClientProvider client={queryClient}>
        <Orders />
      </QueryClientProvider>
    );
    // Check for the orders table by test id
    expect(getByTestId('orders-table')).toBeInTheDocument();
  });
});
