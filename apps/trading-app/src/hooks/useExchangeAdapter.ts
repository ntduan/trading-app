import { useAtomValue } from 'jotai';

import { useMemo } from 'react';

import { exchangeAdapterAtom } from '@/state/atoms/adapter';

export const useExchangeAdapter = () => {
  const adapter = useAtomValue(exchangeAdapterAtom);
  return useMemo(() => {
    return {
      adapter,
    };
  }, [adapter]);
};
