'use client';

import { lazy, Suspense, useState } from 'react';

import { TabsUnderline } from '@/components/tabs-underline/tabs-underline';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

const TradingViewContainer = lazy(() => import('@/components/tradingview-chart/tradingview-container'));

export const ChartContainer = () => {
  const [activeTab, setActiveTab] = useState('Chart');
  const [loadedTabs, setLoadedTabs] = useState(new Set(['Chart']));

  /* v8 ignore next 4 */
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setLoadedTabs((prev) => new Set([...prev, value]));
  };

  return (
    <Card className="gap-0 py-0 overflow-hidden min-h-[420px]">
      <div>
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList>
            <TabsTrigger value="Chart">Chart</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <div className="relative h-full">
        <div className={cn('h-full', /* v8 ignore next line */ activeTab === 'Chart' ? 'block' : 'hidden')}>
          {loadedTabs.has('Chart') && (
            <Suspense>
              <TradingViewContainer />
            </Suspense>
          )}
        </div>
      </div>
    </Card>
  );
};
