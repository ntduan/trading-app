import { renderHook } from '@testing-library/react';
import { Provider } from 'jotai';
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { useExchangeAdapter } from '../useExchangeAdapter';

import * as binanceModule from '@/adapters/binance';
import type * as createExchangeAdapterModule from '@/adapters/createExchangeAdapter';

// Mock the binance adapter and its return value
const mockAdapter = { name: 'mockAdapter' } as createExchangeAdapterModule.IExchangeAdapter;
const mockBinance = vi.fn(() => vi.fn(() => mockAdapter));

describe('useExchangeAdapter', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    vi.spyOn(binanceModule, 'binance').mockImplementation(mockBinance as unknown as typeof binanceModule.binance);
  });

  it('should memoize the returned object', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => <Provider>{children}</Provider>;
    const { result, rerender } = renderHook(() => useExchangeAdapter(), { wrapper });
    const firstResult = result.current;
    rerender();
    expect(result.current).toBe(firstResult);
  });
});
