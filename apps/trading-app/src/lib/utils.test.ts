import { describe, it, expect } from 'vitest';

import { cn, resolutionToBinanceInterval } from './utils';

describe('cn utility', () => {
  it('merges tailwind classes correctly', () => {
    const result = cn('p-2', 'text-sm', 'p-4'); // twMerge should override p-2 with p-4
    expect(result).toBe('text-sm p-4');
  });

  it('handles conditional class names with clsx', () => {
    const result = cn('text-sm', { hidden: false, block: true });
    expect(result).toBe('text-sm block');
  });

  it('handles undefined/null/false values gracefully', () => {
    const result = cn('text-sm', undefined, null, false, 'mt-2');
    expect(result).toBe('text-sm mt-2');
  });
});

describe('resolutionToBinanceInterval', () => {
  it('returns correct intervals for known resolutions', () => {
    expect(resolutionToBinanceInterval('1')).toBe('1m');
    expect(resolutionToBinanceInterval('5')).toBe('5m');
    expect(resolutionToBinanceInterval('60')).toBe('1h');
    expect(resolutionToBinanceInterval('240')).toBe('4h');
    expect(resolutionToBinanceInterval('1D')).toBe('1d');
  });

  it('returns default interval for unknown resolution', () => {
    expect(resolutionToBinanceInterval('2')).toBe('1m');
    expect(resolutionToBinanceInterval('')).toBe('1m');
    expect(resolutionToBinanceInterval('XYZ')).toBe('1m');
  });
});
