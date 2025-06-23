import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { useAllTradingPairs } from './useAllTradingPairs';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        gcTime: 0,
        retry: false,
        // ✅ Enable prefetch in render
        experimental_prefetchInRender: true,
      },
    },
    queryCache: new QueryClient().getQueryCache(),
    mutationCache: new QueryClient().getMutationCache(),
  });
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  Wrapper.displayName = 'QueryClientProviderWrapper';
  return Wrapper;
};

describe('useAllTradingPairs', () => {
  const mockPairs = [{ id: 'BTC-USD' }, { id: 'ETH-USD' }];
  // Use 'any' to avoid type incompatibility issues with vi.spyOn and fetch
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any*/
  let fetchSpy: any;

  beforeEach(() => {
    fetchSpy = vi.spyOn(global, 'fetch');
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('fetches trading pairs successfully', async () => {
    fetchSpy.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ result: mockPairs }),
    } as Response);

    const { result } = renderHook(() => useAllTradingPairs(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockPairs);
    expect(fetchSpy).toHaveBeenCalledWith('/api/pairs');
  });

  it('throws error when fetch fails', async () => {
    fetchSpy.mockResolvedValueOnce(
      new Response('{}', {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    );
    const { result } = renderHook(() => useAllTradingPairs(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe('Failed to fetch trading pairs');
  });

  it('does not refetch on window focus, mount, or reconnect', async () => {
    fetchSpy.mockResolvedValue({
      ok: true,
      json: async () => ({ result: mockPairs }),
    } as Response);

    const { result, rerender } = renderHook(() => useAllTradingPairs(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    rerender();
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });
});
