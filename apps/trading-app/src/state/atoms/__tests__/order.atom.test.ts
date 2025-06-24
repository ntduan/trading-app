import { describe, it, expect } from 'vitest';
import { getDefaultStore } from 'jotai';
import { _ordersAtom, _cancelOrderAtom, pendingOrdersAtom, orderHistoryAtom, enhanceOrdersAtom } from '../order';

const mockOrder = {
  id: '1',
  side: 'buy',
  price: 100,
  amount: 1,
  pair: 'BTC/USDT',
  postOnly: false,
  status: 'pending',
  createdAt: Date.now(),
};

describe('orders atom', () => {
  it('should add a new order', () => {
    const store = getDefaultStore();
    store.set(_ordersAtom, mockOrder);
    const orders = store.get(_ordersAtom);
    expect(orders.some((o) => o.id === '1')).toBe(true);
  });

  it('should cancel a pending order and refund', () => {
    const store = getDefaultStore();
    // Add a pending buy order
    const order = {
      id: '2',
      side: 'buy' as const,
      price: 10,
      amount: 2,
      pair: 'BTC/USDT',
      postOnly: false,
      status: 'pending' as const,
      createdAt: Date.now(),
    };
    store.set(_ordersAtom, order);
    const tradingPair = { baseAsset: 'BTC', quoteAsset: 'USDT' };
    const result = store.set(_cancelOrderAtom, { orderId: '2', tradingPair });
    const orders = store.get(_ordersAtom);
    expect(orders.find((o) => o.id === '2')?.status).toBe('cancelled');
    expect(result.refund.asset).toBe('USDT');
    expect(result.refund.amount).toBe(20);
  });

  it('pendingOrdersAtom returns only pending', () => {
    const store = getDefaultStore();
    const order = {
      id: '3',
      side: 'buy' as const,
      price: 1,
      amount: 1,
      pair: 'BTC/USDT',
      postOnly: false,
      status: 'pending' as const,
      createdAt: Date.now(),
    };
    store.set(_ordersAtom, order);
    const pending = store.get(pendingOrdersAtom);
    expect(pending.some((o) => o.id === '3')).toBe(true);
  });

  it('orderHistoryAtom returns only non-pending', () => {
    const store = getDefaultStore();
    const order = {
      id: '4',
      side: 'sell' as const,
      price: 1,
      amount: 1,
      pair: 'BTC/USDT',
      postOnly: false,
      status: 'filled' as const,
      createdAt: Date.now(),
    };
    store.set(_ordersAtom, order);
    const history = store.get(orderHistoryAtom);
    expect(history.some((o) => o.id === '4')).toBe(true);
  });

  it('enhanceOrdersAtom returns EnhancedOrder with asset info', () => {
    const store = getDefaultStore();
    const enhance = store.get(enhanceOrdersAtom);
    const orders = [
      {
        id: '5',
        side: 'buy' as const,
        price: 1,
        amount: 1,
        pair: 'BTC/USDT',
        postOnly: false,
        status: 'pending' as const,
        createdAt: Date.now(),
      },
    ];
    const enhanced = enhance(orders);
    expect(enhanced[0]).toHaveProperty('baseAsset');
    expect(enhanced[0]).toHaveProperty('quoteAsset');
  });
});
