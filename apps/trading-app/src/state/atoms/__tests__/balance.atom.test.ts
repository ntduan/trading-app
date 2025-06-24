import { describe, it, expect } from 'vitest';
import { getDefaultStore } from 'jotai';
import { _amountAtom, updateAmountAtom } from '../../../state/atoms/balance';

describe('balance atoms', () => {
  it('should initialize with default balances', () => {
    const store = getDefaultStore();
    const balance = store.get(_amountAtom);
    expect(balance.USDT).toBeGreaterThan(0);
    expect(balance.BTC).toBeGreaterThan(0);
  });

  it('should update balance correctly', () => {
    const store = getDefaultStore();
    store.set(updateAmountAtom, { asset: 'BTC', amount: 1 });
    const balance = store.get(_amountAtom);
    expect(balance.BTC).toBeGreaterThan(0);
  });
});
