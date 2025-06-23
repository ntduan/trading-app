import { atom } from 'jotai';

import { type OrderbookResult } from '@/workers/orderbook.worker';

// Worker instance
const workerInstanceAtom = atom<Worker | null>(null);

// Orderbook data
export const orderbookAtom = atom<OrderbookResult | null>(null);

// initializing the worker and setting up message handling
export const getWorkerAtom = atom(
  (get) => get(workerInstanceAtom),
  (get, set) => {
    const existingWorker = get(workerInstanceAtom);
    if (existingWorker) return existingWorker;

    const worker = new Worker(new URL('@/workers/orderbook.worker.ts', import.meta.url), { type: 'module' });

    worker.onmessage = (e) => {
      const data = e.data as OrderbookResult;
      set(orderbookAtom, data);
    };

    set(workerInstanceAtom, worker);
    return worker;
  }
);

// post message to worker
export const postToWorkerAtom = atom(
  null,
  (get, set, data: { bids: [string, string][]; asks: [string, string][]; tickSize: number }) => {
    const worker = set(getWorkerAtom);
    worker.postMessage(data);
  }
);
