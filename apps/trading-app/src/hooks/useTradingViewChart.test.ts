import { act, renderHook } from '@testing-library/react';
import { widget } from 'tv-charting-library';
import { afterEach, beforeEach, describe, expect, it, vi, type Mock } from 'vitest';

import { getOverrides, useTradingViewChart } from './useTradingViewChart';

import { useActiveTradingPairInfo } from '@/hooks/useActiveTradingPairInfo';

// Mocks
vi.mock('next-themes', () => ({
  useTheme: () => ({ theme: 'dark' }),
}));
vi.mock('@/hooks/useActiveTradingPairInfo');
vi.mock('@/hooks/useExchangeAdapter', () => ({
  useExchangeAdapter: () => ({ adapter: {} }),
}));
vi.mock('@/hooks/useIsDesktop', () => ({
  useIsDesktop: () => true,
}));
const onChartReadyMock = vi.fn();
const createStudyMock = vi.fn();
const onDataLoadedSubscribeMock = vi.fn();
const onDataLoadedMock = vi.fn(() => ({
  subscribe: onDataLoadedSubscribeMock,
}));
const activeChartMock = vi.fn(() => ({
  createStudy: createStudyMock,
  onDataLoaded: onDataLoadedMock,
  resolution: () => '1',
}));
const setSymbolMock = vi.fn((symbol, resolution, cb) => cb && cb());
const subscribeMock = vi.fn();
const getThemeMock = vi.fn(() => 'dark');
const chartWidgetMock = {
  onChartReady: onChartReadyMock,
  activeChart: activeChartMock,
  setSymbol: setSymbolMock,
  subscribe: subscribeMock,
  getTheme: getThemeMock,
};
vi.mock('tv-charting-library', () => ({
  widget: vi.fn(() => chartWidgetMock),
}));

vi.mock('@/lib/data-feed', () => ({
  Datafeed: vi.fn().mockImplementation(() => ({})),
}));

// Helper to reset mocks
function resetMocks() {
  onChartReadyMock.mockReset();
  createStudyMock.mockReset();
  onDataLoadedSubscribeMock.mockReset();
  onDataLoadedMock.mockReset();
  activeChartMock.mockReset().mockReturnValue({
    createStudy: createStudyMock,
    onDataLoaded: onDataLoadedMock,
    resolution: () => '1',
  });
  setSymbolMock.mockReset();
  subscribeMock.mockReset();
  getThemeMock.mockReset().mockReturnValue('dark');
}

describe('useTradingViewChart', () => {
  beforeEach(() => {
    resetMocks();
    (useActiveTradingPairInfo as Mock).mockReturnValue({ data: { symbol: 'BTCUSD' }, isLoading: false, error: null });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with correct defaults', () => {
    const { result } = renderHook(() => useTradingViewChart());
    expect(result.current.ready).toBe(false);
    expect(result.current.widget).toBe(chartWidgetMock);
    expect(result.current.symbol).toBe('BTCUSD');
  });

  it('should create widget on mount', () => {
    renderHook(() => useTradingViewChart());
    expect(chartWidgetMock).toBeDefined();
  });

  it('should not create widget if no activeSymbol', () => {
    (useActiveTradingPairInfo as Mock).mockReturnValueOnce({ data: null, isLoading: false, error: null });
    renderHook(() => useTradingViewChart());
    expect(widget).not.toHaveBeenCalled();
  });

  it('should not recreate widget if chartWidget exists and theme matches', () => {
    getThemeMock.mockReturnValue('dark');
    const { result, rerender } = renderHook(() => useTradingViewChart());
    rerender();
    expect(widget).toHaveBeenCalledTimes(1);
  });

  it('should set isChartReady and isDataLoaded when chart is ready and data loaded', () => {
    let chartReadyCallback: () => void = () => {};
    onChartReadyMock.mockImplementation((cb) => {
      chartReadyCallback = cb;
    });
    let dataLoadedCallback: () => void = () => {};
    onDataLoadedSubscribeMock.mockImplementation((_, cb) => {
      dataLoadedCallback = cb;
    });

    const { result } = renderHook(() => useTradingViewChart());
    // Simulate chart ready
    act(() => {
      chartReadyCallback();
    });
    expect(result.current.ready).toBe(false);
    expect(createStudyMock).toHaveBeenCalledWith('Moving Average Exponential', false, false, { length: 9 }, undefined);

    // Simulate data loaded
    act(() => {
      dataLoadedCallback();
    });
    expect(result.current.ready).toBe(true);
  });

  it('should subscribe to chart_loaded event', () => {
    renderHook(() => useTradingViewChart());
    expect(subscribeMock).toHaveBeenCalledWith('chart_loaded', expect.any(Function));
  });

  it('should set symbol when activeSymbol changes and chart is ready', () => {
    let chartReadyCallback: () => void = () => {};
    onChartReadyMock.mockImplementation((cb) => {
      chartReadyCallback = cb;
    });
    let dataLoadedCallback: () => void = () => {};
    onDataLoadedSubscribeMock.mockImplementation((_, cb) => {
      dataLoadedCallback = cb;
    });

    const { result, rerender } = renderHook(() => useTradingViewChart());
    // Simulate chart ready and data loaded
    act(() => {
      chartReadyCallback();
      dataLoadedCallback();
    });

    // Simulate activeSymbol change
    (useActiveTradingPairInfo as Mock).mockReturnValueOnce({
      data: {
        symbol: 'ETHUSD',
        baseAsset: 'ETH',
        quoteAsset: 'USD',
        logoUrl: '',
        description: '',
      },
      isLoading: false,
      error: null,
    });
    rerender();
    expect(setSymbolMock).toHaveBeenCalled();
  });

  it('should not set symbol if chart is not ready', () => {
    const { rerender } = renderHook(() => useTradingViewChart());
    vi.mocked(useActiveTradingPairInfo).mockReturnValueOnce({
      data: {
        symbol: 'ETHUSD',
        baseAsset: 'ETH',
        quoteAsset: 'USD',
        logoUrl: '',
        description: '',
      },
      isLoading: false,
      error: null,
    });
    rerender();
    expect(setSymbolMock).not.toHaveBeenCalled();
  });

  it('should call getOverrides with correct theme', () => {
    expect(getOverrides('dark')).toEqual({
      'paneProperties.background': '#0f1a1f',
      'paneProperties.backgroundType': 'solid',
      'mainSeriesProperties.candleStyle.upColor': '#26a69a',
      'mainSeriesProperties.candleStyle.downColor': '#ef5350',
      'mainSeriesProperties.candleStyle.borderUpColor': '#26a69a',
      'mainSeriesProperties.candleStyle.borderDownColor': '#ef5350',
    });
    expect(getOverrides('light')).toBeUndefined();
  });
});
