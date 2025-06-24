'use client';
import { useAtomValue } from 'jotai';
import { redirect } from 'next/navigation';

import { baseActiveTradingPairSymbolAtom } from '@/state/atoms';

export default function TradeRootPage() {
  const baseActiveTradingPairSymbol = useAtomValue(baseActiveTradingPairSymbolAtom);
  const targetSymbol = baseActiveTradingPairSymbol;
  redirect(`/trade/${targetSymbol}`);
}
