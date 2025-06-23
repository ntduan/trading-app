import { memo, useMemo } from 'react';

import { OrderbookRow } from './orderbook-row';

import { type AggregatedLevel } from '@/workers/orderbook.worker';

export const OrderbookTable = memo(({ data, side }: { data: AggregatedLevel[]; side: 'bids' | 'asks' }) => {
  const maxTotal = Math.max(...data.map((d) => d.total));

  const processedData = useMemo(() => (side === 'bids' ? data : [...data].reverse()), [data, side]);
  return (
    <div className="flex flex-col text-sm font-mono">
      <div className="flex flex-col gap-[1px]">
        {processedData.map((level) => (
          <OrderbookRow key={level.price} level={level} maxTotal={maxTotal} side={side} />
        ))}
      </div>
    </div>
  );
});

OrderbookTable.displayName = 'OrderbookTable';
