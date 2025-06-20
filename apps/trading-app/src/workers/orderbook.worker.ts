import { type Side } from '@/adapters/createExchangeAdapter';

export type Level = [string, string]; // [price, amount]

export type AggregatedLevel = {
  price: number;
  amount: number;
  total: number; // amount * price
};

/*
 * Aggregates levels by tick size and sorts them.
 * - For bids, it rounds down to the nearest tick size.
 * - For asks, it rounds up to the nearest tick size.
 * - Returns the top 20 levels.
 * @param levels - Array of levels to aggregate.
 * @param side - 'bids' or 'asks'.
 * @param tickSize - The tick size to use for aggregation.
 * @param descending - Whether to sort in descending order (bids) or ascending order (asks).
 * @returns An array of aggregated levels, each with price, amount, and total.
 */
function aggregateAndSort(levels: Level[], side: Side, tickSize: number, descending: boolean): AggregatedLevel[] {
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

self.onmessage = (event) => {
  console.log('Received message in worker', event.data);
  const { bids, asks, tickSize } = event.data;
  const aggregatedBids = aggregateAndSort(bids, 'bids', tickSize, true);
  const aggregatedAsks = aggregateAndSort(asks, 'asks', tickSize, false);

  const bestBid = aggregatedBids[0]?.price ?? null;
  const bestAsk = aggregatedAsks[0]?.price ?? null;

  let mid: number | null = null;
  if (bestBid !== null && bestAsk !== null) {
    mid = Number(((bestBid + bestAsk) / 2).toFixed(3));
  }

  self.postMessage({
    bids: aggregatedBids,
    asks: aggregatedAsks,
    mid,
  });
};

self.onerror = (err) => {
  console.error('Worker failed to load:', err);
};
