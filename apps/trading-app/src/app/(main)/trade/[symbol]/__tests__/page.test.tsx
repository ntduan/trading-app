import { generateStaticParams, default as TradePage } from '../page';
import { describe, expect, it, vi } from 'vitest';

describe('TradePage', () => {
  it('returns null', async () => {
    const result = await TradePage();
    expect(result).toBeNull();
  });
});
