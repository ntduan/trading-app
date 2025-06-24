/* eslint-disable @typescript-eslint/no-explicit-any */
import * as reactQuery from '@tanstack/react-query';
import { renderHook } from '@testing-library/react';
import * as jotai from 'jotai';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useOrders } from '../useOrders';

import { QUERY_KEYS } from '@/constants';

vi.mock('jotai', async (importOriginal) => {
  const actual = await importOriginal<any>();
  return {
    ...actual,
    getDefaultStore: vi.fn(),
  };
});

vi.mock('@tanstack/react-query', async (importOriginal) => {
  const actual = await importOriginal<any>();
  return {
    ...actual,
    useQuery: vi.fn(),
  };
});

vi.mock('@/constants', () => ({
  QUERY_KEYS: { ORDERS: 'ORDERS' },
}));
vi.mock('@/state/atoms', () => ({
  _ordersAtom: Symbol('_ordersAtom'),
}));

describe('useOrders', () => {
  const mockOrders = [{ id: 1, symbol: 'AAPL' }];
  let getDefaultStoreMock: any;
  let useQueryMock: any;

  beforeEach(() => {
    getDefaultStoreMock = vi.fn().mockReturnValue({
      get: vi.fn().mockReturnValue(mockOrders),
    });
    (jotai.getDefaultStore as any).mockImplementation(getDefaultStoreMock);

    useQueryMock = vi.fn();
    (reactQuery.useQuery as any).mockImplementation(useQueryMock);
  });

  it('should call useQuery with correct queryKey and queryFn', async () => {
    // Arrange
    useQueryMock.mockImplementation(({ queryKey, queryFn }: { queryKey: unknown; queryFn: () => unknown }) => {
      return { data: mockOrders, queryKey, queryFn };
    });

    // Act
    const { result } = renderHook(() => useOrders());

    // Assert
    expect(useQueryMock).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: [QUERY_KEYS.ORDERS],
        queryFn: expect.any(Function),
      })
    );
    expect(result.current.data).toEqual(mockOrders);
  });

  it('queryFn should resolve with orders from jotai store', async () => {
    // Arrange
    let queryFn: any;
    useQueryMock.mockImplementation(({ queryFn: fn }: { queryFn: () => unknown }) => {
      queryFn = fn;
      return { data: undefined };
    });

    renderHook(() => useOrders());

    // Act
    const result = await queryFn();

    // Assert
    expect(getDefaultStoreMock).toHaveBeenCalled();
    expect(result).toEqual(mockOrders);
  });

  it('should propagate errors from queryFn', async () => {
    // Arrange
    const error = new Error('Failed to get orders');
    getDefaultStoreMock = vi.fn().mockReturnValue({
      get: vi.fn(() => {
        throw error;
      }),
    });
    (jotai.getDefaultStore as any).mockImplementation(getDefaultStoreMock);

    let queryFn: any;
    useQueryMock.mockImplementation(({ queryFn: fn }: { queryFn: () => unknown }) => {
      queryFn = fn;
      return { data: undefined };
    });

    renderHook(() => useOrders());

    // Act & Assert
    await expect(queryFn()).rejects.toThrow('Failed to get orders');
  });
});
