'use client';

import React, { useEffect, useState } from 'react';

import { LimitForm } from './limit-form';

interface LimitOrderProps {
  bestBid: number;
  bestAsk: number;
  availableBalance?: number; // Optional balance display
}

export const LimitOrder: React.FC<LimitOrderProps> = ({ bestBid, bestAsk }) => {
  const [price, setPrice] = useState<number>(0);
  const [side, setSide] = useState<'buy' | 'sell'>('buy');

  useEffect(() => {
    /* v8 ignore next 2 */
    if (side === 'buy') setPrice(bestBid);
    else setPrice(bestAsk);
  }, [bestBid, bestAsk, side]);

  return (
    <div className="text-foreground p-4 rounded w-full h-full space-y-4">
      <div className="flex gap-8 justify-between h-full">
        <LimitForm side="buy" />
        <LimitForm side="sell" />
      </div>
    </div>
  );
};
