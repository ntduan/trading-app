'use client';

import { useAtomValue } from 'jotai';
import { useEffect } from 'react';

import { allTradingPairsAtom } from './atoms';

import { useExchangeAdapter } from '@/hooks/useExchangeAdapter';

export const Updater = () => {
  const { data: pairs } = useAtomValue(allTradingPairsAtom);
  const { adapter } = useExchangeAdapter();

  useEffect(() => {
    if (pairs) {
      adapter.setupTradingPairs(pairs);
    }
  }, [pairs, adapter]);

  return null;
};
