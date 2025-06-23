import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

import { updateAmountAtom } from './balance';
import { allTradingPairsAtom } from './trading-pair';
import { type Order, type CancelOrderParams, type EnhancedOrder } from './types';

import { STORAGE_KEYS } from '@/constants';

const baseOrdersAtom = atomWithStorage<Order[]>(STORAGE_KEYS.ORDERS || 'orders', [], undefined, { getOnInit: true });

// ========================================
// Order Management Atoms
// ========================================

export const _ordersAtom = atom(
  (get) => get(baseOrdersAtom),
  (get, set, newOrder: Order) => {
    const currentOrders = get(baseOrdersAtom);
    set(baseOrdersAtom, [...currentOrders, newOrder]);
  }
);

export const _cancelOrderAtom = atom(null, (get, set, { orderId, tradingPair }: CancelOrderParams) => {
  const currentOrders = get(baseOrdersAtom);
  const orderIndex = currentOrders.findIndex((order) => order.id === orderId);

  if (orderIndex === -1) {
    throw new Error('Order not found');
  }

  const orderToCancel = currentOrders[orderIndex];

  if (orderToCancel.status !== 'pending') {
    throw new Error('Only pending orders can be cancelled');
  }

  // Calculate refund
  const refundAmount =
    orderToCancel.side === 'buy'
      ? orderToCancel.price * orderToCancel.amount // Refund quote asset for buy orders
      : orderToCancel.amount; // Refund base asset for sell orders

  const refundAsset = orderToCancel.side === 'buy' ? tradingPair.quoteAsset : tradingPair.baseAsset;

  // Update balance using the update atom
  set(updateAmountAtom, { asset: refundAsset, amount: refundAmount });

  // Update order status
  const updatedOrders = [...currentOrders];
  updatedOrders[orderIndex] = {
    ...orderToCancel,
    status: 'cancelled' as const,
  };

  set(baseOrdersAtom, updatedOrders);

  return {
    order: updatedOrders[orderIndex],
    refund: { asset: refundAsset, amount: refundAmount },
  };
});

// ========================================
// Derived Atoms (Computed Values)
// ========================================

export const pendingOrdersAtom = atom((get) => {
  const orders = get(_ordersAtom);
  return orders.filter((order) => order.status === 'pending');
});

export const orderHistoryAtom = atom((get) => {
  const orders = get(_ordersAtom);
  return orders.filter((order) => order.status !== 'pending');
});

// create a derived atom to enhance orders with trading pair info
export const enhanceOrdersAtom = atom((get) => {
  const allPairs = get(allTradingPairsAtom);

  return (orders?: Order[]): EnhancedOrder[] => {
    if (!orders) return [];

    if (allPairs.status !== 'success' || !allPairs.data) {
      return orders.map((order) => ({
        ...order,
        baseAsset: '',
        quoteAsset: '',
      }));
    }

    // Create a map for faster lookup
    const pairMap = new Map(allPairs.data.map((pair) => [pair.symbol, pair]));

    return orders.map((order): EnhancedOrder => {
      const tradingPair = pairMap.get(order.pair);

      if (tradingPair) {
        return {
          ...order,
          baseAsset: tradingPair.baseAsset,
          quoteAsset: tradingPair.quoteAsset,
        };
      }

      return {
        ...order,
        baseAsset: '',
        quoteAsset: '',
      };
    });
  };
});
