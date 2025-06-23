import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';

import { useIsDesktop } from './useIsDesktop';

// Mock usehooks-ts module
vi.mock('usehooks-ts', () => ({
  useMediaQuery: vi.fn(),
}));

import { useMediaQuery } from 'usehooks-ts';

describe('useIsDesktop', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return true when useMediaQuery returns true', () => {
    (useMediaQuery as Mock).mockReturnValue(true);
    const result = useIsDesktop();
    expect(result).toBe(true);
  });

  it('should return false when useMediaQuery returns false', () => {
    (useMediaQuery as Mock).mockReturnValue(false);
    const result = useIsDesktop();
    expect(result).toBe(false);
  });

  it('should call useMediaQuery with correct query', () => {
    (useMediaQuery as Mock).mockReturnValue(true);
    useIsDesktop();
    expect(useMediaQuery).toHaveBeenCalledWith('(min-width: 1024px)');
  });
});
