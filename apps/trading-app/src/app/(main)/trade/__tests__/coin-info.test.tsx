import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CoinInfo } from '../_components/coin-info';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

describe('CoinInfo', () => {
  it('renders without crashing', () => {
    const queryClient = new QueryClient();
    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <CoinInfo />
      </QueryClientProvider>
    );
    expect(container).toBeTruthy();
  });
});
