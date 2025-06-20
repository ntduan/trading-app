import { type Order } from '@/adapters/createExchangeAdapter';

function aggregateOrders(orders: Order[], tickSize: number): Order[] {
  const map = new Map<number, number>();
  for (const [price, qty] of orders) {
    const rounded = Math.round(price / tickSize) * tickSize;
    map.set(rounded, (map.get(rounded) ?? 0) + qty);
  }
  return Array.from(map.entries()).sort((a, b) => b[0] - a[0]);
}

self.onmessage = function (event) {
  const { type, orders, tickSize, side } = event.data;
  if (type === 'aggregate') {
    const aggregated = aggregateOrders(orders, tickSize);
    self.postMessage({ type: side, orders: aggregated });
  }
};

export {};
