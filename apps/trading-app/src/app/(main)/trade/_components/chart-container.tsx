'use client';

import { lazy, Suspense, useState } from 'react';

import { TabsUnderline } from '@/components/tabs-underline/tabs-underline';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const TradingViewContainer = lazy(() => import('@/components/tradingview-chart/tradingview-container'));

export const ChartContainer = () => {
  const [activeTab, setActiveTab] = useState('Chart');
  const [loadedTabs, setLoadedTabs] = useState(new Set(['Chart']));

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setLoadedTabs((prev) => new Set([...prev, value]));
  };

  return (
    <Card className="gap-0 py-0 overflow-hidden">
      <div>
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList>
            <TabsTrigger value="Chart">Chart</TabsTrigger>
            <TabsUnderline />
          </TabsList>
        </Tabs>
      </div>
      <div className="relative">
        <div className={`${activeTab === 'Chart' ? 'block' : 'hidden'}`}>
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
