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

export const _updateAmountAtom = atom(null, (get, set, update: { asset: string; amount: number }) => {
  const currentBalance = get(_amountAtom);
  const { asset, amount } = update;

  const currentAmount = currentBalance[asset] || 0;
  const newAmount = currentAmount + amount;

  set(_amountAtom, {
    ...currentBalance,
    [asset]: newAmount,
  });
});

// ...existing code...

export const _cancelOrderAtom = atom(
  null,
  (get, set, { orderId, tradingPair }: { orderId: string; tradingPair: { baseAsset: string; quoteAsset: string } }) => {
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

    // Update balance
    const currentBalance = get(_amountAtom);
    const currentAmount = currentBalance[refundAsset] || 0;
    const newAmount = currentAmount + refundAmount;

    set(_amountAtom, {
      ...currentBalance,
      [refundAsset]: newAmount,
    });

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
