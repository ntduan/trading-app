import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { getDefaultStore } from 'jotai';
import React from 'react';
import { vi, expect, describe, it, type Mock } from 'vitest';

import { useUserBalance } from './useUserBalance';

import { _amountAtom } from '@/state/atoms';

// Mock getDefaultStore from jotai
vi.mock('jotai', async () => {
  const actual = await vi.importActual('jotai');
  return {
    ...actual,
    getDefaultStore: vi.fn(),
  };
});

describe('useUserBalance', () => {
  const createWrapper = () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
    Wrapper.displayName = 'QueryClientProviderWrapper';
    return Wrapper;
  };

  it('executes queryFn and returns the balance', async () => {
    const mockBalance = 123.45;

    const mockStore = {
      get: vi.fn().mockReturnValue(mockBalance),
    };

    (getDefaultStore as unknown as Mock).mockReturnValue(mockStore);

    const { result } = renderHook(() => useUserBalance(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toBe(mockBalance);
    expect(mockStore.get).toHaveBeenCalledWith(_amountAtom);
  });
});
