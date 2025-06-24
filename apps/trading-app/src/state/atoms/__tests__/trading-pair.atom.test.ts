import { describe, it, expect } from 'vitest';
import { getDefaultStore } from 'jotai';
import { allTradingPairsAtom, activeTradingPairSymbolAtom, activeTradingPairInfoAtom } from '../trading-pair';

describe('trading-pair atoms', () => {
  it('activeTradingPairSymbolAtom default is empty string', () => {
    const store = getDefaultStore();
    expect(store.get(activeTradingPairSymbolAtom)).toBe('');
  });

  it('activeTradingPairInfoAtom returns null if no match', () => {
    const store = getDefaultStore();
    expect(store.get(activeTradingPairInfoAtom)).toBeNull();
  });
});
