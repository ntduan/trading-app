import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ChartContainer } from '../_components/chart-container';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

describe('ChartContainer', () => {
  it('renders without crashing', () => {
    const queryClient = new QueryClient();
    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <ChartContainer />
      </QueryClientProvider>
    );
    expect(container).toBeTruthy();
  });
});
