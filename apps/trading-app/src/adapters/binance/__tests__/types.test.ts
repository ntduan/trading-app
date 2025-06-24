import * as BinanceTypes from '../types';
import { describe, expect, it } from 'vitest';

describe('adapters/binance/types', () => {
  it('should import without error', () => {
    expect(BinanceTypes).toBeDefined();
  });
});
