import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { HistoryContainer } from '../_components/history-container';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

describe('HistoryContainer', () => {
  it('renders without crashing', () => {
    const queryClient = new QueryClient();
    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <HistoryContainer className="" />
      </QueryClientProvider>
    );
    expect(container).toBeTruthy();
  });
});
