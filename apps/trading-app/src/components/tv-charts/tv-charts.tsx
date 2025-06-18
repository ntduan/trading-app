'use client';
import Script from 'next/script';
import * as React from 'react';
import { useEffect, useRef } from 'react';

import { widget, type ResolutionString } from 'tv-charting-library';

import { datafeed } from '@/components/tv-charts/data/BinanceDataFeed';

export const TVChartContainer = () => {
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tvWidget = new widget({
      symbol: 'BTC/USDT',
      interval: '1' as ResolutionString,
      container: chartContainerRef.current!,
      library_path: '/charting_library/',
      datafeed: datafeed,
      locale: 'en',
      disabled_features: [
        'header_symbol_search',
        'header_settings',
        'header_undo_redo',
        'header_screenshot',
        'header_fullscreen_button',
        'volume_force_overlay',
        'header_compare',
        'header_saveload',
      ],
      enabled_features: ['study_templates'],
      theme: 'dark',
      studies_overrides: {},
    });

    return () => {
      console.log('Cleaning up tradingview chart');
      tvWidget.remove();
    };
  }, []);

  return (
    <>
      {/* <Script
        src="/charting_library.js"
        strategy="lazyOnload"
        onLoad={() => {
          console.log('TradingView charting library loaded');
          // console.log((TradingView as any).widget);
        }}
      /> */}
      <div ref={chartContainerRef} className={'TVChartContainer'} />
    </>
  );
};
