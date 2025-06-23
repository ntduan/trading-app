'use client';
import { SnackbarProvider } from 'notistack';

import { useState } from 'react';

import { Orders } from '@/components/orders/orders';
import { Positions } from '@/components/positions/positions';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

export const HistoryContainer = () => {
  const [activeTab, setActiveTab] = useState('Orders');
  const [loadedTabs, setLoadedTabs] = useState(new Set(['Orders']));

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setLoadedTabs((prev) => new Set([...prev, value]));
  };

  return (
    <>
      <SnackbarProvider
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      />
      <Card className="gap-0 py-0">
        <div>
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList>
              <TabsTrigger value="Orders">Orders</TabsTrigger>
              <TabsTrigger value="Positions">Positions</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className="relative h-full">
          <div className={cn('h-full', `${activeTab === 'Orders' ? 'block' : 'hidden'}`)}>
            {loadedTabs.has('Orders') && <Orders />}
          </div>
          <div className={cn('h-full', `${activeTab === 'Positions' ? 'block' : 'hidden'}`)}>
            {loadedTabs.has('Positions') && <Positions />}
          </div>
        </div>
      </Card>
    </>
  );
};
