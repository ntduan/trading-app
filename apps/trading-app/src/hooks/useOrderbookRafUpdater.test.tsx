import { renderHook, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach, type Mock } from 'vitest';

import { useOrderbookRafUpdater, type Level } from './useOrderbookRafUpdater';
import { useOrderbookWorker } from './useOrderbookWorker';

// Mock useOrderbookWorker
vi.mock('./useOrderbookWorker', () => ({
  useOrderbookWorker: vi.fn(),
}));

const mockPost = vi.fn();
const mockResult = { foo: 'bar' };

describe('useOrderbookRafUpdater', () => {
  let getData: () => { bids: Level[]; asks: Level[] };

  beforeEach(() => {
    getData = vi.fn<() => { bids: Level[]; asks: Level[] }>(() => ({
      bids: [['1', '2']],
      asks: [['3', '4']],
    }));
    (useOrderbookWorker as Mock).mockReturnValue({
      result: mockResult,
      post: mockPost,
    });
    mockPost.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  it('returns result and triggerUpdate', () => {
    const { result } = renderHook(() => useOrderbookRafUpdater(getData, 0.5));
    expect(result.current.result).toBe(mockResult);
    expect(typeof result.current.triggerUpdate).toBe('function');
  });

  it('triggerUpdate calls post with correct arguments on next animation frame', () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useOrderbookRafUpdater(getData, 0.5));
    act(() => {
      result.current.triggerUpdate();
    });
    expect(mockPost).not.toHaveBeenCalled();
    vi.runAllTimers();
    expect(mockPost).toHaveBeenCalledWith([['1', '2']], [['3', '4']], 0.5);
    vi.useRealTimers();
  });

  it('triggerUpdate does not schedule multiple frames if called repeatedly before frame', () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useOrderbookRafUpdater(getData, 0.5));
    act(() => {
      result.current.triggerUpdate();
      result.current.triggerUpdate();
      result.current.triggerUpdate();
    });
    vi.runAllTimers();
    expect(mockPost).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });

  it('triggerUpdate can be called again after frame is executed', () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useOrderbookRafUpdater(getData, 0.5));
    act(() => {
      result.current.triggerUpdate();
    });
    vi.runAllTimers();
    expect(mockPost).toHaveBeenCalledTimes(1);

    act(() => {
      result.current.triggerUpdate();
    });
    vi.runAllTimers();
    expect(mockPost).toHaveBeenCalledTimes(2);
    vi.useRealTimers();
  });

  it('triggerUpdate uses latest getData and tickSize', () => {
    vi.useFakeTimers();
    let tickSize = 0.5;
    let bids: Level[] = [['1', '2']];
    let asks: Level[] = [['3', '4']];
    const getDataFn = () => ({ bids, asks });

    const { result, rerender } = renderHook(({ getData, tickSize }) => useOrderbookRafUpdater(getData, tickSize), {
      initialProps: { getData: getDataFn, tickSize },
    });

    act(() => {
      result.current.triggerUpdate();
    });
    vi.runAllTimers();
    expect(mockPost).toHaveBeenCalledWith([['1', '2']], [['3', '4']], 0.5);

    // Change data and tickSize
    bids = [['5', '6']];
    asks = [['7', '8']];
    tickSize = 1;
    rerender({ getData: getDataFn, tickSize });

    act(() => {
      result.current.triggerUpdate();
    });
    vi.runAllTimers();
    expect(mockPost).toHaveBeenCalledWith([['5', '6']], [['7', '8']], 1);
    vi.useRealTimers();
  });
});
