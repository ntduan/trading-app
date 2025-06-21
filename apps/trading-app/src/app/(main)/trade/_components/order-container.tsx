'use client';

import { SnackbarProvider } from 'notistack';
import { useState } from 'react';

import { LimitOrder } from '@/components/limit-order/limit-order';
import { TabsUnderline } from '@/components/tabs-underline/tabs-underline';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

export const OrderContainer = () => {
  const [activeTab, setActiveTab] = useState('Spot');
  const [loadedTabs, setLoadedTabs] = useState(new Set(['Spot']));

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setLoadedTabs((prev) => new Set([...prev, value]));
  };

  return (
    <>
      <SnackbarProvider />
      <Card className="gap-0 py-0">
        <div>
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList>
              <TabsTrigger value="Spot">Spot</TabsTrigger>
              <TabsUnderline />
            </TabsList>
          </Tabs>
        </div>
        <div className="relative h-full">
          <div className={cn('h-full', `${activeTab === 'Spot' ? 'block' : 'hidden'}`)}>
            {loadedTabs.has('Spot') && <LimitOrder bestAsk={100} bestBid={90} />}
          </div>
        </div>
      </Card>
    </>
  );
};
