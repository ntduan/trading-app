import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { usePriceDirection } from './usePriceDirection';

describe('usePriceDirection', () => {
  it('should return null initially', () => {
    const { result } = renderHook(() => usePriceDirection());
    expect(result.current).toBeNull();
  });

  it('should return null if currentPrice is undefined', () => {
    const { result, rerender } = renderHook(({ price }) => usePriceDirection(price), {
      initialProps: { price: undefined },
    });
    expect(result.current).toBeNull();
    rerender({ price: undefined });
    expect(result.current).toBeNull();
  });

  it('should return null on first price set', () => {
    const { result, rerender } = renderHook(({ price }: { price: number | undefined }) => usePriceDirection(price), {
      initialProps: { price: 100 },
    });
    expect(result.current).toBeNull();
    rerender({ price: 100 });
    expect(result.current).toBeNull();
  });

  it('should return "up" when price increases', () => {
    const { result, rerender } = renderHook(({ price }) => usePriceDirection(price), {
      initialProps: { price: 100 },
    });
    rerender({ price: 110 });
    expect(result.current).toBe('up');
  });

  it('should return "down" when price decreases', () => {
    const { result, rerender } = renderHook(({ price }) => usePriceDirection(price), {
      initialProps: { price: 100 },
    });
    rerender({ price: 90 });
    expect(result.current).toBe('down');
  });

  it('should not change direction if price stays the same', () => {
    const { result, rerender } = renderHook(({ price }) => usePriceDirection(price), {
      initialProps: { price: 100 },
    });
    rerender({ price: 100 });
    expect(result.current).toBeNull();
    rerender({ price: 100 });
    expect(result.current).toBeNull();
  });

  it('should handle multiple changes correctly', () => {
    const { result, rerender } = renderHook(({ price }) => usePriceDirection(price), {
      initialProps: { price: 100 },
    });
    rerender({ price: 110 });
    expect(result.current).toBe('up');
    rerender({ price: 105 });
    expect(result.current).toBe('down');
    rerender({ price: 105 });
    expect(result.current).toBe('down');
    rerender({ price: 120 });
    expect(result.current).toBe('up');
  });

  it('should ignore undefined prices after initial set', () => {
    const { result, rerender } = renderHook(({ price }) => usePriceDirection(price), {
      initialProps: { price: 100 } as { price: number | undefined },
    });
    rerender({ price: 110 });
    expect(result.current).toBe('up');
    rerender({ price: undefined });
    expect(result.current).toBe('up');
    rerender({ price: 120 });
    expect(result.current).toBe('up');
  });
});
