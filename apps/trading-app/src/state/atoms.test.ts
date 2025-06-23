import { getDefaultStore } from 'jotai';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import { activeTradingPairAtom, _amountAtom, _ordersAtom, type Order } from './atoms';

import { STORAGE_KEYS } from '@/constants';

const store = getDefaultStore();

beforeEach(() => {
  // Mock localStorage for test environment
  let store: Record<string, string> = {};
  vi.stubGlobal('localStorage', {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  });
  localStorage.clear();
});

describe('activeTradingPairAtom', () => {
  it('should initialize with default value', () => {
    const pair = store.get(activeTradingPairAtom);
    expect(pair).toBe('BTCUSDT');
  });

  it('should persist and update the trading pair', () => {
    store.set(activeTradingPairAtom, 'ETHUSDT');
    const updated = store.get(activeTradingPairAtom);
    expect(updated).toBe('ETHUSDT');

    const stored = localStorage.getItem(STORAGE_KEYS.ACTIVE_TRADING_PAIR);
    expect(stored).toBeTruthy(); // sanity check
    expect(stored).toContain('ETHUSDT'); // now safe
  });
});

describe('_amountAtom', () => {
  it('should return default token balances', () => {
    const balances = store.get(_amountAtom);
    expect(balances).toEqual({ USDT: 100000, BTC: 0, ETH: 0, SOL: 0 });
  });

  it('should update balances and round to 4 decimal places', () => {
    store.set(_amountAtom, { USDT: 99999.99999, BTC: 0.123456, ETH: 0.00004, SOL: 42.426789 });

    const updated = store.get(_amountAtom);
    expect(updated).toEqual({
      USDT: 100000,
      BTC: 0.1235,
      ETH: 0.0,
      SOL: 42.4268,
    });
  });
});

describe('_ordersAtom', () => {
  it('should initialize with an empty array', () => {
    const orders = store.get(_ordersAtom);
    expect(orders).toEqual([]);
  });

  it('should add a new order to the list', () => {
    const order: Order = {
      id: 'order1',
      side: 'buy',
      price: 100,
      amount: 1.5,
      pair: 'BTCUSDT',
      postOnly: false,
      status: 'pending',
      createdAt: Date.now(),
    };

    store.set(_ordersAtom, order);

    const updated = store.get(_ordersAtom);
    expect(updated).toHaveLength(1);
    expect(updated[0]).toMatchObject(order);
  });
});
