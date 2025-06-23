import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

import { type AmountUpdate } from './types';

import { STORAGE_KEYS } from '@/constants';

// Base storage atoms (private)
const INIT_AMOUNT: Record<string, number> = {
  USDT: 100000,
  BTC: 0,
  ETH: 0,
  SOL: 0,
};

const baseAmountAtom = atomWithStorage<Record<string, number>>(STORAGE_KEYS.AMOUNT, INIT_AMOUNT, undefined, {
  getOnInit: true,
});

// ========================================
// Amount Management Atoms
// ========================================

export const _amountAtom = atom(
  (get) => get(baseAmountAtom),
  (get, set, newValue: Record<string, number>) => {
    const roundedValue: Record<string, number> = {};
    for (const [key, value] of Object.entries(newValue)) {
      roundedValue[key] = Number(value.toFixed(4));
    }
    set(baseAmountAtom, roundedValue);
  }
);

export const updateAmountAtom = atom(null, (get, set, update: AmountUpdate) => {
  const currentBalance = get(_amountAtom);
  const { asset, amount } = update;

  const currentAmount = currentBalance[asset] || 0;
  const newAmount = currentAmount + amount;

  set(_amountAtom, {
    ...currentBalance,
    [asset]: newAmount,
  });
});

// ========================================
// Derived Atoms (Computed Values)
// ========================================
export const totalBalanceAtom = atom((get) => {
  const amounts = get(_amountAtom);
  return Object.values(amounts).reduce((total, amount) => total + amount, 0);
});
