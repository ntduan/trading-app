import { memo, useMemo } from 'react';

import { OrderBookRow } from './order-book-row';

import { type AggregatedLevel } from '@/workers/orderbook.worker';

export const OrderBookTable = memo(({ data, side }: { data: AggregatedLevel[]; side: 'bids' | 'asks' }) => {
  const maxTotal = Math.max(...data.map((d) => d.total));

  const processedData = useMemo(() => (side === 'bids' ? data : [...data].reverse()), [data, side]);
  return (
    <div className="flex flex-col text-sm font-mono">
      <div className="flex flex-col gap-[1px]">
        {processedData.map((level) => (
          <OrderBookRow key={level.price} level={level} maxTotal={maxTotal} side={side} />
        ))}
      </div>
    </div>
  );
});

OrderBookTable.displayName = 'OrderBookTable';
