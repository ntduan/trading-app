'use client';

import { useState } from 'react';

import { TabsUnderline } from '@/components/tabs-underline/tabs-underline';
import { TradeTicket } from '@/components/trade-ticket/trade-ticket';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const OrderContainer = () => {
  const [activeTab, setActiveTab] = useState('Market');
  const [loadedTabs, setLoadedTabs] = useState(new Set(['Market']));

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setLoadedTabs((prev) => new Set([...prev, value]));
  };

  return (
    <Card className="gap-0 py-0">
      <div>
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList>
            <TabsTrigger value="Market">Market</TabsTrigger>
            <TabsUnderline />
          </TabsList>
        </Tabs>
      </div>
      <div className="relative">
        <div className={`${activeTab === 'Market' ? 'block' : 'hidden'}`}>
          {loadedTabs.has('Market') && <TradeTicket bestAsk={100} bestBid={90} />}
        </div>
      </div>
    </Card>
  );
};
