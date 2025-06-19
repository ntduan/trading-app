'use client';
import { useAtom } from 'jotai';
import { redirect } from 'next/navigation';

import { activeTradingPairAtom } from '@/state/atoms';

export default function TradeRootPage() {
  const [activeTradingPair] = useAtom(activeTradingPairAtom);

  const targetSymbol = activeTradingPair || 'BTCUSDT';
  redirect(`/trade/${targetSymbol}`);
}
