/* eslint-disable @typescript-eslint/no-explicit-any */
import { renderHook, act } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as jotai from 'jotai';

import {
  useOrderbook,
  useOrderbookWorker,
  useOrderbookSnapshot,
  useOrderbookSubscription,
} from '../useOrderbook';

vi.mock('jotai', async (importOriginal) => {
  const actual = await importOriginal<any>();
  return {
    ...actual,
    useSetAtom: vi.fn(() => vi.fn()),
    useAtomValue: vi.fn(() => undefined),
    useStore: vi.fn(() => ({
      sub: vi.fn(() => vi.fn()),
      get: vi.fn(() => null),
    })),
  };
});

vi.mock('./useExchangeAdapter', () => ({
  useExchangeAdapter: () => ({
    adapter: {
      subscribeOrderbook: vi.fn(() => vi.fn()),
    },
  }),
}));

describe('useOrderbook hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('useOrderbookWorker returns a post function', () => {
    const { result } = renderHook(() => useOrderbookWorker());
    expect(typeof result.current.post).toBe('function');
  });

  it('useOrderbook returns null initially', () => {
    const { result } = renderHook(() => useOrderbook());
    expect(result.current).toBeNull();
  });

  it('useOrderbookSnapshot returns null if no data', () => {
    const { result } = renderHook(() => useOrderbookSnapshot('BTCUSDT'));
    expect(result.current).toBeNull();
  });

  it('useOrderbookSubscription returns connection state', () => {
    const { result } = renderHook(() => useOrderbookSubscription());
    expect(result.current).toHaveProperty('isConnected');
    expect(result.current).toHaveProperty('symbol');
  });
});
