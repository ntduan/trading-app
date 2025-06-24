import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AccountInfo } from '../account-info';

// Test for the AccountInfo component

describe('AccountInfo', () => {
  const queryClient = new QueryClient();
  it('renders available and current position labels', () => {
    const { getByText } = render(
      <QueryClientProvider client={queryClient}>
        <AccountInfo side="buy" />
      </QueryClientProvider>
    );
    // Check for the labels
    expect(getByText(/available/i)).toBeInTheDocument();
    expect(getByText(/current position/i)).toBeInTheDocument();
  });
});
