import { describe, it, expect } from 'vitest';
import { getDefaultStore } from 'jotai';
import { orderbookAtom, getWorkerAtom, postToWorkerAtom } from '../orderbook';

describe('orderbookAtom', () => {
  it('should initialize as null', () => {
    const store = getDefaultStore();
    expect(store.get(orderbookAtom)).toBeNull();
  });
});

describe('orderbook atoms', () => {
  it('getWorkerAtom returns null by default', () => {
    const store = getDefaultStore();
    expect(store.get(getWorkerAtom)).toBeNull();
  });

  // Worker-related tests are limited in Node/test env, so only basic checks here
  // it('postToWorkerAtom does not throw without worker', () => {
  //   const store = getDefaultStore();
  //   expect(() => {
  //     store.set(postToWorkerAtom, { symbol: 'BTC/USDT', bids: [], asks: [], tickSize: 0.01 });
  //   }).not.toThrow();
  // });
});
