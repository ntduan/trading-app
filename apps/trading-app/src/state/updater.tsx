'use client';

import { useAllTradingPairs } from '@/hooks/useAllTradingPairs';

export const Updater = () => {
  useAllTradingPairs();

  return null;
};
