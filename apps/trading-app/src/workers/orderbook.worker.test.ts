import { describe, it, expect, vi } from 'vitest';

interface OrderbookWorkerEvent {
  data: {
    bids: [string, string][];
    asks: [string, string][];
    tickSize: number;
  };
}

// Mock data for the tests
const mockBids: [string, string][] = [
  ['100.000', '1.5'],
  ['99.500', '2'],
  ['99.300', '0.5'],
  ['100.300', '0.8'],
  ['100.700', '0.2'],
];
const mockAsks: [string, string][] = [
  ['101.000', '1'],
  ['101.200', '1.2'],
  ['102.000', '0.5'],
  ['100.800', '2.3'],
  ['100.500', '0.9'],
];
const tickSize = 0.1;

function aggregateAndSort(levels: [string, string][], side: 'bids' | 'asks', tickSize: number, descending: boolean) {
  const bucketMap = new Map<number, number>();

  for (const [priceStr, amountStr] of levels) {
    const price = parseFloat(priceStr);
    const amount = parseFloat(amountStr);
    if (isNaN(price) || isNaN(amount) || price <= 0 || amount <= 0) continue;

    const bucketPrice =
      side === 'bids' ? Math.floor(price / tickSize) * tickSize : Math.ceil(price / tickSize) * tickSize;
    bucketMap.set(bucketPrice, (bucketMap.get(bucketPrice) || 0) + amount);
  }

  const sorted = Array.from(bucketMap.entries())
    .map(([price, amount]) => ({
      price: Number(price.toFixed(3)),
      amount: Number(amount.toFixed(3)),
      total: Number((price * amount).toFixed(3)),
    }))
    .filter((level) => level.amount > 0)
    .sort((a, b) => (descending ? b.price - a.price : a.price - b.price))
    .slice(0, 20);

  return sorted;
}

describe('aggregateAndSort function', () => {
  it('aggregates and sorts bids in descending order', () => {
    const result = aggregateAndSort(mockBids, 'bids', tickSize, true);

    expect(result).toMatchInlineSnapshot(`
[
  {
    "amount": 0.2,
    "price": 100.7,
    "total": 20.14,
  },
  {
    "amount": 0.8,
    "price": 100.2,
    "total": 80.16,
  },
  {
    "amount": 1.5,
    "price": 100,
    "total": 150,
  },
  {
    "amount": 2,
    "price": 99.5,
    "total": 199,
  },
  {
    "amount": 0.5,
    "price": 99.2,
    "total": 49.6,
  },
]
`);
  });

  it('aggregates and sorts asks in ascending order', () => {
    const result = aggregateAndSort(mockAsks, 'asks', tickSize, false);
    expect(result).toMatchInlineSnapshot(`
    [
      {
        "amount": 0.9,
        "price": 100.5,
        "total": 90.45,
      },
      {
        "amount": 2.3,
        "price": 100.8,
        "total": 231.84,
      },
      {
        "amount": 1,
        "price": 101,
        "total": 101,
      },
      {
        "amount": 1.2,
        "price": 101.2,
        "total": 121.44,
      },
      {
        "amount": 0.5,
        "price": 102,
        "total": 51,
      },
    ]
    `);
  });

  it('filters out levels with non-positive prices or amounts', () => {
    const invalidData: [string, string][] = [
      ['-100.000', '1.5'], // Invalid price
      ['100.000', '-1.5'], // Invalid amount
      ['100.000', '0'], // Zero amount
      ['abc', '1.5'], // Invalid price
    ];
    const result = aggregateAndSort(invalidData, 'bids', tickSize, true);

    expect(result).toEqual([]);
  });
});

describe('Web Worker message handler', () => {
  it('should aggregate bids, asks and calculate mid price', () => {
    const postMessage = vi.fn();

    const onMessage = (event: OrderbookWorkerEvent) => {
      const { bids, asks, tickSize } = event.data;
      const aggregatedBids = aggregateAndSort(bids, 'bids', tickSize, true);
      const aggregatedAsks = aggregateAndSort(asks, 'asks', tickSize, false);

      const bestBid = aggregatedBids[0]?.price ?? null;
      const bestAsk = aggregatedAsks[0]?.price ?? null;

      let mid: number | null = null;
      if (bestBid !== null && bestAsk !== null) {
        mid = Number(((bestBid + bestAsk) / 2).toFixed(3));
      }

      postMessage({
        bids: aggregatedBids,
        asks: aggregatedAsks,
        mid,
      });
    };

    const eventData = {
      data: {
        bids: mockBids,
        asks: mockAsks,
        tickSize,
      },
    };

    onMessage(eventData);

    expect(postMessage).toHaveBeenCalledWith({
      bids: [
        { price: 100.7, amount: 0.2, total: 20.14 },
        { price: 100.2, amount: 0.8, total: 80.16 },
        { price: 100.0, amount: 1.5, total: 150.0 },
        { price: 99.5, amount: 2.0, total: 199.0 },
        { price: 99.2, amount: 0.5, total: 49.6 },
      ],
      asks: [
        { price: 100.5, amount: 0.9, total: 90.45 },
        { price: 100.8, amount: 2.3, total: 231.84 },
        { price: 101.0, amount: 1.0, total: 101.0 },
        { price: 101.2, amount: 1.2, total: 121.44 },
        { price: 102.0, amount: 0.5, total: 51.0 },
      ],
      mid: 100.6,
    });
  });

  it('should handle cases where there are no bids or asks', () => {
    const postMessage = vi.fn();
    const onMessage = (event: OrderbookWorkerEvent) => {
      const { bids, asks, tickSize } = event.data;
      const aggregatedBids = aggregateAndSort(bids, 'bids', tickSize, true);
      const aggregatedAsks = aggregateAndSort(asks, 'asks', tickSize, false);

      const bestBid = aggregatedBids[0]?.price ?? null;
      const bestAsk = aggregatedAsks[0]?.price ?? null;

      let mid: number | null = null;
      if (bestBid !== null && bestAsk !== null) {
        mid = Number(((bestBid + bestAsk) / 2).toFixed(3));
      }

      postMessage({
        bids: aggregatedBids,
        asks: aggregatedAsks,
        mid,
      });
    };

    const eventData = {
      data: {
        bids: [],
        asks: [],
        tickSize,
      },
    };

    onMessage(eventData);

    expect(postMessage).toHaveBeenCalledWith({
      bids: [],
      asks: [],
      mid: null,
    });
  });
});
