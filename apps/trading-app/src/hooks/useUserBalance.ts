import { useQuery } from '@tanstack/react-query';
import { getDefaultStore } from 'jotai';

import { QUERY_KEYS } from '@/constants';
import { _amountAtom } from '@/state/atoms';

export const useUserBalance = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.USER_BALANCE],
    queryFn: async () => {
      const defaultStore = getDefaultStore();
      return Promise.resolve(defaultStore.get(_amountAtom));
    },
  });
};
