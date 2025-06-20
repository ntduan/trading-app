import { useEffect, useRef, useState } from 'react';

import { type AggregatedLevel } from '@/workers/orderbook.worker';

export type WorkerResult = {
  bids: AggregatedLevel[];
  asks: AggregatedLevel[];
  mid: number;
};

export function useOrderbookWorker() {
  const workerRef = useRef<Worker | null>(null);
  const [result, setResult] = useState<WorkerResult | null>(null);

  useEffect(() => {
    const worker = new Worker(new URL('@/workers/orderbook.worker.ts', import.meta.url), { type: 'module' });
    worker.onmessage = (e) => {
      setResult(e.data);
    };
    workerRef.current = worker;

    return () => {
      worker.terminate();
    };
  }, []);

  const post = (bids: [string, string][], asks: [string, string][], tickSize: number) => {
    if (workerRef.current) {
      workerRef.current.postMessage({ bids, asks, tickSize });
    }
  };

  return { result, post };
}
