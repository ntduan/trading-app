'use client';
import { useEffect, useRef } from 'react';

import { useTradingViewChart } from '@/hooks/useTradingViewChart';

export default function TradingViewContainer() {
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useTradingViewChart();

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const iframe = chartContainerRef.current?.querySelector('iframe');
      if (iframe) {
        iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin');
        observer.disconnect();
      }
    });

    if (chartContainerRef.current) {
      observer.observe(chartContainerRef.current, {
        childList: true,
        subtree: true,
      });
    }
  }, []);

  return (
    <div
      ref={chartContainerRef}
      id="tv_chart_container"
      className="bg-card"
      style={{
        width: '100%',
        height: '500px',
        position: 'relative',
      }}
    />
  );
}
