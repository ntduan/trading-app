import { useCallback, useMemo, useRef } from 'react';

import { useOrderbookWorker } from './useOrderbookWorker';

export type Level = [string, string];

export function useOrderbookRafUpdater(getData: () => { bids: Level[]; asks: Level[] }, tickSize: number) {
  const { result, post } = useOrderbookWorker();
  const rafRef = useRef<number | null>(null);

  const triggerUpdate = useCallback(() => {
    if (rafRef.current != null) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      const { bids, asks } = getData();

      post(bids, asks, tickSize);
    });
  }, [getData, post, tickSize]);

  return useMemo(() => {
    return { result, triggerUpdate } as const;
  }, [result, triggerUpdate]);
}
