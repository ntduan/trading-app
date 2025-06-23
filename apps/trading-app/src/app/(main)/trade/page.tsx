'use client';
import { useAtom } from 'jotai';
import { redirect } from 'next/navigation';

import { activeTradingPairSymbolAtom } from '@/state/atoms';

export default function TradeRootPage() {
  const [activeTradingPair] = useAtom(activeTradingPairSymbolAtom);

  const targetSymbol = activeTradingPair || 'BTCUSDT';
  redirect(`/trade/${targetSymbol}`);
}
