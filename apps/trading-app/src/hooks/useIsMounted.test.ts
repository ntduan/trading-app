import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { useMounted } from './useIsMounted';

describe('useMounted', () => {
  it('should return true after mount', () => {
    const { result } = renderHook(() => useMounted());
    expect(result.current).toBe(true);
  });
});
