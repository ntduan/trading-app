import { type Side } from '@/adapters/createExchangeAdapter';

export type Level = [string, string]; // [price, amount]

export type AggregatedLevel = {
  price: number;
  amount: number;
  total: number; // amount * price
};

type AggregationResult = {
  levels: AggregatedLevel[];
  bestPrice: number | null;
};

export type OrderbookResult = {
  bids: AggregatedLevel[];
  asks: AggregatedLevel[];
  bestBid: number | null;
  bestAsk: number | null;
  mid: number;
};

/*
 * Aggregates levels by tick size and sorts them.
 * Also returns the best price from original data.
 * - For bids, it rounds down to the nearest tick size.
 * - For asks, it rounds up to the nearest tick size.
 * - Returns the top 20 levels and best original price.
 * @param levels - Array of levels to aggregate.
 * @param side - 'bids' or 'asks'.
 * @param tickSize - The tick size to use for aggregation.
 * @param descending - Whether to sort in descending order (bids) or ascending order (asks).
 * @returns An object with aggregated levels and best price from original data.
 */
function aggregateAndSort(levels: Level[], side: Side, tickSize: number, descending: boolean): AggregationResult {
  const bucketMap = new Map<number, number>();
  let bestPrice: number | null = null;

  for (const [priceStr, amountStr] of levels) {
    const price = parseFloat(priceStr);
    const amount = parseFloat(amountStr);
    if (isNaN(price) || isNaN(amount) || price <= 0 || amount <= 0) continue;

    // Track best price from original data
    if (bestPrice === null) {
      bestPrice = price;
    } else {
      if (side === 'bids' && price > bestPrice) {
        bestPrice = price;
      } else if (side === 'asks' && price < bestPrice) {
        bestPrice = price;
      }
    }

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

  return {
    levels: sorted,
    bestPrice,
  };
}

self.onmessage = (event) => {
  const { bids, asks, tickSize } = event.data;

  const { levels: aggregatedBids, bestPrice: bestBid } = aggregateAndSort(bids, 'bids', tickSize, true);
  const { levels: aggregatedAsks, bestPrice: bestAsk } = aggregateAndSort(asks, 'asks', tickSize, false);

  let mid: number | null = null;
  if (bestBid !== null && bestAsk !== null) {
    mid = Number(((bestBid + bestAsk) / 2).toFixed(3));
  }

  self.postMessage({
    bids: aggregatedBids,
    asks: aggregatedAsks,
    bestBid,
    bestAsk,
    mid,
  } as OrderbookResult);
};

self.onerror = (err) => {
  console.error('Worker failed to load:', err);
};
