'use client';
import { SnackbarProvider } from 'notistack';

import { useState } from 'react';

import { Orders } from '@/components/orders/orders';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

export const HistoryContainer = ({ className }: { className: string }) => {
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
      <Card className={cn('gap-0 py-0', className)}>
        <div>
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList>
              <TabsTrigger value="Orders">Orders</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className="relative h-full">
          <div className={cn('h-full', `${activeTab === 'Orders' ? 'block' : 'hidden'}`)}>
            {loadedTabs.has('Orders') && <Orders />}
          </div>
        </div>
      </Card>
    </>
  );
};
