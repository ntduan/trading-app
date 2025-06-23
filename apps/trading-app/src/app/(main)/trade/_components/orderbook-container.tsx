'use client';

import { useState } from 'react';

import { Orderbook } from '@/components/orderbook/orderbook';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

export const OrderbookContainer = ({ className }: { className?: string }) => {
  const [activeTab, setActiveTab] = useState('Orderbook');
  const [loadedTabs, setLoadedTabs] = useState(new Set(['Orderbook']));

  /* v8 ignore next 4 */
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setLoadedTabs((prev) => new Set([...prev, value]));
  };

  return (
    <Card className={cn('gap-0 py-0', className)}>
      <div>
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList>
            <TabsTrigger value="Orderbook">Order Book</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <div className="relative">
        <div className={`${/* v8 ignore next line */ activeTab === 'Orderbook' ? 'block' : 'hidden'}`}>
          {loadedTabs.has('Orderbook') && <Orderbook />}
        </div>
      </div>
    </Card>
  );
};
