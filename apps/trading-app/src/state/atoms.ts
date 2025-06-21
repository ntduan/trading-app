import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

import { STORAGE_KEYS } from '@/constants';

export const activeTradingPairAtom = atomWithStorage(STORAGE_KEYS.ACTIVE_TRADING_PAIR, 'BTCUSDT', undefined, {
  getOnInit: true,
});

const baseAmountAtom = atomWithStorage<Record<string, number>>(
  STORAGE_KEYS.AMOUNT,
  {
    USDT: 100000,
    BTC: 0,
    ETH: 0,
    SOL: 0,
  },
  undefined,
  {
    getOnInit: true,
  }
);

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

export type Order = {
  id: string;
  side: 'buy' | 'sell';
  price: number;
  amount: number;
  pair: string;
  postOnly: boolean;
  status: 'pending' | 'filled' | 'cancelled';
  createdAt: number;
};

const baseOrdersAtom = atomWithStorage<Order[]>(STORAGE_KEYS.ORDERS || 'orders', [], undefined, {
  getOnInit: true,
});

export const _ordersAtom = atom(
  (get) => get(baseOrdersAtom),
  (get, set, newOrder: Order) => {
    const currentOrders = get(baseOrdersAtom);
    set(baseOrdersAtom, [...currentOrders, newOrder]);
  }
);
