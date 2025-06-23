import { useQuery } from '@tanstack/react-query';
import { getDefaultStore } from 'jotai';

import { QUERY_KEYS } from '@/constants';
import { _ordersAtom } from '@/state/atoms';

export const useOrders = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.ORDERS],
    queryFn: async () => {
      const defaultStore = getDefaultStore();
      return Promise.resolve(defaultStore.get(_ordersAtom));
    },
  });
};
