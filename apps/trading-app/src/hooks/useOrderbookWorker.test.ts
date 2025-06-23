import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { useOrderbookWorker } from './useOrderbookWorker';

let workerInstances: MockWorker[] = [];

class MockWorker {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  onmessage: ((e: { data: any }) => void) | null = null;
  postMessage = vi.fn();
  terminate = vi.fn();
  constructor() {
    workerInstances.push(this);
  }
}

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
vi.stubGlobal('Worker', MockWorker as any);

const mockResult = {
  bids: [{ price: '1', size: '2' }],
  asks: [{ price: '3', size: '4' }],
  mid: 2.5,
};

describe('useOrderbookWorker', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    workerInstances = [];
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });
  it('should initialize worker and set result on message', () => {
    const { result } = renderHook(() => useOrderbookWorker());

    const workerInstance = workerInstances[0];
    expect(workerInstance.terminate).not.toHaveBeenCalled();
    expect(workerInstance.postMessage).not.toHaveBeenCalled();

    // Simulate worker message
    act(() => {
      workerInstance.onmessage?.({ data: mockResult });
    });

    expect(result.current.result).toEqual(mockResult);
  });
  it('should post message to worker', () => {
    const { result } = renderHook(() => useOrderbookWorker());

    const workerInstance = workerInstances[0];
    const bids: [string, string][] = [['1', '2']];
    const asks: [string, string][] = [['3', '4']];
    const tickSize = 0.5;

    act(() => {
      result.current.post(bids, asks, tickSize);
    });

    expect(workerInstance.postMessage).toHaveBeenCalledWith({ bids, asks, tickSize });
  });
  it('should terminate worker on unmount', () => {
    const { unmount } = renderHook(() => useOrderbookWorker());
    const workerInstance = workerInstances[0];
    unmount();
    expect(workerInstance.terminate).toHaveBeenCalled();
  });
});
