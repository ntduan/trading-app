import React from 'react';

import { cn } from '@/lib/utils';
import { type AggregatedLevel } from '@/workers/orderbook.worker';

export const OrderBookRow = React.memo(
  function OrderbookRow({
    level,
    maxTotal,
    side,
  }: {
    level: AggregatedLevel;
    maxTotal: number;
    side: 'bids' | 'asks';
  }) {
    const width = (level.total / maxTotal) * 100;
    const isBids = side === 'bids';

    return (
      <div className="relative" key={level.price}>
        <div
          className={cn('absolute right-0 top-0 h-full', isBids ? 'bg-green-900/30' : 'bg-red-900/30')}
          style={{ width: `${width}%` }}
        />
        <div className="relative z-10 grid grid-cols-3 py-0.5 text-xs text-right leading-tight">
          <div className={cn('text-left ml-2', isBids ? 'text-chart-2' : 'text-chart-1')}>{level.price.toFixed(2)}</div>
          <div className="text-foreground">{level.amount.toFixed(3)}</div>
          <div className="text-foreground">
            {level.total >= 1000 ? `${(level.total / 1000).toFixed(2)}K` : level.total.toFixed(2)}
          </div>
        </div>
      </div>
    );
  },
  (prev, next) =>
    prev.level.price === next.level.price &&
    prev.level.amount === next.level.amount &&
    prev.level.total === next.level.total &&
    prev.side === next.side &&
    prev.maxTotal === next.maxTotal
);
