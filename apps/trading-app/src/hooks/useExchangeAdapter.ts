import { atom, useAtomValue } from 'jotai';

import { useMemo } from 'react';

import { binance } from '@/adapters/binance';
import { type IExchangeAdapter } from '@/adapters/createExchangeAdapter';

const binanceAdapterFn = binance();

const exchangeAdapterAtom = atom<IExchangeAdapter>(binanceAdapterFn());

export const useExchangeAdapter = () => {
  const adapter = useAtomValue(exchangeAdapterAtom);
  return useMemo(() => {
    return {
      adapter,
    };
  }, [adapter]);
};
