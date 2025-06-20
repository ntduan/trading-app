'use client';

import { useEffect } from 'react';

import { useAllTradingPairs } from '@/hooks/useAllTradingPairs';
import { useExchangeAdapter } from '@/hooks/useExchangeAdapter';

export const Updater = () => {
  const { data: tradingPairs } = useAllTradingPairs();
  const { adapter } = useExchangeAdapter();

  useEffect(() => {
    if (tradingPairs) {
      adapter.setupTradingPairs(tradingPairs);
    }
  }, [tradingPairs, adapter]);

  return null;
};
