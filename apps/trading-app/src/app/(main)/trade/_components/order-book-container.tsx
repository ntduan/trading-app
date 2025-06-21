'use client';

import { useState } from 'react';

import { OrderBook } from '@/components/order-book/order-book';
import { TabsUnderline } from '@/components/tabs-underline/tabs-underline';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

export const OrderBookContainer = ({ className }: { className?: string }) => {
  const [activeTab, setActiveTab] = useState('OrderBook');
  const [loadedTabs, setLoadedTabs] = useState(new Set(['OrderBook']));

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setLoadedTabs((prev) => new Set([...prev, value]));
  };

  return (
    <Card className={cn('gap-0 py-0', className)}>
      <div>
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList>
            <TabsTrigger value="OrderBook">Order Book</TabsTrigger>
            <TabsUnderline />
          </TabsList>
        </Tabs>
      </div>
      <div className="relative">
        <div className={`${activeTab === 'OrderBook' ? 'block' : 'hidden'}`}>
          {loadedTabs.has('OrderBook') && <OrderBook />}
        </div>
      </div>
    </Card>
  );
};
