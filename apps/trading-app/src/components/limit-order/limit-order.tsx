'use client';

import { LimitForm } from './limit-form';

export const LimitOrder = ({ symbol }: { symbol: string }) => {
  return (
    <div className="text-foreground p-4 rounded w-full h-full space-y-4">
      <div className="flex gap-8 justify-between h-full">
        <LimitForm symbol={symbol} side="buy" />
        <LimitForm symbol={symbol} side="sell" />
      </div>
    </div>
  );
};
