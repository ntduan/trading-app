import { useAtomValue } from 'jotai';
import { useTheme } from 'next-themes';

import { useEffect, useState } from 'react';
import {
  type IChartingLibraryWidget,
  type ResolutionString,
  type ThemeName,
  type Timezone,
  widget as Widget,
} from 'tv-charting-library';

import { activeTradingPairSymbolAtom } from './../state/atoms';

import { useExchangeAdapter } from './useExchangeAdapter';
import { useIsDesktop } from './useIsDesktop';

import { Datafeed } from '@/lib/data-feed';

export const getOverrides = (theme: ThemeName) => {
  return theme === 'dark'
    ? {
        'paneProperties.background': '#0f1a1f',
        'paneProperties.backgroundType': 'solid',
        'mainSeriesProperties.candleStyle.upColor': '#26a69a',
        'mainSeriesProperties.candleStyle.downColor': '#ef5350',
        'mainSeriesProperties.candleStyle.borderUpColor': '#26a69a',
        'mainSeriesProperties.candleStyle.borderDownColor': '#ef5350',
      }
    : undefined;
};

export function useTradingViewChart() {
  const isDesktop = useIsDesktop();
  const { theme } = useTheme();
  const activeSymbol = useAtomValue(activeTradingPairSymbolAtom);
  const { adapter } = useExchangeAdapter();
  const [datafeed] = useState(() => new Datafeed(adapter));

  const [isChartReady, setIsChartReady] = useState(false); // TV widget initialized
  const [isDataLoaded, setIsDataLoaded] = useState(false); // Chart data loaded
  const [chartWidget, setChartWidget] = useState<IChartingLibraryWidget | null>(null);

  // Create TradingView widget
  useEffect(() => {
    if (chartWidget) {
      if (!isChartReady) return;
      if (chartWidget.getTheme() === theme) return;
    }

    if (!activeSymbol) return;

    setIsChartReady(false);
    setIsDataLoaded(false);

    console.log('[useTradingViewChart] Create widget', activeSymbol, performance.now());
    const widget = new Widget({
      locale: 'en',
      symbol: activeSymbol,
      interval: '1' as ResolutionString,
      container: 'tv_chart_container',
      datafeed: datafeed,
      library_path: '/charting_library/',
      theme: theme as ThemeName,
      custom_css_url: '/tv-themed.css',
      disabled_features: [
        'use_localstorage_for_settings',
        'header_symbol_search',
        'allow_arbitrary_symbol_search_input',
        'header_quick_search',
        'symbol_search_hot_key',
        'header_settings',
        'header_undo_redo',
        'header_screenshot',
        'header_fullscreen_button',
        'volume_force_overlay',
        'header_compare',
      ],
      enabled_features: ['iframe_loading_compatibility_mode'],
      autosize: true,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone as Timezone,
      numeric_formatting: {
        grouping_separator: ',',
        decimal_sign: (1.1).toLocaleString('en-US').substring(1, 2),
      },
      auto_save_delay: 1,
      overrides: getOverrides(theme as ThemeName),
    });

    setChartWidget(widget);
  }, [chartWidget, isDesktop, theme, isChartReady, datafeed, activeSymbol]);

  useEffect(() => {
    if (!chartWidget || isChartReady) return;

    chartWidget.onChartReady(() => {
      setIsChartReady(true);

      chartWidget.activeChart().createStudy('Moving Average Exponential', false, false, { length: 9 }, undefined);

      chartWidget
        .activeChart()
        .onDataLoaded()
        .subscribe(null, () => setIsDataLoaded(true));
    });

    chartWidget.subscribe('chart_loaded', () => setIsChartReady(true));
  }, [chartWidget, isChartReady]);

  // Update TradingView symbol when activeCoin changes
  useEffect(() => {
    if (!isChartReady || !chartWidget || !activeSymbol) return;
    chartWidget.setSymbol(activeSymbol, chartWidget.activeChart().resolution(), () => {
      console.log('[useTVChart] Set symbol callback', activeSymbol);
    });
  }, [activeSymbol, isChartReady, chartWidget]);

  return {
    ready: isChartReady && isDataLoaded,
    widget: chartWidget,
    symbol: activeSymbol,
  };
}
