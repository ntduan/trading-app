import { describe, it, expect } from 'vitest';
import { cn, formatDate, formatPrice, formatAmount } from '../utils';

describe('utils', () => {
  it('cn merges class names', () => {
    expect(cn('a', 'b')).toBe('a b');
    expect(cn('a', false && 'b', undefined, 'c')).toBe('a c');
  });

  it('formatDate formats timestamp', () => {
    const ts = Date.UTC(2023, 0, 2, 3, 4, 5); // 2023-01-02 03:04:05 UTC
    const formatted = formatDate(ts);
    expect(typeof formatted).toBe('string');
    expect(formatted).toMatch(/\d{2}\/\d{2}/); // MM/DD
  });

  it('formatPrice formats price to 2 decimals', () => {
    expect(formatPrice(123.456)).toBe('123.46');
    expect(formatPrice(1)).toBe('1.00');
  });

  it('formatAmount formats amount to 4 decimals', () => {
    expect(formatAmount(0.123456)).toBe('0.1235');
    expect(formatAmount(1)).toBe('1.0000');
  });
});
